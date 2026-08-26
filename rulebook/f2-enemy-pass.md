# Floor 2 — The Enemy Pass (PROPOSAL)

**Date:** 2026-08-18 · **Status:** 🟡 PROPOSAL — awaiting owner blessing.
The frame it is built on is ruled: [`enemy-scaling.md`](enemy-scaling.md) (bands,
damage, hordes), [`level-budget.md`](level-budget.md) (the curve), §12.7's errata
(band units), and [`f1-enemy-pass.md`](f1-enemy-pass.md) E-0 (mobs exact, one part;
elite+ multi-part and varied; gates and weak systems; mob carve policy).

> **Story:** [`set1-story-canon.md`](set1-story-canon.md) — the Cinnabrus arc, reconciled into v1.
> 🔒 **Firewall (S-0):** the god, his champion, his queen and the dragon's descendant cross into v1.
> **The Cosmic Casino, tables, patrons and divinity-as-economy do not.** In v1 the Corporation
> runs the show and no god is running anything — Cinnabrus is *background a good run uncovers*.

**Floor 2 is the great desert, seventy years after Floor 1** (Compendium §4.1).
Route beats are the owner's, from §4.2–4.4. Data: `server/seeds/enemies-f2.js`.

---

## F2-0 — What Floor 2 is, mechanically

| | |
|---|---|
| **Band** | M-2 Desert **×4** — Sky-Iron · Flint · Sunglass · Scorpion Chitin · Turquoise ⭐ |
| **Party** | level ~26, 34 trait points, **9 HP torso** |
| **Enemy HP** | **unchanged from F1** — mob 5 · elite ~60 · boss ~125, in band units |
| **Enemy damage** | mob **5** · elite **8** · boss **10** · super **15** (signature hits) |
| **Returning** | F1's roster as tides of **~25** (enemy-scaling S-2) |

**Nothing about the HP ladder moves, and that is the point.** §12.7's errata means a
Floor 2 mob is 5 band units exactly as a Floor 1 mob is. The only thing that grew is
the contestant, so the only thing that grows to meet them is **damage**.

### The through-line: this is the demon floor

All three routes run into demons at F2 — one blocks the Easy exit, the Medium route
*is* demon politics, and the Hard route is a demon hunt. That is not a coincidence to
smooth over; it is the floor's identity, and the shared desert layer should feel
**empty** by contrast so the demons land.

### And the plague is loose

**Ash-Lung Pilgrim (A-5) puts the crystal on every route.** A party that took Hard at
F1 recognises it instantly. A party that did not meets it here with no idea what it
is — seventy years after it was a single crystallised city, now blowing around a
desert. This is the seed of F3, where all three routes converge on the disease.

---

## Layer A — The Great Desert (shared, all routes)

**5 mobs · 2 elites.** Leaner than F1's shared layer on purpose: the desert is
supposed to be thin, and the routes carry the weight.

| # | Entry | Size | HP | The gate, in one line |
|---|---|---|---|---|
| **A-1** | **Glass Wasp** | Small | 5 | none — the floor's plain horde, and it flies |
| **A-2** | **Saltbound** | Medium | 5 | **immune in direct sunlight**; answer is shade, water, or a heavy Crush |
| **A-3** | **Sand-Scarab** | Small | 5 | **burrows into your gear** — removal costs a Moment and hurts anyway |
| **A-4** | **Mirage-Walker** | Medium | 5 | **presents as three**; two are light. Detection (§15), not damage |
| **A-5** | **Ash-Lung Pilgrim** | Medium | 5 | **puffs crystal on death** — Infected T1, the plague on every route |
| **A-6** | **Sky-Iron Revenant** | Large | **70** | **metal weapons stick to it** |
| **A-7** | **Glasswright** | Large | **48** | **encases a contestant in glass** — a 2-Moment windup |

**A-2 Saltbound is the floor's signature idea** — a gate whose answer is *where* and
*when*, not *what*. It makes §21.4's terrain framework load-bearing and makes night a
tactical choice rather than scenery.

**A-6 Sky-Iron Revenant rewards not selling your F1 gear.** Metal sticks; wood, bone,
glass, claw and unarmed do not. A party still carrying Beastbone and Oak Heartwood
walks in with the answer — the same E-3 shape as Mistletoe and the Mask, one floor on.
**Attacks:** arm sweep 8 Crush; a **magnetic haul**, 1-Clock windup, **12 Crush** —
above band because it is telegraphed (enemy-scaling S-1).
**Carve:** Sky-Iron.

