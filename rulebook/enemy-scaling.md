# Enemy Scaling — damage per floor, and hordes across floors (PROPOSAL)

**Date:** 2026-08-18 · **Updated 2026-09-01 for Force** · **Status:** 🟡 PROPOSAL —
the doctrine it rests on is ruled; these numbers are not. Governing canon:
**§7.3 Force**, **§21.2** (ranks and the horde doctrine), and `level-budget.md`
**L-15** (old enemies become hordes), **L-19** (the level curve) and **L-23**
(the band adds).

> **⚡ Everything here is in FORCE (§7.3), not band units.** One Force is one basic
> punch, and a material band step is **+1 Force**. The 2026-08-18 errata that had
> the band *multiplying* both sides and cancelling inside a floor is **withdrawn**
> (L-23) — it made every floor arithmetically identical and produced fractions on
> any weapon carried across a floor.
>
> **The damage ladder in S-1 is UNCHANGED by that**, because it never used the
> band: it derives enemy damage from the contestant's growing body (total trait
> points → part HP), which is linear and survives untouched. **Only S-2's horde
> counts moved**, and they moved a long way down.

**The numbers below are generated, not hand-written.** Regenerate with
`node server/floor-bands.js` rather than editing them in place.

---

## S-1 — The ladder

| Floor | Level | Trait points | **Torso** | mob | elite | boss | super |
|---|---|---|---|---|---|---|---|
| **F1** | 16 | 24 | **7** | 4 | 6 | 8 | 12 |
| **F2** | 26 | 34 | **9** | 5 | 8 | 10 | 15 |
| **F3** | 36 | 44 | **11** | 6 | 9 | 12 | 19 |
| **F4** | 52 | 60 | **14** | 8 | 12 | 15 | 24 |
| **F5** | 68 | 76 | **17** | 9 | 14 | 19 | 29 |
| **F6** | 84 | 92 | **20** | 11 | 17 | 22 | 34 |
| **F7** | 108 | 116 | **25** | 14 | 21 | 28 | 43 |
| **F8** | 132 | 140 | **30** | 17 | 26 | 33 | 51 |
| **F9** | 156 | 164 | **35** | 19 | 30 | 39 | 60 |

The four right-hand columns are the **signature hit** for each rank — the blow the
creature is *known* for, not its every swing.

**Enemy HP does not appear here because it does not change.** §21.2's mob 5 /
elite ~60 / boss ~125 / super ~300 are band units and hold on every floor
(elites and above carry a ±tolerance band — only mobs are exact).

### Why these fractions ⚖

| Rank | Signature hit | Reads as |
|---|---|---|
| **Mob** | **≈ 0.55 × torso** | two hits destroy a torso — a horde is genuinely lethal if ignored |
| **Elite** | **≈ 0.85 × torso** | one hit nearly ends a part; you cannot trade with it |
| **Boss** | **≈ 1.1 × torso** | its signature blow *does* end a torso. That is why it is a boss |
| **Super** | **≈ 1.7 × torso** | overkill, and meant to read as such before anyone commits |

The ratio is constant by construction, so **combat feels the same on every floor**
and only the fiction inflates — which is the §12.7 errata working as intended.

### Four legitimate reasons to leave the band

1. **Telegraphed windups hit harder.** A 1-Clock windup that leaves the attacker
   Exposed (§5.3) may run well above its rank's number — the Step-Warden's stomp is
   **10** against an F1 elite band of 6, and that is correct: the party is being paid
   in a punish window.
2. **Per-Moment ticks hit softer.** Damage applied every Moment of contact sits
   below the band — the Husk-Moth Cloud's **2** Chill against a mob band of 4.
3. 🆕 **`aura` — the strike is not where the threat is.** The entry reads below band
   (floored at **0.5×**, so "aura" can never excuse a token number) because its real
   threat is a condition or a countdown. THE MASKED's backhand is **6** against an
   F1 boss band of 8; his fight is the Dissolution clock, not the punch.
