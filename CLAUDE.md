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
- **E-0 is RULED (2026-08-18)** — the part-budget reading, **mobs = ONE part /
  elite+ = MULTI-part**, the gate/weak-system requirement, and mob carve policy.
  The seeder enforces all four and exits 1 on a violation.
- **ONLY MOBS ARE EXACT (ruled).** A mob is always 5 band units — one meaningful hit,
  every floor. **Elites and above should DIFFER from one another**; §21.2's ratios are
  a centre with a **±tolerance band**, not a law. The gate catches gross errors without
  flattening the roster. F1 elites run **45 · 48 · 52 · 68 · 78**, bosses **110 · 125 ·
  140**, each number answering to its design (a regenerator needs less raw HP than
  masonry does).
- **An item CAN outpace its floor (ruled)** — an Exceptional/apex/authored weapon may
  read above its class baseline in band units. The band sets the era; the item earns
  its rank inside it.
- **`rulebook/f1-enemy-pass.md`** is the Floor 1 roster — 19 entries
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

## F2 Enemy Pass (PROPOSAL, added 2026-08-18)
- **`rulebook/f2-enemy-pass.md`** + `server/seeds/enemies-f2.js` — 16 entries, the
  great desert seventy years on. **HP budgets identical to F1** (band units are
  floor-invariant); only damage moves — mob 5 · elite 8 · boss 10.
- **F2 is the DEMON floor** — one blocks the Easy exit, the Medium route *is* demon
  politics, the Hard route is a demon hunt. The shared desert layer is deliberately
  thin so the routes carry the weight.
- **The plague is loose on every route** via the Ash-Lung Pilgrim: a party that
  skipped Hard at F1 meets the crystal here with no idea what it is. Seeds F3.
- **The Doorward (Easy boss) is the F2 twist:** it is not guarding the exit, it is
  guarding the floor above — seventy years eating the plague out of the chained man.
  **Killing it is the correct move and the wrong one**; it is how Nullrot reaches the
  capital, and why he arrives as both disease and cure. THE MASKED's shape, one floor on.
- **The Rival Noble (Medium boss) branches on F1's Girl ruling** — genuine rebel if she
  was spared, Beelzebub's unwitting viceroy if she was killed. Same statline, different
  scene. Carries the Dissolution songs (Compendium §3.5) at **+2/Moment**; the F1 brand
  is full immunity; **answering the song beats destroying the Choir** and pays more.
- **The Hard route flips the Loong to an ALLY** with its same 300 block — the win is
  the village, not a corpse, and the Horn (12) ends the hunt even if the Owner lives.
- Carves are M-2 Desert (Sky-Iron · Flint · Sunglass · Scorpion Chitin). **Turquoise ⭐
  has no source yet** — open item.

## Set 1 story canon — the Cinnabrus arc (RULED 2026-08-18)
- **`rulebook/set1-story-canon.md`** is the story source of truth for F1–F3. The enemy
  passes reference it; do not re-derive the plot from the Compendium alone.
- 🔒 **THE v1/v2 FIREWALL (S-0) — do not conflate the editions.** **Cinnabrus** (the buried
  plague god), **Beelzebub** (took his domain, title and tongue), **Nullrot** (his champion),
  **Vermilia** (his last living follower, the F1 girl → the F3 queen) and **the Loong**
  (descendant of the dragon he killed) all cross into v1. **The Cosmic Casino, tables, the
  house, patrons bidding, bankruptcy-as-debt and divinity-as-economy DO NOT.** In v1 the
  Corporation™ runs the show and no god runs anything — **Cinnabrus is background a
  thorough party uncovers**, never the reason the cameras are on. His ruin needs no economy:
  his own plague killed everyone who worshipped him.
- ✅ **THE CURE IS A MIXTURE (ruled).** Nullrot's flesh only *stalls* what it leaks; Loong
  blood only holds the plague at bay and soothes demonic hunger *temporarily*. **Neither is
  a cure. Together they are** — strong enough to resist rather than delay. That is what
  Cinnabrus was reaching for when Beelzebub stopped him, and it makes the optimal path a
  **necessity, not a courtesy: the cure does not exist until the two are in the same room.**
- ⚠️ **Loong blood alone is a trap** — it sustains, so a captured Loong is not a murder, it
  is **livestock**, bled indefinitely. That is what the hunt actually intends.
