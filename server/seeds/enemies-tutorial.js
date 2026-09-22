/**
 * FLOOR 0 — THE TUTORIAL. The roach house, and the brothers who live in it.
 * Seed via: node seed-enemies.js --file ./seeds/enemies-tutorial.js --floor 0
 *           node seed-enemies.js --file ./seeds/enemies-tutorial.js --floor 0 --apply
 *
 * Doctrine (§21.2 as a PART BUDGET, at floor 0):
 *   mob 2 exact · elite ~24 (12-48) · boss ~50 · super ~120
 * Signature band (floor-bands.js, torso 5, level 6):
 *   mob 3 · elite 4 · boss 6 · super 9
 *
 * WHY THE TUTORIAL IS ITS OWN FLOOR. forceAt() bakes in two §21.6 prep steps — one
 * added damage type, one assist — that a tutorial party has not bought yet: no
 * Forge, no coatings, no drilled assists, no band step. Strip those and a floor-0
 * contestant is weapon class 2 and nothing else, which is 2 Force. The tutorial is
 * the floor where you have no preparation. That is what a tutorial IS.
 *
 * ⭐ THE THREE BROTHERS ARE ONE TEACHING SET, AND EACH IS AN ANSWER TO ARMOR.
 * The owner's own playtest note is that basic resistance already stops mob damage
 * cold. Each brother breaks that a different way, and none of it was designed to —
 * it fell out of what they already are:
 *   BIG   — the charged shot PIERCES: it ignores typed resistance outright.
 *   MID   — the leap is CRUSH where his axes are Bleed: one resistance answers half.
 *   LITTLE— the PRESS (§21.8) merges three bites into ONE hit, so your resistance
 *           subtracts ONCE instead of three times. 3x1 Bleed through armor 1 is 2;
 *           three separate bites through armor 1 is 0.
 *
 * ⭐ AND THE BUDGETS TELL THE STORY BY THEMSELVES: 32 · 24 · 20. Big to little, and
 * the runt is UNDER the elite line. That is why he was thrown out, written in the
 * one number the doctrine gate actually checks.
 */

const MOB = (name, { part = 'Body', ...o }) => ({
  tier: 'mob', name, size: 'Medium', phases: [],
  bodyParts: [{ name: part, maxHp: 2 }],
  ...o,
});
const E = (tier) => (name, o) => ({ tier, name, size: 'Medium', phases: [], ...o });
const ELITE = E('elite');
const BOSS  = E('boss');

/**
 * §10.1 SURFACE IMMUNITY — the Incinedile's puppet, and the ward is per PART.
 * The Compendium wrote this rule before §10.1 existed: "Breach Path B: deal 7+
 * damage in a single hit" IS "universal 6 = needs 7 Force to do anything", word
 * for word. Both of its breach paths are the `removal` §10.1 now demands, and
 * both were already written. Same shape as THE MASKED (the ward is on the Mask,
 * the man is the hole) and the F2 Doorward (Torso sealed, Mouth wide open).
 */
const WARD = (part) => ({
  ...part,
  universal: {
    value: 6,
    cause: 'A mycelium network inside holds the puppet\'s surface. Damage to flesh the network is not wearing at that moment reduces nothing — the Compendium\'s "all damage pre-breach = zero HP loss, cosmetic only". ⚠️ A floor-0 contestant is 2 Force, so an average party does LITERALLY NOTHING to the puppet, and is meant to find that out itself.',
    removal: 'BREACH PATH A — reach Bleed T2 on any part: the wound opens onto the network. BREACH PATH B — land 7+ Force in a SINGLE hit on one part: it punches through and the network takes the damage at that location. Both RESET when a Pressure Valve fires and the network retreats deeper.',
  },
});