4. 🆕 **`presence` — no attack at all.** Damage must be **0** and the note must say
   what the threat is instead. ⭐ This is the one exception the gate treats as a
   **positive claim** rather than a tolerance, because without it a 140-budget boss
   authored with no attack passes silently. Vermilia never swings.

**Anything else outside the band is a bug.** The whole F1 roster is checked against
this table by `seed-enemies.js` and sits inside it, with exactly those four
exceptions — 16 of 19 F1 entries carry a signature; the three that carry none
(Glass-Antler Doe, Camera Gnat, Crystal Spore Mist) deal no direct damage.

---

## S-2 — Hordes: reusing old enemies (L-15)

**Nothing is ever rescaled.** A Bramblewretch is **5 Force** forever. What changes
is how many of them the floor sends.

> ⚡ **REWRITTEN 2026-09-01 — the counts came down hard, and that is correct.**
> The old table below ran to **3,000** at F9 because it rode the withdrawn ×2 band.
> Under Force a contestant gains about **+1 Force per floor**, so raw kills-per-swing
> grows *linearly* — an F9 contestant at 13 Force kills **two** 5-Force mobs a swing,
> not nine hundred.
>
> ⭐ **What clears a tide now is AREA, not a bigger number** (§7.3 — area does not
> divide, so a sweep lands its full Force on every target in the space). The count
> is `floor(your Force ÷ the old mob's Force) × spaces swept × ~20 swings a Clock`.

| An F1 mob (5 Force), met at | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9 |
|---|---|---|---|---|---|---|---|---|
| **Tide size** ⚖ | 100 | 100 | 100 | 100 | 250 | 250 | 250 | **250** |
| ~~old (×2 band)~~ | ~~25~~ | ~~50~~ | ~~95~~ | ~~200~~ | ~~400~~ | ~~750~~ | ~~1 500~~ | ~~3 000~~ |

> **The rule now:** kills per swing = `floor(your Force ÷ the old mob's Force)`,
> multiplied by the spaces a sweep covers, multiplied by roughly 20 swings a Clock.
> The steps in the table are where the integer division ticks over.

⚠️ **This is a real change in feel and it needs an owner eye.** A tide of 250 is
still a tide, and it is one a GM can actually run; a tide of 3,000 never was. But
the *number* on the page is much smaller, and if the fantasy you wanted was the
four-digit figure, say so — the fix would be to raise the spaces-swept assumption
or the per-Clock swing rate in `floor-bands.js`, not to bring back the multiplier.

Sized so a tide is roughly **one Clock of slaughter** for a four-contestant party
(≈20 attacks in a 10-Moment Clock). Halve it for a beat rather than a set-piece;
double it for a wall.

### Running a tide at the table

**A horde is ONE entity with a count, not N entities.** Statting three thousand
Bramblewretches is not a thing anyone should do.

- The tide has a **count** and the mob's own HP (5 band units of its floor).
- An attack removes `floor(damage ÷ mob HP)` from the count.
- **An area attack multiplies by the spaces it covers.** This is where cones, lines
  and the ammo economy of §21.2 finally pay off — a level-10 area skill is worth
  hundreds of kills a Moment, which is exactly the power fantasy L-15 asked for.
- The tide's damage output is the mob's signature hit **× the number in contact**,
  which the GM caps by geometry. Three thousand of them still only reach you a
  dozen at a time.
- **Gates still apply.** A tide of Crystallized Citizens is still Crush-only; a tide
  of Husk-Moth Cloud is still immune to single-target damage. Reuse does not launder
  a mob's gate away — and at scale a gate is what turns a slaughter back into a
  problem.

### What this is *for*

Two things, and neither is filler:

1. **Every floor's roster becomes a permanent asset.** F1's 19 entries stay in play
   for the whole campaign, so F2–F9 need horde counts and encounter beats rather
   than new stat blocks.
