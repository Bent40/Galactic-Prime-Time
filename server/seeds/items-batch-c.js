/**
 * Item Drafting — Batch C seed data (PROPOSED — sync to rulebook/item-drafting-batch-c.md
 * trims before applying). Consumed by seed-items.js via:
 *   node seed-items.js --file ./seeds/items-batch-c.js
 *
 * Tier placement (passover calls, pending bless): Legendary named items arrive
 * at item-tier Superior (polishable to Exceptional); Mythic artifacts arrive at
 * Exceptional (the authored exception to polish-only).
 *
 * GM-SECRECY: growth items (C-4) carry ONLY their public read here — template
 * fields are player-visible on grant. True triggers and growth tracks live in
 * the batch doc, GM-side. Do not add them to seeds.
 */

const uses = (n) => ({ max: n, current: n });

// ——— C-1: Legendary named list (6) — Legendary boxes ———————————————————————
const L = (it) => ({ tier: 'Superior', source: 'batch-c', boxTiers: ['Legendary'], ...it });
const C1 = [
  L({ name: 'Chains of the Stairway Prophet', icon: '⛓️', category: 'Weapons', subtype: 'Crush', themes: ['easy-route'],
    attackTypes: ['Single Target'], range: '2', damage: '2', damageType: ['Crush'], requirements: '3 Physique, 1 Moment Cost',
    specialEffects: 'Vs demons/possessed: on hit, bind — target loses its next Moment (once per Clock). Once per campaign: permanently bind one named entity.',
    description: 'What it holds, it keeps.' }),
  L({ name: "Nullrot's Bell", icon: '🔔', category: 'Misc', subtype: 'Tool', tier: 'Exceptional', themes: ['easy-route', 'floor-3'],
    specialEffects: 'Rings silently. Once per downtime: -1 Infection tier for the whole party.',
    description: 'The disease remembers being told no.' }),
  L({ name: "The Prophet's Toll", icon: '🛎️', category: 'Misc', subtype: 'Tool', tier: 'Exceptional', boxTiers: [], themes: ['easy-route', 'meld-result'],
    specialEffects: "Once per session: the toll fills the entire room with the crystallization curse - every mob-tier monster dies instantly; so does every player without T1 Infection protection (a mask is enough, in effect). Retains the Chains' once-per-campaign bind of one named entity.",
    description: 'The chains hold the clapper. The prophet holds the note.' }),
  L({ name: 'Queensfang', icon: '🗡️', category: 'Weapons', subtype: 'Bladed', themes: ['medium-route'],
    attackTypes: ['Single Target'], range: '1', damage: '3', damageType: ['Bleed'], requirements: '1 Physique, 1 Moment Cost',
    specialEffects: '+2 damage vs demons. Blooding a demon grants demon-sight for 1 Clock (see through demonic illusion).',
    description: 'A tooth from a court that never loved its queen.' }),
  L({ name: 'Loong-Scale Aegis', icon: '🐉', category: 'Equipment', subtype: 'Shield', themes: ['hard-route'],
    resistance: 'Crush 2, Burn 2',
    specialEffects: 'Dissolution timers slow +1 Clock while borne. Crystallized citizens — and the Loong — recognize its bearer.',
    description: 'Shed, not taken.' }),
  L({ name: 'Loong Blood Phial', icon: '🧪', category: 'Consumables', subtype: 'Consumable', tier: 'Exceptional', boxTiers: [], themes: ['medium-route', 'floor-3'], uses: uses(1),
    specialEffects: 'Drink (permanent, choose one): +1 to a Body stat (Physique or Reflexes), OR +1 max HP to every body part.',
    description: 'Taken, not given.' }),
  L({ name: "Loong's Heart", icon: '❤️‍🔥', category: 'Misc', subtype: 'Trinket', tier: 'Exceptional', boxTiers: [], themes: ['hard-route', 'floor-3'],
    specialEffects: 'While borne: immune to Dissolution. On attunement, choose - vitality: +2 max HP to torso and head; or magic: magic skills cost 1 less Moment (minimum 1).',
    description: 'Given, not taken.' }),
  { name: 'Mask', icon: '😷', category: 'Equipment', subtype: 'Armor', tier: 'Basic', source: 'batch-c', themes: [], boxTiers: ['Bronze', 'Silver'],
    specialEffects: 'Counts as T1 Infection protection against airborne and miasmic sources.',
    description: 'Accessory slot (face).' },
  L({ name: "Patron's Favor Ring", icon: '💍', category: 'Equipment', subtype: 'Trinket', themes: [],
    specialEffects: 'Once per floor: reroll the outcome of one crowd Goal.',
    description: "A patron's thumb on the scale." }),
  L({ name: "The Director's Cut", icon: '🎬', category: 'Weapons', subtype: 'Bladed', themes: [],
    attackTypes: ['Single Target'], range: '1', damage: '3', damageType: ['Bleed'], requirements: '2 Physique, 1 Moment Cost',
    specialEffects: 'Once per floor, call "cut": re-stage one of your own Moments and play it differently.',
    description: 'The footage never shows the first take.' }),
];

