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
// (Physique /5 → +1 part HP · Reflexes /12 → +1 phys res · Mind /15 → +1 psychic
// tier · Charm /20 → +1 Camera Call stack).
export const CAP_DIVISORS = { physique: 5, reflexes: 12, mind: 15, charm: 20 };
export function capBonus(state, t) {
  return Math.floor(Math.max(0, traitTotal(state, t) - 10) / CAP_DIVISORS[t]);
}

// A part's live max = its base HP (baseHp; legacy parts fall back to maxHp)
// plus the Physique milestone bonus.
export function effectiveMaxHp(bp, state) {
  return (bp.baseHp ?? bp.maxHp ?? 0) + capBonus(state, 'physique');
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

export function itemDmgLabel(item) {
  if (!item) return '';
  if (item.damage) {
    const parts = [item.damage];
    if (item.damageType && item.damageType.length) parts.push(item.damageType.join('/'));
    return parts.join(' ');
  }
  if (item.resistance) return `🛡 ${item.resistance}`;
  return '';
}
