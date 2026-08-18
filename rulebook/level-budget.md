# The Level Budget — how much power, and when (PROPOSAL)

**Date:** 2026-08-18 · **Status:** 🟡 PROPOSAL — awaiting owner blessing.
Governing canon: **§3.1** (levels are GM-awarded at milestones; **1 level = 1
level point = +1 to any one trait**; no XP curve), **§2.2** (creation is 7 Body +
7 Core = **14 points**), **§3.2** (milestone payouts past 10, repeating forever),
and the ten-floor frame in `item-drafting-materials.md`.

> **Why this document exists.** Every enemy statline in `f1-enemy-pass.md` is
> calibrated against *a guess* — the level-6 party snapshot. Until the curve is
> ruled, "is 60 HP right for an F1 elite" has no answer, because the question is
> really "how hard does the party hit at F1", and nothing says. **This is upstream
> of every roster.**

---

## L-1 — What the book already fixes

| Fact | Source |
|---|---|
| Creation gives exactly **14 trait points** (1 base × 4 + 5 per pillar) | §2.2 |
| **1 level = 1 point = +1 to one trait**, any trait, either pillar | §3.1 |
| Levels grant **nothing else** — no automatic HP | §3.1 |
| Levels come from **milestones: bosses, floors, major achievements**. No XP | §3.1 |
| Traits have **no cap**; past 10 they pay repeating milestone bonuses | §3.2 |
| Skill points = **trait total − 1**, per trait | §3.3 |
| **No free respec, ever** | §3.4 |

**The live party confirms the arithmetic.** All four contestants sit at exactly
14 trait points with 6 unspent level points at level 6 — creation value, nothing
banked. So the campaign has, so far, granted **≈1 level per level**, and spent
none of it.

---

## L-2 — The proposed curve ⚖

**Levels escalate by set**, because the floors do:

| Set | Floors | Levels per floor | Set total |
|---|---|---|---|
| **Set 1** | F1–F3 | **3** | 9 |
| **Set 2** | F4–F6 | **4** | 12 |
| **Set 3** | F7–F9 | **5** | 15 |
| **F10** | the FFA | **0** — it is the exam, not a shop | 0 |
| | | | **36 total** |

**Running trait totals** (14 at creation, before any achievement grants):

| | F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9 |
|---|---|---|---|---|---|---|---|---|---|
| **Total points** | 17 | 20 | 23 | 27 | 31 | 35 | 40 | 45 | **50** |
| *Spread build* (÷4) | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | **12** |
| *Focused build* (~60% into one) | 7 | 9 | 11 | 13 | 15 | 18 | 21 | 24 | **26** |
| *Full minmax* (all into one) | 8 | 11 | 14 | 18 | 22 | 26 | 31 | 36 | **41** |

**This is the band each floor should be designed against.** F1 enemies face a
party whose best trait is 7–8. F9 enemies face 26–41 in one stat.

**It also matches your read on Mind.** A focused build crosses **Mind 20 around
F6**, a full minmax around **F5** — which is exactly the "20 or more if they farm
and minmax" the Dissolution errata was tuned against. The +2/+3 source escalation
is what keeps that character in danger.

---

## L-3 — Where the levels come from ⚖

**Per floor, three guaranteed levels** (Set 1; Set 2 and 3 add the set bonus):

| Milestone | Levels | Why |
|---|---|---|
| **Floor cleared** | **1** | §3.1 names floors explicitly |
| **The route's boss resolved** | **1** | **Resolved, not killed.** Chaining THE MASKED, out-arguing the Loong and putting Bex to flight all pay the same as a corpse — otherwise the boss doctrine is a lie the payout contradicts |
| **The floor's discovery** | **1** | Awarded for finding the weak system and beating the gate the intended way. This is what pays for *playing the design* |
| **Set bonus** | **+1** (Set 2) / **+2** (Set 3) | The floors get bigger; so does the grant |
| **Major achievement** (§17.6) | **+1** ⚖ | GM discretion, **never guaranteed**, and the only source that can push a party off-curve |

**Two things pay ZERO levels, and both are deliberate:**

- **Mobs. Ever.** A cleared mob room pays materials and Exposure (§17), never
  advancement. Otherwise grinding beats playing, and the horde doctrine (§21.2)
  turns into an XP farm — which is exactly the thing §3.1 says this system does
  not have.
