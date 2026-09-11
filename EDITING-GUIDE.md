# How to change the Sustainable Futures Lab simulation (no coding needed)

This guide is for changing words, numbers and rules. You never need to touch the files in `js/` or `css/`.

## 1. What is in this folder

| File or folder | What it is | Do you edit it? |
|---|---|---|
| `data/sfl1/content.js` | **Everything the candidate reads, and every number and rule.** | **Yes, this is the one** |
| `config.js` | The username, the password code, and which content folder to use | Sometimes |
| `tools/make-passcode.html` | Makes the code for a new password | Just open it |
| `data/test-every-shape/content.js` | A test scenario that uses every option. Not for customers | No |
| `index.html`, `js/`, `css/` | The simulation itself | No |

## 2. Before you change anything

1. **Keep a copy** of `data/sfl1/content.js` (for example `content-backup.js`), so you can always go back.
2. Open `content.js` in a plain text editor (Notepad or VS Code), not Word.
3. Lines starting with `//` are notes. The simulation ignores them. Notes marked **UNCONFIRMED (SQ…)** are the values most likely to change after candidate interviews. The SQ number is the question in `SFL-Master-Doc.md` section 6.3.

## 3. The three rules for editing safely

- **Text sits inside double quote marks:** `name: "Maya Okafor",`
  If the text itself needs a double quote mark, put a backslash in front of it: `\"`. The Support questions already do this.
- **Items in a list end with a comma.** A missing comma is the most common mistake.
- **Numbers and true/false have no quote marks:** `explore_points: 3,` and `show_support_outcomes: true,`

**If you make a mistake, nothing breaks silently.** The simulation will not start, and it shows a list of what to fix, with the line number when the page is opened from GitHub Pages. Undo your change, or fix what the list says.

## 4. Common changes, with examples

### Change some wording
Find the text and change what is inside the quotes. All button and screen words are in the `labels:` section near the top.

`continue: "Continue",` → `continue: "Next",`

### Change the time limit
`time_limit_minutes: 30,` → `time_limit_minutes: 35,`

### Change the number of explore questions for a day
Each day has its own line. Day 3 currently has 2:

`explore_points: 2,` → `explore_points: 3,`

### Switch a rule on or off
Everything in the `rules:` section is a switch. For example, if candidates say the "why" pop-up also appears for people you leave where they are:

`ask_reason_for_unmoved: false,` → `ask_reason_for_unmoved: true,`

| Rule | What it does | Open question |
|---|---|---|
| `support_order` | `"fixed"` = team members glow one at a time, in order. `"any"` = all glow at once | SQ23 |
| `confirm_before_support` | Ask "Read X's message?" before showing it | reported |
| `show_support_outcomes` | Show what happened after each Support answer | SQ13 |
| `ask_reason_for_unmoved` | Ask a reason for people left in place too | SQ6 |
| `notes_in_reflect` | Show the notes panel on Reflect screens | SQ22 |
| `notes_include_onboarding` | Keep the Onboarding answers in a "Project" notes tab | SQ20 |
| `can_skip_explore_points` | Let candidates continue with explore points unused | — |

### Remove a whole phase from a day
Each day lists its phases. To drop Reflect from Day 2:

`phases: ["explore", "assign", "support", "reflect"],` → `phases: ["explore", "assign", "support"],`

Keep the order explore, assign, support, reflect.

### Change the number of days
The days are the big blocks under `days: [`, each starting with `/* === DAY 1 === */`.
- **Fewer days:** delete a whole block, from its opening `{` to its closing `},`.
- **More days:** copy a whole block, paste it after the last one, and change its `id` (for example `"day4"`) and `name` (`"Day 4"`). The progress bar at the top updates by itself.

### Change the number of people or stations on a day
Each day has its own `people:` and `stations:` lists. Two to five of each are allowed, and there can't be more people than stations. If you add a person, also give them:
- a station in that day's `start_assignment`, and
- if the day has Support and Reflect, their own Support message and Reflect question.

The error list will tell you if anything is missing.

### Change how many points something is worth
Everything is in `scoring:`. Examples:
- A reasonable-but-not-best Support answer is worth full marks: `acceptable: 1`. For half marks: `acceptable: 0.5`.
- How much each phase counts towards the percentile: `phase_weights` in `benchmark:`.

**Do not change** the `percentiles` table or the `zones`. They are the same on every CaseMentor simulation.

### Turn this into the free demo
`results_mode: "full",` → `results_mode: "demo",` and in `config.js`, `requireLogin: false,`

## 5. How a Support message and a Reflect question work

**Support.** Each message belongs to one `person`. Each option has:
- `text`: what the candidate reads
- `tier`: exactly one `"recommended"`, the rest `"acceptable"` or `"weak"`
- `outcome`: what happened next
- `why`: the explanation shown in the results

**Reflect.** The correct answer can follow what happened in Support:

```
truth_from_support: { support: "d1-tom", recommended: "positive", acceptable: "neutral", weak: "negative" },
```

This reads: "look at how the candidate answered Tom's message `d1-tom`; if they picked the recommended option, the right answer here is positive…". Other ways to set the answer:
- `truth: "negative"` sets a fixed answer.
- `unknowable: true` makes "I don't know" correct.
- `by_option: { c: "positive" }` overrides one specific option.

**Version A and version B.** Any Support message or Reflect question can have a `when_mismatched: { … }` part. It replaces the normal wording (or the correct answer) when that person is **not** on one of their `good_stations`. Maya on Day 1 is an example.

`{station}` and `{name}` in any text are filled in automatically.

## 6. Checking your change

1. Double-click `index.html`. It opens in your browser, with no internet needed.
2. If you see the error list, fix what it says.
3. Play through the part you changed.
4. Optional: open `index.html?content=test-every-shape` to confirm the simulation still copes with unusual shapes.

## 7. Changing the password

1. Open `tools/make-passcode.html` and type the new password.
2. Copy the long code it shows.
3. In `config.js`, paste it between the quotes of `passcodeHash: "…",`
4. The username is `username: "…",` in the same file.

This is a courtesy gate, not real security. Anyone determined can read a browser page's files.

## 8. Putting it online (same as Sea Wolf and Redrock)

1. Upload the **whole folder** to the GitHub repository. Drag the folders, not the files inside them: the web uploader silently flattens folders.
2. After uploading, open the live page and check that your change is there.
3. Embed it in the lesson with:

```
<iframe src="https://<user>.github.io/<repo>/index.html" allowfullscreen allow="fullscreen" style="width:100%;aspect-ratio:16/9;border:0;display:block"></iframe>
```

Without `allowfullscreen`, the fullscreen button hides itself.
