# GALACTIC PRIME TIME — System Rulebook

**Version 0.92 — the Reconciled Edition** · 2026-07-23

> **Lights. Camera. Action.**
> You were abducted by an alien conglomerate. The Corporation™ films you running
> its dungeons to prove to its citizens that colonizing Earth is beneficial — nay,
> *necessary*. The audience is real, the danger is real, and the only way out is
> through the ratings. Refusing to join the show? "We can't guarantee what will
> happen to you afterwards."

**About this edition.** v0.92 folds every ruling made since v0.91 back into one
book: the defect catalog from the full rules review, the rulings recorded in the
digital addendum where they apply to the table, and the owner decisions of
2026-07-14 → 2026-07-23. The setting is unchanged — this is the original reality-TV
show. Nothing from the video game's separate setting layer appears in this book.

**Markers used throughout:**
- ⚖️ **PROVISIONAL** — ruled and playable as written, but the numbers or the call
  await playtest tuning or a final owner nod.
- 🎙️ **GM CALL** — the rules deliberately hand this to the GM; the box says what's
  known and what the GM decides.

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
  - **Charm** — **presentability**: how objectively camera-ready you are —
    photogenics, striking looks, visual impressiveness. Charm 5 = "cinematic
    gravity, the scene favors you." *(Clarified in v0.92: Charm is not warmth or
    likability — those live in the audience's reaction to you, i.e. Tags and crowd
    response, never in the number.)*

### 2.2 Creation

- At creation, allocate **7 points across the Body traits** and **7 points across
  the Core traits**. No trait may exceed **5 at creation**.
- **The 1–5 scale is a creation-time scale only** *(new in v0.92 — this was
  implicit)*: 1 = functionally impaired · 2 = below average · 3 = baseline adult
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

> **Sidebar — machines & conditions** ⚖️
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

## 3. Advancement *(new chapter — the biggest hole in v0.91)*

### 3.1 Levels and level points

- **Levels are awarded by the GM at milestones** — bosses, floors, major
  achievements. There is no XP curve. *(An XP-based award scheme is approved in
  principle as a future option; amounts would be a tuning pass.)*
- Each level grants **1 level point** into a shared pool. A level point buys
  **+1 to any one trait** — any trait, either pillar.
- Levels grant nothing else by default (no automatic HP). More HP comes from
  Physique (§3.2) or explicit rewards.

### 3.2 Trait growth past 10 — stat caps

