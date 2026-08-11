# Floors 4–6 — The Crowned (proposal)

**Status:** **CORE RULED 2026-08-11** (F-01…F-08). The spine, the question, the relic rule,
the scale and the carry-overs are decided; the floor-set's god and the kingdom tree's
contents are drafted below and await sign-off.
**Owner's brief (2026-08-10):** *faction wars worldwide · control and large-scale fighting ·
kingdom-based · champions build alliances and empires and conquer rival kingdoms · relic
pieces gate the stairs · F4 establish your kingdom and make your relic part · F5 explore
rival kingdoms and their dungeons for pieces · F6 conquer, take their relics, X relics
opens the passage · citizens and alliances carry over from the previous set.*

---

## 1. Assessment — what's already right

| | Why it works |
|---|---|
| **It matches the compendium's F4–6** | `(game repo) docs/GPT_Master_Compendium.md:268` already has floors 4–6 as the **continent merge**, players consolidated as competition narrows. Kingdom war *is* the continent merge |
| **The scale escalates correctly** | The compendium's rule is each floor grows geographically — city → country → continent. F1–3 was one buried god under one capital; empires are the right next rung |
| **The gate is countable** | "X relics opens the passage" is legible at a table and trivially implementable in the sim |
| **Carry-over is canon** | *"unlocks are path-dependent"* (`../canon/story-canon.md:72-73`). This is the **first concrete instance** of the convergence matrix, which is the largest unwritten artifact in the project (I-20) |

---

## 2. The thing it's missing — the war IS the economy

The proposal reads as a good 4X layer. Under the rules already ruled, it can be something
almost nobody else can do.

> **Under Q-14, divinity is named, living beings who revere you. A kingdom is a population.**
>
> **So conquering a kingdom is not taking territory. It is taking a congregation.**

That single sentence reframes the whole set at no design cost:

- Every citizen under your rule is **potential divinity** — but only if they revere **you**.
  Q-64 already established the trap: Vermilia rules a capital and is **poor**, because the
  city worships a name that isn't hers. **An empire can be enormous and worthless.**
- **Q-63's running thread is the same mechanic, inverted.** Hunting Beelzebub's believers
  is *subtraction* from a god's ledger. Kingdom-building is *addition* to yours. F4–6 is
  the same system pointed the other way, so the set needs no new economy — it needs the
  existing one at scale.
- Conquest now has a **cost the players can feel**: a conquered population that fears you
  is not a congregation. Slaughter your way through and you inherit an empty ledger.

**This is what stops F4–6 being a strategy minigame bolted onto a dungeon crawler.**

---

## 3. The set's question is already chosen for it

Canon lists the question shapes at `../canon/story-canon.md:69-71`: *necessary vs right · safety
vs justice · **power for yourself vs power for many***.

**The third one is this set, exactly.** And **Q-53 makes it mechanical rather than moral
flavour**:

> Stability flowing down the vassalage is a **grant, not a pipe** — the god chooses whether
> to route it.

So as a champion accumulating reverence from a growing empire, you make one recurring
decision, every floor:

```
   Your citizens revere you  ──▶  divinity accrues to YOU
                                        │
                        ┌───────────────┴───────────────┐
                  HOARD IT                        ROUTE IT DOWN
          power for yourself                   power for many
          you grow fast                        they prosper, stay,
          they weaken, starve,                 and keep revering you
          and eventually stop                  you grow slower
          naming you                           and hold what you built
```

**The floor-set's question, the verdict axis, and the resource loop are the same action.**
That is what F1–3 achieved with the pray-or-ransack choice, at empire scale, and it uses a
rule the owner already ruled for a different reason entirely.

---

## 4. The weakest part, and the fix

**"Collect X relic pieces to open the door" is a lock, not a question.** It is the one part
of the brief that doesn't carry the set's meaning.

**The fix is already in the system: Q-33.** Every floor-set hides its god's **myth-source**.
Apply that at kingdom scale:

