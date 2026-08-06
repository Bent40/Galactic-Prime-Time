/**
 * Item Drafting — Batch B seed data (PROPOSED — sync to rulebook/item-drafting-batch-b.md
 * trims before applying). Consumed by seed-items.js via:
 *   node seed-items.js --file ./seeds/items-batch-b.js
 *
 * Conventions per Batch A: bare-number `damage` + `damageType` array; Moment
 * costs and trait requirements in `requirements`; limited-magic items CAST a
 * named skill without teaching it; tomes TEACH (skill acquirable at L0 per
 * §4.4); armor flat resists are Bleed/Crush/Burn only (§10).
 */

const uses = (n) => ({ max: n, current: n });

// ——— B-1: base weapons (16) — Silver pool, Quality also Gold ———————————————
const W = (it) => ({ category: 'Weapons', source: 'batch-b', themes: [], boxTiers: it.tier === 'Basic' ? ['Silver'] : ['Silver', 'Gold'], ...it });
const B1 = [
  W({ name: 'Dagger', icon: '🗡️', tier: 'Basic', subtype: 'Bladed', attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Bleed'], requirements: '1 Physique, 1 Moment Cost' }),
  W({ name: 'Boning Knife', icon: '🔪', tier: 'Basic', subtype: 'Bladed', attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Bleed'], requirements: '1 Physique, 1 Moment Cost' }),
  W({ name: 'Stiletto', icon: '🗡️', tier: 'Quality', subtype: 'Bladed', attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Bleed'], requirements: '1 Physique, 1 Moment Cost', specialEffects: '+1 Bleed against Exposed targets.' }),
  W({ name: 'Spear', icon: '🔱', tier: 'Basic', subtype: 'Bladed', attackTypes: ['Line'], range: '2', damage: '2', damageType: ['Bleed'], requirements: '3 Physique, 1 Moment Cost, 2 hands + adjacent empty radius' }),
  W({ name: 'Rapier', icon: '🤺', tier: 'Quality', subtype: 'Bladed', attackTypes: ['Line'], range: '2', damage: '2', damageType: ['Bleed'], requirements: '3 Physique, 1 Moment Cost, 2 hands + adjacent empty radius', specialEffects: 'First hit each Clock deals +1 Bleed.' }),
  W({ name: "Hammer", icon: '🔨', tier: 'Basic', subtype: 'Crush', attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Crush'], requirements: '2 Physique, 1 Moment Cost' }),
  W({ name: 'Pipe Wrench', icon: '🔧', tier: 'Quality', subtype: 'Crush', attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Crush'], requirements: '2 Physique, 1 Moment Cost', specialEffects: 'Doubles as proper tools — no improvised-tool penalty on mechanical work.' }),
  W({ name: 'Hand Axe', icon: '🪓', tier: 'Quality', subtype: 'Bladed', attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Bleed', 'Crush'], requirements: '2 Physique, 1 Moment Cost', specialEffects: 'Double damage to objects and terrain.' }),
  W({ name: 'Maul', icon: '⚒️', tier: 'Basic', subtype: 'Crush', attackTypes: ['Arc'], range: '2', damage: '3', damageType: ['Crush'], requirements: '5 Physique, 2 Moment Cost, 2 hands + adjacent empty radius' }),
  W({ name: 'Greatsword', icon: '⚔️', tier: 'Quality', subtype: 'Bladed', attackTypes: ['Line', 'Arc'], range: '2', damage: '3', damageType: ['Bleed', 'Crush'], requirements: '5 Physique, 1-2 Moment Cost, 2 hands + adjacent empty radius', specialEffects: 'On kill, one adjacent enemy takes 1 Bleed.' }),
  W({ name: 'Autocrossbow', icon: '🏹', tier: 'Basic', subtype: 'Ranged', attackTypes: ['Single Target'], range: '5', rpm: 2, magazine: 6, damage: '1', damageType: ['Bleed'], requirements: '2 Reflexes, steady ground', description: 'Damage per round (§12.2).' }),
  W({ name: 'Machine Pistol', icon: '🔫', tier: 'Quality', subtype: 'Ranged', attackTypes: ['Single Target'], range: '6', rpm: 3, magazine: 6, damage: '1', damageType: ['Bleed'], requirements: '2 Reflexes, steady ground', description: 'Damage per round (§12.2).' }),
  W({ name: 'Shotgun', icon: '💥', tier: 'Basic', subtype: 'Ranged', attackTypes: ['Cone'], range: '5', rpm: 1, magazine: 2, damage: '4', damageType: ['Crush'], requirements: '4 Reflexes, 2 hands, steady ground' }),
  W({ name: 'Rifle', icon: '🎯', tier: 'Quality', subtype: 'Ranged', attackTypes: ['Line'], range: '5', rpm: 1, magazine: 2, damage: '4', damageType: ['Bleed'], requirements: '4 Reflexes, 2 hands, steady ground', specialEffects: 'Line shot pierces up to 2 targets.' }),
  W({ name: "Grappler's Wraps", icon: '🥊', tier: 'Quality', subtype: 'Martial', attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Crush'], requirements: '1 Moment Cost', specialEffects: '+1 effective Physique for grapple initiation (§13).' }),
  W({ name: 'Throwing Irons', icon: '🪃', tier: 'Basic', subtype: 'Thrown', attackTypes: ['Thrown'], range: 'Physique', damage: '2', damageType: ['Bleed'], qty: 3, requirements: '1 Moment Cost' }),
];

// ——— B-2: armor & shields (11) — Silver pool, Quality also Gold ————————————
const A = (it) => ({ category: 'Equipment', source: 'batch-b', themes: [], boxTiers: it.tier === 'Basic' ? ['Silver'] : ['Silver', 'Gold'], ...it });
const B2 = [
  A({ name: 'Fire Helmet', icon: '⛑️', tier: 'Basic', subtype: 'Armor', resistance: 'Burn 1', description: 'Head slot.' }),
  A({ name: 'Insulated Coat', icon: '🧥', tier: 'Basic', subtype: 'Armor', resistance: 'Burn 1', description: 'Torso slot.' }),
  A({ name: 'Flak Sleeves', icon: '💪', tier: 'Basic', subtype: 'Armor', resistance: 'Bleed 1', description: 'Arms slot.' }),
  A({ name: 'Grip Boots', icon: '🥾', tier: 'Basic', subtype: 'Armor', resistance: 'Crush 1', description: 'Feet slot.' }),
  A({ name: 'Sturdy Belt', icon: '🎽', tier: 'Basic', subtype: 'Armor', resistance: 'Crush 1', description: 'Accessory slot.' }),
  A({ name: 'Riot Vest', icon: '🦺', tier: 'Quality', subtype: 'Armor', resistance: 'Crush 2', description: 'Torso slot.' }),
  A({ name: "Duelist's Coat", icon: '🧥', tier: 'Quality', subtype: 'Armor', resistance: 'Bleed 2', description: 'Torso slot.' }),
  A({ name: 'Fireproof Boots', icon: '🔥', tier: 'Quality', subtype: 'Armor', resistance: 'Burn 2', description: 'Feet slot.' }),
  A({ name: 'Pauldrons', icon: '🛡️', tier: 'Quality', subtype: 'Armor', resistance: 'Bleed 1, Crush 1', description: 'Arms slot.' }),
  A({ name: 'Combat Visor', icon: '🕶️', tier: 'Quality', subtype: 'Armor', resistance: 'Bleed 1, Crush 1', description: 'Head slot.' }),
  A({ name: 'Tower Shield', icon: '🛡️', tier: 'Quality', subtype: 'Shield', resistance: 'Crush 2', description: 'Occupies a hand; resist goes to the part the wielder defends (GM call).' }),
];

// ——— B-3: tools (8) — Silver pool ——————————————————————————————————————————
const T = (it) => ({ category: 'Tools', subtype: 'Tool', source: 'batch-b', themes: [], boxTiers: it.tier === 'Basic' ? ['Silver'] : ['Silver', 'Gold'], ...it });
const B3 = [
  T({ name: 'Lockpick Set', icon: '🗝️', tier: 'Basic', specialEffects: 'Proper tools for locks (pairs with the Lockpicking skill).' }),
  T({ name: "Climber's Kit", icon: '🧗', tier: 'Basic', specialEffects: 'Rope, harness, chocks — no improvised penalty on climbs.' }),
  T({ name: "Spotter's Scope", icon: '🔭', tier: 'Basic', specialEffects: 'Far detail; helps called shots and recon (GM adjudicated).' }),
  T({ name: 'Signal Kit', icon: '🪞', tier: 'Basic', specialEffects: 'Mirror, whistle, flags — party signaling at range.' }),
  T({ name: 'Trap Kit', icon: '🪤', tier: 'Quality', specialEffects: 'Set and disarm simple traps; removes Forced Action – Tool on trapwork.' }),
  T({ name: 'Directional Mic', icon: '🎙️', tier: 'Quality', specialEffects: 'Eavesdrop conversations at range.' }),
  T({ name: 'Disguise Kit', icon: '💄', tier: 'Quality', specialEffects: 'Disguise work (pairs with Camouflage); fools mobs, strains against elites.' }),
  T({ name: 'Field Tool Roll', icon: '🧰', tier: 'Quality', specialEffects: 'Counts as proper tools for any mechanical job.' }),
];

// ——— B-4: limited-magic (6) — the Silver 1-in-10 slot, also Gold filler ————
const M = (it) => ({ category: 'Tools', subtype: 'Limited-magic', tier: 'Quality', source: 'batch-b', themes: [], boxTiers: ['Silver', 'Gold'], ...it });
const B4 = [
  M({ name: 'Ember Orb', icon: '🔥', uses: uses(3), specialEffects: 'Casts Fire Ball without teaching it. Recharge at the Lounge (1 UT).' }),
  M({ name: 'Frost Lens', icon: '❄️', uses: uses(3), specialEffects: 'Casts Frost Ball without teaching it. Recharge at the Lounge (1 UT).' }),
  M({ name: 'Poison Sprayer', icon: '☠️', uses: uses(2), specialEffects: 'Casts Poison Ball without teaching it. Recharge at the Lounge (1 UT).' }),
  M({ name: 'Whisper Locket', icon: '📿', uses: uses(3), specialEffects: 'Casts Telepathy as a one-way message. Recharge at the Lounge (1 UT).' }),
  M({ name: 'Telekinetic Glove', icon: '🧤', uses: uses(2), specialEffects: 'Casts minor Telekinesis. Recharge at the Lounge (1 UT).' }),
  M({ name: 'Echo Box', icon: '🔊', uses: uses(3), specialEffects: 'Casts Voicebox — mimics any voice it has heard. Recharge at the Lounge (1 UT).' }),
];

// ——— B-5: Gold game-changers (8) ———————————————————————————————————————————
const G = (it) => ({ source: 'batch-b', themes: [], boxTiers: ['Gold'], ...it });
const B5 = [
  G({ name: 'Grapnel Rig', icon: '🪝', category: 'Tools', tier: 'Superior', subtype: 'Tool', specialEffects: 'Fire-and-reel repositioning; counts as steady ground while anchored.' }),
  G({ name: 'Deployable Cover', icon: '🚧', category: 'Tools', tier: 'Superior', subtype: 'Tool', specialEffects: '1 Moment: deploys a half-cover panel 2 spaces wide (§15).' }),
  G({ name: 'Personal Camera Drone', icon: '📹', category: 'Tools', tier: 'Quality', subtype: 'Tool', specialEffects: 'Your own camera: +1 Exposure gain while deployed. Fragile (1 HP).' }),
  G({ name: 'Exo-Brace Harness', icon: '🦾', category: 'Equipment', tier: 'Superior', subtype: 'Armor', specialEffects: '+1 effective Physique for requirements only.', description: 'Accessory slot.' }),
  G({ name: 'Adaptive Visor', icon: '🥽', category: 'Equipment', tier: 'Superior', subtype: 'Armor', resistance: 'Bleed 1, Crush 1, Burn 1', description: 'Head slot.' }),
  G({ name: 'Chainblade', icon: '⚙️', category: 'Weapons', tier: 'Superior', subtype: 'Bladed', attackTypes: ['Single Target'], range: '1', damage: '3', damageType: ['Bleed'], requirements: '2 Physique, 1 Moment Cost' }),
  G({ name: 'Modular Longarm', icon: '🎛️', category: 'Weapons', tier: 'Superior', subtype: 'Ranged', attackTypes: ['Single Target', 'Line'], range: '5', rpm: 2, magazine: 4, damage: '1', damageType: ['Bleed'], requirements: '2 Reflexes (light) / 4 Reflexes (heavy), steady ground', specialEffects: 'Swaps profiles as 1 Moment: light (1 Bleed/rd, RPM 2) or heavy (4 Bleed/rd, RPM 1).' }),
  G({ name: 'Aegis Projector', icon: '🔰', category: 'Equipment', tier: 'Superior', subtype: 'Trinket', specialEffects: 'Once per Clock: negate one incoming ranged round.', description: 'Accessory slot.' }),
];

// ——— B-6: skill tomes (6) — Gold pool ——————————————————————————————————————
const TOME = (name, icon, skill, kind) => ({
  name, icon, category: 'System Items', tier: 'Quality', subtype: 'Tome', uses: uses(1),
  specialEffects: `Consume in downtime: ${skill} becomes acquirable at L0 (§4.4 — this tome is the external source). GM grants via the skill library.`,
  description: `Teaches ${skill} (${kind}).`,
  source: 'batch-b', themes: [], boxTiers: ['Gold'],
});
const B6 = [
  TOME('Skill Tome: Fireballs for Beginners', '📕', 'Fire Ball', 'magic'),
  TOME('Skill Tome: The Frost Ball Primer', '📘', 'Frost Ball', 'magic'),
  TOME('Skill Tome: Mind Over Matter', '📓', 'Telekinesis', 'magic'),
  TOME('Skill Tome: Lockpicking for Dummies', '📗', 'Lockpicking', 'literal'),
  TOME('Skill Tome: Stop the Bleeding', '📙', 'Seal The Wound', 'literal'),
  TOME('Skill Tome: Bracing for Impact', '📔', 'Brace', 'literal'),
];

// ——— B-7: kits threaded through the pools (2) ——————————————————————————————
const B7 = [
  { name: 'Quality Weapon Creation Kit', icon: '🧰', category: 'Consumables', tier: 'Quality', subtype: 'Kit', uses: uses(1),
    specialEffects: 'Redeem: assemble any Quality base weapon + 1 prefix + 1 suffix of choice (up to Normal).',
    source: 'batch-b', themes: [], boxTiers: ['Silver', 'Gold'] },
  { name: 'Normal Polish Kit', icon: '🧽', category: 'Consumables', tier: 'Basic', subtype: 'Kit', uses: uses(1),
    specialEffects: 'Downtime at the Forge: polish one item up a tier. d6 — 1-2 fail (kit consumed, item untouched), 3-6 success (+1 tier). Works rungs up to Superior only.',
    source: 'batch-b', themes: [], boxTiers: ['Gold'] },
];

module.exports = [...B1, ...B2, ...B3, ...B4, ...B5, ...B6, ...B7];
