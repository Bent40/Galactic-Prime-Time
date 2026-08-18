# Floor 1 — The Enemy Pass (PROPOSAL)

**Date:** 2026-08-18 · **Status:** 🟡 PROPOSAL — awaiting owner blessing.
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

## E-0 — The four rulings this pass needs before it can be seeded

These are the load-bearing interpretation calls. Bless, amend, or reject each.

### E-0.1 ⚖ The rank number is a **part budget**, not a pooled bar

§21.2 gives F1 as mob ~5 · elite ~60 · boss ~125 · super ~300. But §7.3 resolves
damage **per part**, and §7.5 kills on head/torso at 0 — there is no pooled bar
on a player, and the `Enemy` model stores `bodyParts[]`, not a total.

**Proposed:** the rank number is the **sum of the enemy's part HP**. It is a
budget you distribute; the lethal parts carry the bulk. The Incineradile's
"single HP bar (total 50)" stays valid as a *tutorial-boss* exception — it
predates the doctrine and it is a puppet, which is why it has one bar.

### E-0.2 ⚖ **Mobs are statted as ONE part**

A mob is a horde member. Give it a single part at **5 HP** and nothing else: no
head, no limbs, no targeting minigame. One on-band F1 hit removes it. This is
not a shortcut — it *is* the doctrine ("die in one meaningful blow"), and it
makes the admin panel usable at table speed: one number, then delete the row.

**Corollary — the number is the doctrine, not a dial.** Every F1 mob below is
exactly 5. A mob that needs to survive a hit gets a **gate** (E-0.3), never a 6.

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

**Vocabulary bridge (not a ruling, just a note):** §21.1 calls the fourth rank
**Super Boss**; the admin UI's tier list predates that and calls it
`legendary`. The seed file uses `legendary` because that is what the model
accepts. Renaming the enum is app work, out of scope here.

---

## E-1 — The F1 ladder, worked

Band: **F1 Forest ×2**. An on-band F1 weapon swings for roughly **4–6**.

| Rank | Budget ⚖ | Reads as | Layout shape |
|---|---|---|---|
| **Mob** | **5** | one on-band hit | 1 part |
| **Elite** | **60** (×12) | ~5 torso hits, plus its gate | 6–7 parts, torso ~24 |
| **Boss** | **125** (×25) | a real fight with a discovery in it | 7 parts, torso ~45 |
| **Super** | **300** (×60) | *do not* | 9 parts, no single part under 10 |

**Sizes as assigned** ⚖ — Small: Camera Gnat, the Girl · Large: Husk-Moth Cloud,
The Rack, Mycelium Bloomkeeper, The Chainbearer, **the Loong's Warden Form** ·
Huge: Step-Warden, **the Loong's Loong Form** · everything else Medium.

Standard elite layout ⚖: Head 10 · Torso 24 · Arms 6/6 · Legs 7/7 = 60.
Standard boss layout ⚖: Head 14 · Torso 45 · Arms 12/12 · Legs 13/13 + one
signature part 16 = 125.

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
| **D — Hard: the moving city** | 1 mob · 1 elite · 1 super | Hard only |

**18 entries total.** Every party meets 8 of them; the route adds 3–4.

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
**Parts (60):** Crown **8** · Head 10 · Torso 24 · Foreleg L 6 · Foreleg R 6 ·
Hindquarters 6.
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
**Parts (60):** Bloom-Head 12 · Trunk 24 · Root Cord A 4 · Root Cord B 4 ·
Root Cord C 4 · Fruiting Arm L 6 · Fruiting Arm R 6.
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
**Parts (60):** Head 10 · Torso 24 · Arm L 6 · Arm R 6 · Leg L 7 · Leg R 7.
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
**Parts (60):** Head 10 · Torso 22 · Arm L 6 · Arm R 6 · Leg L 6 · Leg R 6 ·
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

**Parts (125):** Head 14 · Torso 45 · Arm L 12 · Arm R 12 · Leg L 13 · Leg R 13 ·
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

**Parts (125):** Head 14 · Torso 45 · Arm L 12 · Arm R 12 · Leg L 13 · Leg R 13 ·
**Shadow 16** · **Size: Small**

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

Beats (§4.4): a moving city atop giant stairs, guarded mindlessly by a **Loong
Kin** → the party must persuade it that the city is abandoned and its citizens
crystallized. It is escorted through the desert at F2 and hides in the capital
at F3 — **it survives, and it must.**

### D-1 · Crystallized Citizen — mob
They are still standing where they stopped. Some are mid-sentence.
**Part:** Body 5.
**Attack:** 2 Crush, slow, and it will follow you across the whole floor.
**Gate:** ⚖ **Bleed does nothing** — there is no blood in it. **Crush only**
(Burn and Chill are cosmetic; Poison and Infection have no entry condition per
§8.2). The party's Bleed-heavy F1 kit is suddenly the wrong kit. Teaching mob
for damage-type gates.
**Carve (room gather, per E-0.4):** **Obsidian Shard** ⭐ ⚖ — the crystal is
close enough to work.
**Colour:** `#9ad4e0`
**Note for the GM:** these are the citizens the Loong is guarding. Every one the
party breaks is evidence for the argument they are about to make — and a thing
they did to a person. Do not editorialise; just keep count where they can see it.

### D-2 · Step-Warden — elite
An ambulatory section of staircase. The city built its own guards out of itself.
**Parts (60):** Crown Block 12 · Body Mass 26 · **Keystone 6** ·
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
that makes a killing hit possible is, here, a sentence: *the city is abandoned, and
its citizens are the crystal.* Evidence beats rhetoric — a crystallized citizen
carried up the stairs is the argument. Charm helps; **proof is what lands.**

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

## E-4 — What this pass does NOT cover (the backlog)

| Item | Note |
|---|---|
| **Encounter tables / room counts** | This is a roster, not a dungeon. How many Bramblewretches per room, and how many rooms, is unwritten |
| **F1 terrain blocks** | §21.4 wants three answers per terrain. The forest, the stairwell, the burning house and the moving city all need one; none is written |
| **Exposure/viewer values per enemy** | §17 pays out for spectacle. No enemy below carries a viewer number |
| **Token/loot payouts** | §19.1 currencies and §17.6 box drops per rank are not assigned |
| ~~Foreman Bex's name~~ | **BLESSED 2026-08-18** |
| ~~The Girl's F1 fightability~~ | **RULED 2026-08-18** — killable; the cost is the Beelzebub chain (C-4) |
| **Level budget per route / per combat** | ⚖ **Upstream of everything here.** These statlines assume roughly the level-6 party. Until the progression curve is planned, every number is calibrated against a guess |
| **F2/F3 rosters** | The bands exist (M-2 ×4, M-3 ×8) but are sketches; the rosters do not |
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