// ——— C-2: Mythic artifacts (4) — Mythic boxes, pick one of three ———————————
const MY = (it) => ({ tier: 'Exceptional', source: 'batch-c', boxTiers: ['Mythic'], themes: [], ...it });
const C2 = [
  MY({ name: 'Tome of the First Flame', icon: '📕', category: 'System Items', subtype: 'Tome', uses: uses(1),
    specialEffects: 'Teaches "Fireball?" (acts exactly like Fire Ball). Its L5 reveals the next fire spell with a question mark — a chain that, with enough effort, maxes out fire magic.',
    description: 'The book is not done with you.' }),
  MY({ name: 'The Missing Moment', icon: '⌚', category: 'Misc', subtype: 'Trinket',
    specialEffects: 'A pocket-watch with 11 hours. Once per session: insert an extra Moment into the Clock in which only you act.',
    description: 'Nobody films the eleventh hour.' }),
  MY({ name: 'Fan Mail', icon: '✉️', category: 'Misc', subtype: 'Trinket',
    specialEffects: 'Never empty. Read the crowd at will (mood, pending Goals). Once per floor: the audience issues a Goal you wrote.',
    description: 'Signed, everyone.' }),
  MY({ name: 'The Body Double', icon: '🪆', category: 'Misc', subtype: 'Trinket',
    specialEffects: 'Once per campaign: your death happened to the double instead — anywhere, retroactively.',
    description: 'The crowd saw it live. It trended.' }),
];

// ——— C-3: nullification armor (3) — Gold/Legendary pools ———————————————————
const N = (it) => ({ category: 'Equipment', subtype: 'Armor', tier: 'Superior', source: 'batch-c', themes: [], boxTiers: ['Gold', 'Legendary'], ...it });
const C3 = [
  N({ name: 'Cindershell Plate', icon: '🛡️', resistance: 'Burn 3',
    specialEffects: 'Nullifies Burn T1 on the covered part.', description: 'Torso slot.' }),
  N({ name: 'Wyrmhide Cloak', icon: '🧥',
    specialEffects: 'Nullifies Chilled T1.', description: 'Accessory slot. No flat resist — cold is a tiered problem.' }),
  N({ name: 'Stoneframe Greaves', icon: '🦵', resistance: 'Crush 3',
    specialEffects: 'Nullifies the Slowed state from terrain (GM call on scope).', description: 'Legs slot.' }),
];

// ——— C-4: growth items (3) — story-granted; PUBLIC READS ONLY ——————————————
const GR = (it) => ({ category: 'Misc', subtype: 'Growth', tier: 'Crude', source: 'batch-c', boxTiers: [], themes: ['story'], ...it });
const C4 = [
  GR({ name: 'Friendship Bracelet', icon: '🧶', description: "A woven bracelet. It's warm." }),
  GR({ name: "Stray's Whistle", icon: '🎐', description: 'A chipped whistle. Small animals like the sound.' }),
  GR({ name: 'Prop Crown', icon: '👑', description: 'A costume crown. Surprisingly heavy.' }),
];

// ——— C-6: Superior Polish Kit (1) — never sold; Legendary+ ————————————————
const C6 = [
  { name: 'Superior Polish Kit', icon: '🧽', category: 'Consumables', tier: 'Quality', subtype: 'Kit', uses: uses(1),
    specialEffects: 'Downtime at the Forge: polish one item up a tier. d6 — 1 fail (kit consumed, item safe), 2-5 success (+1 tier), 6 double success (+2 tiers, capped at Exceptional). The only kit that completes the climb to Exceptional.',
    source: 'batch-c', themes: [], boxTiers: ['Legendary'] },
];

module.exports = [...C1, ...C2, ...C3, ...C4, ...C6];