- **Elites, individually.** They roll up into *the floor's discovery* and *floor
  cleared*. Otherwise a floor with four elites out-pays a floor with two, and
  **the roster author accidentally controls the power curve.** I am that author;
  I should not have that lever.

---

## L-4 — The route question, and my recommendation 🔴

You asked for levels *per route*. The routes are not equally hard — Hard's F1 is a
super boss, Easy's is a chained man.

**Recommendation: all three routes pay IDENTICAL levels. Difficulty is repaid in
loot, materials and story access, never in advancement.**

The reason is compounding. Players pick **one route per campaign** (§4.1) and the
others resolve offscreen, so a +1/floor route differential is **+9 levels by F9** —
a quarter of the entire campaign budget, decided once, at Floor 1, before anyone
knows what they are choosing. It would also make every enemy statline route-
dependent, which is unauthorable: I would need three ladders instead of one.

Hard route already pays more **in kind**: Obsidian, the Loong's shed scale (the
only APEX material that enters the world at all), and the F3 cure storyline.
That is the right currency for it.

⚖ If you want route difficulty to touch power, the safe knob is **one-off
achievement grants** (L-3's discretionary +1), not a per-floor rate.

---

## L-5 — What the curve does to the milestone bonuses (§3.2)

The over-10 divisors are 5 / 12 / 15 / 20. At **36 total levels** they behave very
differently by build:

| Build at F9 | Physique ÷5 | Reflexes ÷12 | Mind ÷15 | Charm ÷20 |
|---|---|---|---|---|
| **Spread** (~12 each) | +0 HP | +0 resist | +0 tier | +0 stack |
| **Focused** (~26 in one) | +3 HP/part | +1 resist | +1 tier | +0 stack |
| **Minmax** (~41 in one) | +6 HP/part | +2 resist | +2 tiers | +1 stack |

**Two readings, and you should pick one deliberately:**

1. **The divisors already assume specialization.** A Charm build needs **30** to
   see its first stack. That is only reachable by a focused or minmax build under
   a 36-level budget — so the book, as written, quietly says *specialize*.
2. **If you want spread builds viable**, the budget needs to be larger (≈50+
   levels) or the divisors smaller. 36 levels makes generalists permanently
   milestone-poor.

I lean toward **(1)** — it makes the four contestants play differently, and the
party already self-selected into roles. But it means a spread build is a real
trap, and the table should be told that at creation rather than discovering it at
Floor 6. ⚖

---

## L-6 — Sanity check against the enemy ladder

The §21.2 ladder gives F1 mob 5 · elite 60 · boss 125 · super 300, and the
material band doubles each floor.

At **F1** the party's best trait is **7–8** and their weapons are on the ×2 band —
so an on-band swing lands around 4–6, and a 5-HP mob dies to one hit exactly as
the doctrine says. **The F1 numbers hold.**

The check that matters is that **both sides double per floor**: the material band
doubles (×2 → ×512) while trait points grow *linearly* (+3 → +5 per floor). Those
are different curves. **Damage scales with the band, not the stat**, which is what
keeps them aligned — traits buy HP, resistances, skill points and milestone
payouts, while the band buys damage. That is a coherent split, and it is worth
saying out loud because it is the reason a linear level curve can sit under an
exponential damage ladder without breaking.

🔴 **The open risk:** trait-driven **HP** grows linearly (Physique ÷5) while
incoming **damage** grows exponentially. By F9 a body part might have 5–11 HP
against swings of 500+. Every hit is lethal regardless of Physique. That is
either intended (the system is lethal, conditions and positioning are the defence,
and §7.3's small pools are called "the design") — or F7–F9 needs a different HP
source than Physique. **This needs a ruling before Set 3 is designed**, not after.

---

## L-7 — Open questions

| # | Question | Why it matters |
|---|---|---|
| **L-a** | Is 3/4/5 per set the right shape, or flat 4? | Sets the whole curve |
| **L-b** | Routes pay equally? (L-4 recommends yes) | ±9 levels by F9 |
| **L-c** | Do achievements grant levels, or only Upgrade Tokens? | The only off-curve source |
| **L-d** | Specialization-by-design, or widen the budget? (L-5) | Decides whether spread builds are viable |
| **L-e** | Does part HP need a non-Physique source at Set 3? (L-6) | Decides whether F7–F9 is playable |
| **L-f** | Are the 6 unspent points on the live party spent before F1, or banked? | Changes the F1 band by up to 6 points |