2. **It is where the power fantasy lives.** Cutting through four hundred things that
   nearly killed you on Floor 1 *reads* as growth in a way a bigger number never
   does — and here it is literally the same creature, unchanged, with the contestant
   the only thing that moved.

---

## S-3 — Authoring a new floor's roster

1. Read the floor's row from **S-1**. That is the torso you are threatening and the
   four damage numbers you are working around.
2. **Mobs are exactly 5**, one part, and die to one on-band hit. Give a survivor a
   **gate**, never a bigger number (§21.2, E-0.2/E-0.3).
3. **Elites and above should differ from each other** — the ±tolerance band exists
   so a regenerator can run lean and a lump of masonry can run fat. Pick the number
   from the design, then check it is inside the band.
4. Every non-mob names a **weak system**; every surviving mob names a **gate**.
5. Assign a **size** (§7.1) — it is read by §13's grapple rules.
6. Name a **carve material** on the floor's band for elites and above; mob rooms
   yield one gather roll (E-0.4).
7. Decide which **older mobs** return, and at what tide size (S-2).
8. Run `node seed-enemies.js --check --file ./seeds/enemies-fN.js` before writing
   anything to a database.

---

## S-4 — Encounter sizing ✅ **NEW 2026-09-14**

The frame is **§21.7**; this is the cross-floor note. `node server/encounter-bands.js`
generates every number here and in `f1-enemy-pass.md` E-8.

**Two dials: SIZE is how long, DANGER is how many can reach you.**

**Size never changes.** A mob is calibrated as one average swing (§7.3) and a
party of four gets ~20 attacks into a Clock, so **mobs cleared per Clock is 20 on
every floor of the campaign**. Room size is the Clock fraction you want it to
cost: **Brush 5 · Room 10 · Held room 20 · Tide 40+** (a Tide is run as one horde
with a count, S-2, never as forty entities).

**Danger is RESISTANCE, then geometry.** ⚠️ **Corrected from play 2026-09-14** —
the first version of this section left out the term that dominates both.

§10 resistance subtracts **flat** and §12.6 armor **stacks** across worn pieces on
the struck part. Against a mob's small number that is most or all of the hit;
against an elite's larger one it is a shrug. **Armor does not scale a threat
down — it sorts threats into "cannot touch you" and "can."**

