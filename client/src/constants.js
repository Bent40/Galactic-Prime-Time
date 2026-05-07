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

export const RACES = ['Human', 'Cyborg', 'Android', 'Mutant', 'Alien', 'Clone', 'Hybrid', 'Synthetic'];
export const ATK_TYPES = ['Single Target', 'Line', 'Arc', 'Cone', 'Burst', 'Self', 'Thrown', 'All'];
export const DMG_TYPES = ['Crush', 'Bleed', 'Burn', 'Shock', 'Toxic', 'Psy'];
export const BOSS_TIERS   = ['bronze', 'silver', 'gold', 'legendary', 'mythic', 'godly'];
export const ITEM_TIERS   = ['Crude', 'Basic', 'Quality', 'Superior', 'Exceptional'];
export const AFFIX_TIERS  = ['Lesser', 'Normal', 'Higher', 'Legendary', 'Mythic', 'Godly'];
export const ITEM_CATS    = ['Equipment', 'Weapons', 'Tools', 'Consumables', 'Misc', 'System Items', 'Key Items'];

// Master tag catalog — used by the player-side tag picker. Admins can still
// add freetext tags from the player panel; this list is for the structured
// pick experience players use on their own sheet.
export const MASTER_TAGS = [
  { name: 'Bleeding',         effect: 'Lose 1 HP at the start of each Moment.' },
  { name: 'Burning',          effect: 'Burn damage on tick; spreads to adjacent body parts.' },
  { name: 'Bruised',          effect: '−1 to Physique checks until end of scene.' },
  { name: 'Stunned',          effect: 'Skip your next Moment action.' },
  { name: 'Dazed',            effect: '−1 to Reflexes-based actions.' },
  { name: 'Disarmed',         effect: 'Cannot use equipped weapon until recovered.' },
  { name: 'Exhausted',        effect: '−1 to all trait checks; recover after rest.' },
  { name: 'Poisoned',         effect: 'Lose 1 HP per Moment until cleansed.' },
  { name: 'Infected',         effect: 'Wounds heal at half rate; spreads if untreated.' },
  { name: 'Prone',            effect: '−1 to attack; +1 cover from ranged.' },
  { name: 'Pinned',           effect: 'Cannot move; melee attackers get advantage.' },
  { name: 'Inspired',         effect: '+1 to your next trait check.' },
  { name: 'Spotlighted',      effect: 'Camera Call cost reduced by 1 stack.' },
  { name: 'Trending',         effect: '+10% follower gain this scene.' },
  { name: 'Sponsor Favorite', effect: 'Gain 1 Patron token at scene end.' },
  { name: 'Underdog',         effect: '+1 Narrative token if you complete a Goal.' },
  { name: 'Ridiculed',        effect: '−10% viewer gain this scene.' },
  { name: 'Forgotten',        effect: 'No exposure gained this Moment.' },
  { name: 'Drunk',            effect: '−1 Mind, +1 Charm.' },
  { name: 'Confident',        effect: '+1 Charm on your next social roll.' },
];

export const CAT_ICONS = {
  Weapons: '⚔️', Equipment: '🛡️', Tools: '🔧',
  Consumables: '💊', Misc: '📦', Hotbar: '⚡', Equipped: '🏃',
  'Quick Slots': '⚡', 'Worn/Equipped': '🏃',
  'System Items': '💾', 'Key Items': '🔑', default: '📦',
};

export const DEFAULT_STATE = {
  identity: { name: '', player: '', race: 'Human', level: 1, background: '', portrait: '', contestantNumber: '' },
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
  tokens: { narrative: 0, upgrade: 0, patronTokens: 0, bossTokens: [] },
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
