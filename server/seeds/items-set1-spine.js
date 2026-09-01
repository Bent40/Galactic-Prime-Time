/**
 * SET 1 SPINE — the nine item concepts of rulebook/set1-item-concepts.md, statted.
 * 26 templates: 9 concepts x 3 floors, less C-9's F1 (the hunt has not started).
 *
 *   node seed-items.js --file ./seeds/items-set1-spine.js            (dry run)
 *   node seed-items.js --file ./seeds/items-set1-spine.js --apply
 *
 * BAND UNITS (level-budget L-22). Damage numbers do NOT change from F1 to F3 —
 * the band multiplies every native number on a floor equally, so it cancels
 * inside the floor. What changes across the three readings is CAPABILITY.
 * Do not "scale" these numbers per floor; that is the units error L-22 dissolved.
 *
 * The material's trait requirement RIDES INTO the craft (L-14), so anything
 * carved from Beastbone asks Physique 3. Traits buy the right to hold a thing,
 * never extra damage.
 *
 * W-6 finding, honoured: 88% of surveyed myth weapons are categorical and not
 * one is a flat stat-bonus item. Seven of these nine deal no damage at all.
 */

const uses = (n) => ({ max: n, current: n });

// route + floor helpers — every entry is stamped with both, for pool queries
const S = (route, floor) => ({
  source: 'set1-spine',
  themes: [`${route}-route`, `floor-${floor}`, 'set1-spine'],
});

