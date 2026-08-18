# The Level Budget — how much power, and when (PROPOSAL)

**Date:** 2026-08-18 · **Status:** 🟡 PROPOSAL — awaiting owner blessing.
Governing canon: **§3.1** (levels are GM-awarded at milestones; **1 level = 1
level point = +1 to any one trait**; no XP curve), **§2.2** (creation is 7 Body +
7 Core = **14 points**), **§3.2** (milestone payouts past 10, repeating forever),
and the ten-floor frame in `item-drafting-materials.md`.

> **Why this document exists.** Every enemy statline in `f1-enemy-pass.md` is
> calibrated against *a guess*. Until the curve is ruled, "is 60 HP right for an F1
> elite" has no answer. **This is upstream of every roster.**
>
> **Revised 2026-08-18 (owner):** *"50 Physique at level 5 and go 'well this is
> pretty solid I guess.' At F9 they should be practical gods — throwing nuclear
> punches and eradicating stars with each skill or spell."* The linear 36-level
> budget below L-2 was drafted before that and is **superseded**; it is kept only
> as the arithmetic baseline. **L-8 onward is the live proposal.**

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

## L-8 — 🔴 The blocker: traits do not multiply damage

Before any curve can deliver "nuclear punches", this has to be said plainly:

**In v1 as written, Physique past 5 adds nothing to how hard you hit.**

| Where damage comes from | Where it does not |
|---|---|
| The **weapon class** — flat 2–4 (§12.1) | Physique. It is a **requirement gate** |
| The **material band** — ×2 … ×512 (§12.7) | Any trait |
| **Affix riders** and **skill levels** (§4.1) | Any trait |

§12.1's heaviest class, Heavy Large, requires **5 Physique** and deals **3**. A
contestant with Physique 5 and one with Physique 500 swing the same greatsword for
exactly the same number. There is no rule anywhere in the book that adds a trait to
damage.

**So what does Physique 50 buy today?** `floor((50−10)/5)` = **+8 max HP to every
body part** (§3.2), **49 skill points** (§3.3), and access to weapon classes that
capped out at a requirement of 5. That is "pretty solid" — but it is *durability
and breadth*, not force. **The punch is not nuclear and no level budget can make it
so.** A rule has to change.

**There is a precedent to build on.** §12.1 already has **stat-valued numbers**:
*"Range: Reflexes"* means the range equals your current stat total. The book is
willing to let a trait *be* a number directly. That is the door.

---

## L-9 — The fix, and why it also solves L-6

**Make trait growth exponential, on the same doubling ladder as the materials.**

Define a **trait band**, exactly parallel to the material band:

> **Trait band** = the trait doubled against a base of 5 —
> `×2^floor(log₂(trait ÷ 5))`, minimum ×1.
>
> Phy 5 → ×1 · 10 → ×2 · 20 → ×4 · 40 → ×8 · 80 → ×16 · 160 → ×32 · …

**This is not just bigger numbers — it repairs the flaw flagged at L-6.** Under the
linear budget, part HP grew linearly off Physique while band damage doubled per
floor, so by F9 every hit was lethal regardless of build. With traits on their own
doubling ladder, **HP and damage inflate together** and the sheet keeps playing the
same way — which is exactly what the materials catalog already promises: *"only the
numbers inflate."* The owner's instinct to think bigger is the correct fix, not a
cosmetic one.

---

## L-10 — The curve ⚖

**Points per level start at 12 and double every floor**, tracking the band.
Levels stay at **3 per floor**; the *grant* does the scaling, not the pacing.

| | Tut | F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Points per level** | 12 | 24 | 48 | 96 | 192 | 384 | 768 | 1 536 | 3 072 | 6 144 |
| **Main stat** (full dump) | **53** | 125 | 269 | 557 | 1 133 | 2 285 | 4 589 | 9 197 | 18 413 | **36 845** |
| **Trait band** | ×8 | ×16 | ×32 | ×64 | ×128 | ×256 | ×512 | ×1 024 | ×2 048 | **×4 096** |
| **Material band** | ×1 | ×2 | ×4 | ×8 | ×16 | ×32 | ×64 | ×128 | ×256 | ×512 |
| **+HP per part** (§3.2) | +8 | +23 | +51 | +109 | +224 | +455 | +915 | +1 837 | +3 680 | **+7 367** |

