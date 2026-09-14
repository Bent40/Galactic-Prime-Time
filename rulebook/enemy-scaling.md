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

**Danger is geometry.** `width × mob signature × ⌈count ÷ 2⌉` — a ceiling that
holds the front rank full as the room dies, which no real room does. Author
against it.

**With an elite in the room the shape changes**: the mobs die early and the elite
is alive at the end, so its damage multiplies by the *room's* duration
(`⌈total enemy HP ÷ party Force per Moment⌉`), not the mobs'.

### The elite dial — and it is nearly floor-invariant

| floor | elite alone | elite + 4 mobs | 6 mobs at width 2 |
|---|---|---|---|
| **F1** | **31%** | **55%** | 21% |
| F2 | 29% | 51% | 18% |
| F3 | 25% | 45% | 17% |
| F4 | 25% | 45% | 17% |
| F5 | 24% | 42% | 15% |
| F6 | 24% | 42% | 15% |
| F7 | 23% | 41% | 15% |
| F8 | 23% | 41% | 15% |
| F9 | 23% | 40% | 14% |

⭐ **An elite alone is a standard room; an elite plus four mobs is a hard one —
at every floor.** Mobs are cheap. **What makes a room expensive is something that
is still alive at the end of it**, so add a second elite before you add ten more
mobs.

⚠️ **Floor 1 is the hot end, and it is the tutorial's neighbour.** Early parts are
small (a 2 HP head, a 5 HP torso) and the per-part bonus has barely started, so
the same shape costs **31% / 55%** there against **23% / 41%** from F7 on. The
campaign gets *gentler* in relative terms as it climbs — the opposite of the
intuition, and worth knowing before you size Floor 1.

---

## S-5 — What is still open

| Item | Note |
|---|---|
| ~~Enemy damage is free text~~ | **DONE** — `Enemy.signature` is a structured field, gated by `seed-enemies.js` exactly the way HP is, and **all 53 entries are migrated** (2026-09-14) |
| **Tide sizes are ⚖ untested** | Sized by arithmetic, never played. The first F2 session is the real check |
| **Area-attack multipliers** | "× the spaces covered" needs a worked example per skill shape (cone, line, burst) before it is table-ready |
| **F2–F9 rosters** | This is the *frame*, not the content. Only F1 exists |
