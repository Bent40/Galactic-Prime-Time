# Enemy Scaling — damage per floor, and hordes across floors (PROPOSAL)

**Date:** 2026-08-18 · **Status:** 🟡 PROPOSAL — the doctrine it rests on is ruled;
these numbers are not. Governing canon: **§12.7 errata** (the material band is
floor-relative; sheets are written in band units), **§21.2** (ranks and the horde
doctrine), and `level-budget.md` **L-15** (old enemies become hordes) and **L-19**
(the level curve).

> **Everything here is in BAND UNITS.** The floor's material band multiplies every
> number native to that floor equally, so it cancels and never reaches the page. A
> greatsword is 3 on Floor 1 and on Floor 9. What changes is the **contestant's
> body**, and these tables follow it.

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

### Two legitimate reasons to leave the band

1. **Telegraphed windups hit harder.** A 1-Clock windup that leaves the attacker
   Exposed (§5.3) may run well above its rank's number — the Step-Warden's stomp is
   **10** against an F1 elite band of 6, and that is correct: the party is being paid
   in a punish window.
2. **Per-Moment ticks hit softer.** Damage applied every Moment of contact sits
   below the band — the Husk-Moth Cloud's **2** Chill against a mob band of 4.

**Anything else outside the band is a bug.** The whole F1 roster was checked against
this table and sits inside it, with exactly those two exceptions.

---

## S-2 — Hordes: reusing old enemies (L-15)

**Nothing is ever rescaled.** A Bramblewretch is 5 band units *of its own floor*
forever. What changes is how many of them the floor sends.

An F1 mob is 5 **F1-band** units. At floor N one band unit is worth `2^(N−1)` F1
units, so an on-band swing that kills one Bramblewretch at F1 kills a great many at
F5. The tide size follows directly:

| An F1-band mob, met at | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9 |
|---|---|---|---|---|---|---|---|---|
| **Tide size** ⚖ | 25 | 50 | 95 | 200 | 400 | 750 | 1 500 | **3 000** |

> **The general rule: a floor-S mob met at floor N arrives about `12 × 2^(N−S)`
> strong.**

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

## S-4 — What is still open

| Item | Note |
|---|---|
| **Enemy damage is free text** | It lives in the `notes` field, so the seeder cannot gate it the way it gates HP. A damage field on the `Enemy` model would fix that — app work, not content |
| **Tide sizes are ⚖ untested** | Sized by arithmetic, never played. The first F2 session is the real check |
| **Area-attack multipliers** | "× the spaces covered" needs a worked example per skill shape (cone, line, burst) before it is table-ready |
| **F2–F9 rosters** | This is the *frame*, not the content. Only F1 exists |