**The anchor lands exactly.** Four tutorial levels at 12 points put a focused build
at **Physique 53 entering Floor 1** — "pretty solid, I guess."

**And the two ladders stay in step by construction.** The trait band gains exactly
one doubling per floor, in lockstep with the material band, without either being
tuned against the other. That is the sign the shape is right rather than fitted.

**At F9:** Physique ~36 800, trait band **×4 096**, material band **×512**, a
level-10 skill on top. Practical gods.

---

## L-11 — 🔴 The fork: where does the trait band apply?

This is the decision, and it is genuinely load-bearing.

### Architecture A — the trait band drives **SKILLS**; the material band drives **WEAPONS** ⭐ recommended

- **Weapons** keep the material band alone. **The entire §21.2 enemy ladder stands
  unchanged** — an F1 mob still dies to one on-band hit, and every number in
  `f1-enemy-pass.md` survives.
- **Skills** scale on their governing trait's band. Mario's **Heroic Punch** at
  Physique 30 000 *is* the nuclear punch — which is the owner's phrasing almost
  word for word: *"with each skill or spell they do."*
- **Cost:** weapons become the small gun late. Items stay valuable for affixes,
  conditions, riders and utility, but not raw damage.

### Architecture B — the trait band multiplies **everything**

- Weapons and skills both ride trait × material.
- **Cost: the whole enemy ladder needs a second exponent.** F9 elite goes from
  ~15 k to ~61 M, and **every statline written so far is invalidated**, F1 included.

**Recommendation: A.** It gives the owner the sentence he actually asked for, keeps
the materials investment meaningful on its own axis, and does not throw away the
roster. B is coherent but expensive, and buys little that A does not.

---

## L-12 — 🔴 What this costs the F1 roster either way

Under **A**, enemy *HP* is fine. Enemy **damage** is not.

Every attack value in `f1-enemy-pass.md` was written against **2–5 HP body parts**.
Under this curve a focused contestant enters F1 with a **28 HP torso**. So a
Bramblewretch dealing 2 Bleed is no longer a threat — it is weather.

**Enemy attack values must double per floor exactly as their HP does**, and the F1
values need re-basing against the new part HP (roughly **×5** at F1). That is a
mechanical pass over the roster, not a rewrite: the gates, weak systems, phases,
carves and story all stand. Only the damage numbers move.

⚖ Note also that the `Enemy` model has **no trait fields** — enemy attacks are
authored numbers. That is fine under A (author them on the doubling ladder), but it
means enemies never get a trait band of their own.

---

## L-13 — Open questions

| # | Question | Why it matters |
|---|---|---|
| **L-g** | **Architecture A or B?** (L-11) | Decides whether the existing roster survives |
| **L-h** | Is the trait band `÷5, doubling` the right curve, or gentler (÷5, doubling every ×4)? | Sets the whole ceiling |
| **L-i** | 12 points per level at the tutorial, doubling per floor — right, or steeper? | The anchor fits; the tail is a choice |
| **L-j** | Does the **creation** allocation rescale from 14, or stay? | 14 is now a rounding error by F1 |
| **L-k** | Do skill *levels* (0–10) also scale, or is the trait band enough? | 10 is a hard cap in a world with no other caps |
| **L-l** | Routes still pay identical levels? (L-4 recommendation stands) | ±1 floor of grants compounds hard now |

**Superseded but retained below:** L-2 through L-7 record the linear 36-level
baseline and the arithmetic that proves the book's fixed points. The route
recommendation (L-4) and the milestone-source table (L-3) still apply — only the
*size* of the grants changed.

---

# ⬇ SUPERSEDED — the linear baseline (kept for its arithmetic)

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
