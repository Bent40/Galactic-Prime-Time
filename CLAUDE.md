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
- 🔴 **SEED AGAINST ATLAS, NOT LOCALHOST.** Every `server/` script falls back to
  `mongodb://localhost:27017/galactic-prime-time` when `MONGODB_URI` is unset, so a runbook
  run without it silently seeds a local dev DB and reports success. **Prefix every command
  with the Atlas string** (`MONGODB_URI="mongodb+srv://…" node …`) or export it for the
  shell — see `docs/deploy-render-atlas.md` "Future seeds/migrations against prod".
- **Seeding runbook (from `server/`):** `node backup-db.js` → `node seed-items.js` (dry
  run) → `--apply`; `--force` to overwrite differing existing templates, `--file` for
  other batches. Batch data lives in `server/seeds/` (a: Lounge-unlock, b: standing
  catalog, c: top shelf, materials-f1: F1 material band, **safety: the crystal-plague
  counterplay — Cloth Filter Mask · Sealed Respirator · Reservoir Seal · Resin Coat, all
  answering INHALATION only**, d-repairs: legacy metadata stamps, needs `--force`).
  **F1 materials carry trait requirements** (L-14, 2026-08-25) that ride into whatever they
  are crafted into; **Mistletoe asks Charm 8**, the first item to break §12.1's old ceiling. `node repair-affixes.js` applies the ruled affix edits.
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
- **Seeding runbook (from `server/`, `MONGODB_URI` set to Atlas — see the red note in
  Item Library above):** `node backup-db.js` →
  `node seed-enemies.js` (dry run) → `--apply`; `--force` overwrites differing
  existing docs, `--file` for other batches, `--floor N` rescales the doctrine
  gate. Data in `server/seeds/enemies-f1.js`.
- **The seeder refuses to run on data that misses the doctrine** — wrong budget,
  a multi-part mob, a non-mob with no weak system, an unknown tier. `--check`
  runs that gate alone and **needs no `node_modules` and no DB**.
- `node test-seed-enemies.js` — **74** dependency-free checks over the doctrine gate,
  the signature-damage gate and the array-aware diff. The DB create/diff path is **not**
  covered (no mongod in the dev container); it is a near-verbatim clone of the proven
  `seed-affixes.js`.
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

### The clan layer (RULED 2026-08-24/25 — ruling record: `rulebook/set1-review-and-changelog.md`)
- 🔒 **THE CLAN LAW.** Demons are a race born to enforce rules of nature; **each clan
  embodies a thing, and grows as that thing grows.** (1) **A demon dies only when its CLAN
  dies** — so Vermilia is killable in the body (her clan is a population of one; *her body
  IS her clan*) while Bex's F2 body-death does not take. Same rule, both ways. (2) **Rebirth
  runs through one clan parent**, but 🔒 **birth odds ride clan strength** — a clan of one has
  almost no odds. Natural selection, not a prohibition. (3) **Nullrot is outside the cycle
  while sealed**; destroying the mask returns him to it. (4) **Nullrot and Vermilia are
  DIVINE WRATH clan** — they embody karma.
- 🔒 **WHY THE WRATH CLAN IS SCARCE — and it stays inside the firewall.** The Corporation
  **contaminates** consequence, it does not rule it: a production company that rigs
  circumstances, prevents boring deaths and stages rescues is one that keeps *interrupting
  endings*, so a clan scaled to how much karma actually LANDS starves. ⚙️ Consequence: **the
  broadcast is sterilising the last wrath demon's clan without knowing it** — the weld
  between the frame story and the deep story, with no cosmology required.
- 🔒 **THE FALL OF THE CLAN — both waves were the weapon WORKING.** A clan child took
  Beelzebub's enticement (small act; his full knowledge is **retrospective** — S-1's
  "scavenger, not a nemesis" is ruled); the plague took him because **wrath does not exempt
  its own**; the clan read it as their god killing a child for nothing; and **a god who
  judges loyalty reads lost faith as betrayal**, so the plague took the doubters too.
  Nothing malfunctioned. **The instrument punished the reaction to itself.** Surface truth
  ("his weapon ate his congregation") is what the mural-writers believed and **what
  Cinnabrus himself believes**.
