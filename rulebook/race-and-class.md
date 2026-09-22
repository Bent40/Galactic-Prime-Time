# Race and Class — design (2026-09-15)

> ✅ **STRUCK 2026-09-22 — most of this file IS ruled; the header outlived its own document.**
> Explicit owner rulings carried below, all **2026-09-15**: **R-3** — the Surgeon's Table does
> **three verbs, ADD · REMOVE · CHANGE**, and **modification does NOT grant a Mark** ·
> **C-1** — **a Mark unlocks a SET OF CHOICES** (with a common pool needing no key, and
> delaying the pick valid) · **R-4** — **size sets base part HP** and the per-size tables ·
> **R-4.1** — **size buys PASSAGE**, and animals are the specialised race. **R-1** rests on
> book canon (§20.3's Surgeon's Table already names race change as its L1 service).
> ➕ **2026-09-19** added the starting-skill quotas and `raceLock`, which land on R-2/R-4.
> 🔴 **What is still genuinely open is R-4's last row — the racial package per race.**
> The original follows, struck.

~~🔴 **PROPOSAL. Nothing here is ruled.**~~ Owner direction, two turns:

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
needs and the field assimilation needs are the same field.* ~~Proposed:~~
**✅ BUILT 2026-09-15 — struck 2026-09-22:** `weaknesses[].mode` = `double` (default) | `heal`,
per-part overridable, keeping the required `why` — shipped exactly as proposed.
`WeaknessSchema.mode` (enum, defaults `double`) plus **`BodyPartSchema.weaknesses[]`**, with a
part **overriding** the body for its own type; `checkWeaknessSet()` gates it over the body and
every part, and `WEAKNESS_MODES` is duplicated in the seeder so `--check` still needs no
`node_modules`. Rulebook §7.3 carries the rule (*"resistance ADDS between body and part; a
weakness REPLACES"*), and the admin `WeaknessRow` editor has the doubles/HEALS selector.
⭐ **So an L3 boss-part graft that heals from fire is expressible today.**

🔒 **RULED 2026-09-15 — three verbs, not one: ADD · REMOVE · CHANGE.** My draft
said a graft *replaces* a part. It does more than that, and the extra verbs
matter:

| | |
|---|---|
| **CHANGE** | swap a part for another creature's. What I had proposed |
| **ADD** | a fifth limb, a tail, a second set of arms |
| **REMOVE** | delete a part entirely — ⛔ **except the lethal ones.** Every body needs a head-equivalent and a torso-equivalent (§7.1) |

⚠️ **ADD broke my limiter and needed a new one.** I had said *"you have six parts,
so the cap enforces itself."* You don't, if you can add. ⭐ **But no cap is needed,
because every part you add is a part you must armor, heal and defend:** §12.6 buys
resistance **per part**, §12.6 *also* drops that resistance by the part's condition
tier, and §21.6's Body category subtracts Force per tier **on the limb you swing
with**. **Four arms is four things to break, four pieces of armor to buy, and four
ways to lose Force.** The rate is capped by downtime (§20.1, two actions) and the
menu by the module's level.

🔒 **RULED: modification does NOT grant a Mark.** My proposal is dropped, and the
reason is better than the proposal: ⭐ **the Corporation sells it, so the
Corporation does not brand you for it.** A Mark is what the ledger records about a
**deed**; a purchase is not a deed. **Deeds earn keys; money buys bodies.** The two
systems stay clean.

---

## C-1 🔒 RULED 2026-09-15 — a Mark unlocks a SET OF CHOICES

> Owner: *"We can have race types and class types unlocked via mark, which will
> hold a few choices. We can have common classes to choose in general, and rarer
> classes/races unlocked via mark. That would mean delaying your class or race
> choice is valid."*

⭐ **This answers "how is a Class different from a Mark" better than my proposal
did.** I had said *a Mark unlocks a Class*, one to one. The ruling is sharper:

> **A Mark is a KEY, and it opens a CABINET — a few choices, not one.**
> **And there is a common pool that needs no key at all.**

| | needs | |
|---|---|---|
| **Common** classes and races | nothing | choosable generally, the standing menu |
| **Rare** classes and races | **a Mark** | each Mark holds a few options; the Mark says which cabinet |

⭐⭐ **And the real design win is the third sentence: DELAYING YOUR CHOICE IS
VALID.** The pick becomes a **held resource**, not a creation-time lock — you can
sit on it because a deed two floors from now might open something better. That is
exactly DCC's feel (classes are *offered* as you go, not chosen at the start), and
it costs one rule: **an unspent choice keeps.**

### ⭐ What this fixes that nothing else was fixing

**Only two deeds in all of Set 1 are unambiguously good.** The campaign brands you
for being right about as often as for being wrong — `Regicide` for killing a child
who was a god's last follower, `Martyr` for killing the man who was the cure,
`Two Million` for a number you caused. Every one of those was **pure cost**.

🔒 **Now every Mark pays.** ⭐ **`Regicide` is socially catastrophic AND it is a
key.** The consequence is not softened by one point — the grudges still hold, the
doors still shut, `Witness` still never fires near a queen you killed — but the
brand on your body **opens a cabinet nobody without it can open.**

⚙️ **That is the shape the system wanted all along:** §18.4 already says a Mark
*"might unlock new interactions, not necessarily good."* This is that sentence
with a mechanism behind it.

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

🔴 **Still open:** whether a re-govern is the *whole* of a class or just its spine,
and what a *common* class looks like next to a Mark-gated one. Scope after Incinedile.

---

## R-4 🔴 THE SIZE / RACE STAT PASS — the task the Sasha ruling opens

> Owner: *"Sasha is fine with 3-hp torso. She's a small animal. That's why she has
> less hp. We need to sort the basic races' stats with sizes and that considered."*

🔒 **Ruled: size sets base part HP** (now §7.1). Medium is the book's standing
table (Head 2 · Torso 5 · Arms 2 · Legs 3); Sasha is Small at Torso 3.

### ⭐ The finding that should shape the table: the gap closes by itself

§3.2's growth is **flat** — +1 per part per 5 total trait points, the same for
everyone. So a Small body is not permanently 60% of a Medium one:

| | creation | F1 | F3 | F5 | F9 |
|---|---|---|---|---|---|
| Medium torso | 5 | 7 | 11 | 17 | 35 |
| Small torso | 3 | 5 | 9 | 15 | 33 |
| **Small as a share** | **60%** | 71% | 82% | 88% | **94%** |

⚠️ **So size is an EARLY-GAME fact and it is biting right now, in the tutorial,
which is exactly where it is worst.** By Floor 3 it is a rounding error.

⭐ **Two consequences for the table:**
1. **Bases only. Never multipliers.** A multiplier would make Small permanently
   worse; a base makes it a starting condition the campaign heals.
2. **The early-game answer is ARMOR, not a correction.** At the tutorial's press
   of three roaches, a Small contestant at **armor 0 loses the torso** and at
   **armor 1 does not.** One worn piece is the whole difference — a real, teachable
   lesson in the room where it happens.

### 🔒 R-4.1 RULED 2026-09-15 — size buys PASSAGE; the race carries the rest

> Owner: *"What small buys depends on the animal. Any animal that's small can go
> through a small entrance, but animals are basically the highly specialized race."*

⚠️ **My framing was wrong.** I had size as a *trade* — Small buys mobility, Large
buys reach. It is not a trade:

| | |
|---|---|
| **Size buys ONE thing: passage** | a smaller body goes where a larger one cannot. §11 already gives gaps real dimensions; this makes **size alone** answer them, no skill required. Symmetric, unnumbered, GM-read |
| **Everything else is a COST** | a smaller body is simply a smaller body |
| **The compensation is the RACE** | and races are **not balanced against one another** |

### 🔒 The race axis: how far a race specialises

| race | shape |
|---|---|
| **Human** | ⭐ **the flat one.** No racial skill and nothing closed. Thematically exact — the show is about abducted humans, so Human is the unmarked default |
| **Animal** | 🔒 **the specialist.** A tall, narrow spike and a real bill for it |
| **Robot · AI** | ✅ **DISCONTINUED — struck 2026-09-22.** Owner, 2026-09-19: *"robots are probably gonna be discontinued."* It is **out of `CREATION_RACES`** (`['Human', 'Animal']`) so no new contestant picks it, but deliberately **kept in `RACES`** — XQUEZ/T is that race and dropping the value would break a live sheet — and its three racials (`Voicebox`, `Generate Visual Media`, `Ignore All Previous Commands`) are pinned `raceLock: 'Robot / AI'`. So the race has a *shape* after all: **a closed pool with exactly one holder.** ~~🔴 unwritten. ⚖ Mine, unblessed: the **modular** one — the race the Augmentation Hub (§20.3) speaks to natively…~~ |

⭐⭐ **An Animal's spike is CONDITIONAL, and that is the cost paying for itself.**
A sea lion's Swim is enormous *in water* and nothing in a desert — so **the floor
decides what a race is worth that week**, and Set 1 is forest, desert and city.
**No balancing number is required; the campaign prices the roster by itself.**

⚙️ **Specialisation is not only skills — it is the BODY.** §7.1 already shapes a
non-standard layout (flippers, not arms; four legs, not two). **Size, parts and
racial skills are one package.**

⭐ **And that is why the Surgeon's Table exists.** §20.3's add · remove · change
is the one place the package can be edited, so **a specialist stranded on the
wrong floor is not trapped — they are one downtime action from a graft.** Race,
size and the Lounge close into a loop.

⚠️ **A SMALL ANIMAL is therefore the highest-variance start in the game** — the
smallest body (11 against a Medium's 17) **and** the narrowest spike. Correct, and
it is why `Nightlurking` reads the way it does.

### What the table still needs

| | |
|---|---|
| ~~What Small buys~~ | ✅ **RULED — passage**, and the race carries the rest |
| **The racial package per race** | 🔴 Still unwritten, and now the *only* remaining piece: **what each Animal's one spike is.** A race is an identity line plus its package, and this is what a *common* race choice picks from |
| ~~**Robot · AI's shape**~~ | ✅ **CLOSED — struck 2026-09-22: DISCONTINUED**, not designed. Owner, 2026-09-19: *"robots are probably gonna be discontinued."* Hidden from `CREATION_RACES`, kept in `RACES` for the one live holder, three racials `raceLock`ed to it. ~~🔴 Open — the one race with no stated frame~~ |
