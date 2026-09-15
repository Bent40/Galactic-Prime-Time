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
  🔒 **The horns look like LIGHTNING-STRUCK WOOD** — scorched, split along the grain, something
  catastrophic passed through and the wood **kept growing.** ⚠️ A description, **not a material**:
  there is no lightning-struck wood in the M-bands, and the horns should have no material at all
  because **they are grown, not forged.** ⭐ It unifies the design into one event — lightning
  splits wood and fuses sand to glass, so split horns with crystal blooming from the fissures
  read as **a single strike** rather than two ideas.
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
  method alone.**
- ⚡ **THE HUMAN CROWN IS A LIGHTNING ROD (ruled 2026-08-25, killed branch).** Not a compromise or
  a puppet — **apparatus.** Give a frightened population a figure who *appears* to hold power and
  their rage finds the nearest target: **they do not rise against the demons, they seethe at the
  human who will not.** 🔴 **And that is the crop** — Bex's farm harvests blood and **negative
  feeling**, so a city structured to manufacture directed, impotent resentment is **a renewable
  harvest with a throne on top of it.** ⚙️ The killed-branch capital's politics *are* the farm's
  infrastructure, and the frightened man who licensed it is himself part of the machine.
  ⭐ **Everyone in it is sincere; only the shape is designed.**
- ⚖️ **CONTROLLED DISILLUSIONMENT + the economics (ruled 2026-08-25).** Nobody is blindfolded —
  the population can see the demons fine. They are held at **a calibrated dose of despair: enough
  to enlarge the feeling, never enough to break the person**, because a broken population stops
  producing. 🔒 The logic: *"harvesting giblets from a crowd is harder but more material efficient
  than just butchering the entire human."* Butchering yields once; **skimming a whole city yields
  forever.** ⚙️ So the throne is a **yield optimisation.**
