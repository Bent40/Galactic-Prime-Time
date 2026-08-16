# 17. The Audience — v2 (mythology edition)

**Status:** DRAFT RULES · 2026-08-11 · the first authored chapter of the v2 book.
Replaces v1 §17 wholesale. Everything else in v1 §17 that is not restated here is
unchanged. Governed by [`../design/divinity-accounting.md`](../design/divinity-accounting.md).

> **The two planes.** Everything in this chapter happens twice. On the **broadcast plane**
> the production says *viewers, followers, camera call, directives* — that is what a
> civilian contestant perceives, and what the announcer says out loud. On the **wager
> plane** the same events are *the gallery, a congregation, the odds board, terms* — that
> is what a champion already knows and what the GM tracks. Both vocabularies are correct.
> A civilian who survives long enough learns the second one.

---

## 17.1 Exposure

Three tiers. They are **different kinds of thing**, not three sizes of the same thing.

### Viewers — attention

Mass, anonymous, uncountable. Entire galleries of gods and the mortal crowds beneath them.
**Viewers are not power.** They are how loudly what you did travels.

Track Viewers as a **tier, not a number.** The GM says it out loud:

| Tier | Name | Reads as |
|---|---|---|
| 0 | **Ignored** | The cameras are elsewhere |
| 1 | **Noticed** | Someone is watching |
| 2 | **Trending** | You are one of the stories today |
| 3 | **Featured** | The table is watching you specifically |
| 4 | **Headlining** | Other contestants' scenes are being cut for yours |
| 5 | **The only thing on** | Nothing else is being broadcast anywhere |

- **Rising:** spectacle, risk taken visibly, novelty, a Goal completed, a Camera Call, a
  first (first kill of a floor, first to a boss, first to try something absurd).
- **Falling:** one tier per Clock of safe, repetitive or hidden play. Stealth suppresses it
  deliberately — being unwatched is a legitimate tactic with a real cost.
- **Cap:** a contestant cannot hold tier 4+ for more than one Clock without a new escalation.
  The show is bored of you the moment you stop escalating.

### Followers — reverence

**Named, living beings who revere you.** A person. A village. A garrison. A minor god. A
spared enemy. **Never a number of anonymous people** — if you cannot say its name, it is not
a Follower.

Your Followers, taken together, are your **standing**. Each pays you **1 divinity per
prayer-cycle**, multiplied by its **weight**:

| Weight | Kind | Pays |
|---|---:|---|
| **1** | One person | 1 / cycle |
| **3** | A household, a crew, a warband | 3 / cycle |
| **10** | A village, a garrison, a guild | 10 / cycle |
| **30** | A town, an order, a small cult | 30 / cycle |
| **100** | A city | 100 / cycle |
| **×** | A god who has bound themselves beneath you | **their entire standing** |

A prayer-cycle is **one session**. Prayer requires no ritual — a Follower who thinks of you
warmly has paid. **Gaining a Follower counts as one prayer immediately.**

**Followers decay.** A Follower unvisited, unanswered and unhelped for **three cycles**
drops one weight step; at weight 1 it is lost. Standing is a garden, not a trophy shelf.

### Patrons — gods with money on you

A **finite** roster. Not donors; **wagerers**. A Patron holds a contract with you: a
negotiated **cut** of your income (§17.5), a stream of buffs, gifts with terms, and an
interest in your survival that is entirely financial.

**You may hold one Patron.** You may hold none. You may, separately, hold any number of
**markers** — short, scoped deals that are not patronage. See §17.5.

---

## 17.2 How attention becomes reverence

**This is the chapter's central procedure, and it is deliberately not symmetrical.**

> **Viewers do not convert into Followers. Acts do.**
>
> You gain a Follower when you do something *for a named being* — save them, spare them,
> heal them, avenge them, keep a promise to them, or complete a Goal that names them.
> **Viewers decide how far the news of it travels.**

**The procedure:**

1. **An act occurs** that gives a named being reason to revere you.
2. **The GM names the Follower** and assigns a weight from the table above.
3. **Apply the viewer multiplier** — the news reaches further when more of the table is
   watching:

| Viewer tier at the moment of the act | Weight multiplier |
|---|---|
| 0 — Ignored | ×1 — they know. Nobody else does |
| 1–2 | ×1 |
| 3 — Featured | ×2 |
| 4 — Headlining | ×3 |
| 5 — The only thing on | ×5 |

4. **Gaining it pays one prayer immediately.**

**Two consequences worth stating plainly.**

- **A good act performed unwatched still earns its Follower.** Nobody in this system is
  required to perform virtue for a camera. Attention makes it *worth more*; it never makes
  it *count*.
- **Spectacle without an act earns nothing.** Viewers at tier 5 with no named beneficiary
  produce no standing whatsoever. **You cannot showboat your way to divinity.** You can only
  showboat your way to a bigger audience for the next thing you actually do.

