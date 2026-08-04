/**
 * Item Drafting — Batch A seed data (blessed by owner 2026-08-04).
 * Source of truth: rulebook/item-drafting-batch-a.md. Consumed by seed-items.js.
 *
 * Conventions match the live library: `damage` is a bare number string with
 * `damageType` carrying the type(s); Moment costs live in `requirements`
 * (precedent: Stun Net "2 Moment Cost"); condition counters reduce their
 * condition by one tier per use.
 *
 * NOT here on purpose: a "Basic Weapon Creation Kit" — the live library's
 * "Basic Weapon Coupon" + "Silver Modifier Coupon" ARE that kit split into two
 * vouchers (passover ID-4 unification); no third bookkeeping item needed.
 */

const uses = (n) => ({ max: n, current: n });

// ——— A-1: Bronze bulk-utility consumable pool (20) ———————————————————————
const A1 = [
  { name: 'Bandage', icon: '🩹', category: 'Consumables', tier: 'Basic', subtype: 'Consumable', uses: uses(2),
    specialEffects: '-1 Bleeding tier per use.',
    description: 'Corporation-brand gauze. Smells like victory and antiseptic.' },
  { name: 'Antitoxin', icon: '🧪', category: 'Consumables', tier: 'Basic', subtype: 'Consumable', uses: uses(2),
    specialEffects: '-1 Poison tier per use.' },
  { name: 'Burn Gel', icon: '🧴', category: 'Consumables', tier: 'Basic', subtype: 'Consumable', uses: uses(2),
    specialEffects: '-1 Burn tier per use.' },
  { name: 'Thermal Pack', icon: '♨️', category: 'Consumables', tier: 'Basic', subtype: 'Consumable', uses: uses(2),
    specialEffects: '-1 Chill tier per use.' },
  { name: 'Antiseptic Wash', icon: '🧼', category: 'Consumables', tier: 'Basic', subtype: 'Consumable', uses: uses(2),
    specialEffects: '-1 Infection tier per use.' },
  { name: 'Smelling Salts', icon: '🧂', category: 'Consumables', tier: 'Basic', subtype: 'Consumable', uses: uses(2),
    specialEffects: '-1 Shock tier per use. Works on Shock T1-T2 only.' },
  { name: 'Antivenom Injector', icon: '💉', category: 'Consumables', tier: 'Quality', subtype: 'Consumable', uses: uses(1),
    specialEffects: 'Removes Poison entirely, any tier.' },
  { name: 'Stimpack', icon: '🧬', category: 'Consumables', tier: 'Quality', subtype: 'Consumable', uses: uses(1),
    specialEffects: '+1 HP to one damaged body part (not past max).' },
  { name: 'Adrenaline Shot', icon: '⚡', category: 'Consumables', tier: 'Quality', subtype: 'Consumable', uses: uses(1),
    specialEffects: 'Exhausted does not advance this Clock.' },
  { name: 'Ration Pack', icon: '🍱', category: 'Consumables', tier: 'Crude', subtype: 'Consumable', uses: uses(3),
    description: 'Food. No Meal benefits — the Kitchen guards its turf.' },
  { name: 'Water Flask', icon: '🍶', category: 'Consumables', tier: 'Crude', subtype: 'Consumable', uses: uses(3),
    description: 'Water. Free refills at the Lounge.' },
  { name: 'Glow Stick', icon: '✨', category: 'Consumables', tier: 'Crude', subtype: 'Consumable', uses: uses(3),
    specialEffects: 'Light for about 1 Clock per stick.' },
  { name: 'Torch', icon: '🔥', category: 'Consumables', tier: 'Crude', subtype: 'Consumable', uses: uses(2),
    specialEffects: 'Light. Can ignite flammables (1 Burn on touch).' },
  { name: 'Chalk', icon: '🖍️', category: 'Consumables', tier: 'Crude', subtype: 'Consumable', uses: uses(5),
    description: "Marking. The dungeon-crawler's autosave." },
  { name: 'Flare', icon: '🎇', category: 'Consumables', tier: 'Basic', subtype: 'Consumable', uses: uses(1),
    specialEffects: 'Signal + bright light. 1-in-6: nearby enemies become Alerted.' },
  { name: 'Smoke Vial', icon: '💨', category: 'Consumables', tier: 'Basic', subtype: 'Consumable', uses: uses(1),
    specialEffects: '2-space smoke cloud, breaks line of sight for 1 Clock.' },
  { name: 'Spare Magazine', icon: '🔫', category: 'Consumables', tier: 'Basic', subtype: 'Charged gear', uses: uses(1),
    specialEffects: 'One reload for a light ranged weapon.' },
  { name: 'Heavy Cell', icon: '🔋', category: 'Consumables', tier: 'Basic', subtype: 'Charged gear', uses: uses(1),
    specialEffects: 'One reload for a heavy ranged weapon.' },
  { name: 'Patch Kit', icon: '🧵', category: 'Consumables', tier: 'Basic', subtype: 'Consumable', uses: uses(2),
    specialEffects: 'Field-repairs a damaged (not destroyed) item.' },
  { name: 'Rope (20 m)', icon: '🪢', category: 'Tools', tier: 'Basic', subtype: 'Tool',
    description: "It's rope. It always matters." },
].map(it => ({ boxTiers: ['Bronze'], themes: [], source: 'batch-a', ...it }));

