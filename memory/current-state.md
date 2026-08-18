# Current State

<!-- wf memory: required sections below; keep the headings. -->

## Done

- **F1 ENEMY PASS — drafted 2026-08-18, and SIX owner rulings landed the same day.**
  Ruled: Foreman Bex's name · the Girl is **killable** (Beelzebub takes the throne
  through the F2 rival; the unbent demons rampage leaderless; Bex's F3 farm survives
  only under Beelzebub's eye) · the **Dissolution errata** (grace-and-hold on Mind,
  one failure is permanent, escalation rides the source) · **enemy `size`** is now a
  real field, and it makes the Loong's two forms a trap (Warden Form Large =
  grappleable; Loong Form Huge = not) · the **crystal is Nullrot's plague**, one
  disease across three routes, with a tempting mist whose inhalation route is
  Infected + Suffocation. Still open: E-0.1–E-0.4, and whether Infected T3 = statue.

- **(original draft note)**
  `rulebook/f1-enemy-pass.md` + `server/seeds/enemies-f1.js` +
  `server/seed-enemies.js` (+ `server/test-seed-enemies.js`, 16 checks, the
  app's first automated tests).
  - **18 entries**: a shared forest layer (6 mobs, 2 elites) every party meets,
    plus one stack per route — Easy (Stair-Wight · Chainbearer · **THE MASKED**),
    Medium (Torchbearer · The Kindler · **Foreman Bex** · the Girl, unfightable),
    Hard (Crystallized Citizen · Step-Warden · **Loong Kin**, super).
  - **The four rulings it needs (E-0):** the rank number is a **part budget**
    summed across `bodyParts`, not a pooled bar · **mobs are ONE part at 5** ·
    every non-mob names a weak system and every surviving mob names a gate ·
    mobs don't carve individually, a cleared room is one gather roll.
  - **Boss doctrine honoured, not decorated:** THE MASKED's win condition is the
    **chain**, and killing him costs the route its F2 and F3; Foreman Bex's is the
    **house**, and he cannot die on this floor; the Loong Kin's is the
    **conversation**, and it sheds a scale rather than being carved.
  - **The exploration payoff:** The Rack (optional, shared layer) carves
    **Mistletoe**, whose Oathbreaker effect is the answer to THE MASKED's Mask.
    A shortcut, never the only key.
  - Every carve resolves against `seeds/items-materials-f1.js`. Budgets verified
    18/18 against §21.2.

- **v2 — THE MYTHOLOGY EDITION now exists as a designed edition (2026-08-11).**
  Lives in **`v2/`** (moved here from the game repo — content lives where it is
  consumed; `v2/README.md` is the entry point). v1 is FROZEN and unchanged
  except one errata (Charm widened to *presence*, section 2.1).
  - **The divinity economy is fully specified.** `v2/design/divinity-accounting.md`:
    **standing** = your named living followers (the principal); **divinity** =
    the prayer income they pay, 1/follower/cycle × weight (the yield).
    Spending never touches the people. Buy-outs are SPENT, standing decays.
  - **section 17 The Audience is WRITTEN** — `v2/rules/17-the-audience.md`, the first
    authored chapter of the v2 book. Viewers are a spoken tier; acts convert,
    attention only amplifies; Camera Call is a declared bet on uncertain
    outcomes; Goals convert Followers; markers are a god's agenda executed by
    proxy, in three dispositions the player cannot read.
  - **The campaign spine is complete, Floor 0 → 10.** F0 puppet tutorial ·
    **F1–3 The Buried God** (design complete) · **F4–6 The Crowned** (core ruled)
    · **F7–9 The Hunt** (core ruled) · F10 free-for-all on Earth's remains.
  - **All 72 Ars Goetia authored** into the game repo's mythology corpus
    (224 → 295 entities), snapshotted here at `v2/canon/goetia-cast.md`.
  - **~140 owner rulings on record** with reasoning preserved, across
    `v2/design/v2-decisions.md` and the three floor documents.
- **External review received and acted on (2026-08-11).** Its documentation
  findings are fixed: the section 17 gap, the 20-floor residue, the drift guard's own
  drift, the F1–3 status contradiction, the stale README, one broken link.
  Its open design catch (what does spending divinity do to the people?) is
  answered by `v2/design/divinity-accounting.md`.

- **Item Drafting pass COMPLETE and LIVE (2026-08-04 → 2026-08-10):** rules
  (book v1.1: armor, materials/bands/parts, kits, tomes, ammo-carries-the-
  band, horde doctrine, affix band-scaling), content (~155 item templates
  seeded: batches A/B/C + F1 materials + D repairs; 15 Higher affixes
  blessed), tools (Box Builder w/ integrated namer, seed runbooks).
- **App deployed:** Render free + Atlas M0 (`render.yaml`,
  `docs/deploy-render-atlas.md`); campaign DB migrated; owner smoke-tested.
  Client uses same-origin API base in production (api.js).
- **Lootbox system SHIPPED + smoke-tested:** LootBox collection (sealed
  contents server-side — the state blob is player-readable), /api/boxes,
  crack-the-seals reveal w/ per-item details, pick-one mode, permanent Box
  Log (who/what/chosen/why), race-safe open (client merges via update()).
- Campaign frame ruled: 10 floors — 3 sets of 3 + F10 FFA. Ladder x2 per
  floor (F1 x2 ... F9 x512); mob ≈ one on-band hit.

## In progress

- **F1 enemy pass is drafted and unblessed.** Nothing seeded to any DB — the
  seeder has never been run against Mongo (no mongod in the dev container; the
  environment's network policy blocks the binary download). The doctrine gate and
  the diff logic ARE verified; the create/diff DB path is not.

## Next

- **Owner: read `rulebook/f1-enemy-pass.md` §E-0 and rule on the four calls**,
  plus the two named items in E-4 (Foreman Bex's name becomes F3 canon; whether
  the Girl is fightable at F1 changes F2 and F3). Then run the E-5 seeding
  runbook. Then the queue in next-actions order.

## Blockers

- Owner-side applies pending (not blocking dev): seed-affixes on campaign
  DB; story-canon 10-floor edit in the game repo.
