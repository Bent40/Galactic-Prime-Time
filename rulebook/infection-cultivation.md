# Infection cultivation — types, traits and the research loop

**Status: owner rulings 2026-09-18 folded in.** 🔒 = ruled by the owner. ⚖ = mine, unblessed.
The architecture and all six calls below are the owner's; the mechanisms marked ⚖ are
proposals answering them.

---

## I-0 · The six rulings

| # | Ruling |
|---|---|
| **1** | 🔒 **Affix slots are TIER-BLIND.** *"Items with affix slots can carry any affix of the slot type, regardless of the tier of item. A basic item can have a Godly prefix."* → §12.3's access column **withdrawn**; rulebook **v1.10**. |
| **2** | 🔒 **Every type's T2 does something to EXISTING conditions** — conditional per type — **and one type advances everything**, which makes that a build option. |
| **3** | 🔒 **Infection resistance comes from the same source as poison resistance — the body's own fight mechanics, probably PHYSIQUE.** *"We need to think of a better way to allow that."* |
| **4** | 🔒 **A cultivated vial CAN be thrown.** An **airborne** disease grenade fogging a live room is a viable strategy. |
| **5** | 🔒 **Diseases must be RESEARCHED.** They carry **explicit traits**, more common and less common, found and melded. |
| **6** | 🔒 **Cultivation is 100% downtime. No field cultivation.** |

⭐ **Ruling 1 dissolved the blocker.** The 5-against-6 ladder was only a problem because tier
gated *access*; with access gone, Mythic and Godly are not orphaned and **the disease trait
catalog can reuse the same six rarity words with no ladder question at all.**

---

## I-1 · The shape — a disease is an item with slots

**Base + traits**, where the base is §8.2's Infected table and traits are the affixes. Now
that slots are tier-blind (ruling 1), the parallel is exact and there is nothing left to
reconcile:

| Items (§12.3) | Diseases |
|---|---|
| tier buys **slots**, never access | a disease's grade buys **trait slots**, never which traits |
| any modifier of the slot's kind, any tier | any trait of the slot's kind, any rarity |
| the catalog is source of truth over the book | **the disease trait catalog is source of truth** |
| extraction is the real cost | **extraction is the real cost** (I-4) |