### The Patron threshold

Gods notice standing, not spectacle. When your standing crosses a threshold, a god takes an
interest and may open a bid (§17.5):

| Standing | Who notices |
|---:|---|
| **10** | A bankrupt god, a lesser spirit, something with a debt |
| **50** | An established minor god with a real cult |
| **200** | A major god of a living tradition |
| **1,000** | A roster power — the ones with a seat at the table |

A god who notices you does **not** automatically bid. They watch first.

---

## 17.3 Camera Call — double or nothing

Charm past 10 earns **Camera Call stacks** (§3.2). Each stack is one use per deployment.

> **A Camera Call is a declared bet on a specific action.** You name what you are about to
> do and what it will achieve. The table takes odds. **One spotlight at a time. Self-calls
> are legal** — spotlighting yourself is the Charm build's play.

### What you may call on

**You may only call the camera on an outcome that is genuinely uncertain.** In a system
without to-hit rolls, that means one of:

| You may call on | Because |
|---|---|
| An action whose **requirement you do not meet** (a Forced Action) | The d6 decides |
| A **contested** action — opposed, raced, or against an active reaction | The other side may beat you |
| A **declared effect beyond the action's guaranteed floor** — *"this kills it this Moment"*, *"I reach her before it does"*, *"it never touches him"* | You have promised more than the rules owe you |

**You may not call on an action that simply auto-succeeds.** The camera does not pay for
certainties, and a table that lets it will find the mechanic solved within a session.

### Resolution

- **Success — you did what you declared:** all Follower and Viewer gains from that action
  are **doubled**, and the Viewer tier rises one step.
- **Failure:** **you burn reverence.** Named Followers walk away — lose weight equal to the
  weight you would have gained. **The GM chooses which Followers leave**, and should pick the
  ones whose regard the failure most embarrasses. Losing the *right* one is the sting; a
  player choosing their own losses would simply shed their cheapest. The Viewer tier still
  rises one step. *Everyone saw.*

Losing standing costs you the annuity as well as the balance. **A failed call is the most
expensive thing a contestant can do to themselves**, and it is entirely voluntary.

---

## 17.4 Goals — the crowd's challenges

Issued by the gallery. Optional, and the crowd does not care whether you survive them.

Categories are unchanged from v1: **Spectacle** (Finish Fast, Overkill, Environmental Kill) ·
**Performance** (Play into a Tag, Say the Line) · **Risk** (While Exposed, Without Healing,
Solo) · **Subversion** (Spare the Enemy, Betray Expectations).

**What changed:** a completed Goal no longer converts a Patron. **A Goal that involves a
named being converts that being into a Follower**, at its weight, with the viewer multiplier
applied (§17.2). Goals that involve nobody pay in Viewers and Achievement rewards only.

> **Subversion Goals are now the most valuable category in the game.** *Spare the Enemy*
> names a being and gives them a reason to revere you. The crowd asks for it because it is
> good television; the economy pays for it because it is a Follower. **The one category that
> looks like a joke is the one that compounds.**

---

## 17.5 Patrons, terms and Directives

**v1 had one issuer. v2 has a market.** Every god who has noticed you may bid, and their
demands routinely contradict each other.

### The bid

A god opens with a **deal sheet**:

| Term | What it means |
|---|---|
| **The cut** | The share of your prayer income that flows to them. **Negotiated.** A cheap god who takes 40% may be a far worse deal than an expensive one taking 10% |
| **Boons** | Their domains get the top multiplier on your buff stream; their faction gods get a middle one |
| **Gifts** | Specific items and blessings, paid for **out of their own winnings** — a god who gifts heavily is spending to raise your odds |
| **Conditions** | **The Directive.** Every gift carries one |
| **Taboos** | What ends the relationship |

**Refusing every offer is legal and is not a penalty.** A patron-less contestant keeps
**100% of their income** — the fastest possible accumulation — and receives a diffuse buff
stream spread thinly across every god whose domain the act touched. **No safety, all the
upside.**

### Directives

**A Directive is the condition attached to a gift.** The gift is the carrot; the Directive
is what you agreed to in taking it. Types as authored: Direct Action · Manipulation ·
Performance · Pressure · Sacrifice.

- **Refusing is playable.** You keep nothing, and the god remembers.
- **Directives conflict.** Two gods bidding on you will want incompatible things, and the
  house issues its own on top. Choosing whose Directive to honour is the ordinary texture
  of a run.
- **A Directive from a god who is not your Patron is a poaching attempt.** Accepting it is
  how a contract ends badly.

### Markers — the deal that is not patronage

**Patronage is exclusive. Markers are not.**

A **marker** is a short, scoped contract: *this specific power, in return for these specific
kinds of act.* It is the casino's own instrument — a credit note a god writes you against
future behaviour, and it is how gods do business with contestants they have not signed.

