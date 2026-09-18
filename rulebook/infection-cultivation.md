# Infection cultivation — types and strains

**Status: PROPOSAL, 2026-09-18.** Owner supplied the architecture (three layers, and
prion/fungus/virus). Everything marked ⚖ is mine and unblessed. **Nothing here is ruled.**

> *"Maybe infections can be cultivated with other found infections to add or change their
> effects. The current effects of infection would be the basics the infection can do. Then
> the type of infection add damage or effects, like poison, and strains give them modifiers
> maybe. So prion would be damaging, fungus would be psychic, virus would be resilient."*

---

## I-0 · What Infection is today (§8.2) — and why it is the right condition to build on

| Tier | Effect |
|---|---|
| T1 | Prevents healing and resolution of other conditions |
| T2 | All other active conditions advance **one extra tier** at Clock reset |
| T3 | **2-Clock death timer** |

Whole body. No Force (§8.1). Cures: **time** (depending on the infection), potions,
cleansing skills, **Burn T2's field cautery**. Tiered resistance = immunity to that tier
and below, and it is **GM-awarded, never automatic** (§10).

⭐ **Infection is already the game's MULTIPLIER, not a damage source.** §8.1 says it
outright — *"a condition that carries no Force is not weak; Infection advances everything
else."* It is the only condition in the book whose entire job is making the other
conditions worse. That is a superb base for a type layer, because **the types can take
that verb in different directions instead of inventing new machinery.**

---

## I-1 · The architecture — and the rule it already is

**Base + Type + Strain** is **§12.3's item architecture** (base + prefix + suffix, with
tier gating access), applied to a condition. That is not a coincidence to work around —
it is the cheapest possible version of the owner's idea, because the vocabulary, the slot
limits, the tier-access table and the extraction risk are all already written.

| Items (§12.3) | Infections (proposed) |
|---|---|
| base item | the §8.2 Infected table — every infection does this |
| prefix / suffix | **ONE type slot, ONE strain slot** |
| tier gates which modifiers you can hold | the infection's own tier gates what it can carry |
| the Altar *moves* modifiers, at risk | cultivation *moves* a type or strain, at risk |

⭐⭐ **And the cultivation rules are already written, on the wrong noun.** §20.3's
**Melding Station (10 UT)**: *"Merge 2 same-type items → 1: better base + ONE modifier from
the sacrifice"* · **L2** *"keep two modifiers from the sacrifice"* · **L3** *"once per floor
the meld bumps the result one item tier."* **That is the owner's cultivation system, verbatim,
including its ceiling.** Point it at a disease and nothing needs designing.

⭐ And the **Farm (10 UT)** is already the biology module — *"ingredient supply… bandage/
antitoxin crafting stock."* **Farm holds the cultures, Melding merges them.** No new module.

---

## I-2 · The TYPE layer — five types, five verbs, zero new numbers

🔴 **The discovery that shaped this: NOTHING in §8.2 deals recurring damage.** Every tier
in every condition is a *state* — a disability, a destroyed part, a death timer. Burn's
"HP damage" is on application; its tiers are states. **The system has no damage-over-time
and has never needed one.**

⚠️ **So "prion = damaging" must not become the book's first DoT.** A flat per-Clock number
walks straight into §12.7's 4d trap — 3 damage a Clock is half a torso at F1 (7) and
nothing at F9 (35) — and it would need a floor-scaling constant no other condition has.
⭐ **The system's own way of saying "this is damaging" is TIER ESCALATION toward a destroyed
part**, which is floor-invariant by construction. Infection already has that verb at T2.

| Type | Verb | Effect (⚖ proposed) | Why it is that |
|---|---|---|---|
| 🦠 **Prion** | it **DESTROYS** | Instead of advancing *other* conditions, it applies **Crushed** to the part it sits on and advances **that** at Clock reset. T3 still kills. | Misfolding protein: the body eats its own structure. Parts die; nothing ticks. |
| 🍄 **Fungus** | it **TAKES OVER** | A **Dissolution source at +1/Moment** while at T2+ (§8.2 errata — escalation rides the source). | Cordyceps takes the driver's seat. The errata's source-rate knob was built for exactly this. |
| 🧬 **Virus** | it **PERSISTS** | Attacks the **cure list**, not the effect list: **Burn T2 no longer clears it — it drops one tier**; **time does not cure it at all.** It needs a specific answer. | A virus is not worse, it is *harder to be rid of*. Turns an inconvenience into a quest. |
| 🧫 **Bacterium** ⚖ | it **SPREADS** | Contact with an ally in the same space passes **T1**. | The party-level threat — and the reason a quarantine is a *place* (F3 built that already). |
| 🪱 **Parasite** ⚖ | it **FEEDS** | At Clock reset it **removes one tier of another condition on you and adds one to itself.** | The one infection that *helps* — right up until it is T3. And it is literally the five parasites. |