- 🔒 **VERMILIA IS THE WITNESS**, not the purest believer. She saw the child take the
  enticement and helped him hide it — **first silence courage** (braced for her god's
  wrath), **second silence earned fear** (speaking would expose her as accomplice). She
  never made a new decision; she kept doing the brave thing past the point where it stopped
  being brave. **Her silence killed the clan.** Her survival is a sentence she cannot
  recognise, and **when the verdict would not come she spent two centuries excavating the
  judge.** Her question is *"was I a coward?"* — about **intention**, asked of a judge who
  structurally cannot pronounce. ⚖️ **He cannot judge his last follower without judging
  himself** (keep the rest off the limelight). 🔴 Loophole = probably the finale: **cure
  first → followers grow → judgment stops being suicide.**
- ⚠️ **KEEP VERMILIA SMALL (ruled 2026-08-25).** Not a species-preservation quest — she feels
  **doomed** and dug up a god to **get one answer before she goes.** The clan's revival is a
  **consequence the PLAYERS can cause** (revive him *and* keep her alive), never her plan.
  The grand version is available and it is worse.
- ✅ **THE TONGUE'S PRISON (ruled 2026-08-25): deep under the capital, in the RIBS OF THE
  DRAGON Cinnabrus killed.** Closes S-e — it is on F3, reachable in one campaign. And it
  settles S-f·2 in all but name: Beelzebub's seal answers gods and demons and has **no reply
  to the descendant of the corpse it was built inside**, so the Loong is not a key the party
  carries down, it is the only creature with **standing**.
- ✅ **FLOOR 3 IS THE CONVERGENCE (ruled 2026-08-25) — everything happens at once.** Not a
  fourth route: Nullrot in the street, the Loong hiding, Bex in the alleys, the crown
  digging, same city, same days. **The path of least casualties is achievable in one
  campaign.** Dissolves the "facts only flow through the Easy column" problem down to
  Floors 1–2; the S-7 trade track still governs those.
- 🔒 **THE PRISON HAS TWO LOCKS (ruled 2026-08-25) — the Loong is REQUIRED in both editions.**
  Cinnabrus killed the dragon *with the plague*, so the corpse is saturated: **the corpse
  answers to its descendant, the crystal answers to the antibody.** So the prison is **the
  cure, verified** — the same pair who must share a room to make the mixture are the pair who
  open the door. **Bring both → no fight.** Loong only → fight the crystal with no antibody;
  Nullrot only → fight the dragon with its descendant absent; neither → both, super-tier.
  ⚠️ **The corpse is a BOMB, not a boss** (largest plague reservoir in the world, under two
  million people) — which is why Vermilia has dug around it for two centuries. This is also
  where the diplomatic finale gets its combat: **the fight you get for arriving with half the
  answer**, same reward shape as Mistletoe (F1) and answering the song (F2). Collapses S-f·1
  into the same act — the pair opens the door, the mixture they create is the catalyst.
- 🔒 **RIVAL PARTIES — TWO TIERS (ruled 2026-08-25).** 🔴 **Reserved** (the F1 Girl, the F2
  Doorward, the Loong's capture): rivals may threaten, delay, complicate and charge a price,
  **never resolve offscreen.** 🟢 Everything else is fair game, **announced first via the
  rumor network** — don't act and it's yours. ⭐ **The reserved tier enforces itself in
  fiction: the Corporation protects the branch points FOR RATINGS** (a rival about to settle
  the Girl gets cut away from, delayed, counter-programmed) — the network earning its keep by
  **protecting the drama rather than opposing the party.** Author rival defaults as **prep,
  never promise**: a rival who always chooses right is the one group exempt from Set 1's law.
- 🏆 **The capital attaches to the LOUNGE after F3** — the city they saved, ruined or
  inherited becomes theirs (v2: its survivors are congregation too). Every F3 choice is a
  choice about where they are going to live.
- ⚙️ **Destroying the mask while she lives is the closest thing to a rescue there is** —
  slim odds, but slim is the only thing on offer. (Corrects an earlier over-hedge.)
- 🎨 **NULLROT'S MASK — visual design RULED 2026-08-25.** A **beaked plague-doctor mask** (pale
  ceramic, glass-lensed) with **wooden horns growing from the temples**, and **crystal flowers
  blooming along the horns** once the conversion completes. ⭐ The silhouette is accidentally
  honest — a plague doctor *treats* plague, and he is patient zero **and** the antibody. 🔒 The
  flowers are the plague's existing vocabulary: the F3 Reservoir's parts are already **First /
  Second / Third / Fourth Bloom · The Seed · The Throat**, phase **Blooming**. Three-stage read:
  **F1 budding · F2 hard closed buds that cannot open** (the Doorward is drinking the leak — this
  is what *stalled* looks like, and **killing it makes the buds open**) **· F3 full bloom.**
  ⚠️ The beak is deliberately foreign to the capital's jade register — it is older than the city.
