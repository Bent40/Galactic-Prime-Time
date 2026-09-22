# Race packages — the animal roster (DRAFT)

> 🔴 **PROPOSAL. Drafted 2026-09-22. NOTHING HERE IS RULED.** Every animal, every
> skill, every cap and every body layout below is a candidate for the owner to trim,
> rename, re-cap or delete. It answers **R-4's last open row** — *"the racial package
> per race: what each Animal's one spike is"* (`race-and-class.md`) — and it answers
> it at draft strength only.
>
> 🔒 **The owner's instruction this was written to:** *"We need to draft animals and
> their skills. Do a research, find what makes the animal unique, and draft skills
> from there. Duplicate skills can happen to multiple animals, if we, just as an
> example, decide that both elephants and gorillas get a strength skill, it can be
> the same skill, no need to force uniqueness where there isnt."*
>
> ⭐ **So the centrepiece of this draft is RP-2, the shared skill list** — 13 skills
> covering 16 animals. Reuse is the design, not a shortcut.

---

## RP-0 What binds this draft

| 🔒 ruling | where | what it forces here |
|---|---|---|
| **Size buys ONE thing: PASSAGE** | §7.1, ruled 2026-09-15 | No skill below may grant "fits through gaps" as its spike — **the body already does that for free.** `Nightlurking` is the exception and it predates the rule |
| **Everything else about a smaller body is a COST; the compensation lives in the RACE** | §7.1 | A Small animal's package must be the *narrowest and tallest* spike in the draft. Cat, Rat, Crow, Bat, Fennec and Octopus are written that way |
| **Animals are the specialised race; Human is the flat one** | §7.1 | No skill below is available to a Human. Every one carries `raceLock: 'Animal'` |
| **An Animal's spike is CONDITIONAL — the floor prices it** | §7.1 | Every entry below states where it is **worthless**, and that column is as important as the effect. **Races are NOT balanced against each other** and no attempt is made to |
| **Specialisation is not only skills — it is the BODY** | §7.1 | Every entry carries a body layout, not just a skill list |
| **2 general + 2 ANIMAL skills at creation** | ruled 2026-09-19 | Each animal is drafted with **3–4 candidates**, so the pick is a decision and not a handout |
| **Skills scale with their governing trait** | L-17 | Every skill below names one |
| **Most skills cap at 5 or 10; special ones may be designated up to 15** | ruled 2026-09-22 | Caps assigned below. 🔴 See RP-7 #2 — this needs reconciling with §4.2 |
| **No new machinery** | this task | Every effect below is written in Moments, Force, damage types, condition tiers, resistance, passage, grapple (§13), stealth (§15), Dodge Thresholds (§14), Forced Actions (§6), prep steps (§21.6) or Exposure/Camera Call (§17). **Nothing below mints a subsystem** |

---

## RP-1 The five drafting rules I used

**① The fact has to be TRUE.** Every skill below names the real-world biology it came
from, in one line, and every one of those lines was checked this session against
current sources — not folklore. Three popular "facts" were **checked and rejected**,
and the rejection made the skill better each time:

| folklore | what is actually true | what it changed |
|---|---|---|
| *"Chimps are 5× stronger than a human"* | **~1.35×**, and it comes from fast-twitch **fibre mix**, not stronger fibre (O'Neill *et al.*, PNAS 2017) | Killed `Beast Strength` as the chimp's spike. The chimp's spike is **burst**, not mass |
| *"Rats have a collapsible ribcage"* | Rats have a normal rigid skeleton. **The skull is the hard limit** (~20–25 mm); the ribcage compresses ~25% along one axis at constant volume | The rat skill is **"if the head fits"**, which is a far better table ruling than "it squeezes" |
| *"A cat's whiskers measure whether a gap will fit"* | **Contested.** What is solid is the follicle — 100–200 primary nerve cells per whisker | `Whisker-Read` is built on *short-range sensing in the dark*, never on gap-measuring. Gap-measuring is §7.1 passage and is free anyway |

**② A non-standard body RENAMES parts before it re-points them.** A sea lion is not a
weaker human; it is the Large table with the labels changed — Head 3 · Torso 8 ·
two Fore-flippers 3 · two Hind-flippers 4 = the same **25**. ⭐ Where an animal has
*more* parts than six, the total legitimately goes **above** the §7.1 row, and that is
already ruled fine: §20.3's ADD ruling says *"every part you add is a part you must
armor, heal and defend"* — four arms is four things to break. An octopus with eight
arms and an elephant with four legs pay in exactly that coin.

**③ Both lethal parts survive every layout.** §7.1: every body needs a
head-equivalent and a torso-equivalent. Where the anatomy is strange the draft names
which part is which (the octopus's **Mantle** is the torso; its Head is still the head).

**④ HANDS are a stated cost, not an assumption.** The live cast already settles the
register — Sasha wields knives with **forepaws**, Filipe **juggles** on nose and
flippers — so an animal body manipulates, but not equally. Every entry states its
manipulator, and ⭐ **"no hands" is a real bill the Lounge can pay**: §20.3 ADD is one
downtime action, which is the loop R-4 already drew.

**⑤ If the general pool already covers it, do not mint a racial.** `Camouflage` was
ruled **general** on 2026-09-19 — so the octopus does not get a camouflage racial for
being good at hiding; it gets one only for doing something `Camouflage` cannot
(hiding **with no preparation and no cover**). 🟡 That one is still an overlap and is
flagged in RP-7.

---

## RP-2 ⭐ THE SHARED SKILL LIST — 13 skills, 16 animals

**This is the part the owner asked for.** Where the biology is shared, the skill is
literally the same template with the same name, the same cap and the same text. A
Camel and a Fennec Fox both take **`Water-Miser`**; there is no `Camel's Thirst` and
no `Fennec Endurance`.

**Three are already live** and are re-used unchanged — no migration, no rename:

| skill | live? | stat | cap | keywords | taken by | one-line effect |
|---|---|---|---|---|---|---|
| **`Swim`** | ✅ live | Physique | **5** 🟡*(15?)* | survival · aquatic | **Sea Lion · Crocodile · Octopus** | Water stops being terrain: currents become movement bonuses, and you may drag a grappled target under |
| **`Nightlurking`** | ✅ live | Reflexes | 10 | infiltration · awareness · squeezing | **Cat · Rat · Bat** | Always aware of the nearest exit, gap or vent; fits plausible small spaces without a Forced Action |
| **`Death Grip Jaws`** | ✅ live | Physique | 5 | control · grapple | **Crocodile · Dog · Honey Badger** | Bite-grapple by the standard §13 rules — *"no hands? no problem"* |
| **`Scent Trail`** | 🆕 | Mind | 10 | perception · **scent** | **Dog · Honey Badger · Elephant · Camel** | Follow a trail hours or days old, and **read its direction**; names who or what left it if you have met them before |
| **`Beast Strength`** | 🆕 | Physique | 10 | strikes · power | **Elephant · Camel · Crocodile · Ostrich** | Lift, drag, haul, shift or hold what a Medium body cannot — the §21.6 **Party** assist you give counts as two |
| **`Bolt`** | 🆕 | Reflexes | 10 | movement · rushing | **Ostrich · Kangaroo · Fennec Fox · Cat** | Once per Clock, cross open ground in a single Moment at a distance nothing on two legs should manage |
| **`Sure-Foot`** | 🆕 | Reflexes | 10 | movement · **climbing** | **Goat · Cat** | Vertical and near-vertical surfaces are terrain, not obstacles; narrow ledges never call a Forced Action |
| **`Take Wing`** | 🆕 | Reflexes | 10 | movement · **flight** | **Crow · Bat** | Leave the ground. ⚠️ **Ceiling-gated and load-gated** — see the bill in RP-4 |
| **`Whisker-Read`** | 🆕 | Mind | 5 | perception · awareness | **Cat · Rat · Sea Lion** | At 1 space, in total darkness or blind, you read contact, airflow and movement as if you could see it |
| **`Water-Miser`** | 🆕 | Physique | 5 | survival · bracing | **Camel · Fennec Fox · Kangaroo** | Thirst, heat and water-deprivation clocks do not run on you; you take your water from what you eat |
| **`Heat-Shed`** | 🆕 | Physique | 5 | survival · bracing | **Fennec Fox · Elephant** | Your ears are radiators: heat effects and Burn-adjacent environmental tiers advance one step slower |
| **`Deep Breath`** | 🆕 | Physique | 5 | survival · aquatic | **Sea Lion · Crocodile** | Suffocation's clock does not start while you choose to hold; you surface when you decide to |
| **`Tool-Wright`** | 🆕 | Mind | 10 | craft · improvisation | **Crow · Chimpanzee · Octopus** | Make the tool the room contains: one Moment and any debris becomes a working hook, probe, lever or wedge |

⭐ **`Beast Strength` is literally the owner's worked example** — *"both elephants and
gorillas get a strength skill, it can be the same skill"* — so it is one template held
by four animals, and the Chimpanzee deliberately **does not** take it (see RP-1 ①).

⭐ **`Scent Trail` is the widest shared skill in the draft** and that is correct: four
unrelated animals converge on it because olfaction is the most common vertebrate
superiority over a human, not because the draft got lazy.

### Unique skills — 8, and each one is unique for a reason

| skill | stat | cap | animal | why nothing else takes it |
|---|---|---|---|---|
| **`Slice n' Dice`** ✅ live | Reflexes | 10 | **Cat** | Forepaw flurry. Sasha's, already seeded, already ruled animal |
| **`Juggling`** ✅ live | Charm | 5 | **Sea Lion** | Filipe's, already ruled animal. Nose-and-flipper object handling |
| **`If The Head Fits`** | Physique | 5 | **Rat** | The rule *is* the skull, and only the rat's anatomy states it that way |
| **`The Crows Remember`** | Charm | **10** | **Crow** | ⭐ A social, propagating grudge. Nothing else in the animal kingdom does this |
| **`Echo-Cast`** | Mind | 10 | **Bat** | True biosonar. A broadcast, with everything that implies |
| **`Venom-Blooded`** | Physique | 5 | **Honey Badger** | ⚙️ **Shared by construction, not yet by roster** — the same receptor mutation is in mongoose, hedgehog and pig, so any of those races takes *this exact template*. It is a shared skill with one taker so far |
| **`Loose Hide`** | Physique | 5 | **Honey Badger** | Skin loose enough to turn inside it while held |
| **`Fifth Limb`** | Physique | 5 | **Kangaroo** | 🔴 The tail as a load-bearing leg. Extensible to a prehensile-tailed monkey race if one is ever drafted |
| **`Beak-Gauge`** | Reflexes | **10** | **Octopus** | No skeleton at all. This is passage taken to its absolute limit and nothing else comes close |
| **`Skin-Speak`** | Mind | 5 | **Octopus** | 🟡 **Overlaps general `Camouflage` — flagged, RP-7 #4** |

---

## RP-3 The roster at a glance

| | **Small** | **Medium** | **Large** | **Huge** |
|---|---|---|---|---|
| **body total (§7.1)** | 11 | 17 | 25 | 38 |
| | Cat 🐱 · Rat 🐀 · Crow 🐦‍⬛ · Bat 🦇 · Fennec 🦊 · Octopus 🐙 | Dog 🐕 · Goat 🐐 · Chimpanzee 🦍 · Honey Badger 🦡 | Sea Lion 🦭 · Ostrich 🦤 · Camel 🐪 · Kangaroo 🦘 | Crocodile 🐊 · Elephant 🐘 |

**16 animals · 6 Small · 4 Medium · 4 Large · 2 Huge.**

---

## RP-4 The sixteen

Each block: **§7.1 size · body · 3–4 candidate racials · the real fact · where it pays
and where it is dead.** `[S]` marks a shared skill from RP-2.

---

### 🐱 CAT — **Small** *(LIVE: Sasha)*

- **Body** — standard six-part Small (Head 2 · Torso 3 · Arms 1 · Legs 2 = **11**).
  **Manipulator: forepaws** — `Pounce`'s own requirement (*"Claws **or Knife** type"*)
  already establishes a cat holding a knife, so nothing new is needed.
- **Racials** — `Slice n' Dice` (10, live) · `Nightlurking` [S] (10, live) ·
  `Sure-Foot` [S] (10) · `Whisker-Read` [S] (5) · `Bolt` [S] (10)
- **Fact** — each vibrissa sits in a follicle wrapped in **100–200 primary nerve
  cells**; the righting reflex is a real vestibular-plus-spine mechanism.
  ⚠️ *"Whiskers measure gaps"* is **contested** and is deliberately not used.
- **Pays / dead** — 🟢 **F3 city** (roofs, alleys, drains — `Sure-Foot` + `Nightlurking`
  is the capital's whole geometry) · 🟢 **F1 forest** (trees) · 🔴 **F2 desert** — open
  sand has nothing to climb, nothing to squeeze into and nowhere to lurk. **The cat's
  worst floor is the middle one.**
- ✅ **Sasha is legal unchanged** — `Slice n' Dice` + `Nightlurking` is exactly two
  animal picks from this list.

### 🐀 RAT — **Small**

- **Body** — standard Small (**11**). **Manipulator: forepaws.** ⚠️ Incisors are a
  tool: a rat gnaws through what it cannot open.
- **Racials** — `If The Head Fits` (5) · `Nightlurking` [S] (10) · `Whisker-Read` [S] (5)
- **`If The Head Fits`** — *the skull is the limit.* Any opening your head passes,
  your body passes, at no Moment cost and with no Forced Action — the ribcage does the
  rest. ⚠️ Head **through**, not around: a barred grate your skull will not clear is a
  wall, no matter how thin you are.
- **Fact** — a rat's skeleton is rigid and **does not collapse** (that is a myth); the
  ribcage compresses about **25%** on one axis at constant volume, and an adult clears
  a **20–25 mm** round hole — the width of the skull.
- **Pays / dead** — 🟢 **F3 city** (the capital is drains, quarantine walls and
  crawlspaces; ⭐ §F3's *"getting in is easy, getting out is the ask"* is the one
  problem this animal deletes) · 🟡 **F1 forest** (burrows, root systems) ·
  🔴 **F2 desert** — open ground with no architecture to exploit.

### 🐦‍⬛ CROW — **Small**

- **Body** — Head 2 · Torso 3 · **two Wings 1** · two Legs 2 = **11**.
  ⚠️ **Wings replace arms**: destroy either wing and `Take Wing` is gone until it heals.
  **Manipulator: beak and feet** — fine work, no grip strength, and **no two-handed
  anything**.
- **Racials** — `Take Wing` [S] (10) · `Tool-Wright` [S] (10) · `The Crows Remember` (10)
- **`The Crows Remember`** — you remember a face that wronged you, permanently, and
  ⭐ **you can tell other crows.** Once per NPC group, name someone who has harmed the
  party: local birds mob, follow, announce and refuse to let them move unwatched.
  ⭐⭐ **This is an audience system in feathers** — it produces §17 Exposure on somebody
  else, which nothing else in the game does.
- **Fact** — New Caledonian crows are the **only non-human species known to manufacture
  hooked tools in the wild**; American crows recognise a dangerous human face for at
  least **2.7 years** (observed at 14), and **the grudge spreads to crows that never
  witnessed the event.**
- **Pays / dead** — 🟢 **F3 city** (crows are a city animal, and a populated capital is
  full of faces to hold against people) · 🟢 **F1 forest** (canopy scouting) ·
  🔴 **F2 desert** — nothing to perch on, nothing to watch, and no resident birds to
  carry the grudge. **`The Crows Remember` needs a POPULATION and the desert has none.**
- ⚠️ **The flight bill, and it is deliberate:** a Small body carries almost nothing
  aloft, `Take Wing` does nothing under a ceiling (§21.4 room width is the dial), and
  a flying contestant is the most visible thing on the floor — 🎯 which the
  Corporation loves and every archer also loves.

### 🦇 BAT — **Small**

- **Body** — Head 2 · Torso 3 · **two Wing-arms 1** · two Legs 2 = **11**.
  ⚠️ **The wings ARE the arms** — a bat that is holding something is not flying with it.
  **Manipulator: thumb claws and feet.** Poor at anything two-handed.
- **Racials** — `Echo-Cast` (10) · `Take Wing` [S] (10) · `Nightlurking` [S] (10)
- **`Echo-Cast`** — 1 Moment: in **total darkness** you perceive the space as if lit,
  out to a few spaces. ⚠️ **It is a BROADCAST** — anything that can hear knows exactly
  where you are and that you are looking. ⭐ **So it does not stack with §15 stealth:
  the skill that solves the dark is the one that ends the ambush**, and choosing which
  you want that Moment is the whole of playing a bat.
- **Fact** — echolocation works in complete darkness and resolves objects as fine as a
  hair, but the **range is only a few metres to tens of metres**, and the call is a
  loud emission, not a passive sense.
- **Pays / dead** — 🟢 **F1 forest** (the Hard route's night city, the canopy, every
  unlit interior) · 🟢 **F3 city** (quarantine interiors, the mausoleum, the dig) ·
  🔴 **F2 desert** — daylight, open sky, and ⭐ nothing to echo off. **A sonar animal in
  an empty desert is reading a blank page.**

### 🦊 FENNEC FOX — **Small**

- **Body** — standard Small (**11**), plus ⚠️ **the Ears are a named part (1 HP)**
  carrying `Heat-Shed` and half of `Scent Trail`'s cousin — total **12**.
  ⭐ **Destroy the ears and both racials go.** **Manipulator: forepaws.**
- **Racials** — `Water-Miser` [S] (5) · `Heat-Shed` [S] (5) · `Bolt` [S] (10)
- **Fact** — a dense vascular network in the translucent ears **dumps core heat**; the
  same ears **hear prey moving underground**; and the fox takes most of its water from
  what it eats rather than from drinking.
- **Pays / dead** — 🟢🟢 **F2 desert — this is the one animal the desert was written
  for.** Heat clocks, water clocks and buried things all answer to it. · 🔴 **F1 forest**
  and 🔴 **F3 city** — a temperate forest and a jade capital have neither heat to shed
  nor thirst to miss, and the ears are just a target.
- ⭐⭐ **The fennec is the cleanest proof of the conditional-spike ruling in the whole
  draft: enormous on one floor of three, close to nothing on the other two, and the
  party cannot know which floor they draw.**

### 🐙 OCTOPUS — **Small**

- **Body** — ⚠️ **the strangest layout here.** Head 2 *(lethal)* · **Mantle 3**
  *(lethal — the torso-equivalent; it holds the gills and the hearts)* · **eight Arms
  at 1** = **13**, legitimately above the Small row of 11. ⭐ **Paid for by §20.3's ADD
  ruling** — eight arms is eight things to armour, eight things to heal and eight ways
  to lose Force under §21.6 Body. **Manipulator: everything, brilliantly.**
  🔴 **Out of water it is slow, heavy and drying** — see the bill.
- **Racials** — `Beak-Gauge` (10) · `Swim` [S] (5) · `Tool-Wright` [S] (10) ·
  🟡 `Skin-Speak` (5)
- **`Beak-Gauge`** — **the beak is the only rigid part of you.** Any gap wider than
  your beak passes your entire body, including while carrying nothing. ⭐ This is §7.1
  passage taken past every other Small animal, and it is the reason the octopus is in
  the draft at all.
- **Fact** — the chitinous beak is the octopus's **only hard part**; if the beak fits,
  the animal follows, which for small species is an opening under an inch.
- **Pays / dead** — 🟢🟢 **any water, and any architecture with a hole in it** ·
  🟡 **F3 city** (drains, grates, sealed rooms — `Beak-Gauge` opens the quarantine) ·
  🔴🔴 **F2 desert — an octopus in a desert is a dying animal**, and that is not a
  balance problem, it is the ruling working at its maximum.
- 🔴 **Owner call:** whether an octopus is a *plausible abductee* at all is a taste
  question, not a rules one. Cut it and nothing else in the draft moves.

---

### 🐕 DOG — **Medium**

- **Body** — Head 2 · Torso 5 · **four Legs 3** = **19** (no arms). 🔴 **No hands** —
  the single biggest bill in the Medium bracket, and §20.3 ADD is the written answer.
  **Manipulator: jaws.**
- **Racials** — `Scent Trail` [S] (10) · `Death Grip Jaws` [S] (5, live) · `Bolt` [S] (10)
- **Fact** — roughly **300 million olfactory receptors** against a human's ~5 million,
  and a dog reads a trail's **direction** from how the scent strengthens across
  successive footfalls — so it knows not just where someone went but which way.
- **Pays / dead** — 🟢 **every floor**, and that is the point: ⭐ **the Dog is the
  flattest Animal in the draft, the closest thing to a Human with a spike.** Scent
  works in forest, desert and city alike. · 🟡 **Weakest on F3** — a capital of two
  million people is a scent environment so loud that a single trail is genuinely hard
  to hold, which is a fair and fictional way to tax the all-rounder.

### 🐐 GOAT / IBEX — **Medium**

- **Body** — Head 2 · **Horns 2** · Torso 5 · **four Legs 3** = **21**. 🔴 **No hands.**
  **Manipulator: jaws and horns.** ⚠️ The horns are a real part: they are the weapon
  and they can be broken off.
- **Racials** — `Sure-Foot` [S] (10) · `Beast Strength` [S] (10) 🟡 · `Water-Miser` [S] (5)
- **Fact** — the cloven hoof is **two materials**: a hard keratin outer rim that bites
  into a ledge, and a **soft rubbery inner sole** that moulds to the rock. Ibex climb
  near-vertical dam faces on protruding stones with nothing else.
- **Pays / dead** — 🟢🟢 **F3 city** (a jade capital is a vertical city; ⭐ *the
  mausoleum, the dig and the quarantine wall are all climbs*) · 🟢 **F1 forest** (the
  giant stairs, the city hall) · 🔴 **F2 desert** — flat sand offers nothing to climb,
  and `Water-Miser` is the only thing keeping the goat on the floor.

### 🦍 CHIMPANZEE — **Medium**

- **Body** — Head 2 · Torso 5 · Arms 2 · Legs 3 = **17**, standard, but ⚠️ the **arms
  are the strong pair and the legs are the weak pair** — the reverse of a human.
  **Manipulator: hands, and better than a human's grip.**
- **Racials** — `Tool-Wright` [S] (10) · **`Burst`** 🟡 (10, see below) · `Sure-Foot` [S] (10)
- **⚠️ NO `Beast Strength`, deliberately.** ⭐ **The folklore said 5× a human and the
  measurement says 1.35×** — so a chimp spike built on raw strength would be built on
  a number that is not true. **`Burst`** instead: once per Clock, one action that
  would normally take a full Moment of setup happens immediately, because the muscle
  is fast rather than strong.
- **Fact** — chimpanzee mass-specific muscle output is about **1.35× a human's**, and
  the advantage comes from a **higher fast-twitch fibre fraction**, not from stronger
  fibre (O'Neill *et al.*, PNAS 2017).
- **Pays / dead** — 🟢 **F1 forest** (canopy, and the only floor whose terrain rewards
  arms-over-legs) · 🟡 **F3 city** (`Tool-Wright` never stops paying in a built
  environment) · 🔴 **F2 desert** — no canopy, nothing to brachiate, and heat with no
  answer to it.

### 🦡 HONEY BADGER — **Medium**

- **Body** — Head 2 · Torso 5 · Arms 2 · Legs 3 = **17**. **Manipulator: clawed
  forepaws.** ⚠️ The hide is not a part — it is `Loose Hide`.
- **Racials** — `Venom-Blooded` (5) · `Loose Hide` (5) · `Death Grip Jaws` [S] (5, live) ·
  `Scent Trail` [S] (10)
- **`Venom-Blooded`** — Poison tiers from a **biological** source advance one step
  slower on you and never reach T4. ⚠️ **Biological only** — alchemy, gas, crystal and
  the Dissolution songs are untouched, because the receptor mutation answers
  α-neurotoxin and nothing else.
- **`Loose Hide`** — while grappled (§13) you may spend 1 Moment to turn inside your
  own skin and reverse the hold, with no Forced Action.
- **Fact** — honey badgers carry a mutated **nicotinic acetylcholine receptor** that
  cobra α-neurotoxin cannot bind, and ⭐ the **same** mutation evolved independently in
  mongoose, hedgehog and pig (Drabeck *et al.*, 2015) — *which is why `Venom-Blooded`
  is written as a shared template even though only one animal in this draft takes it.*
- **Pays / dead** — 🟢🟢 **F2 desert** (scorpions, serpents, and a demon floor whose
  poisons are mostly organic) · 🟡 **F1 forest** · 🔴 **F3 city** — ⭐ **the capital's
  signature threat is the crystal plague, which is Infection, not Poison.**
  **Venom-Blooded reads the wrong column on the floor that hurts most.**

---

### 🦭 SEA LION — **Large** *(LIVE: Filipe, and possibly Mario — see RP-6)*

- **Body** — Head 3 *(lethal)* · Torso 8 *(lethal)* · **two Fore-flippers 3** · **two
  Hind-flippers 4** = **25**. ⭐ **Exactly the Large row, relabelled** — no points moved.
  **Manipulator: nose and fore-flippers** — which is precisely what `Juggling` describes.
  🔴 **On land it is slow and it cannot run.**
- **Racials** — `Swim` [S] (5, live) · `Juggling` (5, live) · `Whisker-Read` [S] (5) ·
  `Deep Breath` [S] (5)
- **Fact** — a California sea lion **tracks the hydrodynamic wake of something that
  passed up to about 7 seconds ago** (a harbour seal manages 30+), and is *more*
  sensitive than a seal to direct water vibration at 20–30 Hz.
- **Pays / dead** — 🟢🟢 **any water** · 🔴🔴 **F1 forest, F2 desert AND F3 city.**
- 🔴🔴 **THE FINDING THIS DRAFT DID NOT EXPECT — SET 1 HAS NO WATER.** F1 is forest,
  F2 is the great desert, F3 is the grand capital, and a sweep of all three enemy
  passes turns up **no river, lake, canal, flood or swim**. ⭐ So the two live
  contestants holding `Swim` hold a racial that is **worth zero for the entire
  campaign** — not "conditional", *unpriced*. That is the conditional-spike ruling
  running at its limit and it wants an owner eye. **Three cheap answers, none ruled:**
  ① a water beat somewhere in Set 2 · ② one cistern / flooded dig / harbour scene in F3
  (⚙️ the mausoleum dig under a capital is a *natural* place for water) · ③ let
  `Whisker-Read` and `Deep Breath` carry the sea lion on dry floors, which is exactly
  why both are in its list.
- ✅ **Filipe is legal unchanged** — `Swim` + `Juggling` is two picks from this list.

### 🦤 OSTRICH — **Large**

- **Body** — Head 3 · Torso 8 · **two Wings 3** · two Legs 4 = **25**. ⚠️ **The wings
  are not arms and do not fly** — they steer at speed and they display. 🔴 **No hands.**
  **Manipulator: beak.** ⭐ **The legs are the weapon**, which is the reverse of every
  other entry.
- **Racials** — `Bolt` [S] (10) · `Beast Strength` [S] (10) · `Scent Trail` [S] (10) 🟡
- **Fact** — the **fastest biped ever recorded**: 60 km/h sustained, over 70 km/h top,
  on a **two-toed** foot whose claw bites the ground at up to **40 kg/cm²** at speed.
- **Pays / dead** — 🟢🟢 **F2 desert** (open ground is the one terrain a sprinter
  converts into a resource, and F2's routes are crossings) · 🔴 **F3 city** —
  ⭐ **`Bolt` needs a straight line and a capital is corners**; a Large body in an alley
  is a cork. · 🔴 **F1 forest** — §F1's own terrain block already says a greatsword
  build *"is fighting the trees as well"*, and a sprinting ostrich is fighting them harder.

### 🐪 CAMEL — **Large**

- **Body** — Head 3 · Torso 8 · **four Legs 4** · **Hump 4** = **31**.
  ⭐⭐ **The Hump is a real part and it is the skill:** destroy it and `Water-Miser`
  stops until it regrows. 🔴 **No hands.** **Manipulator: mouth.**
- **Racials** — `Water-Miser` [S] (5) · `Beast Strength` [S] (10) · `Scent Trail` [S] (10)
- **Fact** — a dromedary survives losing **over 25% of its body water** where most
  mammals die near 15%, and its **oval red cells re-expand to 240%** of volume on
  rehydrating without bursting (most cells manage 150%).
- **Pays / dead** — 🟢🟢 **F2 desert** (and ⭐ `Beast Strength` means the camel is *the
  party's logistics* — everything everyone else cannot carry across a desert) ·
  🟡 **F1 forest** (carrying still works) · 🔴 **F3 city** — a Large four-legged body in
  a crowded capital, with a water problem the capital solved centuries ago.

### 🦘 KANGAROO — **Large**

- **Body** — Head 3 · Torso 8 · **two short Arms 3** · two Legs 4 · **Tail 4** = **29**.
  ⭐ **The Tail is a load-bearing part**, not decoration — destroy it and `Fifth Limb`
  and most of the kangaroo's balance go with it. **Manipulator: small forelimb hands**,
  genuinely usable but weak.
- **Racials** — `Fifth Limb` (5) · `Bolt` [S] (10) · `Water-Miser` [S] (5)
- **`Fifth Limb`** — the tail is a leg: you may plant it to brace, to free **both**
  hands with no loss of footing, or to launch a kick that uses your legs *and* your
  tail as one limb. ⚠️ **Not while it is a condition-bearing part** — §21.6 Body
  applies to the tail like any other.
- **Fact** — in the five-legged walk, the tail supplies **as much propulsive force as
  the fore- and hind-limbs combined** (Biology Letters, 2014). No other animal uses a
  tail as a leg.
- **Pays / dead** — 🟢 **F2 desert** (arid country is where the animal is from, and
  `Bolt` gets its straight line) · 🟡 **F1 forest** · 🔴 **F3 city** — hopping is a gait
  for open ground and a capital denies it.

---

### 🐊 CROCODILE — **Huge**

- **Body** — Head 4 *(lethal; the jaw lives here)* · Torso 12 *(lethal)* · **four Legs
  5** · **Tail 6** = **42**. 🔴 **No hands.** **Manipulator: jaws.** ⚠️ **Huge**, so
  §13 forbids a Medium contestant grappling it — and forbids it fitting through most
  doors.
- **Racials** — `Death Grip Jaws` [S] (5, live) · `Beast Strength` [S] (10) ·
  `Swim` [S] (5) · `Deep Breath` [S] (5)
- **Fact** — the saltwater crocodile has the **highest bite force measured in any
  living animal (~16,460 N / 3,700 psi)**, and ⭐ **the muscles that OPEN the same jaws
  are so weak a person can hold them shut with bare hands.**
- ⭐⭐ **That asymmetry IS the bill, and it needs no new rule:** a grappled crocodile's
  jaws can be held closed by anything with hands and a Physique check, so the strongest
  attack in the draft is disabled by the cheapest counter in §13. **Write it on the
  skill and the animal balances itself.**
- **Pays / dead** — 🟢🟢 **water** · 🟡 **F1 forest** (`Beast Strength`, and a Huge body
  in undergrowth) · 🔴🔴 **F3 city** — 🔴 **a Huge contestant in a populated capital is
  a plot, not a build.** See RP-7 #3.

### 🐘 ELEPHANT — **Huge**

- **Body** — Head 4 *(lethal)* · Torso 12 *(lethal)* · **Trunk 5** · **Ears 2 each** ·
  **four Legs 6** = **51**. ⭐⭐ **The Trunk is the only manipulator on the whole body**
  — lose it and the elephant has no hands, no `Scent Trail` and no fine action of any
  kind. **It is the single most valuable part in the draft and it is an arm made of
  torso.** The Ears carry `Heat-Shed`.
- **Racials** — `Beast Strength` [S] (10) · `Scent Trail` [S] (10) · `Heat-Shed` [S] (5) ·
  **`Groundsense`** 🟡 (10)
- **`Groundsense`** — passively, through your feet: you know the number, weight and
  bearing of everything moving on your ground, through walls, in the dark, at a range
  no other sense in the game reaches. ⚠️ **Only what touches the ground** — a flier, a
  climber and a thing on a roof are invisible to it.
- **Fact** — elephant infrasound carries about **10 km through air and up to ~32 km
  through the ground**, and is read by **Pacinian corpuscles in the fatty foot pads**
  via bone conduction.
- **Pays / dead** — 🟢 **F2 desert** (`Heat-Shed`, `Water-Miser`-adjacent endurance,
  and `Groundsense` across open ground is a scouting instrument) · 🟡 **F1 forest** ·
  🔴🔴 **F3 city** — same problem as the crocodile, and worse: ⭐ *`Groundsense` in a
  capital of two million is a sense that never stops screaming.*

---

## RP-5 The floor matrix — what the campaign prices each week

🔒 *"The floor decides what a race is worth that week."* Set 1 is **F1 forest ·
F2 desert · F3 city**, and there is **no water floor** (RP-4, Sea Lion).

| animal | F1 forest | F2 desert | F3 city | water |
|---|---|---|---|---|
| Cat | 🟢 | 🔴 | 🟢🟢 | 🔴 |
| Rat | 🟡 | 🔴 | 🟢🟢 | 🔴 |
| Crow | 🟢 | 🔴 | 🟢🟢 | 🔴 |
| Bat | 🟢 | 🔴 | 🟢 | 🔴 |
| Fennec Fox | 🔴 | 🟢🟢 | 🔴 | 🔴 |
| Octopus | 🔴 | 🔴🔴 | 🟡 | 🟢🟢 |
| Dog | 🟢 | 🟢 | 🟡 | 🔴 |
| Goat | 🟢 | 🔴 | 🟢🟢 | 🔴 |
| Chimpanzee | 🟢 | 🔴 | 🟡 | 🔴 |
| Honey Badger | 🟡 | 🟢🟢 | 🔴 | 🔴 |
| Sea Lion | 🔴 | 🔴 | 🔴 | 🟢🟢 |
| Ostrich | 🔴 | 🟢🟢 | 🔴 | 🔴 |
| Camel | 🟡 | 🟢🟢 | 🔴 | 🔴 |
| Kangaroo | 🟡 | 🟢 | 🔴 | 🔴 |
| Crocodile | 🟡 | 🔴 | 🔴🔴 | 🟢🟢 |
| Elephant | 🟡 | 🟢 | 🔴🔴 | 🔴 |

⭐ **What the column shape says, and none of it was arranged:**

- **F2 desert is the thinnest column and the most decisive** — five animals own it and
  nine are close to useless on it. ⚙️ That is consistent with F2's own design note
  (*"the shared desert layer is deliberately thin so the routes carry the weight"*):
  a thin floor is a floor that prices races hard.
- **F3 city rewards SMALL and punishes HUGE**, with no rule needed to say so. The
  capital's own geometry does it.
- **Nothing is green everywhere**, and the closest is the **Dog** — which is the
  correct animal to be the flattest, because it is the one domesticated to live beside
  humans on every kind of ground.
- 🔴 **The water column is the problem**, not the roster. Three animals stake their
  spike on it and Set 1 never opens it.

---

## RP-6 The live party — consistency check

| contestant | species | holds today | legal under this draft? |
|---|---|---|---|
| **Sasha** | **Cat**, Small | `Slice n' Dice` · `Nightlurking` | ✅ **Yes, unchanged.** Both are on the Cat list; that is exactly two animal picks |
| **Filipe** | **Sea Lion**, Large | `Swim` · `Juggling` | ✅ **Yes, unchanged.** Both are on the Sea Lion list |
| **Mario** | 🔴 **disputed — see below** | `Full Potential` · `Heroic Punch` (both `exclusiveTo: Mario`) | ✅ **Either way.** His two are `exclusiveTo`, not racials, so **they occupy no animal slot and conflict with nothing** |
| **XQUEZ/T** | Robot / AI | three `raceLock: 'Robot / AI'` racials | ➖ out of scope; the race is discontinued for new contestants |

✅ **ZERO migration.** Nothing in this draft changes a live sheet, because the three
live animal skills it re-uses (`Swim` · `Nightlurking` · `Death Grip Jaws`) are re-used
**unchanged** — same names, same text, same `raceLock`.

🔴 **ONE CONTRADICTION I CANNOT RESOLVE AND WILL NOT GUESS — what species is Mario?**
The brief that commissioned this draft says *"Filipe and Mario are SEA LIONS."*
The repo says otherwise, in three places:

- `tutorial-floor-review.md` §5: *"Mario (Human, brawler)"*, and separately *"Filipe
  (Sea Lion, healer)"*.
- `skills-passover.md` line 253: ***"Mario (Sea Lion, healer)"*** — the opposite.
- `skills-passover.md` line 323 carries the reconciliation note already: *"memories
  list 'Mario (Sea Lion) — healer' and 'Mario Marcus (Human) — brawler'; character-sheet
  data names the sea lion healer Filipe. Treat Filipe = sea lion healer, Mario = human
  brawler as canonical from sheet data."*

⚠️ **So the repo has already had this exact argument once and settled it from sheet
data — and the settlement did not reach the brief.** ⭐ **Nothing in this draft depends
on the answer** (Mario's two skills are exclusives either way), but **a two-sea-lion
party changes the water finding from "two contestants hold a dead racial" to "half the
party does."** 🔴 **Owner: one word settles it.**

---

## RP-7 🔴 OPEN CALLS — what I am least sure of

### 1. 🔴🔴 **SET 1 HAS NO WATER, AND THREE ANIMALS STAKE THEIR SPIKE ON IT**

The single biggest finding. `Swim` is live, is held by at least one and possibly two
contestants, and **F1 forest / F2 desert / F3 capital contain no swimmable water at
all** — I swept all three enemy passes. The conditional-spike ruling says the floor
prices a race; here the floor prices it at **zero, for the whole campaign**.
⚖ **Recommended (mine, unruled): one flooded beat in the F3 dig.** The mausoleum
excavation runs *under* a capital of two million; groundwater is the most natural
thing in the world down there, it costs no new content, and ⭐ it would put the sea
lion's racial in the room on the floor that matters most.

### 2. 🔴 **TODAY'S CAP RULING AND §4.2 DISAGREE, AND I DREW CAPS WITHOUT KNOWING WHICH WINS**

Today's ruling: *most skills cap at 5 or 10; special ones may be designated up to 15.*
**§4.2 says something different:** *every* skill can reach 10 — levels 1–5 free, 6–10
one Patron Token each — so **5 is a starting cap and 10 is the universal ceiling.**
Under §4.2 "caps at 5" cannot mean anything. **Two readings:**

- **A — the caps here are CEILINGS.** A cap-5 racial can never pass 5 no matter how
  many Patron Tokens you burn. ⚠️ This **withdraws §4.2's universal ladder** for those
  skills and needs a book errata.
- **B — the caps here are STARTING caps** and everything still reaches 10 or 15 by
  token. ⚠️ Then "caps at 5 or 10" is only about where a skill *begins*, and 15 means
  *"may be tokened five rungs past the normal ceiling."*

**I wrote the table as A** because that is what makes a cap a design statement. 🔴 If
the answer is B, every `10` below is just "the normal skill" and the meaningful column
is only which ones are 15.

### 3. 🔴 **A HUGE CONTESTANT MAY NOT BE A PLAYABLE THING, AND I DRAFTED TWO**

Crocodile and Elephant are Huge. §13 says a Medium contestant cannot grapple Huge, §7.1
says a Huge body is *outdoors*, and **F3 is an entire floor of interiors** — the
quarantine, the mausoleum, the alleys, the palace. A Huge contestant either breaks
those rooms or spends the floor outside them. ⚖ **Three options, none ruled:**
① keep Huge as drafted and accept that a Huge contestant is a *campaign-level* choice
· ② cap contestants at Large and re-file Crocodile and Elephant as Large ·
③ keep them and let §20.3's Surgeon's Table be the written answer (a Huge contestant
who wants into the capital pays a downtime action to become Large). ⭐ **③ is the one
that uses a rule that already exists**, and it is the one I would pick.

### 4. 🟡 **`Skin-Speak` OVERLAPS GENERAL `Camouflage`, AND I SHOULD PROBABLY HAVE CUT IT**

`Camouflage` was ruled **general** on 2026-09-19 precisely because *"a human in a
ghillie suit qualifies."* The octopus's chromatophores do the same job **with no
preparation, no cover and no gear**, which is a real distinction — but it is the only
skill in this draft that competes with a general-pool skill rather than doing something
the general pool cannot. ⚖ **Recommend cutting it**; the octopus already has three
candidates and `Beak-Gauge` is the better spike.

### 5. ✅ **RULED 2026-09-22 — ALL THREE NARROWS ARE IN THE BOOK** (§4.5, v1.13)

⭐ **And the ruling came with the reason generalised:** 🔒 *a narrow is a **merge
permission**, not a category* — so the question about a new keyword is never *"what kind of
thing is this?"* but ***"what should this be allowed to become?"*** `climbing`, `flight` and
`scent` are written into §4.5 as **quarantines** on exactly that reading.

⚠️ **Consequence applied to RP-2, and it is the rule's own content rather than a second
decision: each of the three skills DROPS its neighbouring narrow.** `Scent Trail` is
`perception · scent` and **not** *awareness*; `Sure-Foot` is `movement · climbing` and
**not** *tumbling*; `Take Wing` is `movement · flight` and **not** *leaping*. A skill
carrying both the new narrow and the old one would be quarantined and un-quarantined in the
same line. ⭐ They still share the **broad** group with their neighbours, which is the *"ask
the GM with a fiction reason"* case — the door is closed, not walled.

🔒 **A second rule landed with them: a racial may be the CONSUMER, never the CONSUMED**
(§4.5). A merge destroys both parents, so feeding a racial into the Gemstone would be a
**race change routing around §20.3's Surgeon's Table**. ⭐ It also protects this whole draft
from itself: every package below is a body fact, and none of them can be traded away.

*The original finding follows.*

§4.5's compatibility system was a closed list — `movement` was *leaping · tumbling ·
rushing*, `perception` was *empathy · patterning · awareness* — and the book says the GM
*"may grow the taxonomy deliberately, never casually."* This pass needed **three new
narrows** and there was no honest way around it:

| narrow | under | needed by | what it would break if forced elsewhere |
|---|---|---|---|
| **`flight`** | movement | `Take Wing` | Filed under `leaping` it becomes Gemstone-compatible with `Tactical Roll` and `Acrobatics`, which would let a merge produce a flying tumbler |
| **`climbing`** | movement | `Sure-Foot` | Filed under `tumbling` it merges with `Acrobatic Save` |
| **`scent`** | perception | `Scent Trail` | Filed under `awareness` it merges with `Nightlurking` and `Aura Reading` — ⭐ a psychic nose |

⭐ **A racial-package pass is exactly the "deliberate" occasion the book reserves**, so
this is a cheap yes — but it is a **rulebook change** and therefore the owner's, not
mine. ~~Every keyword in RP-2 marked *(·flight)*, *(·climbing)* or *(·scent)* is
provisional on it.~~ ✅ **Ruled, and RP-2 is updated.**

### 6. 🟡 **THE THREE `Bolt` / `Beast Strength` / `Scent Trail` PLACEMENTS I AM LEAST SURE OF**

Marked 🟡 in RP-4. `Beast Strength` on a **Goat** (a goat is strong for its size, but
"lift what a Medium cannot" is a stretch) · `Scent Trail` on an **Ostrich** (birds vary
enormously and the ratite nose is not a dog's — ⚖ **I would cut this one**) ·
`Bolt` on a **Cat** (true in burst but a cat's sprint is 20–30 m, not an ostrich's
open-ground charge, so it may want to be a *shorter* skill or a different one).

### 7. ⚠️ **WHAT IS NOT IN THIS DRAFT**

- **Pangolin** — drafted and cut for space. Keratin scales are ~20% of body weight and
  a lion genuinely cannot get purchase on a rolled one, but the belly and face are
  unscaled. It would be a pure-defence Medium with a `Roll Up` racial, and it is the
  only animal considered whose spike is *doing nothing, extremely well*. **Easy to add.**
- **Giraffe · Boar · Mongoose · Hedgehog · Otter · Horse · Bear · Wolf** — considered,
  not drafted. ⭐ **Mongoose, hedgehog and boar are nearly free** — they take
  `Venom-Blooded` unchanged (same receptor mutation, same paper), which is the shared
  list doing its job.
- **Stat modifiers per race.** Deliberately none. The owner's frame is *skills + size +
  body*, and adding racial trait bonuses would cross L-19's 150-level budget, which was
  computed without them.
- **The `trade-for-cap` rule.** The game repo's `races.json` ruled (2026-07-16) that at
  creation *"any number may be given up for +1 cap on another"* — **the app has never
  implemented it**, and this draft does not assume it. It stays open.

---

## RP-8 Sources — every fact above was checked this session

⚙️ **The owner asked for research, so the research is auditable.** Each line in RP-4's
"Fact" row traces to one of these; nothing below is from memory or folklore.

| claim | source |
|---|---|
| Chimp muscle ~1.35×, fast-twitch fibre mix, **not 5×** | O'Neill *et al.*, *Chimpanzee super strength and human skeletal muscle evolution*, [PNAS 2017](https://www.pnas.org/doi/abs/10.1073/pnas.1619071114) |
| Rat skeleton **does not collapse**; skull is the limit, ~20–25 mm | [ratbehavior.org — *Do rats have a collapsible skeleton?*](http://www.ratbehavior.org/CollapsibleSkeleton.htm) |
| Sea lion tracks a wake ~7 s old; harbour seal 30+ s | Dehnhardt *et al.* / [*Hydrodynamic Perception in Seals and Sea Lions*](https://link.springer.com/chapter/10.1007/978-3-642-41446-6_6) · [*Seal and Sea lion Whiskers Detect Slips of Vortices*, Sci Rep 2019](https://www.nature.com/articles/s41598-019-49243-5) |
| Cat vibrissa follicle: 100–200 primary nerve cells; gap-measuring **contested** | [Zoetis Petcare — Cat Whiskers 101](https://www.zoetispetcare.com/blog/article/cat-whiskers-101) |
| Camel >25% body-water loss; oval RBCs re-expand to 240% | [Camel — Wikipedia](https://en.wikipedia.org/wiki/Camel) · [AskNature — Blood Cells Protect From Dehydration](https://asknature.org/strategy/blood-cells-protect-from-dehydration/) |
| Kangaroo tail = propulsion of fore- and hind-limbs combined | O'Connor *et al.*, Biology Letters 2014 — [UNSW](https://www.unsw.edu.au/newsroom/news/2014/07/kangaroos-use-tail-as-fifth-leg) |
| Elephant infrasound ~10 km air / ~32 km ground; Pacinian corpuscles in foot pads | [Wildlife SOS — *Rumbles Through The Ground*](https://news.wildlifesos.org/rumbles-through-the-ground-decoding-elephant-infrasound/) |
| Octopus: beak is the only rigid part | [IERE — *How big of a hole can an octopus fit through?*](https://iere.org/how-big-of-a-hole-can-an-octopus-fit-through/) |
| NC crow hooked-tool manufacture (only non-human in the wild) | Hunt, [*Nature* 379:249](https://www.nature.com/articles/379249a0) · [BMC Biology 2015](https://link.springer.com/article/10.1186/s12915-015-0204-7) |
| Crows recognise a dangerous face ≥2.7 yr; **the grudge spreads** | Marzluff *et al.*, [*Lasting recognition of threatening people by wild American crows*](https://www.sciencedirect.com/science/article/abs/pii/S0003347209005806) |
| Honey badger nAChR mutation; convergent in mongoose, hedgehog, pig | Drabeck *et al.*, [*Why the honey badger don't care*, Toxicon 2015](https://pubmed.ncbi.nlm.nih.gov/25796346/) |
| Ostrich fastest biped, 60–70+ km/h; claw at ~40 kg/cm² | [Science in School — *Birds on the run*](https://scienceinschool.org/article/2011/ostrich/) |
| Croc bite ~16,460 N; **jaw-opening muscles weak enough to hold by hand** | Erickson *et al.* — [National Geographic](https://www.nationalgeographic.com/animals/article/120315-crocodiles-bite-force-erickson-science-plos-one-strongest) |
| Dog ~300 M olfactory receptors; reads trail **direction** from the gradient | [Dog sense of smell — Wikipedia](https://en.wikipedia.org/wiki/Dog_sense_of_smell) · [*How Many Footsteps Do Dogs Need…*, Chemical Senses](https://academic.oup.com/chemse/article/30/4/291/270231) |
| Ibex hoof: hard keratin rim + soft rubbery sole; climbs dam faces | [Discover Wildlife — *How ibex scale vertical cliffs*](https://www.discoverwildlife.com/animal-facts/mammals/alpine-ibex-climbing) |
| Fennec ears as radiators; hears prey underground; water from food | [Fennec fox — Wikipedia](https://en.wikipedia.org/wiki/Fennec_fox) · [San Diego Zoo](https://animals.sandiegozoo.org/animals/fennec-fox) |
| Bat echolocation: total darkness, hair-fine resolution, **range only metres to tens of metres** | [Echolocation — Ask A Biologist](https://askabiologist.asu.edu/echolocation) · [Current Biology](https://www.cell.com/current-biology/fulltext/S0960-9822(05)00686-X) |
| Pangolin scales ~20% body weight; lion cannot get purchase; belly unscaled | [National Geographic — *African lion attacks pangolin*](https://www.nationalgeographic.com/animals/article/lion-attacks-pangolin-rare-video-africa) |
