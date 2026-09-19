# Tutorial floor — review (2026-09-14)

**Why now:** the party is mid-tutorial, **next session is the Little Brother Roach**, and
three rules landed today that all touch it — §21.8 the Press, §12.6 armor (rides the band,
degrades with the part), and §21.7 encounter sizing.

> ⚠️ **CORRECTION, same day (owner).** This review read the **game repo's
> `data/enemies.json`, which is a REDUCED PORT** — it collapses **THREE** roach
> brothers — Big, Mid and Little — into one "Little Brother Roach" elite and folds Big Bro's bow and Mid
> Bro's axes into a whip plus a summon. ⚠️ *(An earlier draft of this note said FOUR brothers. That was my miscount — I counted the dog-roach as a sibling. It is the mob.)* **The designed tutorial is: roach-dogs ·
> Little Bro · MID Bro · BIG Bro · Incinedile.** So **T-3's "budget 64 vs a centre
> of 24" was measuring the wrong creature** and is withdrawn.
> **What survives, and is now stronger because the owner confirmed the numbers
> from the design side:** T-1.1 (the boss), T-1.2 (§10.1 was invented here),
> T-1.3 (the Press was pre-built for these roaches), **T-2 (a roach-dog deals 1,
> so a room of 10+ deals zero through armor)**, T-4 (Sasha's 3-HP torso) and T-5
> (both build gaps). ⭐ And the two-elite number is no longer a model output:
> **Mid + Big share a room, the party fought them together, and "struggled badly"
> is §21.8's 83% confirmed at a real table.**
> **The real roster is written up in the next pass; this file is kept for the
> findings that held.**

**Where the tutorial actually lives.** Not in this repo's `Enemy` collection. Four entries
exist only in the **game repo's** `data/enemies.json` — `Roach-dog` (mob) · `Little Brother
Roach` (elite) · `Incinedile` (boss) · `War Hound` (elite) — plus the design record at
Compendium **§3.1** and the party snapshot at **§5**. So the tutorial has **no doctrine
gate, no `signature`, and no `why` on any resistance.**

---

## T-1 ✅ Three things are already right, and nobody planned them

### T-1.1 The Incinedile passes §21.2 untouched — on BOTH readings

| part | HP |
|---|---|
| **Network** | **50** |
| Head | 7 |
| Right Hand | 8 |
| Left Hand (Flamethrower Arm) | 30 |
| Right Leg · Left Leg | 15 · 15 |
| **total** | **125** |

⭐ **125 is exactly §21.2's boss centre.** And because pre-breach damage is cosmetic, the
*real* fight is the **50-HP Network** — which is **25 × a tutorial mob of 2**, i.e. the boss
centre for a floor one below F1. **Both readings land.** The Compendium's *"single HP bar
(total 50)"* and the sim's six-part 125 are not in conflict; they are the network and the
puppet. **No re-statting needed.**

### T-1.2 §10.1 universal resistance was invented here, before the rule existed

> Compendium §3.1: *"**Breach Path B:** deal **7+ damage in a single hit** to one part."*

🔒 That **is** §10.1, word for word — *"universal 6 = needs 7 Force to do anything."* And it
already satisfies the requirement the rule now enforces:

- `cause:` the mycelium network holds the puppet's surface; damage to flesh it is not
  wearing is cosmetic.
- `removal:` **Bleed T2** on any part opens a wound onto the network — **or** 7+ Force in a
  single hit punches straight through.

⭐ **Two written removals, a discoverable win condition, and a cause in the fiction.** The
tutorial boss is §10.1's exemplar and it predates §10.1. Nothing to change.

### T-1.3 🔴 §21.8 THE PRESS WAS ALREADY BUILT — for these exact roaches

`roach_dog.personality.pack_hunter`, in the sim:

> *"R15 pack synergy: roaches hunt as a brood — when two ready roaches' own R23 antagonism
> draws AGREE on a victim this tick, the second **links its bite to the first (shared
> combo_id → one merged Force through one Robustness gate**; **pairs only in v1**)."*
> *"**Elites/bosses are NOT pack hunters.**"*

⭐ That is §21.8 ①, arrived at independently, **with the tutorial-safe dial already chosen:
pairs only.** And *"elites are not pack hunters"* composes exactly with ② — **the elite
directs without joining the merge.** Two designs, months apart, same rule.

🔒 **Adopt the sim's cap as the tutorial's setting: the press pairs, it does not stack to
three.** That is the difference between a tense room and a dead contestant (T-3).

---

## T-2 🔴 The real problem is a NUMBER, not the rule

**A roach-dog bites for `1 Bleed`. Its carapace is `1 HP`.**

⭐ **That is the playtest, confirmed against the actual statline.** §12.6 armor is a flat
subtraction, so:

> **12 roach-dogs × 1 Bleed − armor 1 = ZERO damage. All session.**

Owner, from play: *"they clear a room with 12 mobs with 0 issues… most mobs will not be able
to deal damage to the players due to the most basic of resistances doing their job."*
**Exactly right, and this is why.**

🔴 **And the Press does not rescue it at bite 1.** Two pressing roaches deal `2 − 1 = 1`.
The rule is sound; **the number under it is about three times too small.**

**What the doctrine wants.** §21.2/enemy-scaling: a mob's signature ≈ **0.55 × torso**. The
tutorial torso is **5** (§3.2 base, at the party's 14 spent points). So a roach should bite
for **3**, not 1.

### The calibration table — merged Force, minus armor, vs torso

| bite | armor | 1 mob | **2 (the pair cap)** | 3 | kills a 5-torso at | kills Sasha (3) at |
|---|---|---|---|---|---|---|
| **1** *(as written)* | 1 | 0 | **1** | 2 | never | never |
| **2** ⭐ | 1 | 1 | **3** | 5 | 3 mobs | 2 mobs |
| **2** | 2 | 0 | **2** | 4 | never | 3 mobs |
| **3** *(doctrine)* | 1 | 2 | **5** | 8 | **2 mobs** | **2 mobs** |
| **3** | 0 | 3 | **6** | 9 | **2 mobs** | **1 mob** |

⚖ **Recommendation: bite 2, press capped at pairs.** A lone roach is chaff (1 through), a
pair genuinely hurts (3), and nothing at the tutorial one-shots a torso. **Bite 3 is the
doctrine number and it is too hot here** — at armor 0 a single roach takes a third of
Sasha's torso and a pair kills her.

⚠️ **The two changes are one change.** Raising the bite without capping the press, or
capping without raising, both miss.

---

## T-3 ⚠️ Next session is the most dangerous encounter in the game as written

The **Little Brother Roach** is a **director that manufactures its own pressers**:

| ability | |
|---|---|
| **Awaken Eggs** | 1 Moment · **summons 4 roach-dogs** |
| Whip | 1 Moment · range **7** · 2 Bleed |
| Drag Back | range 7 · **pulls the target toward itself** |
| Seal Wound | 2 Moments · heals 1 |

🔴 **Under §21.8 this is the worst-case shape and it is next up.** It summons the pack, it
**drags a contestant into the pack**, and by ② its presence is what lets the pack merge at
all. *Awaken Eggs + Drag Back is a two-Moment kill combo on a 3-HP torso.*

⚠️ **And an interaction nobody designed.** Its `low_hp_bias: 3.0` — *"the brood-tender picks
off the weak; wounded prey weighs up to 4×"* — now meets **§12.6: a conditioned part resists
less.** ⭐ **The AI hunts precisely the target today's armor rule has softened.** Emergent,
thematically perfect, and genuinely nasty. Keep it; know it is there.

### Statline problems in the same entry

🔴 **Its part budget is 64.** The tutorial's elite centre (mob 2 × 12) is **24**; F1's is 60.
**So the elite is F1-grade while its mobs are 1 HP** — the elite is *sixty-four times* its
own mob. That is the tutorial's one genuine internal inconsistency, and it is why the owner's
*"2 elites and they struggled badly"* happened at all.

⚖ Two defensible readings: **the elite is correct and the mobs are under-statted** (T-2's
finding, and my read), or **the elite should come down to ~24**. Do not do both.

---

## T-4 🔴 The party, and the thing the owner already spotted

§5 snapshot: **14 spent trait points each, 6 unspent.** Part HP = `5 + (total − 14)/5`, so
**torso 5 now, 6 once the pool is spent.**

| | Physique | Reflexes | Mind | Charm | Head/Torso |
|---|---|---|---|---|---|
| Filipe (Sea Lion, healer) | 3 | 4 | 3 | 4 | 2/5 |
| XQUEZ/T (AI, Physique 5, **no weapons**) | 5 | 2 | 3 | 4 | 2/5 |
| Mario (Human, brawler) | 4 | 3 | 2 | 5 | 2/5 |
| **Sasha** (Cat, primary damage) | 3 | 4 | 4 | 3 | **2/3** 🔴 |

🔴 **Sasha's torso is 3 where the book says 5**, and she is the damage dealer, so she is
forward. **Every lethality threshold in T-2 fires one mob earlier for her.**

⭐ **The owner already diagnosed the general case**, in the Compendium: *"GM currently
favoring non-lethal body-part targeting as mercy; considering boosting all body-part HP or
easier HP acquisition since it's hard to hurt without killing."* **§21.8 and §12.6 both make
that sharper**, because both add damage at the bottom of the range where the margin already
did not exist. ⚖ Unruled, three options: **bring Sasha to the book's 5** · **spend the six
unspent points** (torso 6 for everyone) · **leave it and cap the press at pairs.**

---

## T-5 ✅ Two gaps the tutorial exposed in what was built that day — BOTH CLOSED

### T-5.1 `fire_heals` has NO FIELD — healing from a type is a third thing

✅ **CLOSED 2026-09-15 — `weaknesses[].mode` = `double` | `heal` is built**, per-part
overridable, with the required `why` on every mode. ✅ **And SPENT 2026-09-19** — the
Incinedile is statted (`tutorial-enemy-pass.md` T-9) with Burn `heal` on the body and
Burn `double` on the Network, which is the sim's `fire_heals` / `fire_harms` pair in v1
vocabulary. ⭐ It turns out to be the best thing in the fight: **the same torch feeds the
monster and kills the thing inside it.** The finding as originally written follows.

The Incinedile's defining trait is *"all fire damage and Burn received **heals** the boss."*
§7.3 gives an enemy **`weaknesses`** (doubles a type) and **`resistances`** (subtracts from
it, capped at what that type dealt). **There is no way to express a NEGATIVE weakness**, so
the boss's central mechanic cannot be written into `Enemy` at all.

⭐ And the sim already found the sub-case: **`fire_harms: true` on the Network exempts that
one part** from the boss-wide fire-heal, because *mycelium burns*. So it needs to be
**per-part overridable** — which `BodyPartSchema` already supports structurally, since it
carries `resistances` and `universal`.

⚖ Same shape as the two gaps THE MASKED surfaced. Proposed: `weaknesses[].mode` of
`double` (default) | `heal`, with the existing required `why`, overridable per part.

### T-5.2 The doctrine gate cannot check a tutorial roster at all

✅ **CLOSED 2026-09-15 — floor 0 is a real floor now.** `FLOOR_MOB_HP` ran **1–9**, so
`seed-enemies.js --floor 0` threw and `--check` on a tutorial file was impossible. Built in
`floor-bands.js` and `seed-enemies.js`: **mob 2 · elite 24 · boss 50 · super 120**, damage
band **mob 3 · elite 4 · boss 6 · super 9**, from a torso of 5 at level 6. The one special
case is `forceAt(0) = 2` — the formula bakes in two §21.6 prep steps a tutorial party has
not bought, and ⭐ **the tutorial is the floor where you have no preparation, which is what
a tutorial IS.** ⭐ `floorState(0)` returns **level 6**, exactly where the live party is
standing, and **the Incinedile's Network is exactly 50** — both fell out rather than being
arranged. ⚠️ Contract change: `signature.floor: 0` no longer means *unset*; the sentinel
moved to absent/null/`''`. Roster: **`rulebook/tutorial-enemy-pass.md`** +
`server/seeds/enemies-tutorial.js`.

---

## T-6 Small things

- ✅ **Phase thresholds — FIXED 2026-09-19.** §3.1 read Phase 1 `HP 50→36` and Phase 3
  `HP 35→19`, so **35 sat in a band and in a valve trigger at once**. The written-up
  entry (`tutorial-enemy-pass.md` T-9) runs the bands contiguously — **50–36 / 35 /
  34–19 / 18 / 17–0 / 0** — and a test pins the six strings, so it cannot drift back.
- **Trash cans** pop at `Burn 5` for `2 Burn` in 3 spaces. F1's Fuel Can (the Kindler) is
  `Burn 10` for `4 Burn` — the tutorial's is deliberately the weaker original. Correct.
- ✅ **`War Hound` — CLOSED 2026-09-17.** Owner: *"War Hound is your invention."* ⚠️ My
  note had the polarity backwards — there is no design record **because nobody designed
  it**. Agent-authored sim scaffolding, **parked for F2**, out of the tutorial.
- **Four Compendium `[OPEN]` items still sit in the tutorial's path**: the fantasy-item
  coupons (Basic weapon + one Lesser modifier each) are **undistributed**, XQUEZ/T's tank kit
  (Intercept / Iron Stance) is **unfinalised** — ⭐ and *Iron Stance is the answer to the
  Press*, so it wants finishing before the roaches — and Filipe's Dissolution song is TBD.

---

## T-7 The short version

| | |
|---|---|
| ✅ **The boss is fine — and is now STATTED** (T-9, 2026-09-19) | 125 parts = the boss centre; the 50-HP Network is the tutorial-scale fight; its breach paths are §10.1 before §10.1 existed. **No number was changed**; what the write-up added was the ward, the fire split, and a gate that can see both readings at once |
| 🔴 **The mob is not.** | `1 Bleed` against flat armor is **zero**, which is the whole of *"12 mobs, no issues."* Recommend **2**, not the doctrine's 3 |
| 🔒 **The Press is already half-built** | in the sim, for these roaches, **capped at pairs** — adopt that cap |
| ⚠️ **Next session is the hard case** | a director that **summons its own pressers and drags you into them**, whose AI hunts the wounded that §12.6 just softened |
| 🔴 **Sasha's 3-HP torso** | moves every threshold one mob earlier. The owner's own *"hard to hurt without killing"* note, now with two new rules pushing on it |
| ✅ **Two build gaps — BOTH CLOSED 2026-09-15** | `weaknesses[].mode` = `double`\|`heal` is built (per-part overridable) · the gate has floor 0. **All five entries are statted** in `tutorial-enemy-pass.md` |

---

# T-8 THE HATCHERY — the goop room, designed (owner, 2026-09-15)

> *"Safe spots they have to hop in between, and get sunk by middle brother as they
> go, and the goop can be moved through but much more slowly, so they can try and
> reach little bro roach quickly if they want, but that window closes eventually."*

⭐ **This fixes the thing T-2's follow-up flagged as broken.** Goop plus a very long
whip removes the party's ability to choose its geometry — which is §21.8's *only*
counterplay to the press. **The safe spots give it back: an island is a corridor
made of terrain.** And island size is the press dial — a platform that holds you
and three adjacent roaches is exactly the capped press (§21.8, three).

## T-8.1 §21.4 — the three answers

1. **Hard to walk in?** **Yes, and two ways at once.** The **goop is passable but
   much slower** (hard terrain, full cost). The **safe spots are islands** —
   normal movement, but only if you can make the hop. ⭐ **So the room has a fast
   lane and a safe lane and they are not the same lane.**
2. **A hazard?** **The islands sink.** Not the goop — the *ground you were
   counting on.* The room gets worse in the one place the party chose to stand.
3. **Otherwise?** Little Bro's reach covers the whole room, so **there is no
   "out of range"** — only "hard to get to." Egg clusters are cover and are also
   his larder.

🎬 **§21.6 Situation steps (cap 2):** *holding an island* (+1 — it caps the press
and denies flanking) · *a hop that lands behind him* (+1 — the goop's slowness
cuts both ways once you are past it).

## T-8.2 ⭐ THE SINKER — and it branches on what they already did

The role is **whoever destroys the safe spots**, and the tutorial has two answers
depending on a choice the party has already made:

| branch | the sinker | what it costs |
|---|---|---|
| **Mid Bro alive** | ⭐ **He does it.** *"Can leap distances"* — a four-armed musclehead who leaps is a platform-breaker by design, and it finally gives him a job in a room that is not his | Nothing. He is having a good time |
| **Mid Bro dead** *(this party)* | 🔴 **Little Bro does it himself, by throwing a roach at the platform** — *"he throws the roaches"* is already his verb | ⭐⭐ **A thrown roach is a roach he did not press with and did not eat.** Sinking competes directly with the press **and** with his healing |

⭐⭐ **So killing Mid Bro made this room easier in one way and harder in another,
and nobody announces either.** The party removed a dedicated sinker; what replaced
it is the boss spending his own ammunition. **That is the consequence of a floor-1
choice arriving as a different fight**, which is the shape this campaign uses
everywhere else.

## T-8.3 The decision the room is actually asking

> **Rush him before the window closes — or hold an island and grind the brood.**

| | what you get | what it costs |
|---|---|---|
| **RUSH** | you reach Little Bro while the platforms still connect; fewer roaches on the board; the press never assembles | 🔴 **Fewer kills — and under L-24 (ruled today) that is fewer LEVELS.** The fast path is a real experience cut, and nobody will mention it |
| **HOLD** | every roach is XP; the island caps the press at three; you fight him at full strength with a cleared floor | he eats and calls; **the platform you are standing on is the one he is aiming at** |

⚙️ **That trade came out of a different ruling by accident.** *Everything killed
pays* (§3.1) was decided for the whole campaign this morning; it lands here as
*the fastest route through the tutorial's last room is also the poorest.* Neither
rule knew about the other.

## T-8.4 Numbers, at the ruled settings

**Roach-dog damage stays 1** (owner: not buffed). **The press caps at 3.**

| the party's armor on the struck part | 1 roach | 2 | **3 (max press)** | |
|---|---|---|---|---|
| **0** | 1 | 2 | **3** | 🔴 **a Small torso (3) is destroyed** · a Medium (5) survives |
| **1** | 0 | 1 | **2** | nothing's torso falls |
| **2** | 0 | 0 | **1** | the brood is decoration |

⭐ **One worn piece of armor is the entire difference for Sasha**, in the room
where it happens. That is the teachable version of §12.6 and it needs no speech —
just a hop she makes in a vest and a hop she makes without one.
