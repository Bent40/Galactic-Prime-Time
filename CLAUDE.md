# Galactic Prime Time — Claude Code Context

## Project Overview
A full-stack TTRPG character sheet app for a tabletop game called **Galactic Prime Time** (GPT).
Reality TV-themed dungeon crawler. Abducted humans compete in alien-broadcast dungeon runs.

## Two editions — v1 (this rulebook) and v2 (`v2/`)

- **v1 — the live campaign.** Abducted humans, the alien **Corporation™**. `rulebook/` and
  the app are v1. **v1 is FROZEN**: where the editions conflict, v2 bends. The operative
  test is *"any sentence that needs the word 'god' does not belong in the book."* Errata are
  still allowed (e.g. the 2026-08-10 Charm clarification, §2.1).
- **v2 — the mythology edition (`v2/`).** The show is a table in the **Cosmic Casino**: gods
  wager on contestants, and the winner decides how the next 250 years are remembered.
  **Fully designed, almost entirely unbuilt — the v2 rulebook does not exist yet.**
  **Start at [`v2/README.md`](v2/README.md).**

**Placement rule: content lives where it is consumed.** Tabletop material (rulebook, floor
arcs, cast sheets) lives here. The Godot sim's data (mythology corpus, seed data,
architecture) stays in `Galactic-Prime-Time-Game`. Shared setting canon is canonical in the
game repo and snapshotted into `v2/canon/` by `v2/sync-canon.sh` — **if they disagree, the
game repo is right.** Do not hand-edit `v2/canon/`.

## Stack
- **Client:** React + Vite (`/client`)
- **Server:** Express + MongoDB/Mongoose (`/server`)
- **Auth:** JWT stored in localStorage. Separate admin token.
- **DB:** MongoDB. One document per player in `characters` collection. Character data stored as `state: Mixed` blob on the Character model.

## Project Structure
```
/client/src
  /components
    /admin        — GM control panel components
    /character    — Player sheet tab components
    /shared       — Shared UI (LoginOverlay, Toast, TrackerBar)
  /pages
    AdminPanel.jsx
    CharacterSheet.jsx
  constants.js    — DEFAULT_STATE, trait lists, item tiers, uid(), dmgClass()
  api.js          — apiFetch helper

/server
  /models         — Mongoose models (Character, SkillTemplate, ItemTemplate, etc.)
  /routes         — Express routes (admin, character, items, skills, tracker, etc.)
  /utils
    skillUtils.js — enrichSkills(), normalizeSkills(), normalizeTraits()
  server.js
```

## Key Data Model Decisions

### Traits (consolidated format)
Each trait has sub-fields, not three separate flat objects:
```js
traits: {
  physique: { base: 1, bonus: 0, levelBonus: 0 },
  reflexes: { base: 1, bonus: 0, levelBonus: 0 },
  mind:     { base: 1, bonus: 0, levelBonus: 0 },
  charm:    { base: 1, bonus: 0, levelBonus: 0 },
}
```
`traitTotal(t) = base + bonus + levelBonus`

### Skills (reference model)
Skills on the character are references, not snapshots. Instance stores only:
```js
{ id, templateId, level, capacity, traitCosts }
```
Display fields (name, effect, stats, etc.) are joined from `SkillTemplate` at runtime via `enrichSkills()` in `skillUtils.js`. Use `normalizeSkills()` before saving to DB to strip template fields.
`traitCosts` is a list of per-level spend RECORDS (arrays of trait names, one per level-up);
legacy data may contain flat strings — level-down refunds handle both. `cooldownRemaining`
was removed 2026-07-23 (no cooldowns in the system — priming).

### Level Points
Single unified pool — any trait can be leveled from it regardless of Body/Core pillar:
```js
levelPoints: { pool: 0 }
```
Admin grants via `POST /api/admin/players/:userId/levelup` which increments `pool`.
Player spends via `investLevel(t)` in BodyTab which decrements `pool` and increments `traits[t].levelBonus`.
**Level is read-only on the player sheet** — only admin can change it.

### Skill Points
Skill points per trait = `traitTotal(t) - 1`, minimum 0. First point in any trait earns nothing.
Available = `Math.max(0, traitTotal(t) - 1 - skillPointsSpent[t])`.
Multi-stat skills cost 1 point from **each** listed stat (not just one).
`traitCosts` array on skill instance tracks what was spent for refund on level-down.

