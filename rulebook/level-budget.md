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

> ⚠️ **L-9 and L-10 are SUPERSEDED by L-19** (owner, 2026-08-18): the ceiling is
> ~level 150 with stats reaching 100+, kept deliberately *manageable*. The trait
> curve is **linear**, not exponential. L-8's finding still stands — traits do not
> multiply weapon damage — and L-11/L-14's answer to it stands too. Read L-9/L-10
> only for the reasoning that led there.

## L-9 — ⬇ SUPERSEDED — the fix, and why it also solves L-6

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

## L-10 — ⬇ SUPERSEDED — the exponential curve ⚖

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

## L-11 — The fork ✅ **RULED 2026-08-18: Architecture A**

**The trait band does not drive weapons. The material band does.** The §21.2 enemy
ladder stands unchanged, an F1 mob still dies to one on-band hit, and every HP
number in `f1-enemy-pass.md` survives.

**And the owner sharpened it past what I proposed:**

> *"The weapons will be the ones reaching the nuclear level, but the stats rising
> will have narrative trails of improvement rather than be the cause for more
> damage."*

So **stats are the key, not the gun.** Trait growth buys: the **right to hold** the
weapon (L-14), part HP (§3.2), skill points (§3.3), auto-success on stat-gated
actions (§2.3), and the fiction of a person becoming enormous. It does **not**
multiply damage.

🔴 **One thing this leaves genuinely unresolved — see L-17: do SKILLS scale with the
governing trait, or not at all?** Architecture A as I originally framed it said they
do; the refinement above says stats never cause damage. Those two cannot both be
fully true, and the answer changes what a caster is.

---

## L-14 — Requirements go insane, and that is the whole design ✅ **RULED**

§12.1 currently caps requirements at **5 Physique** for the heaviest weapon class.
**That ceiling lifts.** Items may require any amount of any trait:

> *"An axe that manipulates gravity needs more Physique to hold. A staff that
> corrupts the user needs more Mind to resist."*

This is what makes exponential traits matter without touching the damage formula:

| The trait does | The item does |
|---|---|
| grows exponentially (L-10) | carries the nuclear number |
| **unlocks** the item by meeting its requirement | is authored, not rolled |
| pays HP, skill points, action access, fiction | rides the material band + apex materials (M-5) |

**Requirements become the progression gate the level curve is actually for.** An F9
artifact might read **Req 20 000 Physique** — and the reason to have 36 000 Physique
is that the axe exists, not that your arm got stronger by a factor of a thousand.

It also connects to work already done: **M-5 APEX/DIVINE materials** (Loong-Scale,
Gleipnir-Weave, Five-Colored Sky-Stone) are already *"authored-only, never pooled,
never sold."* Those are the nuclear-tier bases, and insane requirements are how they
stay earned rather than looted.

⚖ Requirements are also a **narrative** lever, not only a number: a staff that
corrupts the user is gated on Mind because failing the gate should *do something*,
not merely deny the item. §6's Forced Actions are the existing hook — the book
already says an unmet requirement is a real gate, not a soft warning.

---

## L-15 — Old enemies become hordes ✅ **RULED — and it closes a loop**

> *"We can use older enemies as larger hordes and the likes, allowing the power
> fantasy play as well."*

**Nothing about an old enemy gets rescaled.** A Bramblewretch is 5 HP forever. At F5
the party simply meets **two hundred of them**, and cuts through the lot — which is
the power fantasy expressed as *content*, not as a stat block.

This is a genuinely economical ruling:

- **The rosters compound instead of expiring.** F1's 19 entries stay useful for the
  whole campaign. Every floor's roster is a permanent asset.
- **It is already the doctrine.** §21.2 says mob fights are about "the crowd:
  cones, lines, positioning, ammo burn" — a 200-strong Bramblewretch tide is that
  sentence at scale, and it rewards exactly the area skills the party spent nine
  floors building.
- **It gives the power fantasy somewhere to live** that is not "the numbers got
  bigger." Killing forty things a Moment *feels* different from killing one thing
  with a bigger number, and only one of those needs new content.

⚖ Implication for encounter design: later floors need **horde-count** guidance, not
just enemy HP. That belongs with the encounter tables in E-4.

---

## L-16 — 🔴 The problem this creates: the caster has no HP

