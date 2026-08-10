# Current State

<!-- wf memory: required sections below; keep the headings. -->

## Done

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