module.exports = [

  // ───────── C-1 · Easy x loot · Leak-Vial ─────────
  { name: 'Seepage, Sealed', icon: '🫙', category: 'Consumables', subtype: 'Consumable', tier: 'Basic',
    ...S('easy', 1), uses: uses(1),
    requirements: '1 Moment Cost.',
    specialEffects: 'F1 Forest band (x2). UNSORTED — flip a coin. Heads: removes Infected from one body part at any tier. Tails: applies Infected T1 to the part it touched, or escalates that part one tier if already Infected.',
    description: 'What seeps out of a sealed door is both, unseparated.' },

  { name: 'Seepage, Thinned', icon: '💧', category: 'Consumables', subtype: 'Consumable', tier: 'Quality',
    ...S('easy', 2), uses: uses(1),
    requirements: '1 Moment Cost. Mind 6 to read which one it is BEFORE drinking.',
    specialEffects: 'F2 Desert band (x4). Same coin flip as Seepage, Sealed — unless the bearer has Mind 6, who sees the tell and knows the result in advance. Seventy years of Doorward feeding thinned it.',
    description: 'Thin enough to see through, if anyone thinks to look.' },

  { name: 'Seepage, Sorted', icon: '⚗️', category: 'Consumables', subtype: 'Consumable', tier: 'Superior',
    ...S('easy', 3), uses: uses(2),
    requirements: '1 Moment Cost.',
    specialEffects: 'F3 Capital band (x8). NO FLIP — two labelled vials. Cure: clears Infected on one part at any tier. Plague: coats a weapon for 1 Clock, hits apply Infected T1.',
    description: 'Same object. Knowing what it is turned a gamble into a tool.' },

  // ───────── C-2 · Easy x crafted · the Oathbreaker line ─────────
  { name: 'The Unsworn Sprig', icon: '🌿', category: 'Weapons', subtype: 'Bladed', tier: 'Quality',
    ...S('easy', 1),
    attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Bleed'],
    requirements: 'Charm 8, 1 Moment Cost. Light Small.',
    specialEffects: 'F1 Forest band (x2). OATHBREAKER — damages creatures immune or warded against normal harm.',
    description: 'Oathbreaker is a claim, not an edge. You are owed the cut.' },

  { name: "The Sun's Dart", icon: '☀️', category: 'Weapons', subtype: 'Thrown', tier: 'Superior',
    ...S('easy', 2),
    attackTypes: ['Single Target'], range: '2 line', damage: '2', damageType: ['Burn'],
    requirements: 'Charm 8, Physique 3, 1 Moment Cost. Light Large / thrown.',
    specialEffects: 'F2 Desert band (x4). OATHBREAKER, and it burns. PUNISHES A COLD WIELDER — thrown while carrying any Chilled condition, the Burn lands on the thrower instead.',
    description: "Xiuhcoatl. The sun's dart is owed to nobody." },

  { name: "Andvari's Cut", icon: '🪙', category: 'Weapons', subtype: 'Crush', tier: 'Exceptional',
    ...S('easy', 3),
    attackTypes: ['Single Target'], range: '1', damage: '3', damageType: ['Bleed', 'Crush'],
    requirements: 'Charm 8, 1 Moment Cost. Heavy Small — reads above its class baseline (Cursed Gold carries the highest numbers in band).',
    specialEffects: 'F3 Capital band (x8). OATHBREAKER. AND IT WANTS THINGS — at the end of any Clock in which it was swung, it takes one item from the bearer\'s inventory (GM picks). Recoverable only by leaving it sheathed for a full floor.',
    description: 'A claim-weapon made of the metal that makes claims.' },

  // ───────── C-3 · Easy x story · The Name ─────────
  { name: 'The Mural Fragment', icon: '🧱', category: 'Key Items', subtype: 'Trinket', tier: 'Crude',
    ...S('easy', 1),
    requirements: 'Physique 2 — dense, and it does not care that you are tired.',
    specialEffects: 'F1 Forest band (x2). NO EFFECT. It is a piece of a wall with part of an instruction on it, and it is unreadable.',
    description: 'The story has not happened yet.' },

  { name: "The Doorward's Answer", icon: '🪨', category: 'Key Items', subtype: 'Tool', tier: 'Quality',
    ...S('easy', 2),
    requirements: '1 Moment Cost. Once per Clock.',
    specialEffects: 'F2 Desert band (x4). Name a creature aloud and it must answer ONE question truthfully. It compels an answer and nothing else — no obedience, no pause, no mercy.',
    description: 'It warns you aloud, and it is telling the truth.' },

  { name: 'The Name', icon: '📜', category: 'Key Items', subtype: 'Tool', tier: 'Exceptional',
    ...S('easy', 3),
    requirements: '1 Moment Cost. Once per creature, ever.',
    specialEffects: 'F3 Capital band (x8). Speak it and the target becomes ANSWERABLE — for 1 Clock it cannot attack and must engage. GRANTS THE MARK "Witness" (rulebook 18.4) — permanent.',
    description: 'Only recognition was ever missing.' },

  // ───────── C-4 · Medium x loot · Clan-Token ─────────
  { name: "Arsonist's Knuckle", icon: '🦴', category: 'Misc', subtype: 'Trinket', tier: 'Crude',
    ...S('medium', 1),
    requirements: 'Physique 3.',
    specialEffects: 'F1 Forest band (x2). NO KNOWN EFFECT. It is already a clan token; it will not behave like one until someone recognises it.',
    description: 'Nobody knows what it is, including you.' },

  { name: "The Death That Didn't Take", icon: '⭐', category: 'Misc', subtype: 'Trinket', tier: 'Quality',
    ...S('medium', 2),
    requirements: 'Once per scene.',
    specialEffects: 'F2 Desert band (x4). Demons of that clan MUST ACKNOWLEDGE you — one free parley per scene, and they cannot open hostilities without first stating a grievance aloud. COST: it names you to that clan in both directions; enemies of the clan read it too.',
    description: 'A demon dies only when its clan dies. This is the proof.' },

  { name: 'Jade Acknowledgment', icon: '🟩', category: 'Misc', subtype: 'Trinket', tier: 'Superior',
    ...S('medium', 3),
    requirements: 'Once per scene, plus standing.',
    specialEffects: 'F3 Capital band (x8). As The Death That Didn\'t Take, and it is a CREDENTIAL IN THE HIGH COURT — admittance to rooms that have guards on them.',
    description: 'A door into a palace that does not understand itself.' },

  // ───────── C-5 · Medium x crafted · Brand-Iron ─────────
  { name: 'The Brand, as Given', icon: '🔥', category: 'Tools', subtype: 'Tool', tier: 'Basic',
    ...S('medium', 1),
    requirements: 'Physique 3. One bearer — no transfer.',
    specialEffects: 'F1 Forest band (x2). Immunity to noble-class presence and Dissolution from the granting entity. Cannot be given away, sold or copied. COST: the mark is public, and readable by anyone who knows the script.',
    description: 'She may still choose to afflict you. That is protection too.' },

  { name: 'The Portable Brand', icon: '🦂', category: 'Tools', subtype: 'Tool', tier: 'Quality',
    ...S('medium', 2), uses: uses(1),
    requirements: 'Physique 2 (Scorpion Chitin is light: -1 Physique). 1 Moment to apply.',
    specialEffects: 'F2 Desert band (x4). As The Brand, as Given — and it can be APPLIED ONCE to another contestant. CRAFT RIDER: commissioned politely it is clean; coerced, it reads not merely as protected but as WHOSE, naming its granter to factions you would rather it did not.',
    description: 'Immunity you can hand to someone else is a different item.' },

  { name: 'The Brand, Set in Silver', icon: '🥈', category: 'Tools', subtype: 'Tool', tier: 'Superior',
    ...S('medium', 3), uses: uses(1),
    requirements: '1 Moment to apply.',
    specialEffects: 'F3 Capital band (x8). As The Portable Brand, and PERMANENT — it becomes part of the body and cannot be removed. A replaced body part carries it across the replacement.',
    description: "Nuada's arm. The mark stops being something you wear." },

  // ───────── C-6 · Medium x story · The Debt ─────────
  { name: 'A Cord, Given', icon: '🧵', category: 'Key Items', subtype: 'Trinket', tier: 'Crude',
    ...S('medium', 1),
    requirements: 'REFUSES the Mark "Witness" (rulebook 18.4) — permanent, one-way.',
    specialEffects: 'F1 Forest band (x2). ZERO EFFECT, deliberately. IF SHE WAS KILLED INSTEAD this is a keepsake off a corpse and it stays inert forever — no redemption path. It is a memento, not a punishment.',
    description: 'Pressed into your hand by a frightened child.' },

  { name: "The Queen's Token", icon: '🔑', category: 'Key Items', subtype: 'Trinket', tier: 'Superior',
    ...S('medium', 2),
    requirements: 'REFUSES the Mark "Witness". Once per scene.',
    specialEffects: 'F2 Desert band (x4). Passage past any guard of the crown, once per scene. It also carries her permission — a branded bearer reads what she wrote with her own authority.',
    description: 'The same worthless cord. The story is what changed.' },

  { name: 'The Debt', icon: '📯', category: 'Key Items', subtype: 'Trinket', tier: 'Exceptional',
    ...S('medium', 3),
    requirements: 'REFUSES the Mark "Witness".',
    specialEffects: 'F3 Capital band (x8). A STANDING CLAIM on the crown of the capital — not a favour to be spent, a debt that is owed and known to be owed. The capital attaches to the Lounge after F3, and this is what it attaches by.',
    description: 'The object never changed. What was done with it did.' },

  // ───────── C-7 · Hard x loot · Crystal Shard ─────────
  { name: 'Seeded Edge', icon: '🖤', category: 'Consumables', subtype: 'Consumable', tier: 'Basic',
    ...S('hard', 1), uses: uses(1),
    requirements: 'Reflexes 4 — it chips, and the chips go somewhere. 1 Moment to apply.',
    specialEffects: 'F1 Forest band (x2). Coats a weapon for 1 Clock: hits apply Infected T1, and the razor edge adds +1 damage. IN ANY CLOCK WHERE YOU ARE STRUCK, you take Infected T1 as well. The part chips on an attack roll of 1 (GM).',
    description: 'It does not distinguish between the party and the room.' },

  { name: "The Pilgrim's Shard", icon: '🔷', category: 'Consumables', subtype: 'Consumable', tier: 'Quality',
    ...S('hard', 2), uses: uses(1),
    requirements: '1 Moment Cost.',
    specialEffects: 'F2 Desert band (x4). As Seeded Edge. OR break it in an enclosed space: the space fills with Crystal Spore Mist — inhalation is Infected PLUS Suffocation, for everyone in it. Announce before initiative.',
    description: 'A party that skipped Hard at Floor 1 has no idea what this is.' },

  { name: 'The Warded Vessel', icon: '🏺', category: 'Consumables', subtype: 'Consumable', tier: 'Superior',
    ...S('hard', 3), uses: uses(3),
    requirements: '1 Moment Cost.',
    specialEffects: 'F3 Capital band (x8). The shard carried SAFELY — the ward holds until you open it and it does not turn on the bearer while sealed. Opening it spends a use and behaves exactly as The Pilgrim\'s Shard.',
    description: 'Getting in is easy. Getting out with it is the ask.' },

  // ───────── C-8 · Hard x crafted · Kin-Carve ─────────
  { name: 'Warden-Carve', icon: '🦴', category: 'Weapons', subtype: 'Crush', tier: 'Quality',
    ...S('hard', 1),
    attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Bleed', 'Crush'],
    requirements: 'Physique 3, 1 Moment Cost. Heavy Small. REFUSES the tag "Animal Planet" (lifts if the tag fades).',
    specialEffects: 'F1 Forest band (x2). Beastbone Vicious: +1 Bleed rider. GRANTS THE MARK "Dragon Slayer" — permanent, and it does NOT lift. FUSION: every Clock in which this lands a killing blow, mark 1 Kinship. At 3, one body part changes permanently. At 6, demons read you as a source rather than a contestant. No removal.',
    description: 'Fusion has not started, and nobody warned you.' },

  { name: 'Kin-Carve', icon: '🗡️', category: 'Weapons', subtype: 'Bladed', tier: 'Superior',
    ...S('hard', 2),
    attackTypes: ['Single Target', 'Line'], range: '2 line/arc', damage: '3', damageType: ['Bleed', 'Crush'],
    requirements: 'Physique 5, 1 Moment Cost. Heavy Large. REFUSES the tag "Animal Planet".',
    specialEffects: 'F2 Desert band (x4). BYPASS — damages what the plague has warded: crystal, crystallized hosts, anything the Reservoir has sealed. Grants "Dragon Slayer". Fusion track as Warden-Carve.',
    description: 'Carrying its kin through a demon hunt is a signal flare.' },

  { name: 'Kin-Carve, Imperial', icon: '🐉', category: 'Weapons', subtype: 'Bladed', tier: 'Exceptional',
    ...S('hard', 3),
    attackTypes: ['Single Target', 'Line'], range: '2 line/arc', damage: '3', damageType: ['Bleed', 'Crush'],
    requirements: 'Physique 5, 1 Moment Cost. Heavy Large. REFUSES the tag "Animal Planet".',
    specialEffects: 'F3 Capital band (x8). As Kin-Carve. KINSHIP ACCRUES TWICE AS FAST in the capital, where the blood is worth the most.',
    description: 'The city hunts the Loong for its blood. You walked in wearing some.' },

  // ───────── C-9 · Hard x story · The Horn (no F1 — the hunt has not started) ─────────
  { name: 'The Horn, taken', icon: '📢', category: 'Tools', subtype: 'Tool', tier: 'Quality',
    ...S('hard', 2),
    requirements: '1 Moment Cost. Once per Clock.',
    specialEffects: 'F2 Desert band (x4). Name a target and sound it: a hunting pack arrives next Clock, wherever that target is. IT CANNOT BE SOUNDED WITHOUT A NAME. Taken instead of broken — destroying it also ends the hunt and leaves you holding nothing.',
    description: 'The village lives, and you hold the reason it was in danger.' },

  { name: 'The Horn, turned', icon: '🔔', category: 'Tools', subtype: 'Tool', tier: 'Superior',
    ...S('hard', 3),
    requirements: '1 Moment Cost. Once per Clock; the capital effect once, ever.',
    specialEffects: 'F3 Capital band (x8). As The Horn, taken — and sounded INSIDE THE CAPITAL the city\'s own hunters answer it. Once, you point the capital\'s hunt at a target of your choosing.',
    description: "The city's own instrument, turned around." },
];