### Stat Cap Bonuses (auto-calculated, over 10)
```js
statCapBonuses: { bleed: 0, crush: 0, burn: 0, chill: 0, poison: 0, infection: 0, dissolution: 0, cameraCall: 0 }
```
- Physique over 10: every 5pts → +1 max HP per body part
- Reflexes over 10: every 12pts → +1 Physical Resistance (player allocates across bleed/crush/burn)
- Mind over 10: every 15pts → +1 Psychic Resistance (dissolution)
- Charm over 10: every 20pts → +1 Camera Call stack

### Bonus Points
Starting allocation pool, split by pillar:
```js
bonusPoints: { body: 5, core: 5 }
```
Only editable at level 1. Locked at level 2+.

### Shock
```js
shock: { tier: 0 }  // 0 = none, 1-4 = Shout/Stutter/Faint/Helpless
```

## Base HP Values (system rules)
- Head: 2 (lethal)
- Torso: 5 (lethal)
- Arms: 2 each
- Legs: 3 each

## Routes
- `GET/POST /api/character` — load/save character state
- `GET /api/character/skills` — returns enriched skills (template fields joined)
- `POST /api/admin/players/:userId/levelup` — grant 1 level point to pool
- `PATCH /api/admin/players/:userId/traits` — set trait values
- `POST /api/admin/players/:userId/skills/grant` — grant skill by templateId

## Data layer direction (owner position, 2026-08-04)
Mongo/Atlas is the accepted current stack (deploy: `render.yaml` +
`docs/deploy-render-atlas.md`). **Owner conviction on record:** SQL's schema
enforcement will likely be needed as the campaign leans harder on item/skill
data — a **v2 relational migration is parked, not rejected**. First step when
picked up: a full schema design doc (tables/FKs/constraints + the client
autosave-contract change), timed to a campaign break. Don't re-litigate Mongo
vs SQL in future sessions; the position is settled as "Atlas now, designed v2
maybe later."

## Autosave
`update()` in CharacterSheet triggers a 1500ms debounced save to `/api/character`.
Do not add additional direct `apiFetch` saves on top of this — use `update()` only to avoid race conditions.

## Skill Library
Admin manages skill templates via SkillLibrarySection. Templates stored in `skilltemplates` collection.
Skills are granted to players by templateId. The player sheet joins template data at runtime.

## Item Library & Drafting (added 2026-08-04)
- Item instances on characters are **snapshots** (no templateId backlink), granted via
  `POST /api/items/give`; `/api/items` routes are 100% admin-gated.
- `ItemTemplate` carries pool metadata: `subtype`, `boxTiers[]`, `themes[]`, `source`
  (template-side bookkeeping; the give-snapshot copies only `subtype`). Vocabulary in
  `constants.js`: `BOX_TIERS` (Bronze→Godly, ≠ item tiers) + `ITEM_SUBTYPES`.
- **Seeding runbook (from `server/`):** `node backup-db.js` → `node seed-items.js` (dry
  run) → `--apply`; `--force` to overwrite differing existing templates, `--file` for
  other batches. Batch data lives in `server/seeds/` (a: Lounge-unlock, b: standing
  catalog, c: top shelf, materials-f1: F1 material band, d-repairs: legacy metadata
  stamps, needs `--force`). `node repair-affixes.js` applies the ruled affix edits.
  The rulebook is at **v1.1** (Item Drafting update: §12.6 armor, §12.7 materials,
  §21.2 horde doctrine; file name stays gpt-system-v1.0.md for the Wiki import).
- The Item Drafting content pass (rules + pools + batches) is governed by
  `rulebook/item-drafting-passover.md` + `rulebook/item-drafting-batch-a.md`; the live
  **affix catalog is source of truth** over book §12.3's working list.
- **Affix catalog seeding:** `node seed-affixes.js` (dry run) → `--apply` from
  `server/`; data in `server/seeds/affixes-higher.js` (15 Higher affixes, blessed
  2026-08-10). Ruled: affix damage numerics multiply by the item's material band;
  condition/utility affixes don't scale (book §12.7 "Modifiers ride the band").
- **Materials system** (`rulebook/item-drafting-materials.md`, blessed): tier =
  craftsmanship, material = power scale; one band per floor, ×2 each floor
  (F1 ×2 → F9 ×512); parts = material capacity; striking part sets the band.
  10-floor frame: 3 sets of 3 + F10 FFA. Mobs are one-shot hordes (§21.2).
- **Lootbox system** (SHIPPED 2026-08-10): sealed contents live server-side in the
  `LootBox` collection (`server/models/LootBox.js`, `server/routes/boxes.js`) because
  the state blob is player-readable. Player side: `character/LootBoxes.jsx` in
  InventoryTab — crack-the-seals reveal, per-item details, pick-one via `/claim`;
  client merges items via `update()` (server never writes state). Opened boxes are
  never deleted — they ARE the permanent Box Log (who/what/chosenIndex/source).
