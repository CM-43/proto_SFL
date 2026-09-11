/* ==========================================================================
   SUSTAINABLE FUTURES LAB — THE RULES

   Everything that decides a score lives here, and nothing here touches the
   page. The screens (js/app.js) call these functions and only draw the
   results. Every number used (points, weights, the percentile table) comes
   from the content file, so changing how the game is marked is a content
   edit, not a code edit.

   HOW A RUN IS RECORDED (built by js/app.js, read here)
     run.onboarding.order        ids of the clarifying questions, in the
                                 order the candidate ranked them
     run.days[i].asked           [{ target: 'person'|'station', id, q }]
     run.days[i].assignment      { personId: stationId } at the end of Assign
     run.days[i].reasons         { personId: reasonId } last reason given
     run.days[i].support         { supportId: optionId }
     run.days[i].reflect         { reflectId: optionId }
     run.days[i].late            { key: true } answers given after time ran out
                                 ('assign' = Continue on Assign pressed late)
     run.late                    { onboarding: true } the same, for Onboarding
   ========================================================================== */
var MARKING = (function () {

  function byId(list, id) {
    for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function dayRunOf(run, index) {
    return (run.days && run.days[index]) || { asked: [], assignment: {}, reasons: {}, support: {}, reflect: {} };
  }

  /* ---- Is a person on one of their good-fit stations? -------------------
     Uses the assignment at the END of Assign. Before Assign has happened
     (or on a day without an Assign phase) the starting positions count. */
  function currentStation(day, dayRun, personId) {
    /* null means "not placed" (bumped off a station in Assign), which must not
       fall back to the starting station. */
    if (dayRun.assignment && Object.prototype.hasOwnProperty.call(dayRun.assignment, personId)) return dayRun.assignment[personId] || null;
    return day.start_assignment ? day.start_assignment[personId] : null;
  }
  function isMatched(day, dayRun, personId) {
    var person = byId(day.people, personId);
    if (!person) return true;
    var good = person.good_stations || [];
    return good.indexOf(currentStation(day, dayRun, personId)) >= 0;
  }

  /* ---- Version A / version B ---------------------------------------------
     A Support or Reflect item may carry `when_mismatched`: fields that
     replace the normal ones when its person is NOT on a good-fit station. */
  function resolveItem(day, dayRun, item) {
    if (!item || !item.when_mismatched || !item.person) return item;
    if (isMatched(day, dayRun, item.person)) return item;
    var merged = {};
    var k;
    for (k in item) if (k !== 'when_mismatched') merged[k] = item[k];
    for (k in item.when_mismatched) merged[k] = item.when_mismatched[k];
    merged.is_mismatched_version = true;
    return merged;
  }

  /* ---- Did the candidate learn a given fact in Explore? ------------------ */
  function hasAsked(dayRun, target, id, questionIds) {
    var asked = dayRun.asked || [];
    for (var i = 0; i < asked.length; i++) {
      if (asked[i].target === target && asked[i].id === id &&
          (!questionIds || !questionIds.length || questionIds.indexOf(asked[i].q) >= 0)) return true;
    }
    return false;
  }

  /* A reason is "consistent" when the candidate actually knew what the reason
     claims. Each reason in the content lists what it needs, e.g. Employee
     preference needs the person to have been asked "want". A reason that
     needs nothing (Coverage) is always consistent. */
  function reasonConsistent(content, dayRun, personId, stationId, reasonId) {
    var reason = byId(content.rules.reasons, reasonId);
    if (!reason) return false;
    var needs = reason.needs || [];
    if (!needs.length) return true;
    for (var i = 0; i < needs.length; i++) {
      var n = needs[i];
      var id = n.target === 'person' ? personId : stationId;
      if (hasAsked(dayRun, n.target, id, n.questions)) return true;
    }
    return false;
  }

  function points(n) { return Math.round(n * 100) / 100; }

  /* ======================================================================
     1. ONBOARDING — the ranking against our recommended order.
        scoring.onboarding.points_by_distance[d] = points for a question
        placed d places away from our position.
     ====================================================================== */
  function markOnboarding(content, run) {
    var ob = content.onboarding;
    var table = content.scoring.onboarding.points_by_distance;
    var order = (run.onboarding && run.onboarding.order) || [];
    var items = [], score = 0, of = 0;
    for (var i = 0; i < ob.questions.length; i++) {
      var q = ob.questions[i];
      var yourPos = order.indexOf(q.id) + 1;
      var dist = yourPos > 0 ? Math.abs(yourPos - q.recommended_position) : 99;
      var p = dist < table.length ? table[dist] : 0;
      var best = table[0];
      score += p; of += best;
      items.push({ question: q, yourPosition: yourPos, recommended: q.recommended_position,
                   points: p, of: best, late: !!(run.late && run.late.onboarding) });
    }
    return { score: points(score), of: points(of), items: items };
  }

  /* ======================================================================
     2. EXPLORE — was each question spent on something worth knowing?
        The content marks every answer `useful: true/false`. Score = useful
        questions asked, out of the day's explore points.
     ====================================================================== */
  function markExplore(content, day, dayRun) {
    var sc = content.scoring.explore;
    var budget = day.explore_points || 0;
    var items = [], score = 0;
    var asked = dayRun.asked || [];
    for (var i = 0; i < asked.length; i++) {
      var a = asked[i];
      var who = a.target === 'person' ? byId(day.people, a.id) : byId(day.stations, a.id);
      var ans = who && who.answers ? who.answers[a.q] : null;
      var useful = !!(ans && ans.useful);
      var p = useful ? sc.points_useful : sc.points_not_useful;
      score += p;
      items.push({ asked: a, who: who, answer: ans, useful: useful, points: p, of: sc.points_useful,
                   late: !!(run_late(dayRun, 'explore-' + i)) });
    }
    var of = budget * sc.points_useful;
    return { score: points(Math.min(score, of)), of: points(of), items: items,
             unspent: Math.max(0, budget - asked.length) };
  }
  function run_late(dayRun, key) { return dayRun.late && dayRun.late[key]; }

  /* ======================================================================
     3. ASSIGN — right station, and an honest reason.
        Per person: placement_points if on a good-fit station, plus
        reason_points if the reason given matches what they knew. A person
        who was never asked for a reason (left in place) gets the reason
        points when their placement is good, so nobody loses marks for a
        pop-up the game never showed.
     ====================================================================== */
  function markAssign(content, day, dayRun) {
    var sc = content.scoring.assign;
    var items = [], score = 0, of = 0;
    for (var i = 0; i < day.people.length; i++) {
      var person = day.people[i];
      var st = currentStation(day, dayRun, person.id);
      var good = (person.good_stations || []).indexOf(st) >= 0;
      var reasonId = dayRun.reasons ? dayRun.reasons[person.id] : null;
      var consistent = reasonId ? reasonConsistent(content, dayRun, person.id, st, reasonId) : null;
      var pPlace = good ? sc.placement_points : 0;
      var pReason = reasonId ? (consistent ? sc.reason_points : 0) : (good ? sc.reason_points : 0);
      score += pPlace + pReason;
      of += sc.placement_points + sc.reason_points;
      items.push({ person: person, station: byId(day.stations, st), goodStations: person.good_stations,
                   good: good, reason: byId(content.rules.reasons, reasonId), consistent: consistent,
                   points: pPlace + pReason, of: sc.placement_points + sc.reason_points,
                   late: !!run_late(dayRun, 'assign') });
    }
    return { score: points(score), of: points(of), items: items };
  }

  /* ======================================================================
     4. SUPPORT — only clearly weak options lose marks.
        Each option has a tier: recommended, acceptable or weak.
        scoring.support.tier_points gives the points for each tier.
     ====================================================================== */
  function markSupport(content, day, dayRun) {
    var tiers = content.scoring.support.tier_points;
    var items = [], score = 0, of = 0;
    var list = day.support || [];
    for (var i = 0; i < list.length; i++) {
      var item = resolveItem(day, dayRun, list[i]);
      var chosenId = dayRun.support ? dayRun.support[item.id] : null;
      var chosen = byId(item.options, chosenId);
      var p = chosen ? (tiers[chosen.tier] || 0) : 0;
      var recommended = null;
      for (var j = 0; j < item.options.length; j++) if (item.options[j].tier === 'recommended') recommended = item.options[j];
      score += p; of += tiers.recommended;
      items.push({ item: item, person: byId(day.people, item.person), chosen: chosen, recommended: recommended,
                   points: p, of: tiers.recommended, late: !!run_late(dayRun, 'support-' + item.id) });
    }
    return { score: points(score), of: points(of), items: items };
  }

  /* ======================================================================
     5. REFLECT — the rating against what actually happened.
        An item's correct option is, in order of precedence:
          · "unknowable": true  -> the "I don't know" option
          · "truth_from_support" -> depends on the tier of the option the
            candidate chose in that Support question
          · "truth"             -> a fixed option id
        (after the version-B override when the person is mismatched).
     ====================================================================== */
  function reflectTruth(content, day, dayRun, item) {
    var idk = content.rules.reflect_idk_option_id;
    if (item.unknowable) return idk;
    if (item.truth_from_support) {
      var map = item.truth_from_support;
      var sItem = resolveItem(day, dayRun, byId(day.support, map.support));
      var chosen = sItem ? byId(sItem.options, dayRun.support ? dayRun.support[sItem.id] : null) : null;
      if (chosen && map.by_option && map.by_option[chosen.id]) return map.by_option[chosen.id];
      var key = chosen ? chosen.tier : 'not_answered';
      if (map[key]) return map[key];
    }
    return item.truth;
  }

  function reflectOptions(content, item) {
    return item.options && item.options.length ? item.options : content.rules.reflect_default_options;
  }

  function markReflect(content, day, dayRun) {
    var sc = content.scoring.reflect;
    var idk = content.rules.reflect_idk_option_id;
    var items = [], score = 0, of = 0;
    var list = day.reflect || [];
    for (var i = 0; i < list.length; i++) {
      var item = resolveItem(day, dayRun, list[i]);
      var truth = reflectTruth(content, day, dayRun, item);
      var chosenId = dayRun.reflect ? dayRun.reflect[item.id] : null;
      var p = 0;
      if (chosenId && chosenId === truth) p = sc.points_correct;
      else if (chosenId === idk) p = sc.points_idk_when_known;
      score += p; of += sc.points_correct;
      var opts = reflectOptions(content, item);
      items.push({ item: item, person: byId(day.people, item.person), chosen: byId(opts, chosenId),
                   truth: byId(opts, truth), points: p, of: sc.points_correct,
                   late: !!run_late(dayRun, 'reflect-' + item.id) });
    }
    return { score: points(score), of: points(of), items: items };
  }

  /* ======================================================================
     6. THE WHOLE RUN, AND WHERE THE CANDIDATE STANDS
     ====================================================================== */
  var PHASES = ['onboarding', 'explore', 'assign', 'support', 'reflect'];

  function markRun(content, run) {
    var out = { onboarding: markOnboarding(content, run), days: [] };
    var totals = { explore: [0, 0], assign: [0, 0], support: [0, 0], reflect: [0, 0] };
    for (var d = 0; d < content.days.length; d++) {
      var day = content.days[d];
      var dr = dayRunOf(run, d);
      var has = function (ph) { return (day.phases || []).indexOf(ph) >= 0; };
      var r = {
        explore: has('explore') ? markExplore(content, day, dr) : null,
        assign: has('assign') ? markAssign(content, day, dr) : null,
        support: has('support') ? markSupport(content, day, dr) : null,
        reflect: has('reflect') ? markReflect(content, day, dr) : null
      };
      for (var k in totals) if (r[k]) { totals[k][0] += r[k].score; totals[k][1] += r[k].of; }
      out.days.push(r);
    }
    out.phaseTotals = {
      onboarding: { score: out.onboarding.score, of: out.onboarding.of },
      explore: { score: points(totals.explore[0]), of: points(totals.explore[1]) },
      assign: { score: points(totals.assign[0]), of: points(totals.assign[1]) },
      support: { score: points(totals.support[0]), of: points(totals.support[1]) },
      reflect: { score: points(totals.reflect[0]), of: points(totals.reflect[1]) }
    };

    var bench = content.benchmark;
    if (bench) {
      out.weighted = weightedScore(out.phaseTotals, bench.phase_weights);
      out.percentile = percentile(out.weighted, bench);
      out.decile = decileOf(out.percentile);
      out.topShare = 100 - out.percentile;
      out.zone = zoneOf(out.percentile, bench.zones);
    } else {
      out.weighted = out.percentile = out.decile = out.topShare = out.zone = null;
    }
    return out;
  }

  /* The weighted score out of 100, to one decimal place.
       weighted = 100 x sum(weight x score/of) / sum(weight)
     over the phases that exist in this content. Dividing by the weights
     actually used keeps the score out of 100 even if, say, a content file
     has no Reflect phase at all. */
  function weightedScore(totals, weights) {
    var sum = 0, wsum = 0;
    for (var i = 0; i < PHASES.length; i++) {
      var t = totals[PHASES[i]];
      var w = weights && typeof weights[PHASES[i]] === 'number' ? weights[PHASES[i]] : 0;
      if (!t || !(t.of > 0) || !w) continue;
      sum += w * (t.score / t.of);
      wsum += w;
    }
    if (!wsum) return 0;
    return Math.round((100 * sum / wsum) * 10 + 1e-9) / 10;
  }

  /* Copied from Redrock's marking.js so every product reads the shared
     percentile table the same way: straight line between points, rounded,
     kept between 1 and 99. */
  function percentile(weighted, benchmark) {
    var pts = (benchmark && benchmark.percentiles) || [];
    if (!pts.length || typeof weighted !== 'number' || !isFinite(weighted)) return null;
    var value;
    if (weighted <= pts[0][0]) {
      value = pts[0][1];
    } else if (weighted >= pts[pts.length - 1][0]) {
      value = pts[pts.length - 1][1];
    } else {
      value = pts[pts.length - 1][1];
      for (var i = 1; i < pts.length; i++) {
        if (weighted <= pts[i][0]) {
          var x0 = pts[i - 1][0], y0 = pts[i - 1][1], x1 = pts[i][0], y1 = pts[i][1];
          value = (x1 === x0) ? y1 : y0 + (y1 - y0) * (weighted - x0) / (x1 - x0);
          break;
        }
      }
    }
    var whole = Math.floor(value + 0.5 + 1e-9);
    return Math.max(1, Math.min(99, whole));
  }

  function decileOf(p) {
    if (typeof p !== 'number') return null;
    return Math.max(1, Math.min(10, Math.ceil(p / 10)));
  }

  function zoneOf(p, zones) {
    if (typeof p !== 'number' || !zones || !zones.length) return null;
    var found = null;
    for (var i = 0; i < zones.length; i++) {
      if (zones[i].from <= p) found = { index: i, from: zones[i].from, label: zones[i].label };
    }
    return found;
  }

  return {
    byId: byId,
    currentStation: currentStation,
    isMatched: isMatched,
    resolveItem: resolveItem,
    hasAsked: hasAsked,
    reasonConsistent: reasonConsistent,
    reflectOptions: reflectOptions,
    markRun: markRun,
    weightedScore: weightedScore,
    percentile: percentile,
    decileOf: decileOf,
    zoneOf: zoneOf,
    PHASES: PHASES
  };
})();
