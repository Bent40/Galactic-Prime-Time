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

## 17.4 Goals and Markers — the two ladders of want

Something always wants something from you. The difference is **who is asking**, and **how
much they are prepared to pay**.

### Goals — the crowd's challenges

Issued by the gallery. Anonymous, optional, and the crowd does not care whether you survive
them. Categories unchanged from v1: **Spectacle** (Finish Fast, Overkill, Environmental
Kill) · **Performance** (Play into a Tag, Say the Line) · **Risk** (While Exposed, Without
Healing, Solo) · **Subversion** (Spare the Enemy, Betray Expectations).

**What changed:** a completed Goal no longer converts a Patron. **A Goal involving a named
being converts that being into a Follower**, at its weight, with the viewer multiplier
applied (§17.2). Goals involving nobody pay in Viewers and Achievement rewards only.

> **Subversion is now the most valuable category in the game.** *Spare the Enemy* names a
> being and gives them a reason to revere you. The crowd asks because it is good television;
> the economy pays because it is a Follower. **The category that looks like a joke is the one
> that compounds.**

### Markers — a god's challenge

**A marker is the top of the same ladder.** Where a Goal is the crowd wanting a spectacle, a
marker is **one named god wanting a thing done in the world**, and paying a boon to have you
do it.

> *"Kill this entity."* · *"Spare no traitors."* · *"Act with mercy in mind, this floor."*

**Why gods use them.** A god can act directly — and it costs them, out of their own winnings
(§17.5). **A contestant who already wants a boon is cheaper than an intervention.** A marker
is a god's agenda executed by proxy at a discount, which is why they are offered constantly
and why the offer is rarely as simple as it sounds.

| | |
|---|---|
| **Issuer** | A specific, named god — **not necessarily your Patron**, and not necessarily one you have met |
| **Asks for** | A deed (*kill X*), a restraint (*spare no traitors*), or a **disposition** (*act with Z in mind*) — a marker may demand a manner, not only an act |
| **Pays** | A boon: a power, a gift, an intervention. Named up front |
| **Exclusive** | **No.** Hold as many as you can service |
| **Duration** | Until the condition is met, or failed. Then it lapses |
| **Refusing** | Always legal. The god remembers, which is sometimes the entire point |

### The three dispositions — and the player should not be able to tell

Every marker is one of these, and **the GM should mix them so that no player ever learns to
read the offer**:

| | **Harmless** | **Trapped** | **A blessing in disguise** |
|---|---|---|---|
| What it is | The god genuinely wants the thing, and pays fairly | The deed serves an agenda that will cost you — a patron's taboo breached, a Follower alienated, a rival's hand strengthened | The deed looks ugly or thankless and turns out to have protected you, or someone |
| How it reads at the table | A clean trade | A clean trade | A clean trade |

**That is the whole point.** A marker is how a god makes you play to their wants, and the
best ones are indistinguishable from generosity until afterwards. A player who starts
refusing every marker has learned caution, and will watch the boons go to someone bolder.

### Markers as interference

**A marker is also how one god meddles with another god's candidate.** Offering your rival's
contestant a boon for an act that breaches their Patron's taboo is cheap, deniable and
entirely within the rules. Most Patrons list *"take no marker from another god"* among their
taboos — which is precisely why rival gods keep offering.

**A patron-less contestant lives on markers.** No cut, no exclusive contract, no protection —
and a pocket full of other people's conditions. That is the shape of the patron-less run.

### House markers — the dealer touching the bet

**The house may write a marker. It is not supposed to.**

The god running a floor is the *dealer*. Gods wagering at that table accept its outcomes
because the dealer has no stake in them. **A marker from the house is the dealer paying a
player to change the result** — dealing off the bottom, in front of everyone with money on
it.

So house markers exist, and they are **scandalous**:

- **The gallery objects**, loudly, if it surfaces. The house-runner's debt (§17.5) is the
  reason it happened and the thing that gets worse when it is caught.
- **Accepting one makes you complicit.** You are not merely serving a god's agenda — you are
  helping rig the table you are being bet on. The gods who lose money remember which
  contestant took the paper.
- **They are therefore rare, large, and a tell.** A floor-runner who offers you a marker has
  just shown you how desperate it is. That is information about its debt, and a lever — you
  now know something about your floor's author that the other contestants do not.

> **A house marker is never a routine reward.** It is a bankrupt god breaking the one rule
> that makes the table function, because it has run out of better ideas. Treat it as a
> story event with a price, not an item on a menu.

**What is left to the table.** How generous a marker is, how often they come, and how many a
GM lets a player juggle are deliberately GM-and-player calls. The rule fixes only the
instrument: **named issuer, scoped ask, boon priced up front, non-exclusive, refusable, and
visible to everyone** — the gallery watches paper more closely than it watches fights.

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

### Directives are your Patron's markers

A **Directive** is simply a marker (§17.4) issued by the god you are signed to — a standing
instruction rather than a one-off commission. Types as authored: Direct Action ·
Manipulation · Performance · Pressure · Sacrifice.

- **Refusing is playable.** You keep nothing, and the god remembers.
- **Directives conflict** with the markers other gods offer you, and with the house's own.
  Choosing whose want to serve is the ordinary texture of a run.
- Most Patrons list *"take no marker from another god"* among their taboos — which is
  precisely why rival gods keep offering.

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

**Settled:** the three tiers and their kinds; acts-not-attention as the conversion; markers
as a god's agenda executed by proxy, with three dispositions the player cannot read; house
markers as a scandal rather than a reward; the
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
**RULED 2026-08-11:** **S-06** a split Follower pays each contestant **half** weight, and
the split is visible to both — a contested village is a live rivalry, not a shared asset ·
**S-07** the house **may** write markers, but doing so is the dealer touching the bet (above)
· **S-03** Viewers do **nothing** beyond the weight multiplier and Goal
frequency — they amplify, they are never spent · **S-01** the GM chooses which Followers walk · **S-02** patronage is
exclusive, **but markers are not** (§17.5) · **S-04** standing is **hidden** from other
contestants and visible to gods — which is what makes the Floor-10 finale a guessing game ·
**S-05** a Follower who reveres two contestants **splits their weight, and both know**.

| # | Still open | Rec |
|---|---|---|
| **S-08** | Should a **caught** house marker have a stated mechanical consequence for the floor-runner, or stay GM fiction? | Stated — its debt grows by the boon's value, which makes the floor's ending harder and is felt |