- 🔴 **VERMILIA IS KILLABLE AND SHE IS THE LAST FOLLOWER.** Cinnabrus's ledger reads **1**.
  A god at zero cannot be prayed back. **Killing the F1 girl permanently deletes him and
  the best ending, on the first floor, before anyone knows.** And **Bex helped** — he was
  burning out a rival claimant and did not know she was the last, which is exactly why he
  is farming humans 170 years later. *The easy road was closed and he closed it.*
- ✅ **THE MASK IS NULLROT'S OWN RELIQUARY (ruled 2026-08-20).** **Cinnabrus blessed it**
  for his champion — *worn back if killed* — and **Beelzebub SEALED it** (not destroyed:
  a champion is a return ticket). So the F1 "possession" is **a sealed door being forced
  from the inside**, which is why it dismantles the host, why it leaks, and why it takes
  seventy years. It also explains the Mask's Oathbreaker gate (a blessing under a seal is
  exactly what Mistletoe ignores) and makes the mural a sane person's note. The chains hold
  it mid-conversion; the F2 Doorward's feeding stalls it; killing the Doorward lets the seal
  give and Nullrot walks out.
- ✅ **THE HOST CO-PILOTS (ruled 2026-08-20).** The staircase man is still in there — *"not
  for or against, just different after 170 years of this mess."* At F3 he **can be talked
  to** and answers honestly, which is worse than a monster. Unmasking kills him within a
  Clock, unhurried and neither grateful nor accusing.
- ✅ **BEX ACTS FOR DEMONKIND, NOT HIMSELF (ruled 2026-08-20).** He wants the hunger lifted
  off every demon and Beelzebub's leash cut; his personal cure is only the version he can
  *reach*. He does what he thinks is necessary, his means are ugly, and he does not defend
  them. **Test: offer a cure that scales and he drops the sacrifice instantly.**
- ✅ **THE TONGUE IS REQUIRED FOR THE REVIVAL (ruled 2026-08-20).** Beelzebub buried it
  **apart, in its own prison** — the queen's two-century dig found the god and never the
  mouth. Finding it **unlocks interaction** with Cinnabrus; settling it after that is
  🔒 **edition-split**: **v1 = a catalyst or a physical release from the prison**;
  **v2 = paying his debt with collected divinity, which does NOT exist in v1.**
  🟡 Proposed (unblessed): the catalyst is *the mixture itself*, and the Loong's blood-claim
  is what a prince's seal has no reply to — which would collapse S-6's three steps into one.
- **Rival contestant parties + a 0–3 trade track** per route (S-7): +1 per floor cleared,
  ±1 from interference. One party runs one route deeply and **trades** for the rest.

## F3 Enemy Pass (PROPOSAL, added 2026-08-18) — **Set 1 is complete**
- **`rulebook/f3-enemy-pass.md`** + `server/seeds/enemies-f3.js` — 16 entries, the grand
  capital, 170 years after F1. Damage mob 6 · elite 9 · boss 12 · super 19.
- ✅ **RULED — the F3 design rule: every mob is a CONSEQUENCE of a previous floor**, not
  a thing that happens to be there. The capital is where the party finds the climax of
  the story they have been in since F1, and **they may perform it however they like —
  this is NOT a stealth floor** and not a floor "about" any tactic.
- Roster is people and consequences: **infected citizens · rogue demons · hoodlums ·
  crystal clusters · quarantine enforcers**, plus **royal guards** on Medium. The
  **quarantine is a PLACE, not an obstacle** — half the floor is behind the line,
  getting in is easy, getting out is the ask.
- **Rogue Demons and Royal Guards branch on the F1 Girl ruling** — killed → the unbent
  demons are everywhere and the crown is human and frightened; spared → far fewer, still
  under orders, and the crown is HERS. Same statlines, different rooms.
- ✅ **BEX WAS ALWAYS THE RIVAL DEMON (owner, 2026-08-18)** — hiding among humans and
  manipulating them across three floors. F1 he burns a house to kill a rival by proxy
  (which is *why* he cannot be killed there — a clue, not GM protection); F2 he is the
  Rival Noble and **the assassination may succeed and not take**, because a demon is not
  killed by killing its body; F3 he runs the farm, and the farm exists to find the ONE
  human whose sacrifice ends his nature. **He wants to be human**, has never lied, and
  the Petition does not permit him to. Three seed entries: `Foreman Bex` (110) →
  `Bex, the Rival Noble` (145) → `Bex, the Petitioner` (155).
- ⚠️ **TWO CURES, NOT ONE (owner correction 2026-08-18).** I had written that the plague
  cure and the demon cure were the same thing. **They are different, and each is held by
  whoever does not need it:** **Nullrot** holds the *plague* cure; **Loong blood** cures
  *demonic tendencies*. The Loong wants Nullrot's; every demon wants the Loong's; neither
  knows the other exists.
