# Item Drafting — Batch B: the standing catalog (PROPOSAL)

**Date:** 2026-08-04 · **Status:** 🟡 PROPOSED — trim, rename, re-stat anything; ⚖
on every number. Companion to `item-drafting-passover.md` (ID-4). Scope: the
standing Silver/Gold pools — base weapons for every §12.1 class, armor per slot
family, tools, limited-magic items, Gold game-changers, the first **skill-tome
set** (ID-0.18), and the kits threaded through the pools. Seed data mirrors this
doc at `server/seeds/items-batch-b.js`; **any trims here get synced there before
apply**.

Conventions: Quality = baseline-plus or a quirk (§12.3 stands for slots/access);
armor flat resists use **Bleed/Crush/Burn only** (§10 — afflictions are tiered,
that's nullification territory, Superior+); limited-magic items **cast** a named
skill without teaching it; tomes **teach** — consumed in downtime, the named
skill becomes acquirable at L0 per §4.4 (the tome is the external source), GM
grants it via the skill library. New subtype: **Tome**.

Avoids duplicating the live library (Short Sword, Kunai, Metal Gauntlets, Metal
Claw Coverings and the Batch A gear stay the low-end coverage).

---

## B-1 — Base weapons (~16) ⚖ · Silver pool (Quality also Gold)

| Item | Tier | Class/Subtype | Stats (⚖) |
|---|---|---|---|
| Dagger | Basic | Light Small / Bladed | 2 Bleed · r1 · 1 Phy, Cost 1 |
| Boning Knife | Basic | Light Small / Bladed | 2 Bleed · r1 · 1 Phy, Cost 1 |
| Stiletto | Quality | Light Small / Bladed | 2 Bleed · +1 Bleed vs Exposed targets |
| Spear | Basic | Light Large / Bladed | 2 Bleed · r2 line · 3 Phy, 2 hands |
| Rapier | Quality | Light Large / Bladed | 2 Bleed · r2 line · first hit each Clock +1 Bleed |
| Hammer | Basic | Heavy Small / Crush | 2 Crush · r1 · 2 Phy |
| Pipe Wrench | Quality | Heavy Small / Crush | 2 Crush · doubles as proper tools (no improvised penalty) |
| Hand Axe | Quality | Heavy Small / Bladed | 2 Bleed/Crush · double damage to objects & terrain |
| Maul | Basic | Heavy Large / Crush | 3 Crush · r2 arc · 5 Phy, 2 hands, Cost 2 |
| Greatsword | Quality | Heavy Large / Bladed | 3 Bleed/Crush · r2 line/arc · on kill, adjacent enemy takes 1 Bleed |
| Autocrossbow | Basic | Light Ranged | 1 Bleed/rd · RPM 2 · mag 6 · r5 · 2 Ref |
| Machine Pistol | Quality | Light Ranged | 1 Bleed/rd · RPM 3 · mag 6 · r6 |
| Shotgun | Basic | Heavy Ranged | 4 Crush cone · RPM 1 · mag 2 · 4 Ref, 2 hands |
| Rifle | Quality | Heavy Ranged | 4 Bleed/rd · RPM 1 · mag 2 · line pierces 2 targets |
| Grappler's Wraps | Quality | Martial | 2 Crush · +1 effective Physique for grapple initiation |
| Throwing Irons | Basic | Thrown | 2 Bleed thrown · qty 3 |

## B-2 — Armor & shields (~11) ⚖ · Silver pool (Quality also Gold)

| Item | Tier | Slot / Subtype | Resist (⚖) |
|---|---|---|---|
| Fire Helmet | Basic | Head / Armor | Burn 1 |
| Insulated Coat | Basic | Torso / Armor | Burn 1 |
| Flak Sleeves | Basic | Arms / Armor | Bleed 1 |
| Grip Boots | Basic | Feet / Armor | Crush 1 |
| Sturdy Belt | Basic | Accessory / Armor | Crush 1 |
| Riot Vest | Quality | Torso / Armor | Crush 2 |
| Duelist's Coat | Quality | Torso / Armor | Bleed 2 |
| Fireproof Boots | Quality | Feet / Armor | Burn 2 |
| Pauldrons | Quality | Arms / Armor | Bleed 1 + Crush 1 |
| Combat Visor | Quality | Head / Armor | Bleed 1 + Crush 1 |
| Tower Shield | Quality | Shield | Crush 2 · occupies a hand |

## B-3 — Tools (~8) ⚖ · Silver pool

| Item | Tier | Effect (⚖) |
|---|---|---|
| Lockpick Set | Basic | Proper tools for locks (pairs with the Lockpicking skill) |
| Climber's Kit | Basic | Rope, harness, chocks — no improvised penalty on climbs |
| Spotter's Scope | Basic | Far detail; helps called shots & recon (GM adjudicated) |
| Signal Kit | Basic | Mirror, whistle, flags — party signaling at range |
| Trap Kit | Quality | Set/disarm simple traps; removes Forced Action – Tool on trapwork |
| Directional Mic | Quality | Eavesdrop conversations at range |
| Disguise Kit | Quality | Disguise work (pairs with Camouflage); fools mobs, strains vs elites |
| Field Tool Roll | Quality | Counts as proper tools for any mechanical job |

## B-4 — Limited-magic items (~6) ⚖ · the Silver 1-in-10 slot (also Gold filler)

Each casts one named skill without teaching it (recharge at the Lounge, 1 UT ⚖).

| Item | Tier | Casts | Uses (⚖) |
|---|---|---|---|
| Ember Orb | Quality | Fire Ball | 3 |
| Frost Lens | Quality | Frost Ball | 3 |
| Poison Sprayer | Quality | Poison Ball | 2 |
| Whisper Locket | Quality | Telepathy (one-way message) | 3 |
| Telekinetic Glove | Quality | Telekinesis (minor) | 2 |
| Echo Box | Quality | Voicebox (voice mimicry) | 3 |

## B-5 — Gold game-changers (~8) ⚖ · Gold pool

| Item | Tier | Effect (⚖) |
|---|---|---|
| Grapnel Rig | Superior | Tool — fire-and-reel repositioning; counts as steady ground while anchored |
| Deployable Cover | Superior | 1 Moment: half-cover panel, 2 spaces wide (§15 cover) |
| Personal Camera Drone | Quality | Your own camera: +1 Exposure gain while deployed; fragile (1 HP) |
| Exo-Brace Harness | Superior | Accessory — +1 effective Physique for requirements only |
| Adaptive Visor | Superior | Head — Bleed 1 + Crush 1 + Burn 1 |
| Chainblade | Superior | Heavy Small / Bladed — 3 Bleed |
| Modular Longarm | Superior | Ranged — swaps profiles: light (1 Bleed/rd, RPM 2) / heavy (4 Bleed/rd, RPM 1) · mag 4 |
| Aegis Projector | Superior | Accessory — once per Clock, negate one incoming ranged round |

## B-6 — Skill tomes (~6) ⚖ · Gold pool (the §17.6 "skill tome" slot)

Consume in downtime → the named skill becomes acquirable/revealed at **L0**
(§4.4 — the tome is the external source). All six anchor to skills that already
exist in the skill library; the GM grants via the skills flow when consumed.

| Tome | Teaches | Kind |
|---|---|---|
| Skill Tome: Fireballs for Beginners | Fire Ball | magic |
| Skill Tome: The Frost Ball Primer | Frost Ball | magic |
| Skill Tome: Mind Over Matter | Telekinesis | magic |
| Skill Tome: Lockpicking for Dummies | Lockpicking | literal |
| Skill Tome: Stop the Bleeding | Seal The Wound | literal |
| Skill Tome: Bracing for Impact | Brace | literal |

## B-7 — Kits threaded through the pools (2) ⚖

| Item | Tier | Effect | Pool |
|---|---|---|---|
| Quality Weapon Creation Kit | Quality | Redeem: any Quality base weapon + 1 prefix + 1 suffix of choice (≤Normal) | Silver, Gold |
| Normal Polish Kit | Basic* | Downtime at the Forge: d6 — 1-2 fail (kit consumed), 3-6 success (+1 tier); rungs up to →Superior | Gold |

*\*The kit's own item-tier is bookkeeping; its GRADE (Normal) is what gates odds
and rungs (ID-3). Superior kits stay Batch C — never sold, Legendary+ only.*

---

*57 templates total. Trim or bless; on bless the seed syncs any changes and ships
via `node seed-items.js --file ./seeds/items-batch-b.js` (backup first, dry run,
then --apply). Batch C next: Legendary named list, Mythic artifacts (3+ for the
first pick-one-of-three), Godly guidance, Superior kits, two-layer growth items.*
