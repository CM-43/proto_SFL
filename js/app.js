/* ==========================================================================
   SUSTAINABLE FUTURES LAB — THE SCREENS

   Draws everything and handles every click and drag. It decides no score:
   all marking is in js/marking.js. It hard-codes no content: every word and
   number comes from the content file (data/<name>/content.js).

   ONE STATE OBJECT. Everything the screen shows is drawn from `state`.
   A change updates `state`, then calls render(). The only things painted
   without a full render are the clock (every second) and the item being
   dragged, so a drag or a timer tick never loses what is under the pointer.
   ========================================================================== */
(function () {
  'use strict';

  var app = document.getElementById('app');
  var state = null;
  var M = MARKING;

  /* ====================================================================== *
   * SMALL HELPERS
   * ====================================================================== */
  function byId(id) { return document.getElementById(id); }
  function esc(text) {
    return String(text === null || text === undefined ? '' : text)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  /* Content text on screen: made safe first, then line breaks kept. */
  function textToHtml(text) { return esc(text).replace(/\n/g, '<br>'); }
  /* Longer text (the project brief) can also use simple layout marks, written
     in the content file the way the old SFL brief was:
       a blank line        starts a new paragraph
       **Heading**         on a line of its own is a heading
       - item              lines starting with "- " become a bullet list
       **words**           inside a sentence are bold                          */
  function richTextToHtml(text) {
    function inline(line) { return esc(line).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
    var html = '';
    String(text || '').split(/\n\s*\n/).forEach(function (block) {
      var lines = block.split('\n'), para = [], list = [];
      function flushPara() { if (para.length) html += '<p>' + para.join('<br>') + '</p>'; para = []; }
      function flushList() { if (list.length) html += '<ul>' + list.join('') + '</ul>'; list = []; }
      lines.forEach(function (raw) {
        var line = raw.trim();
        if (!line) return;
        var head = /^\*\*(.+)\*\*$/.exec(line);
        if (head && head[1].indexOf('**') < 0) { flushPara(); flushList(); html += '<h3>' + esc(head[1]) + '</h3>'; }
        else if (/^- /.test(line)) { flushPara(); list.push('<li>' + inline(line.slice(2)) + '</li>'); }
        else { flushList(); para.push(inline(line)); }
      });
      flushPara(); flushList();
    });
    return html;
  }
  function fill(text, vars) {
    return String(text || '').replace(/\{(\w+)\}/g, function (m, k) {
      return vars && vars[k] !== undefined ? vars[k] : m;
    });
  }
  /* A customer-facing word from the content file, with a fallback. */
  function L(key, vars, fallback) {
    var labels = state && state.content && state.content.labels;
    var t = labels && typeof labels[key] === 'string' ? labels[key] : (fallback !== undefined ? fallback : key);
    return fill(t, vars);
  }
  function content() { return state.content; }
  function rules() { return state.content.rules; }
  function showScore(n) {
    if (typeof n !== 'number') return String(n);
    return (Math.round(n * 10) / 10 === Math.round(n)) ? String(Math.round(n))
                                                       : (Math.round(n * 10) / 10).toFixed(1);
  }
  function initials(name) {
    var parts = String(name || '').split(/\s+/).filter(Boolean);
    return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }
  var AVATAR_TONES = ['tone-a', 'tone-b', 'tone-c', 'tone-d', 'tone-e'];

  /* ====================================================================== *
   * THE RUN
   * ====================================================================== */
  function freshRun(c) {
    var days = c.days.map(function () {
      return { asked: [], assignment: {}, reasons: {}, support: {}, reflect: {}, late: {},
               reflectIndex: 0, reflectChoice: null };
    });
    return {
      content: c,
      phase: 'start',           /* login | start | game | results */
      loggedIn: false,
      step: null,               /* { kind:'onboarding', screen } or { kind:'day', day, phase } */
      ui: { loginError: '', loginUser: '', modal: null, prevModal: null, notesOpen: true,
            notesTab: 'team', selected: null, openBlocks: { onboarding: true } },
      timer: { total: c.time_limit_minutes * 60, left: c.time_limit_minutes * 60,
               running: false, everStarted: false, startedAt: 0 },
      run: {
        onboarding: { order: c.onboarding.questions.map(function (q) { return q.id; }) },
        days: days,
        late: {}
      },
      result: null
    };
  }

  function currentDay() { return state.step && state.step.kind === 'day' ? content().days[state.step.day] : null; }
  function currentDayRun() { return state.step && state.step.kind === 'day' ? state.run.days[state.step.day] : null; }
  function timeIsUp() { return state.timer.everStarted && state.timer.left <= 0; }
  function personById(day, id) { return M.byId(day.people, id); }
  function stationById(day, id) { return M.byId(day.stations, id); }

  /* ====================================================================== *
   * THE CLOCK
   * ====================================================================== */
  var RING_R = 27, RING_C = 2 * Math.PI * RING_R;
  function startTimer() {
    state.timer.running = true;
    state.timer.everStarted = true;
    state.timer.startedAt = Date.now();
  }
  setInterval(function () {
    if (!state || !state.timer.running) return;
    var elapsed = (Date.now() - state.timer.startedAt) / 1000;
    state.timer.left = Math.max(0, state.timer.total - elapsed);
    paintTimer();
  }, 1000);

  function timerHTML() {
    return '<div class="ring-timer" id="ring-timer">' +
      '<svg viewBox="0 0 64 64" aria-hidden="true">' +
        '<circle class="ring-track" cx="32" cy="32" r="' + RING_R + '"></circle>' +
        '<circle class="ring-fill" id="ring-fill" cx="32" cy="32" r="' + RING_R + '" ' +
          'stroke-dasharray="' + RING_C.toFixed(2) + '" stroke-dashoffset="0" transform="rotate(-90 32 32)"></circle>' +
      '</svg>' +
      '<div class="ring-text" id="ring-text"></div>' +
      '<div class="timer-paused" id="timer-paused">' + esc(L('timer_paused')) + '</div>' +
    '</div>';
  }
  function paintTimer() {
    var t = state.timer;
    var fillEl = byId('ring-fill'), textEl = byId('ring-text'), pausedEl = byId('timer-paused');
    if (!fillEl || !textEl) return;
    var frac = t.total ? t.left / t.total : 1;
    fillEl.setAttribute('stroke-dashoffset', (RING_C * (1 - frac)).toFixed(2));
    if (timeIsUp()) {
      textEl.innerHTML = '<span class="ring-up">' + esc(L('timer_up')) + '</span>';
      byId('ring-timer').classList.add('is-up');
    } else {
      textEl.innerHTML = '<b>' + Math.ceil(t.left / 60) + '</b><span>' + esc(L('timer_min')) + '</span>';
    }
    if (pausedEl) pausedEl.classList.toggle('is-visible', !t.running && !timeIsUp());
  }

  /* ====================================================================== *
   * FULLSCREEN AND WINDOW SIZE (house behaviour)
   * ====================================================================== */
  function fullscreenAvailable() {
    try { return !!(document.fullscreenEnabled && document.documentElement.requestFullscreen); }
    catch (e) { return false; }
  }
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(function () {});
  }
  document.addEventListener('fullscreenchange', function () { if (state && !drag) render(); });

  function checkSize() {
    var small = window.innerWidth < 900 || window.innerHeight < 540;
    byId('too-small').hidden = !small;
  }
  window.addEventListener('resize', checkSize);

  /* ====================================================================== *
   * RENDER
   * ====================================================================== */
  function render() {
    if (!state) return;
    document.body.classList.toggle('scrolls', state.phase === 'results');
    var html;
    if (state.phase === 'login') html = loginHTML();
    else if (state.phase === 'start') html = startHTML();
    else if (state.phase === 'game') html = gameHTML();
    else html = resultsHTML();
    /* A popup plays its opening animation only when it first opens. Clicking
       inside it (choosing an option, asking a question) redraws the screen,
       and without this the popup would fade in again and the screen would
       appear to flash. */
    var key = modalKey(state.ui.modal);
    steadyModal = !!key && key === lastModalKey;
    lastModalKey = key;
    app.innerHTML = html + modalHTML();
    paintTimer();
    if (state.phase === 'login') {
      var u = byId('u');
      if (u && !u.value) u.focus(); else if (byId('p')) byId('p').focus();
    }
  }

  /* Which popup is open: its type and who or what it is about. The same key
     on two redraws in a row means the same popup is still open. */
  var lastModalKey = null, steadyModal = false;
  function modalKey(m) {
    if (!m) return null;
    return [m.type, m.target || '', m.id || '', m.person || '', m.item || '',
            m.day === undefined ? '' : m.day, m.queue ? m.queue[0] : ''].join('|');
  }

  /* ---- LOGIN — Sea Wolf's markup, copied (D16). Only the heading words come
     from the content. Redrock's behaviour: the username stays after a wrong
     password, and the password is checked against a SHA-256 fingerprint. */
  function loginHTML() {
    return '<div class="centre-screen"><div class="panel">' +
      '<h1>' + esc(content().title) + '</h1>' +
      '<p class="lede">' + esc(L('login_lede')) + '</p>' +
      '<form id="login-form">' +
      '<div class="field"><label for="u">Username</label>' +
      '<input id="u" type="text" autocomplete="username" autocapitalize="off" spellcheck="false" value="' + esc(state.ui.loginUser) + '"></div>' +
      '<div class="field"><label for="p">Password</label>' +
      '<input id="p" type="password" autocomplete="current-password"></div>' +
      '<div class="form-error">' + esc(state.ui.loginError) + '</div>' +
      '<button class="btn" type="submit" style="width:100%">Log in</button>' +
      '</form>' +
      '</div></div>';
  }
  function toHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), function (b) { return ('00' + b.toString(16)).slice(-2); }).join('');
  }
  function attemptLogin(username, password) {
    state.ui.loginUser = username;
    if (username !== CONFIG.username) {
      state.ui.loginError = 'That username and password do not match.';
      render(); return;
    }
    if (!window.crypto || !window.crypto.subtle) {
      state.ui.loginError = 'Login needs the page to be opened over https.';
      render(); return;
    }
    window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)).then(function (digest) {
      if (toHex(digest) === String(CONFIG.passcodeHash).toLowerCase()) {
        state.loggedIn = true; state.ui.loginError = ''; state.phase = 'start';
      } else {
        state.ui.loginError = 'That username and password do not match.';
      }
      render();
    }).catch(function () {
      state.ui.loginError = 'Login needs the page to be opened over https.';
      render();
    });
  }
  document.addEventListener('submit', function (e) {
    if (!e.target || e.target.id !== 'login-form') return;
    e.preventDefault();
    attemptLogin(byId('u').value.trim(), byId('p').value);
  });

  /* ---- START ------------------------------------------------------------- */
  function startHTML() {
    var c = content();
    return '<div class="centre-screen"><div class="panel wide start-panel">' +
      '<h1>' + esc(c.start.heading) + '</h1>' +
      '<p class="start-body">' + textToHtml(fill(c.start.body, { minutes: c.time_limit_minutes })) + '</p>' +
      '<div class="start-actions"><button class="btn" data-act="start">' + esc(L('start_button')) + '</button></div>' +
    '</div></div>';
  }

  /* ====================================================================== *
   * THE GAME FRAME
   *
   *   [ timer ] [        overall progress        ] [ restart  fullscreen ]
   *   [ rail  ] [ team strip                                             ]
   *   [ rail  ] [ map: stations · notes bottom-left · Continue bottom-right ]
   *
   * Onboarding and Reflect replace the strip and map with a plain card.
   * ====================================================================== */
  function gameHTML() {
    var s = state.step;
    var plain = s.kind === 'onboarding' || (s.kind === 'day' && s.phase === 'reflect');
    return '<div class="game' + (plain ? ' is-plain' : '') + '">' +
      '<div class="g-timer">' + timerHTML() + '</div>' +
      '<div class="g-top">' + overallHTML() + toolsHTML() + '</div>' +
      '<aside class="g-rail">' + railHTML() + '</aside>' +
      (plain ? '<main class="g-card-area">' + plainScreenHTML() + '</main>'
             : '<div class="g-strip">' + stripHTML() + '</div>' +
               '<main class="g-map-area">' + mapHTML() + '</main>') +
    '</div>';
  }

  function overallHTML() {
    var s = state.step;
    var chips = '<span class="ov-chip ' + (s.kind === 'onboarding' ? 'is-now' : 'is-done') + '">' + esc(L('onboarding')) + '</span>';
    content().days.forEach(function (d, i) {
      var cls = s.kind === 'onboarding' ? '' : (i < s.day ? 'is-done' : i === s.day ? 'is-now' : '');
      chips += '<span class="ov-sep" aria-hidden="true"></span><span class="ov-chip ' + cls + '">' + esc(d.name) + '</span>';
    });
    return '<div class="overall" aria-label="Progress">' + chips + '</div>';
  }

  function toolsHTML() {
    var isBig = !!document.fullscreenElement;
    return '<div class="g-tools">' +
      '<button class="btn-quiet" data-act="restart">' + esc(L('restart')) + '</button>' +
      (fullscreenAvailable()
        ? '<button class="btn-fullscreen" data-act="fullscreen" title="' + esc(isBig ? L('exit_fullscreen') : L('fullscreen')) + '">' +
          (isBig ? '✕' : '⛶') + '</button>' : '') +
    '</div>';
  }

  function railHTML() {
    var s = state.step, html = '';
    if (s.kind === 'onboarding') {
      var steps = [['brief', 'onboarding_brief'], ['rank', 'onboarding_rank'], ['answers', 'onboarding_answers']];
      var nowIdx = ['brief', 'rank', 'answers'].indexOf(s.screen);
      html += '<div class="rail-title">' + esc(L('onboarding')) + '</div>';
      steps.forEach(function (st, i) {
        html += '<div class="rail-step ' + (i < nowIdx ? 'is-done' : i === nowIdx ? 'is-now' : '') + '"><i></i>' + esc(L(st[1])) + '</div>';
      });
      return html;
    }
    var day = currentDay();
    var phIdx = day.phases.indexOf(s.phase);
    html += '<div class="rail-title">' + esc(day.name) + '</div>';
    day.phases.forEach(function (ph, i) {
      html += '<div class="rail-step ' + (i < phIdx ? 'is-done' : i === phIdx ? 'is-now' : '') + '"><i></i>' + esc(L('phase_' + ph)) + '</div>';
    });
    if (s.phase === 'explore') {
      html += '<div class="rail-points"><b>' + pointsLeft() + '</b><span>' + esc(L('explore_points')) + '</span></div>';
    }
    return html;
  }

  function continueButtonHTML(enabled) {
    return '<button class="btn g-continue" data-act="continue"' + (enabled ? '' : ' disabled') + '>' + esc(L('continue')) + '</button>';
  }

  /* ====================================================================== *
   * ONBOARDING AND REFLECT: THE PLAIN CARD SCREENS
   * ====================================================================== */
  function plainScreenHTML() {
    var s = state.step, c = content();
    if (s.kind === 'onboarding') {
      var ob = c.onboarding;
      if (s.screen === 'brief') {
        return '<div class="plain-card"><div class="plain-scroll">' +
          '<h2>' + esc(L('onboarding_brief')) + '</h2><div class="plain-text rich-text">' + richTextToHtml(ob.context) + '</div>' +
          '</div><div class="plain-actions">' + continueButtonHTML(true) + '</div></div>';
      }
      if (s.screen === 'rank') {
        var order = state.run.onboarding.order, items = '';
        order.forEach(function (qid, i) {
          var q = M.byId(ob.questions, qid);
          items += '<div class="rank-item" data-drag="rank" data-id="' + esc(qid) + '" data-rank-slot="' + i + '">' +
            '<span class="rank-num">' + (i + 1) + '</span>' +
            '<span class="rank-grip" aria-hidden="true"></span>' +
            '<span class="rank-text">' + textToHtml(q.text) + '</span>' +
            '<span class="rank-arrows">' +
              '<button class="arrow-btn" data-act="rank-up" data-id="' + esc(qid) + '" title="' + esc(L('move_up')) + '"' + (i === 0 ? ' disabled' : '') + '>▲</button>' +
              '<button class="arrow-btn" data-act="rank-down" data-id="' + esc(qid) + '" title="' + esc(L('move_down')) + '"' + (i === order.length - 1 ? ' disabled' : '') + '>▼</button>' +
            '</span></div>';
        });
        return '<div class="plain-card"><div class="plain-scroll">' +
          '<h2>' + textToHtml(ob.rank_prompt) + '</h2><p class="plain-hint">' + esc(L('rank_hint')) + '</p>' +
          '<div class="rank-list">' + items + '</div>' +
          '</div><div class="plain-actions">' + continueButtonHTML(true) + '</div></div>';
      }
      var qa = '';
      state.run.onboarding.order.forEach(function (qid) {
        var q = M.byId(ob.questions, qid);
        qa += '<div class="qa"><div class="qa-q">' + textToHtml(q.text) + '</div><div class="qa-a">' + textToHtml(q.answer) + '</div></div>';
      });
      return '<div class="plain-card"><div class="plain-scroll">' +
        '<h2>' + esc(L('onboarding_answers_heading')) + '</h2><div class="qa-list">' + qa + '</div>' +
        '</div><div class="plain-actions">' + continueButtonHTML(true) + '</div></div>';
    }

    /* Reflect */
    var day = currentDay(), dr = currentDayRun();
    var list = day.reflect || [];
    var item = M.resolveItem(day, dr, list[dr.reflectIndex]);
    var opts = M.reflectOptions(c, item), rows = '';
    opts.forEach(function (o) {
      var chosen = dr.reflectChoice === o.id;
      rows += '<div class="choice' + (chosen ? ' is-chosen' : '') + '" data-act="reflect-choose" data-id="' + esc(o.id) + '" role="radio" aria-checked="' + chosen + '">' +
        '<span class="radio" aria-hidden="true"></span><span class="label">' + esc(o.label) + '</span></div>';
    });
    return '<div class="plain-card reflect-card">' +
      (rules().notes_in_reflect ? notesHTML() : '') +
      '<div class="plain-scroll">' +
        '<div class="plain-kicker">' + esc(L('phase_reflect')) + ' · ' + esc(L('reflect_counter', { n: dr.reflectIndex + 1, total: list.length })) + '</div>' +
        '<h2>' + textToHtml(personFill(day, dr, item.prompt, item.person)) + '</h2>' +
        '<div class="choice-list">' + rows + '</div>' +
      '</div><div class="plain-actions">' + continueButtonHTML(!!dr.reflectChoice) + '</div></div>';
  }

  function personFill(day, dr, text, personId) {
    var p = personId ? personById(day, personId) : null;
    var st = personId ? stationById(day, M.currentStation(day, dr, personId)) : null;
    return fill(text, { name: p ? p.name : '', station: st ? st.name : '' });
  }

  /* ====================================================================== *
   * THE TEAM STRIP
   * ====================================================================== */
  function stripHTML() {
    var day = currentDay(), dr = currentDayRun(), ph = state.step.phase, html = '';
    day.people.forEach(function (p, i) {
      var st = (ph === 'assign' || ph === 'support') ? stationById(day, M.currentStation(day, dr, p.id)) : null;
      var cls = 'person-card';
      var attrs = '';
      if (ph === 'explore') { cls += ' is-pressable'; attrs = ' data-act="ask-person" data-id="' + esc(p.id) + '"'; }
      if (ph === 'assign') {
        cls += ' is-draggable' + (state.ui.selected === p.id ? ' is-selected' : '');
        attrs = ' data-drag="person" data-act="select-person" data-id="' + esc(p.id) + '"';
      }
      if (ph === 'support') {
        var g = supportGlow(p.id);
        if (g === 'glow') { cls += ' is-glowing is-pressable'; attrs = ' data-act="support-open" data-id="' + esc(p.id) + '"'; }
        if (g === 'done') cls += ' is-done';
      }
      html += '<div class="' + cls + '"' + attrs + '>' +
        '<span class="avatar ' + AVATAR_TONES[i % AVATAR_TONES.length] + '">' + esc(initials(p.name)) + '</span>' +
        '<span class="pc-text"><span class="pc-name">' + esc(p.name) + '</span>' +
        '<span class="pc-role">' +
          /* Someone bumped off a station shows "Not placed" first, so it stays readable when the card is narrow. */
          (!st && ph === 'assign' ? '<span class="pc-unplaced">' + esc(L('not_placed')) + '</span> · ' + esc(p.role)
                                  : esc(p.role) + (st ? ' · ' + esc(L('at_station', { station: st.name })) : '')) + '</span></span>' +
        (ph === 'support' && supportGlow(p.id) === 'done' ? '<span class="pc-tick" aria-hidden="true">✓</span>' : '') +
      '</div>';
    });
    return html;
  }

  /* ====================================================================== *
   * THE MAP
   * ====================================================================== */
  var SLOT_PRESETS = {
    2: [[34, 30], [70, 56]],
    3: [[30, 26], [70, 24], [64, 64]],
    4: [[28, 24], [68, 20], [50, 52], [80, 66]],
    5: [[26, 22], [55, 16], [84, 28], [52, 52], [80, 68]]
  };

  var ICONS = {
    bird: '<path d="M3 13c3 0 5-2 7-5 1 3 3 5 7 5l4-3-1 5c-2 3-5 5-9 5s-7-3-8-7Z"/><circle cx="16.5" cy="10.5" r=".6"/>',
    leaf: '<path d="M5 20c0-8 5-13 14-14 1 9-4 14-11 14"/><path d="M5 20c3-4 6-6 10-7"/>',
    drop: '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z"/>',
    chat: '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12.5h5"/>',
    sprout: '<path d="M12 21v-9"/><path d="M12 12c0-4-3-6-7-6 0 4 3 6 7 6Z"/><path d="M12 14c0-4 3-7 7-7 0 4-3 7-7 7Z"/><path d="M7 21h10"/>',
    wrench: '<path d="M14.5 5.5a4 4 0 0 0 4.9 5L20 11l-9 9a2.1 2.1 0 0 1-3-3l9-9 .5.6a4 4 0 0 0-3-3.1Z"/>',
    paw: '<path d="M12 14c-3 0-5 2-5 4s2 3 5 3 5-1 5-3-2-4-5-4Z"/><circle cx="6" cy="10" r="2"/><circle cx="10" cy="6.5" r="2"/><circle cx="14" cy="6.5" r="2"/><circle cx="18" cy="10" r="2"/>',
    chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/>',
    boat: '<path d="M3 16h18l-3 4H6Z"/><path d="M12 4v12"/><path d="M12 5l6 9h-6"/>',
    document: '<path d="M7 3h7l4 4v14H7Z"/><path d="M14 3v4h4"/><path d="M10 12h5M10 15.5h5"/>'
  };
  function iconSVG(name) {
    return '<svg class="st-icon" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || ICONS.leaf) + '</svg>';
  }

  function islandSVG() {
    return '<svg class="map-bg" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs><radialGradient id="sea" cx="50%" cy="45%" r="75%"><stop offset="0%" stop-color="#2f4a63"/><stop offset="100%" stop-color="#24374b"/></radialGradient>' +
      '<linearGradient id="land" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4b6b55"/><stop offset="100%" stop-color="#3d5847"/></linearGradient></defs>' +
      '<rect width="1000" height="560" fill="url(#sea)"/>' +
      '<g fill="none" stroke="#9fb8cf" stroke-width="1.4" opacity=".18">' +
        '<path d="M60 90q60-18 120 0t120 0"/><path d="M700 500q60-18 120 0t120 0"/><path d="M820 70q50-14 100 0"/><path d="M70 470q50-14 100 0"/></g>' +
      '<path d="M170 110 Q300 40 470 70 Q640 30 780 110 Q900 180 860 300 Q890 420 760 470 Q620 540 470 505 Q300 530 200 450 Q110 370 140 250 Q120 170 170 110 Z" fill="url(#land)" stroke="#8fae8f" stroke-width="3" opacity=".96"/>' +
      '<path d="M170 110 Q300 40 470 70 Q640 30 780 110 Q900 180 860 300 Q890 420 760 470 Q620 540 470 505 Q300 530 200 450 Q110 370 140 250 Q120 170 170 110 Z" fill="none" stroke="#8fae8f" stroke-width="12" opacity=".08"/>' +
      '<path d="M380 150 Q470 220 430 300 Q400 380 500 430 Q560 460 620 520" stroke="#7fa7c7" stroke-width="6" fill="none" opacity=".45" stroke-linecap="round"/>' +
      '<g fill="#5b7d64" opacity=".55"><circle cx="300" cy="200" r="22"/><circle cx="328" cy="182" r="15"/><circle cx="640" cy="360" r="20"/><circle cx="664" cy="378" r="13"/><circle cx="590" cy="160" r="16"/><circle cx="760" cy="250" r="12"/></g>' +
      '<g fill="#6e8a74" opacity=".5"><path d="M620 90 l30 -30 l30 30 Z"/><path d="M660 96 l22 -22 l22 22 Z"/></g>' +
    '</svg>';
  }

  function mapHTML() {
    var day = currentDay(), dr = currentDayRun(), ph = state.step.phase;
    var presets = SLOT_PRESETS[day.stations.length] || SLOT_PRESETS[4];
    var stations = '';
    day.stations.forEach(function (st, i) {
      var x = st.x !== undefined ? st.x : presets[i][0];
      var y = st.y !== undefined ? st.y : presets[i][1];
      var cls = 'station', attrs = ' data-station="' + esc(st.id) + '"';
      if (ph === 'explore') { cls += ' is-pressable'; attrs += ' data-act="ask-station" data-id="' + esc(st.id) + '"'; }
      if (ph === 'assign') { attrs += ' data-act="place-station" data-id="' + esc(st.id) + '"'; if (state.ui.selected) cls += ' is-target'; }
      var slot = '';
      if (ph === 'assign' || ph === 'support') {
        var occupant = null;
        day.people.forEach(function (p) { if (M.currentStation(day, dr, p.id) === st.id) occupant = p; });
        if (occupant) {
          var idx = day.people.indexOf(occupant);
          var chipCls = 'occupant', chipAttrs = '';
          if (ph === 'assign') { chipCls += ' is-draggable' + (state.ui.selected === occupant.id ? ' is-selected' : ''); chipAttrs = ' data-drag="person" data-act="select-person" data-id="' + esc(occupant.id) + '"'; }
          if (ph === 'support') {
            var g = supportGlow(occupant.id);
            if (g === 'glow') { chipCls += ' is-glowing'; chipAttrs = ' data-act="support-open" data-id="' + esc(occupant.id) + '"'; }
            if (g === 'done') chipCls += ' is-done';
          }
          slot = '<div class="' + chipCls + '"' + chipAttrs + '><span class="avatar small ' + AVATAR_TONES[idx % AVATAR_TONES.length] + '">' + esc(initials(occupant.name)) + '</span>' +
            '<span class="occ-name">' + esc(occupant.name) + '</span>' +
            (ph === 'support' && supportGlow(occupant.id) === 'done' ? '<span class="pc-tick" aria-hidden="true">✓</span>' : '') + '</div>';
        } else {
          slot = '<div class="occupant is-empty">—</div>';
        }
      }
      stations += '<div class="' + cls + '" style="left:' + x + '%;top:' + y + '%"' + attrs + '>' +
        '<div class="st-head">' + iconSVG(st.icon) + '<span class="st-name">' + esc(st.name) + '</span></div>' + slot + '</div>';
    });

    var hintKey = ph === 'explore' ? 'explore_hint' :
                  ph === 'assign' ? (everyonePlaced() ? 'assign_hint' : 'assign_hint_unplaced') :
                  (rules().support_order === 'any' ? 'support_hint_any' : 'support_hint');
    var canContinue = ph === 'explore' ? (rules().can_skip_explore_points || pointsLeft() === 0) :
                      ph === 'assign' ? everyonePlaced() :
                      ph === 'support' ? supportAllDone() : true;
    return '<div class="map" id="map">' + islandSVG() +
      '<div class="map-hint">' + esc(L(hintKey)) + '</div>' +
      stations + notesHTML() + continueButtonHTML(canContinue) + '</div>';
  }

  /* Assign: Continue waits until nobody is left "not placed" (bump rule). */
  function everyonePlaced() {
    var day = currentDay(), dr = currentDayRun();
    return day.people.every(function (p) { return !!M.currentStation(day, dr, p.id); });
  }

  /* ====================================================================== *
   * THE NOTES PANEL — fills itself; resets every day (each day has its own run)
   * ====================================================================== */
  function notesHTML() {
    var day = currentDay(), dr = currentDayRun(), c = content();
    var tabs = [['team', 'notes_team'], ['stations', 'notes_stations']];
    if (rules().notes_include_onboarding) tabs.push(['project', 'notes_project']);
    var tab = state.ui.notesTab;
    var head = '<div class="notes-head"><button class="notes-toggle" data-act="notes-toggle" aria-expanded="' + state.ui.notesOpen + '">' +
      '<span>' + esc(L('notes_title')) + '</span><span class="caret">' + (state.ui.notesOpen ? '▾' : '▸') + '</span></button></div>';
    if (!state.ui.notesOpen) return '<div class="notes is-closed">' + head + '</div>';
    var tabsHTML = '<div class="notes-tabs" role="tablist">' + tabs.map(function (t) {
      return '<button class="notes-tab' + (tab === t[0] ? ' is-on' : '') + '" data-act="notes-tab" data-id="' + t[0] + '" role="tab">' + esc(L(t[1])) + '</button>';
    }).join('') + '</div>';
    var body = '';
    function learnedLines(target, who, qlist) {
      var lines = '';
      qlist.forEach(function (q) {
        if (M.hasAsked(dr, target, who.id, [q.id])) lines += '<div class="n-learned"><span>' + esc(q.label) + '</span> ' + textToHtml(who.answers[q.id].text) + '</div>';
      });
      return lines;
    }
    if (tab === 'team') {
      day.people.forEach(function (p) {
        var learned = learnedLines('person', p, c.rules.person_questions);
        body += '<div class="n-row"><div class="n-title">' + esc(p.name) + ' · ' + esc(p.role) + '</div>' +
          '<div class="n-desc">' + textToHtml(p.description) + '</div>' + (learned || '<div class="n-none">' + esc(L('notes_nothing')) + '</div>') + '</div>';
      });
    } else if (tab === 'stations') {
      day.stations.forEach(function (st) {
        var learned = learnedLines('station', st, c.rules.station_questions);
        body += '<div class="n-row"><div class="n-title">' + esc(st.name) + '</div>' +
          '<div class="n-desc">' + textToHtml(st.description) + '</div>' + (learned || '<div class="n-none">' + esc(L('notes_nothing')) + '</div>') + '</div>';
      });
    } else {
      c.onboarding.questions.forEach(function (q) {
        body += '<div class="n-row"><div class="n-title">' + textToHtml(q.text) + '</div><div class="n-desc">' + textToHtml(q.answer) + '</div></div>';
      });
    }
    return '<div class="notes">' + head + tabsHTML + '<div class="notes-body">' + body + '</div></div>';
  }

  /* ====================================================================== *
   * EXPLORE
   * ====================================================================== */
  function pointsLeft() {
    var day = currentDay(), dr = currentDayRun();
    return Math.max(0, (day.explore_points || 0) - dr.asked.length);
  }

  /* ====================================================================== *
   * SUPPORT — who glows
   * ====================================================================== */
  function supportItemForPerson(day, personId) {
    var list = day.support || [];
    for (var i = 0; i < list.length; i++) if (list[i].person === personId) return list[i];
    return null;
  }
  function supportGlow(personId) {
    var day = currentDay(), dr = currentDayRun();
    var list = day.support || [];
    var item = supportItemForPerson(day, personId);
    if (!item) return 'none';
    if (dr.support[item.id]) return 'done';
    if (rules().support_order === 'any') return 'glow';
    for (var i = 0; i < list.length; i++) {
      if (!dr.support[list[i].id]) return list[i].person === personId ? 'glow' : 'wait';
    }
    return 'none';
  }
  function supportAllDone() {
    var day = currentDay(), dr = currentDayRun();
    return (day.support || []).every(function (it) { return !!dr.support[it.id]; });
  }

  /* ====================================================================== *
   * POPUPS
   * ====================================================================== */
  function modalHTML() {
    var m = state.ui.modal;
    if (!m) return '';
    var c = content(), day = currentDay(), dr = currentDayRun();

    if (m.type === 'restart') {
      return backdrop('<div class="modal"><div class="modal-body"><h2>' + esc(L('restart_title')) + '</h2>' +
        '<p>' + esc(L('restart_body')) + '</p></div><div class="modal-actions">' +
        '<button class="btn btn-quiet on-light" data-act="restart-cancel">' + esc(L('cancel')) + '</button>' +
        '<button class="btn" data-act="restart-confirm">' + esc(L('restart')) + '</button></div></div>');
    }
    if (m.type === 'day-intro') {
      var d = c.days[m.day];
      return backdrop('<div class="modal"><div class="modal-body"><h2>' + esc(d.name) + '</h2>' +
        '<p>' + textToHtml(d.intro) + '</p></div><div class="modal-actions">' +
        '<button class="btn" data-act="begin-day">' + esc(L('day_begin', { day: d.name })) + '</button></div></div>');
    }
    if (m.type === 'finish') {
      return backdrop('<div class="modal"><div class="modal-body"><h2>' + esc(L('finish_title')) + '</h2></div>' +
        '<div class="modal-actions"><button class="btn" data-act="see-results">' + esc(L('finish_button')) + '</button></div></div>');
    }
    if (m.type === 'ask') {
      var isPerson = m.target === 'person';
      var who = isPerson ? personById(day, m.id) : stationById(day, m.id);
      var qlist = isPerson ? rules().person_questions : rules().station_questions;
      var left = pointsLeft(), rows = '';
      qlist.forEach(function (q) {
        var asked = M.hasAsked(dr, m.target, m.id, [q.id]);
        rows += '<div class="ask-row' + (asked ? ' is-asked' : '') + '">' +
          (asked
            ? '<div class="ask-q">' + esc(q.label) + '</div><div class="ask-a">' + textToHtml(who.answers[q.id].text) + '</div>'
            : '<button class="ask-btn" data-act="ask-q" data-id="' + esc(q.id) + '"' + (left > 0 ? '' : ' disabled') + '>' +
                '<span>' + esc(q.label) + '</span><span class="ask-cost">' + esc(L('ask_point')) + '</span></button>') +
        '</div>';
      });
      return backdrop('<div class="modal is-auto"><div class="modal-body">' +
        '<h2>' + esc(L('ask_title', { name: who.name })) + '</h2>' +
        '<p class="ask-desc">' + (isPerson ? esc(who.role) + ' · ' : '') + textToHtml(who.description) + '</p>' +
        '<div class="ask-list">' + rows + '</div>' +
        (left > 0 ? '' : '<p class="ask-none">' + esc(L('ask_no_points')) + '</p>') +
        '</div><div class="modal-actions"><span class="ask-left">' + esc(L('explore_points')) + ': <b>' + left + '</b></span>' +
        '<button class="btn" data-act="modal-close">' + esc(L('ask_close')) + '</button></div></div>');
    }
    if (m.type === 'reason') {
      var p = personById(day, m.queue[0]);
      var st = stationById(day, dr.assignment[p.id]);
      var opts = rules().reasons.map(function (r) {
        return '<div class="choice" data-act="reason" data-id="' + esc(r.id) + '" role="button"><span class="radio" aria-hidden="true"></span><span class="label">' + esc(r.label) + '</span></div>';
      }).join('');
      return backdrop('<div class="modal is-auto"><div class="modal-body">' +
        '<h2>' + esc(L('reason_title', { name: p.name, station: st.name })) + '</h2>' +
        '<p>' + esc(L('reason_sub')) + '</p><div class="choice-list">' + opts + '</div></div></div>');
    }
    if (m.type === 'support-confirm') {
      var sp = personById(day, m.person);
      return backdrop('<div class="modal"><div class="modal-body"><h2>' + esc(L('support_confirm_title', { name: sp.name })) + '</h2></div>' +
        '<div class="modal-actions"><button class="btn btn-quiet on-light" data-act="modal-close">' + esc(L('support_confirm_no')) + '</button>' +
        '<button class="btn" data-act="support-read">' + esc(L('support_confirm_yes')) + '</button></div></div>');
    }
    if (m.type === 'support') {
      var item = M.resolveItem(day, dr, M.byId(day.support, m.item));
      var person = personById(day, item.person);
      var stNow = stationById(day, M.currentStation(day, dr, person.id));
      var head = '<div class="sq-head"><span class="avatar ' + AVATAR_TONES[day.people.indexOf(person) % AVATAR_TONES.length] + '">' + esc(initials(person.name)) + '</span>' +
        '<span><b>' + esc(person.name) + '</b><br><span class="sq-role">' + esc(person.role) + ' · ' + esc(L('at_station', { station: stNow ? stNow.name : '' })) + '</span></span></div>';
      if (m.submitted) {
        var chosen = M.byId(item.options, m.chosen);
        return backdrop('<div class="modal is-question"><div class="sq-body">' + head +
          '<h3 class="sq-outcome-title">' + esc(L('support_outcome_title')) + '</h3>' +
          '<p class="sq-outcome">' + textToHtml(personFill(day, dr, chosen.outcome, person.id)) + '</p></div>' +
          '<div class="modal-actions"><button class="btn" data-act="support-back">' + esc(L('support_close')) + '</button></div></div>');
      }
      var optsHTML = item.options.map(function (o) {
        var on = m.chosen === o.id;
        return '<div class="choice sq-option' + (on ? ' is-chosen' : '') + '" data-act="support-choose" data-id="' + esc(o.id) + '" role="radio" aria-checked="' + on + '">' +
          '<span class="radio" aria-hidden="true"></span><span class="label">' + textToHtml(personFill(day, dr, o.text, person.id)) + '</span></div>';
      }).join('');
      return backdrop('<div class="modal is-question"><div class="sq-body">' + head +
        '<p class="sq-question">' + textToHtml(personFill(day, dr, item.question, person.id)) + '</p>' +
        '<div class="choice-list">' + optsHTML + '</div></div>' +
        '<div class="modal-actions"><button class="btn" data-act="support-submit"' + (m.chosen ? '' : ' disabled') + '>' + esc(L('support_submit')) + '</button></div></div>');
    }
    return '';
  }
  function backdrop(inner) { return '<div class="modal-backdrop' + (steadyModal ? ' is-steady' : '') + '">' + inner + '</div>'; }

  /* ====================================================================== *
   * MOVING THROUGH THE GAME
   * ====================================================================== */
  function markLate(dr, key) {
    if (!timeIsUp()) return;
    if (dr) dr.late[key] = true; else state.run.late[key] = true;
  }

  function goToDay(index) {
    state.step = { kind: 'day', day: index, phase: content().days[index].phases[0] };
    state.ui.notesTab = 'team';
    state.ui.selected = null;
    enterPhase();
    state.ui.modal = { type: 'day-intro', day: index };
  }

  function enterPhase() {
    var day = currentDay(), dr = currentDayRun();
    if (!day.phases.length) return;
    if (state.step.phase === 'assign' || state.step.phase === 'support') {
      if (!Object.keys(dr.assignment).length) {
        for (var k in day.start_assignment) dr.assignment[k] = day.start_assignment[k];
      }
    }
    if (state.step.phase === 'reflect') { dr.reflectIndex = 0; dr.reflectChoice = null; }
  }

  function advance() {
    var s = state.step;
    if (s.kind === 'onboarding') {
      if (s.screen === 'brief') s.screen = 'rank';
      else if (s.screen === 'rank') { markLate(null, 'onboarding'); s.screen = 'answers'; }
      else { goToDay(0); }
      render(); return;
    }
    var day = currentDay(), dr = currentDayRun();
    if (s.phase === 'assign' && !everyonePlaced()) return;
    if (s.phase === 'assign' && rules().ask_reason_for_unmoved) {
      var missing = day.people.filter(function (p) { return !dr.reasons[p.id]; }).map(function (p) { return p.id; });
      if (missing.length && !state.ui.unmovedAsked) {
        state.ui.unmovedAsked = true;
        state.ui.modal = { type: 'reason', queue: missing, thenAdvance: true };
        render(); return;
      }
    }
    state.ui.unmovedAsked = false;
    if (s.phase === 'reflect') {
      var list = day.reflect || [];
      var item = list[dr.reflectIndex];
      if (!dr.reflectChoice) return;
      dr.reflect[item.id] = dr.reflectChoice;
      markLate(dr, 'reflect-' + item.id);
      if (dr.reflectIndex + 1 < list.length) {
        dr.reflectIndex++;
        dr.reflectChoice = null;
        render(); return;
      }
    }
    if (s.phase === 'assign') markLate(dr, 'assign');
    var next = day.phases.indexOf(s.phase) + 1;
    if (next < day.phases.length) {
      s.phase = day.phases[next];
      state.ui.selected = null;
      enterPhase();
    } else if (s.day + 1 < content().days.length) {
      goToDay(s.day + 1);
    } else {
      state.timer.running = false;
      state.ui.modal = { type: 'finish' };
    }
    render();
  }

  function moveRank(qid, toIndex) {
    var order = state.run.onboarding.order;
    var from = order.indexOf(qid);
    if (from < 0 || toIndex < 0 || toIndex >= order.length || from === toIndex) return;
    order.splice(from, 1);
    order.splice(toIndex, 0, qid);
  }

  /* Place a person on a station. When the station already has someone,
     rules.occupied_station decides what happens to them:
       "bump" (D34): they go back to the team strip as "not placed", and only
                     the person you moved is asked for a reason. They are
                     asked when you place them yourself.
       "swap" (D23): the two people swap, and both are asked for a reason. */
  function placePerson(personId, stationId) {
    var day = currentDay(), dr = currentDayRun();
    var from = dr.assignment[personId] || null;
    state.ui.selected = null;
    if (!stationById(day, stationId) || from === stationId) { render(); return; }
    var occupant = null;
    for (var pid in dr.assignment) if (dr.assignment[pid] === stationId) occupant = pid;
    dr.assignment[personId] = stationId;
    var queue = [personId];
    if (occupant) {
      if (rules().occupied_station === 'swap' && from) {
        dr.assignment[occupant] = from;
        queue.push(occupant);
      } else {
        dr.assignment[occupant] = null;
        delete dr.reasons[occupant];
      }
    }
    queue.forEach(function (id) { delete dr.reasons[id]; });
    state.ui.modal = { type: 'reason', queue: queue };
    render();
  }

  function restartRun() {
    var c = state.content, loggedIn = state.loggedIn;
    state = freshRun(c);
    state.loggedIn = loggedIn;
    state.phase = 'start';
    render();
  }

  /* ====================================================================== *
   * CLICKS
   * ====================================================================== */
  var suppressClick = false;
  document.addEventListener('click', function (e) {
    if (suppressClick) { suppressClick = false; e.preventDefault(); return; }
    var el = e.target.closest('[data-act]');
    if (!el || !state || el.disabled) return;
    var act = el.getAttribute('data-act'), id = el.getAttribute('data-id');
    var day = currentDay(), dr = currentDayRun(), m = state.ui.modal;

    switch (act) {
      case 'start':
        state.phase = 'game';
        state.step = { kind: 'onboarding', screen: 'brief' };
        startTimer();
        break;
      case 'continue': advance(); return;
      case 'restart': state.ui.prevModal = state.ui.modal; state.ui.modal = { type: 'restart' }; break;
      case 'restart-cancel': state.ui.modal = state.ui.prevModal; state.ui.prevModal = null; break;
      case 'restart-confirm': restartRun(); return;
      case 'fullscreen': toggleFullscreen(); return;
      case 'rank-up': moveRank(id, state.run.onboarding.order.indexOf(id) - 1); break;
      case 'rank-down': moveRank(id, state.run.onboarding.order.indexOf(id) + 1); break;
      case 'notes-toggle': state.ui.notesOpen = !state.ui.notesOpen; break;
      case 'notes-tab': state.ui.notesTab = id; break;
      case 'begin-day': state.ui.modal = null; break;
      case 'see-results':
        state.ui.modal = null;
        state.result = M.markRun(content(), state.run);
        state.phase = 'results';
        window.scrollTo(0, 0);
        break;
      case 'ask-person': state.ui.modal = { type: 'ask', target: 'person', id: id }; break;
      case 'ask-station': state.ui.modal = { type: 'ask', target: 'station', id: id }; break;
      case 'ask-q':
        if (m && m.type === 'ask' && pointsLeft() > 0 && !M.hasAsked(dr, m.target, m.id, [id])) {
          dr.asked.push({ target: m.target, id: m.id, q: id });
          markLate(dr, 'explore-' + (dr.asked.length - 1));
        }
        break;
      case 'modal-close': state.ui.modal = null; break;
      case 'select-person':
        if (state.step.phase !== 'assign') return;
        state.ui.selected = state.ui.selected === id ? null : id;
        e.stopPropagation();
        break;
      case 'place-station':
        if (state.step.phase === 'assign' && state.ui.selected) { placePerson(state.ui.selected, id); return; }
        return;
      case 'reason':
        if (m && m.type === 'reason') {
          dr.reasons[m.queue[0]] = id;
          m.queue.shift();
          if (!m.queue.length) { var then = m.thenAdvance; state.ui.modal = null; if (then) { advance(); return; } }
        }
        break;
      case 'support-open':
        var item = supportItemForPerson(day, id);
        if (!item || supportGlow(id) !== 'glow') return;
        state.ui.modal = rules().confirm_before_support
          ? { type: 'support-confirm', person: id, item: item.id }
          : { type: 'support', person: id, item: item.id, chosen: null, submitted: false };
        break;
      case 'support-read':
        if (m) state.ui.modal = { type: 'support', person: m.person, item: m.item, chosen: null, submitted: false };
        break;
      case 'support-choose': if (m && m.type === 'support' && !m.submitted) m.chosen = id; break;
      case 'support-submit':
        if (m && m.type === 'support' && m.chosen) {
          dr.support[m.item] = m.chosen;
          markLate(dr, 'support-' + m.item);
          if (rules().show_support_outcomes) m.submitted = true; else state.ui.modal = null;
        }
        break;
      case 'support-back': state.ui.modal = null; break;
      case 'reflect-choose': dr.reflectChoice = id; break;
      case 'toggle-block':
        state.ui.openBlocks[id] = !state.ui.openBlocks[id];
        break;
      case 'print': window.print(); return;
      case 'csv': downloadCsv(); return;
      default: return;
    }
    render();
  });

  /* ====================================================================== *
   * DRAGGING — pointer events (mouse, pen and touch alike). A press that
   * does not move is left to the click handler, which is the
   * click-to-select-then-click-to-place fallback.
   * ====================================================================== */
  var drag = null;
  document.addEventListener('pointerdown', function (e) {
    if (!state || state.ui.modal || e.button > 0) return;
    var el = e.target.closest('[data-drag]');
    if (!el || e.target.closest('button')) return;
    var kind = el.getAttribute('data-drag');
    if (kind === 'person' && !(state.step && state.step.phase === 'assign')) return;
    drag = { kind: kind, id: el.getAttribute('data-id'), el: el, x: e.clientX, y: e.clientY, moved: false, ghost: null, over: null };
  });
  document.addEventListener('pointermove', function (e) {
    if (!drag) return;
    if (!drag.moved) {
      if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 6) return;
      drag.moved = true;
      var r = drag.el.getBoundingClientRect();
      drag.dx = e.clientX - r.left; drag.dy = e.clientY - r.top;
      drag.ghost = drag.el.cloneNode(true);
      drag.ghost.classList.add('drag-ghost');
      drag.ghost.style.width = r.width + 'px';
      document.body.appendChild(drag.ghost);
      drag.el.classList.add('is-dragging');
    }
    e.preventDefault();
    drag.ghost.style.left = (e.clientX - drag.dx) + 'px';
    drag.ghost.style.top = (e.clientY - drag.dy) + 'px';
    var under = document.elementFromPoint(e.clientX, e.clientY);
    var target = under ? (drag.kind === 'person' ? under.closest('[data-station]') : under.closest('[data-rank-slot]')) : null;
    if (drag.over && drag.over !== target) drag.over.classList.remove('is-over');
    if (target) target.classList.add('is-over');
    drag.over = target;
  }, { passive: false });
  function endDrag(e, cancelled) {
    if (!drag) return;
    var d = drag; drag = null;
    if (!d.moved) return;
    suppressClick = true;
    setTimeout(function () { suppressClick = false; }, 0);
    if (d.ghost) d.ghost.remove();
    if (d.over) d.over.classList.remove('is-over');
    if (cancelled || !d.over) { render(); return; }
    if (d.kind === 'person') placePerson(d.id, d.over.getAttribute('data-station'));
    else { moveRank(d.id, parseInt(d.over.getAttribute('data-rank-slot'), 10)); render(); }
  }
  document.addEventListener('pointerup', function (e) { endDrag(e, false); });
  document.addEventListener('pointercancel', function (e) { endDrag(e, true); });

  /* ====================================================================== *
   * RESULTS
   * ====================================================================== */
  var LOCK_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>';

  function ordinal(n) {
    var tens = n % 100, ones = n % 10;
    if (tens >= 11 && tens <= 13) return 'th';
    return ones === 1 ? 'st' : ones === 2 ? 'nd' : ones === 3 ? 'rd' : 'th';
  }
  function zoneTone(index, count) {
    if (index === 0) return 'grey';
    var fromTop = count - 1 - index;
    return fromTop === 0 ? 'green' : fromTop === 1 ? 'lightgreen' : 'amber';
  }

  /* THE "WHERE YOU STAND" CARD — copied from Sea Wolf / Redrock (identical on
     every product). Every figure is worked out in marking.js. */
  function standingHTML() {
    var r = state.result;
    var bench = content().benchmark;
    if (!bench || r.percentile === null || r.percentile === undefined) return '';
    var zones = bench.zones || [];
    var p = r.percentile;
    var tone = r.zone ? zoneTone(r.zone.index, zones.length) : 'grey';

    var cells = '', nums = '';
    for (var d = 1; d <= 10; d++) {
      var z = M.zoneOf((d - 1) * 10, zones);
      cells += '<span class="band-cell tone-' + (z ? zoneTone(z.index, zones.length) : 'grey') + '"></span>';
      nums += '<span>' + d + '</span>';
    }
    var cellIndex = Math.min(9, Math.floor(p / 10));
    var left = 'calc((100% - 36px) * ' + (p / 100) + ' + ' + (cellIndex * 4) + 'px)';

    var legend = '';
    for (var i = 0; i < zones.length; i++) {
      var range = i === 0 ? ''
                : (i === zones.length - 1 ? zones[i].from + '+'
                                          : zones[i].from + '–' + (zones[i + 1].from - 1)) + ' · ';
      legend += '<span class="legend-item"><i class="tone-' + zoneTone(i, zones.length) + '"></i>' +
                esc(range) + textToHtml(zones[i].label) + '</span>';
    }

    return '<section class="standing tone-' + tone + '" aria-label="Where you stand">' +
      '<div class="standing-main">' +
        '<div class="standing-left">' +
          '<div class="standing-figure">' +
            '<span class="standing-number">' + p + '</span>' +
            '<span class="standing-ordinal">' + ordinal(p) + '</span>' +
            '<span class="standing-word">percentile</span>' +
          '</div>' +
          '<div class="standing-pill">Decile ' + r.decile + ' · top ' + r.topShare + '%' +
            (r.zone ? ' · ' + textToHtml(r.zone.label) : '') + '</div>' +
          '<p class="standing-sentence">Estimated: your weighted score of <b>' +
            showScore(r.weighted) + ' / 100</b> beats about <b>' + p + ' in 100</b> candidates ' +
            'who practised this simulation.</p>' +
        '</div>' +
        '<div class="standing-right">' +
          '<div class="band" role="img" aria-label="Decile band, you are at the ' + p + ordinal(p) +
            ' percentile">' +
            '<div class="band-marker" style="left:' + left + '">' +
              '<span class="marker-label">You · ' + p + ordinal(p) + '</span>' +
              '<span class="marker-arrow"></span>' +
              '<span class="marker-line"></span>' +
            '</div>' +
            '<div class="band-cells">' + cells + '</div>' +
            '<div class="band-nums">' + nums + '</div>' +
          '</div>' +
          '<div class="band-legend">' + legend + '</div>' +
        '</div>' +
      '</div>' +
      (bench.note ? '<p class="standing-note">' + textToHtml(bench.note) + '</p>' : '') +
    '</section>';
  }

  function markIcon(points, of) {
    if (of > 0 && points >= of) return '<span class="mark-icon ok">✓</span>';
    if (points > 0) return '<span class="mark-icon part">◐</span>';
    return '<span class="mark-icon bad">✗</span>';
  }
  function rowClass(points, of) { return of > 0 && points >= of ? 'is-right' : points > 0 ? 'is-partial' : 'is-wrong'; }
  function lateTag(late) { return late ? ' <span class="late-tag">' + esc(L('late')) + '</span>' : ''; }
  function pts(points, of) { return '<span class="row-points">' + showScore(points) + ' / ' + showScore(of) + '</span>'; }

  function resultsHTML() {
    var c = content(), r = state.result, demo = c.results_mode === 'demo';
    var totals = r.phaseTotals, tiles = '';
    M.PHASES.forEach(function (ph) {
      var t = totals[ph];
      if (!t || !(t.of > 0)) return;
      tiles += '<div class="tile' + (t.score >= t.of ? ' is-best' : '') + '"><div class="tile-name">' + esc(L('tile_' + ph)) + '</div>' +
        '<div class="tile-score">' + showScore(t.score) + '</div><div class="tile-best">' + esc(L('out_of', { n: showScore(t.of) })) + '</div></div>';
    });
    var summary = '<div class="summary-line">' + esc(L('weighted_line', { n: showScore(r.weighted) })) +
      '<span class="sep">·</span>' +
      (state.timer.left > 0 ? esc(L('time_left_line', { n: Math.floor(state.timer.left / 60) })) : esc(L('time_up_line'))) + '</div>';

    var blocks = '';
    if (demo) {
      blocks = '<div class="demo-note"><span class="lock">' + LOCK_ICON + '</span>' + esc(L('demo_note')) + '</div>';
      blocks += lockedBlock(L('onboarding'), r.onboarding);
      c.days.forEach(function (d, i) { blocks += lockedBlock(d.name, dayTotal(r.days[i])); });
    } else {
      blocks += block('onboarding', L('onboarding'), r.onboarding, onboardingRows(r.onboarding));
      c.days.forEach(function (d, i) { blocks += block(d.id, d.name, dayTotal(r.days[i]), dayRows(d, i, r.days[i])); });
    }

    return '<div class="results' + (demo ? ' is-demo' : '') + '"><div class="results-inner">' +
      '<div class="results-top"><h1>' + esc(L('results_title')) + '</h1><div class="results-actions">' +
        (demo ? '' : '<button class="btn-quiet on-light" data-act="print">' + esc(L('print')) + '</button>' +
                     '<button class="btn-quiet on-light" data-act="csv">' + esc(L('csv')) + '</button>') +
        '<button class="btn" data-act="restart-confirm">' + esc(L('restart')) + '</button>' +
      '</div></div>' +
      standingHTML() +
      '<div class="tiles">' + tiles + '</div>' + summary + blocks +
    '</div></div>';
  }

  function dayTotal(dayResult) {
    var s = 0, o = 0;
    ['explore', 'assign', 'support', 'reflect'].forEach(function (k) { if (dayResult[k]) { s += dayResult[k].score; o += dayResult[k].of; } });
    return { score: Math.round(s * 100) / 100, of: Math.round(o * 100) / 100 };
  }
  function block(key, title, total, body) {
    var open = !!state.ui.openBlocks[key];
    return '<section class="r-block' + (open ? ' is-open' : '') + '">' +
      '<button class="r-block-head" data-act="toggle-block" data-id="' + esc(key) + '" aria-expanded="' + open + '">' +
        '<span class="r-caret" aria-hidden="true">▸</span><span class="r-title">' + esc(title) + '</span>' +
        '<span class="r-score">' + showScore(total.score) + ' / ' + showScore(total.of) + '</span></button>' +
      (open ? '<div class="r-block-body">' + body + '</div>' : '') + '</section>';
  }
  function lockedBlock(title, total) {
    return '<section class="r-block is-locked"><div class="r-block-head"><span class="lock" aria-hidden="true">' + LOCK_ICON + '</span>' +
      '<span class="r-title">' + esc(title) + '</span><span class="r-score">' + showScore(total.score) + ' / ' + showScore(total.of) + '</span></div></section>';
  }
  function row(points, of, main, detail, why, late) {
    return '<div class="mark-row ' + rowClass(points, of) + '">' + markIcon(points, of) +
      '<div class="row-text"><div class="row-main">' + main + lateTag(late) + '</div>' +
      (detail ? '<div class="row-detail">' + detail + '</div>' : '') +
      (why ? '<div class="mark-reason">' + why + '</div>' : '') + '</div>' + pts(points, of) + '</div>';
  }
  function sub(title, phaseResult) {
    return '<div class="r-sub"><span>' + esc(title) + '</span><span class="r-sub-score">' + showScore(phaseResult.score) + ' / ' + showScore(phaseResult.of) + '</span></div>';
  }

  function onboardingRows(res) {
    var html = '';
    res.items.slice().sort(function (a, b) { return a.recommended - b.recommended; }).forEach(function (it) {
      html += row(it.points, it.of, textToHtml(it.question.text),
        esc(L('your_answer')) + ': <b>' + (it.yourPosition || '—') + '</b> · ' + esc(L('our_view')) + ': <b>' + it.recommended + '</b>',
        textToHtml(it.question.why), it.late);
    });
    return html;
  }

  function dayRows(day, di, dres) {
    var c = content(), dr = state.run.days[di], html = '';
    if (dres.explore) {
      html += sub(L('phase_explore'), dres.explore);
      if (!dres.explore.items.length) html += row(0, dres.explore.of, esc(L('not_answered')), '', '', false);
      dres.explore.items.forEach(function (it) {
        var qlist = it.asked.target === 'person' ? c.rules.person_questions : c.rules.station_questions;
        var q = M.byId(qlist, it.asked.q);
        html += row(it.points, it.of, esc(it.who ? it.who.name : '') + ': “' + esc(q ? q.label : it.asked.q) + '”',
          it.answer ? textToHtml(it.answer.text) : '', it.answer ? textToHtml(it.answer.why) : '', it.late);
      });
      if (dres.explore.unspent) html += '<div class="r-note">' + esc(L('unused_points', { n: dres.explore.unspent })) + '</div>';
    }
    if (dres.assign) {
      html += sub(L('phase_assign'), dres.assign);
      dres.assign.items.forEach(function (it) {
        var good = it.goodStations.map(function (sid) { var s = stationById(day, sid); return s ? s.name : sid; }).join(' or ');
        var reasonText = it.reason
          ? esc(it.reason.label) + (it.consistent ? '' : ' <span class="flag">(' + esc(L('reason_flag')) + ')</span>')
          : '<span class="muted">' + esc(L('reason_none')) + '</span>';
        html += row(it.points, it.of, esc(it.person.name) + ' → ' + esc(it.station ? it.station.name : '—'),
          esc(L('your_answer')) + ': ' + reasonText + ' · ' + esc(L('our_view')) + ': <b>' + esc(good) + '</b>',
          textToHtml(it.person.placement_why), it.late);
      });
    }
    if (dres.support) {
      html += sub(L('phase_support'), dres.support);
      dres.support.items.forEach(function (it) {
        var q = personFill(day, dr, it.item.question, it.person.id);
        var chosenText = it.chosen ? textToHtml(personFill(day, dr, it.chosen.text, it.person.id)) : esc(L('not_answered'));
        var detail = esc(L('your_answer')) + ': ' + chosenText +
          (it.chosen && it.chosen.id !== it.recommended.id
            ? '<br>' + esc(L('recommended_label')) + ': ' + textToHtml(personFill(day, dr, it.recommended.text, it.person.id)) : '');
        var why = (it.chosen ? textToHtml(it.chosen.why) : '') +
          (it.chosen && it.chosen.id !== it.recommended.id ? ' ' + textToHtml(it.recommended.why) : '');
        html += row(it.points, it.of, '<span class="q-short">' + textToHtml(q) + '</span>', detail, why, it.late);
      });
    }
    if (dres.reflect) {
      html += sub(L('phase_reflect'), dres.reflect);
      dres.reflect.items.forEach(function (it) {
        html += row(it.points, it.of, textToHtml(personFill(day, dr, it.item.prompt, it.item.person)),
          esc(L('your_answer')) + ': <b>' + esc(it.chosen ? it.chosen.label : L('not_answered')) + '</b> · ' + esc(L('our_view')) + ': <b>' + esc(it.truth ? it.truth.label : '—') + '</b>',
          textToHtml(it.item.why), it.late);
      });
    }
    return html;
  }

  /* ---- CSV: the same rows, as a file named from the title (never a version) */
  function csvFileName(title) {
    var slug = String(title || 'simulation').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return (slug || 'simulation') + '-results.csv';
  }
  function downloadCsv() {
    var c = content(), r = state.result, rows = [['Section', 'Item', 'Your answer', 'Our view', 'Points', 'Out of', 'Late']];
    r.onboarding.items.forEach(function (it) {
      rows.push([L('onboarding'), it.question.text, it.yourPosition, it.recommended, it.points, it.of, it.late ? 'yes' : '']);
    });
    c.days.forEach(function (day, di) {
      var d = r.days[di], dr = state.run.days[di];
      if (d.explore) d.explore.items.forEach(function (it) {
        rows.push([day.name + ' ' + L('phase_explore'), (it.who ? it.who.name : '') + ': ' + it.asked.q, it.answer ? it.answer.text : '', it.useful ? 'useful' : 'not needed', it.points, it.of, it.late ? 'yes' : '']);
      });
      if (d.assign) d.assign.items.forEach(function (it) {
        rows.push([day.name + ' ' + L('phase_assign'), it.person.name, (it.station ? it.station.name : '') + (it.reason ? ' (' + it.reason.label + ')' : ''), it.goodStations.join(' or '), it.points, it.of, it.late ? 'yes' : '']);
      });
      if (d.support) d.support.items.forEach(function (it) {
        rows.push([day.name + ' ' + L('phase_support'), it.person.name, it.chosen ? it.chosen.text : '', it.recommended.text, it.points, it.of, it.late ? 'yes' : '']);
      });
      if (d.reflect) d.reflect.items.forEach(function (it) {
        rows.push([day.name + ' ' + L('phase_reflect'), personFill(day, dr, it.item.prompt, it.item.person), it.chosen ? it.chosen.label : '', it.truth ? it.truth.label : '', it.points, it.of, it.late ? 'yes' : '']);
      });
    });
    rows.push(['Total', 'Weighted score', r.weighted, '', '', 100, '']);
    rows.push(['Total', 'Estimated percentile', r.percentile, '', '', '', '']);
    var csv = rows.map(function (row) {
      return row.map(function (v) { var s = String(v === null || v === undefined ? '' : v); return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(',');
    }).join('\r\n');
    var blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = csvFileName(c.title);
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ====================================================================== *
   * START-UP
   * ====================================================================== */
  function showMessage(title, lines) {
    app.innerHTML = '<div class="centre-screen"><div class="panel wide"><h1>' + esc(title) + '</h1>' +
      '<ul class="error-list">' + lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></div></div>';
  }

  function boot() {
    checkSize();
    app.innerHTML = '<div class="centre-screen"><div class="panel"><h1>Loading…</h1></div></div>';
    var name = CONTENT.nameFromUrl(window.location.search, CONFIG.content);
    CONTENT.load(name).then(function (loaded) {
      if (!loaded.ok) { showMessage('This simulation’s content could not be used', loaded.errors); return; }
      if (loaded.warnings && loaded.warnings.length && window.console) console.warn('Content warnings:\n' + loaded.warnings.join('\n'));
      state = freshRun(loaded.content);
      state.phase = CONFIG.requireLogin ? 'login' : 'start';
      state.loggedIn = !CONFIG.requireLogin;
      document.title = loaded.content.title;
      render();
    });
  }

  /* Test hook: lets an automated check read the state. Not used by the page. */
  window.__sfl = { getState: function () { return state; } };

  boot();
})();
