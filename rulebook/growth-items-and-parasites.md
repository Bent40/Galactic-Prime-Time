# Growth Items and the Five Parasites

**Status: DESIGNED 2026-09-17**, on the owner's Bloody Artillery direction. Data:
`server/seeds/items-parasites.js`. Companion to `tutorial-enemy-pass.md` (the hatchery
they drop from).

---

## G-0 — The category already existed

`ITEM_SUBTYPES` has **`Growth`**, and `items-batch-c.js` carries the convention in a
comment on the C-4 block:

```
// ——— C-4: growth items (3) — story-granted; PUBLIC READS ONLY
```

Its entries have **no `specialEffects` field at all** — *"A woven bracelet. It's warm."*
The card shows only what anyone could see by looking at it; the mechanics live with the
GM. ⭐ That is *"super good without my players knowing they're good,"* written months ago
and never filled in. The whole category held **four items** before this pass.

⭐ And the owner's own older campaign already ran this at the table: the item cards in
`drive-download-…` are name + rarity + art with an **empty description banner.**

---

## G-1 🔒 THE SEED RULE — Bloody Artillery, translated

The owner's legendary from an older campaign:

> **Bloody Artillery** — *allows to summon (health lost during current combat / 2)
> artillery once per combat. 5d6 in 5 meter and 3d4 in 10 meter radius. legendary.*

**What it actually does, stripped of its system: it converts damage you have TAKEN into
damage you DEAL.** That is the seed.

### 🔒 The rule

