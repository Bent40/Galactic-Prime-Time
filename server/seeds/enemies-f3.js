/**
 * Floor 3 — the grand capital, a hundred years after Floor 2 (170 after Floor 1).
 * PROPOSAL, per rulebook/f3-enemy-pass.md. The set-1 finale: the capital attaches
 * to the Lounge as a persistent location afterwards (Compendium §4.1).
 *
 * BAND UNITS (§12.7 errata). HP budgets identical to F1/F2: mob 5 exact ·
 * elite ~60 ±tol · boss ~125 ±tol · super ~300. Only damage moves —
 * F3 torso 11 → mob 6 · elite 9 · boss 12 · super 19 (signature hits).
 *
 * Carves are M-3 Capital: Jade · Mirror-Bronze · Silver · Inscribed Clay ·
 * Orichalcum · Cursed Gold ⭐.
 *
 * ALL THREE ROUTES CONVERGE ON THE PLAGUE HERE, and there are TWO cures in play:
 * the crystal's (Nullrot, the Loong) and the demons' (a cure for being a demon).
 * Whether they are the same cure is the floor's central question.
 */

const MOB = (name, { part = 'Body', ...o }) => ({
  tier: 'mob', name, size: 'Medium', phases: [],
  bodyParts: [{ name: part, maxHp: 5 }],
  ...o,
});
const E = (tier) => (name, o) => ({ tier, name, size: 'Medium', phases: [], ...o });
const ELITE = E('elite');
const BOSS  = E('boss');
const SUPER = E('legendary');

