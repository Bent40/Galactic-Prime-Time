export const TABS = [
  { id: 'body', label: 'Body' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'exposure', label: 'Exposure' },
  { id: 'objectives', label: 'Objectives' },
  { id: 'combat', label: 'Combat Mode' },
  { id: 'notes', label: 'Notes' },
  { id: 'comms', label: 'Comms' },
];

export const BODY_TRAITS = ['physique', 'reflexes'];
export const CORE_TRAITS = ['mind', 'charm'];
export const ALL_TRAITS = ['physique', 'reflexes', 'mind', 'charm'];
export const TRAIT_LABELS = { physique: 'Physique', reflexes: 'Reflexes', mind: 'Mind', charm: 'Charm' };

// Rulebook v0.92 taxonomy (2026-07-23). Races: book canon + freetext species on
// identity. Damage types = the resistance keys, 1:1 (Dissolution = the psychic
// class; an item is a legal "explicit source"). Legacy values (Psy/Toxic/Shock,
// sci-fi races) are migrated by server/migrate-rules-vocab.js.
export const RACES = ['Human', 'Animal', 'Robot / AI'];

// Races offered to a NEW contestant. `RACES` stays complete so existing sheets
// (and the admin panel) still render every value — Robot / AI is only hidden from
// creation, never removed, because live characters are that race.
// Owner, 2026-09-19: "robots are probably gonna be discontinued."
export const CREATION_RACES = ['Human', 'Animal'];

// ── Starting skills (owner ruling 2026-09-19) ────────────────────────────────
// "a human gets to choose 4 skills that arent locked to an animal when first made.
//  an animal chooses 2 skills and 2 animal skills."
// Only BASIC skills — never compound, which is a Gemstone merge product (§4.5).
// A contestant with nothing that fits may SUGGEST one, for the GM to approve.
export const STARTING_SKILLS = {
  Human:        { general: 4, animal: 0 },
  Animal:       { general: 2, animal: 2 },
  'Robot / AI': { general: 4, animal: 0 },   // legacy: same shape as Human
};
export const STARTING_SKILL_DEFAULT = { general: 4, animal: 0 };

export function startingSkillQuota(race) {
  return STARTING_SKILLS[race] || STARTING_SKILL_DEFAULT;
}

/**
 * Which pool a template belongs to at creation, or null if it is not pickable.
 * A compound skill is never pickable — you cannot start with the thing you fuse INTO.
 */
export function startingSkillPool(tpl) {
  if (!tpl || tpl.origin === 'compound') return null;
  // §4.4 — a character-exclusive skill is nobody's starting pick, whichever
  // pool it would otherwise sit in.
  if (String(tpl.exclusiveTo || '').trim()) return null;
  return tpl.animalOnly ? 'animal' : 'general';
}

/** Split a template list into the two creation pools, dropping compounds. */
export function startingSkillPools(templates = []) {
  const pools = { general: [], animal: [] };
  for (const t of templates) {
    const pool = startingSkillPool(t);
    if (pool) pools[pool].push(t);
  }
  return pools;
}
// Rulebook §7.1 — SIZE SETS BASE PART HP (ruled 2026-09-15, v1.8). A base, never
// a multiplier: §3.2's growth is flat, so a Small torso is 60% of a Medium's at
// creation and 94% by F9. The head never drops below 2 at any size — it is a
// lethal part, so a 1 HP head makes any hit a coin flip.
export const SIZES = ['Small', 'Medium', 'Large', 'Huge'];
export const SIZE_BASE_HP = {
  Small:  { Head: 2, Torso: 3,  Arm: 1, Leg: 2 },
  Medium: { Head: 2, Torso: 5,  Arm: 2, Leg: 3 },   // canon / the human default
  Large:  { Head: 3, Torso: 8,  Arm: 3, Leg: 4 },
  Huge:   { Head: 4, Torso: 12, Arm: 5, Leg: 6 },
};

/**
 * The six standard parts at a given size, as DEFAULT_STATE.bodyParts entries.
 * §7.1 also allows non-standard layouts (flippers, not arms) — those are a GM
 * edit on the sheet afterwards; this is the starting frame.
 */
/**
 * Re-base an EXISTING body to a new size (a race change at the Surgeon's Table,
 * §20.3, or a GM correction). Only `baseHp` moves — current HP, conditions,
 * per-part resistances and any ADDED parts are left exactly as they are, because
 * §7.1's table is a base and never a multiplier.
 *
 * A part is re-based only if its name matches a standard slot, so a grafted third
 * arm or a flipper keeps whatever the GM gave it.
 */
