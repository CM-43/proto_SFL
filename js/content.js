/* ==========================================================================
   LOADING AND CHECKING THE CONTENT FILE

   The content lives in data/<name>/content.js as one object, SFL_CONTENT.
   This file loads it and checks it BEFORE the simulation starts. If anything
   is wrong, the simulation does not start: it shows a plain-English list of
   what to fix instead. A half-working simulation in front of a customer is
   worse than a clear error in front of us.
   ========================================================================== */
var CONTENT = (function () {

  var syntaxErrors = [];
  window.addEventListener('error', function (e) {
    if (e && e.filename && /\/data\/[^\/]+\/content\.js/.test(e.filename)) {
      syntaxErrors.push({ line: e.lineno, message: e.message });
    } else if (e && e.message === 'Script error.' && window.__sflLoadingContent) {
      /* Opened straight from the computer (file://): the browser hides the
         line number for security reasons. */
      syntaxErrors.push({ line: 0, message: '' });
    }
  });

  function nameFromUrl(search, fallback) {
    var m = /[?&]content=([a-z0-9-]+)/i.exec(search || '');
    return m ? m[1] : fallback;
  }

  function load(name) {
    return new Promise(function (resolve) {
      var path = 'data/' + name + '/content.js';
      syntaxErrors = [];
      try { delete window.SFL_CONTENT; } catch (e) { window.SFL_CONTENT = undefined; }
      window.__sflLoadingContent = true;
      var s = document.createElement('script');
      s.src = path;
      s.onload = function () {
        window.__sflLoadingContent = false;
        if (syntaxErrors.length) {
          var se = syntaxErrors[0];
          resolve({ ok: false, errors: [
            se.line
              ? 'There is a typing mistake in ' + path + ' near line ' + se.line + ' (' + se.message + '). ' +
                'Usually it is a missing comma at the end of the line before, a missing quote mark, or a missing bracket.'
              : 'There is a typing mistake in ' + path + '. The browser will not say which line when the page is opened ' +
                'straight from your computer. Open it from the GitHub Pages address to see the line number, or undo your last change.'
          ] });
          return;
        }
        if (!window.SFL_CONTENT || typeof window.SFL_CONTENT !== 'object') {
          resolve({ ok: false, errors: [path + ' loaded, but it does not start with "window.SFL_CONTENT = {". Check the first lines of the file.'] });
          return;
        }
        var result = validate(window.SFL_CONTENT);
        resolve({ ok: result.errors.length === 0, errors: result.errors, warnings: result.warnings, content: window.SFL_CONTENT });
      };
      s.onerror = function () {
        window.__sflLoadingContent = false;
        resolve({ ok: false, errors: ['The content file ' + path + ' could not be found. Check the "content" name in config.js and that the folder was uploaded.'] });
      };
      document.head.appendChild(s);
    });
  }

  /* ---- The checks ---------------------------------------------------------
     Every message names WHERE the problem is in words a non-programmer can
     find in the file: "Day 2 > people > p3 > good_stations". */
  function validate(c) {
    var errors = [], warnings = [];
    function err(msg) { errors.push(msg); }
    function warn(msg) { warnings.push(msg); }
    function isStr(v) { return typeof v === 'string' && v.trim().length > 0; }
    function isNum(v) { return typeof v === 'number' && isFinite(v); }
    function isArr(v) { return Object.prototype.toString.call(v) === '[object Array]'; }
    function need(obj, key, where, type) {
      var v = obj ? obj[key] : undefined;
      var ok = type === 'string' ? isStr(v) : type === 'number' ? isNum(v) : type === 'array' ? isArr(v) :
               type === 'object' ? (v && typeof v === 'object' && !isArr(v)) : v !== undefined;
      if (!ok) err(where + ' > "' + key + '" is missing or is not ' +
        (type === 'string' ? 'some text in quote marks' : type === 'number' ? 'a number' : type === 'array' ? 'a list in [ ]' : 'a group in { }') + '.');
      return ok;
    }
    function uniqueIds(list, where) {
      var seen = {};
      (list || []).forEach(function (x, i) {
        if (!x || !isStr(x.id)) { err(where + ' > item ' + (i + 1) + ' has no "id".'); return; }
        if (seen[x.id]) err(where + ' > the id "' + x.id + '" is used twice. Every id in a list must be different.');
        seen[x.id] = true;
      });
      return seen;
    }

    need(c, 'title', 'Top of the file', 'string');
    need(c, 'time_limit_minutes', 'Top of the file', 'number');
    if (c.results_mode !== 'full' && c.results_mode !== 'demo') err('Top of the file > "results_mode" must be "full" or "demo".');
    need(c, 'labels', 'Top of the file', 'object');

    /* rules */
    if (need(c, 'rules', 'Top of the file', 'object')) {
      var r = c.rules;
      if (need(r, 'person_questions', 'rules', 'array')) uniqueIds(r.person_questions, 'rules > person_questions');
      if (need(r, 'station_questions', 'rules', 'array')) uniqueIds(r.station_questions, 'rules > station_questions');
      if (need(r, 'reasons', 'rules', 'array')) {
        uniqueIds(r.reasons, 'rules > reasons');
        r.reasons.forEach(function (rs) {
          if (!isStr(rs.label)) err('rules > reasons > ' + rs.id + ' has no "label".');
          (rs.needs || []).forEach(function (n) {
            if (n.target !== 'person' && n.target !== 'station') err('rules > reasons > ' + rs.id + ' > needs: "target" must be "person" or "station".');
            var qlist = n.target === 'person' ? r.person_questions : r.station_questions;
            (n.questions || []).forEach(function (q) {
              if (!MARKING.byId(qlist, q)) err('rules > reasons > ' + rs.id + ' > needs mentions the question "' + q + '", which is not in rules > ' + n.target + '_questions.');
            });
          });
        });
      }
      if (need(r, 'reflect_default_options', 'rules', 'array')) uniqueIds(r.reflect_default_options, 'rules > reflect_default_options');
      need(r, 'reflect_idk_option_id', 'rules', 'string');
      if (r.support_order !== 'fixed' && r.support_order !== 'any') err('rules > "support_order" must be "fixed" or "any".');
      ['confirm_before_support', 'show_support_outcomes', 'ask_reason_for_unmoved', 'notes_in_reflect',
       'notes_include_onboarding', 'can_skip_explore_points'].forEach(function (k) {
        if (typeof r[k] !== 'boolean') err('rules > "' + k + '" must be true or false (no quote marks).');
      });
    }

    /* scoring and benchmark */
    if (need(c, 'scoring', 'Top of the file', 'object')) {
      var s = c.scoring;
      if (need(s, 'onboarding', 'scoring', 'object')) need(s.onboarding, 'points_by_distance', 'scoring > onboarding', 'array');
      if (need(s, 'explore', 'scoring', 'object')) { need(s.explore, 'points_useful', 'scoring > explore', 'number'); need(s.explore, 'points_not_useful', 'scoring > explore', 'number'); }
      if (need(s, 'assign', 'scoring', 'object')) { need(s.assign, 'placement_points', 'scoring > assign', 'number'); need(s.assign, 'reason_points', 'scoring > assign', 'number'); }
      if (need(s, 'support', 'scoring', 'object') && need(s.support, 'tier_points', 'scoring > support', 'object')) {
        ['recommended', 'acceptable', 'weak'].forEach(function (t) { need(s.support.tier_points, t, 'scoring > support > tier_points', 'number'); });
      }
      if (need(s, 'reflect', 'scoring', 'object')) { need(s.reflect, 'points_correct', 'scoring > reflect', 'number'); need(s.reflect, 'points_idk_when_known', 'scoring > reflect', 'number'); }
    }
    if (c.benchmark) {
      var b = c.benchmark;
      need(b, 'phase_weights', 'benchmark', 'object');
      if (need(b, 'zones', 'benchmark', 'array') && b.zones.length && b.zones[0].from !== 0) err('benchmark > zones: the first zone must start "from": 0.');
      if (need(b, 'percentiles', 'benchmark', 'array')) {
        for (var pi = 1; pi < b.percentiles.length; pi++) {
          if (!(b.percentiles[pi][0] > b.percentiles[pi - 1][0])) err('benchmark > percentiles must be sorted by score, smallest first (problem at point ' + (pi + 1) + ').');
        }
      }
    }

    /* start and onboarding */
    if (need(c, 'start', 'Top of the file', 'object')) { need(c.start, 'heading', 'start', 'string'); need(c.start, 'body', 'start', 'string'); }
    if (need(c, 'onboarding', 'Top of the file', 'object')) {
      var ob = c.onboarding;
      need(ob, 'context', 'onboarding', 'string');
      need(ob, 'rank_prompt', 'onboarding', 'string');
      if (need(ob, 'questions', 'onboarding', 'array')) {
        uniqueIds(ob.questions, 'onboarding > questions');
        var positions = {};
        ob.questions.forEach(function (q) {
          var w = 'onboarding > questions > ' + q.id;
          need(q, 'text', w, 'string'); need(q, 'answer', w, 'string'); need(q, 'why', w, 'string');
          if (!(q.recommended_position >= 1 && q.recommended_position <= ob.questions.length)) err(w + ' > "recommended_position" must be a number from 1 to ' + ob.questions.length + '.');
          if (positions[q.recommended_position]) err(w + ' > "recommended_position" ' + q.recommended_position + ' is used by two questions.');
          positions[q.recommended_position] = true;
        });
        if (ob.questions.length < 2) err('onboarding > questions needs at least 2 questions to rank.');
      }
    }

    /* days */
    var KNOWN_PHASES = ['explore', 'assign', 'support', 'reflect'];
    if (need(c, 'days', 'Top of the file', 'array')) {
      if (!c.days.length) err('days: there must be at least one day.');
      uniqueIds(c.days, 'days');
      c.days.forEach(function (day, di) {
        var W = 'Day ' + (di + 1) + ' (' + (day.id || '?') + ')';
        need(day, 'name', W, 'string');
        need(day, 'intro', W, 'string');
        if (need(day, 'phases', W, 'array')) {
          var last = -1;
          day.phases.forEach(function (ph) {
            var idx = KNOWN_PHASES.indexOf(ph);
            if (idx < 0) err(W + ' > phases: "' + ph + '" is not a phase. Use explore, assign, support, reflect.');
            else if (idx <= last) err(W + ' > phases must keep the order explore, assign, support, reflect (you may leave some out).');
            last = Math.max(last, idx);
          });
        }
        var hasPh = function (p) { return isArr(day.phases) && day.phases.indexOf(p) >= 0; };
        var people = isArr(day.people) ? day.people : [];
        var stations = isArr(day.stations) ? day.stations : [];
        if (need(day, 'people', W, 'array')) uniqueIds(people, W + ' > people');
        if (need(day, 'stations', W, 'array')) uniqueIds(stations, W + ' > stations');
        if (people.length < 2 || people.length > 5) err(W + ': there must be 2 to 5 people (found ' + people.length + ').');
        if (stations.length < 2 || stations.length > 5) err(W + ': there must be 2 to 5 stations (found ' + stations.length + ').');
        if (people.length > stations.length) err(W + ': there are more people than stations, so someone could not be placed.');

        var qp = (c.rules && c.rules.person_questions) || [], qs = (c.rules && c.rules.station_questions) || [];
        var usefulCount = 0;
        people.forEach(function (p) {
          var w = W + ' > people > ' + p.id;
          need(p, 'name', w, 'string'); need(p, 'role', w, 'string'); need(p, 'description', w, 'string');
          if (need(p, 'good_stations', w, 'array')) {
            if (!p.good_stations.length) err(w + ' > good_stations must list at least one station.');
            p.good_stations.forEach(function (sid) { if (!MARKING.byId(stations, sid)) err(w + ' > good_stations mentions "' + sid + '", but ' + W + ' has no station with that id.'); });
          }
          need(p, 'placement_why', w, 'string');
          if (hasPh('explore') && need(p, 'answers', w, 'object')) {
            qp.forEach(function (q) {
              var a = p.answers[q.id];
              if (!a || !isStr(a.text)) err(w + ' > answers > ' + q.id + ' is missing its "text".');
              else { if (typeof a.useful !== 'boolean') err(w + ' > answers > ' + q.id + ' > "useful" must be true or false.'); if (a.useful) usefulCount++; if (!isStr(a.why)) warn(w + ' > answers > ' + q.id + ' has no "why" (shown in the results).'); }
            });
          }
        });
        stations.forEach(function (st) {
          var w = W + ' > stations > ' + st.id;
          need(st, 'name', w, 'string'); need(st, 'description', w, 'string'); need(st, 'icon', w, 'string');
          if (st.x !== undefined && !(st.x >= 0 && st.x <= 100)) err(w + ' > "x" must be between 0 and 100.');
          if (st.y !== undefined && !(st.y >= 0 && st.y <= 100)) err(w + ' > "y" must be between 0 and 100.');
          if (hasPh('explore') && need(st, 'answers', w, 'object')) {
            qs.forEach(function (q) {
              var a = st.answers[q.id];
              if (!a || !isStr(a.text)) err(w + ' > answers > ' + q.id + ' is missing its "text".');
              else { if (typeof a.useful !== 'boolean') err(w + ' > answers > ' + q.id + ' > "useful" must be true or false.'); if (a.useful) usefulCount++; }
            });
          }
        });
        if (hasPh('explore')) {
          if (!isNum(day.explore_points) || day.explore_points < 0) err(W + ' > "explore_points" must be a number, 0 or more.');
          else {
            if (day.explore_points >= people.length + stations.length) warn(W + ': explore_points (' + day.explore_points + ') is not fewer than people + stations. The candidate report says it always is.');
            if (usefulCount < day.explore_points) warn(W + ': fewer useful answers (' + usefulCount + ') than explore points, so nobody can score full marks in Explore.');
          }
        }
        if (need(day, 'start_assignment', W, 'object')) {
          var usedSt = {};
          people.forEach(function (p) {
            var sid = day.start_assignment[p.id];
            if (!sid) err(W + ' > start_assignment has no station for "' + p.id + '".');
            else if (!MARKING.byId(stations, sid)) err(W + ' > start_assignment puts "' + p.id + '" on "' + sid + '", which is not a station on this day.');
            else if (usedSt[sid]) err(W + ' > start_assignment puts two people on "' + sid + '".');
            usedSt[sid] = true;
          });
        }

        function checkVariant(item, w, fields) {
          if (!item.when_mismatched) return;
          for (var k in item.when_mismatched) if (fields.indexOf(k) < 0) err(w + ' > when_mismatched: "' + k + '" cannot be changed here. Allowed: ' + fields.join(', ') + '.');
        }
        function checkOptions(opts, w, needTier) {
          if (!isArr(opts)) { err(w + ' > "options" must be a list in [ ].'); return; }
          if (opts.length < 2 || opts.length > 4) warn(w + ': has ' + opts.length + ' options; the candidate report says 2 to 4.');
          uniqueIds(opts, w + ' > options');
          var rec = 0;
          opts.forEach(function (o) {
            var textKey = needTier ? 'text' : 'label';
            if (!isStr(o[textKey])) err(w + ' > options > ' + o.id + ' has no "' + textKey + '".');
            if (needTier) {
              if (['recommended', 'acceptable', 'weak'].indexOf(o.tier) < 0) err(w + ' > options > ' + o.id + ' > "tier" must be "recommended", "acceptable" or "weak".');
              if (o.tier === 'recommended') rec++;
              if (!isStr(o.why)) err(w + ' > options > ' + o.id + ' has no "why".');
              if (c.rules && c.rules.show_support_outcomes && !isStr(o.outcome)) err(w + ' > options > ' + o.id + ' has no "outcome" (needed because show_support_outcomes is true).');
            }
          });
          if (needTier && rec !== 1) err(w + ': exactly one option must have "tier": "recommended" (found ' + rec + ').');
        }

        if (hasPh('support')) {
          if (need(day, 'support', W, 'array')) {
            uniqueIds(day.support, W + ' > support');
            day.support.forEach(function (it) {
              var w = W + ' > support > ' + it.id;
              if (!MARKING.byId(people, it.person)) err(w + ' > "person" "' + it.person + '" is not a person on this day.');
              need(it, 'question', w, 'string');
              checkOptions(it.options, w, true);
              checkVariant(it, w, ['question', 'options']);
              if (it.when_mismatched && it.when_mismatched.options) checkOptions(it.when_mismatched.options, w + ' > when_mismatched', true);
            });
          }
        }
        if (hasPh('reflect')) {
          if (need(day, 'reflect', W, 'array')) {
            uniqueIds(day.reflect, W + ' > reflect');
            day.reflect.forEach(function (it) {
              var w = W + ' > reflect > ' + it.id;
              if (it.person && !MARKING.byId(people, it.person)) err(w + ' > "person" "' + it.person + '" is not a person on this day.');
              need(it, 'prompt', w, 'string');
              need(it, 'why', w, 'string');
              var opts = it.options || (c.rules && c.rules.reflect_default_options) || [];
              if (it.options) checkOptions(it.options, w, false);
              var idk = c.rules && c.rules.reflect_idk_option_id;
              if (idk && !MARKING.byId(opts, idk)) err(w + ': its options have no "I don\'t know" option with id "' + idk + '".');
              function checkTruth(obj, ww) {
                if (obj.unknowable) return;
                if (obj.truth !== undefined && !MARKING.byId(opts, obj.truth)) err(ww + ' > "truth" "' + obj.truth + '" is not one of its options.');
                if (obj.truth_from_support) {
                  var m = obj.truth_from_support;
                  if (!MARKING.byId(day.support, m.support)) err(ww + ' > truth_from_support > "support" "' + m.support + '" is not a Support question on this day.');
                  ['recommended', 'acceptable', 'weak', 'not_answered'].forEach(function (t) {
                    if (m[t] !== undefined && !MARKING.byId(opts, m[t])) err(ww + ' > truth_from_support > "' + t + '" "' + m[t] + '" is not one of its options.');
                  });
                  if (m.by_option) {
                    var sItem = MARKING.byId(day.support, m.support);
                    for (var ob in m.by_option) {
                      if (!MARKING.byId(opts, m.by_option[ob])) err(ww + ' > truth_from_support > by_option > "' + ob + '": "' + m.by_option[ob] + '" is not one of its options.');
                      if (sItem && !MARKING.byId(sItem.options, ob) && !(sItem.when_mismatched && sItem.when_mismatched.options && MARKING.byId(sItem.when_mismatched.options, ob))) err(ww + ' > truth_from_support > by_option: "' + ob + '" is not an option of Support question ' + m.support + '.');
                    }
                  }
                }
                if (obj.truth === undefined && !obj.truth_from_support) err(ww + ' needs "truth", "truth_from_support" or "unknowable": true.');
              }
              checkTruth(it, w);
              checkVariant(it, w, ['prompt', 'truth', 'truth_from_support', 'unknowable', 'why']);
              if (it.when_mismatched) {
                var merged = {}; var k;
                for (k in it) merged[k] = it[k];
                for (k in it.when_mismatched) merged[k] = it.when_mismatched[k];
                checkTruth(merged, w + ' > when_mismatched');
              }
              if (it.when_mismatched && !it.person) err(w + ' has "when_mismatched" but no "person" to check.');
            });
          }
        }
      });
    }
    return { errors: errors, warnings: warnings };
  }

  return { nameFromUrl: nameFromUrl, load: load, validate: validate };
})();
