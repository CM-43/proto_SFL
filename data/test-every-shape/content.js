/* TEST CONTENT — not for customers. Uses every shape the content format allows:
   4 days; 2, 3, 5 and 4 people/stations; a day without Explore; a day with only
   Explore and Reflect; 3 onboarding questions; 2-option Support; a Reflect question
   with no person and 3 custom options; station coordinates; every rule switched
   the other way; demo results; a 2-minute clock. Open with index.html?content=test-every-shape
   Regenerate it rather than editing by hand. */
window.SFL_CONTENT = {
 "title": "Every Shape Test",
 "time_limit_minutes": 2,
 "results_mode": "demo",
 "rules": {
  "person_questions": [
   {
    "id": "want",
    "label": "What would you like to work on?"
   },
   {
    "id": "strengths",
    "label": "What are you good at?"
   },
   {
    "id": "weaknesses",
    "label": "What are you less good at?"
   }
  ],
  "station_questions": [
   {
    "id": "task",
    "label": "What task needs doing here?"
   },
   {
    "id": "skills",
    "label": "What skills does this station need?"
   }
  ],
  "reasons": [
   {
    "id": "station-requirements",
    "label": "Workspace requirements (what the station needs done)",
    "needs": [
     {
      "target": "station",
      "questions": [
       "task"
      ]
     }
    ]
   },
   {
    "id": "station-skills",
    "label": "Workspace skills (the skills the station needs)",
    "needs": [
     {
      "target": "station",
      "questions": [
       "skills"
      ]
     }
    ]
   },
   {
    "id": "person-preference",
    "label": "Employee preference (what this person wants to work on)",
    "needs": [
     {
      "target": "person",
      "questions": [
       "want"
      ]
     }
    ]
   },
   {
    "id": "person-skills",
    "label": "Employee skills (what this person is good or less good at)",
    "needs": [
     {
      "target": "person",
      "questions": [
       "strengths",
       "weaknesses"
      ]
     }
    ]
   },
   {
    "id": "coverage",
    "label": "Coverage (making sure every station has someone, based on the descriptions)",
    "needs": []
   }
  ],
  "reflect_default_options": [
   {
    "id": "positive",
    "label": "Positive"
   },
   {
    "id": "neutral",
    "label": "Neutral"
   },
   {
    "id": "negative",
    "label": "Negative"
   },
   {
    "id": "idk",
    "label": "I don't know"
   }
  ],
  "reflect_idk_option_id": "idk",
  "support_order": "any",
  "confirm_before_support": false,
  "show_support_outcomes": false,
  "ask_reason_for_unmoved": true,
  "notes_in_reflect": true,
  "notes_include_onboarding": false,
  "can_skip_explore_points": false
 },
 "scoring": {
  "onboarding": {
   "points_by_distance": [
    1,
    0.5,
    0,
    0
   ]
  },
  "explore": {
   "points_useful": 1,
   "points_not_useful": 0
  },
  "assign": {
   "placement_points": 1,
   "reason_points": 0.5
  },
  "support": {
   "tier_points": {
    "recommended": 1,
    "acceptable": 1,
    "weak": 0
   }
  },
  "reflect": {
   "points_correct": 1,
   "points_idk_when_known": 0
  }
 },
 "benchmark": {
  "note": "This percentile is our own estimate for this simulation, not a McKinsey figure. McKinsey does not publish how this game is scored, and parts of the game are still being confirmed, so we score how closely your choices match the approach we teach. In Support, any reasonable response earns full marks; only clearly weak ones do not. Candidates who pass typically score in the top quartile, but we recommend aiming for the 90th and above.",
  "phase_weights": {
   "onboarding": 10,
   "explore": 15,
   "assign": 25,
   "support": 25,
   "reflect": 25
  },
  "zones": [
   {
    "from": 0,
    "label": "Below 70th"
   },
   {
    "from": 70,
    "label": "Borderline"
   },
   {
    "from": 80,
    "label": "Likely pass"
   },
   {
    "from": 90,
    "label": "Comfortable"
   }
  ],
  "percentiles": [
   [
    0,
    1
   ],
   [
    20,
    5
   ],
   [
    35,
    12
   ],
   [
    45,
    20
   ],
   [
    55,
    30
   ],
   [
    62,
    40
   ],
   [
    68,
    50
   ],
   [
    74,
    60
   ],
   [
    79,
    68
   ],
   [
    84,
    75
   ],
   [
    88,
    80
   ],
   [
    91,
    85
   ],
   [
    94,
    90
   ],
   [
    96,
    94
   ],
   [
    98,
    97
   ],
   [
    100,
    99
   ]
  ]
 },
 "labels": {
  "login_lede": "Please sign in to begin.",
  "start_button": "Start",
  "continue": "Continue",
  "restart": "Restart",
  "restart_title": "Restart the simulation?",
  "restart_body": "Your answers will be lost.",
  "cancel": "Cancel",
  "fullscreen": "Full screen",
  "exit_fullscreen": "Exit full screen",
  "timer_min": "min",
  "timer_up": "Time's up",
  "timer_paused": "Timer paused",
  "onboarding": "Onboarding",
  "onboarding_brief": "Project brief",
  "onboarding_rank": "Rank questions",
  "onboarding_answers": "Answers",
  "onboarding_answers_heading": "Here are the answers to all four questions",
  "rank_hint": "Drag the questions into order, or use the arrows. 1 = ask first.",
  "move_up": "Move up",
  "move_down": "Move down",
  "phase_explore": "Explore",
  "phase_assign": "Assign",
  "phase_support": "Support",
  "phase_reflect": "Reflect",
  "explore_points": "Explore points",
  "explore_hint": "Click a team member or a work station to ask a question. Each question costs 1 point.",
  "assign_hint": "Drag team members onto work stations, or click a person and then a station.",
  "support_hint": "Click the glowing team member to read their message.",
  "support_hint_any": "Click a glowing team member to read their message.",
  "ask_title": "Ask {name}",
  "ask_point": "1 point",
  "ask_no_points": "You have no explore points left.",
  "ask_close": "Close",
  "reason_title": "Why did you place {name} at {station}?",
  "reason_sub": "Choose the reason that best matches your decision.",
  "support_confirm_title": "Read {name}'s message?",
  "support_confirm_yes": "Read",
  "support_confirm_no": "Not now",
  "support_submit": "Submit",
  "support_outcome_title": "What happened",
  "support_close": "Back to the map",
  "reflect_counter": "Question {n} of {total}",
  "notes_title": "Notes",
  "notes_team": "Team",
  "notes_stations": "Stations",
  "notes_project": "Project",
  "notes_nothing": "Nothing asked yet",
  "at_station": "at {station}",
  "day_begin": "Begin {day}",
  "finish_title": "You have completed the simulation",
  "finish_button": "See your results",
  "results_title": "Your result",
  "print": "Print",
  "csv": "Download CSV",
  "tile_onboarding": "Onboarding",
  "tile_explore": "Explore",
  "tile_assign": "Assign",
  "tile_support": "Support",
  "tile_reflect": "Reflect",
  "out_of": "out of {n}",
  "late": "answered after time ran out",
  "weighted_line": "Weighted score {n} / 100",
  "time_left_line": "Finished with {n} min left",
  "time_up_line": "Time ran out before the end; late answers are marked",
  "your_answer": "Your answer",
  "our_view": "Our view",
  "not_answered": "Not answered",
  "recommended_label": "Recommended",
  "reason_flag": "you had not asked what this reason relies on",
  "reason_none": "no reason asked (not moved)",
  "unused_points": "{n} explore point(s) not used",
  "demo_note": "This is the free demo, which shows your score and percentile only. Our full simulations come with every answer explained in detail."
 },
 "start": {
  "heading": "Sustainable Futures Lab",
  "body": "You will lead a sustainability project through an Onboarding step and three days. Each day has four parts: Explore, Assign, Support and Reflect. Each day starts fresh.\n\nYou have {minutes} minutes. You cannot go back to an earlier part. Keep notes as you go: you will need them."
 },
 "onboarding": {
  "context": "Kereni Island Restoration Project\n\nKereni is a small island whose hillsides have lost much of their native plant cover. Without roots to hold it, soil washes into the stream and the bay whenever it rains, clouding the water and threatening a seabird colony that nests on the northern cliffs.\n\nYou are leading a team of four for the next three days, before the rainy season begins. The aim is to protect the most damaged slopes and keep the colony safe.\n\nStakeholders: the island council, which funds the project; the fishing village on the bay, which depends on clear water and beach access; and a small tour operator who runs boat trips to the colony.",
  "rank_prompt": "Before you start, which questions would you ask first?",
  "questions": [
   {
    "id": "goal",
    "text": "What exactly must the project achieve in these three days, and how will the council judge success?",
    "answer": "The council wants planting and soil protection in place on the two worst slopes before the rains, with no drop in the number of nesting seabirds. Success is judged on both.",
    "recommended_position": 1,
    "why": "This is the blocker. Without knowing the goal, none of the other answers can be put to use."
   },
   {
    "id": "site",
    "text": "What condition are the slopes and the stream in right now?",
    "answer": "The northern slopes are the worst, with large patches of bare soil. The stream already turns muddy after light rain.",
    "recommended_position": 2,
    "why": "Once you know the goal, understand the site before planning the work. Understanding comes before aligning people."
   },
   {
    "id": "team",
    "text": "What does each team member see as the biggest risk to the plan?",
    "answer": "Maya worries most about erosion, Daniel about disturbing the nesting birds, Priya about how the village will react, and Tom about unreliable equipment.",
    "recommended_position": 3,
    "why": "Align your own team next. Their views matter most once you know the goal and the site."
   }
  ]
 },
 "days": [
  {
   "id": "dA",
   "name": "Day 1",
   "intro": "Rain is forecast later this week. Today the team starts work around the northern slopes.",
   "phases": [
    "assign",
    "support",
    "reflect"
   ],
   "people": [
    {
     "id": "maya",
     "name": "Maya Okafor",
     "role": "Ecologist",
     "description": "Studies how the island's plants, soil and animals depend on each other.",
     "good_stations": [
      "soil"
     ],
     "placement_why": "Maya's skill is reading soil and plant data, and she wants to work on the eroded slopes. Community Liaison is a poor fit: she finds big meetings draining.",
     "answers": {
      "want": {
       "text": "I'd like to get my hands in the soil on the northern slopes. That's where the erosion is worst.",
       "useful": true,
       "why": "Her preference was not obvious from her title: an ecologist could fit several stations."
      },
      "strengths": {
       "text": "Reading soil and plant data and spotting what's going wrong.",
       "useful": true,
       "why": "Points her to Soil Recovery rather than Community Liaison."
      },
      "weaknesses": {
       "text": "Public speaking. Big meetings drain me.",
       "useful": true,
       "why": "Rules her out of Community Liaison."
      }
     }
    },
    {
     "id": "tom",
     "name": "Tom Hale",
     "role": "Engineer",
     "description": "Builds and maintains field equipment, sensors and water systems.",
     "good_stations": [
      "water"
     ],
     "placement_why": "An engineer who looks after sensors fits Water Monitoring, which runs sensors.",
     "answers": {
      "want": {
       "text": "The stream sensors keep dropping out. I want to fix them.",
       "useful": false,
       "why": "His description already pointed to the sensor station."
      },
      "strengths": {
       "text": "Repairing and calibrating equipment.",
       "useful": false,
       "why": "Confirms what his description already said."
      },
      "weaknesses": {
       "text": "I lose patience in long meetings.",
       "useful": false,
       "why": "Nothing here changed where he should go."
      }
     }
    }
   ],
   "stations": [
    {
     "id": "soil",
     "name": "Soil Recovery",
     "icon": "leaf",
     "description": "Tests and treats eroded soil on the northern slopes.",
     "answers": {
      "task": {
       "text": "Take soil samples and decide where to plant ground cover first.",
       "useful": true,
       "why": "Shows the station needs someone who reads soil and plant data."
      },
      "skills": {
       "text": "Soil science, and knowing how plants hold soil in place.",
       "useful": true,
       "why": "Points to the ecologist rather than the planner."
      }
     },
     "x": 40,
     "y": 35
    },
    {
     "id": "water",
     "name": "Water Monitoring",
     "icon": "drop",
     "description": "Runs sensors that detect pollution in the stream.",
     "answers": {
      "task": {
       "text": "Keep the pollution sensors running and log the readings.",
       "useful": false,
       "why": "Sensors plus an engineer who maintains sensors was already clear."
      },
      "skills": {
       "text": "Electronics and equipment repair.",
       "useful": false,
       "why": "Confirms the obvious pairing with the engineer."
      }
     }
    }
   ],
   "start_assignment": {
    "maya": "water",
    "tom": "soil"
   },
   "support": [
    {
     "id": "d1-tom",
     "person": "tom",
     "question": "Tom: \"Before we started today I checked the stream sensors and saw a spike in mud below the northern slopes. I posted the readings in the team chat an hour ago, but nobody has replied, and the work on the slopes is carrying on as planned.\"\n\nWhat do you do?",
     "options": [
      {
       "id": "a",
       "tier": "recommended",
       "text": "Thank Tom for flagging it, then bring him and whoever is working on the slopes together for a few minutes to decide whether today's work should change.",
       "outcome": "Tom walks the slope team through the readings and they adjust the day's plan. Tom says it's good to see the data actually used.",
       "why": "Acts quickly and puts the evidence in front of the people who can act on it, with Tom involved."
      },
      {
       "id": "b",
       "tier": "acceptable",
       "text": "Tell Tom you'll review the readings yourself and pass anything important on to the slope team.",
       "outcome": "You pass a summary on an hour later. Tom is glad it was picked up, but would have liked to explain it himself.",
       "why": "The information gets through, but more slowly and without Tom."
      }
     ]
    },
    {
     "id": "d1-maya",
     "person": "maya",
     "question": "Maya, at {station}: \"Tom's readings worry me. If the rain comes early, today's planting on the upper slope could wash straight off. I'd like to switch to the lower slope, but Priya's plan starts at the top and she isn't here to discuss it.\"\n\nWhat do you do?",
     "options": [
      {
       "id": "a",
       "tier": "recommended",
       "text": "Ask Maya what switching would change, then get her and Priya together briefly to agree before more planting is done.",
       "outcome": "Maya and Priya talk it through and agree to start low and return to the top later. Maya says she's relieved she was listened to.",
       "why": "Uses the specialist's evidence and brings in the person whose plan it is, without a long delay."
      },
      {
       "id": "b",
       "tier": "acceptable",
       "text": "Let Maya switch to the lower slope today, and ask her to send Priya a short note explaining why.",
       "outcome": "Maya switches. Priya reads the note later and is a little surprised, but agrees it made sense.",
       "why": "Acts on the best information and keeps Priya informed, though she isn't part of the decision."
      },
      {
       "id": "c",
       "tier": "weak",
       "text": "Tell Maya the plan was agreed and must be followed; changing it now would confuse everyone.",
       "outcome": "Maya carries on at the top, visibly frustrated that her expertise was ignored.",
       "why": "Overly forceful: it ignores the specialist's evidence."
      }
     ],
     "when_mismatched": {
      "question": "Maya, at {station}: \"I'll be honest, I don't think I'm much use at {station}. I've just seen Tom's readings and I'm worried today's planting on the upper slope will wash away, but I'm not the one working there.\"\n\nWhat do you do?",
      "options": [
       {
        "id": "a",
        "tier": "recommended",
        "text": "Thank Maya, ask her to brief whoever is on the slopes about the risk right away, and agree to look again at who works where.",
        "outcome": "Maya passes on her advice and the planting moves lower. She's glad to help, though she still wishes she were on the slopes.",
        "why": "Gets her expertise to where it's needed now and takes her concern about her own role seriously."
       },
       {
        "id": "b",
        "tier": "acceptable",
        "text": "Ask Maya to write up her concern so you can take it to the slope team yourself.",
        "outcome": "The message gets through later in the day. Maya feels heard but sidelined.",
        "why": "The concern is passed on, but slowly and without her."
       },
       {
        "id": "c",
        "tier": "weak",
        "text": "Ask Maya to focus on her own station and leave the slopes to the people working there.",
        "outcome": "Maya goes quiet for the rest of the day.",
        "why": "Ignores a real risk and the person raising it."
       }
      ]
     }
    }
   ],
   "reflect": [
    {
     "id": "d1-r-tom",
     "person": "tom",
     "prompt": "How do you think Tom feels about the way his readings were handled today?",
     "truth_from_support": {
      "support": "d1-tom",
      "recommended": "positive",
      "acceptable": "neutral",
      "weak": "negative"
     },
     "why": "Tom's reaction followed your response to his readings: used with him involved (positive), passed on without him (neutral), dismissed (negative)."
    },
    {
     "id": "d1-r-maya",
     "person": "maya",
     "prompt": "How do you think Maya experienced today?",
     "truth_from_support": {
      "support": "d1-maya",
      "recommended": "positive",
      "acceptable": "neutral",
      "weak": "negative"
     },
     "why": "Maya was listened to (positive), partly listened to (neutral), or overruled (negative), depending on your response.",
     "when_mismatched": {
      "truth_from_support": {
       "support": "d1-maya",
       "recommended": "neutral",
       "acceptable": "negative",
       "weak": "negative"
      },
      "why": "Maya spent the day away from the work she is best at. Even when her advice was used, she still wished she were on the slopes."
     }
    }
   ]
  },
  {
   "id": "dB",
   "name": "Day 2",
   "intro": "Day 2 starts fresh. The team turns to seedlings, barriers and data.",
   "phases": [
    "explore",
    "reflect"
   ],
   "explore_points": 1,
   "people": [
    {
     "id": "maya",
     "name": "Maya Okafor",
     "role": "Ecologist",
     "description": "Studies how the island's plants, soil and animals depend on each other.",
     "good_stations": [
      "data"
     ],
     "placement_why": "Maya wants to pull the readings together and is best at spotting patterns across data, which is the Data Hub's job. Potting seedlings is not her strength.",
     "answers": {
      "want": {
       "text": "After yesterday, I'd like to pull all the readings together and see the full picture.",
       "useful": true,
       "why": "Not guessable from 'ecologist'. It points her to the Data Hub."
      },
      "strengths": {
       "text": "Spotting patterns across different sets of data.",
       "useful": true,
       "why": "Matches what the Data Hub needs."
      },
      "weaknesses": {
       "text": "I'm not patient with delicate hands-on work like potting seedlings.",
       "useful": true,
       "why": "Rules her out of the Nursery, the natural guess for an ecologist."
      }
     }
    },
    {
     "id": "daniel",
     "name": "Daniel Reyes",
     "role": "Biologist",
     "description": "Specialist in the island's seabirds and their nesting behaviour.",
     "good_stations": [
      "wildlife"
     ],
     "placement_why": "A wildlife specialist and a Wildlife Survey station pair themselves.",
     "answers": {
      "want": {
       "text": "I want to see whether birds and lizards are using yesterday's planted areas.",
       "useful": false,
       "why": "The wildlife pairing was already obvious."
      },
      "strengths": {
       "text": "Identifying animals quickly in the field.",
       "useful": false,
       "why": "Confirms what his description already said."
      },
      "weaknesses": {
       "text": "Spreadsheets. I leave those to others.",
       "useful": false,
       "why": "Nothing here changed where he should go."
      }
     }
    },
    {
     "id": "priya",
     "name": "Priya Nair",
     "role": "Habitat planner",
     "description": "Designs where and how restored areas should be laid out.",
     "good_stations": [
      "nursery"
     ],
     "placement_why": "Priya wants to choose the seedlings for her own layout, and matching plants to places is her strength, which is the Nursery's task.",
     "answers": {
      "want": {
       "text": "I'd like to pick the seedlings for the areas I've laid out, so the plan actually works on the ground.",
       "useful": true,
       "why": "Points her to the Nursery rather than the Data Hub."
      },
      "strengths": {
       "text": "Matching the right plants to the right places in a layout.",
       "useful": true,
       "why": "Matches what the Nursery needs."
      },
      "weaknesses": {
       "text": "Crunching numbers in a big dataset.",
       "useful": true,
       "why": "Rules her out of the Data Hub."
      }
     }
    }
   ],
   "stations": [
    {
     "id": "nursery",
     "name": "Nursery",
     "icon": "sprout",
     "description": "Grows native seedlings ready for planting.",
     "answers": {
      "task": {
       "text": "Choose and prepare the right seedlings for each planned area.",
       "useful": true,
       "why": "Shows the station needs someone who knows the planting layout."
      },
      "skills": {
       "text": "Knowing which plants suit which spots in the layout.",
       "useful": true,
       "why": "Points to the planner rather than the ecologist."
      }
     }
    },
    {
     "id": "wildlife",
     "name": "Wildlife Survey",
     "icon": "paw",
     "description": "Records which animals use the restored areas.",
     "answers": {
      "task": {
       "text": "Walk set routes and record every animal seen.",
       "useful": false,
       "why": "The station name already made its task clear."
      },
      "skills": {
       "text": "Identifying animals.",
       "useful": false,
       "why": "Confirms the obvious pairing with the biologist."
      }
     }
    },
    {
     "id": "data",
     "name": "Data Hub",
     "icon": "chart",
     "description": "Collects everyone's readings and shares a daily summary.",
     "answers": {
      "task": {
       "text": "Combine every station's readings into one summary for the council by evening.",
       "useful": true,
       "why": "Shows the station needs someone strong with data."
      },
      "skills": {
       "text": "Working with data and spotting patterns.",
       "useful": true,
       "why": "Points to the ecologist rather than the planner."
      }
     }
    }
   ],
   "start_assignment": {
    "maya": "nursery",
    "daniel": "wildlife",
    "priya": "data"
   },
   "support": [],
   "reflect": [
    {
     "id": "b-r1",
     "person": "daniel",
     "prompt": "How sure is Daniel about the survey?",
     "options": [
      {
       "id": "sure",
       "label": "Sure"
      },
      {
       "id": "unsure",
       "label": "Unsure"
      },
      {
       "id": "idk",
       "label": "I don't know"
      }
     ],
     "truth": "sure",
     "why": "Test item."
    },
    {
     "id": "b-r2",
     "prompt": "How did the project go overall?",
     "unknowable": true,
     "why": "Test item with no person."
    }
   ]
  },
  {
   "id": "dC",
   "name": "Day 3",
   "intro": "The final day. The team prepares to hand the project over to the island.",
   "phases": [
    "explore",
    "assign",
    "support",
    "reflect"
   ],
   "explore_points": 4,
   "people": [
    {
     "id": "maya",
     "name": "Maya Okafor",
     "role": "Ecologist",
     "description": "Studies how the island's plants, soil and animals depend on each other.",
     "good_stations": [
      "seeds"
     ],
     "placement_why": "An ecologist who recognises native plants fits Seed Collection.",
     "answers": {
      "want": {
       "text": "Collecting seeds from the last native trees before they drop.",
       "useful": false,
       "why": "The ecologist and seed pairing was already the natural fit."
      },
      "strengths": {
       "text": "Recognising native plants and when their seeds are ripe.",
       "useful": false,
       "why": "Confirms what her description suggested."
      },
      "weaknesses": {
       "text": "Presenting to the council makes me nervous.",
       "useful": false,
       "why": "She was never a likely fit for the council report."
      }
     }
    },
    {
     "id": "daniel",
     "name": "Daniel Reyes",
     "role": "Biologist",
     "description": "Specialist in the island's seabirds and their nesting behaviour.",
     "good_stations": [
      "report"
     ],
     "placement_why": "Daniel holds the best evidence on the colony and wants to write it up, while he admits he is weak at negotiating, which Visitor Boats needs. His description made Visitor Boats look like the obvious fit, and it wasn't.",
     "answers": {
      "want": {
       "text": "I'd like to write up what happened to the colony this week. I've got the best evidence.",
       "useful": true,
       "why": "Reveals he fits the council report, not the boats station his description suggested."
      },
      "strengths": {
       "text": "Turning field counts into clear evidence.",
       "useful": true,
       "why": "Matches what the Council Report needs."
      },
      "weaknesses": {
       "text": "Haggling. I tend to give in too quickly.",
       "useful": true,
       "why": "Rules him out of the negotiation at Visitor Boats."
      }
     }
    },
    {
     "id": "priya",
     "name": "Priya Nair",
     "role": "Habitat planner",
     "description": "Designs where and how restored areas should be laid out.",
     "good_stations": [
      "boats"
     ],
     "placement_why": "Priya knows the tour operator and is good at finding compromises, which the boat-route negotiation needs. Long technical reports are not her strength.",
     "answers": {
      "want": {
       "text": "Sorting out the boat routes with the tour operator. I know him from the village.",
       "useful": true,
       "why": "Not guessable from 'habitat planner'. It points her to Visitor Boats."
      },
      "strengths": {
       "text": "Finding compromises that both sides can live with.",
       "useful": true,
       "why": "Matches the negotiation Visitor Boats needs."
      },
      "weaknesses": {
       "text": "Writing long technical reports.",
       "useful": true,
       "why": "Rules her out of the Council Report."
      }
     }
    },
    {
     "id": "tom",
     "name": "Tom Hale",
     "role": "Engineer",
     "description": "Builds and maintains field equipment, sensors and water systems.",
     "good_stations": [
      "equipment"
     ],
     "placement_why": "An engineer who maintains equipment fits the Equipment Store.",
     "answers": {
      "want": {
       "text": "Getting every sensor checked before we leave the island.",
       "useful": false,
       "why": "The engineer and equipment pairing was already clear."
      },
      "strengths": {
       "text": "Fixing equipment in the field.",
       "useful": false,
       "why": "Confirms what his description already said."
      },
      "weaknesses": {
       "text": "I don't enjoy dealing with customers.",
       "useful": false,
       "why": "Nothing here changed where he should go."
      }
     }
    },
    {
     "id": "ana",
     "name": "Ana Lopes",
     "role": "Data analyst",
     "description": "Keeps the project's numbers in order.",
     "good_stations": [
      "store"
     ],
     "placement_why": "Test person.",
     "answers": {
      "want": {
       "text": "Numbers.",
       "useful": false,
       "why": "t"
      },
      "strengths": {
       "text": "Spreadsheets.",
       "useful": false,
       "why": "t"
      },
      "weaknesses": {
       "text": "Boats.",
       "useful": false,
       "why": "t"
      }
     }
    }
   ],
   "stations": [
    {
     "id": "boats",
     "name": "Visitor Boats",
     "icon": "boat",
     "description": "Works with the tour operator to keep boat trips away from nesting areas.",
     "answers": {
      "task": {
       "text": "Agree new boat routes with the tour operator that keep boats away from the nests.",
       "useful": true,
       "why": "Shows this is a negotiation, not a bird-counting job."
      },
      "skills": {
       "text": "Negotiating with local businesses.",
       "useful": true,
       "why": "Points away from the seabird specialist and towards the planner."
      }
     }
    },
    {
     "id": "seeds",
     "name": "Seed Collection",
     "icon": "leaf",
     "description": "Gathers seeds from the island's surviving native plants.",
     "answers": {
      "task": {
       "text": "Collect and label seeds from native plants.",
       "useful": false,
       "why": "The station name already made its task clear."
      },
      "skills": {
       "text": "Plant identification.",
       "useful": false,
       "why": "Confirms the obvious pairing with the ecologist."
      }
     }
    },
    {
     "id": "equipment",
     "name": "Equipment Store",
     "icon": "wrench",
     "description": "Repairs, checks and hands out the team's tools and sensors.",
     "answers": {
      "task": {
       "text": "Check, repair and pack every sensor and tool.",
       "useful": false,
       "why": "The station name already made its task clear."
      },
      "skills": {
       "text": "Mechanical and electrical repair.",
       "useful": false,
       "why": "Confirms the obvious pairing with the engineer."
      }
     }
    },
    {
     "id": "report",
     "name": "Council Report",
     "icon": "document",
     "description": "Prepares the end-of-project report for the island council.",
     "answers": {
      "task": {
       "text": "Show the council, with evidence, how the colony and the slopes changed this week.",
       "useful": true,
       "why": "Shows the report needs someone holding the colony evidence."
      },
      "skills": {
       "text": "Using field evidence to make a clear case.",
       "useful": true,
       "why": "Points to the biologist rather than the planner."
      }
     }
    },
    {
     "id": "store",
     "name": "Records Office",
     "icon": "chart",
     "description": "Stores records.",
     "answers": {
      "task": {
       "text": "File things.",
       "useful": false,
       "why": "t"
      },
      "skills": {
       "text": "Tidiness.",
       "useful": false,
       "why": "t"
      }
     }
    }
   ],
   "start_assignment": {
    "maya": "equipment",
    "daniel": "boats",
    "priya": "report",
    "tom": "seeds",
    "ana": "store"
   },
   "support": [
    {
     "id": "d3-daniel",
     "person": "daniel",
     "question": "Daniel, at {station}: \"For the council report I want to say the colony is safe. Maya thinks that's too strong, because one week of counts isn't enough to be sure. We've been going back and forth all morning.\"\n\nWhat do you do?",
     "options": [
      {
       "id": "a",
       "tier": "recommended",
       "text": "Suggest they report what the counts show so far, state clearly what one week can't prove, and recommend follow-up counts.",
       "outcome": "Both agree to the wording. Daniel is happy the good news is in, and Maya is happy it's honest.",
       "why": "Resolves the disagreement with an answer both can support, and keeps the report accurate."
      },
      {
       "id": "b",
       "tier": "acceptable",
       "text": "Ask Daniel to use Maya's more cautious wording, since the council may make funding decisions based on it.",
       "outcome": "Daniel agrees, though he feels his results are being undersold.",
       "why": "Accurate, but settles the disagreement for one side."
      },
      {
       "id": "c",
       "tier": "weak",
       "text": "Decide for them: Daniel owns the report, so his wording stands.",
       "outcome": "Maya drops the argument but feels overruled. Daniel is pleased to have his wording.",
       "why": "Overly forceful, and puts an overstated claim in front of the council."
      }
     ],
     "when_mismatched": {
      "question": "Daniel, at {station}: \"I heard the council report is going to say the colony is safe. That's too strong for one week of counts, but I'm not the one writing it, so I'm not sure it's my place to say.\"\n\nWhat do you do?",
      "options": [
       {
        "id": "a",
        "tier": "recommended",
        "text": "Encourage Daniel to share his evidence with whoever is writing the report, and ask them to include what one week can't prove.",
        "outcome": "The wording is corrected. Daniel is glad, though he would have liked to write that section himself.",
        "why": "Gets the evidence into the report and values Daniel's view."
       },
       {
        "id": "b",
        "tier": "acceptable",
        "text": "Offer to pass Daniel's concern on to the report writer yourself.",
        "outcome": "The wording is softened. Daniel feels his point got through second-hand.",
        "why": "The concern is acted on, but without Daniel."
       },
       {
        "id": "c",
        "tier": "weak",
        "text": "Tell Daniel the report isn't his job today, and ask him to focus on his own station.",
        "outcome": "Daniel says nothing more, and the report goes out with the overstated claim.",
        "why": "Ignores the person with the best evidence."
       }
      ]
     }
    },
    {
     "id": "d3-priya",
     "person": "priya",
     "question": "Priya: \"The tour operator says moving the boat routes will cost him customers, and he's threatening to complain to the council. I think a compromise is possible, but Daniel's latest counts would really help my case, and he's busy with the report.\"\n\nWhat do you do?",
     "options": [
      {
       "id": "a",
       "tier": "recommended",
       "text": "Ask Daniel to take a short break from the report to give Priya the few figures she needs, then let Priya propose a trial route to the operator.",
       "outcome": "With the figures in hand, the operator agrees to a two-week trial route. Priya is delighted.",
       "why": "A small, targeted request unblocks a stakeholder problem before it escalates."
      },
      {
       "id": "b",
       "tier": "acceptable",
       "text": "Ask Priya to offer the operator a meeting with the council, so the issue is settled together.",
       "outcome": "The operator agrees to wait for the meeting. Priya is relieved, but the issue isn't settled.",
       "why": "Calms things down, but pushes the decision later."
      },
      {
       "id": "c",
       "tier": "weak",
       "text": "Tell Priya to inform the operator that the new routes are final.",
       "outcome": "The operator files a complaint with the council. Priya feels she was left to take the heat.",
       "why": "Overly forceful with a stakeholder, and leaves Priya exposed."
      }
     ]
    },
    {
     "id": "d3-tom",
     "person": "tom",
     "question": "Tom: \"I've been asked to pack up every sensor today, but Priya wants two left in place for her boat-route trial, and Maya wants one moved to the seed area. There aren't enough to do all three.\"\n\nWhat do you do?",
     "options": [
      {
       "id": "a",
       "tier": "recommended",
       "text": "Ask Tom which sensors are free, then quickly check with Priya and Maya which request matters most for the project's goal before deciding.",
       "outcome": "They agree to leave two for the trial and move one next month. Tom is glad not to be stuck in the middle.",
       "why": "Involves the people affected and decides against the project's goal."
      },
      {
       "id": "b",
       "tier": "acceptable",
       "text": "Decide yourself: keep two sensors for the boat trial, since it protects the colony, and tell Maya why.",
       "outcome": "Tom sets them up. Maya is disappointed but understands. Tom simply follows the decision.",
       "why": "A clear, sensible call, made without the people affected."
      },
      {
       "id": "c",
       "tier": "weak",
       "text": "Ask Tom to pack nothing until everyone has had a full meeting about equipment next week.",
       "outcome": "The sensors sit unused, and Tom has nothing ready to hand over when the team leaves.",
       "why": "Delays a small decision far too long."
      }
     ]
    },
    {
     "id": "d3-maya",
     "person": "maya",
     "question": "Maya: \"I've collected far more seeds than planned, but nobody has agreed who will store and plant them after we leave. If they aren't stored properly this week, they'll be wasted.\"\n\nWhat do you do?",
     "options": [
      {
       "id": "a",
       "tier": "recommended",
       "text": "Help Maya contact the council and the village this afternoon to agree who will look after the seeds, and write the arrangement into the handover.",
       "outcome": "The village school offers to store and plant the seeds with the council's help. Maya is thrilled.",
       "why": "Turns a loose end into an agreed handover with the people who will stay on the island."
      },
      {
       "id": "b",
       "tier": "acceptable",
       "text": "Ask Maya to store the seeds as well as she can, and flag the question in the council report.",
       "outcome": "The seeds are stored for now. Maya is satisfied, but unsure what will happen to them.",
       "why": "Protects the seeds for now, but leaves the key question open."
      },
      {
       "id": "c",
       "tier": "weak",
       "text": "Tell Maya the extra seeds are outside the project's scope, so she should stop collecting.",
       "outcome": "Maya stops, frustrated that the seeds may go to waste.",
       "why": "Dismisses useful work and a real risk."
      }
     ]
    }
   ],
   "reflect": [
    {
     "id": "d3-r-daniel",
     "person": "daniel",
     "prompt": "How do you think Daniel experienced today?",
     "truth_from_support": {
      "support": "d3-daniel",
      "recommended": "positive",
      "acceptable": "neutral",
      "weak": "positive"
     },
     "why": "Daniel was happy with a shared wording (positive), felt undersold with Maya's wording (neutral), and was pleased when his own wording was simply imposed (positive), even though that was a weak choice for the team.",
     "when_mismatched": {
      "truth_from_support": {
       "support": "d3-daniel",
       "recommended": "neutral",
       "acceptable": "neutral",
       "weak": "negative"
      },
      "why": "Daniel spent the day away from the report he was best placed to write, so even when his point got through he was only partly satisfied."
     }
    },
    {
     "id": "d3-r-priya",
     "person": "priya",
     "prompt": "How does Priya feel about the talks with the tour operator?",
     "truth_from_support": {
      "support": "d3-priya",
      "recommended": "positive",
      "acceptable": "neutral",
      "weak": "negative"
     },
     "why": "A trial route agreed (positive), a meeting that postponed the issue (neutral), or a complaint she had to face (negative)."
    },
    {
     "id": "d3-r-tom",
     "person": "tom",
     "prompt": "How do you think Tom experienced today?",
     "truth_from_support": {
      "support": "d3-tom",
      "recommended": "positive",
      "acceptable": "neutral",
      "weak": "negative"
     },
     "why": "Tom was glad not to be stuck in the middle (positive), simply followed a decision (neutral), or had nothing ready to hand over (negative)."
    },
    {
     "id": "d3-r-maya",
     "person": "maya",
     "prompt": "How certain is Maya that her seeds will be put to good use?",
     "options": [
      {
       "id": "positive",
       "label": "Certain"
      },
      {
       "id": "neutral",
       "label": "Unsure"
      },
      {
       "id": "negative",
       "label": "Doubtful"
      },
      {
       "id": "idk",
       "label": "I don't know"
      }
     ],
     "truth_from_support": {
      "support": "d3-maya",
      "recommended": "positive",
      "acceptable": "neutral",
      "weak": "negative"
     },
     "why": "An agreed handover made her certain; storing them without a plan left her unsure; being told to stop made her doubtful."
    }
   ]
  },
  {
   "id": "dD",
   "name": "Day 4",
   "intro": "Rain is forecast later this week. Today the team starts work around the northern slopes.",
   "phases": [
    "explore",
    "assign",
    "support",
    "reflect"
   ],
   "explore_points": 3,
   "people": [
    {
     "id": "maya",
     "name": "Maya Okafor",
     "role": "Ecologist",
     "description": "Studies how the island's plants, soil and animals depend on each other.",
     "good_stations": [
      "soil"
     ],
     "placement_why": "Maya's skill is reading soil and plant data, and she wants to work on the eroded slopes. Community Liaison is a poor fit: she finds big meetings draining.",
     "answers": {
      "want": {
       "text": "I'd like to get my hands in the soil on the northern slopes. That's where the erosion is worst.",
       "useful": true,
       "why": "Her preference was not obvious from her title: an ecologist could fit several stations."
      },
      "strengths": {
       "text": "Reading soil and plant data and spotting what's going wrong.",
       "useful": true,
       "why": "Points her to Soil Recovery rather than Community Liaison."
      },
      "weaknesses": {
       "text": "Public speaking. Big meetings drain me.",
       "useful": true,
       "why": "Rules her out of Community Liaison."
      }
     }
    },
    {
     "id": "daniel",
     "name": "Daniel Reyes",
     "role": "Biologist",
     "description": "Specialist in the island's seabirds and their nesting behaviour.",
     "good_stations": [
      "seabirds"
     ],
     "placement_why": "A seabird specialist and a Seabird Care station pair themselves.",
     "answers": {
      "want": {
       "text": "The nesting colony, of course. It's a critical week for the chicks.",
       "useful": false,
       "why": "A seabird specialist and a seabird station were already an obvious pair."
      },
      "strengths": {
       "text": "Handling and counting birds without disturbing them.",
       "useful": false,
       "why": "Confirms what his description already said."
      },
      "weaknesses": {
       "text": "I'm not much use with electronics.",
       "useful": false,
       "why": "Nothing here changed where he should go."
      }
     }
    },
    {
     "id": "priya",
     "name": "Priya Nair",
     "role": "Habitat planner",
     "description": "Designs where and how restored areas should be laid out.",
     "good_stations": [
      "liaison"
     ],
     "placement_why": "Priya ran the village's planning workshops and is good at explaining plans to non-experts, which is exactly what Community Liaison needs.",
     "answers": {
      "want": {
       "text": "I'd like to be out talking with the village. I ran their planning workshops last year.",
       "useful": true,
       "why": "Not guessable from 'habitat planner'. It points her to Community Liaison."
      },
      "strengths": {
       "text": "Explaining maps and plans so that anyone can follow them.",
       "useful": true,
       "why": "Matches what Community Liaison needs."
      },
      "weaknesses": {
       "text": "Lab testing isn't my area.",
       "useful": true,
       "why": "Rules her out of Soil Recovery."
      }
     }
    },
    {
     "id": "tom",
     "name": "Tom Hale",
     "role": "Engineer",
     "description": "Builds and maintains field equipment, sensors and water systems.",
     "good_stations": [
      "water"
     ],
     "placement_why": "An engineer who looks after sensors fits Water Monitoring, which runs sensors.",
     "answers": {
      "want": {
       "text": "The stream sensors keep dropping out. I want to fix them.",
       "useful": false,
       "why": "His description already pointed to the sensor station."
      },
      "strengths": {
       "text": "Repairing and calibrating equipment.",
       "useful": false,
       "why": "Confirms what his description already said."
      },
      "weaknesses": {
       "text": "I lose patience in long meetings.",
       "useful": false,
       "why": "Nothing here changed where he should go."
      }
     }
    }
   ],
   "stations": [
    {
     "id": "seabirds",
     "name": "Seabird Care",
     "icon": "bird",
     "description": "Monitors the nesting colony and keeps disturbance low.",
     "answers": {
      "task": {
       "text": "Count nests every day and keep people away from the colony.",
       "useful": false,
       "why": "The station name already made its task clear."
      },
      "skills": {
       "text": "Bird handling, patience and quiet fieldwork.",
       "useful": false,
       "why": "Confirms the obvious pairing with the biologist."
      }
     }
    },
    {
     "id": "soil",
     "name": "Soil Recovery",
     "icon": "leaf",
     "description": "Tests and treats eroded soil on the northern slopes.",
     "answers": {
      "task": {
       "text": "Take soil samples and decide where to plant ground cover first.",
       "useful": true,
       "why": "Shows the station needs someone who reads soil and plant data."
      },
      "skills": {
       "text": "Soil science, and knowing how plants hold soil in place.",
       "useful": true,
       "why": "Points to the ecologist rather than the planner."
      }
     }
    },
    {
     "id": "water",
     "name": "Water Monitoring",
     "icon": "drop",
     "description": "Runs sensors that detect pollution in the stream.",
     "answers": {
      "task": {
       "text": "Keep the pollution sensors running and log the readings.",
       "useful": false,
       "why": "Sensors plus an engineer who maintains sensors was already clear."
      },
      "skills": {
       "text": "Electronics and equipment repair.",
       "useful": false,
       "why": "Confirms the obvious pairing with the engineer."
      }
     }
    },
    {
     "id": "liaison",
     "name": "Community Liaison",
     "icon": "chat",
     "description": "Keeps the fishing village informed about the work.",
     "answers": {
      "task": {
       "text": "Hold a meeting with the fishing village about access to the beach.",
       "useful": true,
       "why": "Shows the station needs someone comfortable with public meetings."
      },
      "skills": {
       "text": "Clear explaining and calm handling of concerns.",
       "useful": true,
       "why": "Points to the planner who explains plans well."
      }
     }
    }
   ],
   "start_assignment": {
    "maya": "liaison",
    "daniel": "water",
    "priya": "seabirds",
    "tom": "soil"
   },
   "support": [
    {
     "id": "d1-tom",
     "person": "tom",
     "question": "Tom: \"Before we started today I checked the stream sensors and saw a spike in mud below the northern slopes. I posted the readings in the team chat an hour ago, but nobody has replied, and the work on the slopes is carrying on as planned.\"\n\nWhat do you do?",
     "options": [
      {
       "id": "a",
       "tier": "recommended",
       "text": "Thank Tom for flagging it, then bring him and whoever is working on the slopes together for a few minutes to decide whether today's work should change.",
       "outcome": "Tom walks the slope team through the readings and they adjust the day's plan. Tom says it's good to see the data actually used.",
       "why": "Acts quickly and puts the evidence in front of the people who can act on it, with Tom involved."
      },
      {
       "id": "b",
       "tier": "acceptable",
       "text": "Tell Tom you'll review the readings yourself and pass anything important on to the slope team.",
       "outcome": "You pass a summary on an hour later. Tom is glad it was picked up, but would have liked to explain it himself.",
       "why": "The information gets through, but more slowly and without Tom."
      },
      {
       "id": "c",
       "tier": "weak",
       "text": "Tell Tom that mud after rain is normal, and the slope team shouldn't be distracted.",
       "outcome": "Tom stops posting updates for the rest of the day.",
       "why": "Dismisses a team member's evidence without looking at it."
      }
     ]
    },
    {
     "id": "d1-maya",
     "person": "maya",
     "question": "Maya, at {station}: \"Tom's readings worry me. If the rain comes early, today's planting on the upper slope could wash straight off. I'd like to switch to the lower slope, but Priya's plan starts at the top and she isn't here to discuss it.\"\n\nWhat do you do?",
     "options": [
      {
       "id": "a",
       "tier": "recommended",
       "text": "Ask Maya what switching would change, then get her and Priya together briefly to agree before more planting is done.",
       "outcome": "Maya and Priya talk it through and agree to start low and return to the top later. Maya says she's relieved she was listened to.",
       "why": "Uses the specialist's evidence and brings in the person whose plan it is, without a long delay."
      },
      {
       "id": "b",
       "tier": "acceptable",
       "text": "Let Maya switch to the lower slope today, and ask her to send Priya a short note explaining why.",
       "outcome": "Maya switches. Priya reads the note later and is a little surprised, but agrees it made sense.",
       "why": "Acts on the best information and keeps Priya informed, though she isn't part of the decision."
      },
      {
       "id": "c",
       "tier": "weak",
       "text": "Tell Maya the plan was agreed and must be followed; changing it now would confuse everyone.",
       "outcome": "Maya carries on at the top, visibly frustrated that her expertise was ignored.",
       "why": "Overly forceful: it ignores the specialist's evidence."
      }
     ],
     "when_mismatched": {
      "question": "Maya, at {station}: \"I'll be honest, I don't think I'm much use at {station}. I've just seen Tom's readings and I'm worried today's planting on the upper slope will wash away, but I'm not the one working there.\"\n\nWhat do you do?",
      "options": [
       {
        "id": "a",
        "tier": "recommended",
        "text": "Thank Maya, ask her to brief whoever is on the slopes about the risk right away, and agree to look again at who works where.",
        "outcome": "Maya passes on her advice and the planting moves lower. She's glad to help, though she still wishes she were on the slopes.",
        "why": "Gets her expertise to where it's needed now and takes her concern about her own role seriously."
       },
       {
        "id": "b",
        "tier": "acceptable",
        "text": "Ask Maya to write up her concern so you can take it to the slope team yourself.",
        "outcome": "The message gets through later in the day. Maya feels heard but sidelined.",
        "why": "The concern is passed on, but slowly and without her."
       },
       {
        "id": "c",
        "tier": "weak",
        "text": "Ask Maya to focus on her own station and leave the slopes to the people working there.",
        "outcome": "Maya goes quiet for the rest of the day.",
        "why": "Ignores a real risk and the person raising it."
       }
      ]
     }
    },
    {
     "id": "d1-priya",
     "person": "priya",
     "question": "Priya: \"People in the fishing village have heard there might be muddy water in the bay. They want to know tonight whether the beach will be closed. We don't yet know how serious Tom's reading is.\"\n\nWhat do you do?",
     "options": [
      {
       "id": "a",
       "tier": "recommended",
       "text": "Help Priya tell the village honestly what is known and what isn't, and when they will get an update once Tom has checked the sensors again.",
       "outcome": "The village appreciates the honesty and agrees to wait for tomorrow's update. Priya is pleased with how it went.",
       "why": "Honest, timely and gives the village something concrete to expect."
      },
      {
       "id": "b",
       "tier": "acceptable",
       "text": "Ask Priya to tell the village there are no plans to close the beach, and that the team will confirm tomorrow.",
       "outcome": "The village is reassured for now, though a few people ask how the team can be so sure. Priya feels a little exposed.",
       "why": "Responds quickly, but sounds more certain than the team is."
      },
      {
       "id": "c",
       "tier": "weak",
       "text": "Ask Priya not to reply until the team has a full analysis of the water, so that nothing wrong is said.",
       "outcome": "With no answer, rumours spread in the village. Priya takes several angry calls.",
       "why": "Delays too long: silence makes the situation worse."
      },
      {
       "id": "d",
       "tier": "weak",
       "text": "Tell Priya to reassure the village that the water is fine and there is nothing to worry about.",
       "outcome": "The village relaxes, until muddy water appears in the bay after light rain. Priya is left to explain.",
       "why": "Promises something the team does not know."
      }
     ]
    },
    {
     "id": "d1-daniel",
     "person": "daniel",
     "question": "Daniel: \"I've just found out the new planting route passes right below the nesting cliffs. Nobody asked me before it was agreed. If people walk there all week, some birds could abandon their nests.\"\n\nWhat do you do?",
     "options": [
      {
       "id": "a",
       "tier": "recommended",
       "text": "Get Daniel together with the slope team to mark which part of the route is too close to the nests, and move only that section.",
       "outcome": "They agree a short detour around the cliffs. Planting loses a little time, and Daniel thanks you for involving him.",
       "why": "Deals with the real risk, involves both sides, and keeps the work moving."
      },
      {
       "id": "b",
       "tier": "acceptable",
       "text": "Keep the route for today, but set quiet hours and a marked buffer, and review it with Daniel tomorrow morning.",
       "outcome": "Work continues with a buffer in place. Daniel isn't fully satisfied, but agrees to try it.",
       "why": "Reduces the risk and keeps progress, but leaves Daniel's concern partly open."
      },
      {
       "id": "c",
       "tier": "weak",
       "text": "Stop all planting near the cliffs until Daniel has completed a full survey of the colony.",
       "outcome": "Planting stops for the day. The slope team is frustrated to lose the dry weather. Daniel is pleased his concern was taken so seriously.",
       "why": "Delays action too much: a full survey was not needed to fix one section of route."
      },
      {
       "id": "d",
       "tier": "weak",
       "text": "Tell Daniel the route has been agreed and the birds will get used to it.",
       "outcome": "Daniel says nothing more, but spends the afternoon visibly upset.",
       "why": "Dismisses the specialist on the one topic he knows best."
      }
     ]
    }
   ],
   "reflect": [
    {
     "id": "d1-r-tom",
     "person": "tom",
     "prompt": "How do you think Tom feels about the way his readings were handled today?",
     "truth_from_support": {
      "support": "d1-tom",
      "recommended": "positive",
      "acceptable": "neutral",
      "weak": "negative"
     },
     "why": "Tom's reaction followed your response to his readings: used with him involved (positive), passed on without him (neutral), dismissed (negative)."
    },
    {
     "id": "d1-r-maya",
     "person": "maya",
     "prompt": "How do you think Maya experienced today?",
     "truth_from_support": {
      "support": "d1-maya",
      "recommended": "positive",
      "acceptable": "neutral",
      "weak": "negative"
     },
     "why": "Maya was listened to (positive), partly listened to (neutral), or overruled (negative), depending on your response.",
     "when_mismatched": {
      "truth_from_support": {
       "support": "d1-maya",
       "recommended": "neutral",
       "acceptable": "negative",
       "weak": "negative"
      },
      "why": "Maya spent the day away from the work she is best at. Even when her advice was used, she still wished she were on the slopes."
     }
    },
    {
     "id": "d1-r-priya",
     "person": "priya",
     "prompt": "How confident do you think Priya feels after today's contact with the village?",
     "options": [
      {
       "id": "positive",
       "label": "Confident"
      },
      {
       "id": "neutral",
       "label": "Unsure"
      },
      {
       "id": "negative",
       "label": "Worried"
      },
      {
       "id": "idk",
       "label": "I don't know"
      }
     ],
     "truth_from_support": {
      "support": "d1-priya",
      "recommended": "positive",
      "acceptable": "neutral",
      "weak": "negative"
     },
     "why": "Honesty went down well (confident); sounding too sure left her exposed (unsure); silence or false reassurance backfired (worried)."
    },
    {
     "id": "d1-r-daniel",
     "person": "daniel",
     "prompt": "How do you think Daniel experienced today?",
     "truth_from_support": {
      "support": "d1-daniel",
      "recommended": "positive",
      "acceptable": "neutral",
      "weak": "negative",
      "by_option": {
       "c": "positive"
      }
     },
     "why": "Daniel's day followed how his concern was handled. Stopping all planting was a weak choice for the project, yet Daniel himself felt taken seriously (positive); being told the birds would get used to it upset him (negative)."
    }
   ]
  }
 ]
};