- **Box Builder** (`admin/BoxBuilder.jsx`, top of the Items section — absorbed the
  old BoxNamer): compose contents + recipients + mode + earned-by, tier
  auto-inference, name suggestions, and the Box Log panel (chosen ✓ / unchosen
  struck through).

## F1 Enemy Pass (PROPOSAL, added 2026-08-18)
- **`rulebook/f1-enemy-pass.md`** is the Floor 1 roster proposal — 19 entries
  (6+2 shared forest · 3 Easy · 4 Medium · 4 Hard), keyed to the Compendium's
  route beats (§4.2–4.4) and the Incineradile boss pattern (§3.1). **Nothing in
  it is ruled yet**; E-0 lists the four interpretation calls that need blessing,
  E-4 is the backlog.
- **The load-bearing reading (E-0.1/E-0.2):** §21.2's mob 5 / elite 60 / boss 125
  / super 300 is a **part BUDGET summed across `bodyParts`**, not a pooled bar —
  because §7.3 resolves damage per part. **Mobs are ONE part at 5.** A mob that
  survives a hit gets a **gate** (surface immunity, damage-type immunity,
  untargetable-while-X), never a fatter number.
- **Seeding runbook (from `server/`):** `node backup-db.js` →
  `node seed-enemies.js` (dry run) → `--apply`; `--force` overwrites differing
  existing docs, `--file` for other batches, `--floor N` rescales the doctrine
  gate. Data in `server/seeds/enemies-f1.js`.
- **The seeder refuses to run on data that misses the doctrine** — wrong budget,
  a multi-part mob, a non-mob with no weak system, an unknown tier. `--check`
  runs that gate alone and **needs no `node_modules` and no DB**.
- `node test-seed-enemies.js` — 16 dependency-free checks over the doctrine gate
  and the array-aware diff. The DB create/diff path is **not** covered (no mongod
  in the dev container); it is a near-verbatim clone of the proven `seed-affixes.js`.
- **Enemies carry a `size`** (`Small|Medium|Large|Huge`, §7.1) — added 2026-08-18 to
  `models/Enemy.js`, `routes/enemies.js` (both POST and PUT whitelist it), and
  `admin/EnemiesSection.jsx`. It is not decoration: §13 makes **Large** grappleable
  by a Medium contestant and **Huge** not, which is the whole trap in the Loong Kin
  encounter (Warden Form Large ↔ Loong Form Huge).
- Carve hooks: every elite and boss names an F1-band material from
  `item-drafting-materials.md` M-1, and all of them resolve against
  `seeds/items-materials-f1.js`. Mobs don't carve individually (E-0.4) — a cleared
  room is one gather roll.

## The crystal plague (RULED 2026-08-18)
- **The Hard route's crystal IS Nullrot's disease** — the same plague the Easy route's
  chained man spreads-and-cures at F3 (§4.3) and the Loong contains at F3 (§4.4).
  **Three routes, one plague**; the Hard route's F1 now seeds its own F3 payoff.
- **Crystal Spore Mist** (`enemies-f1.js`) is the vector: a twinkling mist that
  **tempts** — no roll, it just looks like a find, and every crystallized citizen
  walked toward it. **Contact** → Infected on that part. **Inhalation** → Infected
  **plus Suffocation** (§8.2, torso-only 2-Clock timer). Deadly immediately.
- Crystallized Citizens are **hosts**, not scenery. Crush-only isn't a puzzle any more:
  the only thing that works is the thing that shatters a person who is still in there.
- **Counterplay already existed** — Forest Resin (contact), Antiseptic Wash (tiers),
  **Burn T2 clears infection outright** (§8.2). Only a respirator is new. See E-6.
- **OPEN:** whether Infected T3 = statue (out of play until the F3 cure) or just death.
  Player-removed-from-play severity — owner call, see E-0.6.

## Dissolution errata (2026-08-18 — v1 §8.2 + §10)
- The flat **2-Clock timer is gone**. Now: **one Clock of grace**, then a **Hold
  Threshold** equal to `1 + Moments elapsed`, checked against **Mind** on §14's
  mechanism (Mind ≥ threshold → auto-hold; else Mind + the Mind threshold die).
  The check is **free** — no Moment, no free-action slot. **One failure is
  permanent removal**; there is no second roll and no grace Moment.