module.exports = [

  // ───────── The house ─────────

  MOB('Roach-dog', {
    size: 'Small',
    part: 'Carapace',
    color: '#6b4a24',
    // Bite 1 is RULED UNCHANGED (owner, 2026-09-15): "Roach-dog damage won't be
    // buffed. And the press is buffed to 3." Below the mob band of 3, legitimately:
    // the number is chaff and the Bleed TIER is what does the work, which is exactly
    // what `tick` is for. Its band-sized hit exists — it is the press.
    signature: { floor: 0, damage: 1, type: 'Bleed', exception: 'tick',
      note: 'One bite is 1 Bleed and that is meant to be nothing. The band number is the PRESS: three roach-dogs on one target merge into a single 3-Force hit (§21.8), and resistance subtracts ONCE from the merged total instead of three times.' },
    description: 'Dog-sized, four movement, no plan. Comes in tens. The first thing the party ever kills and the last thing that ever stops mattering.',
    notes: [
      'HORDE. 1 Bleed on a bite. 4 movement. A room holds 10+ on average.',
      '',
      'GATE: none, and it needs none — it is the reference mob. What it teaches is',
      'three things the whole campaign runs on, in order:',
      '  1. §12.6 — armor SORTS. One worn piece and a single bite does nothing at all.',
      '  2. §12.6 again — but a Bleed TIER on a part drops that part\'s resistance by',
      '     the tier value while it lasts. Twelve bites take your armor apart, and',
      '     then the number matters.',
      '  3. §21.8 THE PRESS — while a directing elite is in the fight, three that can',
      '     reach you merge into ONE 3-Force hit. Capped at three (owner, 2026-09-15),',
      '     which is exactly one destroyed Small torso and cannot reach past it.',
      '',
      'AT THE TABLE: armor 0 -> 3 through, a Small torso falls. Armor 1 -> 2 through,',
      'nothing\'s torso falls. One worn piece is the whole difference, in the room',
      'where it happens.',
      '',
      'Carve: none individually (E-0.4); a cleared room is one gather roll.',
      '',
      '🔒 HP 2 IS RULED (owner, 2026-09-17). The live sim roster had this at 1 HP',
      '(carapace); doctrine at floor 0 is 2. The change is invisible at the table —',
      'a tutorial contestant swings for 2 and kills it in one either way. All it stops',
      'is a BARE FIST one-shotting a roach. The BITE stays at 1 (ruled 2026-09-15).',
    ].join('\n'),
  }),

  // ───────── The brothers ─────────

  ELITE('Big Brother Roach', {
    size: 'Medium',
    color: '#8c8478',
    signature: { floor: 0, damage: 4, type: 'Bleed',
      note: 'Bow, standing shot. The CHARGED shot is the windup: 1 Moment of draw, then 8 — either PIN (Crushed T1, cannot move until freed) or PIERCE (ignores the target\'s typed resistance entirely). While he is drawing, his dodge is spent.' },
    weaknesses: [
      { type: 'Burn', why: 'The suit is cloth and he will not take it off, ever, for any reason. It is the only thing anyone ever made for him. Set it alight and the manners go, and so does the aim.' },
    ],
    bodyParts: [
      { name: 'Head',      maxHp: 3 },
      // The suit is his armor and it is Little Bro's work. §12.6 lives on the part.
      { name: 'Thorax',    maxHp: 8,
        resistances: [{ type: 'Bleed', value: 2, why: 'Layered cloth over shell, kept immaculate. A cut has to get through the suit first, and the suit was made by someone who knew exactly what it was for.' }] },
      { name: 'Bow Arm',   maxHp: 4 },
      { name: 'Off Arm',   maxHp: 3 },
      { name: 'Legs',      maxHp: 6 },
    ],
    description: 'The eldest. Manners, a stained suit worn like it is not stained, and a bow. He will greet the party properly before he shoots any of them.',
    notes: [
      'WEAK SYSTEM — THE DODGE, AND THE FACT THAT IT IS ONE. Once per Moment,',
      'automatically and for free, he avoids ONE attack of his choosing. No roll.',
      '',
      '⭐ THIS IS THE TUTORIAL\'S TRAP FOR ITS OWN LESSON. §5.7 combined attacks merge',
      'the party\'s damage and "count as ONE hit" — which is precisely the shape he',
      'negates. A party that just learned to stack everything into one enormous swing',
      'hands him a free cancel. The biggest hit is not the best hit against something',
      'that can refuse one hit.',
      '',
      'REMOVALS (three, all discoverable in the room):',
      '  - SPEND ONE. Attack twice in a Moment; the first is eaten, the second is not.',
      '  - AREA. §7.3 — area does not divide, and he cannot dodge the room.',
      '  - THE CHARGED SHOT IS THE TELL. He commits a Moment to the draw, and a roach',
      '    mid-draw is not a roach mid-dodge. His biggest attack and his punish window',
      '    are the same Moment.',
      '',
      'RESISTS Bleed 2 on the THORAX only (§12.6, per-part). Head, arms and legs are',
      'bare shell. A party that works that out shoots the limbs and takes the bow arm',
      'off him, which is the whole fight.',
      '',
      'WEAK TO BURN (doubles). He will not remove the suit. Nobody has to explain why.',
      '',
      'TALK INSTEAD: he is the one brother who will hear a formal request. Manners get',
      'manners. Resolution pays the same experience as the kill (L-24) and costs the',
      'loot — see the drop list.',
      '',
      'DROPS: the BOW (class 3, plain — no band step; you inherit his weapon, not his',
      'number) and THE SUIT. The suit is Little Bro\'s work.',
    ].join('\n'),
  }),

  ELITE('Mid Brother Roach', {
    size: 'Large',
    color: '#a5502a',
    signature: { floor: 0, damage: 4, type: 'Bleed',
      note: 'One axe, one swing. The LEAP is the windup: 1 Moment of coil, then he lands for 8 CRUSH — and §7.3 says area does not divide, so everyone in the landing space takes the full 8. Bleed from the axes, Crush from the landing: one resistance answers half of him.' },
    weaknesses: [
      { type: 'Poison', why: 'Four arms and one appetite. He is eating when the party finds him and he does not check what. The meal on the table is a weak system somebody left lying there.' },
    ],
    resistances: [
      { type: 'Crush', value: 2, why: 'He has spent his entire life letting things hit him to find out what happens. The shell over the thorax is scar on scar on scar, and he is proud of it.' },
    ],
    bodyParts: [
      { name: 'Head',        maxHp: 3 },
      { name: 'Thorax',      maxHp: 10 },
      { name: 'Axe Arm L',   maxHp: 5 },
      { name: 'Axe Arm R',   maxHp: 5 },
      { name: 'Grip Arms',   maxHp: 4 },
      { name: 'Legs',        maxHp: 5 },
    ],
    description: 'The middle one. Four arms, two axes, a permanent grin and no interest at all in why the party is here. Wants the fight. Has wanted the fight all day.',
    notes: [
      'WEAK SYSTEM — THE ARMS. His damage is IN THE ARMS, not in him (§21.6 Body).',
      'Destroy an Axe Arm and that axe is gone: -1 Force per condition tier on the',
      'limb he swings with, and a destroyed limb swings nothing at all.',
      '  - Both Axe Arms down -> he is a grappler with the Grip Arms and no edge.',
      '  - Grip Arms down -> no leap-grab, no hold, no carrying anyone anywhere.',
      'The win condition is DISMEMBERMENT, not a damage race (§21.3). A party that',
      'goes for the 10-HP thorax is fighting the longest version of this fight.',
      '',
      'GRAPPLE GOES BOTH WAYS. He is LARGE, so §13 lets a Medium contestant grapple',
      'him — the tutorial teaches grappling on the one enemy that grapples back.',
      '',
      'RESISTS Crush 2. WEAK TO POISON (doubles) — and the meal is on the table when',
      'the party arrives. Poison it before you are seen and you fight a poisoned Mid',
      'Bro. Nothing in the room says so; the room just contains a plate.',
      '',
      'THE DOLL. He carries the doll Little Bro made him, in a Grip Arm. Threaten it',
      'and he covers it — that is the Grip Arms\' action spent, every time, and he will',
      'do it every time. ⭐ He is a musclehead with an exploitable soft spot and the',
      'soft spot is his little brother\'s handiwork.',
      '',
      'TALK INSTEAD: he wants a fight, not a murder. A party that gives him a good one',
      'and stops can reach an understanding — stage completion, recognition, tags and a',
      'quest completion, and no loot.',
      '',
      'DROPS: TWO AXES (class 3 each, plain) and THE DOLL.',
      '⭐ THE DOLL IS NOT LOOT. It is the key to the hatchery. Little Bro made it, and',
      'it is proof the brothers kept his gift. A party that killed Mid Bro can carry it',
      'to the brother who made it. That is a door, and they will not know it is a door.',
    ].join('\n'),
  }),

  ELITE('Little Brother Roach', {
    size: 'Small',
    color: '#c9a227',
    signature: { floor: 0, damage: 2, type: 'Bleed', exception: 'tick',
      note: 'Whip, range 7. Under band on purpose — he is not the damage. DRAG BACK (range 7) deals NOTHING and is the deadliest ability in the tutorial: it pulls a contestant into the pack, where the press is. He does not attack you, he moves you to where the attack is.' },
    // §21.3 rule 4 — BLANK BY DESIGN, and for the loudest reason in the tutorial.
    // He was thrown out for being weak. That is the one thing every character in this
    // story agrees on. A resistance would contradict it, and a weakness would soften
    // it. He has no mechanical edge whatsoever and he is the hardest fight on the
    // floor, because of what he BUILT. Same shape as Foreman Bex and The Hunt's Owner.
    resistances: [],
    weaknesses: [],
    bodyParts: [
      { name: 'Head',        maxHp: 3 },
      { name: 'Thorax',      maxHp: 5 },
      { name: 'Whip Arm',    maxHp: 5 },
      { name: 'Legs',        maxHp: 3 },
      { name: 'Brood-Sling', maxHp: 4 },
    ],
    description: 'The youngest, in the hatchery, with everything he has ever made. Kicked out for being weak. Answered it by building a family. Hateful, conflicted, and not wrong about any of it.',
    notes: [
      'WEAK SYSTEM — THE BROOD, NOT THE BODY. He is 20 budget, under the elite line,',
      'and killing him is not the problem. Everything dangerous about this fight runs',
      'through roaches:',
      '  - AWAKEN EGGS (1 Moment) summons 4.',
      '  - He DIRECTS, which is what turns roach-dogs into a press at all (§21.8 — the',
      '    press only exists while a directing elite is alive and can SEE the target).',
      '  - SEAL WOUND: he eats a roach and heals. The brood is ammunition AND medkit.',
      '  - DRAG BACK (range 7) pulls a contestant into the pack. No damage. That is',
      '    the ability that kills people.',
      '',
      'THE BROOD-SLING (4 HP) is the part that decides the fight — the newest clutch,',
      'strapped to him, because he was thrown out once and will not leave them',
      'anywhere. Destroy it and the reserve for Awaken Eggs is gone and so is the',
      'emergency ration for Seal Wound. ⭐ It is also the part they will not want to hit',
      'once they understand what it is — the same gesture as Mid Bro covering the doll,',
      'two brothers, one of them already dead.',
      '',
      'THE EGG CLUSTERS in the room are the same weak system at room scale. Burning the',
      'nursery is the efficient play and it is horrible, and nothing will stop them.',
      '',
      'AI — LOW-HP BIAS 3.0. He picks off the weak; a wounded contestant weighs up to',
      '4x. ⚠️ INTERACTION NOBODY DESIGNED: §12.6 now drops a conditioned part\'s',
      'resistance, so the AI hunts exactly the target today\'s armor rule softened.',
      'Keep it. Know it is there.',
      '',
      'THE TERRAIN IS THE FIGHT (T-8). Goop is hard terrain — passable, much slower.',
      'Safe spots to hop between; an island is a corridor made of terrain, and a',
      'corridor two abreast caps the press at two (§21.4). Island size is the press',
      'dial. There is a rush window at him, and it closes.',
      '',
      'THE SINKER BRANCHES ON WHAT THEY DID UPSTAIRS (owner, 2026-09-15):',
      '  - MID BRO ALIVE -> Mid Bro leaps and smashes the platforms. He finally has a',
      '    job in a room that is not his.',
      '  - MID BRO DEAD (this party) -> Little Bro THROWS A ROACH at the platform. ⭐ A',
      '    thrown roach is one he did not press with and did not eat. Sinking now',
      '    competes with the press AND with the healing.',
      'Killing Mid Bro made this room easier one way and harder another, and nothing',
      'announces either.',
      '',
      '⚙️ AND THE ROOM\'S DECISION CASHES OUT L-24: rushing him before the window closes',
      'means fewer roaches, which means FEWER LEVELS. The fastest route through the',
      'tutorial\'s last room is also the poorest. Neither rule knew about the other.',
      '',
      'TALK INSTEAD — and this is the one that matters. He is conflicted, not resolved.',
      'He made them the suit. He made the doll. They threw him out for being weak and',
      'he has been proving otherwise ever since, to nobody. A party carrying the doll,',
      'or the suit, has physical evidence his brothers kept what he made them.',
      '',
      'DROPS: the WHIP (class 3, plain, range 7).',
      '',
      'AND THE FIVE PARASITES — his real carve, and the party cannot refuse it. After',
      'the hatchery, no save and no roll, something crawls into skin or roboparts',
      '(the robot\'s goes into the machine, which is worse). He made them the way he',
      'made the suit and the doll: thrown out for being weak, he answered by MAKING',
      'MORE FAMILY, and the party inherits his children. Five sealed specimens, one',
      'each, no duplicates; on a party of four the fifth stays sealed and alive in the',
      'bag. Dread-Eye (danger) - Falsewort (sincerity) - The Beggar (want) - Ringworm',
      '(age) - Gravemoss (death). PUBLIC READS ONLY: the card shows only what anyone',
      'could see by looking at the jar. See rulebook/growth-items-and-parasites.md',
      'G-2/G-3 and seeds/items-parasites.js.',
    ].join('\n'),
  }),

  // ───────── The boss ─────────

  BOSS('Incinedile', {
    size: 'Huge',
    color: '#d2521f',
    renamedFrom: 'Incineradile',
    signature: { floor: 0, damage: 6, type: 'Crush',
      note: 'THE DASH — a straight-line charge that knocks the target aside and lands on the torso. On band (boss 6 at F0), and it is the number that matters: 6 Force ends a fresh Medium torso of 5, which is what makes it a boss. It also lands Crushed T1, and Crushed T2 on a part DISABLES that part. TWO OTHER ATTACKS, recorded here rather than given lines of their own (the F1 Rack pattern): the FLAMETHROWER is a 10-hex cone for 3 Burn — below band because it is per-touch area pressure and the Burn TIER is the work, and §7.3 means AREA DOES NOT DIVIDE, so it is 3 Burn to every contestant in the arc; the DEATH SPIN is a three-beat windup ending in 11 Crush, inside the windup cap of 2x band.' },
    resistances: [
      { type: 'Dissolution', value: 4, why: 'There is nobody home to unmake. It is Mind 1 — driven, not inhabited — and an attack on the self needs a self to reach. This is also why mockery and Feint build nothing against it.' },
    ],
    weaknesses: [
      { type: 'Burn', mode: 'heal', why: 'Canon, and its defining trait: all fire damage and Burn received HEALS it. It is a fungus that vents pressure by exploding, and fire is pressure. ⭐ The burning trash cans in the arena are its supply line, which is why they are in the room at all.' },
    ],
    bodyParts: [
      // ⭐ THE HOLE. Every other part is warded; this one is not.
      { name: 'Network', maxHp: 50,
        resistances: [
          { type: 'Bleed', value: 99, why: 'It is a separate organism and it has no blood. The puppet\'s flesh bleeds — that is breach path A — but bleeding the network is bleeding a mushroom, and systemic bleed-out never drains it.' },
        ],
        weaknesses: [
          { type: 'Burn', mode: 'double', why: 'MYCELIUM BURNS. ⭐ The same torch that feeds the puppet kills the thing inside it; the only difference is what you are pointing it at. A part OVERRIDES the body for its own type, and this is the exact case that field was built for.' },
        ],
      },
      WARD({ name: 'Head',                         maxHp: 7  }),
      WARD({ name: 'Right Hand',                   maxHp: 8  }),
      WARD({ name: 'Left Hand (Flamethrower Arm)', maxHp: 30 }),
      WARD({ name: 'Right Leg',                    maxHp: 15 }),
      WARD({ name: 'Left Leg',                     maxHp: 15 }),
    ],
    phases: [
      { name: 'Ignition',            hpThreshold: 'Network 50–36',
        description: 'Flamethrower (10-hex cone, 3 Burn, applies Burn T1) · Dash (line charge, 6 Crush torso, knocks aside) · Death Spin (3 beats: grab — a single hit netting 5+ forces the release; chew, 2 Crush to both arms; spin-and-kill, 11 Crush and the victim is flung).' },
      { name: 'Pressure Valve I',    hpThreshold: 'Network reaches 35',
        description: 'Explosion, 5-space radius, 2-Moment escape window, instant KO inside it. Visible steam telegraphs one Moment before. UNDODGABLE — no dodge-shaped escape works; leaving the radius is the counterplay, and it is the only one. Afterwards the network retreats deeper and BOTH BREACH PATHS RESET.' },
      { name: 'Frenzy',              hpThreshold: 'Network 34–19',
        description: 'All of Ignition, plus: the flamethrower pops trash cans on first touch · the dash bounces off arena walls up to twice · Death Spin grab range +1.' },
      { name: 'Pressure Valve II',   hpThreshold: 'Network reaches 18',
        description: 'Explosion, 7-space radius, 2-Moment window, instant KO, undodgable. Afterwards the network is FULLY EXPOSED — no breach condition is needed for the rest of the fight.' },
      { name: 'Rupture',             hpThreshold: 'Network 17–0',
        description: 'All of Frenzy, plus: the flamethrower tracks the closest target · the dash may bend once mid-run · Death Spin merges chew and spin into one beat (2 Moments instead of 3 — one less Moment of counterplay).' },
      { name: 'Pressure Valve III',  hpThreshold: 'Network reaches 0 — death',
        description: 'The last vent, and it is not survivable by standing still: 19-space radius, 5-Moment escape window, instant KILL, undodgable. ⭐ Winning the fight starts a footrace. The 5 Moments are the reward for killing it fast enough to still have legs.' },
    ],
    description: 'A giant reptile with a flamethrower for a left hand — except it is not a reptile. A mycelium network lives inside it and wears it, reattaches its limbs, and vents pressure by exploding. The tutorial\'s graduation exam, the thing that unlocks the Lounge, and the first opponent that cannot be solved by hitting it.',
    notes: [
      'WEAK SYSTEM — THE NETWORK, AND FINDING IT IS THE FIGHT. Every part but one is',
      'warded (§10.1, universal 6). A floor-0 contestant is 2 Force, so an average',
      'party does LITERALLY NOTHING to the puppet — and is meant to discover that',
      'itself. ⭐ The Compendium wrote §10.1 before §10.1 existed: "deal 7+ damage in',
      'a single hit" IS "universal 6 needs 7 Force to do anything", word for word.',
      '',
      'TWO BREACH PATHS, and they are the §10.1 `removal`:',
      '  A. Bleed T2 on ANY part — the wound opens onto the network. This is the cheap',
      '     one, and it is why the puppet has no Bleed resistance anywhere.',
      '  B. 7+ Force in a SINGLE hit on one part — punches through; the network takes',
      '     it at that location. ⭐ §5.7 combined attacks merge and count as ONE hit,',
      '     so the party\'s answer to a threshold is the party.',
      '  BOTH RESET at every Pressure Valve. The network retreats and they start again.',
      '',
      '⭐⭐ FIRE IS THE WHOLE PUZZLE IN ONE OBJECT. Burn HEALS the body — canon, and the',
      'burning trash cans are its supply line. Burn DOUBLES on the Network, because',
      'mycelium burns. The same torch feeds the monster and kills the thing inside it,',
      'and the only difference is what you are pointing it at. A party that works out',
      '"fire is bad here" has learned the wrong half of the lesson.',
      '',
      'THE NETWORK TAKES FORCE BUT NOT TIERS (§8.1, stated for a creature). It has no',
      'blood to bleed, no bones to crush, no lungs to suffocate and no mind to',
      'dissolve — you cannot give a fungus a broken arm. Conditions never land on it.',
      'You can only take it apart, which is why Bleed reads 99 there and crushing',
      'FORCE still finishes it.',
      '',
      'CRUSHED T2 ON A PART DISABLES THAT PART, both ways. It is how the boss maims',
      'the party, and ⭐ disabling the LEFT HAND permanently removes the flamethrower —',
      'the one tactical objective in the room, worth 30 HP of warded part to reach.',
      '',
      'TRASH CANS pop at Burn 5 for 2 Burn in 3 spaces. Environmental, no killer, and',
      'a liability to both sides: they feed the boss and they clear the floor. F1\'s',
      'Fuel Can (the Kindler) is Burn 10 for 4 Burn — this is deliberately the weaker',
      'original.',
      '',
      'THE DODGE LADDER (the dash is the dodgeable one). Reflexes 7+ auto-dodges and',
      'sidesteps one space off the charge lane; Reflexes 9+ also counterattacks; below',
      '7, add the Reflexes threshold die. Never while Exposed, Helpless or Prone.',
      '',
      '⚠️ SIZE IS HUGE, so §13 forbids a Medium contestant grappling it — the Death',
      'Spin grapples you and you cannot answer in kind. The escape is Physique 6 in',
      'one Moment, or two Moments if you are under it, which is too slow past the chew.',
      '',
      '⚙️ BUDGET. Puppet 125 total, which is §21.2\'s boss centre for a normal floor —',
      'but the reachable budget at F0 is the NETWORK\'S 50, exactly the boss centre for',
      'a floor below F1. Both readings land, and they always did: the Compendium\'s',
      '"single HP bar (total 50)" and the sim\'s six-part 125 were never in conflict.',
      'ONE IS THE NETWORK AND THE OTHER IS THE PUPPET.',
      '',
      'SPECTACLE (§17.8). Gates close, everything freezes, "Party vs Boss" announced,',
      'spotlight onto a caged band above the arena, the band plays, spotlight out,',
      'music continues, unfreeze. Boss music: God Shattering Star. The arena is 41x60.',
      'It is worth +25% on the swing, doubled if the kill uses fire on the Network',
      'after the party has spent the fight watching fire heal it.',
      '',
      'PAYS (§17.6/§19.1): 1 Silver box. Clearing it unlocks the LOUNGE, which is the',
      'real payment and the end of the tutorial.',
    ].join('\n'),
  }),

];