Traits keep rising in play. From **10 upward**, every trait pays out automatically:

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
  point in any trait earns nothing. *(Changed from v0.91's "equal to its level" —
  this adopts the live table's app-tested rule.)*
- **Multi-stat skills cost 1 point from EACH listed stat** to level.
- Spends are tracked per skill; leveling a skill down refunds exactly what its
  spend history recorded.

### 3.4 Respec

**There is no free respec or refund, ever.** Unlearning and rebuilding is possible
only through specific items or Lounge upgrades, and always at a cost.

🎙️ **GM CALL:** achievement rewards that grant "+1 to a stat" — decide per award
whether it is a trait point (permanent, counts toward caps) or temporary. The
book's default: permanent, identical to a level-point spend.

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

- Every skill starts **capped at 5**. **Patron Tokens** raise the cap (+1 max
  level per token) to a ceiling of **10**. Cap 5 = useful; cap 6 = build-defining;
  level 10 = game changer.
- **Thresholds:** every level from 5 up is a threshold. Reaching one **Upgrades**
  (adds effects) or **Mutates** (changes purpose completely) the skill.
  🎙️ **GM CALL:** whether the player chooses upgrade-vs-mutate or picks from
  GM-authored options is per-skill; the owner's skill passover will settle the
  default.

### 4.3 Multi-stat skills

- A skill attributed to more than one stat levels only with points from **every**
  listed stat (§3.3).
- Three-stat skills exist (e.g. Camouflage). They are legal, just expensive.

### 4.4 Acquisition

- Most skills **unlock by doing**: fulfill the obtaining requirement and the skill
  is revealed at level 0.
- Magic and similar require an **external source**: appropriate-tier Loot Boxes,
  Achievements, or Lounge modules (e.g. the Wizard's Tower).
- Some skills are **character-exclusive** — tied to one contestant's nature and
  not obtainable by others.

### 4.5 Consuming skills

Skills can combine/consume other skills to upgrade or mutate (the Skill Gemstone,
§20). Consumed skills permanently alter the result and are unrecoverable unless
stated. Never automatic — requires conditions AND player consent.

### 4.6 Priming — there are no cooldowns *(v0.92: cooldowns are removed from the system entirely)*

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
- **Transitional rule** ⚖️: skills whose printed text still says "cooldown"
  (Tactical Roll, Acrobatic Save, "-4 Moment cooldown" thresholds) are read as
  **STANCE-gated** (the two defensive reactions) or as a **CHAIN discount** (the
  threshold) until the owner's skill passover re-expresses each one as a prime.

### 4.7 Passive and reactive skills

- **Passive skills** are always on unless their text says otherwise.
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
- **Crossing the Clock boundary** *(v0.92 — this was undefined)*: scheduling
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

### 5.4 Simultaneity *(v0.92 — this was undefined)*

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

### 5.5 What one Moment allows *(v0.92 — caps; this closes infinite free actions)* ⚖️

Per Moment, a combatant gets at most:

1. **One scheduled action** (the one due this Moment),
2. **One free (0-Moment) action** — 0-cost skills are legal and consume this slot,
3. **One reaction** (§5.6). A 0-cost reaction consumes the free-action slot too.

**Movement:**
- A move of **1–3 spaces is free** but consumes the free-action slot — **once per
  Moment**.
- Longer moves cost `ceil((spaces − 3) / 4)` Moments as a scheduled action.
- You cannot move twice in one Moment.

**Inventory** *(v0.92 — the old "resets after a different action" clause is
deleted; it was an infinite-free-items loop)*:
- The **first** inventory interaction of a combat is free (consumes the free
  slot); **every later one costs 1 Moment**.
- An item's own listed Moment cost **replaces** the interaction cost when higher —
  one cost, never two.

**Units:** 1 space = 1 hex on the map. Older item text saying "tile" means space.

### 5.6 Reactions *(v0.92 — new; reactive skills existed with no economy)*

- A reactive skill declares its **trigger** when readied. When the trigger fires,
  the reaction **resolves immediately**, out of schedule.
- **You pay by acting later:** the reaction's Moment cost is added to your next
  scheduled action's Moment.
- **Max one reaction per combatant per Moment.**

### 5.7 Combined actions *(v0.92 — new)*

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

**Which table** *(v0.92 — was unstated)*: weapon/tool/stat-requirement shortfalls
roll **Tool**; condition-driven strain and physical overreach roll **Body**.

### 6.2 Unmet requirements are a real gate *(v0.92)* ⚖️

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

### 7.2 Targeting

- **Head untargetable by default** — only when the target is **Exposed,
  Helpless, or Overwhelmed** (ambush, execution, extreme speed disparity).
- Torso, arms, legs: always targetable unless the fiction prevents it.

### 7.3 Damage resolution *(v0.92 — "usually 1" is deleted; it contradicted every weapon in the game)*

1. Choose a valid body part.
2. Deal the attack's **listed damage** to that part, minus flat resistance
   (floor 0).
3. Apply the damage type's condition (§8.1).

Small HP pools are the design: parts fail fast; the real fight is about *which*
parts and *which* conditions.

### 7.4 Disabled parts (non-lethal at 0 HP)

- **Arm:** drops held items; no two-handed actions; using it = Forced Action with
  severe consequences.
- **Leg:** movement = Forced Action; the target becomes Exposed; sprinting/evasion
  is extremely dangerous.
- Further damage to a disabled part doesn't reduce HP — it escalates conditions or
  causes permanent loss/detachment (detachment applies Bleeding).

### 7.5 Death and bleed-out *(v0.92 — rewritten; the old list contradicted its own conditions)*

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

### 8.1 The universal condition engine *(v0.92 — this generalizes rules that were scattered or missing)*

- **Application:** a damage type applies its condition at **Tier 1** on first
  application to a part. While active, a new application of the same type to that
  part **advances it one tier** — at most one attack-driven advance per part per
  Moment.
- **Advancement:** at **every Clock reset, every active, non-delayed condition
  advances one tier.** (v0.91 stated this only for Bleeding.)
- **Delayed:** a Delayed condition **skips exactly one advancement** and loses its
  delay.
- **States:** Active / Delayed / Resolved. In-combat treatment usually **delays**
  (bandage → Bleeding, antitoxin → Poison, clean air → Suffocation). Full
  resolution needs downtime, advanced tools, or explicit abilities.
- Conditions stack freely across types; multiple lethal timers can run at once.

### 8.2 Condition tiers (complete tables — v0.92 fills every gap)

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
| T1 | Cauterizes: stops Bleeding, removes Chill — **and applies Shock T1** ⚖️ (the price of the field-cautery trade) |
| T2 | Stops poison, clears infection; Forced Action–Body |
| T3 | Part disabled/partial loss; on torso/head starts a **1-Clock death timer** |
| T4 | **Death** |

**Chilled** — specific part, no HP damage.
| Tier | Effect |
|---|---|
| T1 | Resolves at the next Clock reset **unless re-applied during the Clock** *(replaces the old "8 Moments" oddity)* |
| T2 | Forced Action–Body |
| T3 | Part disabled (head: usually fatal/incapacitating) |

**Exhausted** — whole body. ⚖️
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

**Poison** — no immediate HP damage. Entry conditions: open wound, orifice,
injection/bite, or a helpless target. Activation delay usually 2 Clocks. Always
targets specific parts.
| Tier | Effect |
|---|---|
| T1 | Disruptive (no lethal clock) |
| T2 | Crippling (disables, introduces clocks) |
| T3 | Catastrophic (lethal clock — must be delayed or cured) |

- **Types are compatibility classes** *(v0.92 — "incompatible" finally defined)*:
  Neurotoxin, Hemotoxin, Myotoxin, Pneumotoxin, Cytotoxin. **Same type stacks
  tiers; different types are incompatible → Poison Soup.**
- **Poison Soup:** all poison effects on the part end; direct HP damage equal to
  the combined tiers — **capped at the part's max HP − 1 on head/torso** ⚖️
  (brutal, never a guaranteed instant kill — in either direction).
- **Spread:** on advancement, spreads to an adjacent part at reduced intensity,
  sharing the advancement clock (Arm/Leg → Torso; Torso → Head or Limbs).

**Suffocation** — torso only, ignores limb HP: a **tierless 2-Clock death
timer**. Item text saying "Suffocation Tier 1" means **"delay Suffocation by one
Clock."**

**Dissolution** — the Mind's Suffocation: a **tierless 2-Clock death timer on the
Mind**. Cannot be applied by standard attacks — requires an explicit source.
Removing the cause **pauses** the timer (never resets it). **Completion = the mind
collapses: the contestant is permanently removed from play.** No revival. Whether
what remains is a husk, a puppet, or something worse is the story's to tell — but
the person is gone, and it is worse than death.

### 8.3 Timers and partial Clocks

A timer created mid-Clock counts the partial Clock at the first reset (harsh).
Bleed-out always gets one full Clock of grace. A timer created during a reset
starts at the next reset.

---

## 9. Shock *(v0.92 — rebuilt as momentary events, per the 2026-07-20 ruling)*

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
- **Psychic resistance vs Dissolution** *(v0.92 — the timer has no tiers, so)*:
  each psychic tier **slows the Dissolution timer by +1 Clock** instead.
- **Enemy mental resistance is FLAT**, and exceeding it by a significant margin
  grants the attacker a bonus (viewer spike / secondary effect).
- Affliction resistance sourcing for players is deliberately parked 🎙️ (nothing
  in the game currently grants it; the GM may award it explicitly).

---

## 11. States Glossary *(v0.92 — all of these were referenced but undefined)*

| State | Rules |
|---|---|
| **Exposed** | Lethal targeting allowed against you (head, executions). Caused by: Stumble, Prone, Helpless, Channeling, windups, exposing abilities. |
| **Helpless** | Cannot act or react; you are Exposed; attackers may target **any** part including the head. |
| **Prone** ⚖️ | You are Exposed; may only crawl 1 space per Moment; standing costs 1 Moment (scheduled). You cannot dodge (§14). |
| **Slowed** ⚖️ | Free-move allowance drops 3 → 1 space; movement Moment costs double. |
| **Channeling** | = performing a multi-Moment action. Already Exposed (§5.3); the word adds no new state. |
| **Overwhelmed** | 🎙️ GM CALL — ambush, execution positioning, extreme speed disparity. Opens head targeting (§7.2). |
| **Alerted** | Knows *something* is there, not where (§15). |

---

## 12. Weapons & Equipment

### 12.1 Weapon classes

Requirements must be met or the Forced Action applies (§6). Base classes
(unchanged from v0.91):

| Class | Req | Hands | Range | Cost | Damage |
|---|---|---|---|---|---|
| Light Small (daggers, knives, tools) | 1 Physique | 1 | 1 | 1 | 2 Bleed |
| Light Large (rapiers, whips, spears) | 3 Physique | 2 + adjacent empty radius | 2 line | 1 | 2 Bleed |
| Heavy Small (maces, hammers, axes) | 2 Physique | 1 | 1 | 1 | 2 Bleed/Crush |
| Heavy Large (greatswords, mauls, halberds) | 5 Physique | 2 + adjacent empty radius | 2 line/arc | 1–2 | 3 Bleed/Crush |
| Light Ranged (pistols, bows, slings) | 2 Reflexes | 1–2, steady ground, ammo | 5+ | 1 | 1 Bleed **per round** |
| Heavy Ranged (rifles, shotguns, cannons) | 4 Reflexes | 2, steady ground, ammo | 5+ line/cone/area | varies | 4 Bleed/Crush **per round** |

- Items may deviate from their class baselines — a store spear can be worse than
  the class line; unique items can be better. *(v0.92: this variance is now a
  stated rule, not an inconsistency.)*
- **Stat-valued ranges** ("Range: Reflexes") mean the range equals your current
  stat total. *(v0.92: declared convention.)*

### 12.2 Ranged fire: RPM, magazines, reload *(v0.92 — RPM was uncostable as written)* ⚖️

- Firing is a **1-Moment action that delivers up to RPM rounds** — same target, or
  split across targets in your firing arc. Listed damage is **per round**.
- Weapons carry a **magazine** (rounds before reload). Defaults: light ranged
  **6**, heavy ranged **2**.
- **Reload: 2 Moments, both hands** (auto-reload weapons excepted).
- Multi-RPM authored items (e.g. the Spark-volver, RPM 3) are flagged for a
  per-round damage rebalance — at 3 rounds × (2 Burn + 1 Crush) per Moment the old
  values out-damage a greatsword. 🎙️ Until rebalanced, the GM adjudicates.

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
Legendary, Mythic, Godly (only Lesser is designed so far).

**Lesser modifiers (working list):** Poisoned (T1 Poison on hit), Serrated
(+1 Bleed), Weighted (+1 Crush), Spiked (secondary 1 Bleed on Crush hits), Hollow
Point (ignores 1 armor), Chilling (Chilled T1 on hit), Explosive Tip (crit →
1-space blast), Barbed (removal deals +1 Bleed). **Draining is capped once per
Clock per target.** Padded and Reinforced are flagged out (candidates: Wrapped,
Balanced, Sure-grip). ⚖️

**Extraction (Enchantment Altar):** Lesser/Normal — extractable with a chance to
destroy the modifier (odds improved by Lounge upgrades/skills). Higher+ —
extraction drops the weapon one tier. Legendary+ — extraction destroys the weapon.

### 12.4 Hands and slots

🎙️ **GM CALL** (pending a proper slot list): worn equipment uses the slots seen in
play — Hands, Legs, Face, Torso, Mouth, Utility; the GM rules stacking and
two-weapon questions until the equipment pass.

---

## 13. Grappling *(v0.92 — new; grapples previously had no rules and deleted bosses)* ⚖️

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

## 14. Dodge Thresholds *(v0.92 — the table's homebrew, now written down)*

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
- **Threshold dice are upgradeable, per stat** (d4 → d6 → d8) via a **Lounge
  upgrade** ⚖️ (module and pricing arrive with the Lounge pass). The die is
  per-stat so future checks (Mind vs fear, Physique vs forced movement) inherit
  the mechanism.
- **Authored counter-ladders** stay a design pattern: e.g. a boss charge with
  threshold 7 might grant Reflexes 7 = auto-dodge + 1-space sidestep, Reflexes 9 =
  auto-dodge + free counterattack, below 7 = the 1d4 fallback.

---

## 15. Stealth, Detection & Cover *(v0.92 — new; stealth was referenced with no rules)*

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

## 16. Healing & Downtime *(v0.92 — new; nothing in v0.91 ever restored HP)*

- **In the field:** conditions can only be **Delayed or Resolved** per their
  treatments. **HP does not regenerate**, and **no item restores HP** — items
  treat and delay conditions only. Applying a treatment to yourself or an ally
  costs **1 Moment** (§5.5's interaction economy applies).
- Field HP recovery exists **only** via explicit, rare, stated abilities.
- **At the Lounge:** HP restores fully; resolvable conditions resolve.
- Deliberately harsh: wounds are content, and the audience loves a limp.

---

## 17. The Audience

### 17.1 Exposure

- **Viewers** — active watchers. Correlate with reward potential and session
  chaos; the conversion pool for Followers.
- **Followers** — clicked "Follow." Notified when you're active; affect TV rating
  and Directive volume; potential allies and enemies.
- **Patrons** — **paying audience members**. Can set paid Goals (direct story
  intervention + rewards).

🎙️ **GM CALL:** concrete Viewer/Follower/Patron numbers, decay, and conversion
rates remain GM-driven (Appendix B). The structure above is the contract.

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
- ⚖️ **PROVISIONAL (owner ruling pending — D-3):** calling the camera **on
  yourself is legal** (that's the Charm build's play); **one spotlight at a
  time**; the doubling covers audience gains and losses attributed to the spotlit
  contestant, and ends with their current-or-next action. Losses double too — the
  camera is a gamble, not a buff.

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
- **Rewards: tiered loot via the Achievement system.** *(v0.92 — one reward
  contract per system: the corporation pays in stuff; the audience pays in
  belief. The old "completing a Directive awards a Patron Token" line is
  replaced.)* ⚖️
- Refusing a Directive is playable (see the SAG Dispute tag). Consequences are
  the Corporation's to write.

### 17.6 Achievements & loot boxes

- The GM's recognition system: Scenario/Quest completion, class/race usage,
  Directives, Goals.
- Loot box tiers: **Bronze** (bulk utility) · **Silver** (tools, armor, limited
  magic) · **Gold** (game-changers) · **Legendary** (campaign-carrying) ·
  **Mythic** (meta-breaking) · **Godly** (defying fate, almost never given).
- Rewards: Buffs, Unlocks, Items, Abilities. Tiers can very rarely be upgraded.

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
- **Lifecycle:** acquired → **Reinforced** (play into it; stack gear/skills;
  potentially permanent) → **Faded** (neglected) → **Lost** → reacquirable.
- 🎙️ **GM CALL:** most tags' mechanical weight is GM-played (loot bias, crowd
  reads). Explicit per-tag effects are an open design pass.
- **The full tag list with earn-conditions is Appendix C** — reading it is
  allowed; that's what it's for. The descriptions are the acquisition guide.

---

## 19. Tokens & Economy

### 19.1 The currencies

- **Upgrade Tokens** — from bosses, bartering, crowd donations, Directives, rare
  loot boxes. 🎙️ Named sinks are still an open design item (every listed Lounge
  cost is Boss Tokens); the GM prices ad-hoc purchases until the economy pass.
- **Boss Tokens** — tiered: Bronze / Silver / Gold / Legendary / Mythic / Godly.
  Unlock Lounge modules.
- **Patron Tokens** — the skill-cap currency (§17.2).

### 19.2 Boss-Token → Patron-Token exchange *(v0.92 — now tier-aware; the flat 3:1 ignored tiers entirely)* ⚖️

One-way, same-tier tokens only:

| Boss-Token tier | Rate |
|---|---|
| Bronze | 5 → 1 Patron Token |
| Silver | 4 → 1 |
| Gold | 3 → 1 |
| Legendary | 2 → 1 |
| Mythic | 1 → 1 |
| Godly | 1 → **2** |

*(Proposed rates — PROVISIONAL until the owner tunes them. The audience loop
should stay the better Patron-Token income; the exchange is the overflow valve.)*

---

## 20. The Lounge

The party's corporate-controlled modular base; unlocks after the Tutorial Boss.

**House rules:** no entry during combat; all Loot Boxes must be opened inside, and
opening opens ALL held boxes simultaneously; a guide is available; overstaying →
ejection + 24h re-entry lock; fully monitored 24/7 — higher levels mean more
surveillance.

**Sections & modules** (unlock costs in Boss Tokens):

1. **Living Facilities** — Dormitories (auto), Restrooms (auto), Kitchen
   (1 Bronze), Farm (1 Silver — animals, food, mounts).
2. **Factory** — Forging Station (1 Bronze), Goldsmith (2 Bronze), Melding
   Station (1 Silver — merge 2 same-type equipment into 1), Advanced Fabricator
   (1 Silver — gunpowder/electricity tech), Enchantment Altar (2 Bronze —
   extract/apply modifiers), Wizard's Tower (3 Bronze — modifiers & magical
   relics).
3. **Modification Center** — Skill Gemstone (1 Bronze — disassemble/consume/merge
   skills), Tattoo Artist (1 Gold — permanent buff tattoos), Surgeon's Table
   (2 Silver — biological body modification, **including race changes**),
   Augmentation Hub (2 Silver — mechanical body modification). *(v0.92 erratum:
   the old "+ race change" unlock precondition was circular — the module that does
   race changes can't require one — and is deleted.)*
4. **Garage** — Bike Shop (3 Silver), Car Shop (3 Silver), Armory (3 Gold —
   armored vehicles).
5. **Universal Travel** — the door of descent; fixed, no submodules.

⚖️ A future module raises **threshold dice** (§14) — details arrive with the
Lounge design pass.

---

## 21. Enemies & Encounter Design (GM chapter) *(v0.92 — new; a cold GM previously could not stat a goblin)*

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
- 🎙️ **GM CALL (heuristic until the numbers pass):** mob damage 1–2; elite parts
  ~5–15 HP dealing ~2; boss parts 7–50 HP dealing 2–3, with one discoverable
  weak system. Tune against: a competent party of 5 comfortably handles ~12
  mobs/room.
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

---

## Appendix A — Changelog v0.91 → v0.92

Every change, mapped to the defect it closes (review-1 catalog ids) and its
ruling source (digital addendum R-ids / owner decisions D-ids):

| Change | Closes | Source |
|---|---|---|
| Clock-boundary scheduling; order of operations at reset | C1 | R0/R1 |
| Declare/resolve timing; snapshot simultaneity; windup dodging; no universal miss | C2, A5 | R2 |
| Reaction economy | A5 | R2/R3 |
| Action caps; movement pricing; inventory reset-loop deletion; 0-cost skills legal | D1, D2, C6, F10 | R3 |
| Cooldowns removed → priming (5 prime types) | F5, NQ1 | R3, #20 |
| Listed damage ("usually 1" deleted) | A4 | R4 |
| Universal condition advancement; Delayed semantics; application/advance rules | E1, C8 | R4 |
| Missing tiers filled (Crushed T3/T4, Burn T1 Shock + T4, Exhausted, Infected); Chilled respecified; Suffocation-tier items re-read | E2, E3, E4, D3 | R4 |
| Death/bleed-out rewritten; Exhausted off the death list; Bleeding T4 any-part | A1, A2 | R5, R11#12 |
| Dissolution completion = permanent removal | A2 | R5 (amended) |
| Advancement chapter (levels, level points, over-10 caps, creation-only 1–5 scale) | B1, C3 | R6 |
| Skill points = traitTotal − 1; multi-stat costs each stat | C4 | R6 |
| No-respec rule | — | Q6 ruling |
| Psychic tiers slow Dissolution | A3 | R6 |
| States glossary (Helpless, Prone, Slowed, Channeling, Sizes) | B2–B4, B6, B7 | R7 |
| Shock as momentary events; high-water mark; combat-end reset | E5, Q21 | R13, #21 |
| RPM/magazine/reload economy | C5 | R8 |
| Grapple rules; boss grapple-Suffocation immunity | B5, D4 | R9 |
| Poison types = compatibility classes; Soup cap | B12, D5 | R10 |
| Requirements halving | D6 | R10 |
| Spaces = hex; session = deployment | B8, B9 | R10 |
| Healing/downtime chapter; treatments cost a Moment; no HP items | B11 | R10, Q29 |
| Directive rewards = loot; Goals pay Patron Tokens | A6 | R10 |
| Dodge thresholds (Reflexes + 1d4; upgradeable dice) | — | R22 |
| Weapon tiers/modifiers/extraction promoted to core | — | R12 |
| Skill 0–10 architecture | — | R19 |
| Combined actions | — | R15 |
| Charm = presentability | — | R18 |
| Stealth/detection/cover chapter (no setting-specific levers) | B10 | R20 |
| Enemy construction chapter | B15, F9 | compendium + live play |
| Book keeps the listed-damage model (force-vs-robustness stays digital) | — | **D-1** |
| Tier-aware Boss→Patron exchange | D7, D8-adjacent | **D-2** |
| Machines & conditions sidebar; Robot/AI race kept | Q62 (table) | **D-4** |
| Threshold-die upgrades = Lounge module | — | **D-5** |
| Full original tag list retained (Appendix C) | — | **D-6** |
| Stat-valued ranges convention; item variance rule; Surgeon's Table circular unlock fixed; Moments/Clocks vocabulary purge | F2, F4, B14, F9 | errata |

**Deliberately NOT in this book** (video-game-only): force-vs-robustness damage,
run types/respawn, Earth-life-only races, the pruned tag list, noise/absorption
pacing, AI targeting engines, and everything from the game's separate setting
layer.

## Appendix B — Open rules questions (the honest list)

The GM adjudicates these today; each has a questionnaire line waiting on an owner
ruling:

1. Achievement "+1 stat" — permanent trait point or temporary? (default: permanent)
2. Intended endgame trait totals (are 15/20 caps aspirational?)
3. Upgrade-vs-Mutate at thresholds — who chooses, from what options?
4. Skill Gemstone consuming — worked examples.
5. Passive-skill upkeep exceptions.
6. Multi-stat skills: does the lowest contributing trait bind the max level?
7. What mechanically distinguishes the five poison types beyond compatibility.
8. Infected cures besides Burn T2.
9. Audience economy numbers (Viewer/Follower/Patron movement, decay, conversion).
10. Tag mechanical effects (per-tag design pass).
11. Super Boss mechanical identity beyond bigger numbers.
12. Currency & store pricing; loot-box generation tables per tier.
13. Equipment slot list; same-slot stacking; hands accounting edge cases.
14. Terrain effects list (Sludge, Flammable, water, difficult, smoke were used in
    play — F1). Until ruled: GM adjudicates by fiction.
15. Fall/environmental damage numbers.
16. Severed-part recovery paths (Surgeon's Table, prosthetics, permanence).
17. What raises a part's max HP besides Physique (armor? race? achievements?).
18. Lounge module mechanical effects (Kitchen/Farm/Forge specifics); Upgrade-Token
    sinks; downtime structure.
19. Camera Call D-3 confirmation (self-call + doubling scope — drafted in §17.3).

## Appendix C — Tag Compendium

*The complete list. Each description is the acquisition guide — knowing it is
playing it.*

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