- 👥 **THE DOUBLE (PROPOSAL, 2026-08-25) — how the ruse survives 170 years.** A shapeshifting
  demon performs the public successions, appearing each generation as a plausible **daughter,
  not a duplicate**. 🔴 **This plugs a hole the ruse ruling left open** — a queen who visibly does
  not age cannot stay secret in a populated city, and canon said *nobody knows* without saying
  *how*. ⚠️ Keep the capability **small — a repertoire, not a power** (same reason the Doorward
  says "deception," never "illusion"). 🎯 **It lands on Marks:** `Witness` activates near Vermilia
  because she recognises it, so a party carrying that brand feels **nothing** in front of the
  double — the causality ledger becomes a lie detector without being designed as one.
  ⭐ Thematically it is her sin as statecraft: **the witness who would not speak has employed
  someone to speak for her for two centuries.** 🔒 **No Double in the killed branch** — the throne
  is human but **the city knows demons rule from behind it**, because they are visibly doing
  whatever they want. Nothing is hidden, so nothing needs doubling; **concealment is Vermilia's
  method alone.** 🔴 Three open calls remain in `set1-story-canon.md`.
- 🔒 **F1 HARD — THE ENCOUNTER SHAPE, CORRECTED 2026-08-25.** ⚠️ The giant stairs are **the
  ENTRANCE only** and carry no part of the quest; the earlier *"carry a crystallized citizen up
  the stairs"* reading is **withdrawn**. The Loong **nests in the CITY HALL** and looms over the
  city; the party **runs the streets conversing with it while trying not to die**. 🔒 The argument
  is **"staying here will lead to nothing"** — **futility, not a body count**, a claim about the
  future rather than a census, which is why the truth-sense passes it.
- 🔒 **F2 HARD — THE DESTINATION, RULED 2026-08-25.** The village is the **SURVIVORS of the F1
  city** — a few adults and children who ran in time, now a small settlement two or three
  generations deep that **does not know what it is descended from.** ⭐ It does not contradict F1:
  the party said *staying leads to nothing* and **they were right** — what it should have been
  guarding had already walked out. 🎭 **The village remembers it as a guardian deity "in the form
  of a long snake or a tall woman"** — both forms, which is the hint — and ⭐ under S-0's
  clarification *(a god is just a worshipped entity)* **the Loong has been a god for seventy years
  without knowing.** ⚠️ The villagers must never work it out. 🧭 **A travelling trader carries the
  MASK news** — the village gives it something to protect, the trader gives it somewhere to go.
- 🔒 **THE DYNASTY IS A RUSE.** No new queens, ever — **Vermilia is the entire line.** The
  **high court are other-clan demons she recruited**, who do not know what the secret is;
  they want a working city and to be paid. That is why the capital hunts the Loong while its
  crown digs for a god and neither operation notices the other.
- 🔒 **THE DOORWARD IS A TRIGGER, NOT A TRAP.** Killing it is the **right move** — Nullrot
  chained forever is stasis and no cure ever exists. It **warns them aloud and truthfully**
  ("my hunger is sated here, feasting on this man"). Say **"deception," never "illusion"**
  (an illusion mints a capability that owes players a resistance mechanic). **The truest
  voice in the room is the lure**: the chained man is genuinely real, suffering and honest.
  Only RECOGNITION was ever missing, and F3 supplies it.
- ⚙️ **Nullrot cannot be permanently killed while the last believer lives** — mask intact
  means someone wears him back. Destroying the mask while she lives is a **lottery ticket**;
  after she dies it is an **execution**. Beelzebub sealed rather than broke it for exactly
  this reason, and in the Vermilia-dead branch ends up passively preserving the champion he
  removed. *Nobody chose that; it fell out of the rules.*