module.exports = [

  // ───────── Layer A — The Grand Capital (shared, all routes) ─────────

  MOB('Quarantine Enforcer', {
    part: 'Body',
    color: '#5d6b7a',
    description: 'F3 SHARED. Masked, gloved, carrying fire. They burn the districts that cough.',
    notes: [
      '6 Burn from a hooked torch, and they work in threes.',
      'GATE: none — and that is the difficulty. THEY ARE PROBABLY RIGHT. The capital has',
      'been holding the crystal back this way for a century, the party is walking around',
      'inside a quarantine they did not read the terms of, and every one of these is a',
      'person doing a job that works.',
      'Fighting them is loud, on camera, and marks the party as vectors (§17).',
    ].join('\n'),
  }),

  MOB('Crystal Bloom', {
    part: 'Bloom', size: 'Large',
    color: '#a9dbe8',
    description: 'F3 SHARED. It grows out of a wall, a cart, a person. It does not move and it does not want anything.',
    notes: [
      'NO ATTACK. It is scenery until touched.',
      'GATE: DAMAGING IT SPREADS IT. Any hit that is not Burn bursts it — 2-space cloud,',
      'Infected T1, and the bloom regrows within a Clock from what it landed on.',
      'BURN DESTROYS IT CLEANLY and leaves nothing behind (§8.2 — Burn T2 clears infection).',
      '',
      'The teaching mob for RIGHT TOOL, and the capital is full of them. A party that',
      'hacks its way down a street makes the street worse.',
    ].join('\n'),
  }),

  MOB('Clay Servitor', {
    part: 'Body', size: 'Large',
    color: '#b0764a',
    description: 'F3 SHARED. Inscribed Clay, older than the plague, still running errands for a household that is gone.',
    notes: [
      '6 Crush. Tireless, and it does not acknowledge being hit.',
      'GATE: IT REPAIRS ITSELF from any clay, brick or plaster within reach — which in a',
      'brick city is everywhere — restoring 5 HP at each Clock reset.',
      '',
      'WEAK SYSTEM — THE WRITING IS THE STRENGTH (M-3). The inscription is visible on its',
      'chest. DEFACE IT: 1 Moment, adjacent, no roll, and it drops inert on the spot.',
      'A mob you can switch off if you are willing to stand next to it.',
      '',
      'Carve: room gather — Inscribed Clay.',
    ].join('\n'),
  }),

  MOB('Bellringer', {
    part: 'Body',
    color: '#8a8470',
    description: 'F3 SHARED. Plague-warden. It does not want to fight you, it wants to tell everyone about you.',
    notes: [
      '6 Crush if cornered, but it will run first.',
      'GATE: IF IT RINGS, THE STREET ANSWERS. Two more mobs arrive per Clock, indefinitely,',
      'until the bell is silenced. It rings on its first Moment of being seen.',
      '',
      'WEAK SYSTEM — kill it before it is a fight. Stealth (§15), range, or a thrown',
      'anything. The bell itself can be fouled with Forest Resin if the party still has any.',
      'The teaching mob for the capital: NOISE IS THE REAL ENEMY HERE.',
    ].join('\n'),
  }),

  MOB('Gilt Rat', {
    part: 'Body', size: 'Small',
    color: '#c9a227',
    description: 'F3 SHARED. Something in the sewers has been swallowing the treasury for a hundred years.',
    notes: [
      '6 Bleed, and it would rather flee with what it is carrying.',
      'GATE: none — killing it is easy. TAKING WHAT IT CARRIES IS THE TRAP.',
      'It is stuffed with CURSED GOLD (M-3 ⭐), which has the highest numbers in the band',
      'and WANTS THINGS. The GM should let the party have it, and start asking.',
      '',
      'Carve: Cursed Gold ⭐ — the only reliable source on this floor, and it is a hook.',
    ].join('\n'),
  }),

  ELITE('Mirror-Bronze Warden', {
    size: 'Large',
    color: '#b8a06a',
    description: 'F3 SHARED. A city guardian polished every morning for four hundred years, by nobody, lately.',
    bodyParts: [
      { name: 'Polished Face', maxHp: 14 },
      { name: 'Head',          maxHp: 10 },
      { name: 'Torso',         maxHp: 26 },
      { name: 'Arm L',         maxHp: 8 },
      { name: 'Arm R',         maxHp: 8 },
      { name: 'Leg L',         maxHp: 5 },
      { name: 'Leg R',         maxHp: 4 },
    ],
    notes: [
      'GATE — IT REFLECTS. Any ranged attack, thrown weapon, cone, line or skill effect',
      'that strikes it is turned back on the attacker at full value. Melee is unaffected.',
      'A party that opened at range has just shot itself, and the crowd saw (§17).',
      '',
      'WEAK SYSTEM — the Polished Face (14). Dull it and the reflection stops: acid, soot,',
      'mud, blood, Forest Resin, or simply breaking it. One Moment of thinking beats a',
      'Clock of shooting.',
      '',
      'Attacks: a shield-edge chop, 9 Crush. It advances and does not pursue — it is',
      'guarding something, and it has forgotten what.',
      '',
      'CARVE: Mirror-Bronze.',
    ].join('\n'),
  }),

  ELITE('Silver-Limbed Surgeon', {
    color: '#c8ccd2',
    description: 'F3 SHARED. It has been replacing what the crystal takes. It has been doing this for longer than anyone asked.',
    bodyParts: [
      { name: 'Head',         maxHp: 7 },
      { name: 'Torso',        maxHp: 15 },
      { name: 'Silver Arm L', maxHp: 6 },
      { name: 'Silver Arm R', maxHp: 6 },
      { name: 'Leg L',        maxHp: 5 },
      { name: 'Leg R',        maxHp: 5 },
    ],
    notes: [
      'GATE — IT WILL NOT LET YOU DIE. Any contestant reduced to bleed-out (§7.5) in its',
      'reach is STABILISED by it, mid-fight, whether or not they want that — and it takes',
      'the part it judges beyond saving. The replacement is Silver, and it works.',
      '',
      'WEAK SYSTEM — it can be TALKED TO, and it is the only thing on this floor that can.',
      'It is not hostile; it is unsupervised. Give it a patient and it stops fighting.',
      'Destroying a Silver Arm (6) removes one capability each: the left holds, the right',
      'cuts. Killing it is easy, cheap, and loses the party the best surgeon in the capital.',
      '',
      'Attacks: a precise cut, 9 Bleed, aimed at a limb and never at a lethal part.',
      '',
      'CARVE: Silver — the prosthetic metal. Body-part replacement gear (M-3 ⚖).',
    ].join('\n'),
  }),

  // ───────── Layer B — Easy Route: Nullrot ─────────

  MOB("Nullrot's Faithful", {
    part: 'Body',
    color: '#7a8c5a',
    description: 'EASY ROUTE. He cured them. Some of them a hundred years ago. They have not left.',
    notes: [
      '6 Crush, with whatever the street provided.',
      'GATE: THEY WILL NOT RAISE A HAND TO HIM AND THEY WILL DIE FOR HIM. They interpose',
      'bodily between the party and Nullrot, without weapons, without threat, and without',
      'stopping. Killing them is trivial, and it is the whole scene.',
      '',
      'ALSO: F1\'s CRYSTALLIZED CITIZENS RETURN AS A TIDE (~50, enemy-scaling S-2) in the',
      'quarantined districts — still Crush-only, still people, and now there are fifty.',
    ].join('\n'),
  }),

  ELITE('The First Cured', {
    color: '#8fa87a',
    description: 'EASY ROUTE. The first person he saved, a hundred and seventy years ago. Still alive. Still, in places, crystal.',
    bodyParts: [
      { name: 'Head',             maxHp: 11 },
      { name: 'Torso',            maxHp: 24 },
      { name: 'Crystal Shoulder', maxHp: 9 },
      { name: 'Arm L',            maxHp: 7 },
      { name: 'Arm R',            maxHp: 6 },
      { name: 'Leg L',            maxHp: 5 },
      { name: 'Leg R',            maxHp: 4 },
    ],
    notes: [
      'GATE — THE CRYSTAL SHOULDER (9) IS NOT A WEAKNESS, IT IS THE PROOF. While it lives,',
      'the shoulder proves the cure ARRESTS the plague rather than removing it: it has not',
      'grown in a century and it has not gone. Destroy the shoulder and it dies, because',
      'that is the part the cure is holding.',
      '',
      'WEAK SYSTEM — it does not want to fight and says so at length. It guards the way to',
      'Nullrot out of gratitude, not loyalty, and gratitude ARGUES. Convince it the party',
      'means him no harm and it stands aside — and it is the only witness who can explain',
      'what he actually is before they meet him.',
      '',
      'KILLING IT DESTROYS THE EVIDENCE. A party that does will reach Nullrot with no',
      'reason to believe anything he says.',
      '',
      'Attacks: 9 Crush, apologetic, and it pulls its blows.',
      '',
      'CARVE: none — it is a person. Yields: a century of notes on the disease.',
    ].join('\n'),
  }),

  SUPER('Nullrot', {
    size: 'Large',
    color: '#5f7a4a',
    description: 'EASY ROUTE FINALE. The man from the staircase. He is spreading a disease and curing it, in the same street, on the same day, and both are true.',
    bodyParts: [
      { name: 'Mask',           maxHp: 30 },
      { name: 'Head',           maxHp: 26 },
      { name: 'Torso',          maxHp: 70 },
      { name: 'Arm L',          maxHp: 24 },
      { name: 'Arm R',          maxHp: 24 },
      { name: 'Leg L',          maxHp: 26 },
      { name: 'Leg R',          maxHp: 26 },
      { name: 'The Reservoir',  maxHp: 40 },
      { name: 'Halo of Cures',  maxHp: 34 },
    ],
    notes: [
      'THE CANON BEAT (Compendium §4.3): he is simultaneously spreading and curing a',
      'disease in the capital, and the party chooses to fight or to help.',
      '',
      'HE IS BOTH PATIENT ZERO AND THE ANTIBODY (ruled 2026-08-18). That is not a paradox',
      'to be resolved, it is a body: THE RESERVOIR (40) holds the plague, THE HALO OF CURES',
      '(34) is what he sheds walking down a street. He cannot have one without the other,',
      'and neither can anyone else.',
      '',
      'THE PARTY DID THIS. The Doorward at F2 had been eating the plague out of him for',
      'seventy years. They killed it to free him — correctly, on the evidence they had —',
      'and the reservoir has been filling ever since. Nobody needs to tell them. Someone',
      'will.',
      '',
      'FIGHTING HIM IS LEGIBLE AS A BAD IDEA FROM THE NUMBERS, exactly as the Loong was.',
      'THE WIN CONDITION IS THE ARGUMENT (§21.3), and the argument is genuinely hard,',
      'because he is right: killing him ends the cure, and the capital has a hundred years',
      'of people who are only alive because of the Halo.',
      '',
      'DESTROYING THE RESERVOIR (40) ALONE is the surgical answer and it is possible —',
      'it is deep, it is guarded, and it takes the Mask down first. It ends the plague and',
      'leaves the cure. It also, almost certainly, ends him. The party will not be told',
      'that until afterwards.',
      '',
      'THE MASK (30) is the same mask. It is what has kept a man alive for a hundred and',
      'seventy years, and it is what carries the plague — he is only its newest host',
      '(f1-enemy-pass E-0.6). Removing it is not a kill; it is a burial.',
      '',
      'CARVE: none. If he is helped rather than killed, he gives the CURE — which is the',
      'thing every demon on this floor is hunting, and the party is now carrying it.',
    ].join('\n'),
    phases: [
      { name: 'The Round', hpThreshold: 'the encounter opens here',
        description: 'He is working. He does not stop to receive them and he does not deny anything. The Halo is passive and constant: any Infected condition on a contestant within 3 spaces drops one tier per Clock, including the ones they came in with. He is curing them while they decide whether to kill him.' },
      { name: 'The Reservoir Answers', hpThreshold: 'on the first attack',
        description: 'He does not retaliate — the reservoir does. Crystal blooms from every surface within 4 spaces, Infected T1 on contact, and it regrows each Clock. 19 Crush from a body that is mostly not his any more. He is still talking.' },
      { name: 'Both At Once', hpThreshold: '<=180 total',
        description: 'The Halo and the Reservoir run together and the street cannot hold both: contestants take Infected and lose Infected in the same Clock, and so does everyone watching. This is the phase where the argument is winnable, because the table can finally SEE the thing he has been saying.' },
      { name: 'The Mask Decides', hpThreshold: '<=70 total, or the Mask destroyed',
        description: 'If the Mask falls, the man underneath is a hundred and seventy years old and dies of it within a Clock, lucid, and grateful. If it does not, the Mask stops pretending to be him. A TPK from here is expected and the GM should say so out loud.' },
    ],
  }),

  // ───────── Layer C — Medium Route: the human farm ─────────

  MOB('Farmhand', {
    part: 'Body',
    color: '#9a7a4a',
    description: 'MEDIUM ROUTE. They work the pens. They are paid, housed and fed, and they are not the ones in the pens.',
    notes: [
      '6 Crush with tools that were not made for it.',
      'GATE: none. They fight to keep their jobs, which is the worst possible reason and',
      'the most common one. They will surrender readily and go straight back to work.',
    ].join('\n'),
  }),

  ELITE('Foreman Bex, Kept', {
    color: '#a03a3a',
    description: 'MEDIUM ROUTE. The man from the burning house, a hundred and seventy years later, and he should not be here.',
    bodyParts: [
      { name: 'Head',   maxHp: 12 },
      { name: 'Torso',  maxHp: 32 },
      { name: 'Arm L',  maxHp: 9 },
      { name: 'Arm R',  maxHp: 9 },
      { name: 'Leg L',  maxHp: 10 },
      { name: 'Leg R',  maxHp: 8 },
      { name: 'Ledger', maxHp: 5 },
    ],
    notes: [
      'THE SAME MAN AS f1-enemy-pass C-3, filed under a distinct name because the seeder',
      'matches by name and they are two different statlines in one collection.',
      '',
      'HE IS 170 YEARS OLD AND HE IS NOT MEANT TO BE. That is the encounter.',
      '',
      'IF THE GIRL WAS KILLED AT F1: Beelzebub kept him, because the farm is useful, and',
      '  Bex has spent a century and a half being useful back. He knows exactly what he is.',
      'IF THE GIRL WAS SPARED: the queen kept him, for the same reason and with better',
      '  manners. He has never been told whose he is and has never asked.',
      '',
      'GATE — HE CANNOT BE KILLED WHILE HE IS OWNED. Damage lands and does not stay: his',
      'parts return to 1 HP at each Clock reset, because something is paying for that.',
      '',
      'WEAK SYSTEM — THE LEDGER (5). It is the same ledger, still being kept, and it names',
      'his patron on the last page. Destroy it, or read it aloud where the crowd can hear',
      '(§17), and the arrangement is void: the regeneration stops and he ages in front of',
      'them. He does not defend it. He has been waiting a long time for someone to take it.',
      '',
      'Attacks: 9 Crush, slow, and he apologises the way he did at the house.',
      '',
      'CARVE: none. YIELDS: the ledger — every buyer, every sale, and one name.',
    ].join('\n'),
  }),

  BOSS('The Petitioner', {
    size: 'Large',
    color: '#6a2a5a',
    description: 'MEDIUM ROUTE BOSS. A demon who wants to stop being one, and has read enough to know the price. NAME IS A PROPOSAL.',
    bodyParts: [
      { name: 'Head',     maxHp: 20 },
      { name: 'Torso',    maxHp: 54 },
      { name: 'Arm L',    maxHp: 15 },
      { name: 'Arm R',    maxHp: 15 },
      { name: 'Leg L',    maxHp: 16 },
      { name: 'Leg R',    maxHp: 16 },
      { name: 'Petition', maxHp: 14 },
    ],
    notes: [
      'THE CANON BEAT (Compendium §4.4): a demon wants a specific human sacrifice to cure',
      'his demonic nature; the party sacrifices one or kills him.',
      '',
      'THE SPECIFIC HUMAN IS IN BEX\'S PENS, and has a name, and the party will meet them',
      'before they meet him. That ordering is the encounter — it is not a trolley problem',
      'until you have shaken the trolley\'s hand.',
      '',
      'GATE — THE PETITION (14). He is not fighting for his life, he is fighting for a',
      'document: a formal claim on his own nature, and while it is intact he cannot be',
      'killed by anything that is not a refusal. Damage to the Torso is cosmetic.',
      '',
      'WEAK SYSTEM — three ways out, and they are the whole scene:',
      '  GRANT IT. Hand him the human. He becomes mortal, keeps his word, and the party',
      '    has to carry it. Enormous Exposure (§17). The crowd loves it and so will nobody.',
      '  REFUSE IT. Destroying the Petition (14) makes him killable and makes him a demon',
      '    forever, which he already knew when he asked.',
      '  ANSWER IT ANOTHER WAY. Nullrot\'s cure, or the Loong\'s, may work on a demon —',
      '    THE FLOOR\'S CENTRAL QUESTION. A party running the Medium route cannot reach',
      '    either, but they can KNOW, and knowing is a bargaining chip.',
      '',
      'Attacks: 12 Bleed, and he is apologetic about every one of them.',
      '',
      'CARVE: none. YIELDS: on a granted petition, a mortal ally in the capital forever.',
    ].join('\n'),
    phases: [
      { name: 'The Asking', hpThreshold: 'the encounter opens here',
        description: 'He explains, precisely and without threat, what he wants and why it must be that person. He has the paperwork. He will wait while they think, and he will not lie to them, because the petition does not permit it.' },
      { name: 'The Pressing', hpThreshold: 'on refusal, or the first attack',
        description: 'He stops asking. 12 Bleed, and he goes for whoever is standing between him and the pens rather than whoever is hurting him. Torso cosmetic while the Petition holds.' },
      { name: 'Denied', hpThreshold: 'Petition destroyed (14)',
        description: 'He is killable, and he stops fighting for the human and starts fighting for himself, which he is much worse at. He does not beg. He has been refused before.' },
    ],
  }),

  // ───────── Layer D — Hard Route: the Loong in hiding ─────────

  MOB('Ashen Inquisitor', {
    part: 'Body',
    color: '#7a5a6a',
    description: 'HARD ROUTE. Demons in plague-doctor masks, going door to door. The city thinks they are help.',
    notes: [
      '6 Bleed, and they work in pairs so one can always leave.',
      'GATE: KILLING ONE IS FINE. LETTING ONE LEAVE IS NOT. A survivor reports the party\'s',
      'position within a Clock and the search tightens around wherever they were seen —',
      'which is wherever the Loong is hiding.',
      '',
      'ALSO: F2\'s HUNT-HOUNDS RETURN AS A TIDE (~25, enemy-scaling S-2), loose in the',
      'streets and still going for the Loong before anything else.',
    ].join('\n'),
  }),

  ELITE('The Cartographer', {
    color: '#8a6a8a',
    description: 'HARD ROUTE. It has never hunted anything. It is drawing a map, and the map is closing.',
    bodyParts: [
      { name: 'Head',  maxHp: 8 },
      { name: 'Torso', maxHp: 19 },
      { name: 'Arm L', maxHp: 6 },
      { name: 'Arm R', maxHp: 6 },
      { name: 'Leg L', maxHp: 6 },
      { name: 'Leg R', maxHp: 6 },
    ],
    notes: [
      'GATE — IT DOES NOT FIGHT AND IT DOES NOT NEED TO. Every Clock it survives, it marks',
      'one more district clear, and the search narrows. It is a TIMER wearing a person.',
      'Let it work for four Clocks and it finds the Loong regardless of what the party does.',
      '',
      'WEAK SYSTEM — the map, not the demon. Burn the map and a century of survey work is',
      'gone; it will begin again, patiently, and the party has bought a floor\'s worth of',
      'time. Killing the Cartographer without taking the map leaves the map to be inherited.',
      '',
      'Attacks: 9 Bleed, defensive, purely to be left alone to work.',
      '',
      'CARVE: Jade + Inscribed Clay (its instruments).',
    ].join('\n'),
  }),

  BOSS('The One Who Would Be Human', {
    size: 'Large',
    color: '#a03a6a',
    description: 'HARD ROUTE BOSS. It leads the hunt for the Loong because the Loong is making a cure, and it wants to be cured more than anything has ever wanted anything. NAME IS A PROPOSAL.',
    bodyParts: [
      { name: 'Head',        maxHp: 22 },
      { name: 'Torso',       maxHp: 60 },
      { name: 'Arm L',       maxHp: 18 },
      { name: 'Arm R',       maxHp: 18 },
      { name: 'Leg L',       maxHp: 19 },
      { name: 'Leg R',       maxHp: 19 },
      { name: 'The Wanting', maxHp: 14 },
    ],
    notes: [
      'THE CANON BEAT (Compendium §4.4): the Loong hides in the capital preventing the',
      'disease from spreading; demons hunt it as a cure for their nature; the party helps',
      'it develop the cure and protects it.',
      '',
      'IT IS NOT A VILLAIN AND THE PARTY SHOULD STRUGGLE TO TREAT IT AS ONE. It wants the',
      'same thing the Petitioner wants and the same thing Nullrot gives away for free.',
      'The difference is that it will take the Loong apart to get it, and the Loong is a',
      'friend now.',
      '',
      'GATE — THE WANTING (14). It cannot be reasoned with, driven off, or made to stop',
      'while the Wanting is intact; every Clock it survives it moves one space closer to',
      'the Loong regardless of what is in the way, and no effect can reposition it.',
      '',
      'WEAK SYSTEM — GIVE IT WHAT IT WANTS. The Loong\'s cure works on demons, and the',
      'Loong will say so if asked. Offering it ends the fight outright, permanently, and',
      'costs the party nothing but the thing they came to protect being used. Destroying',
      'the Wanting (14) is the other answer, and it makes the fight winnable and the demon',
      'a corpse that died reaching for a cure.',
      '',
      'THE THIRD ANSWER, IF THE PARTY WORKED IT OUT: there is enough cure for both. Nobody',
      'in this city has ever considered that, because nobody in this city shares anything.',
      '',
      'Attacks: 12 Crush, and it steps over its own dead to keep moving.',
      '',
      '=== THE LOONG IS HERE, AND IT IS THE REASON THE CAPITAL IS STILL STANDING ===',
      'Same 300-point block, Warden Form Large / Loong Form Huge, truth-sense intact.',
      'It has been holding the plague back from the capital for a century by being in it.',
      'IT CANNOT FIGHT WITHOUT LEAVING, and leaving means the disease moves. That is the',
      'escort problem from F2 inverted: last floor the party moved it to safety, this',
      'floor the party must keep it STILL while everything comes to it.',
      'If it Turns, the hunt ends instantly and so does the quarantine.',
      '',
      'CARVE: none. If it survives and the cure is finished, it sheds a scale (M-5).',
    ].join('\n'),
    phases: [
      { name: 'The Search', hpThreshold: 'the encounter opens here',
        description: 'It has not found the Loong yet. Every Clock it closes one space toward wherever the Loong actually is, and it cannot be misdirected — it is not tracking, it is wanting. The party is fighting a compass.' },
      { name: 'Found', hpThreshold: 'it reaches the Loong, or <=110 total',
        description: '12 Crush, and it goes through contestants rather than around them. It will not target anyone who steps aside, and it says so, which is worse.' },
      { name: 'Reaching', hpThreshold: '<=40 total, or the Wanting destroyed',
        description: 'With the Wanting gone it stops, and asks — for the first time — instead of taking. With the Wanting intact it keeps crawling toward the Loong at 1 space a Moment until something ends it. Either way the table will remember which one they caused.' },
    ],
  }),
];
