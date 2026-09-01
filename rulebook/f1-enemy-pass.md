# Floor 1 — The Enemy Pass (PROPOSAL)

**Date:** 2026-08-18 · **Status:** 🟢 **E-0 RULED** (owner, 2026-08-18) — the four
interpretation calls are blessed and the seeder enforces them. Statlines and
encounter content remain 🟡 PROPOSAL.

> **Story:** [`set1-story-canon.md`](set1-story-canon.md) — the Cinnabrus arc, reconciled into v1.
> 🔒 **Firewall (S-0):** the god, his champion, his queen and the dragon's descendant cross into v1.
> **The Cosmic Casino, tables, patrons and divinity-as-economy do not.** In v1 the Corporation
> runs the show and no god is running anything — Cinnabrus is *background a good run uncovers*.

**⚠️ Damage re-based 2026-08-18 (×2).** [`level-budget.md`](level-budget.md) L-19
puts a focused contestant at a **7 HP torso entering Floor 1** (the book's baseline
is 5), so every attack number below is **×2 of the book baseline** — Bramblewretch
2 → 4, the Loong's coil 6 → 12.

*An earlier pass this same day used ×5, sized against a 13 HP torso from a
misread anchor ("50 on a trait at level 5" rather than **floor** 5). That was ~2.5×
too aggressive and has been corrected.*