- §14 obliges the GM to announce when a threshold is unreachable, so **the table is
  told exactly how many Moments remain**. That disclosure is the bargain the
  harshness rests on.
- Removing the cause **freezes** the threshold (never resets). Psychic resistance
  now buys **+1 Clock of grace per tier** instead of slowing a timer.
- **Escalation rate rides the SOURCE** — haunted object +1/Moment, noble-class or
  divine +2/+3. That is the knob that keeps Dissolution lethal against a Mind
  farmed into the 20s; the victim's stat is not where difficulty is expressed.
- Owner-approved; the campaign has not met the mechanic yet. **Not yet propagated**
  to the game repo's `rules-addendum.md` or the Godot sim (4 files) — see backlog.

## Rulebook & Wiki (added 2026-07-23)
- **`rulebook/gpt-system-v1.0.md` is the canonical TTRPG rules master** (owner decision
  D-8, 2026-07-23). Edit the markdown to change the rules; the docx/PDF are historical.
- The player-facing **Wiki** (`/wiki` route, `client/src/pages/Wiki.jsx`) renders it via a
  `?raw` import + `marked` — one committed copy, no drift. The 📖 Wiki button in the sheet
  topbar opens it. `vite.config.js` has `server.fs.allow: ['..']` so dev mode can read it.
- The full reconciliation plan (rules updates + app fixes, decisions D-1..D-8) lives in the
  game repo: `Galactic-Prime-Time-Game/docs/ttrpg-update-plan.md`.

## Known Backlog (updated 2026-07-23 — §B-1 bug pass DONE)
1. ~~Bug fixes §B-1~~ **DONE 2026-07-23**: shared rules helpers in `constants.js`
   (`traitTotal`/`capBonus`/`effectiveMaxHp` — import these, never re-derive); Combat Mode
   uses effective max HP; refunds follow `traitCosts` spend records; affliction
   resistances admin-settable (`PATCH /players/:userId/resistances` + PlayerPanel);
   InventoryTab imports shared constants; new parts get `baseHp`; `cooldownRemaining`
   removed; condition tiers to T4.
2. ~~Rules alignment §B-2~~ **DONE — migration EXECUTED on the campaign DB 2026-07-25**
   (Fedora Hat Psy→Dissolution ×2, Sea Lion→Animal, AI→Robot / AI; 100 tag descriptions
   seeded; skill passover applied same day: 27 template repairs, 44 keyword sets, 5 new
   skills. Backup: `server/backups/backup-2026-07-25T12-03-11`. The campaign DB lives
   with the `ClaudeCodeTest` checkout — the `New\…` folder's DB is a sparse dev copy.)
   Original code notes: `DMG_TYPES` = the 7 resistance keys (Bleed/Crush/Burn/Chill/
   Poison/Infection/Dissolution — damage types and resistances now match 1:1); `RACES` =
   Human/Animal/Robot / AI + `identity.species` freetext (legacy race values still render
   until migrated); canonical condition-name datalist (freetext still allowed); `magazine`
   on items (model+routes+both UIs); skill Lv0 shows "Untrained"; Shock clear button
   relabeled "Reset (combat end)".
   **Runbook (from `server/`, no mongodump needed):** `node backup-db.js` (EJSON dump of
   every collection to `server/backups/backup-<ts>/`; restore via
   `node restore-db.js backups/backup-<ts> --apply`) → `node migrate-rules-vocab.js`
   (dry run, prints every change) → `--apply` (Psy→Dissolution, Toxic→Poison,
   Shock→Burn; Sea Lion→Animal+species, AI→Robot / AI+species) →
   `node seedTagDescriptions.js` → `--apply` (fills empty tag descriptions from
   the rulebook Tag Compendium). Prime display still rides the owner's skill passover.
3. ~~Polish §B-4~~ **DONE 2026-07-23**: CommsTab whisper selector (📢 broadcast /
   🤫 players / 🎭 NPCs via `/api/players`); admin tag input backed by the tag-catalog
   datalist (freetext preserved, effect auto-copied on match); player tag picker and
   owned-tag chips show the seeded rulebook descriptions (search includes them).
   Deliberately NOT done: auto-decrement item uses (manual fits table play);
   Moment-tracker 10→1 countdown display (cosmetic).

## Workflow
- After completing any task, always commit the changes with a descriptive commit message summarizing what was done. Don't add your signature to it.
- Client: `cd client && npm run dev`
- Server: `cd server && node server.js` (or nodemon)
- Both run concurrently in dev. Vite proxies `/api` to `localhost:3001`.