> **A SEED is planted in an open wound and feeds on what happens to you.**
>
> **PLANTING.** One downtime action, or one Clock out of combat. The chosen part must be
> at condition tier ≥ 1 — *you have to be hurt to plant it.* From then on that part
> carries **a standing condition tier 1, permanently.**
>
> **THE ERUPTION.** Once per combat, 1 Moment. The seed deals **(the Force of damage you
> have taken this combat ÷ 2)**, rounded down, as **Bleed**, to **everything within its
> radius** — §7.3, area does not divide, so every target takes the full amount and
> applies its own resistances. **Allies included.** It swells visibly for one Moment
> first; that warning is the counterplay (§21.8's *announce the gathering*, restated).
>
> **GROWTH.** What grows is the **RADIUS**, driven by the seeded part's **max HP**:

| part max HP | stage | radius |
|---|---|---|
| planted | **Seed** | **1** (your space and adjacent) |
| **10** | **Cane** | **2** |
| **20** | **Bough** | **3** — and it can be **harvested** |

> **HARVEST** (🟡 proposed, unblessed — mine, not the owner's). At Bough the seed may be
> cut out at the Forge. It is destroyed and yields **one band-current material**: the
> thing it made out of you. What comes off is a material, not a part (§12.7).

### ⭐⭐ Why this is better than what I proposed

**It dissolves the L-11 conflict instead of working around it.** L-11/L-14 rule that
**stats are the KEY, not the gun** — trait growth never buys damage. My draft had the
seed converting part max HP into Force, which crosses that line, and I proposed a
fiction-level dodge (*"the Force is the seed's, not yours"*) to survive it.

**Bloody Artillery needs no dodge.** Look at where each number comes from:

- **The damage is keyed to DAMAGE TAKEN.** No trait feeds it. L-11 is never invoked.
- **The growth is keyed to RADIUS.** Also not damage. Under §7.3 area-does-not-divide,
  radius *is* power — but it is **positioning** power, which the game already gives away
  free in terrain and spacing.

⭐ **Neither axis is a stat, so the ruling is untouched, and the owner's original seed idea
survives intact** — part max HP is still the growth curve, it just drives ground covered
instead of numbers.

### ⭐⭐ The price and the payload are the same organ

The seeded part carries a permanent tier 1. Under **§12.6** a conditioned part **resists
less**, so it takes *more* damage — **which is the seed's ammunition.**

⭐ **The cost feeds the gun.** That is not a tax bolted onto an item; it is the item's own
logic. *The seed wants the wound open.* And §21.6 Body takes −1 Force off any swing made
with that limb, so the price is real and it is paid every Moment, not once.

### 🔒 WHICH PART IS THE DECISION

Not which item. **The part.**

| | |
|---|---|
| **Torso** (base 5) | reaches 10 and 20 **first** — fastest growth, biggest radius, soonest. And it is the part whose resistance you least want down. **Highest ceiling, highest price.** |
| **Arm** (base 2) | grows slowly, and §21.6 Body means you swing at −1 Force **forever** if you fight with it |
| **Leg** (base 3) | the cheap answer — slowest growth, almost no combat cost |
| **Head** (base 2) | slowest of all, and a permanent tier on a lethal part |

⭐ The currency is the **body**, not the UT. That is the build-around decision.

### ⚙️ Calibration — checked, not asserted

Eruption = damage taken ÷ 2, as an area.

| | body total | took | erupts for | that floor's mob HP |
|---|---|---|---|---|
| **Tutorial** (Medium, 14 pts) | 17 | 10 | **5** | 2 |
| **Tutorial** (Sasha, Small) | 11 | 6 | **3** | 2 |
| **F1** | 24 | 12 | **6** | 5 |
| **F5** | ~100 | 50 | **25** | 9 |
| **F9** | ~197 | 100 | **50** | 13 |

An F1 eruption is **about one good swing, delivered as an area, once per fight, paid for
in blood.** The ratio holds on every floor because §7.3 calibrated both sides of the
exchange together — ⭐ **the seed is floor-invariant by construction and never needs
re-basing.** And the owner's original **÷2 survives translation unchanged**: the number
was already right for a system it was never written for.

### ⚠️ Does it reward getting hurt?

Somewhat — and **the system already prices that without a new rule.** §12.6 drops a
conditioned part's resistance; §21.6 Body subtracts Force from every swing with that
limb; damage is per-part and does not wash off. Deliberately wounding yourself makes you
worse at everything else, and the eruption is **once per combat**, so it cannot be farmed.

⭐ What it *does* create is a real tension: **hold it for a bigger blast and you might die
holding it.** The item's optimal play is to be as close to dead as possible — which is
exactly what a parasite that likes danger would want, and it is superb television (§17.8).

---

## G-2 🔒 THE PARASITES — what they are

**Loot they cannot escape** (owner). No save, no roll: after the hatchery, **something
crawls into skin or roboparts.** XQUEZ/T's goes into the machine, which is worse.

🔒 **Little Bro made them**, the way he made the suit and the doll. Thrown out for being
weak, he answered by **making more family** — and the party inherits his children. That
makes them his §17.6 carve, and it costs nothing to invent.

### 🔒 THE DESIGN RULE — a parasite MEASURES what it EATS

A parasite gives you **a quantity with an attitude and no interpretation.** It never
decides, never concludes, never advises.

⭐ **And the gauge and the appetite are the same organ.** It senses the thing it feeds on
— which is why it measures at all (it is looking for dinner), why it is *delighted* when
the reading is high (it is hungry), and why **the name can honestly hint the gauge.**

### ⭐ They are already priced by rules that exist

- **§21.6 — knowledge is NOT a preparation step.** It *doubles* a matched weakness; it
  does not add Force. So a parasite that reveals something pays in the one currency the
  system already has a home for, **and adds nothing on its own.**
- **§21.7** already computes a room's DANGER. Dread-Eye reads that dial; the number exists.
- **R18** (game repo) rules that *"warmth, likability and parasocial pull live in the
  AUDIENCE systems, never in the Charm number."* ⭐ A parasite is an audience system made
  flesh — the cleanest home that ruling leaves open.
- **`Parasocial` is tag #79**, live, defined in §18: *"They don't know you. They feel like
  they do. This is becoming a situation."* ⭐ That is the parasite describing itself — the
  tag was written for an NPC's attachment to **you**, turned inward.

### 🔒 ALL FIVE ARE SEEDS

Identical mechanism, identical Bleed eruption, identical radius curve (G-1). **The gauge
is the entire difference**, which is what makes the choice about the roleplay tool and
nothing else.

⭐ **And no gauge is strictly best, because the FLOOR decides.** The same logic that prices
an Animal's racial spike: a sea lion's Swim is enormous in water and nothing in a desert.
Sincerity is gold on F1 and starving on the Hard route; Gravemoss is the reverse.
**The party cannot know which floor they will draw.** That is the bet.

### 🔒 THE ALLOCATION — the system prompts, the party chooses, no duplicates

Five sealed specimens arrive. The **Corporation's overlay** prompts the party to allocate
them — **one each, and no two contestants may hold the same one.**

⭐ Getting to choose *is* the bonus. And it is a Corporation move: **five contestants
arguing about who gets the lie-detector is a scene**, which is the only reason the show
offers a choice instead of assigning them.

🔴 **On a party of four, the fifth specimen stays in the bag, sealed and alive** — a scene
of its own, and a slot waiting for a fifth contestant.

---

## G-3 — THE FIVE

Every card below is **PUBLIC READS ONLY**. The GM half is never printed.

### 👁 Dread-Eye — *gauges DANGER*

> **THE CARD** · Misc · Crude · Growth
> *A specimen jar, hatchery stock. Something pale and lidded. It is warm, and it is
> facing you.*

**THE GAUGE — close your eyes.** No Moment, no cost. It opens its own.
**The number of eyes you see is how much danger is in the scene** — the GM's honest read,
not an enemy count.

> 1 eye — nothing here · 2–3 — a standard room · a handful — this is a hard room ·
> **too many to count — something on this floor is above you** · **and a boss makes it
> SMILE.**

**THE RELATIONSHIP — it adores you and it wants you in danger.** Not on your side, not
against you: **it wants the show to be good. It is the audience, living in you.**

⚠️ **The cost is the delivery.** It is *delighted* when you are about to die — perfectly
accurate information, appalling manner. ⭐ Safe too long and it goes **listless**: it does
not punish you, it stops enjoying you, which is the Corporation's own incentive with a
face on it. Carrying it pushes **`Parasocial`** toward Reinforced.

🎯 **GM: never say a number.** Say what they see behind their eyelids.

### 🌿 Falsewort — *gauges SINCERITY*

> **THE CARD** · Misc · Crude · Growth
> *A grey sprig with a fleshy root. Kept in brine. The leaves curl when anyone speaks
> near it.*

**THE GAUGE.** It sits under the tongue. When someone speaks near you it **curls** — and
how tightly it curls is **how much the speaker does not believe what they are saying.**

> flat — they believe it · a twitch — they are shading it · a tight curl — **they know
> it is false.**

⚠️ **IT MEASURES BELIEF, NOT TRUTH.** That distinction is the whole item.

⭐⭐ **And Set 1 is built on sincere liars, so Falsewort is a starving parasite that
confirms the campaign's thesis instead of breaking it.** The Doorward warns you
**truthfully** and it is still a lure. The Double sincerely believes she is Vermilia's
elder sister. **Bex has never lied.** Falsewort lies flat in front of all three, the
player concludes *"he's honest, so he's safe,"* and **that is the trap Set 1 was already
built to spring.** Canon precedent: *"Marks stay dark on a doll."*

**THE RELATIONSHIP — it is hungry and this world is not feeding it.** It gets thinner
across the campaign. ⭐ **A contestant who notices their lie-detector is starving has
learned the most important thing in Set 1**, and nothing had to tell them.

### 🫱 The Beggar — *gauges WANT*

> **THE CARD** · Misc · Crude · Growth
> *Small, thin, and already reaching. The jar is scratched from the inside.*

**THE GAUGE.** It points. Near anyone who wants something badly, it **strains toward
them**, and the strength of the pull is **how badly.** ⭐ It does not say what they want —
only that the wanting is there and how big it is.

> slack — this one is content · leaning — there is something they would like ·
> **straining at the skin — this creature is organised entirely around one want.**

⭐⭐ **It reads every antagonist in Set 1**, because Set 1's antagonists are all appetite:
Bex wants to be human, Vermilia wants a verdict, the Loong wants a cure, Nullrot wants to
be heard — **and the Doorward is the one that comes back SLACK**, because its hunger is
sated, which it also tells you out loud.

**THE RELATIONSHIP — it is envious.** It resents anyone who wants something more than it
does, and it wants you to go and take it from them.

### 🪱 Ringworm — *gauges AGE*

> **THE CARD** · Misc · Crude · Growth
> *A coil of something banded like cut wood. You can count the bands. There are more
> than there should be.*

**THE GAUGE — count its rings.** Held against a person, a place or an object, it **grows
a ring for every year**, and stops. You get a number, and the number is honest.

⭐ *(The name is the instruction. Rings are years, and it is also a real parasite — which
is exactly the register a reality show would name it in.)*

⭐⭐ **Set 1 is made of time and nothing else reads it:** the Doorward has been eating for
**seventy years** · the queen has been digging for **two centuries** · Nullrot's beak is
**older than the capital** that has no memory of it · and 🔴 **the Double is three days
old.** A party carrying Ringworm into the desert court gets a number for "the queen" that
nothing else in the game would ever have given them.

**THE RELATIONSHIP — it is bored of you.** You are new. It has counted older things and
will let you know.

### 🍂 Gravemoss — *gauges DEATH*

> **THE CARD** · Misc · Crude · Growth
> *A wet grey mat that smells like turned earth. It is the only one of the five that is
> quiet.*

**THE GAUGE.** It **thickens** in proportion to how much has died where you are standing
— not bodies present, but **death that happened here.**

> dry — nothing died here · damp — something did · **fruiting — this is a grave, and it
> is bigger than the room.**

⭐ **It reads the Hard route before the Hard route explains itself.** A crystallised city
that looks like statuary comes back **fruiting**, and the party learns those are people
without anyone telling them. It goes quiet in the hatchery — ⭐ *nothing has died there
yet* — and it is the one that will not shut up in the capital's quarantine.

**THE RELATIONSHIP — it is the only one that is kind.** It is a mourner. It does not want
anything from you, it just wants to be where the dead are, and it is **grateful** when you
take it somewhere terrible. ⚠️ **Exactly one of the five likes you for a decent reason**,
and the players should have to work out which.

---

## G-4 — 🔴 Open

| # | Item |
|---|---|
| **1** | 🟡 **The HARVEST is mine, not ruled** — at Bough, cut the seed out for one band-current material. It is the hidden payoff (everyone will read these as a small free attack), but nothing obliges it. |
| **2** | **Friendly fire on the eruption** — written as hitting allies, with a one-Moment swell as the warning. Confirm. |
| **3** | ⚖ **`Ringworm` vs `Yearworm`** — Ringworm is the better joke and lands on a beat; Yearworm is unmissable. Mine: keep Ringworm. |
| **4** | **The rest of the shelf.** These five are the free half. The bought half — the store's growth stock, priced at or under Basic (3 UT) so price is not the tell — is not yet authored. §19.3 closes the store when the Lounge unlocks, so it is a one-time offer and the book already says so. |
| **5** | **The fantasy item coupons** (Basic weapon + one Lesser modifier each) are still undistributed, and they retire with the store. |
