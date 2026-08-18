# Decisions

<!-- 2026-08-11 — the v2 session. Full record with reasoning: v2/design/v2-decisions.md -->

## 2026-08-11 — v2 mythology edition

- **v1 is FROZEN; v2 bends.** Resolved a contradiction live since July
  (`setting-rebrand-options.md:155` said the live table re-skins; the never-approved
  update plan said the opposite). v1 changes only by errata.
- **v2 is a tabletop edition** (D-06), so its material lives in `v2/` beside the
  rulebook, not in the Godot project. Rule: **content lives where it is consumed.**
- **Divinity is not a headcount.** Standing (people) vs divinity (prayer income).
- **Command is not reverence** — a legion bound by force is not a congregation.
- **The winner takes everything**: one winner, everything resets, only they
  remember, they author the next 250 years and dispose of those who lost —
  bounded only by leaving room for humanity to survive.
- **Demons are a race revering the 72 goetic demon gods**, now all authored.
- **Floor 0 is the tutorial, outside the ten-floor count.**

<!-- wf memory: required sections below; keep the headings. -->

## Decisions

- 2026-08-04 (owner): affix catalog (27, Lesser+Normal) is source of truth; book
  §12.3 line stale. All items have tiers. Armor = resistance, nullification at
  higher tiers. Weapon Cost = Moments. Exceptional = polish/growth path, not a
  drop. Limited-magic = single-spell items. Multiple Mythic artifacts exist.
  Boxes are generic or specific (boss/quest/floor). Full text: passover §ID-0.
- 2026-08-04 sitting round 1 (owner): armor covers its part, resists stack;
  nullification bands as proposed; Polish Kits tiered (Crude 1-3/4-6, Normal
  1-2/3-6, Superior 1/2-5/6=double, capped at Exceptional); pools LARGE;
  Creation Kits introduced (base item + modifier(s) of choice by tier); app
  metadata fields approved; affix catalog is truth AND extendable.
- 2026-08-04 naming economy (owner, multiple rounds): Basic = plain functional
  names; Quality = solid-but-generic (`Quality <Base>` when a base spans
  tiers — "Reinforced" rejected, collides with affix space); Superior+ =
  flair/nonsense allowed; theme by FLOOR, not Show; tomes named
  `Skill Tome: <book title>`, grounded titles; never reuse affix names in
  item names. Full text: passover ID-2 naming notes.
- 2026-08-04→06 (owner): item LEVELS rejected ("just add a bunch of
  bookkeeping") — superseded by the MATERIALS system: tier = craftsmanship,
  material = power scale. One band per floor, ×2 each floor (F1 ×2 … F9
  ×512); parts = material capacity (no per-part effects; striking part sets
  the band); guns/tech: the part that touches the target carries the band
  (ammo sets it, barrel caps it); reforge allowed, consumables excluded.
  Blessed catalog: `rulebook/item-drafting-materials.md`.
- 2026-08-06 campaign frame (owner): 10 floors — 3 sets of 3 with stories +
  F10 FFA (adds no band). Horde doctrine: mobs are hordes, one on-band hit
  kills (~5 HP F1 → ~1.3k F9), survival only via GATE effects; elite ≈×12,
  boss ≈×25, super ≈×60 of mob HP. Book §21.2.
- 2026-08-06 (owner): batches A (41), B (57), C (21 incl. route arcs +
  GM-only growth tracks) blessed; D = metadata-only repairs. Book pass →
  **v1.1** (filename stays gpt-system-v1.0.md — Wiki imports by path).
- 2026-08-08 deploy (owner): Render free tier + MongoDB Atlas M0 chosen over
  Oracle Cloud (sysadmin/security burden) and free-Postgres offers. Cookbook:
  `docs/deploy-render-atlas.md`. Client uses same-origin API base in prod.
- 2026-08-08 data layer (owner, recorded in CLAUDE.md — don't re-litigate):
  Atlas now; v2 relational migration PARKED not rejected; first step when
  picked up = full schema design doc, timed to a campaign break.
- 2026-08-10 lootbox system (owner-approved design, SHIPPED): sealed box
  contents live SERVER-SIDE in the `LootBox` collection (the character
  state blob is player-readable); open returns snapshots and the CLIENT
  merges via update() (race-safe — server never writes state); opened boxes
  are never deleted = the permanent Box Log (who/what/chosenIndex/source =
  "why"); pick-one mode finalizes via /claim. BoxNamer absorbed into
  `admin/BoxBuilder.jsx`.
- 2026-08-10 (owner): Higher affix tier (15) blessed as authored; **band
  scaling RULED**: affix damage numerics multiply by the item's material
  band exactly like base damage; condition/utility affixes don't scale.
  Book §12.7 "Modifiers ride the band". Legendary affixes deliberately wait
  for the first polished Exceptional.
- 2026-08-10 (owner): next up = the F1 ENEMY PASS, run in a fresh session
  (briefing: next-actions.md #1).
