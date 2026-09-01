# GALACTIC PRIME TIME — System Rulebook

**Version 1.3** · 2026-09-01 — **FORCE** (§7.3): one unit for every source of
damage, replacing the material band's multiplication with addition. Universal
resistance (§10.1). Area attacks do not divide (§7.3).
*Previously —* **1.2**, Marks (§18.4) and the bill of materials (§12.7).
*Previously —* **1.1** · 2026-08-04, the Item Drafting update: materials & parts
(§12.7), armor rules (§12.6), polish & creation kits (§12.3), tomes (§4.4),
box specificity (§17.6), the horde doctrine (§21.2). *(File name stays v1.0 —
the Wiki imports it by path.)*

> **Lights. Camera. Action.**
> You were abducted by an alien conglomerate. The Corporation™ films you running
> its dungeons to prove to its citizens that colonizing Earth is beneficial — nay,
> *necessary*. The audience is real, the danger is real, and the only way out is
> through the ratings. Refusing to join the show? "We can't guarantee what will
> happen to you afterwards."

**About this book.** The complete rules of the show: timeline combat on a shared
clock, damage that lives in body parts and conditions, no to-hit rolls anywhere,
and an audience that is itself a game system. The rules are final; specific
numbers — prices, payouts, damage values — are first-pass values that the show
tunes in play.

---

## 1. The Show

- You are a **contestant**: an abducted human — or animal, or machine — competing
  in alien-broadcast dungeon runs.
- **Core pillars:** Spectacle over safety. Identity through Tags. Timeline combat
  (Moments and Clocks). The Audience as an active mechanic.
- **No to-hit rolls.** Actions auto-succeed when their requirements are met.
  Danger comes from doing things you're *not* qualified for (Forced Actions), from
  conditions, and from the Clock.
- Safe, passive play is structurally discouraged. The crowd is watching.

**Timescale (flavor):** in the fiction, a full Clock is roughly **five seconds**.
Everything happens *fast* — the table's deliberation is the broadcast's
slow-motion replay.

---

## 2. Making a Contestant

### 2.1 Pillars and traits

- Two structural pillars: **Body** (physical — changes more easily) and **Core**
  (mental/identity — harder to change).
- Four traits: **Physique** (Body), **Reflexes** (Body), **Mind** (Core),
  **Charm** (Core).
  - **Physique** — strength, endurance, durability, applied violence.
  - **Reflexes** — coordination, reaction speed, precision, spatial control.
  - **Mind** — mental resilience, magical affinity, processing speed, control
    under stress.
  - **Charm** — **presence**: how compelling you are to look at and to listen
    to — striking looks, bearing, voice, facial control, body language.
    Presentation used as an instrument. Charm 5 = "cinematic gravity, the scene
    favors you." Charm is **not** a cosmic pull, and it is not warmth or
    likability — those live in the audience's reaction to you (Tags and crowd
    response), never in the number. People *do* listen better to someone who
    commands a room, which is why Command, Persuade and Intimidate key off it
    (§2.3).

### 2.2 Creation

- At creation, allocate **7 points across the Body traits** and **7 points across
  the Core traits**. No trait may exceed **5 at creation**.
- **The 1–5 scale is a creation-time scale only**: 1 = functionally impaired · 2 = below average · 3 = baseline adult
  human · 4 = exceptional · 5 = rare talent. Play pushes traits past 5 with no
  ceiling; the fiction table above simply stops describing you.
  - *Bookkeeping note:* the character-sheet app expresses the same 7 as
    "base 1 per trait + 5 allocatable points per pillar." Same math, different
    clothes.
- Race: **Human**, **Animal**, or **Robot/AI**. Humans are the default; Animals
  and machines are rarer abductions with GM-shaped bodies (a sea lion does not get
  the standard two-arms-two-legs sheet — see §7.1).
- Level: 1. Skill points come from traits (§3.3); skills are revealed and unlocked
  in play (§4.4).

> **Sidebar — machines & conditions**
> A Robot/AI contestant uses the same body-part and condition rules with these
> readings:
> - **Bleeding** = structural leaks (hydraulics, coolant, power). Tier effects are
>   identical; the fiction differs.
> - **Poison / Infection** target biology: a pure machine is immune; a hybrid or
>   bio-mechanical body takes them at the GM's reading of its parts.
> - **Crushed, Burn, Chilled** apply in full.
> - **Suffocation**: no airway — immune to smothering. Overheating, vacuum, or
>   coolant loss can impose the same 2-Clock timer where the fiction supports it.
> - **Dissolution**: a mind is a mind. Machines are not exempt.
> - **Shock** = system fault / pain-analog interrupt. Applies normally.

### 2.3 Actions and stats

Actions **auto-succeed** when the stat requirement is met — no to-hit rolls.
Common mappings:

| Action | Stat(s) |
|---|---|
| Sprint / Chase / Swim / Resist Physical | Physique |
| Climb | Physique + Reflexes |
| Balance / Sneak | Reflexes |
| Shadow | Reflexes + Mind |
| Leap / Vault | Reflexes + Physique |
| Command | Charm |
| Persuade | Charm + Mind |
| Intimidate | Charm + Physique |
| Track / Navigate / First Aid / Resist Mental | Mind |
| Bluff / Repair / Rig / Disable Trap | Mind + Reflexes |

---

## 3. Advancement

### 3.1 Levels and level points

- **Levels are awarded by the GM at milestones** — bosses, floors, major
  achievements. There is no XP curve. (An XP-based variant may arrive in a future edition.)
- Each level grants **1 level point** into a shared pool. A level point buys
  **+1 to any one trait** — any trait, either pillar.
- Levels grant nothing else by default (no automatic HP). More HP comes from
  Physique (§3.2) or explicit rewards.

### 3.2 Trait growth past 10 — milestone bonuses

**Traits have no cap. They grow infinitely.** The over-10 thresholds are not
ceilings — they are **repeating milestone payouts**: from 10 upward, every trait automatically pays out an extra effect
point at each step, forever:

| Trait | Every … points past 10 | Grants |
|---|---|---|
| Physique | 5 | **+1 max HP to every body part** |
| Reflexes | 12 | **+1 physical resistance point** (allocate to Bleed, Crush, or Burn) |
| Mind | 15 | **+1 psychic resistance tier** |
| Charm | 20 | **+1 Camera Call stack** (per session — §17.3) |

(The formula in each row is `floor((trait − 10) / N)`, matching the live
character-sheet app exactly.)

### 3.3 Skill points

- Each trait grants **skill points equal to its total − 1** (minimum 0): the first
  point in any trait earns nothing.
- **Multi-stat skills cost 1 point from EACH listed stat** to level.
- Spends are tracked per skill; leveling a skill down refunds exactly what its
  spend history recorded.

### 3.4 Respec

**There is no free respec or refund, ever.** Unlearning and rebuilding is possible
only through specific items or Lounge upgrades, and always at a cost.

Achievement rewards that grant "+1 to a stat" are **permanent** trait points —
identical to a level-point spend, counting toward stat caps.

---

## 4. Skills

### 4.1 The 0–10 architecture

Skills run **0–10**:

- **Level 0** — revealed but untrained: you can see the skill exists; it does
  nothing yet.
- **Level 1** — the effect works.
- **Levels 1–5** — **numeric scaling**: damage, range, duration, reliability,
  scope grow.
- **Levels 6–10** — each level **generalizes the skill to more situations**, while
  the numbers keep scaling. A fire-throwing skill might learn to cluster, carry a
  secondary damage type, originate away from you, trigger on new conditions, and
  finally touch an exotic damage class — each skill generalizes *on its own
  terms*.

### 4.2 Caps, thresholds, upgrades and mutations

- Every skill can go to **10**. **Levels 1–5 are naturally available** — the
  starting cap of 5 needs no unlocking. **Levels 6–10 unlock one by one:** each
  step past 5 costs a **Patron Token** (+1 max level per token), to the ceiling
  of 10. Cap 5 = useful; cap 6 = build-defining; level 10 = game changer.
- **Thresholds:** every level from 5 up is a threshold. Reaching one **Upgrades**
  (adds effects) or **Mutates** (changes purpose completely) the skill. **The GM
  offers the available upgrade or mutation. The work itself happens only in the
  Lounge, at the Skill Gemstone, and only through compatible skills (§4.5).**

### 4.3 Multi-stat skills

- A skill attributed to more than one stat levels only with points from **every**
  listed stat (§3.3).
- **No stat binds the skill's maximum:** as long as you can pay the points from
  each listed stat, the skill levels freely — a low trait does not cap it.
- Three-stat skills exist (e.g. Camouflage). They are legal, just expensive.

### 4.4 Acquisition

- Most skills **unlock by doing**: fulfill the obtaining requirement and the skill
  is revealed at level 0.