| | **Patronage** | **Marker** |
|---|---|---|
| Exclusive | **Yes — one only** | **No — hold as many as you can service** |
| Duration | Ongoing, until bought out | Until the named condition is met, or failed |
| Cost | A negotiated **cut of all income** | Named up front — a one-off price, an obligation, or a share of the income from *that act alone* |
| Gives | The full buff profile: domain multipliers, tier odds, faction spill | **One named thing.** A power, a gift, an intervention |
| Breaking it | Costs their entire standing | It simply lapses — and they remember |

**How a marker is written.** The god names the *kind* of act, not the instance: *"strike
first in three encounters"*, *"take no life on this floor"*, *"speak my name where the
capital can hear it"*. The GM sets the terms; the player decides whether the power is worth
the shape it forces on their play.

> **Markers are how a Patron loses you.** A rival's marker is a poaching attempt with a
> price tag — and most Patrons list *"take no marker from another god"* among their taboos.
> Taking one anyway is not a technicality. It is a breach, and it is visible: the gallery
> watches contracts more closely than it watches fights.

**A patron-less contestant lives on markers.** With no cut taken and no exclusive contract,
they can service several at once — which is the shape of the patron-less run: no protection,
no steady buff stream, and a pocket full of other people's conditions.

**What is left to the table.** How generous a marker is, how many a GM offers, and whether a
given Patron tolerates them are deliberately GM-and-player calls. The rule fixes only the
instrument: **scoped, non-exclusive, priced up front, and visible to everyone.**

### Breaking a contract

You may end a Patron's contract only by **spending divinity equal to their standing** —
paying out what they are worth. You then walk away with no patron, no savings, and a
congregation you must now defend alone.

Their cut slows exactly the accumulation you need to buy free, so **the longer you stay, the
further away leaving gets.** That is the intended shape.

### Patron Tokens

Patron Tokens remain the skill-cap currency (§4.2, +1 max level per token, ceiling 10).
**They are no longer earned by converting Patrons.** They are earned at **favour
milestones** — each time your standing with a god crosses a tier of their regard.

- **With a Patron:** focused. Their domains, their taboos, faster tokens.
- **Without a Patron:** diffuse. The gallery's regard accumulates across every god your acts
  have touched — slower, unfocused, and it never stops.

Both paths reach the ceiling. Neither is locked out.

---

## 17.6 Achievements & loot boxes

**Unchanged from v1** — tiers, contents, curation, specific-vs-generic boxes, and the
tier-≠-item-tier rule all carry over exactly.

One reading changes: **"Godly" is now literal.** A Godly box is a god's own relic, and *the
box knows who opened it* stops being a joke about presentation.

---

## 17.7 Narrative Tokens

They survive, re-read as **the gallery's tip**: spectator gods tipping the dealer on your
behalf, because they liked what you did.

- Earned from crowd donations, patron rewards and rare drops, as v1.
- One token = one significant narrative shift within a scene.
- **The hard limits stay hard.** A token cannot raise the dead, cannot change how someone
  feels about you, and cannot manufacture reverence. **Reverence is earned only** — that is
  the one rule this chapter cannot bend without collapsing.

---

## Designer's notes — what is settled and what is a number

**Settled:** the three tiers and their kinds; acts-not-attention as the conversion; the
viewer multiplier's *shape*; Camera Call as a declared bet restricted to uncertain outcomes;
Goals converting Followers; Directives as conditions on gifts; the patron market; the
buy-out; Patron Tokens as favour milestones with a patron-less path.

**Placeholder numbers, expected to move in play:** the weight ladder (1/3/10/30/100), the
viewer multiplier (×1/×2/×3/×5), the decay interval (three cycles), and the Patron
thresholds (10/50/200/1000). These are first-pass values chosen to be sayable at a table,
not tuned. **The structure is the contract; the numbers are the show's to tune.**

**Open:**

| # | Question | Rec |
|---|---|---|
**RULED 2026-08-11:** **S-01** the GM chooses which Followers walk · **S-02** patronage is
exclusive, **but markers are not** (§17.5) · **S-04** standing is **hidden** from other
contestants and visible to gods — which is what makes the Floor-10 finale a guessing game ·
**S-05** a Follower who reveres two contestants **splits their weight, and both know**.

| # | Still open | Rec |
|---|---|---|
| **S-03** | Do **Viewers** carry any mechanical effect besides the weight multiplier and Goal frequency? | **No.** Keep them an amplifier — a second spendable currency would undo §17.2's whole asymmetry |
| **S-06** | Does a **split Follower** pay each contestant full weight, or half each? | Half each, and the split is visible to both — it makes a contested village a live rivalry rather than a shared asset |
| **S-07** | May a **marker** ever be written by the house itself rather than a god? | Yes — the house's markers are the floor's Directives, and it never offers a good rate |