> **Each kingdom's relic IS its god's myth-source.**
>
> Taking it does to that god exactly what **Beelzebub did to Cinnabrus** — silences them,
> forecloses them, ends their ability to be named.

Which produces the best thing in this proposal:

> **F4–6 asks the party to commit Beelzebub's crime, six times, to advance — immediately
> after F1–3 spent three floors teaching them what it costs.**

They will *know*. And they can look for another way: negotiate for a relic, restore a
bankrupt god in exchange for it, or take it and live with having become the thing they
buried. That converts a fetch quest into the set's moral engine, with no new machinery.

**It also explains why the relics grant buffs** — you are wearing another god's voice.

---

## 5. The set needs its own bankrupt god (§11.2 requires one)

Every 3-floor set has one bankrupt runner working off a debt to the house (Q-29). F1–3 has
Cinnabrus. F4–6 needs one, and F1–3 established the pattern to follow:

> **The floor's host is a cautionary answer to the floor's question.**
> Cinnabrus asks *"will you cure what's corrupted, and at what cost?"* — and he is the god
> who cured too eagerly, killed everyone, and lost everything.

So F4–6's host should be **a sovereignty god who answered "power for yourself" and was
proved right, then bankrupt**:

⟨PROPOSAL⟩ A god of crowns whose empire was the largest ever worshipped — who **hoarded**,
never routed stability down, watched his people starve, and was **stopped being named** one
province at a time. He did not fall to a rival. **His congregation simply stopped.** He now
runs a floor where champions build empires, watching to see whether anyone does it better,
and taking a cut either way.

His myth-source would be the **crown** — and it is the one relic in the set that no kingdom
holds, because it is his own, and the house took it against the debt.

---

## 6. Carry-over from F1–3 — concrete, and it forks hard

Q-57 already ruled the mechanism. This is what it means at the start of F4:

| F1–3 outcome | What you bring into F4 |
|---|---|
| **Revived Cinnabrus** | Vermilia and her demon soldiers as a **standing army**; the capital as a Lounge-attached base; Cinnabrus as a vassal god (whose divinity flows up to you — Q-52); the war on Beelzebub's believers already running (Q-63) |
| **Ransacked the grave** | **No army.** Every demon in the world hostile. You start F4 with plague-speech, a hostile continent, and no allies — a genuinely harder, lonelier campaign |
| **Never found the tongue** | Neither. You arrive at F4 as a stranger with no faction — the "clean" start, and the poorest one |

**That is three materially different openings to the same floor**, driven by one earlier
choice, which is exactly what path-dependent unlocks were supposed to deliver.

---

## 7. Risks

| Risk | Mitigation |
|---|---|
| **Scope — kingdom management is a second game.** In a TTRPG it's GM narration; in the Godot sim it's a 4X system, and KAN-2 (combat) isn't finished | Keep a kingdom to **four tracked numbers**: reverent population, army, relics held, alliances. No builder, no tile map. The dungeon crawl stays the game |
| **Rival champions need definition** | Make them **NPC champions with their own patron gods** — it makes the patron system visible from the outside for the first time, and every rival kingdom comes with a god who has money on it |
| **F5 "explore other kingdoms' dungeons" could become filler** | Tie each dungeon to its kingdom's god and relic (§4). Then exploration is reconnaissance on a *person*, not a level |
| **Six floors of war may crowd out the show** | The broadcast is the frame — Camera Call, Directives and the audience still run. An empire is *better* television than a dungeon; lean on it |

---

## 8. RULED — F-01 … F-08 (2026-08-11)