- 🔒 **BEX'S FARM IS THE WHOLE CAPITAL.** No enclosure — he runs the back alleys, drugging
  and harvesting people for blood and negative feeling. To citizens it is just crime in the
  slums and the quarantine zone. **Register: tragedy disguised politely** — southern-sounding,
  courteous, immovable; **apology without confession**. ⚠️ Never pair the word "farm" with
  the accent in player-facing text.

## F3 Enemy Pass (PROPOSAL, added 2026-08-18) — **Set 1 is complete**
- **`rulebook/f3-enemy-pass.md`** + `server/seeds/enemies-f3.js` — **18 entries**, the grand
  capital, 170 years after F1. Damage mob 6 · elite 9 · boss 12 · super 19.
- **Layer E — the two locks of the prison (statted + numbers blessed 2026-08-25).** They only
  exist if the party arrives incomplete. **The Dragon in the Foundations (380 · Huge)** — win
  on the four **Seal-Anchors**, not the body (it re-knits); **FRACTURE** is the real resource
  (forced anchor = +1; **at 4 the reservoir cracks into a city of two million**; Nullrot's
  Halo eats 1/Clock); the **Ribcage is a part they must NOT destroy**; carve = the anchors in
  Cursed Gold ⭐, the only object Beelzebub ever leaves reachable. **The Reservoir (260 ·
  Huge)** — a *volume*, not a creature; **cannot be killed, only opened** (Blooms regrow every
  Clock; **The Seed** sits under **The Throat**); the **enclosure is the weapon** (inhalation =
  Infected **+ Suffocation**, announced *before* initiative). 🔒 **The asymmetry is ruled
  deliberate — Loong-only is the HARDER branch.** Do not even it out.
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
- ✅ **DONE 2026-08-25 — `Enemy.signature` gates damage the way the doctrine gate gates HP.**
  Structured `{ floor, damage, type, exception, note }` on the model, whitelisted in both
  `routes/enemies.js` verbs, edited in `admin/EnemiesSection.jsx` (band shown live, ⚠ badge
  when off-band), and checked by `seed-enemies.js`. **Optional by design:** no signature (or
  floor 0) is skipped, so un-migrated rosters keep passing. `exception` is `''` | `windup`
  (≤2× band) | `tick` (≥0.2× band) — the two legitimate off-band shapes, both with live
  examples. **F1 is migrated (14 of 19).** Two entries the gate flagged need an owner call —
  `f1-enemy-pass.md` **E-7**: THE MASKED punches 6 against a boss band of 8, and Vermilia
  has no attack number at all.

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
- Owner-approved; the campaign has not met the mechanic yet. ✅ **PROPAGATED 2026-08-25**
  to the game repo: `docs/rules-addendum.md` **R36** (and the three older places that
  described the flat timer are amended), and **the Godot sim now implements it** —
  `condition_engine.on_moment()` is the engine's first per-Moment condition hook,
  `apply_condition` takes an `escalation` of 1/2/3, and §14's disclosure is an emitted
  event (`dissolution_hold` with `unreachable`), not a UI concern. **583 sim tests pass,
  0 fail**, on a Godot 4.7.1 fetched into the container. Still unbuilt there, correctly:
  automatic cause-tracking — `freeze_dissolution()` is the API and nothing calls it yet.

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

## Set 1 item concepts (PROPOSAL, added 2026-08-25)
- **`rulebook/set1-item-concepts.md`** — the **first 9 of the ~27** authored by weapon-research
  **W-9 R-1**. Set 1 = 3 routes × 3 acquisition classes; **there is no floor axis** because
  §12.7's band carries each concept F1→F3 itself (M-1 ×2 → M-2 ×4 → M-3 ×8), so each is written
  once and read three times.
- **This is the SPINE, not the top shelf.** `items-batch-c.js` already holds the authored apex
  pieces; W-7 §1 puts the genre apex ratio near 3%, so those stay few.
- The grid: **Leak-Vial · Oathbreaker line ⭐ · The Name** (Easy) · **Clan-Token · Brand-Iron ·
  The Debt ⭐** (Medium) · **Crystal Shard · Kin-Carve ⭐ · The Horn, taken** (Hard).
