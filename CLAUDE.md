# Galactic Prime Time — Claude Code Context

## Project Overview
A full-stack TTRPG character sheet app for a tabletop game called **Galactic Prime Time** (GPT).
Reality TV-themed dungeon crawler. Abducted humans compete in alien-broadcast dungeon runs.

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
{ id, templateId, level, capacity, cooldownRemaining, traitCosts }
```
Display fields (name, effect, stats, etc.) are joined from `SkillTemplate` at runtime via `enrichSkills()` in `skillUtils.js`. Use `normalizeSkills()` before saving to DB to strip template fields.

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

## Autosave
`update()` in CharacterSheet triggers a 1500ms debounced save to `/api/character`.
Do not add additional direct `apiFetch` saves on top of this — use `update()` only to avoid race conditions.

## Skill Library
Admin manages skill templates via SkillLibrarySection. Templates stored in `skilltemplates` collection.
Skills are granted to players by templateId. The player sheet joins template data at runtime.

## Known Backlog (in priority order)
1. Item uses/charges field (schema + UI)
2. Player chat input — CommsTab is currently read-only. Players need to send messages. Check messages route and admin CommsSection for schema.
3. Tag picker from master tag list instead of freetext
4. Player-editable subtask checkboxes on objectives
5. RPM field on ranged weapons

## Workflow
- After completing any task, always commit the changes with a descriptive commit message summarizing what was done.
- Client: `cd client && npm run dev`
- Server: `cd server && node server.js` (or nodemon)
- Both run concurrently in dev. Vite proxies `/api` to `localhost:3001`.