| # | Ruling |
|---|---|
| **F-01** | **Conquest is taking a congregation.** The divinity economy is the set's spine |
| **F-02** | **Power for yourself vs power for many** is the question — and **divinity buys kingdom growth** (§9) |
| **F-03** | **Each kingdom's relic is its god's myth-source.** Taking one repeats Beelzebub's crime |
| **F-04** | The floor-runner comes from **Arthurian myth or Gilgamesh** — not the invented god of crowns (§10) |
| **F-05** | Rival kingdom-builders are **NPC champions with their own patron gods** |
| **F-06** | **More than four numbers**, but no tile placement and no build sim — an *overarching management* layer in the game; in the TTRPG, how the kingdom grows and what opportunities it gains |
| **F-07** | **3 relics of 5 kingdoms**, your own included |
| **F-08** | The **Loong survives** into F4–6, **and Vermilia's war on Beelzebub starts here** |

---

## 9. The kingdom tree — divinity as capital

> **Owner's ruling:** *"Divinity is used to grow your kingdom stronger — you spend your own
> earnings to grow your kingdom in every aspect. We need a tree much like the Lounge's, only
> for your kingdom. Make it a good place to live and population will grow slowly. Choose not
> to invest in growth, and your people will dwindle."*

This closes the economy into a loop with a decay term, and it is the best structural
addition the set has:

```
     INVEST divinity in the kingdom ──▶ a better place to live
                                              │
                                     population grows (slowly)
                                              │
                              more named beings who revere you
                                              │
                                     ═ MORE DIVINITY  ──┐
                                                        │
                    ◀───────────────────────────────────┘
     WITHHOLD ──▶ conditions decay ──▶ people leave or die ──▶ less divinity
```

**Divinity now has three competing uses, and only one of them compounds:**

| Use | Nature | Ruled at |
|---|---|---|
| **Personal advancement** (the divinity shop) | Consumption — you get stronger now | D-01 |
| **Kingdom growth** (this tree) | **Investment** — it pays you back, and grows | F-02 |
| **Held** | Leverage to break a patron's contract; and your standing in the pantheon you join or found at the end | Q-05, Q-12 |

That is a genuinely hard allocation problem *in a single currency*, which is exactly what
the F1–3 set lacked — there, divinity only ever went one way.

### 9.1 Draft branch set

Modelled on the Lounge's module levels (§20.2), with divinity as the sink instead of Upgrade
Tokens. ⟨PROPOSAL — **F-09**⟩

