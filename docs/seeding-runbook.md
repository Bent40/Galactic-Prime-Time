# Seeding runbook — everything not yet in Atlas

**Written 2026-09-19.** One page, in order. Every command runs **from `server/`**.

---

## 0 · The one thing that will silently go wrong

🔴 **SEED AGAINST ATLAS, NOT LOCALHOST.** Every `server/` script falls back to
`mongodb://localhost:27017/galactic-prime-time` when `MONGODB_URI` is unset — so a run
without it **seeds a local dev database and reports success.** Export it once and check it:

```bash
cd server
export MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?appName=…"
echo "${MONGODB_URI:0:24}…"          # must print mongodb+srv://, not empty
```

The string lives **only in the Render dashboard** (`sync: false` in `render.yaml`).
⚠️ It carries **no database name**, so everything lives in the driver's default DB —
that is correct and the app agrees. **Do not "fix" it**; you would point at an empty DB.

If Atlas is unreachable, check in this order: ① an **M0 free cluster pauses after 60 days
idle** — resume it; ② **Network Access must allow `0.0.0.0/0`** (Render free has no static
egress IP); ③ the password may have been rotated. `GET /api/health` names which.

---

## 1 · Back up first, always

```bash
node backup-db.js
```

EJSON dump of every collection to `server/backups/backup-<timestamp>/`.
**Restore:** `node restore-db.js backups/backup-<ts> --apply`.

---

## 2 · The five batches, in dependency order

Every script is **dry run by default** — it prints exactly what it would do and writes
nothing. Read the dry run, then re-run with `--apply`.

### 2.1 · Marks — 3 tags (§18.4)

```bash
node seed-marks.js --check          # §18.4 gate only. No DB, no node_modules.
node seed-marks.js                  # dry run
node seed-marks.js --apply
```

`Regicide` · `Dragon Slayer` · `Witness`. They seed into the **tag catalog** with
`kind: 'mark'`, so they must land **before** anything that grants one.

### 2.2 · Skill classification — 49 templates, plus 2 content repairs

```bash
node apply-skill-classification.js --check    # validates + prints the four pools. No DB.
node apply-skill-classification.js            # dry run
node apply-skill-classification.js --apply
```

Sets `origin` / `animalOnly` / `exclusiveTo` on templates that **already exist** — it
never creates one, and it **names every template the file does not cover**, because the
default (basic + general) is the permissive one.

⚠️ **It also corrects two `requirements` strings** — Frost Wall and Fire Wall gain their
missing `Frost Ball Lv 3.` / `Fire Ball Lv 3.` prereq. The dry run prints both; that is
the only prose this script touches.

🔴 **Do this before anyone new is created** — until it runs, the creation picker offers
**Iron Stance** (a Gemstone merge product) and **Mario's two exclusives** as free starting
skills.

### 2.3 · Items — the Set 1 spine, 26 templates

```bash
node seed-items.js --file ./seeds/items-set1-spine.js              # dry run
node seed-items.js --file ./seeds/items-set1-spine.js --apply
```

9 concepts × 3 floors (less C-9's F1). Damage is **final Force** (ruled 2026-09-19), so
nothing needs re-basing on the way in.

### 2.4 · Items — the five parasites

```bash
node seed-items.js --file ./seeds/items-parasites.js               # dry run
node seed-items.js --file ./seeds/items-parasites.js --apply
```

Dread-Eye · Falsewort · The Beggar · Ringworm · Gravemoss. All **PUBLIC READS ONLY** —
no `specialEffects` field, deliberately: the card shows only what anyone could see.

### 2.5 · Enemies — the tutorial roster, 4 entries

```bash
node seed-enemies.js --file ./seeds/enemies-tutorial.js --floor 0 --check   # doctrine gate. No DB.
node seed-enemies.js --file ./seeds/enemies-tutorial.js --floor 0           # dry run
node seed-enemies.js --file ./seeds/enemies-tutorial.js --floor 0 --apply
```

⚠️ **`--floor 0` is required.** Without it the gate sizes against Floor 1 and the whole
roster fails: floor 0's centres are **mob 2 · elite 24 · boss 50 · super 120**.

Roach-dog · Big / Mid / Little Brother Roach.

---

## 3 · Verify

```bash
node seed-marks.js                  # should report 3 in sync, 0 to create
node apply-skill-classification.js  # should report 0 to update, 0 uncovered
node seed-items.js --file ./seeds/items-set1-spine.js
node seed-items.js --file ./seeds/items-parasites.js
node seed-enemies.js --file ./seeds/enemies-tutorial.js --floor 0
```

A second dry run of anything already applied must report **nothing to do.** If it wants to
create something again, the name did not match — check for a rename.

Then in the app: the **Tag Library** shows 3 marks · the **Skill Library** shows 🐾 / ⚗ / ★
badges · **Items** holds the 26 spine pieces and 5 parasites · **Enemies** holds the 4
tutorial entries.

---

## 4 · If it goes wrong

```bash
node restore-db.js backups/backup-<ts> --apply
```

Every seeder matches **by name, case-insensitive**, and **never overwrites an existing
document without `--force`** — owner edits win by default. So the common failure is
"it created a duplicate under a slightly different name", not "it destroyed my data".

---

## Not in this runbook, on purpose

- **Batches a/b/c, safety, materials-f1, affixes, enemies F1–F3** — already in Atlas.
- **`--force`** — only when you *intend* to overwrite an owner edit. Read the dry run's
  `! EXISTS … differs on …` lines first; each one is a field someone may have changed by hand.
