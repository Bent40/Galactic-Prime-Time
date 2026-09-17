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
    ].join('\n'),
  }),

];