- **Three exemplars carry the rulings.** ⭐ **C-2 Oathbreaker** restates Mistletoe's `Charm 8`
  as R-2's `REQUIRES Vengeful` + `REFUSES Corporate Asset` — the seed already calls it *"a CLAIM,
  not an edge"*, so the stat was a predicate in disguise. ⭐ **C-6 The Debt** is R-3 in one
  object: a worthless token that becomes a queen's writ if she was spared and **stays inert
  forever if she was killed** — and it `REFUSES Witnessed`, which is Vermilia's own *"was I a
  coward?"* turned outward. ⭐ **C-8 Kin-Carve** is the Teigu rule: **overuse makes you kin**,
  and a contestant becoming Loong-like is not carrying loot, they are becoming livestock.
- 🔒 **RULED 2026-08-25:** `Charm 8` **stays** on Mistletoe and carries C-2's gate alone (the
  proposed predicate is dropped — it was already doing the work and is already seeded); and the
  predicates are **trimmed from 7 gates to 2** (C-6 `REFUSES Witness`, C-8 `REFUSES Animal
  Planet`) — *"there will be normal weapons too so its not that big of a deal."*
- ⭐ **What replaced them is better: three concepts now GRANT a Mark instead of refusing a tag.**
  An item that marks you creates consequences; an item that refuses you only closes a door.
- 🔒 **C-0b — MARKS: RULED IN (2026-08-25) as a SUBGENRE of §18 tags**, not a second system —
  a tag with `fades: false` plus a presence trigger, inheriting §18's storage, its TVTropes
  definability rule and its §18.1.6 item-gating. **Witness · Dragon Slayer · Regicide.**
  Granted automatically by the deed; **permanent, never fades**; *"might unlock new
  interactions, not necessarily good."*
- 🔒 **No secrecy states.** Open/Sealed/Broken is **dropped**. A Mark is **always present** (and
  always counts for predicates) and **ACTIVATES when a scene makes it relevant** — `Regicide`
  near crowns and thrones, `Dragon Slayer` near demons and the Loong, `Witness` near Vermilia,
  who recognises it. Activation reuses §18.2's flagship-rider shape, so the whole build is
  **one flag and one trigger type**.
- ⭐ **THE AUTHORING RULE — a Mark's name must provoke a question the player cannot yet answer.**
  The party kills a demon girl, thinks *"oh well, the demon's dead"*, and the sheet says
  **`Regicide`**. They know a fact and not its referent, and carry that question to F3. *"That
  will surely get their gears turning."* **Name the deed by its weight, never by its action** —
  `Regicide` is a question, `Killer` is not.
- 🔴 **Marks repaired a hole the first draft shipped** — §18's lifecycle fades every tag, so
  C-6's original `REFUSES Witnessed` was defeatable by *neglect*. A Mark cannot be shed, so the
  gate holds, and R-3's loop closes (a myth born from a deed cannot lapse).
- 🔒 **MARKS ARE REAL IN-WORLD — the Corporation's CAUSALITY LEDGER (ruled 2026-08-25).** Not a
  metaphor and not a UI convention: the production **attributing consequence to a contestant**,
  physically. ⭐ **The purpose is diagnostic** — *"a way for players to know if something they did
  is the cause of their current circumstances."* That is also why activation is presence-based:
  the Mark lights **where its consequence is**, which is the same thing as pointing at the cause.
  🟡 Owner's open direction: maybe *gather causality* from them later.
- ⚠️ **Branding is NOT Vermilia's alone** — she is only the one branding *so far*, and **more
  high-tier entities will brand contestants.** A brand is a general capability of powerful
  beings; the Corporation's Marks are one user of that form, not its owner. **A contestant may
  carry brands from different hands, and whose brand it is will matter.**
- 🔒 **A Mark cannot be REINFORCED — *"it just IS."*** No depth axis; a second regicide is not
  more `Regicide`.
