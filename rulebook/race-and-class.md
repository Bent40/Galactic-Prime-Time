# Race and Class — design (2026-09-15)

🔴 **PROPOSAL. Nothing here is ruled.** Owner direction, two turns:

> *"Technically race can be just whatever you add to yourself, and you don't exactly
> race change per se. We could also just add a race change option besides the
> modification option."*
> *"We already have modification tables of all kinds in the lounge, so we could have
> that allow for race change, and later as updated, race assimilation (taking only
> a part of a race)."*
> *"Classes should be a thing that buffs all kinds of abilities they use. If we follow
> the DCC format, the classes can be earth based, but also anything from our story,
> that's myth, sci fi, whatever we want."*

---

## R-1 ⭐ The Lounge already has all three rungs. Nothing needs building.

**§20.3, Modification Center → Surgeon's Table (20 UT):**

| | what the book already says | what it is |
|---|---|---|
| **L1** | *"Reattach severed parts · prosthetic fitting · **the canonical race-change service**"* | 🔒 **Race change, already canon** |
| **L2** | *"**Animal-part grafts** (GM-statted from the beast you brought back)"* | ⭐ **This IS assimilation** — taking only a part of a race |
| **L3** | *"Re-genesis: **boss-part grafts** with their quirks; restore one destroyed part permanently per floor"* | ⭐ **Assimilation from things that should not be assimilable** |

⭐ **So the owner's "later, as updated" is literally the module's own L2→L3 upgrade
path**, written months ago. **The ladder exists, is priced, and sits in the right
building.** What is missing is not a system — it is **what a graft does**, because
today both rows say *"GM-statted"* and stop.

⚠️ **And that is the whole scope of this work:** write the graft rules. No new
module, no new currency, no new track.

## R-2 Race change (L1) — the whole package, swapped

**Race in this game is already "whatever you add to yourself."** The data model
says so: `RACES` is Human / Animal / Robot · AI plus a **freetext `identity.species`**.
A race is an identity line plus **its racial package** — one or two skills the
species has and others do not (Swim on a sea lion, claws on a cat).

> **A race change swaps the package.** You lose the old racial skills and gain the
> new ones at the level you held the old ones. Identity and species text change.
> One downtime action (§20.1), the Surgeon's Table's price.

⚙️ **It is whole-body and it is broadcast.** The Corporation does not perform a
quiet surgery; a contestant walking out of the Lounge as something else is an
episode. Charm-side consequences are the GM's (§17).

## R-3 Assimilation (L2/L3) — take only a part

> **A graft replaces ONE body part with another creature's, and that part carries
> ONE trait the donor actually had.**

Four limits, and ⭐ **every one of them is a rule that already exists:**

| limit | where it comes from |
|---|---|
| **You have six parts.** Head · Torso · two Arms · two Legs | §3.2. **The cap enforces itself** — assimilation is bounded at six, and each one costs you the part you had |
| **A graft's trait must be ON THE DONOR'S STATLINE** | ⭐ The same anti-arbitrariness shape as §21.3's required `why`. **You can only take what the creature actually had — so the bestiary IS the catalogue**, and 53 entries are already written with their reasons |
| **The trait lands on the PART** | §12.6 already makes resistance per-part, and `BodyPartSchema` already carries `resistances` + `universal`. A grafted arm's Burn resistance lives exactly where the rules already put resistance |
| **Boss grafts come with their quirks** | The book's own L3 wording. **The downside is part of the object, not a tax bolted on** |

⭐⭐ **And it closes a gap we found yesterday.** The Incinedile's **`fire_heals`**
has no field — §7.3 has `weaknesses` (doubles) and `resistances` (subtracts), and
**healing from a type is a third thing.** An **Incinedile arm graft that heals from
fire** is precisely what an L3 boss-part graft should be, so *the field that boss
needs and the field assimilation needs are the same field.* Proposed:
`weaknesses[].mode` = `double` (default) | `heal`, per-part overridable, keeping the
required `why`.

🟡 **Open, mine not the owner's:** does being modified grant a **Mark**? It fits
§18.4 exactly — a deed done *to* you, permanent, physical, *"not necessarily good"* —
and a contestant who bought a body from the production is something the causality
ledger would record. But it is a real cost and it should be the owner's call.

---

## C-1 Class — the question that has to be answered first

DCC-format classes are **earned from what you did**, absurdly specific, and named
for the weight of the deed. 🔴 **That is §18.4's authoring rule word for word.** So
the real question is not how classes work:

> **How is a Class different from a Mark?**

Both are granted by deed, permanent, in-world real, and named to provoke. Without
an answer we would be building a second system for a rule we already have.

**Proposed answer: a Mark RECORDS, a Class CAPACITATES.**

| | Mark | Class |
|---|---|---|
| what it is | the Corporation's **causality ledger** — what the world remembers you did | what you got **good at** |
| when it acts | **presence-activated** — it lights where its consequence is | **always on** |
| what it does | points at a cause; gates items; *"not necessarily good"* | multiplies what you already do |

> ⭐ **A deed grants a Mark. A Mark can unlock a Class.** The ledger says what you
> did; the class is what you did often enough to **become**.

### C-2 ⭐ The cheap shape: a class RE-GOVERNS

L-17 already ruled that **skills scale with their governing trait.** So a class can
change **which trait governs** — a Brawler makes your Charm-governed skills scale
off Physique.

- **One number. No new machinery.**
- ⭐ It makes a class **identity-shaped rather than +X-shaped**: you do not get
  stronger, you get *differently* strong.
- ⚙️ **And it is the only shape that does not break L-19's budget.** The 150-level
  curve and its anchors (F5 main stat 48 · F9 practical gods) were computed without
  classes. A class granting raw bonuses has to be paid for **out of** those levels or
  the anchors move. **Re-governing changes which trait powers a skill, never how much
  total power exists** — so it is orthogonal and free.

⚠️ **Scope warning.** Race is **one ruling and one field** — the module, the ladder
and the price already exist. **Class is a Set-2-sized project**: it touches L-17,
L-19, §18.4, the skill model and the sheet. Recommend **race now, class scoped after
Incinedile.**