export function rebasePartsForSize(parts = [], size = 'Medium') {
  const hp = SIZE_BASE_HP[size] || SIZE_BASE_HP.Medium;
  const slot = (name = '') => {
    const n = name.trim().toLowerCase();
    if (n === 'head') return 'Head';
    if (n === 'torso') return 'Torso';
    if (n.endsWith('arm')) return 'Arm';
    if (n.endsWith('leg')) return 'Leg';
    return null;
  };
  return parts.map(bp => {
    const s = slot(bp.name);
    if (!s) return bp;
    const base = hp[s];
    // maxHp is the legacy fallback for parts written before baseHp existed; keep
    // the two in step so effectiveMaxHp() reads the same number either way.
    const next = { ...bp, baseHp: base, maxHp: base };
    if (typeof bp.currentHp === 'number') next.currentHp = Math.min(bp.currentHp, base);
    return next;
  });
}

export function bodyPartsForSize(size = 'Medium') {
  const hp = SIZE_BASE_HP[size] || SIZE_BASE_HP.Medium;
  const part = (id, name, base, lethal = false) =>
    ({ id, name, baseHp: base, maxHp: base, currentHp: base, lethal, conditions: [] });
  return [
    part(1, 'Head',      hp.Head,  true),
    part(2, 'Torso',     hp.Torso, true),
    part(3, 'Left Arm',  hp.Arm),
    part(4, 'Right Arm', hp.Arm),
    part(5, 'Left Leg',  hp.Leg),
    part(6, 'Right Leg', hp.Leg),
  ];
}
export const ATK_TYPES = ['Single Target', 'Line', 'Arc', 'Cone', 'Burst', 'Self', 'Thrown', 'All'];
export const DMG_TYPES = ['Bleed', 'Crush', 'Burn', 'Chill', 'Poison', 'Infection', 'Dissolution'];
export const CANON_CONDITIONS = ['Bleeding', 'Crushed', 'Burn', 'Chilled', 'Poison', 'Infected', 'Suffocation', 'Dissolution', 'Exhausted'];
// BOSS_TIERS retired 2026-07-25: Boss Tokens merged into Upgrade Tokens — bosses
// drop UT scaled by rank (see rulebook §19.1). migrate-boss-tokens.js converts
// legacy held tokens.
export const ITEM_TIERS   = ['Crude', 'Basic', 'Quality', 'Superior', 'Exceptional'];
export const AFFIX_TIERS  = ['Lesser', 'Normal', 'Higher', 'Legendary', 'Mythic', 'Godly'];
export const ITEM_CATS    = ['Equipment', 'Weapons', 'Tools', 'Consumables', 'Misc', 'System Items', 'Key Items'];
// Loot-box tiers (rulebook §17.6) + item subtypes (item-drafting-passover ID-1).
// Box tiers ≠ item tiers: a Gold BOX holds Quality–Superior ITEMS.
export const BOX_TIERS      = ['Bronze', 'Silver', 'Gold', 'Legendary', 'Mythic', 'Godly'];
export const ITEM_SUBTYPES  = ['Bladed', 'Crush', 'Martial', 'Ranged', 'Thrown', 'Armor', 'Shield', 'Trinket', 'Tool', 'Consumable', 'Charged gear', 'Limited-magic', 'Kit', 'Growth', 'Tome', 'Material'];

export const CAT_ICONS = {
  Weapons: '⚔️', Equipment: '🛡️', Tools: '🔧',
  Consumables: '💊', Misc: '📦', Hotbar: '⚡', Equipped: '🏃',
  'Quick Slots': '⚡', 'Worn/Equipped': '🏃',
  'System Items': '💾', 'Key Items': '🔑', default: '📦',
};