- Magic and similar require an **external source**: appropriate-tier Loot Boxes,
  Achievements, or Lounge modules (e.g. the Wizard's Tower).
- **Skill Tomes are a legal external source**: consumed in downtime, the named
  skill becomes acquirable at level 0 (named `Skill Tome: <book title>` so
  players always know one on sight). **Limited-magic items** instead *cast* one
  specific skill without ever teaching it (the fireball orb).
- Some skills are **character-exclusive** — tied to one contestant's nature and
  not obtainable by others.

### 4.5 Consuming skills

Skills can combine/consume other **compatible** skills to upgrade or mutate. The
**Skill Gemstone** (§20) is the Lounge station where all merging and upgrading
happens. Consumed skills permanently alter the result and are unrecoverable
unless stated. Never automatic — requires conditions AND player consent.

**Compatibility — the keyword system:** every skill carries
2–4 keywords from a small hierarchy of **broad** groups and **narrow** members:

| Broad | Narrow |
|---|---|
| magic | fire · cold · toxin · psychic · force |
| strikes | blade · blunt · unarmed · flurry · precision · power |
| movement | leaping · tumbling · rushing |
| performance | deception · presence · sound · projection |
| survival | treatment · bracing · aquatic |
| control | grapple · throw |
| perception | empathy · patterning · awareness |
| infiltration | stealth · locks · squeezing |
| craft | repair · improvisation |

**Skills sharing a NARROW keyword are compatible** at the Gemstone. Sharing only
a **broad** group (two magic skills of different elements, say) is the "ask the
GM with a fiction reason" case. No overlap = incompatible. New skills pick from
this list; the GM may grow the taxonomy deliberately, never casually.

**The canonical worked example:** **Intercept Lv 5 +
Brace Lv 3** — compatible through *bracing* — merge at the Gemstone into
**Iron Stance**: the mobile bodyguard consumes the self-brace and becomes the
rooted bulwark (while you hold your ground, attacks on adjacent allies retarget
to you). Both parents are consumed; the mutation arrives at level 1.

### 4.6 Priming — there are no cooldowns

Powerful skills are gated by **preparation, not waiting**. A skill with a prime
requirement cannot fire until its prime is satisfied. The five prime types:

| Prime | You must… | Example shape |
|---|---|---|
| **CHAIN** | use it immediately after a named action on the same target | Feint → Pressure Strike |
| **STANCE** | be holding a declared stance (ends on listed triggers) | defensive footwork enabling Tactical Roll |
| **STACK** | consume N accumulated charges | Camera Call stacks |
| **STATE / POSITION** | have target or self in a state or position | target Exposed; you behind the target |
| **PREP / CHANNEL** | spend a preparation action to arm a one-shot prime | wind up the big swing |

- High-tier items may **skip specific prime requirements** — that's deliberate
  design space, not a loophole.

### 4.7 Passive and reactive skills

- **Passive skills** are always on and need no upkeep unless their text
  explicitly says otherwise.
- **Reactive skills** declare a **trigger** and fire out of turn — see §5.6 for
  what a reaction costs you.

---

## 5. The Clock

### 5.1 Moments

- Combat runs on a shared **Clock of 10 Moments, counting down 10 → 1**. After
  Moment 1 completes, the Clock **resets** and a new lap begins.
- Actions cost Moments. Multiple combatants can act on the same Moment. Actions
  **overlap — they never interrupt** (the one exception is a declared reaction,
  §5.6).

### 5.2 Initiative and surprise

- The player party chooses which side acts first (unless surprised). The chosen
  side acts on the starting Moment; there is no fixed order within a Moment.
- **Ambush:** the ambusher enters at the normal starting Moment; a surprised side
  enters late — minor surprise **Moment 8**, full ambush **Moment 5**. Surprised
  characters cannot act before their entry Moment.

### 5.3 Scheduling — declare and resolve

- On your Moment, **declare** your action. Your next action comes at
  **current Moment − cost**.
- **Crossing the Clock boundary**: scheduling
  simply continues into the next Clock. Declare a 2-cost action on Moment 1 and it
  resolves on **Moment 9 of the next Clock**. (Arithmetic: go below 1, add 10.)
- **Instants:** actions costing **0 or 1** declare **and resolve on the same
  Moment**. You cannot see one coming and move away from it.
- **Windups:** actions costing **2+** declare now and resolve when their Moment
  arrives. The actor is **Exposed** for the duration and takes no other actions
  until resolution.
  - A windup **can be dodged by leaving its range or area before it resolves**.
  - Range and validity are **re-checked at resolution**; an invalidated action
    collapses into **Forced Action – Tool**.
- **Multi-Moment actions resolve before Forced Action consequences** apply.

### 5.4 Simultaneity

Everything resolving on the same Moment computes against the **state at the start
of that Moment**:

- Two lethal same-Moment attacks **both land** — simultaneous kills trade. Nobody
  gets order priority.
- Where two same-Moment effects genuinely collide (both grab the last item), the
  GM calls it or rolls off. Ties otherwise resolve in any order fitting the
  fiction.
- **"Miss" is not a general mechanic.** It exists only as an explicit effect
  ("the first melee attack against you misses") or as a **Dodge Threshold** an
  enemy or ability carries (§14).

### 5.5 What one Moment allows

Per Moment, a combatant gets at most:

1. **One scheduled action** (the one due this Moment),
2. **One free (0-Moment) action** — 0-cost skills are legal and consume this slot,
3. **One reaction** (§5.6). A 0-cost reaction consumes the free-action slot too.

**Movement:**
- A move of **1–3 spaces is free** but consumes the free-action slot — **once per
  Moment**.
- Longer moves cost `ceil((spaces − 3) / 4)` Moments as a scheduled action.
- You cannot move twice in one Moment.

**Inventory**:
- The **first** inventory interaction of a combat is free (consumes the free
  slot); **every later one costs 1 Moment**.
- An item's own listed Moment cost **replaces** the interaction cost when higher —
  one cost, never two.

**Units:** 1 space = 1 hex on the map. Older item text saying "tile" means space.

### 5.6 Reactions

- A reactive skill declares its **trigger** when readied. When the trigger fires,
  the reaction **resolves immediately**, out of schedule.
- **You pay by acting later:** the reaction's Moment cost is added to your next
  scheduled action's Moment.
- **Max one reaction per combatant per Moment.**

### 5.7 Combined actions

Contestants acting on the same Moment can act **together**:

- A combined action is a set of **linked declarations resolving on the same
  Moment**. Every linked actor pays their own cost.
- **Assists provide requirements**: a brace supplies "steady ground," a boost
  supplies the height, a feint supplies the opening. Teamwork's primary power is
  *unlocking*, not just adding.
- **Combined attacks merge damage and count as ONE hit** for anything keyed to a
  single hit (breach thresholds, §21). This is the party's designed path to
  single-hit numbers no individual can reach.
- Ally-targeted buffs/heals and item handoffs are legal combo members; handoffs
  ride the inventory economy (§5.5).
- **Failure degrades, never vetoes:** if a linked actor's requirement fails or a
  Forced Action fires on them, their contribution drops out and their consequences
  land — the partners' parts still resolve.

---

## 6. Forced Actions

Any action taken while unsafe, impaired, or unqualified. **Always allowed.** The
action resolves normally; consequences apply immediately after (or on the next
Moment).

### 6.1 The tables (d6)

**Body table** — strain, condition-driven acts, above-your-weight physicality:

| d6 | Consequence |
|---|---|
| 1 | **Tear Something** — 1 damage to the relevant part; escalates at 0 HP |
| 2 | **Lock-Up** — the part is unusable for 3 Moments |
| 3 | **Condition Surge** — advance an active condition 1 tier (prioritize the responsible one; if none, Shock T1) |
| 4 | **Drop** — drop the item in the involved limb |
| 5 | **Shock Spike** — +1 Shock tier |
| 6 | **Stumble** — Exposed until your next Moment |

**Tool table** — weapon/equipment use you're not qualified for:

| d6 | Consequence |
|---|---|
| 1 | **Whiff** — the action fails entirely (no ammo spent) |
| 2 | **Overcommit** — Exposed |
| 3 | **Collateral** — hit an ally, object, or the environment instead |
| 4 | **Slip** — unarmed until your next Moment |
| 5 | **Strained Grip** — +1 Moment cost on your next tool action |
| 6 | **Overextension** — your next scheduled action is delayed +1 Moment |

**Which table**: weapon/tool/stat-requirement shortfalls
roll **Tool**; condition-driven strain and physical overreach roll **Body**.

### 6.2 Unmet requirements are a real gate

Acting with unmet stat/equipment requirements triggers the Forced Action **and
halves the action's damage or effect magnitude (round down)**. Desperation moves
stay legal; stats matter.

---

## 7. Bodies & Damage

### 7.1 Body parts and HP

Health is localized. Standard body:

| Part | HP | Lethal? |
|---|---|---|
| Head | 2 | **Yes** |
| Torso | 5 | **Yes** |
| Each arm | 2 | No |
| Each leg | 3 | No |

- HP is structural integrity; **0 HP = the part fails**.
- Non-standard bodies (Animals, machines) get GM-shaped part layouts with the same
  logic; every body needs a head-equivalent and torso-equivalent (lethal parts).
- Every combatant has a **size**: Small / Medium / Large / Huge. Humans are
  Medium. Effects referencing size read this field.
- A part's max HP can be raised by **race, class, achievements, skills, and
  stats** (Physique is the systematic source — §3.2).

### 7.2 Targeting

- **Head untargetable by default** — only when the target is **Exposed,
  Helpless, or Overwhelmed** (ambush, execution, extreme speed disparity).
- Torso, arms, legs: always targetable unless the fiction prevents it.

### 7.3 Force, and how damage resolves

#### Force — the unit everything is measured in

**One Force is one basic punch.** Every source of damage in the game is counted
in that same unit, so a weapon, the material it is made of, a lit torch and a
dose of poison can be added together and held against the thing you are trying
to kill.

An attack's Force is the sum of:

- its **weapon class** (§12.1);
- **+1 for every material band step** it is built from (§12.7);
- anything **added** to it — an element, a coating, an affix, a venom;
- whatever your **preparation** contributed before the fight started (§21.5).

Every part of that total carries a **damage type**, and the tags are what make
preparation matter:

- **A weakness doubles that type's contribution.** A torch adds 1 Force to
  anything, and 2 to something that burns.
- **Resistance subtracts from its own type only** — and never more than that type
  dealt. Fire resistance 5 against 1 Force of fire eats the 1 and wastes the
  other 4 (§10).

**An enemy's HP is Force.** A mob is five punches. It does not matter whether the
five arrive as a club, a fire, a poison or a fist — five is five.

**Force is not a condition.** Force is what the attack does *now*; a condition is
what it leaves *behind*. An effect may carry either or both, and it has to say
which. Bleed, Crush and Burn carry Force and a tier together. Chill, Poison,
Infection and Dissolution carry a tier and **no Force by default** — but an item
or ability may grant them Force explicitly (a poisoned blade adding 1 Force of
Poison), and that Force then answers to Poison resistance like any other type.

#### The steps

1. Choose a valid body part.
2. Total the attack's **Force** (below), keeping each part of it tagged with its
   damage type.
3. Subtract **typed resistance** — from its own type only, and never more than
   that type actually dealt (§10).
4. Subtract **universal resistance**, once, from whatever is left (§10.1).
5. Deal the remainder to the part.
6. Apply the damage type's condition (§8.1).

**Area does not divide.** An attack covering more than one target deals its
**full Force to each of them**, unless the attack says otherwise. Nine enemies in
the arc take the whole number, nine times over, and each of them then applies its
own resistances. This is why a sweep is how you answer a tide — and why §12.1's
heavy weapons demand an adjacent empty radius. You cannot swing one in a press.

Small HP pools are the design: parts fail fast; the real fight is about *which*
parts and *which* conditions.

### 7.4 Disabled parts (non-lethal at 0 HP)

- **Arm:** drops held items; no two-handed actions; using it = Forced Action with
  severe consequences.
- **Leg:** movement = Forced Action; the target becomes Exposed; sprinting/evasion
  is extremely dangerous.
- Further damage to a disabled part doesn't reduce HP — it escalates conditions or
  causes permanent loss/detachment (detachment applies Bleeding).
- **Recovering severed/destroyed parts:** the Surgeon's Table, prosthetics (the
  Augmentation Hub), regeneration skills, high-end healing skills, and truly
  exceptional potions.