// ——— A-2: Bronze pity-gear list (12) + Bronze-shop kits (2) ————————————————
const A2 = [
  { name: 'Camp Knife', icon: '🔪', category: 'Weapons', tier: 'Crude', subtype: 'Bladed',
    attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Bleed'],
    requirements: '1 Physique, 1 Moment Cost' },
  { name: 'Rebar Club', icon: '🏏', category: 'Weapons', tier: 'Crude', subtype: 'Crush',
    attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Crush'],
    requirements: '2 Physique, 1 Moment Cost' },
  { name: 'Scrap Spear', icon: '🔱', category: 'Weapons', tier: 'Crude', subtype: 'Bladed',
    attackTypes: ['Line'], range: '2', damage: '2', damageType: ['Bleed'],
    requirements: '3 Physique, 1 Moment Cost, 2 hands + adjacent empty radius' },
  { name: 'Sling', icon: '🪃', category: 'Weapons', tier: 'Crude', subtype: 'Ranged',
    attackTypes: ['Single Target'], range: '5', rpm: 1, magazine: 1, damage: '1', damageType: ['Crush'],
    requirements: '2 Reflexes, steady ground',
    specialEffects: 'Stones are everywhere: reload is 1 Moment, one hand.' },
  { name: 'Duct-Tape Machete', icon: '🗡️', category: 'Weapons', tier: 'Basic', subtype: 'Bladed',
    attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Bleed'],
    requirements: '1 Physique, 1 Moment Cost',
    description: 'The tape is load-bearing. Sponsor logo on the grip.' },
  { name: 'Riot Baton', icon: '🦯', category: 'Weapons', tier: 'Basic', subtype: 'Crush',
    attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Crush'],
    requirements: '2 Physique, 1 Moment Cost' },
  { name: 'Show-Brand Buckler', icon: '🛡️', category: 'Equipment', tier: 'Basic', subtype: 'Shield',
    resistance: 'Bleed 1',
    description: 'Occupies a hand. Grants its resist to the part the wielder defends (GM call).' },
  { name: 'Padded Vest', icon: '🦺', category: 'Equipment', tier: 'Basic', subtype: 'Armor',
    resistance: 'Crush 1', description: 'Torso slot.' },
  { name: 'Hard Hat', icon: '⛑️', category: 'Equipment', tier: 'Basic', subtype: 'Armor',
    resistance: 'Crush 1', description: 'Head slot.' },
  { name: 'Work Gloves', icon: '🧤', category: 'Equipment', tier: 'Basic', subtype: 'Armor',
    resistance: 'Bleed 1', description: 'Hands slot.' },
  { name: 'Multitool', icon: '🛠️', category: 'Tools', tier: 'Basic', subtype: 'Tool',
    specialEffects: 'Removes the improvised-tool Moment penalty on mechanical work.' },
  { name: 'Crowbar', icon: '⛏️', category: 'Tools', tier: 'Basic', subtype: 'Tool',
    attackTypes: ['Single Target'], range: '1', damage: '2', damageType: ['Crush'],
    requirements: '2 Physique when swung, 1 Moment Cost',
    specialEffects: 'Prying tool; swings like a Heavy Small weapon.' },
  { name: 'Crude Polish Kit', icon: '🧽', category: 'Consumables', tier: 'Crude', subtype: 'Kit', uses: uses(1),
    specialEffects: 'Downtime action at the Forge: polish one item up a tier. d6 — 1-3 fail (kit consumed, item untouched), 4-6 success (+1 tier). Works rungs up to Quality only.' },
  { name: 'Crude Weapon Creation Kit', icon: '🧰', category: 'Consumables', tier: 'Crude', subtype: 'Kit', uses: uses(1),
    specialEffects: 'Redeem: assemble any Crude base weapon of your choice.' },
].map(it => ({ boxTiers: ['Bronze'], themes: ['pity'], source: 'batch-a', ...it }));