- 🔒 **`REFUSES` is checked CONTINUOUSLY, and a Mark-based refusal is PERMANENT (ruled 2026-08-25).**
  *"The item has conditions, lets say 'never kill a man'. If you killed someone, you cant take it
  back."* ⭐ **This is the payoff of ruling Marks permanent** — the two predicate sources now
  behave differently: `REFUSES <§18 tag>` **lifts when the tag fades** (C-8's `Animal Planet` —
  befriend the Loong and the weapon goes quiet, let it lapse and it answers again), while
  `REFUSES <Mark>` is a **one-way door** (C-6's `Witness` — stand by once and the queen's token
  is shut to you forever). ⚠️ Authoring rule: **a Mark-predicate locks behind you; a tag-predicate
  swings. Do not reach for a Mark unless you mean forever.**
- 🔒 **Reviving Cinnabrus gets its OWN mark, not `Kingmaker`** — *"the crescendo of the piece, a
  **reapotheosis**… a god is revived, hope is given to the clan, and it is now incomplete."*
  🔒 **`Apotheosis`** — and the *"now incomplete"* half is deliberate: a god is back, the clan has
  hope, and the work is not finished.
- 🔒 **Marks are BRANDS ON THE BODY** — physical, and *"not necessarily in a place you can see."*
  **Activation reads MOOD FIRST**: the room is wrong before anyone explains why, then a small
  note of the brand lighting / light from somewhere on the body. The GM may state it outright;
  what to avoid is announcing before the mood shifts. ⚙️ The light says *something here concerns
  you*, never what — so the player keeps holding the question. 🎯 And a contestant lighting up in
  a throne room is exactly the shot the Corporation wants.