| Branch | Buys | Failure to invest |
|---|---|---|
| **Fields** | Population ceiling | The ceiling falls; growth stops before it starts |
| **Walls & garrison** | Retention, and your F6 army | Raids cost you people permanently |
| **Physicians** | Decay resistance; the crystallization plague bites less | The disease thread from F1–3 spreads into your own population |
| **Temples** | **The share of your population that reveres *you* by name** | A large population that generates almost nothing (Q-64's trap) |
| **Forge & market** | Items, trade, relic-working | No means to use a relic you take |
| **Archive** | Reveals rival kingdoms' gods and where their relics sit | F5 becomes blind searching |
| **Court** | Alliance capacity with rival NPC champions | You conquer alone, or not at all |

### 9.2 The build order *is* the moral question

**Temples buy your income. Fields, walls and physicians buy their lives.**

- Pour into **Temples** and you extract faster from a population that is quietly getting
  worse off — *power for yourself*, and it works, for a while.
- Pour into **Fields, walls, physicians** and you grow slower — but people who live well
  revere you anyway, and the base compounds — *power for many*.

Neither is punished by fiat. The fast path really is faster, and the slow path really does
overtake it if the campaign runs long enough. **The verdict axis scores the build order**,
so the set's question is answered by a spreadsheet the player kept for six floors and never
thought of as a moral document.

---

## 10. The floor-runner — Arthur or Gilgamesh (F-04)

Both are already authored in the corpus, and both fit. They fit *differently*.

### GILGAMESH — `mesopotamian_gilgamesh`
`hero` · influence 1 · recognition 4 · role **contestant_legend** ·
*"The house's most replayed contestant tape — the two-thirds-divine tyrant who beat every
table except the one where the prize is not dying."*

- **The Epic is the floor-set's question, verbatim.** He opens as a tyrant taking from his
  own city and ends having failed to secure personal immortality — his only surviving legacy
  being **the walls he built for other people**. That is *power for yourself vs power for
  many*, resolved the hard way.
- The corpus already frames him as **a former contestant who lost the final table**, with
  Enkidu (*"chose friendship over his design spec — and got invoiced for it"*) and Humbaba
  as a ready-made supporting cast.
- **Weakness:** he is a *contestant legend*, not a presider. Making him run a floor means
  re-casting him.

### KING ARTHUR — `arthurian_medieval_arthur`
`hero` · influence 1 · recognition 5 · roles **contestant_legend, table_boss** ·
*"The house's retired champion brought back to preside — a table boss who'd rather judge
your run than play it, crown catching the studio lights, always one dramatic sleep away
from a comeback."*

- **He is already cast as a presiding table boss.** No re-casting needed.
- *"One dramatic sleep away from a comeback"* is the **once-and-future king** — which is the
  **Phenex/Amy pattern** the Goetia attests twice: a demoted power serving out a term in
  hope of restoration. His debt writes itself: **he needs a realm to return to, and has been
  waiting fifteen centuries for one.** So he runs a floor where champions build realms.
- **The whole Arthurian apparatus maps onto this set's mechanics** and is already in the
  corpus: the **Round Table** (*"sit the oath and the whole party wins together; break it
  and the felt goes cold"*) is F-05's alliance system; **Excalibur**, **the Grail** and the
  **Siege Perilous** are the relic layer; **Mordred** (*"a boss you can't out-hit, only
  out-heal-the-schism"*) is an empire collapsing from within.
- **Weakness:** his fall is about betrayal, not about hoarding — a slightly looser fit to
  *power for yourself vs many* than Gilgamesh.

### Recommendation — use both, in different seats

> **Arthur presides. Gilgamesh is the ruin you build on.**

Arthur runs F4–6 as its bankrupt host, with the Round Table as the alliance mechanic and
the Grail as the relic nobody may take. **Gilgamesh is the previous champion of this exact
floor-set** — the one who built the largest kingdom anyone ever built and still lost the
only table that mattered. **F4's "establish your kingdom" happens on his walls.**

That gives the set a host with a debt *and* a cautionary predecessor, keeps the F1–3 pattern
(the floor's author is an answer to the floor's question) without collapsing them into one
figure, and spends two pieces of corpus that are already written. **→ F-10.**

---

## 11. Scale, relics and carry-over

**F-07 — 3 relics of 5 kingdoms, yours included.** You must take **two**. Well judged: the
act is forced twice, so it cannot be dodged, but **two kingdoms can be left standing** — the
player chooses *which* gods to silence, and that choice is on the record.

**F-06 — the depth.** A management layer, not a builder. At the table this is narrative: the
kingdom is a short sheet of branch levels, and what it unlocks is *opportunities* — who will
ally, what the Archive reveals, whether the garrison can hold. In the sim it is an
overarching management screen. **Neither is a tile map.**

**F-08 — both threads run here.**
- **The Loong survives F1–3** into this set — still the only cure in the world, now moving
  through kingdoms that have armies and reasons to want it.
- **Vermilia's war on Beelzebub starts in F4–6, not F7.** Under Q-63 that is a campaign of
  subtraction against a seated patron god's ledger — and it now runs *alongside* the player
  building a ledger of their own. **The set therefore contains both directions of the
  divinity economy at once**: you add congregations while she deletes them.

---

## 12. Open

| # | Question | Rec |
|---|---|---|
| **F-09** | Approve the seven-branch kingdom tree? (§9.1) | Yes — Temples is the load-bearing one |
| **F-10** | **Arthur presides, Gilgamesh is the ruin** — or pick one? (§10) | Both, in different seats |
| **F-11** | Does the **Grail** sit in the set as the relic that *cannot* be taken? | Yes — it makes the two you do take a choice, not a sweep |
| **F-12** | Do the 5 kingdoms' gods get authored from the corpus, or invented? | From the corpus — it is 295 entities deep |
| **F-13** | Can a player **decline to conquer** and reach 3 relics another way (trade, restoration, inheritance)? | Yes — otherwise §4's moral engine is a rail |
| **F-14** | Does population dwindle on an **absolute** floor, or only relative to investment? (§9) | Absolute floor — a kingdom can die |

---

## 13. RULED — F-10 … F-14 (2026-08-11)

| # | Ruling |
|---|---|
| **F-10** | **A combined table.** More than one ruin exists, and **the path you take leads you to the relic of the god you resemble more** |
| **F-11** | The **Grail** is the relic that cannot be taken — see §14 |
| **F-12** | The five kingdoms' gods come **from the corpus** |
| **F-13** | **Yes** — a player can reach three relics without conquering |
| **F-14** | **Absolute floor.** A kingdom can die, and losing every citizen is a loss condition |

### 13.1 F-10 makes the verdict axes *route* content, not just score it

Until now the question-axes have been an instrument that **measures** the player. F-10 turns
them into a **switch**: which ruin you stumble into, and therefore which god's relic is
within reach, depends on which of them you already resemble.

- A player who has been extracting from their people finds **Gilgamesh's** ruin — the tyrant
  who took from his city, failed to buy his own immortality, and left only walls.
- A player who has been building for them finds **Arthur's** — the king who made a table
  with no head seat, and watched it break from inside anyway.
- Neither is the "good" ruin. Both men lost.

**This is the cheapest possible way to make F4–6 replayable**, and it means two players who
describe the same floor-set will not have seen the same content — which is exactly what
path-dependent unlocks were supposed to buy and have not yet delivered anywhere else.

---

## 14. F-11 expanded — the Grail

The corpus already writes it, and the wording does most of the work:

> *"The untouchable pot at the centre of the room — feeds everyone, belongs to no one, and
> burns the hand of anyone who reaches for it unclean."*
> — `arthurian_medieval_holy_grail` · artifact · recognition 5 · healing, wisdom, protection

**Four reasons it should be the one relic that cannot be taken.**

### 1. It is the only relic with no god to silence
Every other relic in the set is **a god's myth-source** (F-03) — take it and you foreclose
that god exactly as Beelzebub foreclosed Cinnabrus. The Grail *"belongs to no one."*
**There is nobody to silence.** It is not protected by being guarded; it is protected by
being unowned, which is a much stranger and more interesting kind of immunity.

### 2. It turns 3-of-5 from a sweep into a choice
Five kingdoms, one untouchable relic, three needed. You take **two of four** — so which two
gods you silence is a decision you make and the record keeps.

### 3. It is the "power for many" path's payoff — and that fixes a real balance problem
The kingdom tree has a known risk (§9.2, and the outside review named it): **Temples extract
faster**, so the self-serving build may simply be stronger. The Grail is the counterweight.

> *"Burns the hand of anyone who reaches for it unclean"* is not GM fiat — **it is a
> requirement, checked against the verdict axes.** A player whose build order has been
> extraction cannot hold it. A player who has spent six floors on fields, walls and
> physicians can.

So the two paths reach three relics by different routes:

| Path | How you reach 3 |
|---|---|
| **Power for yourself** | Faster divinity, stronger army, **conquest** — you take two, and two gods go quiet |
| **Power for many** | Slower growth, weaker army — but **the Grail admits you**, so you need only take one |

Neither is punished. The extractive path really is faster and really does cost two gods; the
welfare path really is slower and really does keep its hands clean. **The set's question
gets answered by the route, and the route is chosen by the build order.**

### 4. It is a worked example of what F-13 permits
The Grail *"feeds everyone."* It is a relic that generates reverence **without being owned** —
the set's whole thesis in one object. A player who understands why the Grail cannot be
stolen has understood the alternative to stealing, which is the lesson F1–3 spent three
floors teaching and F4–6 exists to test.

**→ F-15: is holding the Grail permanent, or does it leave if your later choices turn?**
Recommend it leaves. A relic that judges you once is a trophy; one that keeps judging you is
a mechanic.