> damage ≈ *(mobs that can reach you)* × *(signature − resistance)* × *⌈mobs ÷ party⌉*
> + *(elites × (signature − resistance) × the room's duration)*

**Mobs are cleared in parallel** — four contestants take one each, so twelve mobs
is three Moments. An elite's clock is its own HP plus that delay.

### The ladder, at resist 2 — and the step that matters is the second elite

| floor | 6 mobs | 1 elite | 1 elite + 4 mobs | **two elites** |
|---|---|---|---|---|
| F1 | 7% | 21% | 28% | **83%** |
| F3 | 8% | 20% | 27% | **79%** |
| F5 | 8% | 20% | 28% | **81%** |
| F7 | 9% | 21% | 29% | **83%** |
| F9 | 9% | 21% | 29% | **85%** |

⭐ **Mobs are nearly free and adding more barely moves the number. The escalation
lever is the second elite, and there is nothing in between.** Author the step you
actually want; do not try to reach it with numbers.

### The cliff

| resistance on the struck part | an F1 mob (4) gets through | 12 mobs cost |
|---|---|---|
| 0 | 4 | 41% |
| 2 | 2 | 21% |
| 3 | 1 | 10% |
| **4** | **0** | **0% — permanently** |

🔴 **A flat subtraction is a shrinking percentage.** Resist 3 is **75%** mitigation
against an F1 mob and **16%** against an F9 one. So either armor keeps climbing
with the party, or mobs quietly stop being a horde and start being a threat again
around the middle of the campaign.

✅ **CLOSED 2026-09-14 — RULED: armor rides the band, +1 resistance per band step.**
The recommendation below was taken verbatim and written into **§12.7** (with the
reasoning) and **§12.6** (the operative sentence, where a GM looks): a worn piece's
resistance = its tier value + one per band step of its material. A Quality vest of F3
material resists **5**, not 2. ✅ Verified across the ladder — a party keeping armor
current takes **1→8** from a mob F1→F9 and two elites stay at **62%→58%**, flat, no
inversion. ⚠️ And it makes the other problem permanent, which §12.7 now owns: a
current-armour party is **immune to ordinary mob damage on every floor**, so a mob's
threat cannot be its damage (→ §21.8 The Press).

*Original question, for the record —* **does armor resistance ride the material band?**
§12.7 gives a weapon **+1 Force per band step**; nothing said what a band step did for
armor. Without it, resist stays tier-capped near 3–4 forever while mob damage runs to 19.

⭐ **And what reaches an armoured party is CONDITIONS.** §8.1's Chill, Poison,
Infection and Dissolution carry a **tier and no Force**, so flat resistance never
touches them. **The mobs that still matter are the ones that deal no damage.**

---

## S-5 — What is still open

| Item | Note |
|---|---|
| ~~Enemy damage is free text~~ | **DONE** — `Enemy.signature` is a structured field, gated by `seed-enemies.js` exactly the way HP is, and **all 53 entries are migrated** (2026-09-14) |
| **Tide sizes are ⚖ untested** | Sized by arithmetic, never played. The first F2 session is the real check |
| **Area-attack multipliers** | "× the spaces covered" needs a worked example per skill shape (cone, line, burst) before it is table-ready |
| **~~F2–F9~~ F4–F9 rosters** | ⚠️ **NARROWED 2026-09-22 — ~~only F1 exists~~ four floors exist.** **F2 (16 entries)** and **F3 (18)** were written and seeded **2026-08-18** (`seeds/enemies-f2.js`, `-f3.js`), and **floor 0, the tutorial**, landed 2026-09-15/19 (`seeds/enemies-tutorial.js`; `FLOOR_MOB_HP` gained a floor-0 rung — mob 2 · elite 24 · boss 50 · super 120). **53 entries across F1–F3 plus the tutorial roster**, all passing the doctrine gate at their own floors. 🔴 **F4–F9 remain genuinely unwritten** — Set 2's floors are undesigned and M-4 is names-only, so that is design work, not roster work |

---

## S-6 — What a mob is FOR ✅ **ALL THREE RULED 2026-09-14 — now §21.8 + §12.6**

**The problem, stated honestly.** §12.7's armor ruling (2026-09-14) keeps
resistance climbing with the party, which fixes the scaling inversion — and makes
the other problem **permanent**: a party in current armor takes **1–8 points**
from a mob's hit on every floor from 1 to 9, against a torso that is always
roughly seven times that. Owner, from play: *"most mobs will not be able to deal
damage to the players due to the most basic of resistances doing their job."*

🔒 **So a mob's threat cannot be its damage.** The question is what it is instead.
Three candidates, all the owner's, and ⭐ **they are not alternatives — they
compose into one rule with one counterplay each.**

### ① THE PRESS — mobs combine, and §5.7 already wrote it

> **§5.7:** *"Combined attacks merge damage and count as **ONE hit** for anything
> keyed to a single hit. This is the party's designed path to single-hit numbers
> no individual can reach."*

**Nothing in the book restricts that to contestants.** Point it at a horde and the
entire effect falls out of one word — **resistance applies once to the merged
total, instead of once per mob:**

> pressed = **max(0, *n* × mob signature − resistance)**
> instead of *n* × max(0, mob signature − resistance)

**No new number. No new mechanic. One sentence.** And the curve it produces is
**identical on every floor**, because both sides were calibrated together:

| mobs on one contestant | F1 (mob 4, armor 3, torso 7) | F5 (9 / 7 / 17) | F9 (19 / 11 / 35) | |
|---|---|---|---|---|
| **1** | 1 | 2 | 8 | chaff — as it should be |
| **2** | **5** | **11** | **27** | **hurts** |
| **3** | **9** | **20** | **46** | 🔴 **torso destroyed** |
| 4 | 13 | 29 | 65 | dead, with overflow |

⭐ **A mob becomes a POSITIONING threat rather than a damage one.** One is
nothing; three is a corpse. The counterplay is entirely in rules that already
exist: **fight in a corridor** (§21.4 terrain — the width that made a room
*easier* to author now makes it *safer* to stand in), **do not let anyone be
surrounded**, and the **rooted-bulwark shape in §4** already retargets attacks on
adjacent allies. ⚠️ And it inverts the tactic the playtest found: **spreading out
one-per-mob is what stops being safe**, because a lone contestant is the one who
gets pressed.

### ② THE ELITE GOVERNS — and this is the governor ① needs

🔴 **On its own, ① is too lethal.** Twelve mobs against four contestants is three
each, which is a wipe in one Moment. It needs a condition, and the owner's second
idea is exactly the right one:

> **Leaderless mobs mill. Governed mobs coordinate.** A mob presses **only while
> an elite (or better) is directing the room.**

⭐ **This is the best piece of the three, because it solves three problems at once:**
1. **It makes the playtest CORRECT rather than a bug.** Twelve mobs alone were
   trivial — and they should be. Nobody was telling them what to do.
2. 🔴 **It fills the hole S-4 found.** The ladder ran 28% (elite + mobs) → 83%
   (two elites) with **nothing between**. A governed horde *is* the missing rung,
   and it arrives without a second elite.
3. ⭐ **It writes a target-priority decision into every mixed room.** Kill the
   elite and the horde falls apart; clear the mobs and the elite keeps calling
   more into line. That is a real choice and the room makes it legible.

⚙️ **It also gives elites a reason to be standing in a room full of mobs**, which
is what the F1 encounter tables assume and never justified.

### ③ ARMOR DEGRADES — and the sheet already tracks it

Owner: *"armor has durability, and over X attacks of Y strength, the resistance
drops."* ⚠️ **Per-item hit counters are the wrong implementation** — that is a
tally per worn piece per fight, at a table that already tracks per-part HP and
per-part conditions. **But the effect is already measurable with something on the
sheet:**

> **Resistance on a part drops by the CONDITION TIER on that part.**
> A Crushed T2 torso resists **2 less** there.

⭐ **"X attacks of Y strength" is precisely what a condition tier already means** —
a part gets Crushed *because* it took hits hard enough. The armor is caved in
because the body under it is. **Zero new tracking.**

⭐ And it is the exact mirror of **§21.6 Body**, which already subtracts Force
from what a conditioned limb *deals*. One idea, both directions: **a condition
costs you offence and defence on the same part.**

⚙️ **Composed with ① it produces a death spiral with a visible, curable cause:**
pressed → conditioned → resists less → the next press is worse. And because
§21.6 already made healing a damage buff, this makes it a **defence** buff too —
the same action answers both ends.

### What this would cost to adopt

| | new machinery |
|---|---|
| ① The Press | **none** — §5.7 exists and does not say "contestants only" |
| ② Elite governs | **one condition on ①** |
| ③ Armor degrades | **none** — condition tiers are already on the sheet |

✅ **RULED AND IN THE BOOK (owner: *"all three, put it in the book"*).**
**①+② are `§21.8 The Press`** — mobs that can reach the same target combine into
one attack, resistance answers it **once**, and they do it **only while a
directing elite is in the fight**. **③ is in `§12.6`** — a part's resistance drops
by the **highest** flat-resist condition tier on it (highest, not the sum: a
breastplate is one object and only breaks once), recovering the moment the
condition is cleared. **`§5.7` now says out loud that merging was never
contestants-only**, and **`§21.6` Body carries the mirror.** Rulebook → **v1.5**.

⚠️ **The one thing to watch in play:** ① makes a cornered contestant die fast.
That is the point, and it is also the failure mode. If it lands too hard, the
governor is ②'s reach — an elite directs only what it can see, or only a number
of mobs, rather than the whole room.