- **The path of least casualties (owner):** get the Loong **out of the city** · make the
  Loong and Nullrot **meet in the capital** · help the queen **revive her god**. Nullrot
  takes over containment so the Loong need not stand still; Loong blood then cures demons
  freely so Bex needs no sacrifice and the hunts end; a revived god gives the rogue demons
  a patron again. 🔴 It requires knowledge from all three routes, and §4.1 gives a party
  one route per campaign — whether the capital is where routes converge is an OPEN call.
- **Nullrot is the floor's super (300)** — Reservoir 40 holds the plague, Halo of Cures
  34 sheds the cure. **The party caused this** by killing the F2 Doorward. The win is the
  ARGUMENT, and he is right. Destroying the Reservoir alone is surgical and ends him.
- Returning tides: F1 mobs ~50, F2 mobs ~25.
- **`server/build-bestiary.js`** renders F1–F3 into a shareable GM page from the seed
  data, so it cannot drift. Rebuild: `node server/build-bestiary.js`.

## Enemy scaling — F2+ damage and horde counts (PROPOSAL, added 2026-08-18)
- **`rulebook/enemy-scaling.md`** + **`server/floor-bands.js`** — the cross-floor
  authoring frame. **The doc's tables are the script's output; regenerate with
  `node server/floor-bands.js`, never hand-edit them.**
- **Enemy HP does not change across floors** — §21.2's mob 5 / elite ~60 / boss ~125 /
  super ~300 are band units, true everywhere. **Only enemy DAMAGE moves**, because it
  tracks the contestant's growing body: torso runs **7 → 35**, so the signature hit
  runs mob **4 → 19**, elite **6 → 30**, boss **8 → 39**, super **12 → 60**.
- Ratios ⚖: mob ≈ 0.55 × torso (two hits destroy it) · elite ≈ 0.85 · boss ≈ 1.1
  (its signature blow ends a torso — that is why it is a boss) · super ≈ 1.7.
  **Constant by construction, so combat feels the same on every floor.**