**A-7 Glasswright deals no damage at all.** Its windup makes a contestant **Helpless**
inside a 20 HP shell someone else has to break. At four contestants, removing one is
worse than wounding one. Three answers: destroy the Casting Arm (8), leave its range
before resolution (§5.3), or **let it finish on a decoy** — the shell it builds is
then hard cover for the rest of the fight. **Carve:** Sunglass.

---

## Layer B — Easy Route: the ruined stair

Beats (§4.2): the same staircase, the dungeon in ruins; the man **still chained,
alive via the mask, unpossessed and ravaged by seventy years**. A demon blocks the
exit. Defeat it; free the man.

| # | Entry | HP | Note |
|---|---|---|---|
| **B-1** | **Rubble-Wight** | 5 | reforms **from the rubble** — in a room made of rubble |
| **B-2** | **Hollow Custodian** | **55** | repairs 6 HP a Clock **from the ground it stands on** |
| **B-3** | ☠ **The Doorward** | **130** | the demon in the doorway |

**B-1 also returns F1's Stair-Wights as a tide of ~25.** Same 5 HP, same gate, and
now the whole stair comes down at once.

**B-2's fight is about GROUND.** Push, lure or wreck it onto bare stone and the
repair stops; destroying the Tread Unit (11) reaches the same answer from the other
side. It will try to repair *the staircase* mid-fight, which is both an opening and a
warning about the exit.

### B-3 · ☠ The Doorward — boss (130) ⚖ name is a proposal

**Parts:** **Mouth 18** · Head 14 · Torso 46 · Arms 12/12 · Legs 14/14 · **Large**

**Gate — it holds what you gave it.** It does not attack first. It **asks**, and takes
payment in things that are not objects: a name, a memory, a Tag, the use of a skill.
Anything it holds is unusable for the rest of the floor, and **while it holds anything
of yours, Torso damage is cosmetic.**

**Weak system — take it back.** The **Mouth (18)** is where it keeps them; destroy it
and everything returns at once, to everyone, and the Torso opens. A party that gave it
nothing skips the gate entirely — and will almost certainly have given it something,
**because the first price it asks is always cheap.**

**Phases:** *The Price* (it bargains; attacking immediately skips to phase 2 with the
gate already down — a legitimate and much harder win) → *The Holding* (10 Crush, and
it speaks with the voices it took) → *Open* (Mouth destroyed).

> ### ⚠️ The thing the party must not be told
> **It is not guarding the exit. It is guarding the floor above.**
>
> For seventy years it has been eating the plague out of the chained man — that is
> what it feeds on, and why it never left. It blocks the door because **letting anyone
> out lets the crystal out.**
>
> **Killing it is the correct move and the wrong one.** It is how Nullrot reaches the
> capital at F3 (§4.3), and it is *why he arrives as both the disease and its cure* —
> seventy years a sealed reservoir, opened by the people who came to free him.
>
> This is THE MASKED's shape one floor on: **the win condition costs you the floor
> above, and the mural already warned you.** Do not warn them. The Doorward will, in
> its way, and they will not believe it.

---

## Layer C — Medium Route: the queen's court

Beats (§4.3): the girl is now a **demonic queen**; the party is sent to assassinate a
**rival demon** who helped humans and wants to overthrow her. This is the encounter
the **Dissolution songs** (Compendium §3.5) were written for.

| # | Entry | HP | Note |
|---|---|---|---|
| **C-1** | **Court Servitor** | 5 | they don't fight back; killing them is a *diplomatic* act |
| **C-2** | **The Queen's Blade** | **62** | **Dodge Threshold 8** — the first thing they cannot simply hit |
| **C-3** | ☠ **Bex, the Rival Noble** | **145** | the songs — **and the man from Floor 1** |

**C-2 is the mechanical lesson of the route.** A threshold, not immunity: Reflexes 8
auto-dodges, 10 auto-dodges and counters, below is the 1d4 fallback. **And it cannot
dodge what it does not choose to** — areas, lines, cones, collateral and condition
damage are never dodged (§14). The desert mobs spent the whole floor teaching that kit.

### C-3 · ☠ The Rival Noble — boss (145) ⚖ name is a proposal

**Parts:** Head 18 · Torso 52 · Arms 14/14 · Legs 15/15 · **Choir 17** · **Large**

> **The Rival is Foreman Bex.** The man who led the arsonists at F1 was never a man —
> he was a demon killing a rival by proxy, using humans, because using humans is the
> only way he knows how to be near them. **That is why he could not be killed at the
> house.** He does not announce it; he apologises between attacks in exactly the voice
> he used there, and if nobody notices, the Choir sings it for them.
>
> **They were sent to assassinate him and they may succeed. It does not take.** A demon
> is not killed by killing its body, and nobody told them that either. He is at Floor 3
> running a human farm regardless — and what happens in this room decides what he thinks
> of them when they arrive.