export const DEFAULT_STATE = {
  identity: { name: '', player: '', race: 'Human', species: '', size: 'Medium', level: 1, background: '', portrait: '', contestantNumber: '' },
  traits: {
    physique: { base: 1, bonus: 0, levelBonus: 0 },
    reflexes: { base: 1, bonus: 0, levelBonus: 0 },
    mind:     { base: 1, bonus: 0, levelBonus: 0 },
    charm:    { base: 1, bonus: 0, levelBonus: 0 },
  },
  bonusPoints: { body: 5, core: 5, bodyMax: 5, coreMax: 5 },
  levelPoints: { pool: 0 },
  hpUpgradePointsSpent: 0,
  bodyParts: [
    { id: 1, name: 'Head',      baseHp: 2, maxHp: 2, currentHp: 2, lethal: true,  conditions: [] },
    { id: 2, name: 'Torso',     baseHp: 5, maxHp: 5, currentHp: 5, lethal: true,  conditions: [] },
    { id: 3, name: 'Left Arm',  baseHp: 2, maxHp: 2, currentHp: 2, lethal: false, conditions: [] },
    { id: 4, name: 'Right Arm', baseHp: 2, maxHp: 2, currentHp: 2, lethal: false, conditions: [] },
    { id: 5, name: 'Left Leg',  baseHp: 3, maxHp: 3, currentHp: 3, lethal: false, conditions: [] },
    { id: 6, name: 'Right Leg', baseHp: 3, maxHp: 3, currentHp: 3, lethal: false, conditions: [] },
  ],
  shock: { tier: 0 },
  statCapBonuses: {
    bleed: 0,
    crush: 0,
    burn: 0,
    chill: 0,
    poison: 0,
    infection: 0,
    dissolution: 0,
    cameraCall: 0,
  },
  skills: [],
  skillPointsSpent: { physique: 0, reflexes: 0, mind: 0, charm: 0 },
  tags: [],
  effects: [],
  exposure: { viewers: 0, followers: 0 },
  patrons: [
    { rank: 1, name: '', amount: '', notes: '', avatar: '' },
    { rank: 2, name: '', amount: '', notes: '', avatar: '' },
    { rank: 3, name: '', amount: '', notes: '', avatar: '' },
  ],
  tokens: { narrative: 0, upgrade: 0, patronTokens: 0 },
  inventory: {
    categories: [
      { id: 1, name: 'Equipped', locked: true, items: [], order: 0 },
      { id: 2, name: 'Hotbar', locked: true, maxItems: 6, items: [], order: 1 },
      { id: 10, name: 'Equipment', locked: false, items: [], order: 2 },
      { id: 11, name: 'Weapons', locked: false, items: [], order: 3 },
      { id: 12, name: 'Tools', locked: false, items: [], order: 4 },
      { id: 13, name: 'Consumables', locked: false, items: [], order: 5 },
      { id: 14, name: 'Misc', locked: false, items: [], order: 6 },
      { id: 17, name: 'System Items', locked: true, items: [], order: 7 },
      { id: 18, name: 'Key Items', locked: true, items: [], order: 8 },
    ],
  },
  objectives: { main: [], directives: [], goals: [] },
  achievements: [],
  notes: '',
  conditionLog: '',
  cameraCallUsed: 0,
};

export function uid() {
  return Date.now() + Math.floor(Math.random() * 100000);
}

// ── Shared rules math — single source of truth; every tab imports these ──
export function traitTotal(state, t) {
  const tr = state?.traits?.[t] || {};
  return (tr.base || 0) + (tr.bonus || 0) + (tr.levelBonus || 0);
}

// Traits are uncapped; every N points past 10 pays out one milestone bonus
// (Reflexes /12 → +1 phys res · Mind /15 → +1 psychic tier · Charm /20 → +1
// Camera Call stack).
//
// ⚠️ PHYSIQUE'S ROW IS SUPERSEDED. §3.2 used to read "Physique /5 → +1 max HP to
// every body part"; L-18 ruled part HP scales off TOTAL trait points instead, so
// the HP source is partHpBonus() below and NOT capBonus(state, 'physique').
// The divisor is kept only so the map stays whole — nothing reads it.
export const CAP_DIVISORS = { physique: 5, reflexes: 12, mind: 15, charm: 20 };
export function capBonus(state, t) {
  return Math.floor(Math.max(0, traitTotal(state, t) - 10) / CAP_DIVISORS[t]);
}

// §2.2 — a contestant is created with 14 trait points: 1 base in each of the four
// traits, plus the 10 bonus points (5 Body + 5 Core). This is the same
// CREATION_POINTS that server/floor-bands.js and server/encounter-bands.js use to
// derive every enemy statline, so the three must never drift.
export const CREATION_POINTS = 14;
// L-19 — +1 HP to every part per 5 total trait points past creation.
export const HP_PER_POINT = 5;

// The sum of all four traits (base + bonus + levelBonus). UNSPENT level points do
// not count: a point in the pool has not grown anything yet.
export function totalTraitPoints(state) {
  return ALL_TRAITS.reduce((n, t) => n + traitTotal(state, t), 0);
}

/**
 * L-18 (ruled 2026-08-18) — part HP scales off TOTAL trait points, not Physique
 * alone, so a Mind or Charm build's body grows exactly as fast as a bruiser's.
 * The curve is L-19's: a Medium torso runs 5 at creation → 7 at F1 → 35 at F9.
 *
 * ⚖ Physique keeps NO extra bonus on top. L-18 left that as an open detail, but
 * every calibration already assumes this formula alone — floor-bands.js, the 53
 * enemy statlines, §21.7 encounter sizing and §21.8's press table are all sized
 * against a torso of 5 + floor((points − 14) / 5). Giving Physique a second
 * source would put a focused build above the body the whole campaign is written
 * for. One constant changes it if the owner rules otherwise.
 */