- **Two legitimate band exceptions:** a telegraphed 1-Clock windup hits ABOVE it (the
  Step-Warden's 10 vs an elite band of 6 — the party is paid in a punish window), and
  a per-Moment tick sits BELOW it (Husk-Moth 2 vs mob 4). Anything else is a bug; the
  test suite checks the whole F1 roster against the band.
- **Hordes (L-15):** a floor-S mob met at floor N arrives **~12 × 2^(N−S)** strong —
  an F1 mob is a tide of 200 at F5 and 3,000 at F9, sized as one Clock of slaughter
  for four contestants. **A horde is ONE entity with a count**, not N entities: an
  attack removes `floor(damage ÷ mob HP)`, area attacks multiply by spaces covered,
  and **gates still apply** (a Crystallized Citizen tide is still Crush-only).
- ⚠️ Enemy damage lives in free-text `notes`, so the seeder cannot gate it the way it
  gates HP. A `damage` field on the Enemy model would fix that — app work, not content.

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
- **Infected T3 KILLS NORMALLY (ruled)** — the statue idea is dropped, because a
  contestant crystallised until F3 is out of play either way. **So the crystal needs
  no rules exception at all:** Infected + Suffocation, and T3's own 2-Clock death
  timer is the mercy window. The drama lives at T1–T2 where Resin / Antiseptic Wash /
  Burn T2 can still reach it.
- **Nullrot is BOTH patient zero and the antibody (ruled)** — which is why §4.3 has him
  simultaneously spreading and curing. Open follow-on: the Hard route's city is already
  crystallised at F1, so the tidy reading is that **the mask carries the plague and he
  is only its newest host** — making Easy and Hard the same story at two stages.

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

## The level budget (PROPOSAL, added 2026-08-18) — **numbers go exponential**
- **`rulebook/level-budget.md`** — upstream of every enemy statline. Owner direction:
  *"50 Physique at level 5 and go 'well this is pretty solid I guess.' At F9 they
  should be practical gods."* The linear 36-level draft is **superseded**; L-8 onward
  is live.
- 🔴 **The blocker (L-8): traits do NOT multiply damage in v1.** §12.1 damage is flat
  per weapon class (2–4) × the material band; Physique is a **requirement gate** that
  caps out at 5 for the heaviest class. Physique 5 and Physique 500 swing the same
  greatsword for the same number. **No level budget can produce a nuclear punch — a
  rule has to change.** Precedent to build on: §12.1's stat-valued ranges
  ("Range: Reflexes") already let a trait BE a number.
- ✅ **RULED: skills scale with their governing trait (L-17)** — so Mind/Charm builds
  have a real damage axis. ✅ **RULED: part HP scales off TOTAL trait points (L-18)**,
  not Physique alone — the caster chasm is closed.
- ✅ **THE CURVE IS LINEAR, ~150 levels (L-19).** The exponential L-9/L-10 draft is
  **superseded**. **The anchors are per FLOOR, not per level** — "50 on a trait at
  floor 5" — so **§3.1 is unchanged: 1 level = 1 point.** The only knob is levels per
  floor: **10/10/10 · 16/16/16 · 24/24/24 = 150 across F1–F9.** Lands F5 main stat
  **48**, F8/F9 level **132/156**, F9 main stat **110**, balanced ~40 each. Part HP =
  +1 per part per 5 total points past creation → **7 HP torso at F1**, 35 at F9.
- ⚠️ **F1 enemy damage is ×2 of the book baseline**, not ×5. The first pass misread
  the anchor as *level* 5 and sized against a 13 HP torso; the real F1 torso is 7.
  Corrected same day.
- ✅ **L-20 DISSOLVED by L-22 — it was a UNITS error, not a balance flaw.** The
  materials catalog already states the answer: *"the sheet plays identically on every
  floor; only the numbers inflate,"* and an F9 mob at 1.3k *"still dies in one on-band
  swing."* **Everything native to a floor is written in BAND UNITS**; the band
  multiplies every native number equally, so it **cancels inside a floor and never
  appears on a character sheet.** Its real job is cross-floor — it is what makes last
  floor's sword a letter-opener and last floor's elite a mob.
- **Consequence: the BODY is the only variable.** Weapon class stays 2–4 forever;
  §21.2's mob 5 / elite 60 / boss 125 / super 300 become the numbers for **every**
  floor in band units; part HP = `5 + (total points − 14)/5` runs **7 → 35**. Hits to
  destroy a torso rise **2.3 → 11.7** across the campaign, and every point of that
  comes from the contestant's own trait total. In absolute terms an F9 contestant has
  a 17,920 HP torso and swings for 1,536 — practical gods, with no six-digit
  arithmetic at the table.
- **Nothing blessed is invalidated.** §21.2 is reinterpreted, not rewritten; the F1
  roster is untouched (F1 *is* band units); the hordes ruling becomes mechanical
  rather than flavour (an F1 mob met at F5 is 1/16th of an F5 unit). §12.7 needs a
  clarifying errata stating the band is floor-relative — **written 2026-08-18** into
  §12.7 of the rulebook.
- ✅ **RULED: Architecture A, refined (L-11/L-14).** Weapons ride the **material
  band**; the §21.2 ladder and the whole F1 roster stand. **Stats are the KEY, not the
  gun** — trait growth buys the *right to hold* the weapon, part HP, skill points and
  fiction, never extra damage. **§12.1's requirement ceiling of 5 lifts:** items may
  demand any amount of any trait (the gravity axe needs Physique to hold; the
  corrupting staff needs Mind to resist). Apex M-5 materials are the nuclear bases.
- ✅ **RULED: old enemies become hordes (L-15).** Nothing is rescaled — a Bramblewretch
  is 5 HP forever, and at F5 the party meets two hundred. The power fantasy as
  *content*, not as a stat block, and already what §21.2 describes. **Every floor's
  roster is a permanent asset**; later floors need horde COUNTS, not new blocks.
- ✅ **DONE: F1 enemy damage re-based ×5** (2026-08-18) against the new part HP
  (focused build enters F1 with a 13 HP torso). HP budgets unchanged; condition tiers
  unchanged (§12.7). Enemy damage doubles per floor like enemy HP.
- 🔴 **OPEN L-17:** do **skills** scale with the governing trait, or not at all?
  Decides whether a caster has any damage axis.
- 🔴 **OPEN L-18 — the serious one:** §3.2 sources part HP from **Physique only**.
  Exponentially, a Mind build at F9 has a 13 HP torso against thousands of damage —
  unplayable from F2 onward. Recommended fix: **part HP scales off TOTAL trait
  points**, Physique keeping a bonus. **Must be ruled before Set 2 is designed.**
- Still standing from the linear draft: **mobs and individual elites pay ZERO levels**;
  **bosses pay for being RESOLVED, not killed**; **all routes pay identical levels**.

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