// ——— A-4: The Incineradile Box (3) ————————————————————————————————————————
const A4 = [
  { name: 'Mycelium Core', icon: '🍄', category: 'Misc', tier: 'Crude', subtype: 'Growth',
    specialEffects: 'GROWTH — survives a floor with its carrier: +1 tier. Quality: 1 Burn resist (global). Superior: T1 Burn nullification. Exceptional: once per Clock, a disabled part of the carrier acts for 1 Moment.',
    description: 'Inert, warm, faintly pulsing. The network remembers.' },
  { name: 'Flamehide Wrap', icon: '🧣', category: 'Equipment', tier: 'Basic', subtype: 'Armor',
    resistance: 'Burn 1', description: 'Torso slot. Still smells faintly of the arena.' },
  { name: 'Fire Axe "Retired Hero"', icon: '🪓', category: 'Weapons', tier: 'Quality', subtype: 'Bladed',
    attackTypes: ['Single Target'], range: '1', damage: '3', damageType: ['Bleed'],
    requirements: '2 Physique, 1 Moment Cost',
    specialEffects: 'Arrives pre-affixed: Chilling (T1 Chill on hit) — attach the affix on grant. The 1-in-3 pre-affix rule, showcased; the irony is intentional.',
    description: 'Decommissioned station equipment. The plaque says "for valor."' },
].map(it => ({ boxTiers: ['Silver'], themes: ['incineradile', 'boss'], source: 'batch-a', ...it }));

// ——— A-5: Floor 1 found-box marquee items (4) ————————————————————————————
const A5 = [
  { name: 'Sprig Wand', icon: '🌿', category: 'Tools', tier: 'Quality', subtype: 'Limited-magic', uses: uses(3),
    specialEffects: 'Casts Entangle: target is Slowed by grasping vines in a 2-space patch for 1 Clock.',
    boxTiers: ['Silver'], themes: ['floor-1'],
    description: 'The Silver 1-in-10 limited-magic slot for Floor 1.' },
  { name: 'Chained Mirror-Shard', icon: '🪞', category: 'Equipment', tier: 'Quality', subtype: 'Trinket',
    specialEffects: 'Once per Clock: see through the eyes of whoever last touched it.',
    boxTiers: ['Gold'], themes: ['floor-1', 'easy-route'],
    description: 'A sliver of silvered glass on a short chain. It remembers being held.' },
  { name: 'Ashen Lantern', icon: '🏮', category: 'Tools', tier: 'Quality', subtype: 'Tool',
    specialEffects: 'Its light renders emotion visible — fear reads as smoke, love as embers. Brand-dulled souls cast almost nothing.',
    boxTiers: ['Gold'], themes: ['floor-1', 'medium-route'],
    description: 'The wick never quite goes out. The ash never quite settles.' },
  { name: "Citizen's Signet", icon: '💍', category: 'Equipment', tier: 'Quality', subtype: 'Trinket',
    specialEffects: 'The crystallized citizens react to its bearer — doors open; the Loong hesitates.',
    boxTiers: ['Gold'], themes: ['floor-1', 'hard-route'],
    description: 'A signet of office from a city that stopped mid-sentence.' },
].map(it => ({ source: 'batch-a', ...it }));

module.exports = [...A1, ...A2, ...A4, ...A5];
