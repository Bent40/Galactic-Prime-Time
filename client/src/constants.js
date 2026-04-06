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
export const BOSS_TIERS = ['bronze', 'silver', 'gold', 'legendary', 'mythic', 'godly'];
export const ITEM_CATS = ['Equipment', 'Weapons', 'Tools', 'Consumables', 'Misc'];

export const CAT_ICONS = {
  Weapons: '⚔️', Equipment: '🛡️', Tools: '🔧',
  Consumables: '💊', Misc: '📦', Hotbar: '⚡', Equipped: '🏃', default: '📦',
};

export const DEFAULT_STATE = {
  identity: { name: '', player: '', race: 'Human', level: 1, background: '', portrait: '', contestantNumber: '' },
  traits: { physique: 1, reflexes: 1, mind: 1, charm: 1 },
  traitBonus: { physique: 0, reflexes: 0, mind: 0, charm: 0 },
  traitLevelBonus: { physique: 0, reflexes: 0, mind: 0, charm: 0 },
  bonusPoints: { body: 5, core: 5 },
  levelPoints: { body: 0, core: 0 },
  hpUpgradePointsSpent: 0,
  bodyParts: [
    { id: 1, name: 'Head', maxHp: 3, currentHp: 3, lethal: false, conditions: [] },
    { id: 2, name: 'Torso', maxHp: 5, currentHp: 5, lethal: false, conditions: [] },
    { id: 3, name: 'Left Arm', maxHp: 3, currentHp: 3, lethal: false, conditions: [] },
    { id: 4, name: 'Right Arm', maxHp: 3, currentHp: 3, lethal: false, conditions: [] },
    { id: 5, name: 'Left Leg', maxHp: 4, currentHp: 4, lethal: false, conditions: [] },
    { id: 6, name: 'Right Leg', maxHp: 4, currentHp: 4, lethal: false, conditions: [] },
  ],
  skills: [],
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
    ],
  },
  objectives: { main: [], directives: [], goals: [] },
  achievements: [],
  notes: '',
  conditionLog: '',
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
