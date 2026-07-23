# Skill Passover — the sitting worksheet

**Date:** 2026-07-23 · **Status:** PART 1 RULED (see block below); G3 + G6 in progress

## RULINGS (owner, 2026-07-23, in chat)

- **G1 RULED — owner's own model (supersedes both proposals): Tactical Roll is a
  declared-hex dodge.** You give up your movement for the Moment and declare the hex
  you roll to; the attack still resolves — if your hex is inside its range/area you get
  hit anyway. No charges, no stance, no cooldown. Acrobatic Save gets the same
  movement-forfeit cost in place of its cooldown.
- **G2 APPROVED** — one growth schema; ladders authored for the zero-growth skills.
- **G3 REJECTED as proposed** — broad families are wrong (not all BLADES merge; ranged ≠
  melee; ELEMENTS is a subclass of magic; RACE never merges). Follow-up model being
  picked (hierarchical keywords vs explicit lists vs GM-only).
- **G4 RULED — stats are FROZEN for this campaign run.** No stat/scaling changes to any
  existing skill (Voicebox stays Charm; Telepathy keeps Charm secondary). Revisit for
  the next campaign.
- **G5 APPROVED** — XQUEZ/T skill definitions concretized.
- **G6 — new skills reviewed ONE BY ONE** (in progress in chat).
- **G7 RULED — NO exclusive skills.** Full Potential / Heroic Punch are gated by weird
  ACQUISITION requirements, not locks. No `exclusiveTo` field. (Anyone could earn them.)
- **G8 APPROVED** — the repair batch.