§3.2 gives part HP from **Physique only** — `floor((Phy − 10) / 5)` per part. Under
an exponential curve that is no longer a modest difference between builds. It is a
chasm:

| At F9 | Physique | HP per part |
|---|---|---|
| Physique build | ~36 800 | **+7 367** |
| Mind build (Physique left near creation) | ~50 | **+8** |

Enemy damage re-based to threaten a 7 372 HP torso will be in the thousands. **A
Mind build's 13 HP torso dies to literally anything, on every floor from F2 onward,
forever.** That is not a glass cannon; that is an unplayable character.

**This is the L-6 flaw again, wearing different clothes** — it was never really
about exponential *damage*, it was about HP having exactly one source.

**Recommended fix ⚖ — part HP scales off TOTAL trait points, with Physique keeping a
bonus on top.** Everyone's body grows as they become enormous; the Physique
specialist is still the tank. Alternatives: a per-floor baseline HP every contestant
gets, or accepting that every build must buy Physique (which makes builds samey and
quietly deletes the pure caster).

**This needs ruling before Set 2 is designed.** It is fine at F1 and fatal by F4.

---

## L-17 / L-18 ✅ **RULED 2026-08-18**

- **L-17 — skills scale with their governing trait.** So Mind and Charm builds have
  a real damage axis, and the trait band earns its keep on the skill side exactly as
  Architecture A framed it.
- **L-18 — part HP scales off TOTAL trait points**, not Physique alone. The caster
  chasm is closed: everyone's body grows as they grow. Physique may still keep a
  bonus on top (⚖ open detail), but it is no longer the only source.

---

## L-19 — The curve ✅ **the anchors are per FLOOR, not per level**

**Corrected 2026-08-18.** The anchor is *"50 on a trait at **floor** 5"*, not at
level 5 — which resolves the whole thing. **§3.1 needs no change: one level still
grants one point.** Only the *number of levels per floor* is the design knob.

**Levels granted per floor, escalating by set** ⚖ — 10 · 10 · 10 · 16 · 16 · 16 ·
24 · 24 · 24 = **150 levels across F1–F9**:

| | F1 | F2 | F3 | F4 | **F5** | F6 | F7 | **F8** | **F9** |
|---|---|---|---|---|---|---|---|---|---|
| **Level** | 16 | 26 | 36 | 52 | 68 | 84 | 108 | **132** | **156** |
| **Total points** | 24 | 34 | 44 | 60 | 76 | 92 | 116 | 140 | **164** |
| **Focused main stat** | 12 | 19 | 26 | 37 | **48** | 60 | 76 | 93 | **110** |
| **+HP per part** ⚖ | +2 | +4 | +6 | +9 | +12 | +15 | +20 | +25 | **+30** |
| **Torso** | 7 | 9 | 11 | 14 | 17 | 20 | 25 | 30 | **35** |

**Every anchor lands, and none of them had to be forced:**

- **Floor 5 → main stat 48.** ✔ *"50 on a trait at floor 5."*
- **F8/F9 → level 132–156.** ✔ *"around level 150 is where F8/F9 is at."*
- **F9 → main stat 110**, balanced builds ~40 each. ✔ *"100+ potentially."*
- Nothing on the sheet exceeds three digits. ✔ *"somewhat manageable."*

**Part HP** = +1 per part per 5 total trait points past creation ⚖ — a **7 HP torso
at F1**, 35 at F9. Modest, readable, and it grows for every build (L-18).

> **This corrected a real error.** The earlier reading ("50 at *level* 5") forced a
> front-loaded tutorial and put a **13 HP torso** at F1, which is what the first
> damage re-base was sized against. The true F1 torso is **7**, so that pass was
> ~2.5× too aggressive. **`f1-enemy-pass.md` has been re-based again, to ×2 of the
> book baseline** — Bramblewretch 2 → 4, the Loong's coil 6 → 12, and so on.

---

## L-20 — ⬇ The collision as first diagnosed (**dissolved by L-22 — read that instead**)

> **This section is kept for its arithmetic, but its conclusion was wrong.** The
> mismatch below comes from comparing a band-multiplied weapon against an unbanded
> body — a units error on my part, not a balance flaw in the game. **L-22 is the
> resolution**, and it needs no change to the material band at all.

### The collision as first diagnosed

Linear stats mean **player HP grows ~5× across the campaign** (7 → 35) while the
material band multiplies weapon damage by **256×** (F1 ×2 → F9 ×512).