**It also branches on Floor 1:**

- **The Girl was spared** → she is queen, the Rival is a genuine rebel, and the party
  is her assassin. The weight sits on killing someone who helped people.
- **The Girl was killed** → the Rival is **Beelzebub's viceroy and does not know it**.
  The party is either killing his man or being hired by him and not told by whom.
  **Same statline, completely different scene.**

**Noble-class presence — Dissolution, escalation +2 per Moment** (§8.2 errata). One
Clock of grace, then a Hold Threshold climbing 2 a Moment against Mind. **The F1
demonic brand is full immunity.** A branded party has a fight; an unbranded party has
a countdown, and §14 obliges the GM to say the remaining Moments out loud.

**The Choir (17) is the source.** It sings each contestant the one true thing about
them they have not said — Mario *"Every Living Breathing Moment"*, Sasha *"Dark is the
Night"* (**and the fear is Nikita's, not hers**), XQUEZ/T *"Human"*. Destroy the Choir
and the Dissolution freezes where it stands.

**Weak system — answer the song.** A contestant who **speaks the true thing aloud, in
character**, freezes their own threshold without touching the Choir. **That is the
intended win, and it pays more Exposure than the kill** (§17).

---

## Layer D — Hard Route: the escort

Beats (§4.4): the Loong is in the desert, **hunted by demons**; escort it to a village
where it finds purpose.

| # | Entry | HP | Note |
|---|---|---|---|
| **D-1** | **Hunt-Hound** | 5 | **goes for the Loong, never you** |
| **D-2** | **Kennel-Warden** | **58** | while it lives, hounds arrive **3 per Clock, forever** |
| **D-3** | ☠ **The Hunt's Owner** | **120** | it bought the hunt; it has never run one |

**The win condition is arrival, not a corpse.** The encounter ends when the Loong
reaches the village. **The Owner can be outrun, and outrunning it pays the same.** A
party that stops to fight loses: hounds are infinite until the Warden falls, and the
Owner will simply buy more.

**The Horn (12) is the whole fight.** Every Clock it sounds and a fresh pack arrives
**wherever the Loong is**, not where the party is. Destroy the Horn and the hunt ends
even if the Owner lives — the discoverable position §21.3 asks for, and reachable,
unlike the Owner himself.

> ### The Loong fights beside you
> Same creature, same **300-point block**, Warden Form Large ↔ Loong Form Huge,
> truth-sense intact — **as an ally.**
>
> Last floor it was the thing that could not be beaten. This floor it is on the
> party's side, **and it is terrified**, because it is being hunted and it has never
> been prey. It will not Turn unless the party is about to die — and if it does, the
> hunt breaks instantly and the village sees what arrived.
>
> **Reach the village and it sheds a scale** (M-5 Loong-Scale — shed, not taken; the
> only way that material enters the world).

---

---

## F2-2 — Quest design for Medium and Hard (PROPOSAL, 2026-08-25)

> **Owner:** *"We need to work on medium and hard's F2's quests."*

⚠️ **Both layers are mechanically strong and that is not the problem.** C-2's Dodge Threshold,
the Dissolution songs, D-2's infinite hounds and the Horn as a discoverable position are all
good encounter design. **The gap is upstream of the fight: what the party is DOING, and whether
it can matter.**

🔴 **The diagnosis, from the Marks sweep.** Set 1's deed sweep (`set1-item-concepts.md` C-0c)
graded every F1–F3 beat against *someone holds a grudge · someone feels gratitude · the
possibilities changed.* **Layer C produced zero.** That is not a scoring quirk — it is the route
telling us something.

---

### F2-2a — 🔴 Medium's real problem: the party cannot change the outcome

Walk the route as written:

| The party… | And then |
|---|---|
| is **sent** to assassinate a rival | they are an instrument, not an agent |
| **succeeds** | *"It does not take."* He is at F3 regardless |
| **fails or spares him** | He is at F3 regardless |
| **answers the song** | They get Exposure. The world is unchanged |

⚙️ **Every path converges.** Nobody holds a grudge that outlives the room, nobody owes them, and
no road opens or closes. **That is why the sweep found nothing to brand** — correctly.

⭐ **The fix is already written into the layer, one sentence from the end:**

> *"…and what happens in this room decides **what he thinks of them when they arrive**."*

🔴 **That is a promise the route does not currently cash.** Bex's F3 posture is the one thing
this floor genuinely determines, and nothing mechanises it. Make that the quest.