**Applied by:** `server/apply-skill-passover.js` (dry-run default; 25 template patches).
**Scope:** all 44 skill templates (the TABLE canon — the live campaign's skill library).
Answer by number in chat ("G1: B, G4: approved, #9: change to…") or edit this file.
Everything here builds on the full per-skill audit (game repo,
`docs/audits/skills-audit.md`) filtered for the table: **game-only rulings do NOT apply
here** — XQUEZ/T's robot skills stay, no skill is an "orphan" at your table.

**What happens after you answer:** I apply the approved changes to the skill templates
via a dry-run-first script (like the tag seeder), add the new template fields
(`prime`, `family`, `exclusiveTo`) with UI chips on the skill cards, and record the
rulings in the book's changelog.

---

## Part 1 — Global calls

### G1 — The two cooldown skills: which prime model?

Tactical Roll and Acrobatic Save still say "Cooldown: 1 Clock" (the last cooldown text
in the game). Your 2026-07-20 ruling made them **stance-gated**; the skills audit later
proposed charge-primes. Pick the model:

- **A (as ruled): one shared "Light-Footed Stance."** Declare it like Dance (start of a
  Moment; ends if you're hit while flat-footed, knocked Prone, or declare a heavy/2+
  Moment action). While in it: Tactical Roll and Acrobatic Save are usable, each **once
  per Clock**. Their old cooldown-reduction levels become: Roll = more spaces + a second
  use per Clock at L6; Save = bigger die manipulation.
- **B (audit variant): two charge primes.** *Light Feet* — Tactical Roll gains a charge
  (max 1) whenever you take a free move; *Poise* — Acrobatic Save primes whenever you
  perform an acrobatic maneuver (jump / climb / balance / free move through difficult
  terrain), consumed on use. Movement literally feeds your defenses; kiting stays costly.

Recommendation: **B** plays better (it rewards doing parkour on camera and needs no new
stance bookkeeping), but A is what was ruled — your call.

### G2 — One growth schema (approve?)

Every skill gets exactly: **L2–4** numeric scaling lines · **L5–L6** threshold rows
(named, no placeholders) · one **"6–10 arc"** sentence (the R19 generalization
direction, authored per skill in Part 2; L7–10 get written when someone actually raises
the cap). All inline "Level 6+:" prose inside effect text is deleted (single source of
truth). The three zero-growth skills (Strong Strike, Telepathy, Thousand Cuts) get full
ladders; Vibe Control gets its missing L6.

### G3 — Compatibility families (the Gemstone marking you asked for)

Every skill carries 1–2 **family** tags. **Gemstone rule: skills sharing a family are
compatible** for merge/upgrade/mutation; cross-family needs GM approval with a fiction
reason. The nine families:

| Family | Meaning |
|---|---|
| BLADES | weapon & unarmed strikes, finishers |
| FOOTWORK | movement, evasion, acrobatics |
| ELEMENTS | elemental projection & zones |
| MIND | psychic, intel, mental links |
| STAGECRAFT | presence, performance, deception, the camera |
| SHADOW | stealth, infiltration, locks |
| FIELDCRAFT | survival, treatment, bracing, utility |
| CONTROL | grapples, pins, forced movement |
| RACE | body-specific animal/machine gifts |

### G4 — The Charm sweep (R18: Charm = presentability, not charisma)

- **Voicebox: primary stat Charm → Mind** (mimicry is technique, not photogenics).
  ⚠ This changes what points fund it — existing spends refund cleanly via the spend
  records. Its "+1 Strength" ladder becomes **fidelity tiers**: each level beats
  listeners of +1 higher Mind; L6 "fools machinery" stays.
- **Telepathy: drop the Charm secondary** (pure Mind) as part of its rebuild (#18).
- **Vibe Control: keep the mechanics, change the fiction** — FEAR = "too striking to
  approach" (they back away), CHARM = "can't look away" (fixation; Exposed-from-behind
  stays). "+1 resist penetration" defined as: counts as +1 effect tier vs mental
  resistance. L6 (new): project at two targets, or one target ignoring resistance.
- **Feint keeps Charm** (selling the image IS presentability).

### G5 — XQUEZ/T's robot skills stay table-canon (confirm)

`Generate Visual Media` and `Ignore All Previous Commands` were cut *from the video
game* (no robots there). At your table XQUEZ/T exists, so they stay — with two small
definitions needed:
- Generate Visual Media: "GM discretion" effects become concrete: distract = inflict
  Forced Action – Tool · intimidate = Shock T1 vs Mobs · hype play = viewer spike.
- Ignore All Previous Commands: define **"Command Complication"** — proposal: each level
  lets the commander attach one extra rider to the obeyed command ("…and move 1 space
  first"). The heard-phrase trigger already is a textbook prime; unchanged.

### G6 — New skills: which batch gets seeded?

The catalog over-serves strikers and starves tanks, support, and (ironically) the
broadcast layer. Proposals, in recommended priority:

- **Tank kit (your own drafts, finalize now — this closes NQ6):**
  **Intercept** — 0-Moment reaction, take an adjacent ally's hit; prime: declared guard
  stance on that ally this Clock; Physique.
  **Iron Stance** — while you don't move, attacks on adjacent allies retarget to you;
  prime: didn't move since your last Moment; Physique 5.
- **High-value picks (recommend seeding):** **Death Grip Jaws** (bite-grapple, no hands
  needed — animals literally cannot grapple without it; RACE family) · **Field Triage**
  (treat an adjacent ally's condition, 1 Moment, consumes a bandage/kit charge;
  FIELDCRAFT) · **Play to the Camera** (spend a Camera Call stack → party-wide hype
  surge; STAGECRAFT).
- **The rest of the audit's list** (Shield Wall, Taunting Flex, Unbreakable, Body Check,
  Pin Down, Blinding Toss, Trip Line, Kill the Lights, Set the Stage, Human Ladder,
  Adrenaline Shout, Painkiller Slap, Wall Run, Dive Through, Grapnel Improviso, Villain
  Monologue, Signature Move, Commercial Break, Crowd Work, Sixth Sense) — park, or name
  the ones you want now.

### G7 — Character-exclusive skills (confirm + implement)

**Full Potential** and **Heroic Punch** are Mario's alone. I add an `exclusiveTo` field
to skill templates + a guard on granting (admin sees a warning granting an exclusive to
anyone else). Confirm, and name any other exclusives.

### G8 — The mechanical text-fix batch (approve wholesale)

No taste calls, just repairs — full detail per row in Part 2: Seal The Wound L6 drops
"Crush" (structural damage isn't a treatable condition) · Frost Wall 6-vs-5 spaces
contradiction + the "destroys deals" typo · Fire Ball "part facing the blast" → "one
exposed part (torso if none)" (the table has no facing rules either) · Execution L6
circular wording · Acrobatics duplicate L6 text deleted · Telekinesis two competing L6s
reconciled (inline "move while sustaining" becomes L7) · Heroic Punch two competing L6s
(keep "3 Bleed"; "Martial Arts category" parked until a martial-arts tag exists) ·
Slice n' Dice damage math rewritten unambiguously + "both hands" reads as forepaws for
quadrupeds · Nightlurking "cat-sized" → "Small or smaller" and L6 "5 km" → "the current
district" · Juggling 5-vs-2 range reconciled (5) and enemy-disarm gated to unwielded/
dropped items with wielded-disarm as the L7 payoff · Camouflage typos · Pressure Hold
aligned to the book's grapple chapter (1 Moment, one hand; both hands only for
suffocation; L6 wording "may begin grapple-suffocation — boss immunity applies") ·
Slip Through "Elite or Boss scale" → "at least one size larger" · Thousand Cuts range
"Near" → 1 space · Quick Step "+N Duration" unit = Moments the effect persists ·
Counter-Surge L5 "reduce by 5" flagged as tuning-pass number.

---

## Part 2 — Per-skill sheet (44 rows)

Columns: **prime** (beyond stat/equipment requirements; "—" = none needed, its cost IS
the price) · **family** · **6–10 arc** (the R19 generalization direction) · **fix**.

| # | Skill | Prime | Family | 6–10 arc | Fix |
|---|---|---|---|---|---|
| 1 | Controlled Sweep | STATE: 2+ enemies adjacent (as written) | BLADES | sweeps grow from mobs → anything sweepable: elites, thrown objects, projectiles out of the air | — |
| 2 | Quick Step | — | FOOTWORK | ignoring terrain → ignoring geometry: steps through occupied hexes, then brief wall-runs | duration unit (G8) |
| 3 | Seal The Wound | STATE: condition active (as written) | FIELDCRAFT | delaying → resolving → at range ("talk them through it") → mass triage | L6 drops Crush (G8) |
| 4 | Strong Strike | — (2-cost windup is the prime) | BLADES | raw force → structure-breaking: ignores armor tiers, breaches surface immunity, staggers Sizes above yours | author full ladder (L2–4: +1/+2/+3 dmg; L5: windup can't be interrupted by Shock T1; L6: excess damage carries into the part behind) |
| 5 | Counter-Surge | STATE: adjacent enemy mid-windup (as written) | BLADES+MIND | countering windups → countering instants → countering reactions themselves | L5 number = tuning pass (G8) |
| 6 | Read The Pattern | — | MIND | reading one enemy → reading formations: reorganization beats, boss phase tells, Directive hidden clauses | — |
| 7 | Pressure Hold | STATE: adjacent (R9 gates) | CONTROL | holding → moving the hold → holds that suffocate → holding two smaller targets | align to grapple chapter (G8) |
| 8 | Brace | — (0-cost, free-slot economy caps it) | FIELDCRAFT | self-brace → bracing allies behind you → bracing against conditions, not just damage | — |
| 9 | Tactical Roll | **G1 choice** | FOOTWORK | rolling from attacks → rolling from areas/explosions → rolling THROUGH enemies | cooldown text purge |
| 10 | Poison Ball | — | ELEMENTS | more toxin types → delivery generalizes: contact clouds, coated allies' weapons, delayed-burst orbs | — |
| 11 | Poison Wall | skill-prereq (Poison Ball 3) | ELEMENTS | walls → shapes: rings, domes, creeping fog that follows you | poison-type list typo (missing paren) |
| 12 | Frost Ball | — | ELEMENTS | chill → true cold: pins, freezes liquids, shatters frozen parts for Crush | "2 Chill Damage" → flat damage + Chilled T1 (book: Chilled deals no HP damage — the DAMAGE is the impact, type Crush) |
| 13 | Frost Wall | skill-prereq | ELEMENTS | walls → architecture: bridges, ramps, sealed doorways, collapsing ice onto enemies | 5-vs-6 + typo (G8) |
| 14 | Fire Ball | — | ELEMENTS | bigger burns → the fire behaves: clusters, curves around cover, ignites shaped trails | facing fix (G8) |
| 15 | Fire Wall | skill-prereq | ELEMENTS | walls → moving fire: advancing lines, rotating rings, a wall that walks with you | L6 "tier 2 Shock" → Shock T2 (vocabulary) |
| 16 | Elemental Confluence | PREP/CONSUME: unlock consumes the three L5 balls (Gemstone-native — keep) | ELEMENTS | the zone learns new modes: mixed effects, mobile zone, zone centered on YOU | — |
| 17 | Telekinesis | — (sustain cost is the price) | MIND+CONTROL | moving creatures → moving the fight: intercepting projectiles, wielding items at range, two grips at once | reconcile L6s: threshold L6 = "no longer Exposed"; inline "move 1 space while sustaining" becomes the L7 row |
| 18 | Telepathy | — | MIND | **rebuild (G4):** pure Mind; the party's silent-comms + intel link. Ladder: L2 two-way link · L3 second linked ally · L4 read current intent (not just emotion) · L5 whole-party mesh · L6 brief sensory sharing (see through the linked ally). 6–10 arc: links become a network — relay chains, linking through walls, enemy minds as unwilling relays | author full ladder |
| 19 | Mind Burst | skill-prereq (Telepathy 3) | MIND | single-target shock → crowd psychics: multi-target, lingering static fields, bursts that travel the telepathy network | — |
| 20 | Pounce | CHAIN opener (formalize) | BLADES+FOOTWORK | leaps get bigger and land harder → pouncing off walls, pouncing targets out of the air | — |
| 21 | Slip Through | CHAIN: after Pounce (as written) | FOOTWORK+SHADOW | slipping through legs → slipping through anything: grapples, closing doors, between two enemies at once | size wording (G8); author ladder (L2–4 +1 Bleed per leg / +1 space repositioning; L5 also usable after any successful dodge; L6 target is Exposed until end of NEXT Moment) |
| 22 | Decapitate | CHAIN: after Slip Through (as written) | BLADES | the finisher generalizes its openings: usable after ANY behind+Exposed setup, not just its own chain | — |
| 23 | Overhead Slam | CHAIN opener | BLADES | slams shape the ground: craters, difficult terrain, embedding targets | — |
| 24 | Shockwave | CHAIN: after Overhead Slam | BLADES+CONTROL | cone → circle → directed waves that travel along walls | — |
| 25 | Execution | CHAIN: after Shockwave; STATE: target Prone/Helpless | BLADES | executions get cinematic: chained executions on adjacent downed targets, crowd-hype multipliers | L6 wording (G8) |
| 26 | Feint | CHAIN opener | STAGECRAFT+FOOTWORK | feinting one enemy → feinting the room: group feints, feinting reactions out of enemies early | — |
| 27 | Pressure Strike | CHAIN: after Feint | BLADES | pressure compounds: consecutive strikes inherit the previous hit's Forced-Action riders | — |
| 28 | Thousand Cuts | CHAIN: after Pressure Strike | BLADES | author ladder (L2–4: +1 part / +1 Bleed on one chosen part; L5: 4 parts; L6: every part hit that already bled advances +1 tier). Arc: the flurry stops respecting anatomy — cuts across multiple adjacent enemies | range → 1 space (G8) |
| 29 | Aura Reading | — (passive) | MIND | emotions → intentions → the room: reading group morale, detecting the one who's about to break | — |
| 30 | Swim | — (passive) | RACE+FIELDCRAFT | water stops being terrain: currents as movement bonuses, dragging enemies under | — |
| 31 | Vibe Control | — | STAGECRAFT | G4 rework. Arc: projecting at one target → projecting at the audience itself: crowd mood as a weapon | ladder cleanup + L6 (G4) |
| 32 | Juggling | — | STAGECRAFT+FIELDCRAFT | items in flight become a resource: juggling weapons mid-fight, catching thrown attacks (L6), disarming wielded items (L7) | range reconcile + disarm gate (G8) |
| 33 | Dance | STANCE (it already is one — formalize) | STAGECRAFT+FOOTWORK | the dance spreads: party choreography, dancing THROUGH attacks, the crowd dancing along | — |
| 34 | Voicebox | — | STAGECRAFT+RACE | G4 stat move. Arc: voices → soundscapes: crowds, machinery, the arena itself | fidelity ladder (G4) |
| 35 | Generate Visual Media | per-session gate (legal, not a cooldown) | STAGECRAFT+RACE | projections get interactive: fake walls, decoy contestants, replay-review challenges | concrete effects (G5) |
| 36 | Ignore All Previous Commands | external verbal trigger (already a prime — keep) | RACE+MIND | the exploit becomes a feature: pre-loaded commands, ally-scripted macros, turning enemy orders against their speaker | define Command Complication (G5) |
| 37 | Acrobatic Save | **G1 choice** | FOOTWORK | saving your rolls → saving allies' rolls → saving anyone's roll you can see | cooldown text purge |
| 38 | Full Potential | Lounge/materials (crafting context is the gate) | MIND+FIELDCRAFT | crafting tiers climb: Crude→Basic→Quality already texted; arc continues up the item-tier ladder | `exclusiveTo: Mario` (G7) |
| 39 | Heroic Punch | — | BLADES | punches become statements: POW graphics affect enemy morale, hype-fed damage | reconcile L6 (G8); `exclusiveTo: Mario` (G7) |
| 40 | Nightlurking | — (passive) | SHADOW+RACE | escape routes → the whole map: hidden paths, enemy patrol sense, the district layout (L6) | size + 5km fixes (G8) |
| 41 | Lockpicking | — (tool required) | SHADOW | locks → systems: traps, mechanisms, magical seals (as texted) | — |
| 42 | Acrobatics | — (passive) | FOOTWORK | requirement discounts grow → vertical terrain stops existing for you | dedupe L6 (G8) |
| 43 | Slice n' Dice | — | BLADES+RACE | more limbs, more cuts: whirling multi-target versions, bleed-stack payoffs | math rewrite + forepaws (G8) |
| 44 | Camouflage | — | SHADOW+RACE | hiding yourself → hiding others → hiding in plain sight while moving | typos (G8) |

---

*After your answers: template-update script (dry-run first), `prime`/`family`/
`exclusiveTo` fields + skill-card chips, new-skill seeds per G6, book changelog entry.*