Hits to destroy a torso with a plain greatsword (recomputed against the corrected
L-19 curve — **the collision is worse than the first estimate**, because the true
HP numbers are lower):

| | F1 | F3 | F5 | F7 | F9 |
|---|---|---|---|---|---|
| **×512 per-floor band** | 1.2 | **0.5** | 0.18 | 0.07 | **0.02** |
| **×2/×8/×32 set bands** | 1.2 | 1.8 | 0.7 | 0.26 | **0.36** |

**Note the F1 column: 1.2 hits.** Even at Floor 1 a greatsword nearly one-shots a
torso — which is arguably correct for this system (§7.3: *"parts fail fast"*), but
it means the ratio never had much headroom to lose.

**With the per-floor band, a greatsword one-shots a torso from Floor 3 onward and
by F9 does 37× overkill.** Set bands delay it to F4. Either way the game becomes
rocket tag long before the finale, and no amount of level budget fixes it —
because linear points can never chase an exponential band.

**Something has to give, and it is not the level curve.** Three ways:

> ⚠️ The three options below are **superseded by L-22**. Option 2
> (armour-carries-HP) was rejected by the owner — the contestant's body should
> matter — and L-22 makes the whole question moot.

### Option 1 — Gentle the band to one per SET ⚖
`×2 / ×8 / ×32`. **The materials catalog already offers exactly this** — M-0:
*"Gentler alternative if doubling-per-floor feels hot: one band per SET
(×2/×8/×32) — say the word and the table reflows."* Buys three floors; not enough alone.

### Option 2 — Armour carries HP on the band ⭐ recommended, alongside 1
**"What a thing is made of IS the power" should apply to what you wear, not just
what you swing.** Let armour parts contribute **HP × the material band**, so
survivability at F9 comes from wearing F9-band plate rather than from your stats.

An armour piece worth **8 HP** gives +16 at F1 and **+256 at F9**. Combined with
set bands that holds **~3–5 hits per torso on every floor**, which is the stable
ratio the whole campaign needs — and it makes the materials catalog the
progression spine on the defensive side too, which it already is offensively.

### Option 3 — accept rocket tag
§7.3 does say *"parts fail fast; small pools are the design."* One could rule that
late floors are genuinely one-hit-per-part and the game becomes about conditions,
positioning and initiative. **Coherent, but it deletes the tank fantasy** and makes
the Physique investment pointless at exactly the floors it was saved for.

**Recommendation: 1 + 2 together.** Stats stay manageable (your ask), armour and
materials carry the exponential, and the hit-count stays stable end to end.

---

## L-22 — The fix: **the band is a RATIO, not a number on the sheet** ⭐

**Owner ruled out armour-carrying-HP: the contestant's body should matter.** Good —
because the real answer is smaller than either of my earlier proposals, and the
materials catalog already states it:

> *"The sheet plays identically on every floor; only the numbers inflate."*
> *"An F9 MOB carries ~1.3k HP … and still dies in one on-band swing."* — M-0

**The catalog is already describing a system where the band cancels inside a floor.**
It is written in absolute numbers, which is what makes it *look* like an
escalating gap, but its own stated behaviour is relative. L-20 is therefore not a
balance flaw — it is a **units** error, mine, from comparing a band-multiplied
weapon against an unbanded body.

### The rule

> **Everything native to a floor is written in BAND UNITS. The floor's material
> band multiplies every native number equally, so it cancels — and never appears on
> a character sheet at all.**
>
> The band's real job is **cross-floor**: it is what makes last floor's sword a
> letter-opener and last floor's elite a mob.

### What that looks like

| Written on the sheet (band units) | Value | Changes with floor? |
|---|---|---|
| Weapon class damage (§12.1) | 2–4 | **No — forever** |
| Enemy mob / elite / boss / super HP (§21.2) | 5 / 60 / 125 / 300 | **No — forever** |
| **Part HP** = `5 + (total trait points − 14) ÷ 5` ⚖ | **7 → 35** | **Yes — the body is the only thing that moves** |

**So the body is the only variable, which is exactly the ask.** Hits to destroy a
torso with a plain on-band greatsword:

| | F1 | F3 | F5 | F7 | F9 |
|---|---|---|---|---|---|
| **Torso (band units)** | 7 | 11 | 17 | 25 | **35** |
| **Hits to destroy** | 2.3 | 3.7 | 5.7 | 8.3 | **11.7** |

The curve now runs the *right* way: a contestant gets **steadily harder to kill as
they grow**, from a bit over two hits to nearly twelve, and **every point of that
comes from their own trait total** — not their armour, not the floor.

### And the fiction survives intact

In absolute terms an F9 contestant carries a **17 920 HP torso** and swings for
**1 536**. Against a Floor 1 human — 7 HP, 6 damage — they are, arithmetically, a
god. **Practical gods, with nobody doing six-digit arithmetic at the table.**

### What it costs

Almost nothing, and no blessed content is invalidated:

- **§21.2's ladder is reinterpreted, not rewritten.** Mob 5 / elite 60 / boss 125 /
  super 300 become **the numbers for every floor**, in band units. The
  "doubling per floor" column in the catalog is the same ladder expressed
  absolutely — both are true, and M-0 already says the mob dies in one on-band
  swing on every floor.
- **The F1 roster is untouched.** F1 *is* band units, so all 19 entries and the ×2
  damage re-base stand exactly as written.
- **The hordes ruling (L-15) becomes mechanical, not just flavour.** An F1
  Bramblewretch met at F5 is 5 *F1-band* units — one sixteenth of an F5 unit — so
  the party genuinely cuts through two hundred of them. That is the power fantasy
  falling out of the arithmetic rather than being asserted.
- **§12.7 needs a clarifying errata**, not a redesign: state that the band is a
  floor-relative scalar and that sheets are written in band units. The catalog's own
  sentence is already the rule; it just needs to be *stated as* the rule.

✅ **RULED: an item CAN outpace its floor.** An Exceptional, apex-material or
authored weapon may read **above** its class baseline in band units — a 6 where the
class says 3. *"Part of the fun."* **The band sets the era; the item earns its rank
inside it.** Written into §12.7's errata.

✅ **RULED: only MOBS are exact.** *"The only one we can decisively say always dies
in one meaningful shot is mobs."* §21.2's elite/boss/super ratios are a **centre with
a tolerance band**, and elites should **differ from one another** as a matter of
course — a regenerator needs less raw HP than a lump of masonry. The seeder enforces
mobs exactly and gives everything above ±tolerance, so the gate catches gross errors
without flattening the roster. The F1 elites now run **45 · 48 · 52 · 68 · 78**, and
the bosses **110 · 125 · 140**.

---

## L-21 — What this does to the enemy ladder

Under set bands the §21.2 numbers move for **Set 2 and 3 only**:

| | F1 mob | F3 mob | F6 mob | F9 mob | F9 elite | F9 super |
|---|---|---|---|---|---|---|
| **Per-floor band (current)** | 5 | 20 | 160 | 1 280 | 15 360 | 76 800 |
| **Set bands (proposed)** | 5 | 5 | 20 | **96** | **1 152** | **5 760** |

**F1 is untouched either way** — Set 1 is ×2 in both schemes, so the entire
`f1-enemy-pass.md` roster stands exactly as written, damage re-base included.
Only F4+ would need re-basing, and none of it is authored yet.

⚖ Note this also makes the **hordes ruling (L-15) cheaper**: with a flatter band,
an F1 Bramblewretch stays relevant as horde fodder for longer before it becomes
purely decorative.

---

## L-13 — Open questions

| # | Question | Why it matters |
|---|---|---|
| ~~L-g~~ | ~~Architecture A or B~~ | **RULED: A**, refined — stats gate, weapons carry (L-11, L-14) |
| ~~L-17~~ | ~~Do skills scale with the trait~~ | **RULED: yes** |
| ~~L-18~~ | ~~Non-Physique HP source~~ | **RULED: HP scales off TOTAL trait points** |
| **L-19** ⚖ | **Confirm the per-floor level grants** (10/10/10 · 16/16/16 · 24/24/24 = 150) | Sets every number downstream. All anchors land as drafted |
| ~~L-20~~ | ~~The band collision~~ | **Dissolved by L-22** — it was a units error, not a balance flaw. No band change needed; the ×512 per-floor ladder can stay |
| **L-22** ⚖ | **Confirm: sheets are written in band units; the band is floor-relative and cancels within a floor** | Keeps stats manageable AND makes the body the only variable |
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