- 🔒 **BEX IS THE ORCHESTRATOR (ruled 2026-08-25)** — the architect, not an opportunist working
  someone else's machine. **Beelzebub plays with the odds in the background**, tilting
  probabilities without co-running the city (consistent with S-1's scavenger reading).
  ⚠️ It raises his register and holds: canon has him never lying and **not defending his means**,
  and an architect who will not defend his own architecture is exactly that man. ⭐ **It makes the
  F3 Petition cost more** — the demon asking to be made human built the engine, and will say so.
- 🕯 **WHAT THE DOLL BELIEVES (ruled 2026-08-25).** No clan, because **it is not a demon — it
  believes it is one**, specifically **Vermilia's ELDER SISTER**, carrying a burden that belongs
  to her younger sibling. 🔒 **It does not know it is a doll** (the truth *can* be written in at
  creation; deliberately is not, so an asset that cannot be broken cannot betray the secret), and
  it is **remade — reimagined — at every crowning.** ⭐ The horror is Vermilia's own sin built as a
  servant: her failure was **not speaking for someone**, and she has manufactured a person who
  believes she **failed to protect a sister**, then rebuilds her every generation. ⚠️ Each one is
  days old and certain it is the elder. 🔴 **And it defeats a truth-sense without lying** — a
  sincere doll passes, which is **the Doorward's trap restated: the truest voice in the room is
  the lure.**
- 🚪 **THE ACCESS LADDER — who the party is actually talking to (ruled 2026-08-25).**
  **F1 = the real Vermilia** (a child in a burning house, no court, nothing to hide behind — the
  only floor she is unguarded) · **F2 = the DOUBLE** (the desert court is the doll; Vermilia does
  not appear) · **F3 = the real one, but NOT immediately.** Gate: **carry her brand** and the
  Double brings them to her (the brand is *hers*, and the doll honours it); **otherwise build a
  reputation** with the crown first — reachable, and work. ⭐ **This makes accepting a demon's mark
  at F1 the best investment on the route**, paying off two floors later. 🔴 And the party already
  met her at the only moment she was reachable; most will not connect the child to the queen.
- ⚰️ **THE MAUSOLEUM IS THE DIG SITE (ruled 2026-08-25)** — where Vermilia spends most of her time.
  ⭐ **The dynasty's tombs are the cover for the hole:** a fabricated bloodline's mausoleum is full
  of graves for people who never existed, and **nobody asks why the queen visits her ancestors or
  why digging never stops under a house of the dead.** The ruse and the excavation are the same
  building, each explaining the other. 🟡 Proposed: the "previous queens" tombs hold the
  **discarded dolls**, so the current Double walks past her predecessors without knowing.
- 🤝 **F2 SPINE ① DESIGNED — THE PETITION (owner, 2026-08-25).** The party was sent to kill him
  and he opens with ***"You again? How curious. You're still alive."*** 🔴 **Both F2 antagonists
  open on the same beat** — Bex and Vermilia are equally startled the humans survived, and neither
  knows the other is. That is what makes ①+③ compose rather than coexist.
  **His diagnosis:** the new kingdom has **no aim, no will to live in peace with demons, and no
  plan to sustain them.** 🔴 **He is describing a two-century excavation and cannot see it** — the
  crown looks aimless because governing was never the point, and **he knows nothing of Cinnabrus
  or the dig.** ⭐ Right about the symptom, wrong about the cause: Set 1's thesis on a third
  character.
  **The appeal:** *"I have a logical solution. I am the lesser of the evils. Better to rule with
  aim and cause minor harm than to rule without aim and cause major harm."*
  🔴 **He is not lying, and that is the trap.** By his metric the harm *is* minor — it is the
  **"giblets from a crowd"** arithmetic. ⭐ **His F2 pitch is a plain description of the F3 farm,
  offered honestly, and the party cannot yet decode it.** Nothing is concealed; they lack the
  referent.
  ⚙️ **The decision the route was missing:** the target asks them to switch sides mid-contract —
  complete it (it does not take, and he remembers being killed by people he had just offered a
  partnership), join him (betraying a crown that sent them via a Double that does not know why),
  or walk. 🟡 Proposed marks: **`Shareholder`** (took the offer) · **`Answered In Kind`** (killed
  him after it). 🔴 Three open calls in `f2-enemy-pass.md`.
- 📓 **F2 SPINE ③ RESOLVED — THE JOURNAL (owner, 2026-08-25).** The Double receives a branded
  party, explains that *"her great-great-great-grandmother"* branded the people who saved her,
  and hands over the journal that ancestor wrote — **which she cannot read a word of, because she
  has been told not to understand it.** 🔴 **She is describing a woman standing in the next
  building**, and the party who met that girl at F1 are the only ones who could notice.
  ⭐ *"Told not to understand"* is the doll's own material logic, not a hand-wave — it is
  **Inscribed Clay**, *the writing is the strength*, so *"you do not understand this text"* can
  simply be written in. **An asset that cannot read the secret cannot leak it.**
  ⭐ **The brand becomes a key twice, escalating:** at F2 it decrypts a document, at F3 it opens a
  door to Vermilia. 🟡 Two refinements offered: **the CORPORATION does the translating** (the show
  subtitles it because the audience needs the plot — consistent with Marks as its causality
  ledger and with it protecting branch points for ratings); and 🔴 **the journal should be about
  THE PARTY, not the dig** — the F1 night from Vermilia's side, so the reveal is not *"the crown
  digs for a god"* but ***"wait, this is us,"*** which is what makes the F3 audience earned.
  ⚙️ Let the doll be **slightly unsure how many "greats"** — she is days old reciting a handed-down
  lineage, and the hesitation is the tell. ✅ **Both refinements accepted 2026-08-25.**
- 🔗 **WHY THE JOURNAL IS READABLE, AND WHAT READING IT CAUSES (owner, 2026-08-25).** Vermilia keyed
  it to **herself alone** — a private record, written on the assumption that the humans who saved
  her had been dead for a century and a half. 🔴 **The brand is an accident of her own making:** it
  carries *her permission*, so a branded party reads it with her authority. **And the doll reports
  back** — people, carrying the queen's brand, who took the book. **That is when she learns they
  are alive and can return.**
  ⭐ **So the F3 audience is NOT a standing order — it is a new instruction added because of F2.**
  She writes *"if those ones come back, bring them to me"* into the dolls. ⚙️ Between F2 and F3
  there are further crownings and remakes, so **every doll made after that visit carries a line
  about the party.** They edited the doll and will never know it.
  🕯 **The asymmetry is the payload:** she believes she is seeing people who died of old age two
  centuries ago. **From her side they are ghosts; from theirs it has been a few weeks.**
- 🏺 **THE DOUBLE'S MIMICRY IS AN ITEM — a CLAY DOLL (ruled 2026-08-25).** Comes to life, acts on
  the user's wish, **striking resemblance to whatever they imagined**, and 🔒 **negligible combat
  power by design.** ⭐ An item solves "keep it small" better than a repertoire did — it has a
  location, an owner and a failure mode, and **the Double is a demon with a tool rather than a
  demon with a power.** 🔒 It is **Inscribed Clay**, already the **M-3 capital material**
  (*"Golem/tablet — the writing is the strength"*), so the limit has a mechanism: the writing
  carries **likeness, not strength.** 🔴 **The load-bearing limit: it renders an IMAGINATION, not
  a person** — which is *why* the successions look like daughters rather than duplicates.
  **The dynasty is convincing precisely because the tool is imprecise.** ⚙️ Marks stay dark on a
  doll, the Loong's truth-sense should see through one, and **the party can plausibly obtain one.**
- 🤝 **F2 PETITION — ALL THREE OPEN CALLS RULED 2026-09-01.** ① **The price of joining Bex is
  killing the queen** — not a small favour. ⚠️ My open call assumed the cost should be small; the
  opposite is right, because paying enormously at F2 is what makes F3 land. 🔴 **AND THEY KILL THE
  DOUBLE, NOT VERMILIA** — the access ladder puts the real one out of reach at F2. ⭐ **So F2 is the
  floor where BOTH antagonists survive being killed, by unrelated mechanisms that look identical
  from outside**: Bex by clan law, the "queen" because it was never her. **The party can leave F2
  believing they resolved two things and resolved neither.** ⚠️ **No `Regicide`** — no monarch died,
  and **the absence is the tell** (the ledger records what happened, not what anyone believed).
  ⭐ **The tell they already had: Marks stay dark on a doll**, so a `Witness` party feels nothing in
  front of "the queen." Cost: a permanent enemy in the real Vermilia, a **poisoned F3 access
  ladder** (they used her own brand to reach her double), and a sincere victim who died believing
  she failed to protect her sister. 🟡 Proposed mark **`Effigy`** (unblessed — mine, not the
  owner's); refusing marks nothing. ② **He does NOT name the farm** — he states the principle
  honestly (*"take as little as possible… a humble sacrifice, for the benefit of all"*) and 🔴 **offers
  proof: a living human they fed on and kept alive.** ⭐ Real evidence of restraint by his own
  metric, and undecodable until F3 supplies the referent — **they lack the referent, not the
  information.**
- ⚖️ **THE DOUBLE CLAIMS DIVINE WRATH — Vermilia's own clan (ruled 2026-09-01).** She does not know
  she is a doll and does not know the clan is written in; she believes it. ⭐ Plausible because the
  queen *is* wrath clan and **nobody can check** — a population of one has no register. 🔴 **And the
  lie is FUNCTIONALLY TRUE:** clan law says a demon dies only when its clan dies, and killing her
  *does* bring her back — because Vermilia rebuilds her. **From outside the two are
  indistinguishable, so her murder corroborates the ruse instead of exposing it**, handing anyone
  who kills her a correct-sounding and completely wrong explanation. ⭐ **The irony is load-bearing:**
  the wrath clan embodies karma, and the servant Vermilia built so she never has to be seen
  sincerely believes she is made of judgment.
- 🔴 Three open calls remain in `set1-story-canon.md`.
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
- 🔒 **L-24 — EVERYTHING KILLED PAYS (ruled 2026-09-15).** *"Everything killed pays
  experience and levels, as well as whatever loot there is."* ⚠️ **This withdraws the
  linear draft's "mobs and individual elites pay ZERO levels"** and rewrites **§3.1**,
  which said levels came only from milestones and that **"there is no XP curve"** —
  its own parenthetical had guessed the future correctly. **Rulebook → v1.6.**
  ⚙️ **The old line had TWO reasons and they are not equally answered, so both are
  recorded:** ① *"grinding beats playing"* → ✅ **answered by something already true —
  NOTHING RESPAWNS**, so a floor's experience is finite by construction; and §17.6 +
  §17.8 put the other rewards on the other behaviour (**levels from bodies, boxes and
  audience from deeds**), so grinding gets you statted and leaves you unequipped and
  unwatched. ② *"a floor with four elites out-pays a floor with two — the roster author
  accidentally controls the power curve"* → 🔴 **still real**, and a flat per-kill number
  would hand me exactly that lever. ⭐ **So payment is a SHARE, not a number: a floor is
  worth its floor's grant (L-19: 10/10/10 · 16/16/16 · 24/24/24), distributed across its
  roster by PART BUDGET.** No XP table, no thresholds, no cost curve — the doctrine gate
  already knows every creature's budget, so the arithmetic is a division the roster does
  for itself. **The author sets the granularity; the budget still sets the total.**
  ⚙️ Worked at F1: ~**505** budget against 10 levels ≈ **50 budget to a level** — a mob is
  a tenth, an elite a level and a bit, the boss two and a half, ⭐ **and a cleared room of
  ten mobs is about a level**, the rate the tutorial has been paying all along.
  ⭐ **Resolving pays the SAME experience as killing** — L-19's *"resolved, not killed"*
  row was right and survives; what the owner withdrew is that **only** resolving pays.
  **The kill adds LOOT; the resolution adds THE QUEST (§17.6). Neither path is the poor
  one — they pay in different currencies.** ⚠️ **Anchors untouched:** clearing a floor
  lands exactly on L-19's curve, and **skipping content is now the only thing that moves
  you off it** — which finally makes §4.1's one-route-per-campaign and S-7's trade track
  cost something.
- Still standing: **all routes pay identical levels.**

## Race & Class (PROPOSAL, 2026-09-15 — `rulebook/race-and-class.md`)
- ⭐ **THE LOUNGE ALREADY HAS ALL THREE RUNGS — nothing needs building.** §20.3's
  **Surgeon's Table (20 UT)** reads **L1** *"the canonical **race-change** service"* ·
  **L2** *"**Animal-part grafts** (GM-statted from the beast you brought back)"* ·
  **L3** *"**boss-part grafts** with their quirks."* 🔒 **The owner's "later, as updated,
  race assimilation" is literally that module's own L2→L3 upgrade path**, written months
  ago and already priced. ⚠️ **What is missing is not a system — it is what a GRAFT DOES**,
  because both rows today say *"GM-statted"* and stop. **That is the entire scope.**
- **Race change (L1):** race is already *"whatever you add to yourself"* in the data model
  (`RACES` + freetext `identity.species`), so a race is **an identity line plus its racial
  package** (Swim on a sea lion, claws on a cat). **A race change swaps the package** at
  the level you held the old skills; one downtime action. ⚙️ Whole-body and **broadcast** —
  a contestant walking out of the Lounge as something else is an episode.
- **Assimilation (L2/L3):** *a graft replaces ONE body part and that part carries ONE
  trait the donor actually had.* ⭐ **All four limits are rules that already exist:**
  **you have six parts** (§3.2 — the cap enforces itself, and each graft costs the part you
  had) · **the trait must be ON THE DONOR'S STATLINE**, the same anti-arbitrariness shape as
  §21.3's required `why`, so **the bestiary IS the catalogue** and 53 entries are already
  written with their reasons · **the trait lands on the PART**, where `BodyPartSchema`
  already carries `resistances` + `universal` · and **boss grafts come with their quirks**,
  so the downside is part of the object rather than a tax.
- ⭐⭐ **It closes yesterday's model gap.** The Incinedile's **`fire_heals`** has no field,
  and an **L3 arm graft that heals from fire** is exactly what boss-part assimilation
  should be — **the field that boss needs and the field assimilation needs are the same
  field.** Proposed: `weaknesses[].mode` = `double` (default) | `heal`, per-part
  overridable, keeping the required `why`.
- 🟡 **Open (mine):** does being modified grant a **Mark**? It fits §18.4 exactly — a deed
  done *to* you, permanent, physical, *"not necessarily good."*
- 🔴 **CLASS — the question that must be answered first: how is a Class different from a
  Mark?** DCC-format classes are earned from what you did, absurdly specific, named for the
  weight of the deed — **which is §18.4's authoring rule word for word.** Without an answer
  we build a second system for a rule we already have. **Proposed: a Mark RECORDS, a Class
  CAPACITATES** — the ledger says what you did, the class is what you did often enough to
  **become**; so **a deed grants a Mark, and a Mark can unlock a Class.**
- ⭐ **The cheap shape — a class RE-GOVERNS.** L-17 already ruled skills scale with their
  governing trait, so a class changes **which trait governs** (a Brawler scales Charm skills
  off Physique). One number, no new machinery, **identity-shaped rather than +X-shaped**.
  ⚙️ **And it is the only shape that does not break L-19**: the 150-level curve was computed
  without classes, so raw bonuses must be paid *out of* those levels or the anchors move —
  **re-governing changes which trait powers a skill, never how much total power exists.**
- ⚠️ **Scope:** race is **one ruling and one field**; **class is Set-2-sized** (it touches
  L-17, L-19, §18.4, the skill model and the sheet). Recommend **race now, class after
  Incinedile.**

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
- ✅ **MARKS ARE BUILT AND IN THE BOOK (2026-09-01).** The mechanic no longer lives only in
  proposal docs. **Rulebook → v1.2, new `§18.4 Marks`** (deed vs performance · granted
  automatically · permanent, never Reinforced/Faded/Lost · no depth axis · physical brand,
  not necessarily where you can see it · Present vs Active · mood-first activation ·
  `REFUSES <tag>` swings / `REFUSES <Mark>` is a one-way door · gates checked continuously,
  failure → §6 Forced Action). 🔒 **There is deliberately NO Mark Compendium** — §18.3
  publishes tags because knowing one is how you play it; a Mark works the other way, so the
  book names only the three generic tropes (`Regicide` · `Dragon Slayer` · `Witness`) at
  trope level with **no campaign referents**. The 22-deed Set 1 roster stays GM material.
  **App:** `Tag` model carries `kind: 'tag'|'mark'` + `activeNear`; both `routes/tags.js`
  verbs whitelist them; `TagLibrarySection` authors marks; `PlayerPanel` grants them (the GM
  grants — the player picker **filters marks out**, they are earned not chosen); the sheet
  has its own **Marks panel** where a click toggles dormant ↔ lit instead of cycling a
  lifecycle, and **the ✕ is absent because a Mark cannot be shed**. **Seeder:**
  `node seed-marks.js` (dry run) → `--apply`, data in `server/seeds/marks.js`; `--check`
  runs the §18.4 gate alone with **no `node_modules` and no DB** and exits 1 on a violation
  (wrong `kind`, missing trigger, missing deed). ⚠️ **Not yet seeded to Atlas.**
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
- 🔴 **SECOND PASS — the first stat-block set was WRONG and is being rebuilt (owner, 2026-09-01).**
  *"Most of these items are key items. Not loot the party can actually use in their daily life.
  No armor, no weapon, and all tools are story specific."* ⚠️ **Correct, and the cause was the
  class axis:** sorting by `loot / crafted / story` **guaranteed** a third of the spine would be
  story props, and the loot column drifted the same way. ⚠️ I also over-read W-6 §2 — *88% of myth
  weapons are categorical* is about **numeric vs categorical**, not about whether an item is
  usable gear. **A categorical weapon is still a weapon you swing every session.**
  🔒 **New axis: `weapon / armor / kit`.** Five concepts survive intact (Oathbreaker · Seepage ·
  Brand-Iron · Kin-Carve · Crystal Shard); **four are new** — ⭐ **The Sealed Coat** (Easy armor;
  by F3 the party is dressed as Nullrot, having independently arrived at a plague doctor's
  answer) · ⭐ **The Sanction** (Medium weapon; *the same bar of iron for three floors — it starts
  as the tool that burned a child's house down and ends as the instrument of the crown that child
  became*) · **The Livery** (Medium armor; allegiance worn, Superior nullifies Dissolution T1) ·
  **Citizen-Glass** (Hard armor; crystal resists everything but Crush — *the best protection
  against the plague is the plague*). The four story objects (**The Name · Clan-Token · The Debt ·
  The Horn**) **move OUT of the spine into a Key Items set**, which is what they always were.
- 🔒 **ONE OBJECT, REBUILT — not three objects (owner, 2026-09-01).** *"merge some of these, with
  understanding reshaping them, rather than them being a completely different item."* Every
  concept now **keeps a material through all three readings** (the Sealed Coat's Tough Hide, the
  Sanction's iron core, Kin-Carve's Beastbone edge), so the F1→F3 progression is a **Forge
  rebuild**, not a new find. Names are `<Concept> — <State>`.
- ✅ **§12.7 BILL OF MATERIALS + DISASSEMBLY — BUILT 2026-09-01 (rulebook v1.2).** *"any item you
  have needs to have its materials written down, so if it is disassembled, the party can reuse it
  for different things."* **Rulebook:** every item carries a bill (part → material, one marked
  **striking**, which sets the band); **disassembly at the Forge destroys the item and returns
  every material whole**; **upgrading is a choice, not a schedule** (reforge the striking part,
  break it down for something else, or carry it and hit like the floor it came from); **what comes
  off is materials, not parts** — a blade yields *Obsidian*, not *a blade*. **App:**
  `ItemTemplate.materials[{part, material, striking}]`, whitelisted in both `routes/items.js`
  verbs **and copied into the give-snapshot** (disassembly happens on the player's copy);
  `shared/MaterialsEditor.jsx` edits it in the admin library and on the sheet.
- 🔴 **THE DAMAGE-NUMBER CONFLICT — owner call needed.** Owner: *"the damage numbers, im assuming,
  change by floor with the doubling."* ⚠️ **§12.7's blessed errata says the exact opposite** —
  *"a greatsword is written as 3, a mob as 5, and a torso as 7 on Floor 1 and on Floor 9 alike."*
  🔴 **And the errata has a real flaw the owner's instinct caught:** band units break the moment
  gear crosses a floor, which is precisely what disassembly/optional-upgrading is for — an F1
  sword read in F3 band units is **0.75**. ⚠️ **Whichever way it goes, BOTH SIDES must move
  together:** the 53 enemy statlines are written flat (mob 5 on every floor), so absolute items
  against flat enemies gives a 24-damage F3 sword vs a 5 HP mob and armor resists that outgrow
  enemy damage entirely. **Options: A** band units everywhere (errata as-is, no migration, but
  material upgrades are invisible) · **B** absolute everywhere (re-base 53 statlines + part HP +
  the doctrine gate) · **C — recommended:** store band units, **have the sheet display absolute**
  (it already knows the material). No migration, no fractions, and the Jade sword visibly reads 24.
- ✅ **STAT BLOCKS WRITTEN 2026-09-01 — `server/seeds/items-set1-spine.js`, 26 templates**
  (9 concepts × 3 floors, less C-9's F1). Validated against the `ItemTemplate` enums; seed with
  `node seed-items.js --file ./seeds/items-set1-spine.js` → `--apply`. 🔒 **Written in BAND
  UNITS (L-22)** — a damage number does **not** change F1→F3; the band cancels inside a floor,
  so what moves across the three readings is **capability, never arithmetic.** ✅ **W-6 §2
  honoured: 20 of 26 deal no damage at all** and none reads `+X damage`; only C-2 and C-8 are
  weapons. 🔴 **Five inventions need an owner call (C-12):** ① **Vitrian**, a named court
  brand-smith for C-5 (placeholder name; carries the coerced-craft defect rider) · ② the
  **Kinship track** on C-8 (3 = a body part changes permanently, 6 = the hunts turn onto you —
  thresholds are guesses) · ③ C-1's `Mind 6` read and C-2's cold-wielder punish (first-pass
  numbers) · ④ 🔴 **Turquoise still has no source**, and C-2's F2 reading needs it · ⑤ Andvari's
  Cut reads **3 on a Heavy Small** — legal under *an item may outpace its class inside its band*,
  but the only place that permission was spent.
- 🔴 **NO stat blocks** — numbers come after the shapes are blessed. **C-10** holds six open
  calls; the top three are all Marks (is it in · do Sealed states ship · what else grants them).

## ⚡ FORCE — the damage system (RULED + BUILT 2026-09-01, rulebook v1.3)

🔒 **THE MULTIPLICATION IS GONE.** §12.7's ×2-per-floor material band (F1 ×2 … F9 ×512) is
**withdrawn and superseded**, owner-approved. **A material band step is now +1 Force.**
The 2026-08-18 band-units errata is tombstoned in the book with both of its faults recorded:
it made every floor arithmetically identical (so a gear upgrade showed on a sheet as *nothing*),
and it broke the moment gear crossed a floor (an F1 sword read **0.75** in F3 band units).
⭐ **The axis of progression is the PLAYER, not the floor.**

- 🔒 **§7.3 — FORCE. One Force is one basic punch**, and every damage source is counted in it:
  weapon class + **+1 per material band step** + anything added (element, coating, affix, venom)
  + preparation. Every part of the total carries a **damage type**. **An enemy's HP is Force** —
  a mob is five punches, and it does not matter whether they arrive as a club, a fire or a fist.
- 🔒 **A weakness DOUBLES that type's contribution.** A torch adds 1 Force normally, 2 against
  something that burns. ⭐ **This is where intel cashes out** — knowing the weakness is what turns
  the +1 into a +2, which gives scouting a payoff without inflating the band.
- 🔒 **Typed resistance subtracts from its own type ONLY, and never more than that type dealt.**
  Fire resist 5 against 1 Force of fire eats the 1 and **wastes the other 4**.
  ⭐ **Consequence, verified in `force-model.js`:** against a boss with diverse resistance,
  **spreading damage thin lands 0%** while **finding the unresisted type lands 100%**. That turns
  "bosses need discoverable win conditions, not damage races" from an instruction to the GM into
  **arithmetic**. Bosses get diverse resistances, not fatter bars.
- 🔒 **§10.1 UNIVERSAL RESISTANCE — a threshold, never a stat.** Universal 6 = *"needs 7 Force to
  do anything."* **Applies to the TOTAL, once — never per type** (4 Physical + 4 Fire is 8, and 8
  beats a 7-threshold; per-type it would not, and a threshold that rejects 8 damage is not a
  threshold). **Typed resolves first, universal takes the remainder** — any other order is
  ill-defined on a mixed attack.
  🔒 **AND IT IS ALWAYS CAUSED BY SOMETHING (owner) — a structure, a stance, a hold, an active
  effect — NEVER a creature's standing state.** A golem has universal 6 because of its shell, and
  chipping the shell lowers or strips it. ⭐ **Every entry must name its cause AND its removal;
  one without the other is not legal.** *"A number nobody can answer is not difficulty, it is a
  wall."* This replaced my proposed numeric cap and is strictly better — if it always has a cause,
  it always has an answer. Same shape as E-0's gate rule and §21.3's boss rule.
- 🔒 **§7.3 — AREA DOES NOT DIVIDE.** An attack covering multiple targets deals its **full Force to
  each**, unless it says otherwise; each target then applies its own resistances. ⭐ **This is what
  returns the horde fantasy that going additive cost** — a sweep over 9 spaces kills 9, so the
  tide is cleared by **covering ground, not by a bigger number**. ⚙️ The balance worry answers
  itself: §12.1 already requires heavy weapons to have an *adjacent empty radius*, so you cannot
  swing one in a press of nine.
- 🔒 **§8.1 — FORCE vs CONDITIONS are two layers.** *Force is what the attack does now; a tier is
  what it leaves behind.* **Bleed/Crush/Burn carry both. Chill/Poison/Infection/Dissolution carry a
  tier and NO Force by default** — an item may grant one Force explicitly (*+1 Force (Poison)*) and
  it then answers to Poison resistance like any type. **If a condition deals Force, the entry says
  so in a number.** This maps onto §10's existing flat-vs-tiered classification untouched.
- **PREPARATION CATEGORIES (owner):** steps are budgeted per category so prep must be *diverse* —
  you cannot buy it all at the Forge. **Gear 3** (band step · added type · affix/coating) ·
  **Situation 2** (ambush · terrain) · **Party 1** (assist/grapple) · 🟡 **Sponsorship 1** (a patron
  intervenes — mine, and the only category unique to this game). Ceiling 7 steps.
  🟡 **Knowledge is NOT a step** — it is what doubles the weakness. 🟡 **Body is NEGATIVE** — your
  own conditions subtract. (Both mine, unblessed.)
- **Calibration:** mob Force = the AVERAGE contestant's Force. F1 mob **5** → F9 mob **13**, +1 per
  floor. Under-prepared 2 hits · average 1 · prepared 1 with surplus to cleave. Two digits forever.
- ⚙️ **Three calculators regenerate the tables instead of drifting:** `server/floor-bands.js`
  (cross-floor) · `server/prep-bands.js` (within-floor) · `server/force-model.js` +
  `server/force-resistance.js` (the unit, weakness doubling, resistance order, area).

### ✅ THE MIGRATION LIST — ALL SIX CLOSED (2026-09-14)

| # | What | Outcome |
|---|---|---|
| **1** | 53 enemy statlines | ⚠️ **My note said elite/boss/super were absurd as Force and had to come down hard. That was WRONG.** A party of 4 at the average 5 Force, 3 swings each in a 10-Moment Clock, outputs **60 Force/Clock** — so elite 60 is a **one-Clock** fight, boss 125 is two, super 300 is five. A good ladder that needed nothing. 🔴 **The real fault was in the SEEDER:** `FLOOR_MOB_HP` still doubled (5/10/20…1280). It now tracks the calibration — **5/6/7…13**, a mob = the average contestant's Force for its floor. ⭐ **Consequence: only the 16 MOBS moved** (F2 5→6, F3 5→7, one line each in the file's `MOB` helper). **Every elite, boss and super passes its own floor as hand-tuned**, because the ±tolerance widens with the centre. `--floor` also stops being a no-op |
| **2** | `item-drafting-materials.md` | Band table reads in **Force steps** (+0/+1…+9) with the old ×-column struck through beside it. The *"Greatsword 3 → Jade 24 → 768–1536"* worked example is withdrawn: a greatsword is **3 + the band step** — 4 at F1, 6 at F3, 12 at F9 |
| **3** | `enemy-scaling.md` + `floor-bands.js` | ⭐ **Needed far less than expected** — the damage ladder derives enemy damage from **total trait points**, which is linear and never used the band, so it regenerates **identically**. Only the **horde formula** rode the doubling. Rewritten: kills/swing = `floor(your Force ÷ old mob Force) × spaces swept × ~20 swings`. ⚠️ **Tides fall from ~3,000 at F9 to 250** — flagged in the doc as a real change in feel wanting an owner eye. Also added the two missing exceptions (`aura`, `presence`) the doc never listed |
| **4** | `level-budget.md` L-22 | **L-23 written, L-22 withdrawn**, with both faults recorded and the list of what survives untouched (body as the variable · the part-budget reading · classes 2–4 · the F1 roster) |
| **5** | `items-set1-spine.js` | Damage is **Force = class + one per band step of the STRIKING part**. Unsworn Sprig 3 · Sun's Dart 4 · Andvari's Cut 6 · Warden-Carve 3 · **Kin-Carve 4** (the edge is still Beastbone even though the haft is Sky-Iron — the teaching case) · Imperial 6. All `(x2)/(x4)/(x8)` phrases gone |
| **6** | `Enemy` model + gate | ✅ Done 2026-09-14 — see above |

**102 enemy tests pass.** F1/F2/F3 all pass the gate at their own floors.

### 🔒 BOSS RESISTANCE DOCTRINE — RULED 2026-09-14 (rulebook §21.3)

⚠️ **I got rules 3 and 4 wrong on the first pass and the owner corrected both.** Recorded
with the corrections, because the wrong versions are the tempting ones.

1. 🔒 **Story first.** *"Bosses with story purpose should follow story logic. It's fine
   that the Mask is hard to kill, that's not his purpose."*
2. 🔒 **The floor must contain a form of the solution — and the boss must not be solvable
   only by it.**
3. 🔒 **A PATH MUST EXIST. That is the whole requirement.** ⚠️ **I first wrote this as
   "overwhelming force must sometimes work" and built a gate capping universal resistance
   below the floor's average Force. BOTH ARE WITHDRAWN.** Owner: *"I don't mind it being
   genuinely impossible for some builds. Not every fight can be solved by brute force,
   the conditions must meet. It's just about making sure the path DOES exist."* A boss
   **may be flatly impossible** for a party that brought the wrong things, and **may be
   highly resistant to a great many things with every trick it needs to survive — that is
   part of the fun.** ⚙️ §10.1's mandatory **`removal`** field already guarantees the path;
   the second gate was redundant *and* enforcing a rule the owner does not hold.
4. 🔒 **Over-expression is a failure of JUSTIFICATION, not of COUNT.** ⚠️ **I first wrote
   this as a count limit** (one weakness, one or two resistances). Withdrawn. Owner:
   *"where overexpression happens is exactly as you stated with the cold — there was no
   justification, it was just to force them to use heat."* **Six resistances each tracing
   to the fiction is well made; one invented to funnel a tactic is a gimmick.** ⭐ **The
   test: *"can I say what in this creature's story makes it do that?"*** If the honest
   answer is *"so they have to use fire"* — cut it.

🔒 **HOW TO STAT ONE (owner's method).** Do not start from mechanics. Start from the
creature: **what it is · how much it matters to the story · what it has done so far** —
and derive abilities and resistances from that.

⚙️ **What replaced the bad gate — `why` is now REQUIRED on every resistance and weakness.**
That is the machine-checkable form of rule 4: if the reason will not write, the line does
not ship. `ResistSchema.why` + `WeaknessSchema{type, why}`; `resistanceProblems` refuses a
blank one. **Count is never checked; justification always is.**

### ⭐ THE MASKED — the exemplar, restored to the fiction

🔒 Its thesis was already one line in the entry — ***"It is not the man that is durable."***
The ward is on the **Mask**; **the man is the hole.**

| | value | why (required) |
|---|---|---|
| **Weak** | Burn (doubles) | The horns are wood and the mask is fired clay; nothing in that silhouette has ever been on fire |
| **Resist** | Bleed 2 | The Mask restores a destroyed part every Clock reset — bleeding him *is* that restoration, one swing at a time |
| **Resist** | Infection 3 | He is the plague's own reliquary. Infecting patient zero is a category error |
| **Mask part** | universal **6** | `cause:` Beelzebub's seal · `removal:` Oathbreaker ignores it; the chain ends the fight without touching it |
| ~~Chill 2~~ | **CUT** | ⚠️ traced to nothing — *"the conversion runs hot"* was invented to push the party toward fire. **The one genuine over-expression, and the owner named it** |

⚠️ **Universal is back at 6, and an average F1 party does exactly nothing to the Mask.**
**That is correct now** — canon says it *"cannot be damaged by normal harm,"* the win
condition was never the Mask, and **three roads are written**: the chain (ends the fight
without touching it), the sprig (ignores the ward), and a prepared party simply grinding
it at 2 a swing. 🎯 GM: announce none of it.

**Two model gaps this surfaced and closed:**
- 🔴 **§7.3's "a weakness DOUBLES that type" had NO FIELD** — `Enemy.weaknesses[{type, why}]`
  holds it now; the gate refuses an unknown type and a type listed as **both**.
- 🔴 **Enemy resistance was whole-body only, while §12.6 already gives the CONTESTANT
  per-part resistance.** `BodyPartSchema` carries `resistances` + `universal` too, which is
  what lets the Mask be sealed while the man is not.

**115 tests pass.**

### ✅ ALL 12 BOSSES AND SUPERS AUTHORED (2026-09-14) — §21.3 applied

Every boss and super across F1–F3, statted by the owner's method: **what it IS · how
much it matters · what it has DONE** — then the numbers, each carrying its reason.

| Floor | Boss | Weak | Resists | Because |
|---|---|---|---|---|
| F1 | **THE MASKED** | Burn | Bleed 2 · Infection 3 · Mask **universal 6** | horns are wood; the Mask restores a part each Clock; he is the plague's reliquary |
| F1 | **Foreman Bex** | — | — | ⭐ **blank by design.** Canon forbids the party learning he is not a man; **any resistance is a tell.** His survival is clan law, not a number |
| F1 | **Vermilia** | — | — | ⭐ **blank on explicit canon** — *"no gate and no special weak system."* Her difficulty was never physical, and softening the kill would cost the encounter its whole weight |
| F1 | **Loong Kin** | **Infection** | Bleed 4 | 🔴 **Cinnabrus killed its ancestor WITH THE PLAGUE** — crystal is the one thing that has ever killed this bloodline, and the Hard route walks the party through streets of it while they talk to the last of the line. Bleed: Loong-Scale is *shed, never taken* |
| F2 | **The Doorward** | — | Infection 6 · Torso **universal 99** | **seventy years eating the plague out of the chained man.** The Torso number is the entry's own written gate made structural — *"while it holds anything of yours, damage to the Torso is cosmetic"* — with the Mouth (18, unwarded) as the removal |
| F2 | **Bex, Rival Noble** | — | Dissolution 3 | the songs are **his instrument**; a man is not unmade by what he commands |
| F2 | **The Hunt's Owner** | — | — | ⭐ **blank by design.** *"It bought the hunt. It has never run one."* Its protection is distance, a mount and money — **a resistance would contradict the character** |
| F3 | **Nullrot** | **Crush** | Infection 8 · Poison 4 | ⭐ **the weakness MOVED.** At F1 the horns were bare wood and he burned; here they are in full bloom and **the blooms are crystal, and crystal shatters.** Not a trick — the creature visibly changed |
| F3 | **Bex, Petitioner** | — | Dissolution 5 | **170 years harvesting despair as a crop.** It has nothing left to show him |
| F3 | **The One Who Would Be Clean** | — | Dissolution 6 | reduced to a **single want** — there is almost nothing left to come apart |
| F3 | **Dragon in the Foundations** | — | Bleed 5 · Infection 8 | the seal **re-knits**; it is the largest plague reservoir in the world |
| F3 | **The Reservoir** | **Burn** | Bleed 6 · Crush 6 | 🔒 **canon stated it outright** — *"Burn T2 clears infection outright and it is the one thing that works at scale."* It is a **volume, not an animal**: cutting frost opens nothing |

⭐ **Three of twelve are deliberately blank, and that is the doctrine working.** Rule 4
is about justification, never count — so where the fiction wants an ordinary creature,
the right block is empty. A test pins all three so a later pass cannot "fill them in".

⚙️ **Spot-checked, not asserted.** The Reservoir: blade and hammer land **1** against a
40 HP bloom that regrows every Clock — the "attrition does not work" lesson as
arithmetic — while a torch lands 6. The Doorward: **nothing** reaches the Torso from any
build while it holds something, and the Mouth is wide open to everyone. Loong Kin: a
blade lands 1 against the scale, a hammer 5, and ⭐ **a party carrying crystal shards
lands 7 without ever knowing why** — they are holding the one substance that kills its
line.

**120 tests pass**, including a roster-wide sweep: every resistance and weakness across
all 53 entries names its WHY, and every universal names cause and removal.

### ✅ §21.6 PREPARATION — written, with both new categories designed (2026-09-14)

🔒 **Owner blessed Sponsorship and Body**, on the condition they be *real designs, not
concepts*. Written into the rulebook as **§21.6** (which also closes §7.3's dangling
forward-reference — it pointed at §21.5, which is Falling).

**Budget:** Gear 3 · Situation 2 · Party 1 · **Sponsorship 1** · **Body negative**.
**Ceiling 7 positive steps.** 🔒 **Knowledge is NOT a step (owner)** — it *doubles* a
matched weakness, so scouting pays by multiplying what you brought.

- 🆕 **SPONSORSHIP — the step you cannot plan.** Only a patron who has **adopted** you.
  **Spend 1 Moment on an on-brand appeal, on camera.** A **Reinforced** tag in the
  patron's domain is an automatic yes; a **Faded** one an automatic no. Granted:
  **+1 Force of the patron's own damage type for the Clock** + a Viewer spike, with
  **their name on it**. Refused: you spent the Moment, the refusal is **broadcast**,
  and the tag takes **one step toward Faded**. Once per patron per combat.
  ⭐ It is the only step asked for *during* the fight, and the only one that makes an
  audience-facing build pay in combat.
- 🆕 **BODY — the only category that subtracts.** **−1 Force per condition tier on the
  limb you are swinging with**; whole-body conditions (Exhausted · Infected · Shock)
  hit every attack; they **stack**; **never below 1 Force**; **checked at the swing**,
  not the Clock reset. ⭐ Closes a real hole — conditions cost actions and Moments but
  never damage, so a shattered arm hit as hard as a healthy one. ⚠️ **It makes healing
  a damage buff**, deliberately.

---

## Tutorial floor — REVIEWED 2026-09-14 (`rulebook/tutorial-floor-review.md`)

**Where it lives:** NOT in this repo's `Enemy` collection. Four entries exist only in the
**game repo's** `data/enemies.json` — `Roach-dog` (mob) · `Little Brother Roach` (elite) ·
`Incinedile` (boss) · `War Hound` (elite, no design record) — plus Compendium **§3.1** and
the party snapshot **§5**. **No doctrine gate, no `signature`, no `why` on any resistance.**

- ✅ **THE BOSS IS FINE, ON BOTH READINGS.** Incinedile parts sum to **exactly 125** =
  §21.2's boss centre; and because pre-breach damage is cosmetic the *real* fight is the
  **50-HP Network**, which is **25 × a tutorial mob of 2** — the boss centre for a floor
  below F1. ⭐ The Compendium's *"single HP bar (total 50)"* and the sim's six-part 125 were
  never in conflict: **one is the network, the other the puppet.** No re-statting.
- ✅ **§10.1 UNIVERSAL RESISTANCE WAS INVENTED HERE, BEFORE THE RULE.** *"Breach Path B:
  deal 7+ damage in a single hit"* **is** `universal: 6`, word for word — and it already
  satisfies the ruled `cause`/`removal` requirement (cause: the mycelium holds the surface;
  removals: **Bleed T2**, *or* 7+ Force in one hit). ⭐ **The tutorial boss is §10.1's
  exemplar and predates it.**
- 🔴 **§21.8 THE PRESS WAS ALREADY BUILT — FOR THESE ROACHES.**
  `roach_dog.personality.pack_hunter`: *"when two ready roaches' draws AGREE on a victim,
  the second **links its bite to the first (shared combo_id → one merged Force through one
  Robustness gate**; **pairs only in v1**)"* + *"**Elites/bosses are NOT pack hunters.**"*
  ⭐ That is ① arrived at independently **with the tutorial-safe dial already chosen**, and
  *elites don't pack-hunt* composes exactly with ② — **the elite directs without joining the
  merge.** 🔒 **Adopt the sim's cap as the tutorial setting: the press PAIRS, it does not
  stack to three.**
- 🔴 **THE REAL PROBLEM IS A NUMBER, NOT THE RULE.** A roach-dog bites for **`1 Bleed`**
  (carapace 1 HP). §12.6 armor is a flat subtraction, so ⭐ **12 roach-dogs × 1 Bleed −
  armor 1 = ZERO damage, all session** — *that is the playtest, confirmed against the
  statline.* And **the Press does not rescue it at bite 1** (a pair deals `2 − 1 = 1`).
  Doctrine wants `0.55 × torso` = **3**; ⚖ **recommend 2, with the press capped at pairs**
  (lone roach 1 through · pair 3 · nothing one-shots a torso). **Bite 3 is the doctrine
  number and too hot here** — at armor 0 a pair kills Sasha. ⚠️ **The two changes are one
  change.**
- ⚠️ **NEXT SESSION IS THE HARD CASE.** The **Little Brother Roach** is a **director that
  manufactures its own pressers**: `Awaken Eggs` (1 Moment, **summons 4**) · `Drag Back`
  (range 7, **pulls a contestant into the pack**) · Whip (range 7, 2 Bleed) · Seal Wound.
  🔴 Under §21.8 that is the worst-case shape available. ⚠️ **And an interaction nobody
  designed:** its `low_hp_bias: 3.0` (*"picks off the weak — wounded prey weighs up to 4×"*)
  now meets **§12.6's conditioned parts resist less** — ⭐ **the AI hunts exactly the target
  today's armor rule softened.** Keep it; know it is there.
- 🔴 **Its part budget is 64** against a tutorial elite centre of **24** (F1's is 60) — **the
  elite is F1-grade while its mobs are 1 HP**, sixty-four times its own mob. That is the
  tutorial's one real internal inconsistency and why *"2 elites, struggled badly"* happened.
  ⚖ Either the elite is right and the mobs are under-statted (my read), or it comes down to
  ~24 — **not both.**
- 🔴 **SASHA'S TORSO IS 3 where the book says 5**, and she is the forward damage dealer, so
  **every lethality threshold fires one mob earlier for her.** ⭐ The owner already diagnosed
  the general case in §3.1/§4.1 — *"hard to hurt without killing… considering boosting all
  body-part HP"* — and **§21.8 + §12.6 both push on exactly that margin.** ⚖ Unruled: bring
  her to 5 · spend the six unspent points (torso 6 for all) · or leave it and cap the press.
- 🔴 **TWO GAPS IN WHAT WAS BUILT TODAY.** ① **`fire_heals` HAS NO FIELD.** §7.3 gives
  `weaknesses` (doubles) and `resistances` (subtracts) — **healing from a type is a THIRD
  thing, a negative weakness**, so the Incinedile's defining trait cannot be written into
  `Enemy` at all. ⭐ And the sim already found the sub-case: **`fire_harms` on the Network
  exempts that one part** (*mycelium burns*), so it must be **per-part overridable** — which
  `BodyPartSchema` already supports structurally. Proposed: `weaknesses[].mode` =
  `double` (default) | `heal`, keeping the required `why`. ② **The gate has no floor 0** —
  `FLOOR_MOB_HP` runs 1–9, so `--check` on a tutorial roster is impossible. The tutorial's
  own centres would be **mob 2 · elite 24 · boss 50 · super 120**, and ⭐ **the Network is
  exactly 50.**
- **Small:** §3.1's phase thresholds are off by one (P1 `50→36`, P3 `35→19`) · trash cans
  (`Burn 5` → 2 Burn) are correctly the weaker original of F1's Fuel Can · **`War Hound`**
  (budget 14) is in the sim roster with **no design record** · four Compendium `[OPEN]`
  items sit in the tutorial's path — the **fantasy-item coupons are undistributed** and
  **XQUEZ/T's tank kit is unfinalised**, ⭐ and *Iron Stance is the answer to the Press*, so
  it wants finishing before the roaches.

## 🔒 TUTORIAL + RACE/CLASS RULINGS (owner, 2026-09-15) — rulebook → v1.7

- 🔒 **THE PRESS CAPS AT THREE.** *"Roach-dog damage won't be buffed. And the press is
  buffed to 3."* ⚠️ My recommendation (bite 2, press capped at pairs) is **dropped** —
  and the owner's version is **better**. ⭐⭐ **Because the maximum press is then EXACTLY
  one destroyed torso, on every floor**: F1 **9** vs a 7 torso · F5 **20** vs 17 · F9 **46**
  vs 35. **The rule is bounded at lethal-once and cannot reach past it** — so the six-mob
  instant kill my own author's warning had to warn about **is not a thing a GM can do by
  accident any more.** The warning is rewritten accordingly. At the tutorial (bite 1,
  unbuffed): armor 0 → **3 through, a Small torso falls** · armor 1 → 2 → **nothing's torso
  falls**. ⭐ **One worn piece is the whole difference**, in the room where it happens.
- 🔒 **SIZE SETS BASE PART HP (§7.1).** *"Sasha is fine with 3-hp torso. She's a small
  animal."* ⚠️ My "Sasha's torso is wrong" finding is **withdrawn — it was never a bug.**
  **A base, never a multiplier.** ⭐⭐ **And the gap closes by itself**, because §3.2's growth
  is flat: a Small torso is **60% of a Medium at creation and 94% by F9** (3/5 → 33/35).
  ⚠️ **So size is an EARLY-GAME fact that bites hardest exactly where the party is standing**
  and is a rounding error by F3 — which is why the answer is **armor now**, not a permanent
  correction. 🔴 **The per-size tables are the open task** (`race-and-class.md` R-4), and its
  hardest question is **what Small BUYS** — ⭐ Sasha's `Nightlurking` (*"fits through
  cat-plausible spaces"*) is already that trade, written before the rule existed.
- 🔒 **THE SURGEON'S TABLE DOES THREE VERBS: ADD · REMOVE · CHANGE (§20.3).** ⚠️ My draft
  said a graft *replaces* a part, and **ADD broke my limiter** — *"you have six parts so the
  cap enforces itself"* is false if you can add. ⭐ **No cap is needed:** every part you add
  is a part you must **armor, heal and defend** — §12.6 buys resistance per part, §12.6 also
  drops it by that part's condition tier, and §21.6 Body subtracts Force per tier on the limb
  you swing with. **Four arms is four things to break.** Rate capped by downtime (§20.1),
  menu by module level. ⛔ **The lethal parts cannot be removed** (§7.1 — every body needs a
  head- and torso-equivalent).
- 🔒 **MODIFICATION DOES NOT GRANT A MARK.** My proposal dropped, and the reason is better
  than the proposal: ⭐ **the Corporation sells it, so the Corporation does not brand you for
  it.** **Deeds earn keys; money buys bodies.**
- 🔒 **A MARK UNLOCKS A SET OF CHOICES (the class/race answer).** *"Race types and class types
  unlocked via mark, which will hold a few choices… common classes to choose in general, and
  rarer classes/races unlocked via mark. That would mean delaying your class or race choice is
  valid."* ⭐ Sharper than my one-Mark-one-Class proposal: **a Mark is a KEY and it opens a
  CABINET**, and there is a **common pool that needs no key.** ⭐⭐ **The design win is the
  third sentence — DELAYING IS VALID**, which makes the pick a **held resource** rather than a
  creation-time lock, and is exactly DCC's feel (classes are *offered* as you go). Costs one
  rule: an unspent choice keeps.
- ⭐⭐ **AND IT FIXES SOMETHING NOTHING ELSE WAS FIXING.** Only two Set 1 deeds are
  unambiguously good — `Regicide`, `Martyr`, `Two Million` were **pure cost**. 🔒 **Now every
  Mark pays.** The consequences are not softened by one point (the grudges hold, `Witness`
  still never fires near a queen you killed) but **the brand opens a cabinet nobody without
  it can open.** ⚙️ §18.4 already said a Mark *"might unlock new interactions, not necessarily
  good"* — this is that sentence with a mechanism behind it.
- ⭐ **THE HATCHERY IS DESIGNED** (`tutorial-floor-review.md` **T-8**). Safe spots to hop
  between · goop passable but much slower · **the islands sink** · a rush window that closes.
  ⭐ **It fixes what I flagged as broken** — goop plus a long whip removes the party's ability
  to choose geometry, which is §21.8's only counterplay; **the safe spots give it back, because
  an island is a corridor made of terrain**, and island size is the press dial. ⭐⭐ **THE
  SINKER BRANCHES ON F1'S CHOICE:** Mid Bro alive → *he* leaps and smashes platforms (finally a
  job in a room that is not his); **Mid Bro dead (this party) → Little Bro throws a roach at the
  platform**, and **a thrown roach is one he did not press with and did not eat** — sinking
  competes with the press AND with his healing. **Killing Mid Bro made the room easier one way
  and harder another, and nothing announces either.** ⚙️ **And the room's decision cashes out a
  ruling made the same morning:** rush him before the window closes = fewer roaches = 🔴 **fewer
  levels under L-24.** *The fastest route through the tutorial's last room is also the poorest,
  and neither rule knew about the other.*

## ✅ BUILT 2026-09-15 — the heal field, the size tables, and two live bugs (v1.8)

- ✅ **`weaknesses[].mode` = `double` | `heal` — BUILT.** §7.3 had two answers to a damage
  type (double, subtract); ⭐ **healing from one is a THIRD — a negative weakness** — and
  the Incinedile's defining trait could not be written at all until now. **Model:**
  `WeaknessSchema.mode` (enum, defaults `double`) + **`BodyPartSchema.weaknesses[]`**, and
  ⭐ **a part OVERRIDES the body for its own type** because *doubles* and *heals* cannot
  both be true of one part — which is exactly **fire heals the puppet and HARMS the
  Network, because mycelium burns.** **Gate:** `checkWeaknessSet()` factored out and run
  over the body *and* every part; rejects an unknown mode, keeps the required `why` on
  every mode, and checks a part's weakness against **that part's** resistances rather than
  the body's. ⚙️ `WEAKNESS_MODES` is duplicated in the seeder so `--check` still needs no
  `node_modules`. **Rulebook §7.3** carries the rule + *"resistance ADDS between body and
  part; a weakness REPLACES."* **UI:** a `WeaknessRow` editor with a doubles/HEALS selector
  and live warnings. **151 tests pass** (+15); F1/F2/F3 all still pass their own floors.
- 🔴 **TWO LIVE BUGS FOUND WHILE WIRING IT, both from 2026-09-14's work:**
  ① **`normParts` compared `{name, maxHp}` ONLY**, so the per-part `resistances` and
  `universal` added that day were **invisible to the diff** — editing THE MASKED's Mask
  universal or the Doorward's Torso gate produced **no `bodyParts` difference and `--force`
  would not have written it.** Fixed, with three regression tests pinning each sub-field.
  ② **The admin UI never got `weaknesses` at all.** My note that day claimed they were
  *"edited in `admin/EnemiesSection.jsx`"* — **resistances and universal landed; weaknesses
  did not.** Now built. ⚠️ Client build verified (`vite build`, 72 modules, exit 0).
- ✅ **THE PER-SIZE BASE TABLES — written into §7.1.**

  | Part | **Small** | **Medium** *(canon)* | **Large** | **Huge** |
  |---|---|---|---|---|
  | **Head** (lethal) | **2** | **2** | 3 | 4 |
  | **Torso** (lethal) | **3** | **5** | 8 | 12 |
  | arm · leg | 1 · 2 | 2 · 3 | 3 · 4 | 5 · 6 |
  | **body total** | **11** | **17** | **25** | **38** |

  ⛔ **The head never drops below 2 at any size** — it is a lethal part, so a 1 HP head
  means *any* hit kills, including one mob's. ⭐ **Not an arbitrary floor: it is the line
  under which a part stops being a part and becomes a coin flip.**
- 🔒 **WHAT SIZE BUYS — RULED 2026-09-15: PASSAGE, and that is all (v1.9).** *"What small
  buys depends on the animal. Any animal that's small can go through a small entrance, but
  animals are basically the highly specialized race."* ⚠️ **My framing was wrong** — I had
  size as a *trade* (Small buys mobility, Large buys reach). **It is not a trade.** **Size
  buys ONE thing — a smaller body goes where a larger one cannot** (§11 already gives gaps
  real dimensions; this makes **size alone** answer them, no skill required — symmetric,
  unnumbered, GM-read). **Everything else about a smaller body is simply a COST**, and
  ⭐ **the compensation lives in the RACE, which is not balanced against other races.**
- 🔒 **ANIMALS ARE THE SPECIALISED RACE.** **Human = the flat one** (no racial skill,
  nothing closed — thematically exact, since the show is about abducted humans, so Human is
  the unmarked default) · **Animal = a tall, narrow spike with a real bill** · 🔴 **Robot ·
  AI is unwritten** (⚖ mine: the *modular* one, the race §20.3's Augmentation Hub speaks to
  natively — XQUEZ/T is Physique 5 with **no weapons**, which is already a shape).
  ⭐⭐ **An Animal's spike is CONDITIONAL, and that is the cost paying for itself:** a sea
  lion's Swim is enormous *in water* and nothing in a desert, so **the FLOOR decides what a
  race is worth that week** — and Set 1 is forest, desert, city. **No balancing number is
  needed; the campaign prices the roster by itself.** ⚙️ And specialisation is **not only
  skills — it is the BODY**: §7.1 already shapes non-standard layouts (flippers, not arms),
  so **size, parts and racial skills are one package.** ⭐ **Which is why the Surgeon's
  Table exists** — §20.3's add·remove·change is the one place that package can be edited,
  so **a specialist stranded on the wrong floor is one downtime action from a graft.**
  Race, size and the Lounge close into a loop. ⚠️ **A SMALL ANIMAL is the highest-variance
  start in the game** — smallest body (11 vs a Medium's 17) **and** narrowest spike. Correct,
  and it is why `Nightlurking` reads the way it does. 🔴 **Only two pieces left (R-4): the
  racial package per race — what each Animal's one spike is — and Robot·AI's shape.**
- ⚠️ **MY MISCOUNT, CORRECTED: there are THREE roach brothers — Big, Mid, Little.** The
  tutorial review said *four*; I had counted the **dog-roach** as a sibling and it is the
  **mob**. Fixed in `tutorial-floor-review.md` with the error recorded.

## ✅ THE THREE BROTHERS — STATTED 2026-09-15 (`rulebook/tutorial-enemy-pass.md`)

- ✅ **FLOOR 0 IS A REAL FLOOR NOW.** `FLOOR_MOB_HP` ran 1–9, so a tutorial roster could
  not be gated at all. Built into `floor-bands.js` + `seed-enemies.js`: **mob 2 · elite 24
  · boss 50 · super 120**, damage band **mob 3 · elite 4 · boss 6 · super 9** (torso 5,
  level 6). 🔒 **One special case, and it is the definition rather than a fudge:**
  `forceAt(f) = 4 + f` bakes in two §21.6 prep steps — one added damage type, one assist —
  that a tutorial party has not bought (no Forge, no coatings, no drilled assists, no band
  step). Strip those and a floor-0 contestant is weapon class 2 and nothing else: **2
  Force**. ⭐ **The tutorial is the floor where you have no preparation. That is what a
  tutorial IS.** ⭐⭐ **Two confirmations that fell out rather than being arranged:**
  `floorState(0)` returns **level 6**, exactly where the live party is standing; and the
  **Incinedile's Network of 50 is exactly 25 × 2**, the §21.2 boss centre for floor 0 — so
  the Compendium's *"single HP bar (total 50)"* and the sim's six-part 125 were never in
  conflict, **one is the network and the other the puppet.** ⚠️ **Contract change:**
  `signature.floor: 0` used to mean *unset, skip me*; the sentinel moved to
  absent/null/`''` (model, seeder and admin dropdown all match).
- ⭐⭐ **THE BUDGETS TELL THE STORY BY THEMSELVES — 32 · 24 · 20.** Big to little, and **the
  runt is UNDER the elite line.** That is why he was thrown out, written into the one number
  the doctrine gate actually checks.
- ⭐⭐ **THE CURRICULUM NOBODY DESIGNED: all three brothers are answers to ARMOR.** The
  owner's playtest note is that basic resistance stops mob damage cold (§12.6 subtracts
  flat, so against a mob's small number it is most or all of the hit). Each brother breaks
  it a different way and **none of it was designed to — it fell out of what they already
  are**: **BIG**'s charged shot **PIERCES** (ignores typed resistance outright) · **MID**'s
  leap is **CRUSH** where his axes are **Bleed** (one resistance answers half of him) ·
  **LITTLE**'s **PRESS** merges three bites into ONE hit, so resistance subtracts **once**
  instead of three times — 3×1 Bleed through armor 1 is **2**, three separate bites are
  **0**. ⭐ **The press is the only reason a roach-dog can hurt anybody, and the press only
  exists while he is alive.**
- **ROACH-DOG** (mob · Small · **2**) — signature **1 Bleed `tick`**, ruled unchanged. Below
  the mob band of 3 legitimately: **the number is chaff and the Bleed TIER is the work**,
  and its band-sized hit exists — **it is the press**. Teaches three things in order:
  armor SORTS · a Bleed tier **drops that part's resistance** (§12.6) so twelve bites take
  your armor apart · then §21.8. ⚖ **HP 1→2 recommended, not ruled** — **invisible at the
  table** (a tutorial swing is 2 either way); all it stops is a **bare fist** one-shotting
  a roach.
- **BIG BROTHER ROACH** (elite · Medium · **24**, dead centre — ⭐ *the disciplined one is
  exactly to spec*). Thorax 8 **resists Bleed 2** (per-part — the suit; head, arms and legs
  are bare shell). **Weak to Burn** — *the suit is cloth and he will not take it off, ever,
  for any reason; it is the only thing anyone ever made for him.* ⭐ **The mannered one's
  dignity is his weakness.** Signature **4 Bleed**; charged shot is a **windup 8**, PIN
  (Crushed T1) or **PIERCE** (ignores typed resistance). 🔒 **WEAK SYSTEM — the dodge, and
  the fact that it is ONE:** free, automatic, once per Moment, against one attack of his
  choosing. ⭐ **This is the tutorial's trap for its own lesson** — §5.7 combined attacks
  merge and *"count as ONE hit"*, which is exactly what he negates: **the biggest hit is not
  the best hit against something that can refuse one hit.** Removals: spend it (attack
  twice) · area (§7.3 — he cannot dodge the room) · ⭐ **the charged shot is the tell** —
  **his biggest attack and his punish window are the same Moment.** Drops the **bow**
  (class 3, plain — ⭐ *you inherit his weapon, not his number*) and **the suit**, which is
  Little Bro's work.
- **MID BROTHER ROACH** (elite · **Large** · **32**). Thorax 10, **two Axe Arms at 5**, Grip
  Arms 4. **Resists Crush 2** (*scar on scar on scar, and he is proud of it*). **Weak to
  Poison** — *four arms and one appetite* — ⭐ **and the meal is on the table when they
  arrive**: poison it before you are seen and you fight a poisoned Mid Bro. **A discoverable
  win condition that exists only because the owner put a meal in the room.** Signature **4
  Bleed**; **the leap** is a **windup 8 CRUSH** and §7.3 says **area does not divide**, so
  everyone in the landing space takes the full 8. 🔒 **WEAK SYSTEM — THE ARMS:** his damage
  is **in the arms, not in him** (§21.6 Body). **The win condition is dismemberment, not a
  damage race.** ⭐ He is **Large**, so §13 lets a Medium contestant grapple him — **the
  tutorial teaches grappling on the one enemy that grapples back.** **The doll** rides in a
  Grip Arm: threaten it and he covers it, the Grip Arms' action spent, every time. Drops
  **two axes** and **THE DOLL** — ⭐ **not loot, the key to the hatchery**: proof the
  brothers kept his gift. **A party that killed Mid Bro can carry it to the brother who made
  it, and they will not know it is a door.**
- **LITTLE BROTHER ROACH** (elite · Small · **20**, under the line). 🔒 **Resistances NONE,
  weaknesses NONE — blank by design** (§21.3 rule 4), **for the loudest reason in the
  tutorial: he was thrown out for being weak.** A resistance contradicts it, a weakness
  softens it. ⭐ **He has no mechanical edge whatsoever and he is the hardest fight on the
  floor, because of what he BUILT.** Same shape as Foreman Bex and The Hunt's Owner.
  Signature **2 Bleed `tick`** (whip, range 7) — under band because **he is not the damage**.
  🔴 **DRAG BACK (range 7) deals NOTHING and is the deadliest ability in the tutorial** —
  ⭐ **he does not attack you, he moves you to where the attack is**, which is §21.8's whole
  thesis as one ability. 🔒 **WEAK SYSTEM — THE BROOD, NOT THE BODY:** Awaken Eggs (summons
  4) · **he DIRECTS**, the only reason the press exists · Seal Wound (eats a roach and
  heals) — **the brood is ammunition AND medkit**. ⭐ **The BROOD-SLING (4 HP) decides the
  fight** — the newest clutch strapped to him *because he was thrown out once and will not
  leave them anywhere*; destroy it and both the summon reserve and the emergency ration go.
  **It is also the part they will not want to hit** — **the same gesture as Mid Bro covering
  the doll, two brothers, one of them already dead.** ⚠️ His **low-HP bias 3.0** now meets
  §12.6's *conditioned parts resist less* — **the AI hunts exactly the target today's armor
  rule softened.** Drops the **whip**.
- ⚙️ **The room's decision cashes out L-24:** rushing him before the window closes means
  fewer roaches, which means **fewer levels**. ⭐ **The fastest route through the tutorial's
  last room is also the poorest**, and neither rule knew about the other.
- **162 enemy tests pass** (+11); F1/F2/F3 all still pass at their own floors; client build
  verified. 🔴 **Open:** roach-dog HP 1→2 (recommended, not ruled) · `War Hound` still has
  no design record · **the Incinedile is next session's work** (build on **puppet 125 /
  Network 50**, the Doorward's shape) · the peaceful-resolution shop coupon is unpriced.

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
| **1** | ✅ **E-7 CLOSED 2026-09-01 — both correct as designed, and they are TWO shapes, not one.** New gate words: **`aura`** (0.5–1.0× band — the strike is not where the threat is; THE MASKED's 6 vs boss 8) and **`presence`** (damage must be 0, note required — Vermilia never swings). 🔴 `presence` is the one exception treated as a **positive claim**, which closes E-7's real hole: a 140-budget boss with no attack no longer passes silently. **F1 now 16 of 19 migrated.** ⚖️ **Her aura is a CHOICE**: on at F1, **suppressed past F1** (so the F3 audience is a conversation, not a countdown), and she may still afflict a **branded** party — ⭐ **that affliction IS protection**, a human trailing noble Dissolution is visibly claimed and other demons keep off. Built + 7 new tests (**81 pass · 0 fail**) | `rulebook/f1-enemy-pass.md` E-7 |
| **2** | ✅ **S-f CLOSED 2026-09-01 — both blessed.** The **mixture is the v1 catalyst**; the **Loong's blood-claim breaks the seal**. S-6's three steps are now **one act** | `rulebook/set1-story-canon.md` S-6, S-9 |
| **3** | ✅ **NAMING PASS DONE 2026-09-14 — and the first finding was a stale marker, not a name.** *Foreman Bex* had been **blessed 2026-08-18** and carried `⚖ NAME IS A PROPOSAL` for three more weeks in two places; **The Doorward** and **The Hunt's Owner** are **kept** (the Doorward wards a door *and* holds your things **in ward** — the whole encounter in one word; the Owner states its own thesis flatly, which is right for a man never within reach). **Two renames:** 🔒 *The One Who Would Be Human* → **The One Who Would Be Clean** — a collision fix, because **Bex owns "wants to be human"** and is titled for it (*the Petitioner*); this one wants the tendency **washed out**, which is the floor's own vocabulary (quarantine · antiseptic · plague). 🔒 *Kennel-Warden* → **The Houndmaster** — "Warden" belongs to the **built guardians** (Step-Warden, Mirror-Bronze Warden) and this is a handler; now **Owner pays · Houndmaster points · Hound dies** reads off the three names. 🔴 **A rename is a DB operation:** the seeder matches by name, so `renamedFrom:` was added — it finds the old Atlas document and **renames it in place**, keeping its `_id` and any owner edits, and `renameProblems()` refuses two seeds claiming one document. **136 tests pass** (+10). 🟡 **One flagged, not applied:** `Hoodlum` (F3) is 1930s American slang in a jade imperial capital | all three enemy passes |
| **4** | ✅ **E-4 CLOSED 2026-09-14 — all four rows. Rulebook → v1.4.** **§21.7 Encounter sizing** — two dials only: **SIZE** is the Clock fraction (a mob is one average swing, so **mobs-per-Clock is 20 on every floor** and room counts are **floor-invariant**: Brush 5 · Room 10 · Held room 20 · Tide 40+), **DANGER** is `width × mob signature × ⌈count ÷ 2⌉`, a stated ceiling. ⭐ **The dial fell out of the arithmetic rather than being chosen: an elite ALONE is a standard room (~25%); an elite plus four mobs is a hard one (~45%)** — mobs are cheap, **what costs is something still alive at the end of the room**, so add a second elite before ten more mobs. ⚠️ **F1 is the HOT end (31%/55% vs 23%/41% from F7) because early parts are small** — the campaign gets relatively *gentler* as it climbs, which is the opposite of the intuition and matters for the floor next to the tutorial. **§17.8 Spectacle** — swings, not counts, because §17.1 keeps numbers with the GM: room +1% · elite +5% · boss +25% · super +100%, **doubled when the kill uses the thing the crowd watched them fail at, halved when they grind**. ⭐ So §7.3's weakness rule pays **twice, from two directions**. **§17.6 + §19.1 joins:** a cleared room = 1 Bronze + 1 gather roll · elite = 1 Bronze + its carve · boss = 1 Silver · super = 1 Gold; **Legendary+ is never dropped by a rank**; and Set 1/2/3 map to Neighbourhood/District/City (5/10/25) and Precinct/Country/Stage (50/100/250) — ⚠️ **the Loong pays 10× the F1 boss, deliberately.** **F1 content: `f1-enemy-pass.md` E-8** — 14 sized rooms across the four layers, four §21.4 terrain blocks (each naming its §21.6 Situation steps; ⚠️ **reading the statues is NOT a step — knowledge doubles a weakness, it does not add Force**), a spectacle hook per entry, and the payout table. 🔴 **Vermilia pays nothing on either branch — there is no version of that scene the Corporation wants to price.** Calculator: `server/encounter-bands.js` | `rulebook/f1-enemy-pass.md` **E-8** |
| **4b** | 🔴 **THE ENCOUNTER MODEL WAS CORRECTED BY PLAYTEST (owner, 2026-09-14).** Three observations: *"they clear a room with 12 mobs with 0 issues"* · *"they fought 2 elites at the same time and struggled badly — I had to have mercy on them multiple times, opting for non-torso shots"* · *"most mobs will not be able to deal damage to the players due to the most basic of resistances doing their job."* 🔴 **The third is the cause and it was simply ABSENT from my model — I never put the DEFENDER'S ARMOR in it.** §10 resistance subtracts **flat** and §12.6 **stacks** it across worn pieces, so against a mob's small number it is most or all of the hit and against an elite's it is a shrug. ⭐ **Armor does not scale a threat down — it SORTS threats into "cannot touch you" and "can," and at F1 that line runs exactly between mob and elite** (mob 4, and a party can reach resist 4; elite 6, and 2 still gets through). **The cliff at F1: resist 0 → 41% · 2 → 21% · 3 → 10% · 4 → 0%, permanently.** Second error: I spent mobs as a queue; the owner — *"1 Moment delay if they spread each to take care of a mob"* — **a mob wave is limited by BODIES (four contestants, four mobs, one Moment), an elite by OUTPUT.** ✅ **Recalibrated, and it now reproduces all three observations**: 12 mobs **21%→7%** · 1 elite **21%** · elite+4 mobs **55%→28%** · **2 elites 83%** (= "struggled badly"). ⚠️ **Every claim I made about F1 being the campaign's harshest floor is WITHDRAWN** — with resistance in, the ladder is flat across all nine floors and **the only real escalation lever is the second elite.** 🔴 **And a genuine hole: nothing sits between 28% and 83%** — F1 as authored has **no hard room**, and mobs cannot bridge it. Three ways out, unruled: a second elite · an elite whose gate denies the parallel split · ⭐ **condition mobs — §8.1's Chill/Poison/Infection/Dissolution carry a TIER and NO Force, so flat resistance NEVER touches them.** *The mobs that still matter to an armoured party are the ones that deal no damage at all* — which is exactly the Spore-Drunk's puff and the Crystal Spore Mist, so **the F1 roster was already right and my sizing lens was the wrong one.** 🔴 **NEW OPEN CALL (§12.7): does a band step do anything for ARMOR?** A weapon gets +1 Force per step; armor gets nothing written. Flat subtraction means resist 3 is **75%** mitigation at F1 and **16%** at F9, so without it mobs stop being a horde mid-campaign. **Recommended: +1 resistance per band step** | `§21.7`, `enemy-scaling.md` S-4, `f1-enemy-pass.md` E-8 |
| **4c** | 🔒 **BOXES FOLLOW THE STORY, NOT THE RANK (owner, 2026-09-14)** — *"not every room clear deserves a box. Boxes should come from story elites and above, not necessarily from any elite, and from achievements/quests completed."* §17.6 rewritten: **a cleared room pays NO box** (the gather roll is the whole payment) · **an ordinary elite pays no box either** — its **carve**, which is worth more · **a story elite** (a named beat of the route, not texture) pays 1 Bronze + carve · boss 1 Silver · super 1 Gold · ⭐ **achievements / Directives / Goals / completed quests are the MAIN channel.** ⚠️ **If a box would be paid by repetition, it is the wrong reward** — the routine channel is the §19.3 Bronze box shop, where you *buy* necessities rather than farm them. ⚖ F1 read (mine, unruled): **story = The Chainbearer** (the mural scene) **and The Kindler** (the Fuel Can lesson); ordinary = The Rack · Bloomkeeper · Step-Warden | `§17.6`, `f1-enemy-pass.md` E-8.4 |
| **4d** | 🔒 **ARMOR RIDES THE BAND — RULED 2026-09-14.** *"+1 resistance per step."* Written into **§12.7** (with the reasoning) and **§12.6** (the operative sentence, where a GM looks): **a worn piece's resistance = its tier value + one per band step of its material** — the exact mirror of a weapon's *class + one per band step*. A Quality vest of F3 material resists **5**, not 2. ⚙️ **Why it could not stay open:** §10 resistance is a **flat subtraction**, so a fixed number is a *shrinking percentage* — resist 3 eats **75%** of an F1 mob's hit and **16%** of an F9 one. Without the ruling, armor silently stops working halfway up the tower and §21.2's horde promise **inverts**. **Both sides of every exchange move together, or neither does.** ✅ Verified across the ladder: a party keeping armor current takes **1→8** from a mob F1→F9, and two elites stay at **62%→58%** — flat, no inversion. ⚠️ **And it makes the other problem permanent**, which the book now owns in §12.7: a current-armour party is **immune to ordinary mob damage on every floor**, so **a mob's threat cannot be its damage** | `§12.6`, `§12.7` |
| **4e** | ✅ **WHAT A MOB IS FOR — ALL THREE RULED AND IN THE BOOK 2026-09-14.** Owner: *"all three, put it in the book."* Rulebook → **v1.5**. ⭐ **They were never alternatives; they are one rule with one counterplay each.** **`§21.8 THE PRESS` (①+②)** — *mobs that can reach the same target may combine into one attack; their Force adds and resistance and any universal apply **ONCE** to the merged total* — **only while a directing elite is in the fight** (alive, able to perceive the target, not Shocked or Forced; it directs what it can **see**, and the tightening dial if that runs hot is a mob **count** instead). 🔴 **§5.7 ALREADY WROTE THE MECHANIC** — *"Combined attacks merge damage and count as ONE hit… the party's designed path to single-hit numbers no individual can reach"* — and §5.7 now says out loud that it was **never contestants-only.** ⭐ **Three details of the press were already in §5.7 and needed no authoring:** *every linked actor pays its own cost* (so the press **CONCENTRATES, it does not multiply** — everyone not being pressed is untouched that Moment), *counts as ONE hit* (which is what makes it beat a §10.1 universal), and *failure degrades, never vetoes* (a mob out of reach attacks alone). **The curve is identical on every floor** because §7.3 calibrated both sides together: **1 chaff · 2 hurts · 3 DESTROYS A TORSO** (F1 1/5/9 vs 7 · F5 2/11/20 vs 17 · F9 8/27/46 vs 35). ⭐ **So a mob is a POSITIONING threat**, and every counter already existed: don't be surrounded (reach is the cap) · **a corridor two abreast caps the press at two** (§21.4 — *the width that made a room easier to author is what makes it safer to stand in*) · **area does not divide** (§7.3, and a press is by definition bunched) · kill the director · §4's bulwark retarget. ⚙️ **It also finally justifies an elite standing in a room full of mobs** — *it is not sharing a room with them, it is the reason they are dangerous* — and it **fills S-4's 28%→83% hole without a second elite.** **`§12.6` (③)** — a part's resistance drops by the **HIGHEST** flat-resist condition tier on it (a Crushed T2 torso resists 2 less there, every type). ⚖ **Highest, NOT the sum, and the asymmetry with §21.6 Body is deliberate and stated:** a bleeding arm and a crushed arm each impair a swing independently, but **a breastplate is one object and only breaks once.** ⭐ **Zero tracking** — it recovers when the condition clears, so §21.6's *healing is a damage buff* becomes *healing is a defence buff on the same action*, and §21.6 now carries the mirror. ⚠️ **Author's warning in the book:** the press kills a cornered contestant fast — that is the point **and** the failure mode, so **announce the gathering**, because the terrain is the party's answer and they cannot reach for it if the Moment is a surprise. ⚙️ `encounter-bands.js` prints the press table per floor and its `--floor` mode no longer dumps the whole-ladder summaries | `§21.8`, `§12.6`, `§5.7`, `§21.6`, `enemy-scaling.md` S-6 |
| ~~**5**~~ | ✅ **DONE 2026-09-14 — ALL 53 MIGRATED, F1 included.** F2 16/16 · F3 18/18 · F1's last three filled in. ⭐ **Not one number was invented** — every signature was already written in its own entry's prose and every one sits exactly on its floor's band (F2 mob 5 · elite 8 · boss 10; F3 mob 6 · elite 9 · boss 12 · super 19). **Five entries declare `presence`** rather than being silently skipped: Glass-Antler Doe (bait), Camera Gnat (it films — the cost is Exposure), Crystal Spore Mist (it TEMPTS), Crystal Cluster (terrain until touched) and Vermilia. ⚙️ Two above-band second attacks recorded as notes on the on-band signature, the F1 Rack pattern: the **Sky-Iron Revenant's** 12-Crush magnetic haul and the **Dragon's** 30-Crush collapse. ⭐ **Nullrot's 19 carries the real note** — *"he does not retaliate, the reservoir does"* — and **The Reservoir's 19 is THE THROAT**, not a strike. **The damage gate is now effectively mandatory**: a test asserts all 53 carry one, written for their own floor | `server/seeds/enemies-f2.js`, `-f3.js` |
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
