/**
 * Floor 1 — the enemy roster. PROPOSAL, per rulebook/f1-enemy-pass.md.
 * Seed via: node seed-enemies.js            (dry run)
 *           node seed-enemies.js --apply
 *
 * Doctrine (rulebook §21.2, materials catalog M-1, F1 Forest band ×2):
 *   mob 5 · elite 60 · boss 125 · super 300 — as a PART BUDGET, not a pooled
 *   bar (f1-enemy-pass E-0.1). Mobs are ONE part at 5 (E-0.2). Anything that
 *   survives a hit does it through a GATE written into `notes`, never a fatter
 *   bar (E-0.3).
 *
 * `tier` uses the model's enum: mob | elite | boss | legendary.
 * §21.1 calls the fourth rank "Super Boss"; the model says `legendary`.
 */

// Mob: one part, 5 HP, no phases. The shape IS the doctrine.
const MOB = (name, { part = 'Body', ...o }) => ({
  tier: 'mob', name, phases: [],
  bodyParts: [{ name: part, maxHp: 5 }],
  ...o,
});

const E = (tier) => (name, o) => ({ tier, name, phases: [], ...o });
const ELITE = E('elite');
const BOSS  = E('boss');
const SUPER = E('legendary');

module.exports = [

  // ───────── Layer A — The Forest (shared, all routes) ─────────

  MOB('Bramblewretch', {
    part: 'Bramble Body',
    color: '#4a7a3a',
    description: 'A bundle of thorn-scrub that stood up. Appears 4-8 at a time and moves in straight lines.',
    notes: [
      'HORDE. 2 Bleed on contact. Moves in a straight line and does not turn well.',
      'GATE: none — this is the plain horde, the one the party learns cones on.',
      'Carve: none individually (E-0.4); a cleared room yields one F1 gather roll.',
    ].join('\n'),
  }),

  MOB('Husk-Moth Cloud', {
    part: 'Cloud',
    color: '#8a8fa8',
    description: 'Statted and counted as ONE body, not a swarm of bodies. Blocks vision through its space.',
    notes: [
      '1 Chill to a random part per Moment in contact.',
      'GATE: immune to single-target damage. A sword through a cloud does nothing —',
      'cones, lines, area effects and Burn are the answer.',
      'This is the teaching mob for §21.2 "mob fights are about the crowd".',
    ].join('\n'),
  }),

  MOB('Rootjaw', {
    part: 'Rootjaw',
    color: '#6b4a2a',
    description: 'Buried ambusher. Never seen before it bites.',
    notes: [
      '2 Crush to a LEG from below; the target is Exposed for one Moment.',
      'GATE: untargetable while burrowed. Flushed by Burn on its square, sustained',
      'heavy noise, or Forest Resin poured on the ground (which also Clings it).',
      'Once surfaced it is simply a 5.',
    ].join('\n'),
  }),

  MOB('Spore-Drunk Contestant', {
    part: 'Body',
    color: '#7a6b45',
    description: 'A previous season\'s leftover, mycelium through the lungs. Still wearing the lanyard. Same network as the tutorial\'s Incineradile.',
    notes: [
      'Attacks with whatever it is still holding — 2 Crush.',
      'GATE: on death it puffs. 1-space cloud, Infected T1 to everything in it.',
      'Killing these badly costs you the floor. Range, fire, or spacing.',
      'GM: they are people, and they are on camera. §17 applies.',
    ].join('\n'),
  }),

  MOB('Glass-Antler Doe', {
    part: 'Body',
    color: '#cfe3f0',
    description: 'Skittish, luminous, worth money. It does not attack — it flees.',
    notes: [
      'GATE: Dodge Threshold 5 (§14). A mob that costs ammo and Moments, not HP.',
      'CARVE: Beastbone + Tough Hide (named quarry — the E-0.4 exception).',
    ].join('\n'),
  }),

  MOB('Camera Gnat', {
    part: 'Chassis',
    color: '#c0c0c8',
    description: 'Corporation kit, not fauna. Hovers at head height and does not blink. No attack.',
    notes: [
      'GATE: social, not mechanical. Destroying one is trivial and costs Exposure',
      '(§17.1) — the crowd is watching through it. Free to kill, expensive to have killed.',
    ].join('\n'),
  }),

  ELITE('The Rack', {
    color: '#8b5a2b',
    description: 'Antler-crowned stag. The forest\'s landlord. It does not charge; it waits, and the wood closes.',
    bodyParts: [
      { name: 'Crown',         maxHp: 8 },
      { name: 'Head',          maxHp: 10 },
      { name: 'Torso',         maxHp: 24 },
      { name: 'Foreleg L',     maxHp: 6 },
      { name: 'Foreleg R',     maxHp: 6 },
      { name: 'Hindquarters',  maxHp: 6 },
    ],
    notes: [
      'WEAK SYSTEM — the Crown. While the Crown is above 0, every OTHER part regains',
      '1 HP per Clock reset. Attrition against the body is a losing game and the party',
      'must notice why. Break the Crown (8) and the regrowth stops permanently.',
      '',
      'Attacks: gore 3 Bleed to torso. A 1-Clock windup stomp, 4 Crush to a leg, which',
      'leaves it Exposed for one Moment — that is the Crown\'s punish window.',
      '',
      'CARVE: Beastbone (guaranteed) + Mistletoe Sprig (rare, grown in the crown).',
      'The Mistletoe is the Easy route\'s answer to THE MASKED — see f1-enemy-pass E-3.',
    ].join('\n'),
  }),

  ELITE('Mycelium Bloomkeeper', {
    color: '#a0616a',
    description: 'The network\'s gardener. It does not move from its patch, and its patch grows.',
    bodyParts: [
      { name: 'Bloom-Head',    maxHp: 12 },
      { name: 'Trunk',         maxHp: 24 },
      { name: 'Root Cord A',   maxHp: 4 },
      { name: 'Root Cord B',   maxHp: 4 },
      { name: 'Root Cord C',   maxHp: 4 },
      { name: 'Fruiting Arm L', maxHp: 6 },
      { name: 'Fruiting Arm R', maxHp: 6 },
    ],
    notes: [
      'GATE — surface immunity while tethered. All damage to Bloom-Head and Trunk is',
      'COSMETIC while any Root Cord lives. The Cords are visible, reachable, 4 HP each.',
      '',
      'WEAK SYSTEM — the Cords, and each one costs it something:',
      '  Cut A: it stops spreading spores.',
      '  Cut B: it stops re-rooting (it can no longer move its patch).',
      '  Cut C: the Fruiting Arms go limp.',
      'At ZERO Cords, damage lands normally.',
      '',
      'Attacks: spore burst (2-space, Infected T1); an Arm slam, 3 Crush.',
      'FIRE HEALS IT — exactly like the Incineradile. The tutorial\'s lesson restated',
      'on a creature where the answer is cutting, not burning.',
      '',
      'CARVE: Mycelium-Threaded Hide (second source of the Incineradile material).',
    ].join('\n'),
  }),

  // ───────── Layer B — Easy Route: the grand staircase ─────────

  MOB('Stair-Wight', {
    part: 'Body',
    color: '#5d6a7a',
    description: 'EASY ROUTE. The dungeon\'s previous visitors, still descending.',
    notes: [
      '2 Bleed, grabs at ankles (Slowed).',
      'GATE: it reforms. A Wight put down without Burn, dissolution, or being scattered',
      'down the stairwell stands back up at the next Clock reset, at 5.',
      'Teaching mob for "kill it properly, and mind the Clock".',
    ].join('\n'),
  }),

  ELITE('The Chainbearer', {
    color: '#7a7a8c',
    description: 'EASY ROUTE. It has held this chain since before the mural was painted. It will not give it up, and it cannot follow you out of the room.',
    bodyParts: [
      { name: 'Head',  maxHp: 10 },
      { name: 'Torso', maxHp: 24 },
      { name: 'Arm L', maxHp: 6 },
      { name: 'Arm R', maxHp: 6 },
      { name: 'Leg L', maxHp: 7 },
      { name: 'Leg R', maxHp: 7 },
    ],
    notes: [
      'WEAK SYSTEM — the doorway. It cannot leave the mural chamber. The party does not',
      'have to beat it: the CHAIN can be worked free in 2 Moments under fire, and then',
      'they can simply go. Beating it is allowed, and slower.',
      '',
      'Attacks: chain sweep, 3 Crush in a 2-hex line; a grapple (§13) that pins against',
      'the mural.',
      '',
      'CARVE: Sinew Cord + the chain itself (baseline iron — the prophecy\'s chain is a',
      'story item, not a material).',
      '',
      'DESIGN: the first boss-doctrine lesson of the route, at elite cost — the win',
      'condition is a position, not a corpse.',
    ].join('\n'),
  }),

  BOSS('THE MASKED', {
    color: '#b8a13a',
    description: 'EASY ROUTE BOSS. The man who found the treasure. He is still in there. That is the problem.',
    bodyParts: [
      { name: 'Mask',  maxHp: 15 },
      { name: 'Head',  maxHp: 14 },
      { name: 'Torso', maxHp: 45 },
      { name: 'Arm L', maxHp: 12 },
      { name: 'Arm R', maxHp: 12 },
      { name: 'Leg L', maxHp: 13 },
      { name: 'Leg R', maxHp: 14 },
    ],
    notes: [
      'GATE — the Mask restores him. At every Clock reset the Mask returns ONE destroyed',
      'or disabled part to 1 HP, in the order it chooses. It is not the man that is durable.',
      '',
      'THE WIN CONDITION IS THE CHAIN, NOT THE KILL (§21.3). The prophecy is right.',
      'Chaining him needs the chain (Chainbearer), a pinned or Helpless target, and',
      '3 Moments of work. KILLING HIM IS POSSIBLE — and it costs this route its Floor 2',
      'and Floor 3, because he must be alive and chained at F2 and must become Nullrot',
      'at F3. DO NOT WARN THEM. The mural already did.',
      '',
      'THE MASK\'S WEAK SYSTEM — Oathbreaker. The Mask (15) cannot be damaged by normal',
      'harm. MISTLETOE ignores exactly that (M-1). A party that worked the forest layer',
      '(The Rack) arrives holding the answer; a party that skipped it chains him the hard',
      'way, which is the intended baseline.',
      '',
      'CARVE: none — he lives, and that is the point. The collapse yields an Oak Heartwood',
      'and an Obsidian Shard gather on the way out.',
    ].join('\n'),
    phases: [
      { name: 'Wearing It', hpThreshold: 'opening — 61 total',
        description: 'He still speaks, in his own voice, and he apologises between attacks. Backhand 3 Crush; a grab that pulls a contestant to the mural.' },
      { name: 'The Mask Speaks', hpThreshold: '<=60 total',
        description: 'The voice changes. Gains a Dissolution aura: any contestant who ends a Clock adjacent begins a Dissolution timer (§8.2 — tierless, 2 Clocks, pauses when the source is removed). The room stops being a fight and starts being a countdown.' },
      { name: 'The Collapse', hpThreshold: '<=25 total, OR the chain is set',
        description: 'The ceiling starts coming down. 3-Clock timer to be out. Falling stone is environmental (§14: never dodged). If the chain is set he stops fighting and watches them leave.' },
    ],
  }),

  // ───────── Layer C — Medium Route: the haunted house ─────────

  MOB('Torchbearer', {
    part: 'Body',
    color: '#c25b2a',
    description: 'MEDIUM ROUTE. Rank and file of the arsonist NPC party. Human. Frightened, and doing it anyway.',
    notes: [
      'Torch, 2 Burn; or a tool, 2 Crush.',
      'GATE: none — and that is the encounter\'s whole weight. They die in one hit, they',
      'are people, and the cameras are running (§17).',
    ].join('\n'),
  }),

  ELITE('The Kindler', {
    color: '#e07b2a',
    description: 'MEDIUM ROUTE. Carries the fuel. Enjoys the work.',
    bodyParts: [
      { name: 'Head',             maxHp: 10 },
      { name: 'Torso',            maxHp: 22 },
      { name: 'Arm L',            maxHp: 6 },
      { name: 'Arm R',            maxHp: 6 },
      { name: 'Leg L',            maxHp: 6 },
      { name: 'Leg R',            maxHp: 6 },
      { name: 'Fuel Can (worn)',  maxHp: 4 },
    ],
    notes: [
      'WEAK SYSTEM — he is his own liability. The Fuel Can is a targetable worn part at',
      '4 HP. BURN 5 ON THE CAN detonates it: 3-space radius, 2 Burn — the Incineradile\'s',
      'trash-can rule, on a person who chose to carry it. The party does not have to',
      'out-damage him; they have to light him.',
      '',
      'Attacks: thrown fire, 3 Burn in a 2-space splash; sets terrain alight',
      '(§21.4 — flammable ground).',
      '',
      'CARVE: Forest Resin (what he thickened the fuel with).',
    ].join('\n'),
  }),

  BOSS('Foreman Bex', {
    color: '#a03a3a',
    description: 'MEDIUM ROUTE BOSS. The NPC party\'s leader. Reasonable, articulate, and burning a house with a child in it. NAME IS A PROPOSAL — it becomes canon at F3, where he runs the human farm.',
    bodyParts: [
      { name: 'Head',  maxHp: 14 },
      { name: 'Torso', maxHp: 45 },
      { name: 'Arm L', maxHp: 12 },
      { name: 'Arm R', maxHp: 12 },
      { name: 'Leg L', maxHp: 13 },
      { name: 'Leg R', maxHp: 13 },
      { name: 'Pack',  maxHp: 16 },
    ],
    notes: [
      'HE MUST SURVIVE THIS FLOOR — he is the F3 human-farm operator (Compendium §4.4).',
      '',
      'THE WIN CONDITION IS THE HOUSE, NOT THE MAN (§21.3). Three ways this ends, and',
      'ALL THREE ARE WINS:',
      '  - the fire is put out, or',
      '  - the girl is out of the house, or',
      '  - his HP total drops to <=40.',
      'On any of them he DISENGAGES — takes the surviving Torchbearers and goes, covering',
      'the retreat. He cannot be killed on this floor; if cornered, the fire takes the',
      'front of the house and he is gone in the smoke. If that reads as a cheat at the',
      'table, the honest fix is to make the smoke visible early, not to change the ruling.',
      '',
      'CARVE: none — human. YIELDS: the ledger from the Pack if the Pack was brought to 0.',
      'It names the buyers — the only F1 way to reach F3\'s farm already knowing what it is.',
    ].join('\n'),
    phases: [
      { name: 'The Burning', hpThreshold: 'opening — 81 total',
        description: 'He directs; the Torchbearers work. He fights defensively and talks the entire time. He will negotiate. He is lying.' },
      { name: 'Ugly Work', hpThreshold: '<=80 total',
        description: 'He stops directing and starts fighting. 4 Crush, two attacks a Clock; drags a contestant into the burning doorway.' },
      { name: 'Cut and Run', hpThreshold: '<=40 total, OR fire out, OR girl out',
        description: 'Disengage. He takes the surviving Torchbearers and covers the retreat. The Pack comes off if it was destroyed — it holds the ledger (F3 hook).' },
    ],
  }),

  BOSS('The Girl in the House', {
    color: '#6a2a6a',
    description: 'MEDIUM ROUTE — NOT A FIGHT. She is what the NPCs were right about. She is also a child in a burning house, and both are true.',
    bodyParts: [
      { name: 'Head',   maxHp: 14 },
      { name: 'Torso',  maxHp: 45 },
      { name: 'Arm L',  maxHp: 12 },
      { name: 'Arm R',  maxHp: 12 },
      { name: 'Leg L',  maxHp: 13 },
      { name: 'Leg R',  maxHp: 13 },
      { name: 'Shadow', maxHp: 16 },
    ],
    notes: [
      'STATTED SO THE GM CAN SAY NO WITH NUMBERS. Her F1 role is the BRAND, not a fight.',
      'She asks to be fed; she grants the demonic brand (immunity to noble-class',
      'presence/Dissolution — what the F2 Demonic Noble encounter is built around) plus',
      'faction points.',
      '',
      'PRESENCE (live even though the fight is not): noble-class presence. An unbranded',
      'contestant who refuses her, in the room, begins a Dissolution timer (§8.2). The',
      'brand is the answer, and taking it is a choice with a bill attached — she is a',
      'demonic queen at F2.',
      '',
      'WEAK SYSTEM: none written. A PARTY THAT ATTACKS HER AT F1 SHOULD LOSE. If the owner',
      'wants her winnable here, that changes F2 and F3 and should be ruled, not improvised.',
    ].join('\n'),
  }),

  // ───────── Layer D — Hard Route: the moving city ─────────

  MOB('Crystallized Citizen', {
    part: 'Body',
    color: '#9ad4e0',
    description: 'HARD ROUTE. They are still standing where they stopped. Some are mid-sentence.',
    notes: [
      '2 Crush, slow, and it will follow you across the whole floor.',
      'GATE: BLEED DOES NOTHING — there is no blood in it. CRUSH ONLY (Burn and Chill are',
      'cosmetic; Poison and Infection have no entry condition per §8.2). The party\'s',
      'Bleed-heavy F1 kit is suddenly the wrong kit. Teaching mob for damage-type gates.',
      '',
      'CARVE (room gather, E-0.4): Obsidian Shard — the crystal is close enough to work.',
      '',
      'GM: these are the citizens the Loong is guarding. Every one the party breaks is',
      'evidence for the argument they are about to make — and a thing they did to a person.',
      'Do not editorialise; just keep count where they can see it.',
    ].join('\n'),
  }),

  ELITE('Step-Warden', {
    color: '#7a8fa0',
    description: 'HARD ROUTE. An ambulatory section of staircase. The city built its own guards out of itself.',
    bodyParts: [
      { name: 'Crown Block',   maxHp: 12 },
      { name: 'Body Mass',     maxHp: 26 },
      { name: 'Keystone',      maxHp: 6 },
      { name: 'Leg Column L',  maxHp: 8 },
      { name: 'Leg Column R',  maxHp: 8 },
    ],
    notes: [
      'GATE — surface immunity. Damage to Crown Block and Body Mass is cosmetic. It is masonry.',
      '',
      'WEAK SYSTEM — the Keystone, in its back. 6 HP, unreachable while it faces you.',
      'Exposed ONLY during its stomp: a 1-Clock windup, 5 Crush in a 2-space square, after',
      'which it is Exposed for one Moment (§11) and the Keystone is reachable. Bait it,',
      'get behind it, or have someone tall.',
      '',
      'CARVE: Obsidian Shard (guaranteed, from the Keystone).',
    ].join('\n'),
  }),

  SUPER('Loong Kin', {
    color: '#2a8f7a',
    description: 'HARD ROUTE SUPER BOSS. It has guarded a city that has been empty for a very long time. Nobody has told it. It is not stupid; it is loyal, which is worse.',
    bodyParts: [
      { name: 'Head',              maxHp: 30 },
      { name: 'Neck',              maxHp: 25 },
      { name: 'Body Coil (fore)',  maxHp: 55 },
      { name: 'Body Coil (mid)',   maxHp: 55 },
      { name: 'Body Coil (rear)',  maxHp: 45 },
      { name: 'Foreclaw L',        maxHp: 20 },
      { name: 'Foreclaw R',        maxHp: 20 },
      { name: 'Whiskers',          maxHp: 10 },
      { name: 'Tail',              maxHp: 40 },
    ],
    notes: [
      'THE WIN CONDITION IS THE CONVERSATION. The statline exists so that "let\'s just',
      'fight it" is legible as a bad idea FROM THE NUMBERS, before anyone commits. Per',
      '§21.3, the position that makes a killing hit possible is here a sentence: that the',
      'city is abandoned, and its citizens are the crystal. Evidence beats rhetoric — a',
      'crystallized citizen carried up the stairs is the argument. Charm helps; PROOF lands.',
      '',
      'THE WHISKERS (10) ARE THE TELL. They are sensory: it reads truth through them at',
      'close range. A party that notices can work out that it CANNOT BE LIED TO — which is',
      'why the honest argument is the only one that works, and why attacking the Whiskers',
      'to "blind" it is the single worst move available.',
      '',
      'IT SURVIVES. It is escorted at F2 and hides in the capital at F3. If the party kills',
      'it, that route ends at F1 and the owner should be told at the table what they spent.',
      '',
      'CARVE: NONE. Loong-Scale is SHED, NOT TAKEN (materials catalog M-5 — APEX/DIVINE,',
      'authored-only, never pooled, never sold). If it is persuaded, it sheds one scale,',
      'freely, as thanks. That is the only way that material enters the world.',
    ].join('\n'),
    phases: [
      { name: 'Warning', hpThreshold: 'on the first attack',
        description: 'It does not retaliate. It coils, and it says so. One free Clock to stop.' },
      { name: 'The Coil', hpThreshold: '<=240 total',
        description: 'It stops being polite. Constriction (§13) — it is two-plus sizes larger, so the party cannot grapple it and it is immune to grapple-Suffocation (§13/§21.3). 6 Crush, and it repositions the fight onto the stairs where falling applies (§21.5).' },
      { name: 'Storm-Breath', hpThreshold: '<=150 total',
        description: 'A 10-hex line, 6 Chill, terrain becomes difficult (§21.4). Dodge Threshold 7 with the §14 counter-ladder: Reflexes 7 auto-dodge + 1 space, Reflexes 9 auto-dodge + counterattack, below 7 the 1d4 fallback.' },
      { name: 'It Decides You Are Not Contestants', hpThreshold: '<=60 total',
        description: 'It stops treating the fight as an interruption. A TPK is the expected outcome and the GM should say so out loud when this phase opens. Retreat is still open; the stairs are long.' },
    ],
  }),
];
