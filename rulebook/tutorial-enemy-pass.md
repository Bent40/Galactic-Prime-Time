# Tutorial (Floor 0) — Enemy Pass

**Status: PROPOSAL.** Written 2026-09-15 at the owner's instruction ("stat the three
brothers"). Data: `server/seeds/enemies-tutorial.js`. Gate:
`node seed-enemies.js --file ./seeds/enemies-tutorial.js --floor 0 --check`.

Companion to `tutorial-floor-review.md` (the review that found the gaps). This is the
roster itself.

---

## T-0 — Floor 0 is now a real floor

The doctrine gate ran F1–F9 only, so a tutorial roster could not be checked at all.
Floor 0 is added to `floor-bands.js` and `seed-enemies.js` with one deliberate
special case, and everything else falls out of the existing model:

| | F0 (tutorial) | F1 |
|---|---|---|
| level | **6** | 16 |
| trait points | **14** (creation) | 24 |
| torso | **5** | 7 |
| **mob HP** | **2** | 5 |
| elite / boss / super HP | **24 / 50 / 120** | 60 / 125 / 300 |
| **signature: mob / elite / boss / super** | **3 / 4 / 6 / 9** | 4 / 6 / 8 / 12 |

**The one special case, and its reason.** `forceAt(f) = 4 + f` bakes in two §21.6
prep steps — one added damage type, one assist — that a tutorial party has not
bought yet: no Forge, no coatings, no drilled assists, no band step. Strip those and
a floor-0 contestant is weapon class 2 and nothing else: **2 Force**. So
`forceAt(0) = 2`. ⭐ **The tutorial is the floor where you have no preparation. That
is what a tutorial IS** — the special case is the definition, not a fudge.

⭐ **Two confirmations that fell out rather than being arranged:**
- `floorState(0)` returns **level 6** — exactly where the live party is standing.
  The tutorial's place in the ladder was already in the generator; it was just never
  printed.
- The Incinedile's **50-HP Network is exactly 25 × 2** — the §21.2 boss centre for
  floor 0. The Compendium's "single HP bar (total 50)" and the sim's six-part 125
  were never in conflict; one is the network, the other the puppet.

⚠️ **Contract change.** `signature.floor: 0` used to mean *unset, skip me*. Floor 0
is a real gated floor now, so the unset sentinel moved to **absent / null / `''`**
(`models/Enemy.js`, the seeder, and the admin dropdown all match). Un-migrated
entries still skip; a tutorial entry is gated like any other.

---

## T-1 — The roster

Four entries. The Incinedile is deliberately **not** in this file: it is the next
session's work and `tutorial-floor-review.md` already carries its numbers.

| Entry | Tier | Size | Budget | Signature |
|---|---|---|---|---|
| **Roach-dog** | mob | Small | **2** (exact) | 1 Bleed · `tick` |
| **Big Brother Roach** | elite | Medium | **24** (centre) | 4 Bleed · on-band |
| **Mid Brother Roach** | elite | Large | **32** | 4 Bleed · on-band |
| **Little Brother Roach** | elite | Small | **20** | 2 Bleed · `tick` |

⭐ **The budgets tell the story by themselves: 32 · 24 · 20.** Big to little, and
**the runt is under the elite line.** That is why he was thrown out, written into the
one number the doctrine gate actually checks.

---

## T-2 — ⭐ The curriculum nobody designed: all three brothers are answers to armor

The owner's playtest note is that basic resistance already stops mob damage cold —
*"most mobs will not be able to deal damage to the players due to the most basic of
resistances doing their job."* §12.6 resistance is a **flat subtraction**, so against
a mob's small number it is most or all of the hit.

Each brother breaks that a different way, and **none of it was designed to.** It fell
out of what the owner already said they are:

| | how it beats armor | the rule it teaches |
|---|---|---|
| **BIG** | the charged shot **PIERCES** — ignores typed resistance outright | armor is not a solution to everything |
| **MID** | the leap is **CRUSH** where his axes are **Bleed** | one resistance answers half of him |
| **LITTLE** | **the PRESS** merges three bites into ONE hit, so resistance subtracts **once** instead of three times | §21.8 — a mob is a positioning threat |