**Three candidate spines — these are proposals, and the owner picks (or rejects) one:**

| | Spine | What becomes markable |
|---|---|---|
| **① The Petition begins here** | Canon has Bex at F3 *wanting to be human*, never lying, unable to defend his means. **Let him ask the party for something at F2** — small, deniable, and honest. They grant it or refuse. | 🩸 A refusal he remembers · 🕯 a favour he owes. **Either way F3's Bex is a different scene**, which is what the layer already promises |
| **② Who hired you** | The killed-branch already has the party *"being hired by him and not told by whom"* — Beelzebub's man, unknowingly. **Let that be discoverable.** Finding out mid-route, and choosing to finish the job anyway or walk, is a decision the party owns | 🚪 Possibilities change: you either served Beelzebub knowingly or refused him to his face |
| **③ What the crown is digging for** | Vermilia is two centuries into excavating a god, and 🔒 **the high court do not know what the secret is.** A party that freed her at F1 is the one group she might tell. **Learning it is not a deed — being asked to help, and answering, is** | 🕯 Gratitude from the only follower a dead god has left · 🚪 the F3 revival road opens early |

⭐ **①+③ compose well.** Both antagonists ask the party for something on the same floor, both
asks are honest, and **the party cannot satisfy both** — Bex wants the hunger lifted, Vermilia
wants her god back, and S-6 says those are the same cure arriving by different roads. **That is
demon politics as a *choice* rather than as a job.**

⚠️ **② is the weakest alone** — it is a reveal, not a decision, unless refusing has a cost.

---

### F2-2b — Hard's real problem: the destination is undefined

Layer D's mechanics are the strongest on the floor. But the **win condition is *"arrival"* at a
village described only as somewhere the Loong *"finds purpose"*, and 🔴 the owner has already
said that reads as nothing** — *"which village? the loong's? I dont think this is what i had in
mind."*

⚙️ **The route is currently a fetch quest with excellent combat.** `Shepherd` brands a party for
delivering a creature somewhere, and the doc cannot say why there.

🎯 **Proposed fix — the village is where the Loong's LEAD is.** Canon already supplies it:

> S-4: *"Seventy years crossing the desert hunting the source — and **out here it heard of the
> mask**."*

**So the village is where it heard.** Someone there saw a masked man, or survived him, or
carries the plague he left. **Arrival is not sanctuary — it is the Loong getting its next step**,
and that step is the capital.

**What this buys, at no cost to the existing encounter:**

| | |
|---|---|
| ⭐ **`Shepherd` becomes causal** | You did not save a creature. **You put it on the road to the meeting that ends the campaign** (S-6) |
| ⭐ **`Livestock` gets its full weight** | Handing it to the hunters does not just doom one dragon — **it kills the lead**, and with it the only path to the cure |
| ⭐ **The floor connects** | F2 Hard now *causes* F3 Hard instead of preceding it |
| ✅ **Nothing is rebuilt** | Hounds, Warden, Horn, the shed scale, the win-on-arrival rule all stand unchanged |

🟡 **Open: who in the village knows?** A survivor · a plague-scarred child · a trader who sold
the masked man passage. The last is the most useful — **it means the mask was moving with
purpose seventy years ago**, and someone took money for it.

---

### F2-2c — What this proposal does NOT settle

- 🔴 **Nothing here is ruled.** Three Medium spines and one Hard fix, all owner calls.
- **No new statlines.** Every proposal above rides the existing C-1/C-2/C-3 and D-1/D-2/D-3
  entries; the fights do not change.
- **The Marks that would follow are unwritten** — deliberately. Author them *after* a spine is
  picked, per C-0c's rule that Marks are authored per floor beside the enemy pass.

---

## F2-1 — What this pass does NOT cover

| Item | Note |
|---|---|
| **Encounter tables / room counts** | A roster, not a dungeon — same gap as F1 |
| **Desert terrain blocks** | §21.4 wants three answers each: open sand, the salt flats, the ruined stair, the court, night vs day. **A-2 makes this urgent** |
| **Night as a mechanic** | Saltbound's gate implies a day/night state the floor does not yet have rules for ⚖ |
| **Exposure / token payouts** | Still unassigned, F1 and F2 alike |
| **The three boss names** | ⚖ Doorward, Rival Noble, Hunt's Owner — all mine. The Rival becomes canon at F3 if the farm storyline references it |
| **Filipe's Dissolution song** | `[OPEN]` in Compendium §3.5 and needed for C-3 |
| **Turquoise ⭐** | The rare F2 material has no source in this roster — needs a carve or a gather |