### 7.5 Death and bleed-out

- **Death:** head or torso at 0 HP.
- **Bleed-out:** if head/torso hit 0 via a **delayable condition** — Bleeding,
  Poison, Infection, or a Burn timer — the character instead enters a **1-Clock
  bleed-out**: they are **Helpless**, any damage kills them, and **delaying or
  curing the causing condition stabilizes them at 0 HP**.
- **Direct weapon damage or Crushed to 0 = immediate death.** No bleed-out.
- **Exhausted never kills** (it has no death mechanism and is no longer on the
  death list).
- **Bleeding T4 kills from any part** — you can bleed out from a limb wound.

---

## 8. Conditions

### 8.1 The universal condition engine

- **Application:** a damage type applies its condition at **Tier 1** on first
  application to a part. While active, a new application of the same type to that
  part **advances it one tier** — at most one attack-driven advance per part per
  Moment.
- **Advancement:** at **every Clock reset, every active, non-delayed condition
  advances one tier.**
- **Delayed:** a Delayed condition **skips exactly one advancement** and loses its
  delay.
- **States:** Active / Delayed / Resolved. In-combat treatment usually **delays**
  (bandage → Bleeding, antitoxin → Poison, clean air → Suffocation). Full
  resolution needs downtime, advanced tools, or explicit abilities.
- Conditions stack freely across types; multiple lethal timers can run at once.

**How a condition expresses Force.** Force and tiers are two layers and they are
not the same thing: **Force is what an attack does now; a tier is what it leaves
behind.** Every condition below states which it carries.

| Type | Force | Tier |
|---|---|---|
| **Bleed · Crush · Burn** | yes — the attack's Force lands on the part | yes |
| **Chill · Poison · Infection · Dissolution** | **none by default** | yes |

An item or ability may grant an affliction type Force explicitly — a poisoned
blade written as *+1 Force (Poison)* — and that Force then answers to Poison
resistance exactly like any other type. What it may not do is arrive by
accident: **if a condition deals Force, the entry says so in a number.**

A condition that carries no Force is not weak. Infection advances everything else
a tier, Dissolution removes a contestant outright, and neither is measured in
punches.

### 8.2 Condition tiers

**Bleeding** — HP on hit + condition; untreated wounds invite poison/infection.
| Tier | Effect |
|---|---|
| T1 | Open wound |
| T2 | Forced Action–Body + Shock T1 |
| T3 | Part dies (lethal on torso/head); all actions Forced Action–Body |
| T4 | **Death — from any part** |

**Crushed** — HP on hit.
| Tier | Effect |
|---|---|
| T1 | Break — Forced Action–Body |
| T2 | Shatter — limb disabled |
| T3 | **Part destroyed** — lethal on torso/head; permanent loss on limbs |
| T4 | **Death** (torso/head only) |

**Burn** — HP damage to a specific part.
| Tier | Effect |
|---|---|
| T1 | Cauterizes: stops Bleeding, removes Chill — **and applies Shock T1** (the price of the field-cautery trade) |
| T2 | Stops poison, clears infection; Forced Action–Body |
| T3 | Part disabled/partial loss; on torso/head starts a **1-Clock death timer** |
| T4 | **Death** |

**Chilled** — specific part, no HP damage.
| Tier | Effect |
|---|---|
| T1 | Resolves at the next Clock reset **unless re-applied during the Clock** *(replaces the old "8 Moments" oddity)* |
| T2 | Forced Action–Body |
| T3 | Part disabled (head: usually fatal/incapacitating) |

**Exhausted** — whole body.
| Tier | Effect |
|---|---|
| T1 | +1 Moment on actions costing 2+ |
| T2 | +1 Moment on all actions |
| T3 | Every action is Forced Action–Body |

Recovers one tier per Clock spent taking no scheduled actions; fully resolves out
of combat. **Cannot kill.**

**Infected** — whole body.
| Tier | Effect |
|---|---|
| T1 | Prevents healing and resolution of other conditions |
| T2 | All other active conditions advance **one extra tier** at Clock reset |
| T3 | **2-Clock death timer** |

Cures: **time** (depending on the infection), potions, and cleansing skills —
plus Burn T2's field cautery (above).

**Poison** — no immediate HP damage. Entry conditions: open wound, orifice,
injection/bite, or a helpless target. Activation delay usually 2 Clocks. Always
targets specific parts.
| Tier | Effect |
|---|---|
| T1 | Disruptive (no lethal clock) |
| T2 | Crippling (disables, introduces clocks) |
| T3 | Catastrophic (lethal clock — must be delayed or cured) |

- **Types are compatibility classes**:
  **same type stacks tiers; different types are incompatible → Poison Soup.**
  Each type also carries a signature effect on top of the tier framework:

| Type | Signature effect |
|---|---|
| **Neurotoxin** | Gradually makes parts unusable, until the victim is Helpless |
| **Hemotoxin** | From T2 the target cannot heal, and Bleeding advances at twice the speed and damage |
| **Myotoxin** | Lowers Body traits dramatically, scaling by tier |
| **Pneumotoxin** | Starts the Suffocation timer once it reaches the torso; severity scales by tier |
| **Cytotoxin** | Damage over time |
- **Poison Soup:** all poison effects on the part end; direct HP damage equal to
  the combined tiers — **capped at the part's max HP − 1 on head/torso**
  (brutal, never a guaranteed instant kill — in either direction).
- **Spread:** on advancement, spreads to an adjacent part at reduced intensity,
  sharing the advancement clock (Arm/Leg → Torso; Torso → Head or Limbs).

**Suffocation** — torso only, ignores limb HP: a **tierless 2-Clock death
timer**. Item text saying "Suffocation Tier 1" means **"delay Suffocation by one
Clock."**

**Dissolution** — the Mind's Suffocation. Tierless. Cannot be applied by standard
attacks — it requires an explicit source. *(Errata 2026-08-18: the flat 2-Clock
timer is replaced by the grace-and-hold below. Everything else is unchanged.)*

- **Grace.** On application, **one full Clock** runs with no rolls. Nothing is
  asked of the victim yet. (A timer created mid-Clock counts the partial Clock at
  the first reset, §8.3.)
- **The hold.** At that Clock's reset the **Hold Threshold** opens, and equals
  **1 + the Moments elapsed** since the reset — 2 on the first Moment, 3 on the
  second, climbing to 11 if the Clock runs out.
- **The check** is **Mind** against the threshold, on §14's mechanism:
  **Mind ≥ threshold → you hold automatically, no roll.** Otherwise **Mind + the
  Mind threshold die** (d4 by default, upgradeable at the Tattoo Artist) ≥
  threshold. The check is **free** — it costs no Moment and no free-action slot,
  and the victim may still act. Holding on is not what stops you fighting.
- **One failure ends it.** **The mind collapses: the contestant is permanently
  removed from play.** No revival. There is no second roll and no grace Moment.
- **The last Moment is knowable.** §14 requires the GM to say when a threshold has
  become unreachable — so the table is told, out loud, exactly how many Moments
  remain. *Being clear about the danger is the whole bargain: after that, their
  lives are in their hands.*
- **Removing the cause freezes the threshold** where it stands and stops the
  rolling — it never resets. Re-exposure resumes from the frozen number.
- **Escalation rate rides the source.** A haunted object climbs **+1 per Moment**;
  a noble-class, divine or authored horror may climb **+2 or +3**. This is where a
  stronger source is expressed — not in the victim. It is also what keeps
  Dissolution lethal to a Mind that has been farmed into the 20s.

Whether what remains is a husk, a puppet, or something worse is the story's to
tell — but the person is gone, and it is worse than death.

### 8.3 Timers and partial Clocks

A timer created mid-Clock counts the partial Clock at the first reset (harsh).
Bleed-out always gets one full Clock of grace. A timer created during a reset
starts at the next reset.

---

## 9. Shock

Shock is the body's pain response — **momentary events, not an accumulating
pool**:

- A shock source applies its **stated tier directly**. Escalation is the
  exception, not the rule.
- Track only the combat's **high-water mark**. A source that "elevates" applies
  `highest-this-combat + 1`.
- A shock source hitting a part that **already produced shock this combat**
  elevates +1 (repeated abuse of the same wound).
- An independent shock while already Shocked applies
  `max(current + 1, source tier)` — a strong source is never weakened by the
  target being lightly shocked.

| Tier | Event |
|---|---|
| T1 | **Shout** — cry out; draws attention; breaks stealth |
| T2 | **Stutter** — freeze; your current action fails |
| T3 | **Faint** — collapse: Helpless for 1 Clock; drop held items |
| T4 | **Helpless** — and Exposed for the rest of the combat |

- **No decay in combat. Full reset at combat end.** That's the whole recovery
  rule.
- Burn T1 inflicts Shock T1 (§8.2) — cauterization's price.

---

## 10. Resistances

- **Flat resistances** reduce HP damage of their type (2 Bleed resist = −2 Bleed
  damage, floor 0). **Flat resistance never blocks condition application** — tier
  immunity does that.
- **Classification:** Physical = Bleed/Crush/Burn (flat) · Affliction =
  Chill/Poison/Infection (tiered) · Psychic = Dissolution (tiered).
- **Tiered resistance = immunity** to effects of its tier and below.
- **Psychic resistance vs Dissolution**: each psychic tier adds **+1 Clock of
  grace** before the Hold Threshold opens (§8.2). It buys time, never immunity.
- **Enemy mental resistance is FLAT**, and exceeding it by a significant margin
  grants the attacker a bonus (viewer spike / secondary effect).
- Player affliction resistance (Chill/Poison/Infection tiers) has no automatic
  source: it is GM-awarded, explicitly, when earned.

### 10.1 Universal resistance — a threshold, never a stat

Some things reduce **every** type at once. A universal resistance of 6 means an
attack needs **7 Force to do anything at all** — which is the same object as a
threshold: *"it takes seven to break this grip."*

- **It applies to the TOTAL, once — never per type.** Four Force of Physical and
  four of Fire is eight Force, and eight beats a seven-threshold. Applied per
  type it would not, and a threshold that rejects eight damage is not a
  threshold.
- **Typed resistance resolves first**; universal takes whatever survives it.
- **A universal resistance is ALWAYS caused by something** — a structure, a
  stance, a hold, an active effect. It is **never a creature's standing state.**
  A golem carries universal 6 because of the shell it is made of, and chipping
  the shell lowers it or strips it entirely. A grapple carries one because
  someone is holding on, and it ends when they stop.