Little Bro's arithmetic, at the table: three roach-dogs at 1 Bleed each, against
armor 1. Pressed → `3 − 1 = 2`. Separate → `0 + 0 + 0 = 0`. **The press is the only
reason a roach-dog can hurt anybody, and the press only exists while he is alive.**

---

## T-3 — Roach-dog (mob · Small · 2)

**Signature: 1 Bleed, `tick`.** Bite ruled unchanged (owner, 2026-09-15: *"Roach-dog
damage won't be buffed. And the press is buffed to 3."*). It reads below the F0 mob
band of 3 legitimately — the number is chaff and the **Bleed tier** is what does the
work. Its band-sized hit exists; it is the press.

**What it teaches, in order:**
1. **§12.6 — armor SORTS.** One worn piece and a single bite does nothing at all.
2. **§12.6 again** — a Bleed tier on a part drops that part's resistance while it
   lasts. Twelve bites take your armor apart, and *then* the number matters.
3. **§21.8 THE PRESS** — three that can reach you merge into one 3-Force hit, capped
   at three, which is exactly one destroyed Small torso and cannot reach past it.

**At the table:** armor 0 → 3 through, a Small torso falls. Armor 1 → 2 through,
nothing's torso falls. ⭐ **One worn piece is the whole difference, in the room where
it happens.**

⚖ **HP: recommended, not ruled.** The live sim roster has this at **1 HP**; doctrine
at floor 0 is **2**, and 2 is what the seed carries. The change is **invisible at the
table** — a tutorial contestant swings for 2 and kills it in one either way. All it
stops is a **bare fist** one-shotting a roach.

---

## T-4 — Big Brother Roach (elite · Medium · 24)

*The eldest. Manners, a stained suit worn like it is not stained, and a bow. He will
greet the party properly before he shoots any of them.*

| Part | HP | |
|---|---|---|
| Head | 3 | |
| **Thorax** | **8** | **resists Bleed 2** — layered cloth over shell, kept immaculate |
| Bow Arm | 4 | |
| Off Arm | 3 | |
| Legs | 6 | |
| | **24** | dead centre — ⭐ the disciplined one is exactly to spec |

**Weak to Burn (doubles)** — *the suit is cloth and he will not take it off, ever, for
any reason. It is the only thing anyone ever made for him.* ⭐ **The mannered one's
dignity is his weakness**, and nobody has to explain why.

**Signature 4 Bleed** (on-band). **Charged shot** is the windup: 1 Moment of draw,
then **8** — either **PIN** (Crushed T1, cannot move until freed) or **PIERCE**
(ignores the target's typed resistance entirely).

**WEAK SYSTEM — the dodge, and the fact that it is *one*.** Once per Moment,
automatically and free, he avoids **one** attack of his choosing. No roll.

⭐ **This is the tutorial's trap for its own lesson.** §5.7 combined attacks merge the
party's damage and *"count as ONE hit"* — precisely the shape he negates. A party
that has just learned to stack everything into one enormous swing hands him a free
cancel. **The biggest hit is not the best hit against something that can refuse one
hit.**

**Three removals, all discoverable in the room:**
- **Spend it.** Attack twice in a Moment; the first is eaten, the second is not.
- **Area.** §7.3 — area does not divide, and he cannot dodge the room.
- **The charged shot is the tell.** He commits a Moment to the draw, and a roach
  mid-draw is not a roach mid-dodge. ⭐ **His biggest attack and his punish window are
  the same Moment.**

The Bleed 2 is on the **Thorax only**. Head, arms and legs are bare shell — a party
that works that out takes the bow arm off him, which is the whole fight.

**Talk instead:** the one brother who will hear a formal request. Manners get manners.

**Drops:** the **BOW** (class 3, plain — no band step: ⭐ *you inherit his weapon, not
his number*, which is L-11 in one object) and **THE SUIT**. The suit is Little Bro's
work.

---

## T-5 — Mid Brother Roach (elite · Large · 32)

*Four arms, two axes, a permanent grin and no interest at all in why the party is
here. Wants the fight. Has wanted the fight all day.*

| Part | HP |
|---|---|
| Head | 3 |
| Thorax | 10 |
| **Axe Arm L** | **5** |
| **Axe Arm R** | **5** |
| **Grip Arms** | **4** |
| Legs | 5 |
| | **32** — above centre, which is right for the tank |

**Resists Crush 2** — *he has spent his entire life letting things hit him to find out
what happens. The shell over the thorax is scar on scar on scar, and he is proud of
it.*

**Weak to Poison (doubles)** — *four arms and one appetite. He is eating when the
party finds him and he does not check what.* ⭐ **The meal is on the table when they
arrive.** Poison it before you are seen and you fight a poisoned Mid Bro. Nothing in
the room says so; the room just contains a plate. **A discoverable win condition that
exists only because the owner put a meal in the room.**

**Signature 4 Bleed** (one axe, one swing). **The leap** is the windup: 1 Moment of
coil, then **8 CRUSH** — and §7.3 says **area does not divide**, so everyone in the
landing space takes the full 8.

**WEAK SYSTEM — the arms.** His damage is **in the arms, not in him** (§21.6 Body).
Destroy an Axe Arm and that axe is gone.
- Both Axe Arms down → a grappler with the Grip Arms and no edge.
- Grip Arms down → no leap-grab, no hold, no carrying anyone anywhere.

**The win condition is dismemberment, not a damage race** (§21.3). A party that goes
for the 10-HP thorax is fighting the longest version of this fight.

**Grapple goes both ways.** He is **Large**, so §13 lets a Medium contestant grapple
him — ⭐ **the tutorial teaches grappling on the one enemy that grapples back.**

**The doll.** He carries the doll Little Bro made him, in a Grip Arm. Threaten it and
he covers it — the Grip Arms' action spent, every time, and he will do it every time.
⭐ A musclehead with an exploitable soft spot, and the soft spot is his little
brother's handiwork.

**Talk instead:** he wants a fight, not a murder. Give him a good one and stop.

**Drops:** **TWO AXES** (class 3 each, plain) and **THE DOLL**.
⭐ **The doll is not loot. It is the key to the hatchery** — proof the brothers kept
his gift. A party that killed Mid Bro can carry it to the brother who made it.
**That is a door, and they will not know it is a door.**

---

## T-6 — Little Brother Roach (elite · Small · 20)

*The youngest, in the hatchery, with everything he has ever made. Kicked out for being
weak. Answered it by building a family. Hateful, conflicted, and not wrong about any
of it.*

| Part | HP |
|---|---|
| Head | 3 |
| Thorax | 5 |
| Whip Arm | 5 |
| Legs | 3 |
| **Brood-Sling** | **4** |
| | **20** — under the elite line, on purpose |

**Resistances: NONE. Weaknesses: NONE. Blank by design**, §21.3 rule 4, and for the
loudest reason in the tutorial: **he was thrown out for being weak.** That is the one
thing every character in this story agrees on. A resistance would contradict it; a
weakness would soften it. ⭐ **He has no mechanical edge whatsoever and he is the
hardest fight on the floor, because of what he BUILT.** Same shape as Foreman Bex and
The Hunt's Owner.

**Signature 2 Bleed, `tick`** (whip, range 7) — under band on purpose, because he is
not the damage.

🔴 **DRAG BACK (range 7) deals NOTHING and is the deadliest ability in the tutorial.**
It pulls a contestant into the pack, where the press is. ⭐ **He does not attack you.
He moves you to where the attack is.** That is §21.8's whole thesis as one ability.

**WEAK SYSTEM — the brood, not the body.** Everything dangerous runs through roaches:
- **Awaken Eggs** (1 Moment) summons 4.
- **He DIRECTS** — which is the only reason the press exists at all (§21.8: while a
  directing elite is alive and can *see* the target).
- **Seal Wound** — he eats a roach and heals. **The brood is ammunition AND medkit.**
- **Drag Back** — above.

**The Brood-Sling (4 HP) decides the fight.** The newest clutch, strapped to him,
*because he was thrown out once and will not leave them anywhere.* Destroy it and the
reserve for Awaken Eggs is gone and so is the emergency ration for Seal Wound.
⭐ It is also **the part they will not want to hit** once they understand what it is —
the same gesture as Mid Bro covering the doll. **Two brothers, one of them already
dead.**

**The egg clusters** in the room are the same weak system at room scale. Burning the
nursery is the efficient play and it is horrible, and nothing will stop them.

**AI — low-HP bias 3.0.** He picks off the weak; a wounded contestant weighs up to 4×.
⚠️ **Interaction nobody designed:** §12.6 now drops a conditioned part's resistance,
so **the AI hunts exactly the target today's armor rule softened.** Keep it. Know it
is there.

**The terrain is the fight (T-8).** Goop is hard terrain — passable, much slower. Safe
spots to hop between; **an island is a corridor made of terrain**, and a corridor two
abreast caps the press at two (§21.4). **Island size is the press dial.** There is a
rush window at him, and it closes.

**The sinker branches on what they did upstairs:**
- **Mid Bro alive** → Mid Bro leaps and smashes the platforms. He finally has a job in
  a room that is not his.
- **Mid Bro dead (this party)** → Little Bro **throws a roach** at the platform. ⭐ A
  thrown roach is one he did not press with and did not eat. **Sinking now competes
  with the press AND with the healing.**

Killing Mid Bro made this room easier one way and harder another, and **nothing
announces either.**

⚙️ **And the room's decision cashes out L-24:** rushing him before the window closes
means fewer roaches, which means **fewer levels**. ⭐ **The fastest route through the
tutorial's last room is also the poorest.** Neither rule knew about the other.

**Talk instead — and this is the one that matters.** He is conflicted, not resolved.
He made them the suit. He made the doll. They threw him out for being weak and he has
been proving otherwise ever since, to nobody. **A party carrying the doll, or the
suit, has physical evidence his brothers kept what he made them.**

**Drops:** the **WHIP** (class 3, plain, range 7).

---

## T-7 — Sizing the rooms (§21.7), with armor in

Recalibrated model, per `enemy-scaling.md` S-4: mobs are cleared in **parallel**
(bodies, not output); an elite is limited by **output**; and the **defender's armor**
subtracts flat, which is what sorts a mob from an elite.

| Room | Read |
|---|---|
| 12 roach-dogs, **no directing elite** | trivial at armor 1 — confirmed by playtest |
| 12 roach-dogs **with Little Bro directing** | the press turns the same 12 into a real room |
| **Big + Mid together** | the two-elite room, and the party *"struggled badly"* |
| **Little Bro + brood + goop** | the tutorial's hard room, and its danger is **terrain plus a director**, not a fat body |

⭐ §21.7's own finding holds here: **mobs are cheap; what costs is something still
alive at the end of the room.** Little Bro's 20-budget body is the smallest on the
floor and his room is the hardest on it.

---

## T-8 — Open calls

| # | Call |
|---|---|
| **1** | ⚖ **Roach-dog HP 1 → 2.** Doctrine says 2; the live sim says 1. Invisible at the table (a tutorial swing is 2 either way); it only stops a bare fist one-shotting a roach. **Recommended, not ruled.** |
| **2** | **Sim/app parity.** These four entries live in this repo's `Enemy` collection; `Galactic-Prime-Time-Game/data/enemies.json` carries a reduced port (roach-dog, Little Brother, Incinedile, War Hound). Mid and Big Bro exist in neither until now. |
| **3** | **`War Hound`** (budget 14) is in the sim roster with **no design record**. Not statted here. |
| **4** | **The Incinedile** is next session's work. Its numbers are in `tutorial-floor-review.md`; the reading to build on is **puppet 125 / Network 50**, with the puppet's parts warded until the Breach — structurally the Doorward's shape. |
| **5** | **Loot handoff.** Owner considered giving the brothers' weapons free plus an extra shop coupon on a peaceful resolution. Drops are written per-entry above; the coupon is unpriced. |