⭐⭐ **And cultivation is already written, on the wrong noun.** §20.3's **Melding Station
(10 UT)**: *"Merge 2 same-type items → 1: better base + **ONE** modifier from the sacrifice"*
· **L2** *"keep two modifiers from the sacrifice"* · **L3** *"once per floor the meld bumps
the result one item tier."* **That is ruling 5's meld verbatim, ceiling included.** The
**Farm (10 UT)** is already the biology module (*"ingredient supply… antitoxin crafting
stock"*), so it holds the cultures. **No new module.** And ruling 6 falls out for free —
Melding is a Lounge module, so cultivation is downtime by construction.

---

## I-2 · The TYPE layer — six types, six verbs on other conditions

🔴 **The discovery that shaped this: NOTHING in §8.2 deals recurring damage.** Every tier of
every condition is a **state** — a disability, a destroyed part, a death timer. Burn's "HP
damage" is on application; its tiers are states. ⚠️ So *"prion = damaging"* must not become
the book's first damage-over-time: a flat per-Clock number is §12.7's 4d trap again (3/Clock
is half an F1 torso and nothing at F9). ⭐ **The system's own way of saying "damaging" is
TIER ESCALATION toward a destroyed part**, which is floor-invariant by construction.

🔒 **Ruling 2 is what makes the set coherent: EVERY type's T2 is a verb on your other
conditions.** That is Infection's identity (§8.1 — *"a condition that carries no Force is not
weak; Infection advances everything else"*), and the type decides **which** verb.

**T1 and T3 never change.** T1 prevents healing and the resolution of other conditions; T3 is
the 2-Clock death timer. **Only T2 is typed**, so §8.2's calibration stands untouched.

| Type | Verb | **T2 — what it does to your other conditions** | Why it is that |
|---|---|---|---|
| 🦠 **Opportunistic** | it **COMPOUNDS** | **All other active conditions advance one extra tier at Clock reset** — the current base T2, now a choice | 🔒 ruling 2's build option. ⭐ Medically exact: an opportunistic pathogen only hurts you because you are already compromised — **so the build wants you covered in conditions**, and that is a real, awful way to play |
| 🧬 **Prion** | it **DESTROYS** | Applies **Crushed** to the part it sits on, and advances **that** each Clock reset | Misfolding protein, the body eating its own structure. Parts die; nothing ticks |
| 🍄 **Fungus** | it **TAKES OVER** | Becomes a **Dissolution source at +1/Moment**, and existing Dissolution's threshold **freezes rather than resolving** while it holds | Cordyceps takes the wheel. The 2026-08-18 errata's *escalation rides the SOURCE* knob was built for exactly this |
| 🧫 **Virus** | it **PERSISTS** | Extends T1 upward: **no other condition may be resolved by its ordinary cure** while this holds — only by a cure specific to it. And on itself: **Burn T2 drops it one tier instead of clearing it; time never cures it** | A virus is not worse, it is harder to be rid of. Turns a condition into a quest |
| 🦟 **Bacterium** | it **CARRIES** | On contact with an ally in the same space, passes **itself at T1 — and every other active condition you have, at T1** | Infection is how things travel. ⭐ The party-level threat, and why a quarantine is a *place* (F3 built that already) |
| 🪱 **Parasite** | it **FEEDS** | At Clock reset, **removes one tier of another condition on you and adds one to itself** | The one that *helps* — right up until it is T3. And it is literally the five parasites |

⭐ **Six verbs, zero new numbers, and every one of them is a rule the book already performs.**
Nothing here needs a floor-scaling constant, which is the whole reason it survives L-23.

---

## I-3 · TRAITS and the research loop (ruling 5)

A type is what a disease *is*. **Traits** are what it additionally does, and they are the
found-and-melded layer.

🔒 **A disease you have not researched is UNKNOWN.** You know you are Infected. You do not
know the type, and you do not know the traits. ⭐ **This is the `PUBLIC READS ONLY`
convention the codebase already runs on** (`items-batch-c.js` C-4: *"growth items —
story-granted; PUBLIC READS ONLY"*, with no `specialEffects` field at all). **The card shows
what anyone could see by looking; research reveals the rest.** Third noun, same convention.

**The loop: FIND → RESEARCH → CULTIVATE → DEPLOY.**

| Step | Where | What happens |
|---|---|---|
| **Find** | in the field | A **sample** — from a corpse, a bloom, a Reservoir, or out of your own body. An item; it goes in the Farm's stock |
| **Research** ⚖ | the **Farm** | One downtime action per sample. Reveals the type, then traits **cheapest-rarity first**. A Common trait costs one action; rarer traits cost more, or need a second sample of the same disease to compare against |
| **Cultivate** | the **Melding Station** | Merge sample into disease: better base + **ONE** trait from the sacrifice. L2 keeps two. L3, once per floor, upgrades the grade |
| **Deploy** | your body, or a vial | Ruling 4 — see I-5 |

**Trait rarities use the modifier words** (ruling 1 made them free to reuse): Lesser · Normal
· Higher · Legendary · Mythic · Godly. ⚖ **A first catalog, rarity-sorted:**

| Rarity | Trait | Effect |
|---|---|---|
| Lesser | **Dormant** | Does not advance until a trigger fires (entering combat · eating · taking Burn) |
| Lesser | **Blood-borne** | Transmits on an open wound only |
| Lesser | **Slow** | Advances one Clock slower. *(The trade every cultivator makes to keep a disease alive in stock)* |
| Normal | **Airborne** ⭐ | Transmits through the air. **This is the one ruling 4 needs** — see I-5 |
| Normal | **Aggressive** | Advances one Clock faster, **and gains an entry on its cure list** |
| Normal | **Symbiotic** | While at **T1 only**, grants one small thing. Advancing past T1 loses it |
| Higher | **Hardy** | Resistance must **exceed** its tier to touch it, not merely match |
| Higher | **Selective** | Names a category it does not take — *humans* · *demons* · *the crystallised*. ⭐ The trait that lets you throw a vial into a room you are standing in |
| Legendary | **Latent** | Sits at T0, invisible and inert, until a named condition is met. Research does not reveal what the condition is |
| Mythic | **Chimeric** | Carries a **second type**, and both T2 verbs fire |
| Godly | ⚖ *unwritten* | Reserved. A Godly disease should be an authored, named thing — the same way §19.1 treats a Godly box |

⭐ **`Selective` is the load-bearing one** and it is why traits had to exist at all: without
it a thrown vial is a weapon you cannot use near your own party, and ruling 4 would be
self-defeating. With it, **the research loop is what makes the weapon usable** — you do not
get a safe grenade, you *develop* one.

---

## I-4 · Extraction is the cost (the §12.3 mirror)

Ruling 1 moved the cost from access to extraction, and the same move applies here:
**you may put any trait on any disease. Taking one back off is what hurts.** ⚖ Mirroring
§12.3's ladder exactly — Lesser/Normal extract with a chance to destroy the trait, Higher+
**drops the disease a grade**, Legendary+ **kills the culture**. A Mythic `Chimeric` is
therefore a one-way build.

---

## I-5 · Throwing it (ruling 4)

🔒 **A cultivated vial may be thrown.** An **Airborne** disease in a breakable container fogs
a room; §7.3's **area does not divide**, so a fog covering nine spaces infects nine targets at
**full tier**.

⭐⭐ **And it does not break anything, for a reason that was already written.** §8.1:
**Infection carries no Force.** A disease grenade deals **zero damage** — it only sets up.
That is exactly the hole the 2026-09-14 playtest correction identified from the *other* side:
*"the mobs that still matter to an armoured party are the ones that deal no damage at all…
Chill/Poison/Infection carry a TIER and NO Force, so flat resistance never touches them."*
**A disease grenade is the party's version of the Spore-Drunk's puff**, and it answers §21.7's
28%→83% gap from the player's side of the table.

⭐ **The boss check passes without anyone having planned it.** §21.3 gave the Set 1 roster
diverse, justified resistance *before this weapon existed* — and it happens to answer:
Nullrot **Infection 8**, the Dragon in the Foundations **Infection 8**, the Doorward
**Infection 6**, THE MASKED **Infection 3**. **Every boss whose story is the plague already
shrugs it off.** Nothing needs re-statting.

⚠️ **The real cost is friendly fire.** Area does not divide, so a vial thrown into a melee
takes your own people too — the same shape as the Bloody Artillery eruption, and the same
answer: `Selective`, or don't be standing there.

---

## I-6 · Resistance (ruling 3) — the one that still needs a decision

🔒 **Owner: infection resistance comes from the same source as poison resistance — the body's
own fight mechanics, probably Physique.** *"We need to think of a better way to allow that."*

🔴 **The hole is real and it is visible in §3.2's own table:**

| Trait | Every … past 10 | Grants |
|---|---|---|
| Physique | 5 | +1 max HP to every body part |
| Reflexes | 12 | +1 **physical** resistance point (Bleed · Crush · Burn) |
| Mind | 15 | +1 **psychic** resistance tier (Dissolution) |
| Charm | 20 | +1 Camera Call stack |

**Reflexes buys Physical. Mind buys Psychic. NOTHING buys Affliction** (Chill · Poison ·
Infection) — §10 says outright that it *"has no automatic source: it is GM-awarded."*
⭐ **Physique is the trait with no resistance row, and Affliction is the group with no trait.
They are each other's missing half.**

⚠️ **But you cannot simply hang the current rule on Physique, and this is the "better way"
the ruling asks for.** §10 makes **tiered resistance = immunity to that tier and below.**
Immunity has three or four rungs; Physique climbs to **110 by F9** (L-19). Any divisor either
makes a mid-campaign contestant immune to the 2-Clock death timer, or makes the row worthless.
**A binary ladder cannot ride an infinite stat.**

⭐ **The fix already exists in the book, applied to the other half of the problem.** §10, on
Dissolution: *"each psychic tier adds **+1 Clock of grace** before the Hold Threshold opens.
It buys time, never immunity."* **Mind's resistance was already converted from immunity to
TIME.** Do the same here.

> ⚖ **PROPOSED — §3.2 gains a Physique row, and affliction resistance buys TIME:**
> **Physique, every 12 points past 10, grants +1 affliction resistance** — and **each point
> delays the next advancement of any Chill, Poison or Infection on you by one Clock.**
> **Never immunity.**

⭐ **Why this is the right shape, not just a working one:** immunity is a vaccine; **delay is
an immune system.** You still catch it, you just fight it off — which is the owner's *"your
body's own fight mechanics"* stated as a mechanic. And it scales forever without ever
printing the word immune.

⚙️ **Checked against the curve (L-19):** F1 a focused build is ~14–18 → **0**. So the tutorial
and F1 have no affliction defence at all, which is correct — that is where the crystal is
supposed to be terrifying. F5 main stat 48 → **3 Clocks**. F9 110 → **8**.
⚠️ **Eight Clocks at F9 is effectively immune to ordinary disease, and that is fine** — an F9
contestant is a practical god, and the floor answers with `Aggressive`, `Hardy`, a higher
entry tier, or a source that escalates faster (the Dissolution errata's knob, which works
here unchanged). **Both dials already exist.**

⚠️ **One drift to check while §3.2 is open:** that table's Physique row still reads *"+1 max
HP to every body part"*, but **L-18 ruled part HP scales off TOTAL trait points, not
Physique alone.** The row and the ruling may no longer agree. Flagged, not touched.

---

## I-7 · What is still open

| # | Call |
|---|---|
| **1** | ⚖ **The resistance mechanism (I-6)** — delay-not-immunity, and the `/12` divisor. The *source* is ruled; this is the "better way". |
| **2** | ⚖ **The trait catalog (I-3)** — eleven traits drafted, the Godly slot deliberately empty. |
| **3** | ⚖ **Research costs** — one downtime action per rarity step is a first guess. |
| **4** | ⚖ **Extraction ladder (I-4)** — mirrored from §12.3 without checking whether a disease should be *more* fragile than an item. |
| **5** | **Does a type change what resistance answers?** ⚖ Recommend **no** — resistance answers *Infection*, one number on the sheet. That makes `virus` and `Hardy` the only ways to threaten a resistant party, which is a good job for them to have. |
