/* ==========================================================================
   SUSTAINABLE FUTURES LAB — CONTENT FILE (scenario: Kereni Island)

   EVERYTHING THE CANDIDATE READS, AND EVERY NUMBER THAT SHAPES THE GAME,
   IS IN THIS FILE. Read EDITING-GUIDE.md before changing it.

   Quick rules for editing safely:
   · Text goes inside "double quote marks". To use a quote mark inside text,
     write \" (or use ' single quotes inside the text instead).
   · Every item in a list or group ends with a comma, except that a comma
     after the last item is also fine.
   · Lines starting with // are notes for us. The simulation ignores them.
   · If you break something, the simulation will not start and will show a
     list of what to fix. Nothing broken ever reaches a customer silently.

   Notes marked "UNCONFIRMED" are values that depend on what candidates tell
   us. Each one names the open question (SQ-number) in SFL-Master-Doc.md section 6.3.
   ========================================================================== */
window.SFL_CONTENT = {

  title: "Sustainable Futures Lab Simulation",   // login heading, page title, results file name

  time_limit_minutes: 30,        // UNCONFIRMED (derived from a 95-minute invitation)

  results_mode: "full",          // "full" = everything explained; "demo" = percentile and scores only

  /* ---------------------------------------------------------------------
     RULES — how the game behaves. Change a value here, not the code.
     --------------------------------------------------------------------- */
  rules: {

    // Questions the candidate can ask a TEAM MEMBER in Explore (each costs 1 point).
    // The ids ("want", "strengths", "weaknesses") are used in every person's answers below.
    person_questions: [
      { id: "want",       label: "What would you like to work on?" },
      { id: "strengths",  label: "What are you good at?" },
      { id: "weaknesses", label: "What are you less good at?" }
    ],

    // Questions the candidate can ask a WORK STATION in Explore.
    station_questions: [
      { id: "task",   label: "What task needs doing here?" },
      { id: "skills", label: "What skills does this station need?" }
    ],

    // The reasons offered after each move in Assign. Wording is ours, adapted from
    // one candidate's account (UNCONFIRMED, SQ12).
    // "needs" says what the candidate must have asked for the reason to be honest.
    // A reason with no needs (Coverage) is always accepted.
    reasons: [
      { id: "station-requirements", label: "Workspace requirements (what the station needs done)",
        needs: [ { target: "station", questions: ["task"] } ] },
      { id: "station-skills",       label: "Workspace skills (the skills the station needs)",
        needs: [ { target: "station", questions: ["skills"] } ] },
      { id: "person-preference",    label: "Employee preference (what this person wants to work on)",
        needs: [ { target: "person", questions: ["want"] } ] },
      { id: "person-skills",        label: "Employee skills (what this person is good or less good at)",
        needs: [ { target: "person", questions: ["strengths", "weaknesses"] } ] },
      { id: "coverage",             label: "Coverage (making sure every station has someone, based on the descriptions)",
        needs: [] }
    ],

    // Answer options used in Reflect when a question does not list its own.
    reflect_default_options: [
      { id: "positive", label: "Positive" },
      { id: "neutral",  label: "Neutral" },
      { id: "negative", label: "Negative" },
      { id: "idk",      label: "I don't know" }
    ],
    reflect_idk_option_id: "idk",      // which option id means "I don't know"

    support_order: "fixed",            // UNCONFIRMED (SQ23). "fixed" = one person glows at a time, in the order below; "any" = all glow
    occupied_station: "bump",          // UNCONFIRMED (SQ17). What happens when you drop someone onto a station that already has a person.
                                       // "bump" = the person already there goes back to the team strip as "not placed" and must be placed again (only the person you moved is asked why);
                                       // "swap" = the two people swap stations and both are asked why
    confirm_before_support: true,      // REPORTED. Ask "Read X's message?" before showing it
    show_support_outcomes: true,       // UNCONFIRMED (SQ13). Show what happened after each Support answer
    ask_reason_for_unmoved: false,     // UNCONFIRMED (SQ6). true = also ask a reason for people left where they started
    notes_in_reflect: false,           // UNCONFIRMED (SQ22). true = notes panel also shown on Reflect screens
    notes_include_onboarding: true,    // Assumed for the prototype (SQ20). Onboarding answers in a "Project" notes tab
    can_skip_explore_points: true      // true = Continue works even with explore points left
  },

  /* ---------------------------------------------------------------------
     SCORING — our own marking. McKinsey publishes nothing about it.
     --------------------------------------------------------------------- */
  scoring: {
    onboarding: {
      // points for a question placed 0, 1, 2, 3 places away from our recommended position
      points_by_distance: [1, 0.5, 0, 0]
    },
    explore: {
      points_useful: 1,        // a question whose answer is marked useful: true
      points_not_useful: 0     // a question on something you could already work out
    },
    assign: {
      placement_points: 1,     // person on one of their good_stations
      reason_points: 0.5       // the reason matches what was actually asked (UNCONFIRMED whether real game scores it, SQ5)
    },
    support: {
      tier_points: { recommended: 1, acceptable: 1, weak: 0 }   // only clearly weak options lose marks
    },
    reflect: {
      points_correct: 1,
      points_idk_when_known: 0  // "I don't know" when the day did show what happened
    }
  },

  /* ---------------------------------------------------------------------
     THE PERCENTILE CARD — the table and zones are the same on every
     CaseMentor simulation. Weights say how much each phase counts (out of 100).
     --------------------------------------------------------------------- */
  benchmark: {
    note: "This percentile is our own estimate for this simulation, not a McKinsey figure. McKinsey does not publish how this game is scored, and parts of the game are still being confirmed, so we score how closely your choices match the approach we teach. In Support, any reasonable response earns full marks; only clearly weak ones do not. Candidates who pass typically score in the top quartile, but we recommend aiming for the 90th and above.",
    phase_weights: { onboarding: 10, explore: 15, assign: 25, support: 25, reflect: 25 },
    zones: [
      { from: 0,  label: "Below 70th" },
      { from: 70, label: "Borderline" },
      { from: 80, label: "Likely pass" },
      { from: 90, label: "Comfortable" }
    ],
    percentiles: [[0,1],[20,5],[35,12],[45,20],[55,30],[62,40],[68,50],[74,60],[79,68],[84,75],[88,80],[91,85],[94,90],[96,94],[98,97],[100,99]]
  },

  /* ---------------------------------------------------------------------
     WORDS ON BUTTONS AND SCREENS
     {name}, {station}, {day}, {minutes}, {n}, {total} are filled in automatically.
     --------------------------------------------------------------------- */
  labels: {
    login_lede: "Please sign in to begin.",
    start_button: "Start",
    continue: "Continue",
    restart: "Restart",
    restart_title: "Restart the simulation?",
    restart_body: "Your answers will be lost.",
    cancel: "Cancel",
    fullscreen: "Full screen",
    exit_fullscreen: "Exit full screen",
    timer_min: "min",
    timer_up: "Time's up",
    timer_paused: "Timer paused",
    onboarding: "Onboarding",
    onboarding_brief: "Project brief",
    onboarding_rank: "Rank questions",
    onboarding_answers: "Answers",
    onboarding_answers_heading: "Here are the answers to all four questions",
    rank_hint: "Drag the questions into order, or use the arrows. 1 = ask first.",
    move_up: "Move up",
    move_down: "Move down",
    phase_explore: "Explore",
    phase_assign: "Assign",
    phase_support: "Support",
    phase_reflect: "Reflect",
    explore_points: "Explore points",
    explore_hint: "Click a team member or a work station to ask a question. Each question costs 1 point.",
    assign_hint: "Drag team members onto work stations, or click a person and then a station.",
    assign_hint_unplaced: "Someone is not placed. Place everyone on a work station before you continue.",
    not_placed: "Not placed",
    support_hint: "Click the glowing team member to read their message.",
    support_hint_any: "Click a glowing team member to read their message.",
    ask_title: "Ask {name}",
    ask_point: "1 point",
    ask_no_points: "You have no explore points left.",
    ask_close: "Close",
    reason_title: "Why did you place {name} at {station}?",
    reason_sub: "Choose the reason that best matches your decision.",
    support_confirm_title: "Read {name}'s message?",
    support_confirm_yes: "Read",
    support_confirm_no: "Not now",
    support_submit: "Submit",
    support_outcome_title: "What happened",
    support_close: "Back to the map",
    reflect_counter: "Question {n} of {total}",
    notes_title: "Notes",
    notes_team: "Team",
    notes_stations: "Stations",
    notes_project: "Project",
    notes_nothing: "Nothing asked yet",
    at_station: "at {station}",
    day_begin: "Begin {day}",
    finish_title: "You have completed the simulation",
    finish_button: "See your results",
    results_title: "Your result",
    print: "Print",
    csv: "Download CSV",
    tile_onboarding: "Onboarding",
    tile_explore: "Explore",
    tile_assign: "Assign",
    tile_support: "Support",
    tile_reflect: "Reflect",
    out_of: "out of {n}",
    late: "answered after time ran out",
    weighted_line: "Weighted score {n} / 100",
    time_left_line: "Finished with {n} min left",
    time_up_line: "Time ran out before the end; late answers are marked",
    your_answer: "Your answer",
    our_view: "Our view",
    not_answered: "Not answered",
    recommended_label: "Recommended",
    reason_flag: "you had not asked what this reason relies on",
    reason_none: "no reason asked (not moved)",
    unused_points: "{n} explore point(s) not used",
    demo_note: "This is the free demo, which shows your score and percentile only. Our full simulations come with every answer explained in detail."
  },

  /* ---------------------------------------------------------------------
     START SCREEN
     --------------------------------------------------------------------- */
  start: {
    heading: "Sustainable Futures Lab",
    body: "You will lead a sustainability project through an Onboarding step and three days. Each day has four parts: Explore, Assign, Support and Reflect. Each day starts fresh.\n\nYou have {minutes} minutes. You cannot go back to an earlier part. Keep notes as you go: you will need them."
  },

  /* ---------------------------------------------------------------------
     ONBOARDING — the brief, then rank the clarifying questions.
     All answers are shown whatever the order (REPORTED).
     --------------------------------------------------------------------- */
  onboarding: {
    // The brief can use layout marks: a blank line (\n\n) starts a paragraph, **Heading** on its own line is a heading,
    // and a line starting with "- " is a bullet point. See EDITING-GUIDE.md section 4.
    context: "**Kereni Island Restoration Project**\n\n**Background**\nKereni is a small island of steep hills, with a fishing village on its only bay. Years of grazing stripped much of the native plant cover from the hillsides, and it has never grown back. Without roots to hold it, soil washes into the stream and the bay whenever it rains, clouding the water and threatening a seabird colony that nests on the northern cliffs. Visitors come from the mainland to see the birds, and the village has watched the bay change with growing concern.\n\n**Your role**\nYou are leading a team of four for the next three days, before the rainy season begins. The work is spread across several stations on the island, and each day brings new tasks.\n\n**The aim**\n- Protect the most damaged slopes before the rains\n- Keep the seabird colony safe\n\n**Stakeholders**\n- The island council, which funds the project\n- The fishing village on the bay, which depends on clear water and beach access\n- A small tour operator, who runs boat trips to the colony",
    rank_prompt: "Before you start, which questions would you ask first?",
    questions: [
      { id: "goal",
        text: "What exactly must the project achieve in these three days, and how will the council judge success?",
        answer: "The council wants planting and soil protection in place on the two worst slopes before the rains, with no drop in the number of nesting seabirds. Success is judged on both.",
        recommended_position: 1,
        why: "This is the blocker. Without knowing the goal, none of the other answers can be put to use." },
      { id: "site",
        text: "What condition are the slopes and the stream in right now?",
        answer: "The northern slopes are the worst, with large patches of bare soil. The stream already turns muddy after light rain.",
        recommended_position: 2,
        why: "Once you know the goal, understand the site before planning the work. Understanding comes before aligning people." },
      { id: "team",
        text: "What does each team member see as the biggest risk to the plan?",
        answer: "Maya worries most about erosion, Daniel about disturbing the nesting birds, Priya about how the village will react, and Tom about unreliable equipment.",
        recommended_position: 3,
        why: "Align your own team next. Their views matter most once you know the goal and the site." },
      { id: "stakeholders",
        text: "Which local groups are affected by the work, and what do they care about?",
        answer: "The fishing village cares about clear water and beach access, the tour operator wants boat trips to continue, and the council cares about cost and results.",
        recommended_position: 4,
        why: "Outside groups matter, but knowing who they are is most useful once the goal is clear and the team agrees its plan." }
    ]
  },

  /* ---------------------------------------------------------------------
     THE DAYS. Add or remove a whole { ... } block to change the number of
     days (UNCONFIRMED, SQ1). Each day is independent.
     --------------------------------------------------------------------- */
  days: [

    /* ================================ DAY 1 ================================ */
    {
      id: "day1",
      name: "Day 1",
      intro: "Rain is forecast later this week. Today the team starts work around the northern slopes.",
      phases: ["explore", "assign", "support", "reflect"],   // leave one out to skip it
      explore_points: 3,                                     // UNCONFIRMED (SQ2)

      // The team (UNCONFIRMED whether the same people appear every day, SQ10).
      // good_stations: where this person fits best (more than one is allowed).
      people: [
        { id: "maya", name: "Maya Okafor", role: "Ecologist",
          description: "Studies how the island's plants, soil and animals depend on each other.",
          good_stations: ["soil"],
          placement_why: "Maya's skill is reading soil and plant data, and she wants to work on the eroded slopes. Community Liaison is a poor fit: she finds big meetings draining.",
          answers: {
            want:       { text: "I'd like to get my hands in the soil on the northern slopes. That's where the erosion is worst.", useful: true,  why: "Her preference was not obvious from her title: an ecologist could fit several stations." },
            strengths:  { text: "Reading soil and plant data and spotting what's going wrong.", useful: true, why: "Points her to Soil Recovery rather than Community Liaison." },
            weaknesses: { text: "Public speaking. Big meetings drain me.", useful: true, why: "Rules her out of Community Liaison." }
          } },
        { id: "daniel", name: "Daniel Reyes", role: "Biologist",
          description: "Specialist in the island's seabirds and their nesting behaviour.",
          good_stations: ["seabirds"],
          placement_why: "A seabird specialist and a Seabird Care station pair themselves.",
          answers: {
            want:       { text: "The nesting colony, of course. It's a critical week for the chicks.", useful: false, why: "A seabird specialist and a seabird station were already an obvious pair." },
            strengths:  { text: "Handling and counting birds without disturbing them.", useful: false, why: "Confirms what his description already said." },
            weaknesses: { text: "I'm not much use with electronics.", useful: false, why: "Nothing here changed where he should go." }
          } },
        { id: "priya", name: "Priya Nair", role: "Habitat planner",
          description: "Designs where and how restored areas should be laid out.",
          good_stations: ["liaison"],
          placement_why: "Priya ran the village's planning workshops and is good at explaining plans to non-experts, which is exactly what Community Liaison needs.",
          answers: {
            want:       { text: "I'd like to be out talking with the village. I ran their planning workshops last year.", useful: true, why: "Not guessable from 'habitat planner'. It points her to Community Liaison." },
            strengths:  { text: "Explaining maps and plans so that anyone can follow them.", useful: true, why: "Matches what Community Liaison needs." },
            weaknesses: { text: "Lab testing isn't my area.", useful: true, why: "Rules her out of Soil Recovery." }
          } },
        { id: "tom", name: "Tom Hale", role: "Engineer",
          description: "Builds and maintains field equipment, sensors and water systems.",
          good_stations: ["water"],
          placement_why: "An engineer who looks after sensors fits Water Monitoring, which runs sensors.",
          answers: {
            want:       { text: "The stream sensors keep dropping out. I want to fix them.", useful: false, why: "His description already pointed to the sensor station." },
            strengths:  { text: "Repairing and calibrating equipment.", useful: false, why: "Confirms what his description already said." },
            weaknesses: { text: "I lose patience in long meetings.", useful: false, why: "Nothing here changed where he should go." }
          } }
      ],

      // icon options: bird, leaf, drop, chat, sprout, wrench, paw, chart, boat, document
      // x and y (0-100) are optional; leave them out and the map places stations itself.
      stations: [
        { id: "seabirds", name: "Seabird Care", icon: "bird",
          description: "Monitors the nesting colony and keeps disturbance low.",
          answers: {
            task:   { text: "Count nests every day and keep people away from the colony.", useful: false, why: "The station name already made its task clear." },
            skills: { text: "Bird handling, patience and quiet fieldwork.", useful: false, why: "Confirms the obvious pairing with the biologist." }
          } },
        { id: "soil", name: "Soil Recovery", icon: "leaf",
          description: "Tests and treats eroded soil on the northern slopes.",
          answers: {
            task:   { text: "Take soil samples and decide where to plant ground cover first.", useful: true, why: "Shows the station needs someone who reads soil and plant data." },
            skills: { text: "Soil science, and knowing how plants hold soil in place.", useful: true, why: "Points to the ecologist rather than the planner." }
          } },
        { id: "water", name: "Water Monitoring", icon: "drop",
          description: "Runs sensors that detect pollution in the stream.",
          answers: {
            task:   { text: "Keep the pollution sensors running and log the readings.", useful: false, why: "Sensors plus an engineer who maintains sensors was already clear." },
            skills: { text: "Electronics and equipment repair.", useful: false, why: "Confirms the obvious pairing with the engineer." }
          } },
        { id: "liaison", name: "Community Liaison", icon: "chat",
          description: "Keeps the fishing village informed about the work.",
          answers: {
            task:   { text: "Hold a meeting with the fishing village about access to the beach.", useful: true, why: "Shows the station needs someone comfortable with public meetings." },
            skills: { text: "Clear explaining and calm handling of concerns.", useful: true, why: "Points to the planner who explains plans well." }
          } }
      ],

      // Where everyone stands when Assign begins (arbitrary, as reported).
      start_assignment: { maya: "liaison", daniel: "water", priya: "seabirds", tom: "soil" },

      // SUPPORT: one message per person, in this order when support_order is "fixed".
      // tier: "recommended" (exactly one), "acceptable" or "weak".
      // when_mismatched: a second version used when that person is NOT on a good station.
      support: [
        { id: "d1-tom", person: "tom",
          question: "Tom: \"Before we started today I checked the stream sensors and saw a spike in mud below the northern slopes. I posted the readings in the team chat an hour ago, but nobody has replied, and the work on the slopes is carrying on as planned.\"\n\nWhat do you do?",
          options: [
            { id: "a", tier: "recommended",
              text: "Thank Tom for flagging it, then bring him and whoever is working on the slopes together for a few minutes to decide whether today's work should change.",
              outcome: "Tom brings his laptop up to the slope and walks the team through the readings. There are a few questions about whether one sensor can be trusted, and it takes longer than planned, but by mid-morning the planting has moved further down the slope. Later that day Tom posts a second set of readings in the team chat, this time with a short note on what they might mean for tomorrow.",
              why: "Acts quickly and puts the evidence in front of the people who can act on it, with Tom involved." },
            { id: "b", tier: "acceptable",
              text: "Tell Tom you'll review the readings yourself and pass anything important on to the slope team.",
              outcome: "You read through the readings and send the slope team a short summary about an hour later. They make a small change to the afternoon's work. When you mention it to Tom, he nods and asks whether anyone had questions about how the readings were taken. Nobody had. He goes back to the stream and carries on logging.",
              why: "The information gets through, but more slowly and without Tom." },
            { id: "c", tier: "weak",
              text: "Tell Tom that mud after rain is normal, and the slope team shouldn't be distracted.",
              outcome: "Tom says \"OK\" and heads back down to the stream. The slope work carries on as planned. The afternoon's readings are saved in the shared folder as usual, but nothing more appears from Tom in the team chat.",
              why: "Dismisses a team member's evidence without looking at it." }
          ] },

        { id: "d1-maya", person: "maya",
          question: "Maya, at {station}: \"Tom's readings worry me. If the rain comes early, today's planting on the upper slope could wash straight off. I'd like to switch to the lower slope, but Priya's plan starts at the top and she isn't here to discuss it.\"\n\nWhat do you do?",
          options: [
            { id: "a", tier: "recommended",
              text: "Ask Maya what switching would change, then get her and Priya together briefly to agree before more planting is done.",
              outcome: "Maya and Priya meet at the foot of the slope and go over the plan with Tom's readings open between them. They agree to start low today and come back to the top once the weather is clearer. By the afternoon Maya is sketching a revised planting order on the back of the site map, and she stays behind at the end of the day to finish it.",
              why: "Uses the specialist's evidence and brings in the person whose plan it is, without a long delay." },
            { id: "b", tier: "acceptable",
              text: "Let Maya switch to the lower slope today, and ask her to send Priya a short note explaining why.",
              outcome: "Maya moves the planting to the lower slope and sends Priya a short note. Priya replies later in the day that it seems sensible, but asks to be included next time the plan changes. Maya reads the reply twice before putting her phone away, then works through the afternoon on the lower slope and logs the day's planting without further comment.",
              why: "Acts on the best information and keeps Priya informed, though she isn't part of the decision." },
            { id: "c", tier: "weak",
              text: "Tell Maya the plan was agreed and must be followed; changing it now would confuse everyone.",
              outcome: "Maya carries on planting at the top of the slope as planned. She works steadily but says little to the rest of the team, and when Tom walks past with the latest readings she glances at them and turns back to her trowel. At the end of the day her log entry is a single line.",
              why: "Overly forceful: it ignores the specialist's evidence." }
          ],
          when_mismatched: {
            question: "Maya, at {station}: \"I'll be honest, I don't think I'm much use at {station}. I've just seen Tom's readings and I'm worried today's planting on the upper slope will wash away, but I'm not the one working there.\"\n\nWhat do you do?",
            options: [
              { id: "a", tier: "recommended",
                text: "Thank Maya, ask her to brief whoever is on the slopes about the risk right away, and agree to look again at who works where.",
                outcome: "Maya walks over to the slope team and explains the risk, pointing out where the soil is thinnest. They agree to move the day's planting lower down. Maya then returns to {station}, where she spends the rest of the afternoon on the work there, stopping now and then to look up towards the slopes.",
                why: "Gets her expertise to where it's needed now and takes her concern about her own role seriously." },
              { id: "b", tier: "acceptable",
                text: "Ask Maya to write up her concern so you can take it to the slope team yourself.",
                outcome: "Maya writes up her concern and hands it to you. You pass it to the slope team later in the day, and they make a change to the planting. When you tell Maya, she says \"Right\" and goes back to {station}. She does not mention the slopes again that day.",
                why: "The concern is passed on, but slowly and without her." },
              { id: "c", tier: "weak",
                text: "Ask Maya to focus on her own station and leave the slopes to the people working there.",
                outcome: "Maya goes back to {station}. For the rest of the day she does what is asked of her there and nothing more, and she does not join the team for the end-of-day catch-up.",
                why: "Ignores a real risk and the person raising it." }
            ]
          } },

        { id: "d1-priya", person: "priya",
          question: "Priya: \"People in the fishing village have heard there might be muddy water in the bay. They want to know tonight whether the beach will be closed. We don't yet know how serious Tom's reading is.\"\n\nWhat do you do?",
          options: [
            { id: "a", tier: "recommended",
              text: "Help Priya tell the village honestly what is known and what isn't, and when they will get an update once Tom has checked the sensors again.",
              outcome: "You and Priya draft a short message for the village: what the readings show so far, what is still unknown, and when the next update will come. She reads it out at the harbour that evening. There are a few questions, which she answers one by one, and afterwards she stays on to chat with some of the fishermen about tomorrow's update.",
              why: "Honest, timely and gives the village something concrete to expect." },
            { id: "b", tier: "acceptable",
              text: "Ask Priya to tell the village there are no plans to close the beach, and that the team will confirm tomorrow.",
              outcome: "Priya tells the village there are no plans to close the beach and that the team will confirm tomorrow. Most people accept this, though a couple of the older fishermen ask how the team can be sure when the readings are not finished. Priya gives the same answer again. On the way back she asks you what she should say if the water does turn muddy.",
              why: "Responds quickly, but sounds more certain than the team is." },
            { id: "c", tier: "weak",
              text: "Ask Priya not to reply until the team has a full analysis of the water, so that nothing wrong is said.",
              outcome: "Priya holds off replying. By evening the story in the village has grown: some people are saying the beach will close for the whole season. Priya's phone rings several times during dinner, and she takes each call outside. The next morning she asks you whether anyone has an update for the village yet.",
              why: "Delays too long: silence makes the situation worse." },
            { id: "d", tier: "weak",
              text: "Tell Priya to reassure the village that the water is fine and there is nothing to worry about.",
              outcome: "Priya tells the village the water is fine. The next afternoon a light shower turns the bay brown near the stream mouth, and people start sending photos of it to one another. Priya is stopped at the harbour and asked about it, and when she finally gets back to the base she goes straight to the sensor readings.",
              why: "Promises something the team does not know." }
          ] },

        { id: "d1-daniel", person: "daniel",
          question: "Daniel: \"I've just found out the new planting route passes right below the nesting cliffs. Nobody asked me before it was agreed. If people walk there all week, some birds could abandon their nests.\"\n\nWhat do you do?",
          options: [
            { id: "a", tier: "recommended",
              text: "Get Daniel together with the slope team to mark which part of the route is too close to the nests, and move only that section.",
              outcome: "Daniel and the slope team walk the route together and mark the stretch that passes closest to the nests. They agree a short detour around the cliffs, which costs the planting a little time. Daniel spends the afternoon setting up markers along the new path and, at the end of the day, shows you the nest count, which has held steady.",
              why: "Deals with the real risk, involves both sides, and keeps the work moving." },
            { id: "b", tier: "acceptable",
              text: "Keep the route for today, but set quiet hours and a marked buffer, and review it with Daniel tomorrow morning.",
              outcome: "The route stays as it is for today, with quiet hours and a marked buffer below the cliffs. Daniel checks the buffer twice during the afternoon and notes a few birds lifting off when people pass. He adds these to his log and asks to go over the route again first thing tomorrow.",
              why: "Reduces the risk and keeps progress, but leaves Daniel's concern partly open." },
            { id: "c", tier: "weak",
              text: "Stop all planting near the cliffs until Daniel has completed a full survey of the colony.",
              outcome: "Planting near the cliffs stops for the day. The slope team packs up early, and some of them grumble about losing the dry weather. Daniel spends the whole afternoon on his survey, working through the colony nest by nest, and comes back at the end of the day with pages of notes, offering to walk you through them.",
              why: "Delays action too much: a full survey was not needed to fix one section of route." },
            { id: "d", tier: "weak",
              text: "Tell Daniel the route has been agreed and the birds will get used to it.",
              outcome: "Daniel does not argue. He goes back to the cliffs and spends the afternoon watching the nests from further away than usual. Each time the slope team passes below, he writes down the time in his notebook. He skips the end-of-day catch-up and sends his count by message instead.",
              why: "Dismisses the specialist on the one topic he knows best." }
          ] }
      ],

      // REFLECT: one screen per question. The correct answer can depend on how
      // the candidate handled that person's Support message (truth_from_support).
      reflect: [
        { id: "d1-r-tom", person: "tom",
          prompt: "How do you think Tom feels about the way his readings were handled today?",
          truth_from_support: { support: "d1-tom", recommended: "positive", acceptable: "neutral", weak: "negative" },
          why: "Tom's reaction followed your response to his readings. Involved, he went on to share more readings without being asked (positive). Passed on without him, he asked whether anyone had questions about the readings, and nobody had (neutral). Dismissed, he stopped posting in the team chat (negative)." },
        { id: "d1-r-maya", person: "maya",
          prompt: "How do you think Maya experienced today?",
          truth_from_support: { support: "d1-maya", recommended: "positive", acceptable: "neutral", weak: "negative" },
          why: "Listened to and agreeing a plan with Priya, Maya stayed late to finish the new planting order (positive). Switching on her own, she got Priya's request to be included next time and re-read it (neutral). Overruled, she said little and wrote a one-line log (negative).",
          when_mismatched: {
            truth_from_support: { support: "d1-maya", recommended: "neutral", acceptable: "negative", weak: "negative" },
            why: "Maya spent the day away from the work she is best at. Even when her advice was used, she kept looking up towards the slopes (neutral). Sidelined or sent back to her station, she dropped the subject and kept to herself (negative)."
          } },
        { id: "d1-r-priya", person: "priya",
          prompt: "How confident do you think Priya feels after today's contact with the village?",
          options: [
            { id: "positive", label: "Confident" },
            { id: "neutral",  label: "Unsure" },
            { id: "negative", label: "Worried" },
            { id: "idk",      label: "I don't know" }
          ],
          truth_from_support: { support: "d1-priya", recommended: "positive", acceptable: "neutral", weak: "negative" },
          why: "An honest update brought questions she could answer, and she stayed on to chat afterwards (confident). Sounding too sure brought doubts she could not answer, and she asked you what to say if the water turned (unsure). Silence or false reassurance backfired: calls through dinner, or photos of a brown bay (worried)." },
        { id: "d1-r-daniel", person: "daniel",
          prompt: "How do you think Daniel experienced today?",
          // by_option overrides the tier for one specific option: stopping all planting (c) was weak, but Daniel himself was pleased.
          truth_from_support: { support: "d1-daniel", recommended: "positive", acceptable: "neutral", weak: "negative", by_option: { c: "positive" } },
          why: "Daniel's day followed how his concern was handled. The agreed detour ended with a steady nest count he showed you (positive); the buffer he checked twice and wanted to review was only a partial answer (neutral). Stopping all planting was a weak choice for the project, yet Daniel himself came back with pages of notes to share (positive). Being told the birds would get used to it left him keeping his distance and skipping the catch-up (negative)." }
      ]
    },

    /* ================================ DAY 2 ================================ */
    {
      id: "day2",
      name: "Day 2",
      intro: "Day 2 starts fresh. The team turns to seedlings, barriers and data.",
      phases: ["explore", "assign", "support", "reflect"],
      explore_points: 3,                                     // UNCONFIRMED (SQ2)

      people: [
        { id: "maya", name: "Maya Okafor", role: "Ecologist",
          description: "Studies how the island's plants, soil and animals depend on each other.",
          good_stations: ["data"],
          placement_why: "Maya wants to pull the readings together and is best at spotting patterns across data, which is the Data Hub's job. Potting seedlings is not her strength.",
          answers: {
            want:       { text: "After yesterday, I'd like to pull all the readings together and see the full picture.", useful: true, why: "Not guessable from 'ecologist'. It points her to the Data Hub." },
            strengths:  { text: "Spotting patterns across different sets of data.", useful: true, why: "Matches what the Data Hub needs." },
            weaknesses: { text: "I'm not patient with delicate hands-on work like potting seedlings.", useful: true, why: "Rules her out of the Nursery, the natural guess for an ecologist." }
          } },
        { id: "daniel", name: "Daniel Reyes", role: "Biologist",
          description: "Specialist in the island's seabirds and their nesting behaviour.",
          good_stations: ["wildlife"],
          placement_why: "A wildlife specialist and a Wildlife Survey station pair themselves.",
          answers: {
            want:       { text: "I want to see whether birds and lizards are using yesterday's planted areas.", useful: false, why: "The wildlife pairing was already obvious." },
            strengths:  { text: "Identifying animals quickly in the field.", useful: false, why: "Confirms what his description already said." },
            weaknesses: { text: "Spreadsheets. I leave those to others.", useful: false, why: "Nothing here changed where he should go." }
          } },
        { id: "priya", name: "Priya Nair", role: "Habitat planner",
          description: "Designs where and how restored areas should be laid out.",
          good_stations: ["nursery"],
          placement_why: "Priya wants to choose the seedlings for her own layout, and matching plants to places is her strength, which is the Nursery's task.",
          answers: {
            want:       { text: "I'd like to pick the seedlings for the areas I've laid out, so the plan actually works on the ground.", useful: true, why: "Points her to the Nursery rather than the Data Hub." },
            strengths:  { text: "Matching the right plants to the right places in a layout.", useful: true, why: "Matches what the Nursery needs." },
            weaknesses: { text: "Crunching numbers in a big dataset.", useful: true, why: "Rules her out of the Data Hub." }
          } },
        { id: "tom", name: "Tom Hale", role: "Engineer",
          description: "Builds and maintains field equipment, sensors and water systems.",
          good_stations: ["barriers"],
          placement_why: "An engineer who builds things fits Erosion Barriers, which builds structures.",
          answers: {
            want:       { text: "Building the barriers. The slopes need them before the rain.", useful: false, why: "The engineer and barriers pairing was already clear." },
            strengths:  { text: "Building sturdy things quickly from basic materials.", useful: false, why: "Confirms what his description already said." },
            weaknesses: { text: "I'm hopeless at telling plant species apart.", useful: false, why: "Nothing here changed where he should go." }
          } }
      ],

      stations: [
        { id: "nursery", name: "Nursery", icon: "sprout",
          description: "Grows native seedlings ready for planting.",
          answers: {
            task:   { text: "Choose and prepare the right seedlings for each planned area.", useful: true, why: "Shows the station needs someone who knows the planting layout." },
            skills: { text: "Knowing which plants suit which spots in the layout.", useful: true, why: "Points to the planner rather than the ecologist." }
          } },
        { id: "barriers", name: "Erosion Barriers", icon: "wrench",
          description: "Builds low barriers that slow water running off the slopes.",
          answers: {
            task:   { text: "Build and anchor barriers across the steepest gullies.", useful: false, why: "The station name already made its task clear." },
            skills: { text: "Construction and practical building skills.", useful: false, why: "Confirms the obvious pairing with the engineer." }
          } },
        { id: "wildlife", name: "Wildlife Survey", icon: "paw",
          description: "Records which animals use the restored areas.",
          answers: {
            task:   { text: "Walk set routes and record every animal seen.", useful: false, why: "The station name already made its task clear." },
            skills: { text: "Identifying animals.", useful: false, why: "Confirms the obvious pairing with the biologist." }
          } },
        { id: "data", name: "Data Hub", icon: "chart",
          description: "Collects everyone's readings and shares a daily summary.",
          answers: {
            task:   { text: "Combine every station's readings into one summary for the council by evening.", useful: true, why: "Shows the station needs someone strong with data." },
            skills: { text: "Working with data and spotting patterns.", useful: true, why: "Points to the ecologist rather than the planner." }
          } }
      ],

      start_assignment: { maya: "nursery", daniel: "barriers", priya: "wildlife", tom: "data" },

      support: [
        { id: "d2-priya", person: "priya",
          question: "Priya: \"Before anyone prepares seedlings for my planting layout, we need three things: yesterday's soil results, the final planting map, and how many areas the barriers can protect. I have the map, but not the other two.\"\n\nWhat do you do?",
          options: [
            { id: "a", tier: "recommended",
              text: "Help Priya ask Maya for the soil results and Tom for his barrier estimate, and suggest she prepares the seedlings she is already sure of in the meantime.",
              outcome: "Maya sends over the soil results within the hour, and Tom's barrier estimate follows in the afternoon. In the meantime Priya starts on the seedlings she is already sure of, lining up trays for the first areas of her layout. By the end of the day the nursery tables are full, and she has written tomorrow's planting list on the board.",
              why: "Goes straight to the people who hold the missing information and keeps work moving meanwhile." },
            { id: "b", tier: "acceptable",
              text: "Ask Priya to make her best estimate from the map, and adjust once the missing information arrives.",
              outcome: "Priya makes her best estimate from the map and starts preparing seedlings. When the soil results arrive in the afternoon, part of her selection turns out to be wrong for the wetter areas, and she moves a row of trays back to the shelves. She finishes the day with most of the work done and a list of changes for the morning.",
              why: "Keeps progress going, at the cost of some rework." },
            { id: "c", tier: "weak",
              text: "Tell Priya to wait until all three pieces of information are ready before preparing anything.",
              outcome: "Priya waits for the missing information. She spends most of the morning tidying the nursery and re-checking the map she already has. The soil results arrive just after lunch, and she starts the seedlings then, working late to catch up. She is the last to leave the base.",
              why: "Delays action when part of the work could safely start." }
          ] },

        { id: "d2-tom", person: "tom",
          question: "Tom: \"I promised Priya an estimate of how many areas the barriers can protect, but I forgot, and now she's waiting on me. I'm also behind on building the barriers themselves.\"\n\nWhat do you do?",
          options: [
            { id: "a", tier: "recommended",
              text: "Ask Tom to give Priya a rough estimate now, saying clearly how uncertain it is, then go back to the barriers and refine it at the end of the day.",
              outcome: "Tom sends Priya a rough figure within a few minutes, with a note saying it could change by an area or two. Priya replies that it is enough to plan with. Tom puts his phone away and goes back to {station}, and by the end of the day he has refined the figure and sent it on without being reminded.",
              why: "Unblocks Priya quickly without piling pressure on Tom." },
            { id: "b", tier: "acceptable",
              text: "Ask Maya to work out the estimate from yesterday's data, so Tom can concentrate on building.",
              outcome: "Maya takes the estimate on and works it out from yesterday's data, which takes up a good part of her morning. Tom thanks her in the team chat. At lunch he apologises to her again, then checks her figure against his own plans, finds it close enough, and says nothing more about it.",
              why: "Solves the block, but moves the load onto someone else." },
            { id: "c", tier: "weak",
              text: "Remind Tom firmly that missed promises hold up the whole team, and tell him it must not happen again.",
              outcome: "Tom sends the estimate straight away. For the rest of the day he works on his own, keeps his answers short when anyone asks him something, and leaves as soon as the day's work is done.",
              why: "Overly forceful: blame does not help the team move on." }
          ],
          when_mismatched: {
            question: "Tom, at {station}: \"I promised Priya an estimate of how many areas the barriers can protect, but I've been at {station} all morning and haven't had a chance to look at the barrier plans. Now she's waiting on me.\"\n\nWhat do you do?"
          } },

        { id: "d2-maya", person: "maya",
          question: "Maya: \"Daniel's wildlife counts from yesterday haven't arrived, and he says he sent them. Without them, tonight's summary for the council will have a gap. I don't really want to chase him again; last time he took it badly.\"\n\nWhat do you do?",
          options: [
            { id: "a", tier: "recommended",
              text: "Suggest Maya sends Daniel a short, friendly message saying the file didn't arrive and asking him to resend it, and offer to step in if it's still missing this afternoon.",
              outcome: "Maya sends Daniel a short message saying the file never arrived. Soon after, he finds it stuck on his phone and sends it again. Maya adds the counts, checks the totals, and sends the council summary on time with every station's readings included. Before leaving, she pins a copy on the noticeboard at the base.",
              why: "Direct but friendly, with support ready if it doesn't work." },
            { id: "b", tier: "acceptable",
              text: "Tell Maya to send the summary with a note that the wildlife counts will follow tomorrow.",
              outcome: "Maya sends the summary with a note that the wildlife counts will follow tomorrow. The council replies with a short acknowledgement. Maya reads through the summary once more before closing her laptop, pausing on the empty wildlife section.",
              why: "Meets the deadline honestly, but leaves the gap." },
            { id: "c", tier: "weak",
              text: "Tell Maya the wildlife counts matter less than the soil data, so she can leave them out.",
              outcome: "The summary goes out without the wildlife counts, and Maya does not have to message Daniel. The next morning Daniel reads the summary on the noticeboard, looks for his section, and asks around who decided to leave it out. Maya stays busy at her desk while he asks.",
              why: "Ignores a team member's work to avoid a conversation." }
          ],
          when_mismatched: {
            question: "Maya, at {station}: \"I offered to help with tonight's council summary, but Daniel's wildlife counts from yesterday haven't arrived. He says he sent them. I don't really want to chase him again; last time he took it badly.\"\n\nWhat do you do?"
          } },

        { id: "d2-daniel", person: "daniel",
          question: "Daniel: \"I've just learned my counts never arrived. I did send them, but they were stuck on my phone. Now I'm worried the council will think my survey is sloppy.\"\n\nWhat do you do?",
          options: [
            { id: "a", tier: "recommended",
              text: "Reassure Daniel that a stuck file is an easy mistake, make sure his counts are in the record, and suggest a simple check that files have arrived.",
              outcome: "Daniel makes sure his counts are added to the record, then sits down with Maya and agrees that whoever receives a file will reply \"received\". He heads back out on his survey route for the afternoon, joking that his phone is now banned from fieldwork, and before leaving sends his new counts and waits for Maya's reply.",
              why: "Supports him and fixes the cause, so it doesn't happen again." },
            { id: "b", tier: "acceptable",
              text: "Offer to tell the council that the delay was a technical problem, not a problem with the survey.",
              outcome: "You let the council know the delay was a technical problem with the file, not with the survey. Daniel says thanks. Later he asks Maya, half to himself, how anyone would even know if a file went missing again. Nobody has an answer, and he goes back out on his route.",
              why: "Protects his reputation, but doesn't prevent a repeat." },
            { id: "c", tier: "weak",
              text: "Tell Daniel he should have checked that his files were sent, and to be more careful.",
              outcome: "Daniel apologises and says he will check more carefully. He spends the afternoon on his survey route but comes back early, re-sends the week's files one by one, and asks Maya twice whether each has arrived. He hardly speaks at the end-of-day catch-up.",
              why: "Blames rather than supports, and fixes nothing." }
          ] }
      ],

      reflect: [
        { id: "d2-r-priya", person: "priya",
          prompt: "How do you think Priya experienced today?",
          truth_from_support: { support: "d2-priya", recommended: "positive", acceptable: "neutral", weak: "negative" },
          why: "Priya was unblocked (positive), kept moving with rework (neutral), or left waiting (negative)." },
        { id: "d2-r-tom", person: "tom",
          prompt: "How do you think Tom feels about today?",
          truth_from_support: { support: "d2-tom", recommended: "positive", acceptable: "neutral", weak: "negative" },
          why: "Tom unblocked Priya quickly and followed up without being reminded (positive); he thanked Maya but apologised to her again at lunch (neutral); after being blamed he kept to himself and left as soon as he could (negative).",
          when_mismatched: {
            truth_from_support: { support: "d2-tom", recommended: "neutral", acceptable: "negative", weak: "negative" },
            why: "Tom spent the day away from the barriers he was supposed to be planning, so even a good fix left him only partly satisfied."
          } },
        { id: "d2-r-maya", person: "maya",
          prompt: "How do you think Maya experienced today?",
          truth_from_support: { support: "d2-maya", recommended: "positive", acceptable: "neutral", weak: "neutral" },
          why: "A complete summary, which Maya pinned on the noticeboard, was a good result for her (positive). Sending it with a gap, or leaving the counts out, let her avoid the conversation but left her work incomplete: neutral either way.",
          when_mismatched: {
            truth_from_support: { support: "d2-maya", recommended: "neutral", acceptable: "neutral", weak: "negative" },
            why: "Maya was helping with the summary from a station that did not suit her. A good fix left her neutral; leaving the counts out made things worse."
          } },
        { id: "d2-r-daniel", person: "daniel",
          prompt: "How do you think Daniel feels about how the missing counts were handled?",
          truth_from_support: { support: "d2-daniel", recommended: "positive", acceptable: "neutral", weak: "negative" },
          why: "With a simple fix in place, Daniel went back to his route joking about his phone (positive). Only covered for, he wondered aloud how anyone would know next time (neutral). Blamed, he re-sent every file, kept checking, and barely spoke (negative)." },
        { id: "d2-r-daniel-barriers", person: "daniel",
          prompt: "How does Daniel feel about the new erosion barriers?",
          unknowable: true,
          why: "Nothing today showed Daniel's view of the barriers. \"I don't know\" is the honest answer." }
      ]
    },

    /* ================================ DAY 3 ================================ */
    {
      id: "day3",
      name: "Day 3",
      intro: "The final day. The team prepares to hand the project over to the island.",
      phases: ["explore", "assign", "support", "reflect"],
      explore_points: 2,                                     // UNCONFIRMED (SQ2)

      people: [
        { id: "maya", name: "Maya Okafor", role: "Ecologist",
          description: "Studies how the island's plants, soil and animals depend on each other.",
          good_stations: ["seeds"],
          placement_why: "An ecologist who recognises native plants fits Seed Collection.",
          answers: {
            want:       { text: "Collecting seeds from the last native trees before they drop.", useful: false, why: "The ecologist and seed pairing was already the natural fit." },
            strengths:  { text: "Recognising native plants and when their seeds are ripe.", useful: false, why: "Confirms what her description suggested." },
            weaknesses: { text: "Presenting to the council makes me nervous.", useful: false, why: "She was never a likely fit for the council report." }
          } },
        { id: "daniel", name: "Daniel Reyes", role: "Biologist",
          description: "Specialist in the island's seabirds and their nesting behaviour.",
          good_stations: ["report"],
          placement_why: "Daniel holds the best evidence on the colony and wants to write it up, while he admits he is weak at negotiating, which Visitor Boats needs. His description made Visitor Boats look like the obvious fit, and it wasn't.",
          answers: {
            want:       { text: "I'd like to write up what happened to the colony this week. I've got the best evidence.", useful: true, why: "Reveals he fits the council report, not the boats station his description suggested." },
            strengths:  { text: "Turning field counts into clear evidence.", useful: true, why: "Matches what the Council Report needs." },
            weaknesses: { text: "Haggling. I tend to give in too quickly.", useful: true, why: "Rules him out of the negotiation at Visitor Boats." }
          } },
        { id: "priya", name: "Priya Nair", role: "Habitat planner",
          description: "Designs where and how restored areas should be laid out.",
          good_stations: ["boats"],
          placement_why: "Priya knows the tour operator and is good at finding compromises, which the boat-route negotiation needs. Long technical reports are not her strength.",
          answers: {
            want:       { text: "Sorting out the boat routes with the tour operator. I know him from the village.", useful: true, why: "Not guessable from 'habitat planner'. It points her to Visitor Boats." },
            strengths:  { text: "Finding compromises that both sides can live with.", useful: true, why: "Matches the negotiation Visitor Boats needs." },
            weaknesses: { text: "Writing long technical reports.", useful: true, why: "Rules her out of the Council Report." }
          } },
        { id: "tom", name: "Tom Hale", role: "Engineer",
          description: "Builds and maintains field equipment, sensors and water systems.",
          good_stations: ["equipment"],
          placement_why: "An engineer who maintains equipment fits the Equipment Store.",
          answers: {
            want:       { text: "Getting every sensor checked before we leave the island.", useful: false, why: "The engineer and equipment pairing was already clear." },
            strengths:  { text: "Fixing equipment in the field.", useful: false, why: "Confirms what his description already said." },
            weaknesses: { text: "I don't enjoy dealing with customers.", useful: false, why: "Nothing here changed where he should go." }
          } }
      ],

      stations: [
        { id: "boats", name: "Visitor Boats", icon: "boat",
          description: "Works with the tour operator to keep boat trips away from nesting areas.",
          answers: {
            task:   { text: "Agree new boat routes with the tour operator that keep boats away from the nests.", useful: true, why: "Shows this is a negotiation, not a bird-counting job." },
            skills: { text: "Negotiating with local businesses.", useful: true, why: "Points away from the seabird specialist and towards the planner." }
          } },
        { id: "seeds", name: "Seed Collection", icon: "leaf",
          description: "Gathers seeds from the island's surviving native plants.",
          answers: {
            task:   { text: "Collect and label seeds from native plants.", useful: false, why: "The station name already made its task clear." },
            skills: { text: "Plant identification.", useful: false, why: "Confirms the obvious pairing with the ecologist." }
          } },
        { id: "equipment", name: "Equipment Store", icon: "wrench",
          description: "Repairs, checks and hands out the team's tools and sensors.",
          answers: {
            task:   { text: "Check, repair and pack every sensor and tool.", useful: false, why: "The station name already made its task clear." },
            skills: { text: "Mechanical and electrical repair.", useful: false, why: "Confirms the obvious pairing with the engineer." }
          } },
        { id: "report", name: "Council Report", icon: "document",
          description: "Prepares the end-of-project report for the island council.",
          answers: {
            task:   { text: "Show the council, with evidence, how the colony and the slopes changed this week.", useful: true, why: "Shows the report needs someone holding the colony evidence." },
            skills: { text: "Using field evidence to make a clear case.", useful: true, why: "Points to the biologist rather than the planner." }
          } }
      ],

      start_assignment: { maya: "equipment", daniel: "boats", priya: "report", tom: "seeds" },

      support: [
        { id: "d3-daniel", person: "daniel",
          question: "Daniel, at {station}: \"For the council report I want to say the colony is safe. Maya thinks that's too strong, because one week of counts isn't enough to be sure. We've been going back and forth all morning.\"\n\nWhat do you do?",
          options: [
            { id: "a", tier: "recommended",
              text: "Suggest they report what the counts show so far, state clearly what one week can't prove, and recommend follow-up counts.",
              outcome: "Daniel and Maya sit down with the counts and agree on wording they can both put their names to: what the week showed, what it cannot yet prove, and a recommendation for follow-up counts. Daniel reads the final paragraph aloud to the team at lunch, then adds a chart of the nest numbers before sending the report.",
              why: "Resolves the disagreement with an answer both can support, and keeps the report accurate." },
            { id: "b", tier: "acceptable",
              text: "Ask Daniel to use Maya's more cautious wording, since the council may make funding decisions based on it.",
              outcome: "Daniel rewrites the section using Maya's more cautious wording and finishes the report on time. When he hands it over, he points out how strong this week's counts were, and asks whether there is anywhere else in the report they could be mentioned.",
              why: "Accurate, but settles the disagreement for one side." },
            { id: "c", tier: "weak",
              text: "Decide for them: Daniel owns the report, so his wording stands.",
              outcome: "Daniel's wording stays: the report says the colony is safe. Maya stops arguing and goes back to her own work. Daniel finishes the report early, reads it through, and sends it to the council with a short covering note about how well the colony has done this week.",
              why: "Overly forceful, and puts an overstated claim in front of the council." }
          ],
          when_mismatched: {
            question: "Daniel, at {station}: \"I heard the council report is going to say the colony is safe. That's too strong for one week of counts, but I'm not the one writing it, so I'm not sure it's my place to say.\"\n\nWhat do you do?",
            options: [
              { id: "a", tier: "recommended",
                text: "Encourage Daniel to share his evidence with whoever is writing the report, and ask them to include what one week can't prove.",
                outcome: "Daniel takes his counts over to whoever is writing the report, and together they change the sentence to say what one week can and cannot show. Daniel returns to {station} for the afternoon. When the report goes out, he reads the colony section closely and makes a note in the margin of his own copy.",
                why: "Gets the evidence into the report and values Daniel's view." },
              { id: "b", tier: "acceptable",
                text: "Offer to pass Daniel's concern on to the report writer yourself.",
                outcome: "You pass Daniel's concern on, and the wording in the report is softened. Daniel is told about the change at the end of the day. He nods, asks which words were used, and goes back to packing up at {station}.",
                why: "The concern is acted on, but without Daniel." },
              { id: "c", tier: "weak",
                text: "Tell Daniel the report isn't his job today, and ask him to focus on his own station.",
                outcome: "Daniel goes back to {station} and does not raise the report again. It goes to the council saying the colony is safe. That evening he reads the sent copy, puts it down, and leaves the base without joining the others.",
                why: "Ignores the person with the best evidence." }
            ]
          } },

        { id: "d3-priya", person: "priya",
          question: "Priya: \"The tour operator says moving the boat routes will cost him customers, and he's threatening to complain to the council. I think a compromise is possible, but Daniel's latest counts would really help my case, and he's busy with the report.\"\n\nWhat do you do?",
          options: [
            { id: "a", tier: "recommended",
              text: "Ask Daniel to take a short break from the report to give Priya the few figures she needs, then let Priya propose a trial route to the operator.",
              outcome: "Daniel takes a short break from the report and gives Priya the latest nest counts. Priya takes them to the tour operator along with a map of a trial route that keeps boats further from the cliffs. After some back and forth, he agrees to try it for two weeks. Priya comes back to the base with the signed note and pins it to the board.",
              why: "A small, targeted request unblocks a stakeholder problem before it escalates." },
            { id: "b", tier: "acceptable",
              text: "Ask Priya to offer the operator a meeting with the council, so the issue is settled together.",
              outcome: "Priya offers the tour operator a meeting with the council, and he agrees to hold off on any complaint until then. The routes stay as they are for now. Priya adds the meeting to the handover list and writes a reminder to bring the nest counts, with a question mark next to the date.",
              why: "Calms things down, but pushes the decision later." },
            { id: "c", tier: "weak",
              text: "Tell Priya to inform the operator that the new routes are final.",
              outcome: "Priya tells the tour operator the new routes are final. He leaves without agreeing, and by the afternoon the council has received his complaint. The council calls Priya to ask what happened, and she spends the rest of the day writing up her side of the conversation.",
              why: "Overly forceful with a stakeholder, and leaves Priya exposed." }
          ] },

        { id: "d3-tom", person: "tom",
          question: "Tom: \"I've been asked to pack up every sensor today, but Priya wants two left in place for her boat-route trial, and Maya wants one moved to the seed area. There aren't enough to do all three.\"\n\nWhat do you do?",
          options: [
            { id: "a", tier: "recommended",
              text: "Ask Tom which sensors are free, then quickly check with Priya and Maya which request matters most for the project's goal before deciding.",
              outcome: "Tom lists the sensors that are free, and you check quickly with Priya and Maya. They agree to leave two in place for the boat trial and move one to the seed area next month. Tom labels each sensor with where it is going, packs the rest, and hands over a tidy equipment list before the team leaves.",
              why: "Involves the people affected and decides against the project's goal." },
            { id: "b", tier: "acceptable",
              text: "Decide yourself: keep two sensors for the boat trial, since it protects the colony, and tell Maya why.",
              outcome: "You decide to keep two sensors for the boat trial and tell Maya why. Maya accepts it, though she asks whether the seed area could have one later. Tom sets up the two sensors as asked, packs the rest, and writes \"as instructed\" at the top of his equipment list.",
              why: "A clear, sensible call, made without the people affected." },
            { id: "c", tier: "weak",
              text: "Ask Tom to pack nothing until everyone has had a full meeting about equipment next week.",
              outcome: "Tom packs nothing and waits for next week's meeting, so the sensors stay where they are. When the team gathers to leave, Tom is asked for the equipment list and has nothing ready to hand over. He stays behind to count the sensors while the others walk down to the boat.",
              why: "Delays a small decision far too long." }
          ] },

        { id: "d3-maya", person: "maya",
          question: "Maya: \"I've collected far more seeds than planned, but nobody has agreed who will store and plant them after we leave. If they aren't stored properly this week, they'll be wasted.\"\n\nWhat do you do?",
          options: [
            { id: "a", tier: "recommended",
              text: "Help Maya contact the council and the village this afternoon to agree who will look after the seeds, and write the arrangement into the handover.",
              outcome: "You and Maya call the council and walk down to the village school that afternoon. The school offers to store the seeds and plant them with the children, and the council agrees to help. Maya writes the arrangement into the handover, labels every bag with its planting month, and carries the boxes to the school herself.",
              why: "Turns a loose end into an agreed handover with the people who will stay on the island." },
            { id: "b", tier: "acceptable",
              text: "Ask Maya to store the seeds as well as she can, and flag the question in the council report.",
              outcome: "Maya stores the seeds in the cool room as well as she can, and the question of who will plant them goes into the council report. Before leaving she writes her phone number on the boxes, and asks you twice whether the council is likely to read that part of the report.",
              why: "Protects the seeds for now, but leaves the key question open." },
            { id: "c", tier: "weak",
              text: "Tell Maya the extra seeds are outside the project's scope, so she should stop collecting.",
              outcome: "Maya stops collecting. She leaves the full bags stacked in a corner of the base. Before the team leaves she looks through them once more, then closes the door on them.",
              why: "Dismisses useful work and a real risk." }
          ] }
      ],

      reflect: [
        { id: "d3-r-daniel", person: "daniel",
          prompt: "How do you think Daniel experienced today?",
          truth_from_support: { support: "d3-daniel", recommended: "positive", acceptable: "neutral", weak: "positive" },
          why: "Daniel read the shared wording aloud to the team (positive). With Maya's cautious wording, he looked for somewhere else to mention his results (neutral). When his own wording was simply imposed, he finished early and sent it with a note about how well the colony had done (positive), even though that was a weak choice for the team.",
          when_mismatched: {
            truth_from_support: { support: "d3-daniel", recommended: "neutral", acceptable: "neutral", weak: "negative" },
            why: "Daniel spent the day away from the report he was best placed to write, so even when his point got through he was only partly satisfied: he still marked up his own copy, or asked which words were used (neutral). When his point was ignored, he left without joining the others (negative)."
          } },
        { id: "d3-r-priya", person: "priya",
          prompt: "How does Priya feel about the talks with the tour operator?",
          truth_from_support: { support: "d3-priya", recommended: "positive", acceptable: "neutral", weak: "negative" },
          why: "A trial route agreed (positive), a meeting that postponed the issue (neutral), or a complaint she had to face (negative)." },
        { id: "d3-r-tom", person: "tom",
          prompt: "How do you think Tom experienced today?",
          truth_from_support: { support: "d3-tom", recommended: "positive", acceptable: "neutral", weak: "negative" },
          why: "Tom labelled everything and handed over a tidy list (positive), wrote \"as instructed\" on a decision made without him (neutral), or had nothing ready when the team left (negative)." },
        { id: "d3-r-maya", person: "maya",
          prompt: "How certain is Maya that her seeds will be put to good use?",
          options: [
            { id: "positive", label: "Certain" },
            { id: "neutral",  label: "Unsure" },
            { id: "negative", label: "Doubtful" },
            { id: "idk",      label: "I don't know" }
          ],
          truth_from_support: { support: "d3-maya", recommended: "positive", acceptable: "neutral", weak: "negative" },
          why: "With an agreed handover, Maya carried the seeds to the school herself (certain). Stored without a plan, she wrote her number on the boxes and asked twice whether the council would read the report (unsure). Told to stop, she closed the door on the full bags (doubtful)." }
      ]
    }
  ]
};