export function partHpBonus(state) {
  return Math.floor(Math.max(0, totalTraitPoints(state) - CREATION_POINTS) / HP_PER_POINT);
}

// Points still owed toward the next +1 to every part. Purely a readout.
export function pointsToNextHp(state) {
  const past = Math.max(0, totalTraitPoints(state) - CREATION_POINTS);
  return HP_PER_POINT - (past % HP_PER_POINT);
}

// A part's live max = its base HP (baseHp; legacy parts fall back to maxHp) plus
// the whole-body trait-point bonus.
export function effectiveMaxHp(bp, state) {
  return (bp.baseHp ?? bp.maxHp ?? 0) + partHpBonus(state);
}

export function dmgClass(current, max) {
  if (max <= 0) return '';
  const pct = current / max;
  if (pct <= 0) return 'destroyed';
  if (pct <= 0.25) return 'critical';
  if (pct <= 0.5) return 'heavy';
  if (pct <= 0.75) return 'medium';
  if (pct < 1) return 'light';
  return '';
}

export function catIcon(name) {
  return CAT_ICONS[name] || CAT_ICONS.default;
}

/**
 * §12.7 / L-23 — the MATERIAL BANDS, in FORCE STEPS. A band step is +1 Force; the
 * 2026-08-18 x2-per-floor multiplier is withdrawn. M-0 and M-1 are ruled; M-2 and
 * M-3 are named sketches in item-drafting-materials.md; M-4 upward have no names
 * yet because those floors are undesigned.
 *
 * Reference data only. It is NOT added to an item's damage — see itemDmgLabel().
 */
export const MATERIAL_BANDS = {
  0: { floor: '—',  name: 'Baseline', materials: ['Scrap', 'Wood', 'Leather', 'Iron'] },
  1: { floor: 'F1', name: 'Forest',   materials: ['Oak Heartwood', 'Beastbone', 'Sinew Cord', 'Tough Hide', 'Resin', 'Mistletoe', 'Obsidian'] },
  2: { floor: 'F2', name: 'Desert',   materials: ['Sky-Iron', 'Flint', 'Sunglass', 'Scorpion Chitin', 'Turquoise'] },
  3: { floor: 'F3', name: 'Capital',  materials: ['Jade', 'Mirror-Bronze', 'Silver', 'Inscribed Clay', 'Orichalcum', 'Cursed Gold'] },
};

const MATERIAL_STEP = (() => {
  const m = {};
  for (const [step, band] of Object.entries(MATERIAL_BANDS))
    for (const name of band.materials) m[name.toLowerCase()] = Number(step);
  return m;
})();

/**
 * The Force step a named material is worth, or null if the name is not in a
 * written band. NULL IS NOT ZERO — an unknown material may be a Set 2/3 material
 * nobody has named yet, and quietly calling it baseline would understate it.
 */
export function materialBand(name) {
  const k = String(name || '').trim().toLowerCase();
  return k in MATERIAL_STEP ? MATERIAL_STEP[k] : null;
}

/** The striking part of an item's §12.7 bill of materials — it sets the band. */
export function strikingMaterial(item) {
  const bill = item?.materials;
  if (!Array.isArray(bill)) return '';
  const hit = bill.find(m => m && m.striking) || null;
  return hit ? String(hit.material || '') : '';
}

/**
 * §7.3 — one Force is one basic punch, and an item's damage number is counted in
 * it. Every seeded item's number is already its Force: batches a/b/c are written
 * as the bare §12.1 weapon class and carry NO material bill, and a class with no
 * band step IS the Force.
 *
 * ⚠️ The band is deliberately NOT added here. Whether `damage` stores the final
 * Force (band baked in, as items-set1-spine.js writes it) or the raw class (band
 * added at display) is an OPEN owner call; adding it would double-count the spine
 * the day it is seeded. The band is surfaced beside the number, never inside it.
 */
export function itemDmgLabel(item) {
  if (!item) return '';
  if (item.damage) {
    const n = String(item.damage).trim();
    const parts = [/^\d+$/.test(n) ? `${n} Force` : n];
    if (item.damageType && item.damageType.length) parts.push(item.damageType.join('/'));
    return parts.join(' ');
  }
  if (item.resistance) return `🛡 ${item.resistance}`;
  return '';
}