**HP budgets are unchanged** (L-11: weapons ride the material band, so the §21.2
ladder stands), and **condition tiers are unchanged** (§12.7: "condition and utility
modifiers don't scale"). Gates, weak systems, phases and carves all stand.
Nothing here is ruled. Governing canon: rulebook **§21** (Enemies & Encounter
Design), **§21.2** horde doctrine, **§21.3** boss doctrine, **§12.7** materials,
and `rulebook/item-drafting-materials.md` **M-1** (the F1 Forest band ×2).
Route beats are the owner's, from the game repo's
`docs/GPT_Master_Compendium.md` §4.2–4.4. The **Incineradile** (§3.1 there) is
the boss-design pattern every boss below follows.

Delivery vehicle: `server/seeds/enemies-f1.js` + `server/seed-enemies.js`
(dry-run default). No UI work — the admin **Enemies** section already renders
the model. `⚖` marks a table-tunable number.

---

## E-0 — The rulings this pass rests on ✅ **BLESSED 2026-08-18**

These are the load-bearing interpretation calls. **E-0.1–E-0.4 are ruled**; the
seeder refuses to write data that breaks them.

### E-0.1 ⚖ The rank number is a **part budget**, not a pooled bar

§21.2 gives F1 as mob ~5 · elite ~60 · boss ~125 · super ~300. But §7.3 resolves
damage **per part**, and §7.5 kills on head/torso at 0 — there is no pooled bar
on a player, and the `Enemy` model stores `bodyParts[]`, not a total.

**Proposed:** the rank number is the **sum of the enemy's part HP**. It is a
budget you distribute; the lethal parts carry the bulk. The Incineradile's
"single HP bar (total 50)" stays valid as a *tutorial-boss* exception — it
predates the doctrine and it is a puppet, which is why it has one bar.

### E-0.2 ✅ **Mobs are ONE part; elite and above are MULTI-part**

A mob is a horde member. Give it a single part at **5 HP** and nothing else: no
head, no limbs, no targeting minigame. One on-band F1 hit removes it. This is
not a shortcut — it *is* the doctrine ("die in one meaningful blow"), and it
makes the admin panel usable at table speed: one number, then delete the row.

**Corollary — the number is the doctrine, not a dial.** Every F1 mob below is
exactly 5. A mob that needs to survive a hit gets a **gate** (E-0.3), never a 6.

**And the converse is ruled too: elite and above are always multi-part.** A single
fat bar is not an elite, it is a mob that cheated. The seeder rejects both errors.

### E-0.3 ⚖ Every enemy above mob rank names its **weak system**; every mob that survives names its **gate**

§21.2/§21.3. A gate is a stated rule that makes a hit not land (surface
immunity, damage-type immunity, untargetable-while-X). A weak system is the
discoverable thing that turns the gate off. Both are written in the enemy's
`notes` field so the GM reads them at the table. **If an entry below has neither,
it is a mob and it simply dies.**

### E-0.4 ⚖ Mobs do not carve individually — a cleared room yields **one gather roll**

Carving eight Bramblewretches for eight Beastbones is inventory spam. Elites and
above carve a **named** material (§12.7 "a boss yields its named material");
mob rooms yield one gather from the floor's band. Named carves are listed per
entry below.

### E-0.5 ⚖ Every enemy carries a **size** — and it is now a real field

§7.1 says *"every combatant has a size: Small / Medium / Large / Huge. Humans are
Medium. Effects referencing size read this field."* The `Enemy` model had no such
field, and §13's grapple rules already depended on it. **Added 2026-08-18** to the
model, the admin panel, the API and every entry below.

It is not decoration. §13 makes **Large** (one size over a Medium contestant)
grappleable and **Huge** (two sizes over) not — which is the whole trap in the
Loong Kin encounter (D-3).

### E-0.6 ⚖ The crystal is a **disease**, and it is Nullrot's — ✅ **RULED 2026-08-18**

The Hard route's crystal is not scenery and not a golem theme. It is **the plague**,
and it is **part of Nullrot's story** — the same disease the Easy route's chained man
is *simultaneously spreading and curing* in the capital at F3 (§4.3), and the same one
the Loong is *preventing the spread of* at F3 (§4.4).

**That unifies three routes into one plague.** It also means the Hard route's F1 now
seeds its own F3 payoff instead of arriving there cold.

**Nullrot is BOTH patient zero and the antibody** ✅ **RULED 2026-08-18** — which is
precisely why §4.3 has him *simultaneously spreading and curing* at F3. That line
stops being poetry and becomes a mechanism: he is the disease's source and its only
known cure, carried in the same body, and neither can be taken without the other.
It is also why the demons at F3 want him and the Loong both (§4.4).

⚖ **One timeline consequence to rule later** (E-4): the Hard route's city is
*already* crystallised at F1, before the Easy route's man puts the mask on. The
tidy reading is that **the mask carries the plague and he is only its newest
host** — making the moving city the work of a previous bearer, and making Easy and
Hard *the same story at two stages*. A party on Hard sees the ending before the
beginning.

**Mechanically it uses only what the book already has** — no new condition class:

| Exposure | What it does |
|---|---|
| **Contact** | **Infected T1** on the touched **part**, advancing per §8.1. Localised, visible, breakable off a limb |
| **Inhalation** | **Infected T1 *plus* Suffocation** (§8.2 — torso only, tierless 2-Clock death timer). Precedent: Pneumotoxin "starts the Suffocation timer once it reaches the torso" |

**Infected T3 kills, normally.** ✅ **RULED 2026-08-18.** The statue idea is
dropped, and the owner's reason is the correct one: *a contestant crystallised
until F3 is out of play either way, and no player waits ten sessions to play their
character again.* "Not dead, just unavailable for a third of the campaign" is death
with extra bookkeeping.

**Which means the crystal needs no rules exception at all.** It is Infected (§8.2)
plus Suffocation on the inhalation route, and Infected T3's normal **2-Clock death
timer** *is* the mercy window. All the drama lives at T1–T2, where Resin, Antiseptic
Wash and Burn T2 can still reach it. The statue was solving a problem the earlier
tiers already solved.

The crystallised *citizens* are still statues, of course. They just aren't players.

**Vocabulary bridge**Vocabulary bridge
**Super Boss**; the admin UI's tier list predates that and calls it
`legendary`. The seed file uses `legendary` because that is what the model
accepts. Renaming the enum is app work, out of scope here.

---

## E-0.7 — Two rulings that change how this roster is USED

### Requirements go insane ✅ **RULED** (level-budget L-14)
§12.1's requirement ceiling of 5 Physique lifts. Items may demand any amount of any
trait — *a gravity-manipulating axe needs the Physique to hold it; a corrupting staff
needs the Mind to resist it.* **Stats are the key, not the gun:** trait growth buys
the right to hold the nuclear weapon, not extra damage. For this roster it means
**carve materials and boss drops should eventually name a requirement**, not just an
effect — that is where F1's loot connects to the endgame.

### Old enemies become hordes ✅ **RULED** (level-budget L-15)
**Nothing here expires.** A Bramblewretch is 5 HP forever; at F5 the party meets two
hundred of them and cuts through the lot. That is the power fantasy expressed as
content rather than as a stat block, and it is already what §21.2 describes — "mob
fights are about the crowd: cones, lines, positioning, ammo burn."

**So this roster is a permanent asset, not a floor's worth of content.** Later floors
need **horde counts** for these entries, which is now an E-4 item.

---

## E-1 — The F1 ladder, worked

Band: **F1 Forest ×2**. An on-band F1 weapon swings for roughly **4–6**.

| Rank | Budget | Reads as | Layout shape |
|---|---|---|---|
| **Mob** | **exactly 5** | one on-band hit, **always** | 1 part |
| **Elite** | **~60**, spread **30–120** ⚖ | its gate, then a real fight | 5–7 parts |
| **Boss** | **~125**, spread **62–250** ⚖ | a fight with a discovery in it | 7 parts |
| **Super** | **~300**, spread **150–600** ⚖ | *do not* | 9 parts, nothing under 10 |

✅ **RULED 2026-08-18 — only mobs are exact.** *"The only one we can decisively say
always dies in one meaningful shot is mobs."* Elites and above **should differ from
one another**, and §21.2's ratios were always "first-pass ratios", not law. The
seeder enforces mobs exactly and gives everything above a **±tolerance band** — the
gate exists to catch gross errors, not to flatten the roster.

**As shipped, the F1 non-mobs vary, and each number answers to its design:**

| Entry | HP | Why that number |
|---|---|---|
| The Chainbearer | **45** | a straight fight you are *meant* to be able to walk away from |
| The Kindler | **48** | his fuel can is the answer; out-damaging him was never the plan |
| The Rack | **52** | it regenerates — raw HP is not its defence, the Crown is |
| Mycelium Bloomkeeper | **68** | surface-immune trunk; the real fight is three 4 HP cords |
| Step-Warden | **78** | masonry, and cosmetic damage until the Keystone |
| Foreman Bex | **110** | a man, and he leaves at 40 regardless |
| THE MASKED | **125** | the reference boss |
| The Girl in the House | **140** | a demon, and a queen by Floor 2 |
| Loong Kin | **300** | the reference super |

**Sizes as assigned** ⚖ — Small: Camera Gnat, the Girl · Large: Husk-Moth Cloud,
The Rack, Mycelium Bloomkeeper, The Chainbearer, **the Loong's Warden Form** ·
Huge: Step-Warden, **the Loong's Loong Form** · everything else Medium.

Layouts are per-entry, not templated — see each entry below.

---

## E-2 — Roster shape

Floor 1 is the green forest, and the three labeled routes begin here; **players
pick one route per campaign** and the others resolve offscreen (§4.1). So the
roster is one shared layer plus three route stacks, and **only one stack gets
played**. Budget the authoring accordingly — the shared layer is where the
reuse is.

| Layer | Entries | Plays for |
|---|---|---|
| **A — The Forest** | 6 mobs · 2 elites | every party |
| **B — Easy: the grand staircase** | 1 mob · 1 elite · 1 boss | Easy only |
| **C — Medium: the haunted house** | 1 mob · 1 elite · 1 boss · 1 unfightable | Medium only |
| **D — Hard: the moving city** | 2 mobs · 1 elite · 1 super | Hard only |

**19 entries total.** Every party meets 8 of them; the route adds 3–4.

---

# Layer A — The Forest (shared, all routes)

## Mobs — 5 HP, one part, never alone

### A-1 · Bramblewretch — mob
A bundle of thorn-scrub that stood up. Appears **4–8** ⚖.
**Part:** Bramble Body 5.
**Attack:** 2 Bleed on contact; moves in a straight line and does not turn well.
**Gate:** none. This is the plain horde — the one the party learns cones on.
**Colour:** `#4a7a3a`

### A-2 · Husk-Moth Cloud — mob
Counted and statted as **one body**, not a swarm of bodies.
**Part:** Cloud 5.
**Attack:** 1 Chill to a random part per Moment in contact; blocks vision through
its space.
**Gate:** ⚖ **immune to single-target damage.** A sword through a cloud does
nothing. Cones, lines, area effects and Burn are the answer. This is the
teaching mob for §21.2's "mob fights are about the crowd."
**Colour:** `#8a8fa8`

### A-3 · Rootjaw — mob
Buried ambusher. Never seen before it bites.
**Part:** Rootjaw 5.
**Attack:** 2 Crush to a **leg** from below; the target is Exposed for one Moment.
**Gate:** ⚖ **untargetable while burrowed.** Flushed by Burn on its square,
sustained heavy noise, or Forest Resin poured on the ground (which also
Clings it). Then it is a 5.
**Colour:** `#6b4a2a`

### A-4 · Spore-Drunk Contestant — mob
A previous season's leftover, mycelium through the lungs. Still wearing the
lanyard. **Continuity: same network as the tutorial's Incineradile.**
**Part:** Body 5.
**Attack:** whatever it is still holding — 2 Crush ⚖.
**Gate:** ⚖ **on death it puffs.** 1-space cloud, **Infected T1** to everything
in it. Killing these badly costs you the floor. Range, fire, or spacing.
**Colour:** `#7a6b45`
**Note for the GM:** they are people, and they are on camera. §17 applies.

### A-5 · Glass-Antler Doe — mob
Skittish, luminous, worth money.
**Part:** Body 5.
**Attack:** none. It flees.
**Gate:** ⚖ **Dodge Threshold 5** (§14). It is a mob that costs *ammo and
Moments*, not HP — and a party that ignores it loses the carve.
**Carve (exception to E-0.4, it is a named quarry):** **Beastbone** + **Tough Hide**
— the only F1 source of the hide the armour band wants.
**Colour:** `#cfe3f0`

### A-6 · Camera Gnat — mob
Corporation kit, not fauna. Hovers at head height and does not blink.
**Part:** Chassis 5.
**Attack:** none.
**Gate:** ⚖ **social, not mechanical.** Destroying one is trivial and costs
Exposure (§17.1) — the crowd is watching through it. Free to kill, expensive
to have killed.
**Colour:** `#c0c0c8`

## Elites — 60 HP

### A-7 · The Rack (Antler-Crowned Stag) — elite
The forest's landlord. It does not charge; it waits, and the wood closes.
**Parts (52):** Crown **8** · Head 9 · Torso 20 · Foreleg L 5 · Foreleg R 5 ·
Hindquarters 5.
**Weak system — the Crown.** ⚖ While the Crown is above 0, every **other** part
regains **1 HP per Clock reset**. Attrition against the body is a losing game
and the party must notice why. Break the Crown (8) and the regrowth stops
permanently.
**Attacks:** gore 3 Bleed to torso; a **1-Clock windup** stomp, 4 Crush to a leg,
which leaves it Exposed for one Moment — the Crown's punish window.
**Carve:** **Beastbone** (guaranteed) + ⚖ **Mistletoe Sprig** ⭐rare, grown in the
crown. *This matters — see E-3.*
**Colour:** `#8b5a2b`

### A-8 · Mycelium Bloomkeeper — elite
The network's gardener. It does not move from its patch, and its patch grows.
**Parts (68):** Bloom-Head 14 · Trunk 28 · Root Cord A 4 · Root Cord B 4 ·
Root Cord C 4 · Fruiting Arm L 7 · Fruiting Arm R 7.
**Gate — surface immunity while tethered.** ⚖ All damage to Bloom-Head and Trunk
is **cosmetic** while any Root Cord lives. The Cords are visible, reachable, and
4 HP each.
**Weak system — the Cords, and each one costs it something.** Cut A: it stops
spreading spores. Cut B: it stops re-rooting (it can no longer move its patch).
Cut C: the Fruiting Arms go limp. At **zero Cords**, damage lands normally.
**Attacks:** spore burst (2-space, Infected T1); an Arm slam, 3 Crush.
**Fire:** ⚖ **fire heals it**, exactly like the Incineradile — the tutorial's
lesson, restated on a creature where the answer is *cutting*, not burning.
**Carve:** **Mycelium-Threaded Hide** — the second source of the Incineradile's
material (already in `seeds/items-materials-f1.js`).
**Colour:** `#a0616a`

---

# Layer B — Easy Route: the grand staircase

Beats (§4.2): a man in the forest by a grand staircase → the descent with him →
he takes a **mask** and is possessed → the party finds the prophecy mural saying
**chain him to the wall** → the dungeon collapses on the way out.

### B-1 · Stair-Wight — mob
The dungeon's previous visitors, still descending.
**Part:** Body 5.
**Attack:** 2 Bleed, grabs at ankles (Slowed).
**Gate:** ⚖ **it reforms.** A Wight put down without Burn, dissolution, or being
scattered down the stairwell **stands back up at the next Clock reset, at 5.**
Teaching mob for "kill it properly, and mind the Clock."
**Colour:** `#5d6a7a`

### B-2 · The Chainbearer — elite
It has held this chain since before the mural was painted. It will not give it
up, and it cannot follow you out of the room.
**Parts (45):** Head 8 · Torso 18 · Arm L 5 · Arm R 5 · Leg L 5 · Leg R 4.
**Weak system — the doorway.** ⚖ It cannot leave the mural chamber. The party
does not have to beat it: the **chain can be worked free in 2 Moments** under
fire, and then they can simply go. Beating it is *allowed* and slower.
**Attacks:** chain sweep, 3 Crush in a 2-hex line; a grapple (§13) that pins
against the mural.
**Carve:** **Sinew Cord** ⚖ + the chain itself (baseline iron — the prophecy's
chain is a story item, not a material).
**Colour:** `#7a7a8c`
**Design note:** the first boss-doctrine lesson of the route, at elite cost —
*the win condition is a position, not a corpse.*

### B-3 · ☠ THE MASKED — boss (125)
The man who found the treasure. He is still in there. That is the problem.

**Parts (125):** **Mask 15** · Head 14 · Torso 45 · Arm L 12 · Arm R 12 ·
Leg L 13 · Leg R 14.

**Gate — the Mask restores him.** ⚖ At every Clock reset, the Mask **returns one
destroyed or disabled part to 1 HP**, in the order it chooses. It is not the man
that is durable.

**The win condition is the chain, not the kill (§21.3).** The prophecy is right.
Chaining him requires the chain (B-2), a pinned or Helpless target, and
**3 Moments** ⚖ of work. *Killing him is possible* — and it costs the campaign
Floors 2 and 3 of this route, because he must be alive and chained at F2 and
must become **Nullrot** at F3. **The GM should not warn them.** The mural
already did.

**The Mask's own weak system — Oathbreaker.** ⚖ The Mask (15) cannot be damaged
by normal harm. **Mistletoe** ignores exactly that (M-1: *"damages creatures
immune or warded against normal harm"*). A party that worked the forest layer
arrives holding the answer; a party that skipped it must chain him the hard way.
See E-3.

**Phases:**
1. **Wearing It** *(opening → 61 total)* — he still speaks, in his own voice,
   and he apologises between attacks. Backhand 3 Crush; a grab that pulls a
   contestant to the mural.
2. **The Mask Speaks** *(≤60 total)* — the voice changes. Gains a **Dissolution
   aura** ⚖: any contestant who ends a Clock adjacent begins Dissolution under the
   2026-08-18 errata (§8.2 — one Clock of grace, then the climbing Hold Threshold).
   **Escalation +1 per Moment** — it is a haunted object, not a god. Leaving the
   aura freezes the threshold where it stands. The room stops being a fight and
   starts being a countdown, and **the GM says the remaining Moments out loud**.
3. **The Collapse** *(≤25 total, **or** the moment the chain is set)* — the
   ceiling starts coming down. **3-Clock** ⚖ timer to be out. Falling stone is
   environmental (§14: never dodged). If the chain is set, he stops fighting and
   watches them leave.

**Carve:** none — he lives, and that is the point. The collapse yields an
**Oak Heartwood** and an **Obsidian Shard** gather ⚖ on the way out.
**Colour:** `#b8a13a`

---

# Layer C — Medium Route: the haunted house

Beats (§4.3): an NPC party is burning a house with a girl inside → killing them
frees her → she is a demon, asks to be fed, and grants a **demonic brand**
(immunity to noble-class presence/Dissolution) plus faction points. The party
**leader survives F1** — he runs the human farm in the capital at F3 (§4.4).

### C-1 · Torchbearer — mob
Rank and file. Human. Frightened, and doing it anyway.
**Part:** Body 5.
**Attack:** torch, 2 Burn; or a tool, 2 Crush.
**Gate:** none — and that is the encounter's whole weight. They die in one hit,
they are people, and the cameras are running (§17).
**Colour:** `#c25b2a`

### C-2 · The Kindler — elite
Carries the fuel. Enjoys the work.
**Parts (48):** Head 8 · Torso 18 · Arm L 5 · Arm R 5 · Leg L 4 · Leg R 4 ·
**Fuel Can (worn) 4**.
**Weak system — he is his own liability.** ⚖ The Fuel Can is a targetable worn
part at 4 HP. **Burn 5 on the Can** detonates it: **3-space radius, 2 Burn** —
the Incineradile's trash-can rule, on a person who chose to carry it. The party
does not have to out-damage him; they have to *light him*.
**Attacks:** thrown fire, 3 Burn in a 2-space splash; sets terrain alight
(§21.4 — flammable ground).
**Carve:** **Forest Resin** ⚖ (what he thickened the fuel with).
**Colour:** `#e07b2a`

### C-3 · ☠ Foreman Bex — boss (125) ⚖ NAME IS A PROPOSAL
The NPC party's leader. Reasonable, articulate, and burning a house with a child
in it. **He must survive this floor** — he is the F3 human-farm operator.
*The name is mine, not the owner's; it needs blessing before it enters the
library, because it becomes canon at F3.*

**Parts (110):** Head 12 · Torso 40 · Arm L 10 · Arm R 10 · Leg L 11 · Leg R 11 ·
**Pack 16**.

**The win condition is the house, not the man (§21.3).** ⚖ Three ways this ends,
and **all three are wins**:
- the fire is put out, or
- the girl is out of the house, or
- his HP total drops to **≤40**.

On any of them he **disengages** — he takes the surviving Torchbearers and goes,
covering the retreat. **He cannot be killed on this floor** ⚖; if the party
somehow corners him, the fire takes the front of the house and he is gone in the
smoke. If that reads as a cheat at the table, the honest fix is to make the
smoke visible early, not to change the ruling.

**Phases:**
1. **The Burning** *(opening → 81)* — he directs; the Torchbearers work. He
   fights defensively and talks the entire time. He will negotiate. He is lying.
2. **Ugly Work** *(≤80)* — he stops directing and starts fighting. 4 Crush,
   two attacks a Clock ⚖; drags a contestant into the burning doorway.
3. **Cut and Run** *(≤40, or fire out, or girl out)* — disengage. The **Pack**
   comes off if it was destroyed — it holds the **ledger** (F3 hook).

**Carve:** none — human. **Yields:** the **ledger** from the Pack if it was
brought to 0, which names the buyers. This is the only F1 way to reach F3's farm
already knowing what it is. ⚖
**Colour:** `#a03a3a`

### C-4 · The Girl in the House — boss (125) ✅ **RULED 2026-08-18**
She is what the NPCs were right about. She is also a child in a burning house, and
both are true.

**Parts (140):** Head 16 · Torso 50 · Arm L 13 · Arm R 13 · Leg L 14 · Leg R 14 ·
**Shadow 20** · **Size: Small**

**She can be killed.** The 125 is real, there is no gate and no special weak
system. She is a demon in a burning house and she can be put down. **What it costs
is the floor above.**

**The chain, if she dies:**

1. **The throne empties.** She was the *director*. Her god collapses with her — no
   queen, no congregation, no prayers.
2. **Beelzebub takes the vacancy, and he uses the rival.** The demon who helped
   humans and wanted to overthrow her is exactly the useful shape: already
   positioned, already ambitious, already trusted by the humans he protected. **He
   does not know whose instrument he has become**, and neither does the party.
3. **The demons who did not bend the knee are just rampaging monsters.**
   Leaderless, agenda-less, pure threat. This is *why* the rampage gets worse
   rather than better — it is a schism, not an absence.
4. **F2 flips.** The assassination beat still happens, but the rival is now
   Beelzebub's **viceroy** rather than a rebel — the party is either killing his
   man, or being hired by him and not told by whom.
5. **F3: Bex runs the farm under Beelzebub's watching eye, and that is the only
   reason it is still intact.** The humans inside are alive because they are useful
   to a Prince of Demons; the ones outside are hunted in the dark by the unbent.
   The farm stops being an atrocity and becomes **protection, sold at a price** —
   and Foreman Bex's ledger is a Beelzebub document he may not know he is keeping.

**Sparing her** is the other bill: the brand's price, and a demonic queen at F2 —
but the rival stays a real rebel, and Beelzebub never gets a foot in the capital.
**Neither option is safe, and the party will not learn that until Floor 3.**

**Her F1 role is still the brand.** She asks to be fed; she grants the demonic
brand (immunity to noble-class presence/Dissolution — what the F2 Demonic Noble
encounter is built around) plus faction points.

**Presence:** noble-class. An **unbranded** contestant who refuses her, in the
room, begins Dissolution (§8.2). **Escalation +2 per Moment** — she is noble-class,
and at F2 she is a queen. Half the Moments of a haunted object. Say the number out
loud.
**Colour:** `#6a2a6a`

---

# Layer D — Hard Route: the moving city

Beats (§4.4): a moving city atop giant stairs, guarded by a **Loong Kin** → the party must
persuade it that **staying in the city will lead to nothing.** It is escorted through the desert
at F2 and hides in the capital at F3 — **it survives, and it must.**

### 🔒 The encounter shape ✅ RULED 2026-08-25 — *supersedes the earlier reading*

⚠️ **The giant stairs are the ENTRANCE, nothing more.** They are how the party reaches the city
and they carry no part of the quest. **Nobody carries anything up them.** An earlier draft of
this layer described "a crystallized citizen carried up the stairs" as the argument; that is
**withdrawn.**

| | |
|---|---|
| **Where it is** | 🔒 **The Loong has taken the CITY HALL as its nest**, and looms over the city from it |
| **What the party does** | 🔒 **Runs through the streets**, conversing with it as they go — the whole encounter is **traversal under threat** |
| **The pressure** | It can kill them at any moment and they know it. **The conversation happens while they are trying not to die** |
| **The argument** | 🔒 **"Staying here will lead to nothing."** A **futility** argument, not a body count |

⭐ **The change of argument matters downstream.** The party is not proving *everyone is dead* —
they are proving *there is nothing left here for you.* That is a claim about the **future**, not
a census, and it is why the truth-sense lets it pass: **it is simply true.**

⚙️ **And it means F2 does not contradict F1.** When the Loong reaches a village of survivors
(F2-2b), the party was not wrong and was not incomplete. **They were right** — there was nothing
left in the city for it. What it should have been guarding had already walked out, and the
reward for being right is finding out where the duty went.

### D-1 · Crystallized Citizen — mob
`#9ad4e0` · **Size: Medium** · They are still standing where they stopped. Some are
mid-sentence, and **all of them are facing the same way** — toward wherever the mist
was.

| | |
|---|---|
| **Parts** | Body **5** |
| **Attack** | 2 Crush — slow, and it will follow you across the whole floor |
| **Gate** | ⚖ **Bleed does nothing** — there is nothing left in it to bleed. **Crush only.** Burn and Chill are cosmetic; Poison and Infection have no entry condition (§8.2) |
| **Carve** | Room gather: **Obsidian Shard** ⭐ ⚖ — and taking it is looting a person |

**It is a host, not scenery.** The crystal is a disease and this is what it built. It
is not finished with them, and **contact spreads** (D-1b). **Breaking it is the cure**
— and it is also killing a person who is still in there. That is the floor's whole
argument, and the party has to make it with their hands before they make it out loud
to the Loong.

The Crush-only gate is no longer a puzzle. **The only thing that works is the thing
that shatters them.**

**GM note:** these are the citizens the Loong is guarding. Every one the party breaks
is evidence for the argument they're about to make — *and* a thing they did to a
person. Don't editorialise; just keep count where they can see it.

### D-1b · Crystal Spore Mist — mob ✅ **new 2026-08-18**
`#bfe9f5` · **Size: Large** · A twinkling mist. It is genuinely beautiful, it drifts
toward warmth, and it is **the single most dangerous thing on Floor 1**.

| | |
|---|---|
| **Parts** | Mist **5** |
| **Gate** | ⚖ **Immune to single-target damage.** Cones, lines, area and wind move it; a sword does nothing. Burn disperses a 2-space pocket for one Clock |
| **Carve** | None. Don't let anyone bottle it — if they try, that's a story, not a loot roll |

**It tempts, and there is no roll.** It glitters like a find. The party walks toward
it or they don't — that's a choice, not a save, and GPT doesn't roll to hit anyway.
**Every crystallized citizen on this floor walked toward it.** Their poses say so, and
a party that looks will notice they're all facing the same way.

**Two exposure routes, and they are not the same** (E-0.6):

- **Contact** → **Infected T1** on that **part**, advancing per §8.1. Localised,
  visible, breakable off a limb.
- **Inhalation** → **Infected T1 *plus* Suffocation** (§8.2 — torso only, tierless
  2-Clock death timer). **This one is deadly immediately.**

Counterplay is E-6, and it mostly already exists: **Forest Resin** for contact, a
respirator for the air, **Antiseptic Wash** for the tiers, and **Burn T2** clears
infection outright if they're willing to do that to a limb.


### D-2 · Step-Warden — elite
An ambulatory section of staircase. The city built its own guards out of itself.
**Parts (78):** Crown Block 16 · Body Mass 34 · **Keystone 6** ·
Leg Column L 8 · Leg Column R 8.
**Gate — surface immunity.** ⚖ Damage to Crown Block and Body Mass is cosmetic.
It is masonry.
**Weak system — the Keystone, in its back.** 6 HP, and unreachable while it
faces you. It is exposed **only during its stomp** — a 1-Clock windup, 5 Crush in
a 2-space square, after which it is **Exposed for one Moment** (§11) and the
Keystone is reachable. Bait it, get behind it, or have someone tall.
**Carve:** **Obsidian Shard** ⭐ (guaranteed, from the Keystone).
**Colour:** `#7a8fa0`

### D-3 · ☠☠ LOONG KIN — SUPER BOSS (300) ⚖ · **two forms**
It has guarded a city that has been empty for a very long time. Nobody has told
it. It is not stupid; it is *loyal*, which is worse.

| Form | What it is | Size |
|---|---|---|
| **Warden Form** | a woman, **2.5 m**, towering over everyone in the room | **Large** |
| **Loong Form** | buildings — hundreds of metres, and it does not obviously end | **Huge** |

The `size` field carries **Huge**, because that is the form the combat rules read.
The 300-point statline below **is the Loong Form**.

**Parts (300):** Head 30 · Neck 25 · Body Coil (fore) 55 · Body Coil (mid) 55 ·
Body Coil (rear) 45 · Foreclaw L 20 · Foreclaw R 20 · **Whiskers 10** · Tail 40.

#### The size difference is the trap, and it falls straight out of the book

Warden Form is **Large** — exactly **one** size larger than a Medium contestant —
so **§13 makes grappling her legal**. Loong Form is **Huge**, two sizes larger, so
it cannot be grappled at all, and §21.3 makes it immune to grapple-Suffocation
besides.

**You can lay hands on the woman. You cannot lay hands on the dragon. Doing the
first causes the second.** Don't warn them; let the size line do the work.

**Warden Form has no separate HP pool.** The first meaningful wound — or any
grapple — triggers the Turn, and the Loong enters at a **full 300**. There is no
cheap window and no chip damage: hitting her is strictly worse than not.

**THE WIN CONDITION IS THE CONVERSATION.** ⚖ The statline exists so "let's just
fight it" is legible as a bad idea **from the numbers**. Per §21.3 the position
that makes a killing hit possible is, here, a sentence: 🔒 ***staying here will lead to
nothing.*** ⚠️ **Corrected 2026-08-25** — the argument is **futility, not evidence**, and the
earlier "carry a crystallized citizen up the stairs" version is withdrawn. The crystallised
streets the party is running through **are** the evidence; nobody has to haul it anywhere.
Charm helps; **being right is what lands.**

**The truth-sense is the tell, and it runs in both forms** ⚖ — the Whiskers (10)
are only where you can *see* it. It reads truth at close range. A party that
notices can work out that it **cannot be lied to**, which is why the honest
argument is the only one that works, and why attacking the Whiskers to "blind" it
is the worst move available.

**It survives.** Escorted at F2, hides in the capital at F3. If the party kills it,
that route ends at F1 and they should be told at the table what they just spent.

**Phases**

| # | Name | Trigger | What happens |
|---|---|---|---|
| 0 | **Warden Form** | the encounter opens here | A woman, 2.5 m, and she has to look down at everyone. **Large — grappleable.** Polite, patient, and patient for a very long time. This is the whole encounter if the party is any good: make the argument, bring the evidence, **never touch her** |
| 1 | **The Turn** | first meaningful wound, **or** any grapple, **or** the argument fails | She unfolds. Hundreds of metres of her, the far end somewhere out past the stairs. **Huge — no longer grappleable.** Enters at a full 300. It does not retaliate on the first Clock; it coils, and it says so. **That Clock is the last exit** |
| 2 | **The Coil** | ≤240 | Constriction. 6 Crush, and it repositions the fight onto the stairs where falling applies (§21.5) |
| 3 | **Storm-Breath** | ≤150 | 10-hex line ⚖, 6 Chill, difficult terrain. **Dodge Threshold 7** with the §14 ladder: Reflexes 7 → auto-dodge + 1 space · Reflexes 9 → auto-dodge + counterattack · below 7 → 1d4 |
| 4 | **It Decides You Are Not Contestants** | ≤60 | It stops treating the fight as an interruption. **A TPK is expected and the GM should say so out loud when this phase opens** ⚖. Retreat is still open; the stairs are long, and it is longer |

**Carve: NONE.** Loong-Scale is **shed, not taken** (M-5 — APEX/DIVINE,
authored-only, never pooled, never sold). ⚖ **If it is persuaded, it sheds one
scale**, freely, as thanks. That is the only way that material enters the world.
**Colour:** `#2a8f7a`

---

## E-3 — The one thing this pass actually rewards

**Mistletoe is the Easy route's answer, and it grows in the forest.**

The Rack (A-7) is optional content in the shared layer. It carves **Mistletoe
Sprig** ⭐, whose inherent effect is *Oathbreaker — damages creatures immune or
warded against normal harm* (M-1). THE MASKED's Mask (B-3) is warded against
normal harm.

A party that explored the forest walks into the boss room holding the answer to
a gate they have not seen yet. A party that beelined does not, and has to chain
him the hard way — which is still winnable, and is the intended baseline. **The
reward for exploration is a shortcut, never the only key.**

This is the shape worth repeating on F2 and F3: the shared layer sells the tool,
the route stack has the lock, and neither one tells you.

---

## E-6 — Safety measures (because the mist earns them)

Inhaling crystal is the deadliest thing on Floor 1, so the counterplay has to be real
and reachable. **Almost all of it already exists** — this pass makes existing kit
load-bearing rather than inventing a new answer:

| Measure | Covers | Status |
|---|---|---|
| **Sealed respirator** ⚖ | inhalation only — **not** contact | new; wants a Batch-A-style template |
| **Forest Resin** smeared on skin and gear ⚖ | contact — the crystal grips the resin and peels off with it, one coat per exposure | **already an F1 material** (M-1) and already a consumable ingredient |
| **Antiseptic Wash** | −1 Infected tier per use, 2 uses | **already seeded** (Batch A) |
| **Burn T2** | *clears infection outright* (§8.2) | **already in the book.** Cauterising a crystallising limb works, and it is exactly as ugly as it sounds |

The shape to keep: **the forest sells the answer to the floor's worst thing**, the same
way The Rack sells the Mistletoe that answers THE MASKED (E-3). A party that gathered
resin walks in protected. A party that didn't has Burn T2 and a hard choice.

⚖ Only the respirator is genuinely new. If you'd rather it not exist, Resin plus Burn
is already a complete answer — the respirator only makes it *comfortable*.

---

## E-4 — What this pass does NOT cover (the backlog)

| Item | Note |
|---|---|
| **Encounter tables / room counts** | This is a roster, not a dungeon. How many Bramblewretches per room, and how many rooms, is unwritten |
| **F1 terrain blocks** | §21.4 wants three answers per terrain. The forest, the stairwell, the burning house and the moving city all need one; none is written |
| **Exposure/viewer values per enemy** | §17 pays out for spectacle. No enemy below carries a viewer number |
| **Token/loot payouts** | §19.1 currencies and §17.6 box drops per rank are not assigned |
| ~~Foreman Bex's name~~ | **BLESSED 2026-08-18** |
| ~~The Girl's F1 fightability~~ | **RULED 2026-08-18** — killable; the cost is the Beelzebub chain (C-4) |
| **Level budget** | 🟡 now drafted at [`level-budget.md`](level-budget.md) — **still the calibration dependency for every number in this document.** L-6 checks the F1 ladder against it and the F1 numbers hold |
| ~~Infected T3 = statue?~~ | **RULED 2026-08-18** — T3 kills normally; the statue idea is dropped, and the crystal needs no rules exception |
| ~~The respirator template~~ | **DONE 2026-08-25** — `server/seeds/items-safety.js`: Cloth Filter Mask (Crude) · **Sealed Respirator** (Quality) · Reservoir Seal (Superior, the F3 answer) · Resin Coat. All four answer **inhalation only**; contact stays the player's problem |
| ~~Nullrot's direction of causality~~ | **RULED 2026-08-18** — he is **both**. Open follow-on: the F1 timeline (does the mask carry it?) — see E-0.6 |
| ~~Horde counts for later floors~~ | **DONE 2026-08-18** — [`enemy-scaling.md`](enemy-scaling.md) S-2: ~12 × 2^(N−S), and how to run a tide as one entity with a count |
| ~~Requirements on F1 loot~~ | **DONE 2026-08-25** — every F1 material in `seeds/items-materials-f1.js` now names a requirement that rides into whatever it is crafted into. **Mistletoe asks Charm 8** — the first item in the game to break §12.1's old ceiling of 5, and the proof L-14 is real |
| **F2/F3 rosters** | The *frame* now exists ([`enemy-scaling.md`](enemy-scaling.md) S-1/S-3 — damage bands and an authoring checklist); the rosters do not |
| **Lotus Root has no enemy source** | Correct as written — M-1 lists it as a gather ingredient, not a carve. Noted so it is not mistaken for an omission |
| **`legendary` → `superboss`** | The model enum disagrees with §21.1's vocabulary. App work, not content work |

---

## E-5 — Seeding runbook

From `server/`, mirroring the item/affix runbooks:

```
node backup-db.js                          # EJSON dump of every collection
node seed-enemies.js                       # DRY RUN — prints every create/diff
node seed-enemies.js --apply               # create missing enemies
node seed-enemies.js --apply --force       # also overwrite differing existing ones
node seed-enemies.js --file ./seeds/enemies-f2.js   # a later batch
```

Matching is by **name, case-insensitive**. Existing enemies are never touched
without `--force` — owner edits win. Restore with
`node restore-db.js backups/backup-<ts> --apply`.

---

## E-5b — ⚠️ Seed against Atlas

Every `server/` script defaults to `mongodb://localhost:27017/galactic-prime-time` when
`MONGODB_URI` is unset. **A runbook run without it seeds a local dev database and prints
success.** Export the Atlas string for the shell, or prefix every command:

```bash
export MONGODB_URI="mongodb+srv://…/galactic-prime-time"   # once per shell
```

`docs/deploy-render-atlas.md` is the source: *"any `server/` script honors `MONGODB_URI` —
run them from your machine with the Atlas string."*

---

## E-7 — The signature-damage gate ✅ **RULED 2026-09-01**

`Enemy.signature` shipped 2026-08-25 — a structured `{ floor, damage, type, exception, note }`
so `seed-enemies.js` gates DAMAGE the way it already gates HP. It is **optional by design**:
an entry with no signature is skipped, so F2/F3 keep passing while they migrate.

**F1 is migrated — 14 of 19 entries carry a signature and all pass.** The two named
off-band shapes both have live examples now: the **Step-Warden's** telegraphed 10 (windup,
capped at 2× band so "telegraphed" cannot mean "arbitrary") and the **Husk-Moth's** 2 per
Moment (tick, floored at 0.2× band so it cannot be a rounding error).

Five entries carry no signature. Three are correct — **Glass-Antler Doe**, **Camera Gnat**
and **Crystal Spore Mist** deal no direct damage; the Mist applies a condition, which is the
whole point of it. **Two want your call:**

| Entry | Issue |
|---|---|
| **THE MASKED** (boss) | His backhand reads **6 Crush**; the F1 boss band is **8**. Off-band, and not one of the two exceptions. Either the number rises to 8, or — my read — **his signature is the Dissolution aura, not the backhand**, and a boss whose threat is a countdown legitimately punches below band. If so it wants a third exception word (`aura`?) rather than a silent pass |
| **The Girl in the House — Vermilia** (boss) | She has **no damage number at all**, and I think that is correct: her threat is noble-class presence and the Dissolution escalation at +2/Moment. But it means a 140-budget boss can be authored with no attack and the gate will not notice |

Both are the gate doing its job on its first run — it found two places where the roster and
the band disagree, and neither is a typo.

---

### ✅ RULED 2026-09-01 — both are correct as designed, and they are DIFFERENT shapes

> **Owner:** *"punches low, vermillia does not attack, she just supresses her disillusionment
> if they are past f1, otherwise its just disillusionment on F1. I think we can have vermillia
> still pick to afflict disillusionment on the players even with the brand if she so decides.
> it protects them from others."*

⚠️ **My E-7 read said "a third exception word." It is two** — *punches low* and *does not
attack* are not the same claim and must not collapse into one tolerance.

| New word | Range | What it asserts |
|---|---|---|
| **`aura`** | **0.5× – 1.0× band** | The strike is **not where the threat is**, so it legitimately reads under band. 🔒 **Floored at 0.5×** so `aura` can never excuse a token number — a boss still has to hurt when it connects. **THE MASKED: 6 against a boss band of 8** (0.75×) |
| **`presence`** | **damage must be 0**, note **required** | **No attack at all.** 🔴 This is the one exception the gate treats as a **positive claim** rather than a tolerance, and it is what closes E-7's actual hole: without it, *"a 140-budget boss can be authored with no attack and the gate will not notice."* Now it notices, and it makes you say what the threat is instead |

⭐ **The distinction earns its keep because the two floors encode different promises.** A
`tick` is small because it repeats (0.2×). An `aura` strike does **not** repeat — it is simply
not the danger — so it is held to a much higher floor. Same direction, different reason.

**THE MASKED** — `{ floor: 1, damage: 6, type: 'Crush', exception: 'aura' }`. His phase-1
backhand. The countdown is the phase-2 Dissolution aura at +1/Moment, and **a boss whose win
condition is a timer does not need a boss-band punch.**

**Vermilia** — `{ floor: 1, damage: 0, exception: 'presence' }`. **She never swings.**

### ✅ RULED — her aura is a CHOICE, and afflicting a branded party is PROTECTION

| When | What she does |
|---|---|
| **F1** | 🔒 **It is simply on.** A child in a burning house with nothing to hide behind and no practice at holding it in. An unbranded contestant who refuses her begins Dissolution at **+2/Moment**, exactly as written above |
| **Past F1** | 🔒 **She suppresses it.** Two centuries and a court later she does not leak on people she is talking to — ⭐ **which is why the F3 audience is a conversation and not a countdown.** The scene the whole Medium route pays for cannot be a hazard |
| **Either way** | 🔒 **She may still choose to afflict it — brand or no brand.** The brand is her *permission*, not a wall she cannot reach through |

⭐ **And when she does it to a branded party it is PROTECTION.** A human trailing noble-class
Dissolution is **visibly claimed**, and other demons read exactly whose claim it is and keep
their distance. 🔴 **It will not feel like a gift while it is happening** — which is the point:
the safest thing she can do for them is indistinguishable from an attack, and she does not
explain. *(My reading of "it protects them from others" — the affliction is the protection, not
the brand. If you meant the brand, say so and I will swap it; the brand's access role is
already canon either way.)*

⚙️ **Built the same day:** both words are in `models/Enemy.js`, gated in `seed-enemies.js`,
selectable in `admin/EnemiesSection.jsx`, and covered by **7 new checks** in
`test-seed-enemies.js` (81 pass · 0 fail). **F1 is now 16 of 19 migrated** — the three
remaining carry no signature correctly (Glass-Antler Doe, Camera Gnat, Crystal Spore Mist deal
no direct damage).