🔒 **The load-bearing rule: a type REPLACES the base's T2, it does not stack on it.**
The owner's own words were *"add or change"* — **change is the one that survives contact
with the balance.** Infection is already the strongest condition per tier in the book; if a
type adds Force *and* a strain adds a modifier *on top of* "everything else advances," then
Infection becomes the only condition that matters. ⭐ **Replacing makes the type a CHOICE OF
THREAT rather than an addition** — you are not powering your disease up, you are **steering
it**, and you can steer it wrong. T1 and T3 are untouched in every type, so §8.2's
calibration stands.

---

## I-3 · The STRAIN layer — modifiers, sized like Lesser affixes (⚖ all mine)

One slot. Small, single-sentence, no numbers where a word will do.

- **Dormant** — does not advance until a trigger fires (entering combat · eating · taking Burn).
- **Aggressive** — advances one Clock faster, **and gains an entry on its cure list.**
- **Blood-borne / Airborne / Chill-borne** — the transmission vector. §8.2's Poison entry
  already does exactly this with its entry conditions, so the shape is precedented.
- **Symbiotic** — while at **T1 only**, grants one small thing. Advancing past T1 loses it.
- **Hardy** — tiered Infection resistance must **exceed** its tier by 1 to block it.

⭐ **Hardy is the important one**, because it is the only lever that threatens a party who
has been awarded Infection resistance — and §10 makes that resistance *immunity*, which is
binary and otherwise un-scalable.

---

## I-4 · Cultivation — the verbs, and where they live

| Verb | Where | What it is |
|---|---|---|
| **Sample** | the **Farm** | A culture taken from a source — a corpse, a bloom, a Reservoir. It is an item; it sits in the ingredient stock. |
| **Cultivate** | the **Melding Station** | Merge a sample into an infection: better base + **ONE** slot from the sacrifice. L2 keeps two. L3, once per floor, bumps a tier. |
| **Extract** | the **Enchantment Altar** ⚖ | Pull a type *off* an infection into a sample. Same risk ladder as a modifier — the tier decides whether it survives. |

⚠️ **Cultivating is not free of the thing you are cultivating.** The vessel is either **your
own body** or **a container**, and the game already has both: a contestant who is Infected,
or **C-1 Leak-Vial / Seepage**, the Easy-route spine kit already authored to hold a disease.
⭐ **Same system, one variable.** In a body it is horror; in a vial it is a §21.6 Gear step.

---

## I-5 · The open calls

| # | Call | Why it needs you |
|---|---|---|
| **1** | **Replace or stack at T2?** | I recommend **replace** (I-2) and the owner's own wording allows it. Stacking makes Infection dominate. |
| **2** | **Does a type change what resistance answers?** | ⚖ Recommend **no** — resistance answers *Infection*, one number on the sheet, so a T2-immune contestant is immune to a T2 prion and a T2 fungus alike. That makes `virus` and `Hardy` the only ways to threaten a resistant party, which is a good job for them to have. |
| **3** | **Who can cultivate, and is it a downtime action?** | Melding is a Lounge module (10 UT), so it is downtime by default. A *field* cultivation is a different, bigger thing. |
| **4** | **Is a cultivated infection a WEAPON?** | If a vial can be thrown, Infection becomes an offensive tool and §8.1's "no Force by default" has to be read against a party who can inflict tiers at will. ⚠️ This is the call with the widest blast radius. |
| **5** | 🔴 **The tier ladder has to be settled FIRST.** | A type/strain access table needs to know how many rungs it has — and `ITEM_TIERS` is **5** while `AFFIX_TIERS` and `BOX_TIERS` are **6**. See the note below; **it is the same defect the owner flagged separately.** |

---

## I-6 · The ladder problem this runs into (and the owner's "6th level" note)

§12.3's access table maps **five** item tiers onto **six** modifier tiers:

| Item tier | Modifier access |
|---|---|
| Crude | — |
| Basic | Lesser |
| Quality | Normal |
| Superior | Higher |
| Exceptional | **Legendary** |
| — | **Mythic** ← no item tier reaches this |
| — | **Godly** ← nor this |

🔴 **Two modifier tiers are orphaned.** `AFFIX_TIERS` and `BOX_TIERS` both run to six
(…Legendary · Mythic · Godly); `ITEM_TIERS` stops at five. §19.1 pays **Mythic** and **Godly**
boxes and §19.3 says they are *"never for sale, only earned"* — so the prizes exist and
**no item tier can legally carry their modifiers.** The seeded library is clean (all 130
templates sit on the five legal rungs) and the `ItemTemplate` enum enforces it, so this is
a **rules-table gap, not a data bug.**

Three ways out, unruled: **Exceptional reaches Mythic and Godly too** (the ladder is
access-by-slot and the top rung just reaches further) · **a sixth item tier exists** above
Exceptional · **Mythic and Godly are affix-only**, carried exclusively by authored named
items that sit outside the tier table. ⭐ The third is the cheapest and matches how the book
already treats them — *"never random, one-of-a-kind, authored."*
