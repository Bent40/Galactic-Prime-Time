# Company Mode — virtual tabletop pass (2026-11-22)

Persona testers (Workflow `bmad-party-mode`, Company room) drove the `/table` and
`/gm/:tableId` pages in a real browser (`wf browse`) against a local build and a
real MongoDB 7 (Docker, `mirror.gcr.io/library/mongo:7`). `seed.mjs` seeds the
table: GM `gamemaster`, players `sasha` / `filipe` (password `testpass1`, local
only), map "Hatchery", a hidden Little Brother Roach.

⚠️ Seed artifact: the seed left the grid at its 30×20 default, larger than the
900×600 test image, so part of the board is bare grid. That inflates Larry's
"board is cropped" finding; it does not remove it.

## Fixed (each replayed: FAILED before, PASSES after — `cass/*.out.txt` vs `*.after.txt`)

| # | Bug | Severity | Fix |
|---|---|---|---|
| bug-2 | A player could aim a skill at a HIDDEN token's id; its name was posted to public chat | security | `use-skill`: a player may only target a token they can see (404 otherwise) |
| bug-1 | A player could move their token off the map (col 999999999) or with `"abc"` (became 0) | broken | move clamps to the map's grid; a non-number is 400 |
| bug-3 | `/api/messages` answered 500 for an object/array `text` or a bad recipient id | broken | 400 with a reason |
| bug-7 | GM token name/label cut emoji in half; `currentHp` could exceed `maxHp` | cosmetic | slice by code point; clamp HP |
| bug-5 | Double-clicking SEND posted the message twice | broken | send is locked while in flight |
| bug-6 | Sending chat offline showed nothing | broken | "Not sent: no connection. Your message is still in the box." |

`server/test-tables.js` gained the hidden-target and clamp cases (125 pass).

## Checked and held (Cass)
Moving another player's token → 403 · player on GM routes → 403 · GM-only rolls
never reach players · `/live` strips hidden tokens · unseated user → 403 everywhere.

## Not fixed — UI changes, need a mockup and the owner's approval

Ranked recommendation. ⚠️ The designer round (Mies, Ada) was voiced by the orchestrator, not run as independent agents; every item cites tester evidence.

1. **A token list in the GM sidebar, hidden tokens included, each with a reveal
   toggle.** The GM could not see or click the hidden Little Brother at 1280,
   1920 or 2560 wide (`larry/g1*.png`, `larry/g2-reveal.out.txt`). Also the
   keyboard path to every token.
2. **Open the board fitted to the screen**, with a "fit" button.
3. **Click-to-move**: select your token, click a hex. Drag is the only way to
   move today (`larry/p2-move.yaml`), which shuts out keyboard and some touch users.
4. **Phone width (375px)**: the player page overflows; Moments 6–10 and body chips
   are cut off (`cass/flow-phone.yaml`, no failing flow — the tool cannot assert overflow).

Dissent: Larry also wants Enter to submit login and the fog brush to turn fog on
by itself (`larry/g5-fog.yaml`, 3 actions). Against it: auto-enabling fog
hides the map from players without the GM noticing.

## Tool gaps (Workflow, not app bugs)
No canvas click/drag at coordinates (token drag, fog brush, ruler, ping, fx, HP
buttons untestable through the UI) · `assert_a11y` fails closed when unpkg.com is
blocked · no overflow, focus or JS-eval assertions.