- **So every universal resistance names two things: what causes it, and what
  takes it away.** One without the other is not a legal entry. A number nobody
  can answer is not difficulty; it is a wall.

Where typed resistance asks *did you bring the right thing*, universal resistance
asks *did you bring enough at once*. Four contestants hitting for 5 each do
nothing to a universal 6; one contestant hitting for 8 does 2.

---

## 11. States Glossary

| State | Rules |
|---|---|
| **Exposed** | Lethal targeting allowed against you (head, executions). Caused by: Stumble, Prone, Helpless, Channeling, windups, exposing abilities. |
| **Helpless** | Cannot act or react; you are Exposed; attackers may target **any** part including the head. |
| **Prone** | You are Exposed; may only crawl 1 space per Moment; standing costs 1 Moment (scheduled). You cannot dodge (§14). |
| **Slowed** | Free-move allowance drops 3 → 1 space; movement Moment costs double. |
| **Channeling** | = performing a multi-Moment action. Already Exposed (§5.3); the word adds no new state. |
| **Overwhelmed** | GM-adjudicated: ambush, execution positioning, extreme speed disparity. Opens head targeting (§7.2). |
| **Alerted** | Knows *something* is there, not where (§15). |

---

## 12. Weapons & Equipment

### 12.1 Weapon classes

Requirements must be met or the Forced Action applies (§6). Base classes
:

| Class | Req | Hands | Range | Cost | Damage |
|---|---|---|---|---|---|
| Light Small (daggers, knives, tools) | 1 Physique | 1 | 1 | 1 | 2 Bleed |
| Light Large (rapiers, whips, spears) | 3 Physique | 2 + adjacent empty radius | 2 line | 1 | 2 Bleed |
| Heavy Small (maces, hammers, axes) | 2 Physique | 1 | 1 | 1 | 2 Bleed/Crush |
| Heavy Large (greatswords, mauls, halberds) | 5 Physique | 2 + adjacent empty radius | 2 line/arc | 1–2 | 3 Bleed/Crush |
| Light Ranged (pistols, bows, slings) | 2 Reflexes | 1–2, steady ground, ammo | 5+ | 1 | 1 Bleed **per round** |
| Heavy Ranged (rifles, shotguns, cannons) | 4 Reflexes | 2, steady ground, ammo | 5+ line/cone/area | varies | 4 Bleed/Crush **per round** |

- Items may deviate from their class baselines — a store spear can be worse than
  the class line; unique items can be better.
- **Cost is in Moments** — the Moments an attack with the weapon takes. (Other
  cost axes may appear on authored items.)
- **Stat-valued ranges** ("Range: Reflexes") mean the range equals your current
  stat total.

### 12.2 Ranged fire: RPM, magazines, reload

- Firing is a **1-Moment action that delivers up to RPM rounds** — same target, or
  split across targets in your firing arc. Listed damage is **per round**.
- Weapons carry a **magazine** (rounds before reload). Defaults: light ranged
  **6**, heavy ranged **2**.
- **Reload: 2 Moments, both hands** (auto-reload weapons excepted).
- Multi-RPM authored items (e.g. the Spark-volver, RPM 3) are flagged for a
  per-round damage rebalance — at 3 rounds × (2 Burn + 1 Crush) per Moment the old
  values out-damage a greatsword. Until rebalanced, the GM adjudicates.

### 12.3 Weapon tiers & modifiers

**Tier = modifier slots + access:**

| Tier | Prefix / Suffix slots | Modifier tiers accessible |
|---|---|---|
| Crude | 0 / 0 | — |
| Basic | 1 / 0 | Lesser only |
| Quality | 1 / 1 | up to Normal |
| Superior | 2 / 1 | up to Higher |
| Exceptional | 2 / 2 | up to Legendary |

Progression = **access**, not just slots. Modifier tiers: Lesser, Normal, Higher,
Legendary, Mythic, Godly. **Lesser and Normal are designed — the live app
modifier catalog is the source of truth**; the working list below is historical.

**Tiers apply to ALL items** — weapons, armor, tools, consumables alike. Naming
follows the tier: plain functional names through Basic, solid-but-generic at
Quality, flair from Superior up (and `<Tier> <Base>` — "Quality Rapier" — when
one base spans tiers).

**Lesser modifiers (historical working list):** Poisoned (T1 Poison on hit), Serrated
(+1 Bleed), Weighted (+1 Crush), Spiked (secondary 1 Bleed on Crush hits), Hollow
Point (ignores 1 armor), Chilling (Chilled T1 on hit), Explosive Tip (crit →
1-space blast), Barbed (removal deals +1 Bleed). **Draining is capped once per
Clock per target.** Padded and Reinforced are flagged out (candidates: Wrapped,
Balanced, Sure-grip).

**Extraction (Enchantment Altar):** Lesser/Normal — extractable with a chance to
destroy the modifier (odds improved by Lounge upgrades/skills). Higher+ —
extraction drops the weapon one tier. Legendary+ — extraction destroys the weapon.

**Pre-affixed drops**: dropped and looted gear of Quality
and above arrives **pre-affixed about 1-in-3**, always within the tier's
access rules. The Altar *moves* modifiers — it was never their only source.

**Reaching Exceptional — polish, not drops.** Exceptional gear is never found;
it is reached. **Polish Kits** are a downtime Forge action, one d6 per kit:
Crude kit 1–3 fail / 4–6 +1 tier (works rungs up to →Quality) · Normal kit 1–2
/ 3–6 (up to →Superior) · Superior kit 1 fail / 2–5 +1 tier / 6 **double
success, +2 tiers** — the only kit that completes →Exceptional, and it is never
sold. A fail consumes the kit, never the item; polishing an item up a tier
includes re-naming it. Authored **growth items** are the other road up.

**Creation Kits** let a player assemble a weapon of the kit's tier: any base of
choice + modifier(s) of choice within the tier's slots and access (Basic kit =
base + 1 Lesser; Quality kit = base + prefix + suffix ≤Normal). No Exceptional
kit exists — the top of the ladder is polish-only.

### 12.4 Equipment slots

- **One item per slot — no stacking.** Slots follow the body's actual anatomy: a
  standard human has 1 head, 1 torso, 2 hands, 2 legs, plus accessory slots —
  necklaces, capes, belts, and the like.
- **Ring-class items** fit fingers and toes: up to **20** on a standard human
  (10 fingers, 10 toes).
- Non-standard bodies derive their slots from their parts (a sea lion has
  flippers, not hands). When in doubt, **think logically about the anatomy —
  that IS the rule.**

### 12.5 Uses & charges

- **Consumables** with uses are gone at 0. Buy another box.
- **Charged gear** (magazines, batteries, printed devices) refills at the
  Lounge — ammo free at the Fabricator, other charges **1 UT per full
  recharge** at the relevant module.
- **In the field, nothing refills** except via explicit items — a spare magazine
  is an item; the exo-suite's fabricator dock is the one exception.
- **Ammo carries a material** (§12.7): Standard rounds print free at the
  Fabricator; banded ammo consumes its material — ranged power has a running
  cost that melee doesn't.

### 12.6 Armor & protection

- **Armor is resistance** (§10): a worn piece grants flat resistance **to the
  body part(s) it covers**, and resists **stack across worn pieces** — the
  struck part's armor is what counts. Flat armor resists are **Bleed/Crush/Burn
  only**; afflictions are tiered territory.
- **Nullification lives at the top:** Superior armor may carry **T1
  nullification** of its theme type on the covered part; Exceptional reaches T2
  or full-type immunity on the part.
- **Shields** occupy a hand and grant their resist to the part the wielder
  defends (GM adjudicated).

### 12.7 Materials — what a thing is made of IS the power

- **Tier is craftsmanship; MATERIAL is scale.** Baseline materials (Scrap, wood,
  leather, iron) add nothing. Each floor introduces a **material band**, and
  **every band step a thing is made of adds +1 Force** (§7.3). A weapon reforged
  from a Floor 1 material to a Floor 2 one hits for one more punch — not for
  twice as much. Nine floors, nine steps, and the numbers stay small enough to
  hold in your head at Floor 9. The Floor-10 finale adds no band: it is fought
  with what you built. The catalog of record:
  `rulebook/item-drafting-materials.md`.

> **Errata 2026-09-01 — the band no longer multiplies. SUPERSEDED by Force (§7.3).**
>
> The 2026-08-18 errata that stood here made the band a ×2-per-floor multiplier
> on both sides of every exchange, so that it cancelled inside a floor and a
> greatsword read as 3 on Floor 1 and Floor 9 alike. It is withdrawn. It had two
> faults: it made every floor arithmetically identical to every other, so gear
> upgrades showed up on a sheet as nothing at all; and it broke the moment a
> weapon crossed a floor, where a Floor 1 sword read as 0.75.
>
> **A material step is now +1 Force.** The band's job is unchanged — it is still
> what separates the eras, and still what makes last floor's sword a
> letter-opener — but it does that by addition, and the difference between an
> average party and a prepared one is now larger than the difference between two
> floors. Which is the point: **the axis of progression is the player, not the
> floor.**
>
> **An item may still outpace its floor.** An Exceptional, apex-material or
> authored weapon can read above its class baseline, and that is exactly where
> gear earns its place inside a floor.

- **Parts are material capacity.** A weapon's parts (a sword: blade, guard,
  hilt, pommel — 4) set how many materials it can socket. No per-part effects:
  the **striking part** sets the damage band; every socketed material
  contributes its inherent property. Premade single-material weapons are the
  default; part-crafting is opt-in.
- **Modifiers are Force too.** An affix that adds damage adds **Force**, of its
  own type, and it is added like everything else (Serrated III is +3 Force of
  Bleed whatever it is bolted to). Condition and utility modifiers add no Force
  at all — a T2 Poison or a saved Moment was never a number.
- **Ranged & tech — the part that touches the target carries the band.**
  Rounds, shells, bolts, and arrows are made from materials and set the band;
  the delivery part (barrel, bow limbs) caps what it can safely fire; energy
  weapons band by their emitter/core.
- **Carve, gather, reforge.** Monsters are carved for materials (a boss yields
  its named material); floors are gathered; the Forge **reforges** any part
  into a better material — name, modifiers, and history survive. Consumables
  are *made from* materials but never have a material identity of their own.
- **Every item carries a bill of materials.** What each part is made of is
  written on the item, and the **striking part** is marked. An item with no bill
  is baseline stock — scrap, wood, leather, iron — and carries no band.
