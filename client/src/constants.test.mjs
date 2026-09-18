/**
 * Dependency-free checks over the shared rules helpers in constants.js.
 *   node --experimental-detect-module client/src/constants.test.mjs
 * No DB, no browser, no node_modules. Covers the §7.1 size tables and the §2.2
 * creation arithmetic that CharacterCreation.jsx depends on.
 */
import { SIZES, SIZE_BASE_HP, bodyPartsForSize, DEFAULT_STATE, BODY_TRAITS, CORE_TRAITS } from './constants.js';

let pass = 0, fail = 0;
const ok = (n, c, x = '') => c ? (pass++, console.log(`  ok    ${n}`)) : (fail++, console.log(`  FAIL  ${n}${x ? ' — ' + x : ''}`));
const total = (parts) => parts.reduce((a, p) => a + p.maxHp, 0);

console.log('§7.1 — size sets base part HP');
ok('the four sizes are Small|Medium|Large|Huge', SIZES.join('|') === 'Small|Medium|Large|Huge');
const totals = { Small: 11, Medium: 17, Large: 25, Huge: 38 };
for (const [size, want] of Object.entries(totals)) {
  ok(`${size} body total is ${want}`, total(bodyPartsForSize(size)) === want, 'got ' + total(bodyPartsForSize(size)));
}
ok('⛔ the head never drops below 2 at any size — a lethal part at 1 is a coin flip',
   SIZES.every(s => SIZE_BASE_HP[s].Head >= 2));
ok('Medium matches the canon base HP the rulebook states (2/5/2/3)',
   SIZE_BASE_HP.Medium.Head === 2 && SIZE_BASE_HP.Medium.Torso === 5
   && SIZE_BASE_HP.Medium.Arm === 2 && SIZE_BASE_HP.Medium.Leg === 3);
ok('DEFAULT_STATE.bodyParts IS the Medium frame — the two cannot drift apart',
   total(DEFAULT_STATE.bodyParts) === total(bodyPartsForSize('Medium')));
ok('a Small torso is 60% of a Medium torso at creation (3 vs 5)',
   SIZE_BASE_HP.Small.Torso / SIZE_BASE_HP.Medium.Torso === 0.6);
ok('an unknown size falls back to Medium rather than throwing',
   total(bodyPartsForSize('Colossal')) === 17 && total(bodyPartsForSize()) === 17);

console.log('\nthe six parts are well formed');
const parts = bodyPartsForSize('Small');
ok('six parts, unique ids 1-6', parts.length === 6 && new Set(parts.map(p => p.id)).size === 6);
ok('exactly two are lethal, and they are Head and Torso (§7.1)',
   parts.filter(p => p.lethal).map(p => p.name).join(',') === 'Head,Torso');
ok('every part starts undamaged: currentHp === maxHp === baseHp',
   parts.every(p => p.currentHp === p.maxHp && p.maxHp === p.baseHp));
ok('every part carries an empty conditions array', parts.every(p => Array.isArray(p.conditions) && p.conditions.length === 0));

console.log('\n§2.2 — the creation point budget');
const BODY_MAX = DEFAULT_STATE.bonusPoints.bodyMax, CORE_MAX = DEFAULT_STATE.bonusPoints.coreMax;
ok('5 Body + 5 Core bonus points', BODY_MAX === 5 && CORE_MAX === 5);
ok('⭐ 4 base + 10 allocated = 14, the CREATION_POINTS the level budget assumes (floor-bands.js)',
   Object.keys(DEFAULT_STATE.traits).length + BODY_MAX + CORE_MAX === 14);
ok('Body is Physique|Reflexes, Core is Mind|Charm — the two pools cover all four traits, once each',
   [...BODY_TRAITS, ...CORE_TRAITS].sort().join(',') === Object.keys(DEFAULT_STATE.traits).sort().join(','));
ok('every trait starts at base 1', Object.values(DEFAULT_STATE.traits).every(t => t.base === 1));
ok('identity carries a size, defaulting to Medium', DEFAULT_STATE.identity.size === 'Medium');

console.log(`\n${pass} passed · ${fail} failed`);
process.exit(fail ? 1 : 0);