- ✅ **C-0c — THE SET 1 DEED SWEEP (C-10 #8 done).** **22 distinct deeds across F1–F3**, only 3
  from items — confirming Marks are a **campaign** rule, authored per floor beside the enemy
  passes, not an item feature. Routes: **Easy 6 · Medium 6 · Hard 8**.
- ⚠️ **C-0d — THE FIREWALL DOES NOT BAR RELIGIOUS REGISTER (correction, 2026-08-25).** S-0's ⛔
  column is the **economy**, never the vocabulary — its first ✅ entry is *"Cinnabrus, the buried
  plague god."* 🔒 **A god in v1 is just a WORSHIPPED ENTITY** — *"could be simply a powerful
  sorcerer revered by people to a status no different than a god"* — and **the Corporation is big
  enough to use gods as NPCs.** So `Saint`, relics, blessings and worship are all available; only
  **divinity-as-an-economy** is barred. A session wrongly rejected `Saint` on firewall grounds;
  recorded in `set1-story-canon.md` S-0 so it is not repeated.
- 🔴 **C-0e / S-6 — WHY THE LOONG AND NULLROT NEVER MEET (ruled 2026-08-25).** **Each believes
  the OTHER is the sacrifice holding the cure**; the truth is *a little from both* and neither is
  consumed. **Two creatures avoiding the only conversation that saves everyone, because each has
  priced it as a death.** ⭐ **Without the party they never talk** — that is the party's real
  contribution to the best ending, and it is why S-6 says *"the optimal ending is not mercy, it is
  introductions."* ⚠️ **Supersedes** the older *"neither knows the other exists"* — by F2 the Loong
  has *"heard of the mask"*; what they lack is an accurate price, not knowledge.
- ⭐ **`MARTYR` — the only mark that names your VICTIM, not your deed (owner, 2026-08-25).**
  Killing Nullrot is not framed around the killing: **his corpse still works as the cure
  ingredient, but a finite one.** Alive he is renewable; dead he is a supply that runs out.
  🔴 **So a party can enact S-6's misunderstanding instead of correcting it, and it functions** —
  right about the mechanism, wrong about the necessity, and the road stays open *narrowed,
  forever.* The brand on their body calls the man they killed a martyr. *(Retires `He Was
  Right`.)* 🔒 The corpse-as-limited-ingredient rule is **BLESSED** (2026-08-25).
- 🔴 **F3 Hard's ending is the MEETING, not getting the Loong out** (owner) — extraction is an
  option and the lesser one. The F3 Hard and convergence rows were the same act and are **merged
  into one `Fateful Meeting`**; `Shepherd` moved to **F2's desert escort**, which is the actual
  shepherding act (**there is no village to save — the village is the destination**).
- 🔒 **THE INCLUSION TEST (owner, 2026-08-25)** — *"a mark is something a story leaves on your
  soul to prove it was there."* A deed marks if **someone holds a grudge · someone feels
  gratitude · the possibilities changed.** This **replaced** the first draft's looser
  *irreversible/consequential/nameable*, and immediately cut three entries — **killing Bex at F2**
  (he returns by F3, so no grudge sticks and no road closes; *maybe an achievement, not a Mark*),
  destroying the Ribcage, and answering the song. ⚙️ **All three were decisions inside a fight:
  a tactical choice is not a deed.**
- 🔒 **Naming pass (owner):** `Heeded the Mural`→**`Historian`** · `Left Him Chained`→**`Torment`**
  · `Made It Unnecessary`→**`Saint`** ·
  `No Fight`→**`Fateful Meeting`** · `Surgical`→**`Crystal No More`**. Role-names and state-names
  are ruled good as a class. `Unhurried`→**`Laid To Rest`** (the traditional term — *to lay a ghost* — and it is the **F1**
  deed) · `The Village Stands`→**`Shepherd`**, reframed: **there is no village to save, the
  village is the destination.**
- 🔴 **F2 QUEST DESIGN (PROPOSAL, `f2-enemy-pass.md` F2-2).** Both layers are mechanically strong;
  the gap is upstream. ⭐ **Medium's real problem: the party cannot change the outcome** — sent to
  assassinate, the kill does not take, sparing changes nothing, answering the song pays Exposure.
  **Every path converges**, which is why the deed sweep found zero marks there. The fix is a
  sentence already in the layer — *"what happens in this room decides what he thinks of them when
  they arrive"* — currently an uncashed promise. Three candidate spines: **① Bex's Petition begins
  at F2** (he asks honestly; they grant or refuse) · **② who hired you** is discoverable · **③
  Vermilia tells a party that freed her what the crown is digging for.** ⭐ ①+③ compose: both
  antagonists ask on the same floor, both asks are honest, and **the party cannot satisfy both.**
  ⭐ **Hard's problem: the destination is undefined.** Proposed — **the village is where the Loong
  HEARD OF THE MASK** (S-4 already says so). Arrival is not sanctuary, it is the Loong getting its
  next step, which makes `Shepherd` causal and `Livestock` kill the lead. Nothing is rebuilt.
  🔴 **Nothing ruled; no new statlines.**
- ⭐ **The best names state an unwelcome fact:** `Unsealed` (killed the Doorward — it warned you
  truthfully and it was still the right move) · **`Martyr`** (killed Nullrot) · `Left To Rot`
  (extracted the Loong and left the city sick — **names what you abandoned, not what you
  rescued**) · `Livestock` (handed the Loong to the hunters) ·
  `Two Million` (FRACTURE 4 cracks the reservoir under the capital — **a number branded on your
  body**, and the one Mark that should arguably never go dormant).
- ⚠️ **Only two deeds in Set 1 are unambiguously good.** *"Not necessarily good"* is an
  understatement — the campaign brands you for being right about as often as for being wrong.
- ⚠️ Branch interaction: `Witness` activates near Vermilia, so a party holding **both**
  `Regicide` and `Witness` has permanently disabled the better half of `Witness` — they killed
  the only person who could recognise it. Nothing needs to say so; it just never fires.
- 🔴 **NO stat blocks** — numbers come after the shapes are blessed. **C-10** holds six open
  calls; the top three are all Marks (is it in · do Sealed states ship · what else grants them).

## Rulebook & Wiki (added 2026-07-23)
- **`rulebook/gpt-system-v1.0.md` is the canonical TTRPG rules master** (owner decision
  D-8, 2026-07-23). Edit the markdown to change the rules; the docx/PDF are historical.
- The player-facing **Wiki** (`/wiki` route, `client/src/pages/Wiki.jsx`) renders it via a
  `?raw` import + `marked` — one committed copy, no drift. The 📖 Wiki button in the sheet
  topbar opens it. `vite.config.js` has `server.fs.allow: ['..']` so dev mode can read it.
- The full reconciliation plan (rules updates + app fixes, decisions D-1..D-8) lives in the
  game repo: `Galactic-Prime-Time-Game/docs/ttrpg-update-plan.md`.

## 🔴 OPEN ITEMS (as of 2026-08-25 — Set 1 shipped)

**Set 1 is DONE and LIVE.** 53 enemies (F1 19 · F2 16 · F3 18), the safety kit and the F1
material requirements are seeded into Atlas; every story call from the review packet, the two
external reviews and the 2026-08-24 changelog is ruled and propagated. Nothing below blocks
anything else.

| # | Item | Where |
|---|---|---|
| **1** | 🔴 **E-7 — two entries the signature gate flagged.** THE MASKED punches **6** against a boss band of **8**; **Vermilia has no attack number at all**. My read: both are correct-as-designed (his threat is the Dissolution aura, hers is noble presence) and what is missing is a third `exception` word, not a number change. **Needs an owner call — do not guess.** | `rulebook/f1-enemy-pass.md` E-7 |
| **2** | 🟡 **S-f·1 — the mixture as the v1 revival catalyst.** Effectively settled by the two-lock ruling (the pair opens the door, the mixture they create is the catalyst) but never formally closed | `rulebook/set1-story-canon.md` S-6, S-9 |
| **3** | **Naming and fix pass.** Deferred until there was a base to work with. There is now: 53 statted entries with working names | all three enemy passes |
| **4** | **F1 follow-on content (E-4).** Encounter tables / room counts · §21.4 terrain blocks · Exposure and viewer values per enemy · token/loot payouts | `rulebook/f1-enemy-pass.md` E-4 |
| **5** | **Migrate F2/F3 to `Enemy.signature`.** F1 is done (14 of 19); the gate is optional by design so the others still pass. Do it during the naming pass | `server/seeds/enemies-f2.js`, `-f3.js` |
| **6** | ✅ **Weapon research COMPLETE + all three questions RULED (2026-08-25).** 6 passes, 4 tranches, 25 myth weapons + 14 fiction/game systems, every entry from a page actually read. 🔓 Fandom bypass: `/wiki/` is Cloudflare-403 but **`api.php` returns 200** (raw wikitext). 🔒 **R-1 — author ~27 concepts, NOT 81 weapons.** The §12.7 band owns the floor axis; the target is **3 sets × 3 routes × 3 acquisition classes** + a small apex set (genre apex ratio ≈3%). 🔒 **R-2 — an item MAY reject a contestant, on a WRITTEN predicate, never arbitrarily.** Legal shapes are `REQUIRES <tag>` (BE) and `REFUSES <tag>` (NOT BE); "the sword judges your worth" is not writable. Rides on **§18.1.6 tag gates** + **§18's TVTropes rule** (which is already the anti-arbitrariness guarantee) + **§12.1 → §6 Forced Action** for the failure path. ⭐ Mistletoe's `Charm 8` is this rule already in use as a stat proxy — *"a contestant nobody would side with is holding a sprig"* — and is the first candidate to restate. **A weapon is lost when its tag FADES**, which is Freyr's sword as a live mechanic. 🔒 **R-3 — weapons BIRTH myths, they do not borrow them.** Reputation accrues forward from deeds (Kusanagi/Fate model); the Frieren replica case is **not** adopted. Closes W-6 §3's "meaning cannot appreciate" gap — the loop is **deeds birth a tag → the tag gates the weapon**. ⚙️ **Total new machinery across all three rulings: one authored form (`REFUSES`).** ⚠️ W-1 is partly retracted — its 'genre-wide ladder' was one wiki table duplicated | `rulebook/weapon-research.md` **W-9** |
| **7** | **Set 2 (F4–F6).** No floors designed — only band names in M-4. The level budget, the scaling frame and the horde rules all reach that far already | — |
| **8** | Rival-resolution rule is RULED, but **rival party defaults are unwritten** — author what each would do by default, as prep and never as promise | `set1-story-canon.md` S-7 |
| **9** | Game repo: **automatic Dissolution cause-tracking.** `freeze_dissolution()` is the API; nothing calls it, because the engine cannot yet tell that a contestant left an aura | `Galactic-Prime-Time-Game` R36 |
| **10** | ⚠️ The Atlas URI carries **no database name** (`…mongodb.net/?appName=…`), so everything lives in the driver's default DB. It works and the app agrees — but "fixing" the URI later would point at an empty database | `docs/deploy-render-atlas.md` |

---

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