- **Disassembly.** At the Forge, any item can be **taken apart**: it is destroyed
  and **every material on its bill comes back whole**. Nothing is lost but the
  item. The cost is that it is a Forge action — you cannot do it in a corridor,
  and you cannot do it to something you are about to need.
- **Upgrading is a choice, not a schedule.** A weapon that entered the floor with
  you keeps working; it does not expire when a new band appears. You may reforge
  its striking part into the new band and keep the same weapon, take it apart and
  build something else out of the pieces, or carry it exactly as it is and accept
  that it hits like the floor it came from. All three are legitimate, and a party
  that never upgrades has made a real decision rather than a mistake.
- **What comes off a disassembly is materials, not parts.** A blade returned to
  the Forge yields *Obsidian*, not *a blade* — so the same Obsidian may come back
  as an arrowhead, a lining, or a socket in something that is not a weapon at all.

---

## 13. Grappling

- Grappling requires a **free hand** and a target **no more than one size
  larger**.
- **Initiate** (1 Moment): succeeds automatically if your Physique ≥ theirs;
  otherwise it's a Forced Action – Body (always allowed; consequences apply).
- **While grappled:** the target cannot reposition; **both** of you are Exposed;
  the grappler can't reposition either (a two-sided lock).
- **Escape:** 2 Moments = automatic; 1 Moment if your Physique ≥ the grappler's.
- **Suffocation via grapple** (Pressure Hold and kin) additionally requires **both
  grappler hands and a coverable airway**. **Bosses — and anything two or more
  sizes larger — are immune to grapple-Suffocation.** Boss win conditions are
  discovered, not choked out.

---

## 14. Dodge Thresholds

"Miss" is never a universal rule — but some abilities and enemies carry a **Dodge
Threshold**. One check, both directions (you dodging a boss; a slippery boss
dodging your aimed shot):

- **The threshold asks the dodger's Reflexes.** Reflexes ≥ threshold →
  **auto-dodge**, no roll.
- Otherwise **add the stat's threshold die — default 1d4**: Reflexes + die ≥
  threshold dodges. If even the maximum can't reach it, the dodge is impossible —
  the GM should say so before the attempt.
- **No dodging while Helpless, Exposed, or Prone.** Windups, grapples, and prone
  are the punish windows.
- Collateral, condition damage, Forced-Action damage and environmental damage are
  **never dodged**.
- **Threshold dice are upgradeable, per stat** (d4 → d6 → d8) at the **Tattoo
  Artist** (§20.3 — d4→d6 = 5 UT, d6→d8 = 40 UT). The die is per-stat so
  future checks (Mind vs fear, Physique vs forced movement) inherit the
  mechanism.
- **Authored counter-ladders** stay a design pattern: e.g. a boss charge with
  threshold 7 might grant Reflexes 7 = auto-dodge + 1-space sidestep, Reflexes 9 =
  auto-dodge + free counterattack, below 7 = the 1d4 fallback.

---

## 15. Stealth, Detection & Cover

Applies in and out of combat.

- **Vision.** An entity sees out to roughly **2× its Mind stat** in spaces,
  through a **vision cone** — eye placement and field of view matter, so different
  creatures watch differently. **If you are seen, you are not stealthed** (within
  cone + in range + line of sight → revealed).
- **Hearing.** A heard noise makes an entity **investigate, ignore, or react**
  per its nature. Two escalations: (a) reacting turns/moves it so you enter its
  cone → revealed; (b) a smart-enough entity becomes **Alerted** — it knows
  *something* is there, not where. Alerted-but-unlocated is deliberate design
  space: scapegoats, decoys, illusions, misdirection.
- **Disguise.** A disguise defeats recognition **outside its stated range**; only
  within that close range does the entity see through it.
- **Cover is geometric.** Covers have real heights and sizes; gaps and holes have
  real dimensions — some skills exploit specific gap sizes. Cover blocks vision
  per its geometry. The GM's map is the authority.
- **Stealth does not suppress the audience.** Sneaking impeccably past every guard
  IS spectacle; a hunter stalking prey IS spectacle. What you *do* with stealth
  determines the crowd's reaction, not the hiding itself.
- Shock T1 (Shout) breaks stealth. Camouflage-type skills state their own
  reveal conditions.

---

## 16. Healing & Downtime

- **In the field:** conditions can only be **Delayed or Resolved** per their
  treatments. **HP does not regenerate**, and **no item restores HP** — items
  treat and delay conditions only. Applying a treatment to yourself or an ally
  costs **1 Moment** (§5.5's interaction economy applies).
- Field HP recovery exists **only** via explicit, rare, stated abilities.
- **At the Lounge:**
  - **Free rest** (Dormitories): resolvable conditions resolve over a downtime —
    time heals sickness — but HP trickles back at only **+1 per part per
    downtime**.
  - **The full medical restore is INVOICED** at the **Med Bay** (§20.3):
    **`Floor × 2^(claims already made this floor)` Upgrade Tokens** per
    contestant, claim counter resetting each floor. All parts to max, all
    resolvable conditions cleared, reattachment triage included. Premiums rise
    with every claim and every floor deeper — hazard pricing, itemized, on
    camera.
  - **Bleed-out stabilization is always free.** Losing the contestant costs the
    Corporation more than stabilizing them. Almost always.
- Deliberately harsh: wounds are content, and the audience loves a limp.

---

## 17. The Audience

### 17.1 Exposure

**Entire galaxies are watching.**

- **Viewers** — active watchers. **Counts run in the billions, easily.**
  Correlate with reward potential and session chaos; the conversion pool for
  Followers. Viewer counts decay when you're boring.
- **Followers** — **paying watchers**, at phone-vote money: they pay a little to
  follow you. A useful GM instrument: follower counts track the percentage of
  watchers who'd actually pay to vote. Notified when you're active; affect TV
  rating and Directive volume; potential allies and enemies. **Followers decay** —
  they can stop paying for you.
- **Patrons** — **one-time large donors** (the streamer-gets-$5,000 tier of the
  galaxy). Can set paid Goals (direct story intervention + rewards). Because the
  donation already happened, **the Patron roster is permanent — once on your
  list, always on your list.**

Session-to-session numbers stay in the GM's hands; the structure above is the
contract.

### 17.2 Patron Tokens

- Earned when a **Goal converts a new Patron**, and from the exchange (§19.2).
- Spent to raise a skill cap beyond 5 — +1 max level per token, ceiling 10 (§4.2).

### 17.3 Camera Call

- Charm past 10 earns **Camera Call stacks** (§3.2) — each stack is one use per
  **session**, where a session = **one dungeon deployment** (leave the Lounge →
  return, extract, or die).
- **Effect:** the camera focuses a target: **Viewership, Follower, and Patron
  gains AND losses from that target are doubled** until the end of that target's
  current or next action.
- **Self-calls are legal** — spotlighting yourself is the
  Charm build's play. **One spotlight at a time.** The doubling covers audience
  gains and losses attributed to the spotlit contestant and ends with their
  current-or-next action. Losses double too — the camera is a gamble, not a buff.

### 17.4 Goals (crowd challenges)

- Issued by the audience for rewards + crowd favor. Spectacle (Finish Fast,
  Overkill, Environmental Kill), Performance (Play into a Tag, Say the Line),
  Risk (While Exposed, Without Healing, Solo), Subversion (Spare the Enemy, Betray
  Expectations).
- Rewards flow through the Achievement system. **A Goal that converts a viewer
  into a new Patron awards a Patron Token.**

### 17.5 Directives (corporate quests)

- Issued by The Corporation and its subsidiaries. Optional, risky, no guaranteed
  benefit. Direct Action / Manipulation / Performance / Pressure / Sacrifice types
  as authored.
- **Rewards: tiered loot via the Achievement system** — one reward contract
  per system: the Corporation pays in stuff; the audience pays in belief.️
- Refusing a Directive is playable (see the SAG Dispute tag). Consequences are
  the Corporation's to write.

### 17.6 Achievements & loot boxes

- The GM's recognition system: Scenario/Quest completion, class/race usage,
  Directives, Goals.
- Loot box tiers: **Bronze** (bulk utility) · **Silver** (tools, armor, limited
  magic) · **Gold** (game-changers) · **Legendary** (campaign-carrying) ·
  **Mythic** (meta-breaking) · **Godly** (defying fate, almost never given).
- Rewards: Buffs, Unlocks, Items, Abilities. Tiers can very rarely be upgraded.
- Boxes are **generic or specific** — boss-, quest-, or floor-themed; a
  specific box carries its source's materials and flavor. (Box tier ≠ item
  tier: a Gold *box* holds Quality–Superior *items*.)

**What's inside** — curated first: the GM stocks each floor's boxes to this
shape; roll tables are the fallback; boxes are themed to the floor that dropped
them:

| Tier | Contents shape |
|---|---|
| Bronze | 2d3 bulk-utility consumables; 1-in-5 boxes also hold a Crude–Basic item |
| Silver | 1 Basic–Quality weapon/tool/armor piece + 1d3 consumables; 1-in-10 a limited-magic item |
| Gold | 1 game-changer — Quality–Superior item, skill tome, or magic unlock — + a full Silver roll |
| Legendary | 1 campaign-carrying NAMED item (from the GM's authored list) + a full Gold roll |
| Mythic | 1 authored meta-breaking artifact — revealed as a **pick one of three** |
| Godly | **Never random.** One-of-a-kind, authored, fate-defying. The box knows who opened it |

### 17.7 Narrative Tokens

- Let players interfere with the script. Earned via crowd donations, corporate
  rewards, rare drops.
- One token = one significant narrative shift within a scene; scope by GM
  discretion.
- **Hard limits:** cannot raise the dead, change how someone feels about you,
  instantly kill, or mint more tokens. Alter events — never override core rules.

---

## 18. Tags

- Tags are your **public identity as the Show sees you** — they influence loot
  bias, crowd response, narrative framing, and mechanical triggers.
- **Gained via:** table consensus ("it's their thing"), hidden condition
  fulfillment, Goals/Directives, corporate narrative shaping. Player-proposed tags
  must appear on TVTropes.org.
- **Lifecycle:** acquired → **Reinforced** (play into it; stack gear/skills) →
  **Faded** (neglected) → **Lost** → reacquirable.
- **Except for Marks.** A **Mark** is a tag that records a deed rather than a
  performance, and it never fades — §18.4.

### 18.1 What tags DO — the six patterns

1. **On-brand spotlight.** Every tag carries 1–3 **domains** (below). Doing your
   tag's thing on camera is what the crowd pays for — on-brand plays are the
   reliable way to move Viewers (and, when Reinforced, Followers).
2. **The Show writes for you.** Goals and Directives are drawn toward your tags —
   your identity shapes your quest feed.
3. **Patron draw.** Patrons adopt contestants whose tags match their taste; your
   domains steer who takes interest in you and what paid Goals they set.
4. **Lifecycle is the dial.** Active = normal effect · **Reinforced = doubled
   pull, and the tag can only be lost by dramatically betraying it** · Faded =
   no effect until played back into.
5. **Flagship riders.** Ten hand-picked tags carry one bespoke trigger each
   (table below). Everything else stays declarative.
6. **Tag gates.** Items, skills, Directives, and unlocks may REQUIRE a tag —
   authored per content piece.

**The twelve domains:** carnage (kills, gore, overkill) · daring (risk, stunts) ·
showmanship (performance, style) · comedy (failure-comedy, timing) · heart
(empathy, protection) · menace (fear, villainy) · cunning (stealth, schemes) ·
grit (survival, comebacks) · teamwork (combos, assists) · chaos (collateral,
mayhem) · craft (improvisation, clever solutions) · meta (fourth-wall,
production awareness).

### 18.2 The flagship riders

| Tag | Rider |
|---|---|
| The Monologue | Once per session, a delivered monologue makes your next action's crowd payout triple |
| Comeback Stage | Returning from bleed-out or Helpless, your next action can't be interrupted and pays double hype |
| Fan Favorite | Once per session, ask the crowd for a Goal of your choice (the GM prices its reward honestly) |
| Scene Stealer | Once per session, redirect an ally's Camera Call spotlight onto yourself mid-scene |
| The Bit | The third performance of your bit in a session is an automatic Viewer spike |
| Nine Lives | Once per session, reroll one Forced Action die where the escape was movement-based |
| Unkillable | Once per campaign arc, refuse a death: you land in bleed-out instead, regardless of cause |
| Method Actor | Staying in character through a Forced Action consequence converts it into crowd favor |
| Munchkin | Once per campaign, an exploit you found is grandfathered for you even after the GM patches it |
| LEEROY JENKINS | Acting first in an ambush YOU triggered, your opening action costs 1 less Moment |

- Per-tag domains live on the tags themselves — your sheet shows them.

### 18.3 The Tag Compendium

*The complete list. Each description is the acquisition guide — knowing it is
playing it. Reading this chapter is allowed; that's what it's for.*

- **Documentary** — Everyday life turned cinema. Narrate or frame a mundane action as if it were meaningful. The crowd agrees.
- **Playa** — Flirting with danger. Voluntarily put yourself at risk for no tactical reason, and walk away from it.
- **Absolute Cinema** — Top 10 cinematic moments right here. Do something that makes the whole table go quiet for a second.
- **Edgy** — Careful, don't cut yourself! We don't have bandaids around here. Commit a genuinely dark act and show no visible reaction to it.
- **Anime** — Not another filler episode! Do something that would require a three-episode flashback arc to explain. In the moment.
- **LEEROY JENKINS** — Plan? I don't need a plan! Charge into a situation solo with no preparation and force everyone else to react.
- **Scrub** — Ouch, what a fumble! Gonna remember that one for a while. Roll a Forced Action consequence that makes things significantly worse for yourself.
- **Stinker** — Shower, friend. Heard of it? No? We can tell. Be the source of a condition, smell, or substance that affects allies as much as enemies.
- **Pinky Promise** — This will totally backfire on us, right? Make a commitment out loud — to an ally, an enemy, or the camera — and then watch it immediately complicate things.
- **Unkillable** — Conquer the castle, and when it collapses upon you, stand on its ruins. Survive three separate instances that should have killed you, across any number of sessions.
- **Oops** — You didn't need that eye, right? Cause permanent or serious collateral damage to an ally, an innocent, or yourself by accident.
- **Vengeful** — Eye for an eye. Take a significant action specifically to repay harm done to you or someone you care about.
- **Menace** — Don't make eye contact with this guy. Cause an enemy to retreat, surrender, or hesitate purely based on your presence or reputation.
- **Animal Planet** — I love pets! I have a dog, a cat, a lizard, a bird… Establish a non-hostile relationship with a creature that has no reason to tolerate you.
- **Fan Favorite** — Take a bow, little actor! Receive an unsolicited positive crowd reaction three times. They're not rooting for the party. They're rooting for you.
- **Corporate Asset** — Orders are absolute. Complete a Directive without deviation, complaint, or asking what it's for.
- **Tragic** — Suffering brings creativity. Lose something — a person, a part, a capability — and keep going without resolving it.
- **Bolivian Army Ending** — You never stood a chance. Enter a fight dramatically outnumbered or outclassed and make them work for it.
- **Chunky Salsa Rule** — Pop goes the goblin! Kill something in a way that requires cleanup.
- **Coconut Superpowers** — No way you survived that! Take damage or a condition that should have ended you, and walk it off with no explanation.
- **Protagonist** — Spotlight, here we come! Be the one who makes the call that changes the direction of the session. The crowd noticed.
- **Antagonist** — I too, can write myself a story. Deliberately position yourself against the interests of an ally, an NPC, or the Corporation — and frame it well.
- **Anti-Hero** — The right thing for the wrong reasons. Do something genuinely good in the worst way possible, for reasons you won't fully explain.
- **Incorrigible** — STOP FLIRTING WITH THE DRAGON! Attempt something socially inappropriate with a target that has every reason to destroy you.
- **No Cure For Evil** — No rest for the wicked, especially for you. Be the instigating cause of a problem the party then has to solve. Twice.
- **Munchkin** — Bug or feature? Find an interaction between two mechanics, items, or skills that was not clearly intended. Use it.
- **Little Dead Rising Hood** — Tiny little devil, clad in red. Be the smallest or least physically threatening member of the party and deal the most damage in a session.
- **Mascot** — So cute, so memorable. Be referenced, imitated, or protected by an NPC who has no mechanical reason to care about you.
- **Butcher** — Yum, steak! Reduce an enemy to component parts. Deliberately.
- **Survivor** — These tracks are fresh. Be the last one standing in a situation where the rest of the party is down or gone.
- **Spy** — He could be you, he could be me! Operate without anyone — ally or enemy — knowing your real objective for an entire session.
- **Liability** — Work on yourself, will ya? Be directly responsible for a party wipe, near-wipe, or significant loss. Own it.
- **Method Actor** — I did my own stunts. I also wrote the script. I'm also bleeding. Stay in a bit, a character, or a stated role through a Forced Action consequence or Shock tier.
- **Understudy** — I've been watching. I've been waiting. Successfully replicate another character's skill, move, or approach in the moment it was needed.
- **Typecast** — Oh, we know exactly what you're going to do. Use the same tactic to solve three different problems in three different sessions. It keeps working.
- **Prima Donna** — This dungeon is not up to my standards. Complain about conditions, resources, or treatment while doing something genuinely impressive.
- **Scene Stealer** — Sorry, were you in the middle of something? Redirect the crowd's attention from another party member's moment to yours.
- **The Monologue** — You know, I never wanted it to come to this. Deliver a speech — to an enemy, the camera, or nobody — before, during, or after a kill.
- **Fourth Wall** — Hey. You watching? Good. Address the audience directly, in-character, in a moment that lands.
- **Box Office Bomb** — Coming this summer. It did not perform well. Build up to something publicly — announce it, commit to it — and fail in front of everyone.
- **Director's Cut** — Let's try that one again. Redo a failed action in the same scene and succeed. The crowd saw both versions.
- **Certified Fresh** — Critics loved it. The party did not. Do something the rest of the party called stupid. The crowd rewarded it anyway.
- **SAG Dispute** — I'm not doing that. Put it in writing. Refuse a Directive on stated principle, explain why to the camera, and survive the consequences.
- **Direct to DVD** — It went somewhere. Just not the main screen. Be visibly passed over — for a reward, a moment, a spotlight — and have the crowd notice.
- **Callback** — Remember this? The crowd does. Return to a previous failure and succeed at it. The context must still be recognizable.
- **Nepotism Hire** — Somehow still here. Nobody's sure why. Benefit from a reward, opportunity, or survival you clearly didn't earn. Don't acknowledge it.
- **One Star Review** — Needs improvement in several key areas. Receive direct, public criticism from an NPC, ally, or crowd reaction. Keep performing.
- **Student Film** — The ambition is there. The budget is not. Attempt something that visibly exceeds your current capability. The effort is undeniable.
- **Craft Services** — Is there food here? I'm asking for me. Prioritize personal resource management over the objective in a way the crowd finds deeply relatable.
- **Resting Loser Face** — He looks like he already knows how this ends. Have an NPC or crowd react to your neutral expression as if you've already given up. You haven't. Probably.
- **Applause Machine** — They're clapping. You're not sure why. Neither are they. Generate a positive crowd reaction from a passive action — something you did without trying to perform.
- **Unlikely Menace** — That should not have worked. Win a confrontation against something significantly more dangerous than you using only what you had.
- **Adorable Threat** — Aww. Oh no. Deal meaningful damage or cause genuine harm immediately after a moment the crowd found charming.
- **Waddled Into Frame** — Late. Uninvited. Immediately relevant. Arrive after the situation has already developed and become the deciding factor anyway.
- **The Bit** — They have a thing. You know the thing. Do the thing. Perform the same signature move or behavior three times across different sessions. The crowd names it.
- **Bark Bark Bark** — We understood completely. We don't know how. Communicate something critical through non-standard or non-verbal means, successfully.
- **Sea World Reject** — That was precise. That was practiced. What are you? Execute something trained, deliberate, and technically impressive in a way that recontextualizes your nature.
- **Flipper Mode** — No hands. No problem. No further questions. Complete a task that explicitly requires manipulation, grip, or hands — without them.
- **Crowd's Baby** — If they die we're cancelling the show and we mean it. Reach a point where the audience reaction to your danger is loud enough that the Corporation has to acknowledge it.
- **Nine Lives** — One down. Eight to go. Allegedly. Escape a lethal situation through movement, positioning, or luck rather than durability. Do it again.
- **Knock It Off The Table** — Was that important? Asking after. Destroy, displace, or ruin something with no stated intent — and have it matter to the scene.
- **Feral Consultant** — They asked for input. This is the input. Solve a problem in a way that nobody proposed and nobody can fully explain after the fact.
- **Witnessed** — I was there. I watched. I made my choice. Observe a significant event without intervening. The crowd respects this. Or resents it. Either works.
- **Murder Mittens** — Small. Armed. Not in the way you expected. Deal significant damage to a target at least two size or threat categories above you using only your natural capabilities.
- **Dead Drop** — You left something. It came back. Leave an item, a mark, or information somewhere with no explanation. Have it become relevant at least one session later.
- **Vet Visit** — It's been handled. The patient has opinions about this. Be physically managed, restrained, or treated by an ally without your cooperation — and return to function immediately.
- **Territory Marked** — You've been here. Whatever was here before knows it. Return to a location and have it reflect your previous presence — through environment, NPC memory, or enemy behavior.
- **3am Energy** — Why. Why now. Why like this. Initiate something — combat, a social situation, a plan — at the worst possible moment with the least possible justification.
- **Indoor Cat** — In its natural habitat. Everything is fine. Run. Operate in a situation perfectly suited to your capabilities and demonstrate it completely.
- **Birdwatcher** — Patient. Focused. Then not. Track or observe a target across at least two Clocks without acting — then resolve it in a single moment.
- **Main Vocalist** — One of them took the mic. The rest stepped back. Have one dominant personality or mode take over a scene completely — and land it.
- **Visual** — Didn't do much. Looked incredible doing it. Generate a crowd reaction from appearance, positioning, or presence alone, with no mechanical action taken.
- **Maknae** — Youngest energy. Worst timing. Best outcome. Have your most reckless or naive behavior produce the best result of the session.
- **Rap Line** — Informational. Rhythmic. Somehow threatening. Deliver a rapid sequence of tactical or factual information in a way the crowd receives as a performance.
- **Formation** — One, two, three, four — we do this together. Coordinate a simultaneous or sequential action with at least two allies that looks deliberate to the audience.
- **Comeback Stage** — We thought you were done. You were not done. Return to active contribution after being downed, disabled, or written off — and immediately do something significant.
- **Internal Dispute** — They are not in agreement. This is everyone's problem now. Have two competing impulses, objectives, or behaviors visibly conflict mid-action. The crowd picks a side.
- **Solo Debut** — No backup. No committee. Just one. Complete an objective entirely independently, with no ally involvement, in a way that reads as intentional.
- **Parasocial** — They don't know you. They feel like they do. This is becoming a situation. Have an NPC develop an attachment to a specific mode or personality that creates a complication.
- **All-Kill** — Every chart. Every metric. Simultaneously. Briefly. In a single Clock, generate a Viewer spike, complete a Goal, and deal meaningful damage. All three.
- **Disbandment Arc** — Something is fracturing. The audience can see it. Reach a moment where internal conflict visibly undermines function — and have the crowd treat it as a storyline.
- **Fan Service** — This one's for the viewers at home. Do something with no tactical value, purely for audience response. Receive audience response.
- **Blue Screen** — … Fail to act on your declared moment with no external cause. Just stop. Then continue.
- **Legacy Code** — This was the right call, once. Default to a previously successful behavior in a context where it clearly no longer applies.
- **Corrupted File** — It's close. It's recognizable. It's wrong. Attempt a known action and produce a result that is identifiably off in a consistent, specific way.
- **Unpatched** — We know about this one. We haven't fixed it. Have a known behavioral flaw exploited by an enemy or NPC. Be aware of it happening. Be unable to stop it.
- **404** — Request received. No data returned. Be asked for something — information, a skill, a response — and have nothing. No fallback. Just absence.
- **Out of Memory** — We've done this before. Apparently not. Repeat a previous action with full commitment and zero recognition that it already happened.
- **Safe Mode** — Everything extra is off. Only the necessary remains. Operate under extreme pressure with all performance stripped away — and succeed on fundamentals alone.
- **Null Pointer** — It reached for something. It wasn't there. Reference or attempt to access a capability, memory, or personality that does not respond.
- **Overclock** — Past the rated limit. Something was lost. It was worth it. Push past a stated mechanical or narrative limit and succeed — with a visible cost.
- **Peer Review** — The analysis was thorough. The subject did not enjoy it. Have the robot evaluate a party member's performance accurately and publicly. Let it land.
- **Technical Difficulties** — Two different failures. Same moment. Live broadcast. Have two party members fail simultaneously in different ways during the same scene.
- **Off Script** — The improvisation was not in the file. Processing… Have the actor do something unplanned that the robot cannot adapt to — and broadcast both reactions.
- **Crossover Event** — This required both of you specifically. Nobody planned this. Pull off something that only works because of the specific combination of two party members' absurdities.
- **Genre Shift** — The tone of the room just changed. Did you feel that? Take an action that visibly and significantly changes the emotional register of the session.
- **Background Character** — They've been here the whole time. Somehow you forgot. Go an entire session with minimal spotlight — then do something the crowd immediately reacts to.
- **The Recast** — Someone else's role. Your performance now. Step into a function, position, or narrative role that belonged to another party member.
- **Blooper Reel** — Three failures. Four. We've lost count. Fail at least three times in sequence in the same scene. The crowd never changes the channel.
- **Post-Credits Scene** — The encounter ended. You weren't done. Take a significant action after the formal resolution of a combat or scene.


### 18.4 Marks — tags that record a deed

*Marks are new in 1.2. A Mark is a kind of tag, not a second system: everything
in §18 applies to one except where this section says otherwise.*

- A tag records a **performance** — who the Show says you are. A Mark records a
  **deed** — what you actually did. A tag asks *"are you still being that?"* A
  Mark asks *"did you do it?"* That is a fact, not a state.
- **Granted automatically.** Nobody votes on whether you killed a king. The deed
  is the acquisition — there is no table consensus, no proposal, and no declining
  one.
- **Permanent.** A Mark is never Reinforced, never Faded, never Lost. §18's
  lifecycle does not apply to it.
- **No depth.** A second regicide is not more Regicide. It simply is.
- **Marks are physical.** The brand is on your body, and not necessarily somewhere
  you can see it. You may carry one for a long time before anything tells you it
  is there.
- **Who brands you.** The Corporation does, as a matter of course — Marks are how
  the production attributes consequence, and how you find out that something you
  did is the reason a room is behaving the way it is. It is not the only thing
  that can brand you. Sufficiently powerful entities do it too, and whose brand
  you carry matters.

**Present and Active are different things.**

| | Rule |
|---|---|
| **Present** | Always. The Mark is on you from the moment of the deed, and it always counts for gates — a gate that refuses your Mark refuses you whether or not the Mark is doing anything in the scene |
| **Active** | The Mark wakes when a scene makes it relevant — a place, an entity, or a piece of machinery it has something to do with. Dormant otherwise |

**How activation reads at the table.**

| | |
|---|---|
| **Best** | The mood of the scene changes first. The room is wrong before anyone explains why. Then a small note — the brand lights, or light comes from somewhere on the body |
| **Allowed** | The GM says the Mark is active. Legible, and fine when the table needs it |
| **Avoid** | Announcing it before the mood shifts. That spends the effect and leaves nothing to infer |

The light is the tell, not the message. It says *something here concerns you*; it
never says what.

**Marks as gates.** §18.1 pattern 6 lets items, skills, Directives and unlocks
REQUIRE or REFUSE a tag. Because a Mark cannot fade, the two do not behave the
same way, and it is worth knowing which one you are looking at:

- **REFUSES *tag*** — swings. Neglect the tag, let it Fade, and the gate reopens.
- **REFUSES *Mark*** — a one-way door. The deed is done; that item is shut to you
  for good.

Gates are checked **continuously**, not only when you pick something up. An item
you are already carrying when you earn a disqualifying Mark rejects you on the
spot, and §12.1's failure path — a Forced Action, §6 — resolves what that costs
you.

**The named Marks.**

| Mark | Earned by | Active in the presence of |
|---|---|---|
| **Regicide** | Killing a reigning monarch. Whether you knew it or not | Crowns, thrones, and the machinery of rule |
| **Dragon Slayer** | Killing a dragon, or one of its kin | Dragons and their kin — and anything that wants what they are made of |
| **Witness** | Seeing a thing happen and not stopping it | Whoever else was there, and whoever recognises what you saw |

**There is no Mark Compendium, and that is deliberate.** §18.3 publishes every
tag because knowing a tag is how you play it. A Mark works the other way round:
the name is handed to you and the referent is not. Expect Marks this book does
not name, and expect a name to make sense long after you earned it.

---

## 19. Tokens & Economy

### 19.1 The currencies

- **Upgrade Tokens — the money.** Earned from **boss kills** (payout scaled by
  boss rank, table below), bartering, crowd donations, Directives, and rare
  loot boxes. Spent on everything: Med Bay bills (§16), module unlocks and
  levels (§20), extra downtime actions, threshold dice, respec, the store —
  the Lounge is where the Corporation recoups.
- **Patron Tokens** — the skill-cap currency (§17.2).
- **Narrative Tokens** — script interference (§17.7).

**Boss payouts:**

| Boss rank | UT payout |
|---|---|
| Neighbourhood | 5 |
| District | 10 |
| City | 25 |
| Precinct (Super) | 50 |
| Country (Super) | 100 |
| Stage (Super) | 250 |

### 19.2 Token exchange

**25 Upgrade Tokens → 1 Patron Token**, one-way. The audience loop remains
the better Patron-Token income; the exchange is the overflow valve.

### 19.3 Retail

- **The general store ("Sup, nerds!") is a tutorial fixture.** Consumables and
  Crude–Basic gear at friendly prices (consumables 1–2 UT · Crude 1 · Basic 3)
  while you learn the economy. **It closes when the Lounge unlocks** — from then
  on, the Lounge is where contestants get their things.
- **Coupons are tutorial furniture too:** Corporation vouchers that **skip
  payment** on one store purchase. They retire with the store — after the
  tutorial, nothing is free.
- **Bronze box shops — the necessities channel.** Standing Corporation vendors
  (one in the Lounge, occasional stands on floors) sell **Bronze boxes at 5 UT**
 , repeatedly. You don't buy bandages — you buy a *box of necessities*.
  **Pity rule:** every 5th Bronze box from the same shop guarantees a gear
  item. The Corporation understands surprise mechanics.
- **Found boxes — the booster-pack rule.** Higher boxes are **one-time
  purchasable finds, randomly placed in the dungeon**: a sealed Silver, Gold, or
  Legendary box sitting on a shelf with a price tag (Silver 15 · Gold 40 ·
  Legendary 100). Buy it on the spot or leave it — each offer exists once and
  never restocks. **Mythic and Godly are never for sale**, only earned.
- **Boxes still only open at the Lounge** — buy the mystery in the field, carry
  it home sealed, open it in the cage.
- **Selling:** the Goldsmith's barter bench (§20.3) buys your surplus at about
  half value.

---

## 20. The Lounge

The party's corporate-controlled modular base; unlocks after the Tutorial Boss.

> **Design pillar — the Golden Cage.** The Lounge is essential AND a crutch. The
> Corporation builds it so good that contestants delay their own descent —
> every comfort is content, every upgrade is a reason to stay one more cycle,
> and the cameras never stop: Lounge drama is half the show. Let it seduce.
> The trade of comfort-now against progression is a real choice, and the
> Corporation profits either way — you're either content in the dungeon or
> content in the house.

**House rules:** no entry during combat; all Loot Boxes must be opened inside, and
opening opens ALL held boxes simultaneously; a guide is available; overstaying
past all pretense of content → ejection + 24h re-entry lock; fully monitored
24/7 — higher levels mean more surveillance.

### 20.1 Downtime

Between deployments each contestant gets **2 downtime actions**; one action = one
module engagement (a craft, a merge, a surgery, a training session). Sleeping,
eating, and free rest cost nothing. The GM may grant a third action across long
story gaps; an **extra action costs 3 Upgrade Tokens** (once per downtime).

### 20.2 Module levels — the Upgrade-Token sink

Every purchasable module has three levels: **L1** = what the unlock price buys
(unlock prices are in the module table) · **L2 = 5 Upgrade Tokens** · **L3 = 15 Upgrade
Tokens**. The Lounge is where Upgrade Tokens go to die — happily.

### 20.3 The modules

**Living Facilities**

| Module (unlock) | L1 | L2 | L3 |
|---|---|---|---|
| Dormitories (auto) | Free rest: resolvable conditions resolve over downtime; +1 HP per part per downtime | — | — |
| **Med Bay** (auto) | The full medical restore, invoiced: `Floor × 2^claims` UT (§16). Bleed-out stabilization always free | Bulk rate: heal the whole party for the sum minus the cheapest member's bill | Premium plan: first claim each floor at half price; recovery spa doubles the free-rest trickle |
| Kitchen (5 UT) | **1 Meal** per contestant per deployment: eating (1 Moment) removes Exhausted T1 or delays Exhausted one advancement | Personal chef: 2 Meals; pre-deployment boon — the party is immune to Exhausted until the run's first Clock reset | Five-star gastronomy: feast episodes earn hype during downtime; meals also delay Infected; one bespoke dish per contestant per floor grants a chosen first-Clock boon (Exhausted immunity · +1 free-move space · Shock T1 immunity) |
| Farm (10 UT) | Ingredient supply + one party **companion animal** (GM-statted, permanently losable) | **Mounts** (overworld speed + carry) and livestock — bandage/antitoxin crafting stock | The menagerie: a trained **battle-beast**, exotic boss-livestock, and the petting-zoo segment (standing Patron draw) |

**Factory**

| Module (unlock) | L1 | L2 | L3 |
|---|---|---|---|
| Forging Station (5 UT) | Craft/repair **Crude–Basic** weapons and tools | Craft **Quality** | Master forge: **Superior**, plus one **signature weapon** commission per floor — named, hype-tagged, yours |
| Goldsmith (10 UT) | **Trinkets** — ring-class items (the 20 slots) each holding one **Lesser** modifier | **Normal**-modifier trinkets + barter bench (valuables → Upgrade Tokens) | The luxury line: **Higher**-modifier trinkets; wearing the full set is a standing Patron draw — bling attracts donors |
| Melding Station (10 UT) | Merge 2 same-type items → 1: better base + ONE modifier from the sacrifice | Keep two modifiers from the sacrifice | True fusion: once per floor the meld bumps the result one item tier; cross-type chimera merges (GM-adjudicated) |
| **Advanced Fabricator** (10 UT) | **The giant 3D printer — L1 prints ammo only** (magazines, standard rounds; refills free) | Gadget printing: element-tipped special ammo, grapnels, flash/smoke, one-shot drones | **The impossible catalog: futuristic weaponry** — plasma cutters, railguns, energy shields… and yes, **nuclear options** (a micro-nuke is a once-per-campaign purchase the GM prices in tokens AND consequences; the crowd goes insane). Exotic prints consume rare materials + steep UT |
| Enchantment Altar (10 UT) | Extract/apply modifiers; Lesser extraction destroys the modifier on a d6 roll of 1–2 | Destruction only on a 1; **Normal** extraction unlocked | Master ritual: Lesser never destroys; **Higher** extraction unlocked (the weapon still drops a tier — the ladder stands); the modifier vault stores extracted modifiers safely |
| Wizard's Tower (15 UT) | The magic source: reveals magic skills (level 0) to qualifying contestants; craft **Lesser** modifiers | Craft **Normal**; arcane tutoring — one magic skill's training prerequisite per downtime | The sanctum: commission GM-authored **relics**; research unlocks exotic modifier crafting (access rules stand) |

**Modification Center**

| Module (unlock) | L1 | L2 | L3 |
|---|---|---|---|
| Skill Gemstone (5 UT) | Merges/mutations of compatible skills (§4.5 keywords) + **respec**: unlearn a skill, refund its recorded spend minus one point per level, +2 UT fee | Mutation preview: the outcome is revealed before you commit | Master facet: once per campaign a merge spares the consumed skill at level 0; a regretted merge may be undone within the same downtime |
| Tattoo Artist (25 UT) | One tattoo — choose: +1 flat physical resistance (Bleed/Crush/Burn) · +1 space of free movement · +1 Camera Call stack per session | Second tattoo slot; **threshold dice d4→d6 = 5 UT** (§14) | The masterpiece: third slot, free swaps each downtime, **d6→d8 = 40 UT**, and the ink makes you recognizable (standing Patron draw) |
| Surgeon's Table (20 UT) | Reattach severed parts · prosthetic fitting · the canonical **race-change** service | **Animal-part grafts** (GM-statted from the beast you brought back) | Re-genesis: **boss-part grafts** with their quirks; restore one destroyed part permanently per floor |
| Augmentation Hub (20 UT) | Mechanical prosthetics + utility implants (built-in thin tool, storage compartment) | Weaponized prosthetics (count as a Light Small weapon, cannot be disarmed) | The exo-suite: subdermal plating (+1 flat resistance), integrated auto-loader, fabricator dock — refill ammo once per deployment in the field |

**Garage & the door**

| Module (unlock) | L1 | L2 | L3 |
|---|---|---|---|
| Bike Shop (30 UT) | Fast overworld travel, 1–2 riders | Sidecars + saddlebags (carry) | Stunt fleet: televised race segments (hype) + arena-legal entrances |
| Car Shop (30 UT) | Party transport + real carry capacity | Off-road builds | **The tour bus: a mobile mini-Lounge** — once per deployment the party takes ONE downtime action in the field (the crutch on wheels) |
| Armory (75 UT) | One armored vehicle: mobile cover (GM-statted, ~10 HP) | Plating (+HP) and a ram (the vehicle can shove) | The war rig: heavy-ranged weapon mount (counts as steady ground); the crew cabin stabilizes bleed-outs in the field |
| Universal Travel (fixed) | The door of descent. It doesn't level. It knows where you're going. | — | — |

---

## 21. Enemies & Encounter Design (GM chapter)

### 21.1 Categories

- **Mobs** — die in one meaningful blow; never appear alone.
- **Elites** — real statlines; personalities; the fight's texture.
- **Bosses** — Neighbourhood → District → City variants.
- **Super Bosses** — Precinct → Country → Stage (a Stage boss is not expected to
  be beaten).

### 21.2 Construction guidance

- **Asymmetric statting is by design.** Player parts run 2–5 HP; boss parts can
  run 6–50. Enemies don't obey creation budgets — stat the *character*, not the
  process. An old man may sit at 2s; the same man at war may run 10s.
- **Mobs are hordes — nearly always one-shot** by a weapon of the floor's
  material band (mob HP ≈ one on-band hit; ~5 at F1, doubling per floor to
  ~1.3k at F9). A mob that survives a hit does it through a **special effect**
  — a gate, like surface immunity — never a fat HP bar. Mob fights are about
  the crowd: cones, lines, positioning, ammo burn.
- **Elites, Bosses, and Super Bosses are the struggle:** first-pass ratios of
  the floor's mob HP — elite ≈ ×12, boss ≈ ×25, Super ≈ ×60 — each with at
  least one discoverable weak system (§21.3). Tune against: a competent party
  clears a mob room fast and *earns* every elite.
- **Enemies win by creating problems faster than the party can manage** — never by
  out-rolling (there are no rolls to win).

### 21.3 Boss doctrine

- **Most bosses' win condition is reaching the position where a killing hit is
  even possible** — not the hit itself. Raw damage races are anti-design.
- Authored patterns at your disposal: **surface immunity** (damage is cosmetic
  until a breach condition is met — e.g. reach Bleeding T2 on a part, or 7+ damage
  in a **single hit**), **phase machines** (explosion beats, retreats, threshold
  resets), **dodge thresholds** (§14) with Reflexes counter-ladders, **fire that
  heals**, destroyable sub-parts that permanently remove abilities.
- **Bosses are immune to grapple-Suffocation** (§13) and to anything else that
  skips discovery.
- **Reorganization happens only at narrative beats** — Clock reset, leadership
  loss, phase change, condition shift; never mid-action. Bosses answer
  catastrophic player effects with phase changes, acceleration, repositioning,
  sacrifice.

**Super Bosses** are large, **multi-stage, multi-area**
encounters that demand understanding and preparation across multiple ways of
fighting. The shape: a giant flower feeds on five different zones, each zone
powering different abilities and damage types — the party builds immunities and
plans the disabling of each zone, and only then faces the flower itself, which
demands several damage types, complex attacks, and specific conditions to
finish. A Super Boss is a campaign arc in one creature.

### 21.4 Terrain (authoring framework)

Stat any terrain by answering three questions:

1. **Is it hard to walk in — and why?** (movement costs, Slowed, forced paths)
2. **Is it a hazard — and how?** (damage, conditions, timers)
3. **What effects does it have that aren't a direct danger?** (vision, noise,
   cover, flammability, smell)

Known table examples: Sludge, Flammable ground, water, difficult terrain, smoke.

### 21.5 Falling

Falls longer than **3 hexes** deal damage, scaling with height: roughly
**1d4–5d4 across 3–8 m**, **2d6–6d6 across 9–14 m**, continuing the pattern
upward. (A sketch — falling has barely come up in play; tune it when it
matters.)
