# Current State

<!-- wf memory: required sections below; keep the headings. -->

## Done

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

- Nothing mid-flight. Session closed clean 2026-08-10.

## Next

- **F1 enemy pass** — next session's opening task (full briefing in
  next-actions.md #1). Then the queue in next-actions order.

## Blockers

- Owner-side applies pending (not blocking dev): seed-affixes on campaign
  DB; story-canon 10-floor edit in the game repo.
