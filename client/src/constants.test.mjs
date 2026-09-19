/**
 * Dependency-free checks over the shared rules helpers in constants.js.
 *   node --experimental-detect-module client/src/constants.test.mjs
 * No DB, no browser, no node_modules. Covers the §7.1 size tables and the §2.2
 * creation arithmetic that CharacterCreation.jsx depends on.
 */
import { SIZES, SIZE_BASE_HP, bodyPartsForSize, DEFAULT_STATE, BODY_TRAITS, CORE_TRAITS,
  CREATION_RACES, RACES, STARTING_SKILLS, startingSkillQuota,
  startingSkillPool, startingSkillPools, rebasePartsForSize,
  traitTotal, capBonus, totalTraitPoints, partHpBonus, pointsToNextHp,
  effectiveMaxHp, CREATION_POINTS, HP_PER_POINT,
} from './constants.js';

let pass = 0, fail = 0;
const ok = (n, c, x = '') => c ? (pass++, console.log(`  ok    ${n}`)) : (fail++, console.log(`  FAIL  ${n}${x ? ' — ' + x : ''}`));
const eq = (n, got, want) => ok(n, JSON.stringify(got) === JSON.stringify(want),
  `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
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


// ── Starting skills (owner ruling 2026-09-19) ────────────────────────────────
eq('a Human picks 4 general and 0 animal', startingSkillQuota('Human'), { general: 4, animal: 0 });
eq('an Animal picks 2 general and 2 animal', startingSkillQuota('Animal'), { general: 2, animal: 2 });
eq('both races pick FOUR skills in total',
   startingSkillQuota('Human').general + startingSkillQuota('Human').animal,
   startingSkillQuota('Animal').general + startingSkillQuota('Animal').animal);
eq('legacy Robot / AI keeps a quota rather than crashing', startingSkillQuota('Robot / AI'), { general: 4, animal: 0 });
eq('an unknown race falls back to the Human shape', startingSkillQuota('Slime'), { general: 4, animal: 0 });
eq('undefined race falls back too', startingSkillQuota(undefined), { general: 4, animal: 0 });

eq('a plain skill is a general pick', startingSkillPool({ name: 'Brace' }), 'general');
eq('an animal-locked skill is an animal pick', startingSkillPool({ name: 'Swim', animalOnly: true }), 'animal');
eq('a COMPOUND skill is never pickable', startingSkillPool({ name: 'Iron Stance', origin: 'compound' }), null);
eq('compound beats animalOnly — a merged animal skill is still not a starting pick',
   startingSkillPool({ name: 'Death Grip Jaws', origin: 'compound', animalOnly: true }), null);
eq('an explicit basic origin is still general', startingSkillPool({ name: 'Brace', origin: 'basic' }), 'general');
eq('a missing template is not pickable', startingSkillPool(undefined), null);

{
  const pools = startingSkillPools([
    { name: 'Brace' }, { name: 'Feint', origin: 'basic' },
    { name: 'Swim', animalOnly: true },
    { name: 'Iron Stance', origin: 'compound' },
    { name: 'Death Grip Jaws', origin: 'compound', animalOnly: true },
  ]);
  eq('pools keep the two basics', pools.general.map(t => t.name), ['Brace', 'Feint']);
  eq('pools keep the animal basic', pools.animal.map(t => t.name), ['Swim']);
  eq('pools drop BOTH compounds', pools.general.length + pools.animal.length, 3);
}
eq('an empty library yields empty pools', startingSkillPools([]), { general: [], animal: [] });
eq('no argument yields empty pools', startingSkillPools(), { general: [], animal: [] });

// Robot / AI is hidden from creation but must NEVER be removed — live sheets are that race.
ok('CREATION_RACES drops Robot / AI', !CREATION_RACES.includes('Robot / AI'));
ok('RACES still carries Robot / AI so existing sheets render', RACES.includes('Robot / AI'));
ok('every creation race is a real race', CREATION_RACES.every(r => RACES.includes(r)));
ok('every race with a quota is a known race',
   Object.keys(STARTING_SKILLS).every(r => RACES.includes(r)));

// ── rebasePartsForSize — a race change must not wipe the body ────────────────
{
  const body = bodyPartsForSize('Medium');
  body[1].currentHp = 5;                                    // full Medium torso
  body.push({ id: 9, name: 'Tail', baseHp: 4, maxHp: 4, currentHp: 4 });
  const small = rebasePartsForSize(body, 'Small');
  eq('re-basing moves the torso base to Small', small[1].baseHp, 3);
  eq('maxHp is kept in step with baseHp for legacy parts', small[1].maxHp, 3);
  eq('current HP is CLAMPED to the new base, never left above it', small[1].currentHp, 3);
  eq('an ADDED part is left completely alone', small[6], body[6]);
  eq('the part count never changes', small.length, body.length);
}
{
  const body = bodyPartsForSize('Medium');
  body[0].currentHp = 1;                                    // a wounded head
  const large = rebasePartsForSize(body, 'Large');
  eq('growing does not heal you', large[0].currentHp, 1);
  eq('growing raises the base', large[0].baseHp, 3);
}
{
  const body = bodyPartsForSize('Small');
  body[0].conditions = [{ name: 'Bleeding', tier: 2 }];
  const med = rebasePartsForSize(body, 'Medium');
  eq('conditions survive a re-base', med[0].conditions.length, 1);
}
eq('an unknown size falls back to Medium',
   rebasePartsForSize(bodyPartsForSize('Small'), 'Enormous')[1].baseHp, SIZE_BASE_HP.Medium.Torso);
eq('re-basing an empty body is safe', rebasePartsForSize([], 'Large'), []);
eq('re-basing no body at all is safe', rebasePartsForSize(undefined, 'Large'), []);


// ── L-18 / L-19 — part HP scales off TOTAL trait points ─────────────────────
// A sheet with the given trait totals, written the way the app stores them.
const sheet = (physique, reflexes, mind, charm) => ({
  traits: {
    physique: { base: physique, bonus: 0, levelBonus: 0 },
    reflexes: { base: reflexes, bonus: 0, levelBonus: 0 },
    mind:     { base: mind,     bonus: 0, levelBonus: 0 },
    charm:    { base: charm,    bonus: 0, levelBonus: 0 },
  },
});
// A balanced build holding exactly `n` total trait points.
const balanced = (n) => {
  const q = Math.floor(n / 4), r = n % 4;
  return sheet(q + (r > 0 ? 1 : 0), q + (r > 1 ? 1 : 0), q + (r > 2 ? 1 : 0), q);
};

console.log('\n§3.2 / L-18 — part HP off TOTAL trait points, not Physique');
eq('creation is 14 points and pays no body bonus', partHpBonus(balanced(14)), 0);
eq('totalTraitPoints sums all four traits, base + bonus + levelBonus', totalTraitPoints({
  traits: { physique: { base: 1, bonus: 2, levelBonus: 3 }, reflexes: { base: 4 },
            mind: { bonus: 5 }, charm: { levelBonus: 6 } } }), 21);
eq('an empty sheet does not throw', totalTraitPoints({}), 0);
eq('a sheet below creation never pays a negative bonus', partHpBonus(balanced(4)), 0);

// The L-19 curve, per FLOOR — the anchors every enemy statline is sized against.
console.log('\nL-19 — the curve, floor by floor (points → +HP → Medium torso)');
const CURVE = [[1, 24, 2, 7], [2, 34, 4, 9], [3, 44, 6, 11], [4, 60, 9, 14], [5, 76, 12, 17],
               [6, 92, 15, 20], [7, 116, 20, 25], [8, 140, 25, 30], [9, 164, 30, 35]];
for (const [floor, points, bonus, torso] of CURVE) {
  const st = balanced(points);
  eq(`F${floor}: ${points} points → +${bonus} per part`, partHpBonus(st), bonus);
  eq(`F${floor}: a Medium torso reads ${torso}`,
     effectiveMaxHp(bodyPartsForSize('Medium')[1], st), torso);
}

console.log('\n⭐ the caster chasm is closed — the rule L-18 replaced');
{
  const caster = balanced(164);                       // F9, ~41 in each trait
  eq('an F9 balanced build gets +30 under L-18', partHpBonus(caster), 30);
  eq('...where the OLD Physique-only rule gave it +6', capBonus(caster, 'physique'), 6);
  const bruiser = sheet(110, 20, 17, 17);             // F9 focused, 164 points
  eq('an F9 focused Physique build holds the same 164 points', totalTraitPoints(bruiser), 164);
  eq('...and gets the SAME +30 — the body is the build-neutral axis', partHpBonus(bruiser), 30);
  eq('...where the old rule gave it +20', capBonus(bruiser, 'physique'), 20);
}

console.log('\n🔒 nobody shrinks — the change is a pure increase on every legal sheet');
{
  // §2.2 forces 5 Core points, so the three non-Physique traits always sum to 4+.
  // That is exactly the condition under which total-points >= Physique-only.
  let worse = null;
  for (let p = 1; p <= 120 && !worse; p++)
    for (let rest = 4; rest <= 120; rest++) {
      const st = sheet(p, Math.ceil(rest / 3), Math.ceil((rest - Math.ceil(rest / 3)) / 2),
                       rest - Math.ceil(rest / 3) - Math.ceil((rest - Math.ceil(rest / 3)) / 2));
      if (partHpBonus(st) < capBonus(st, 'physique')) { worse = [p, rest]; break; }
    }
  ok('no sheet with 4+ points outside Physique loses HP to the new rule', worse === null,
     worse ? `Physique ${worse[0]}, rest ${worse[1]}` : '');
}

console.log('\nthe readouts');
eq('5 points past creation is the step', HP_PER_POINT, 5);
eq('creation is 14 — the same figure floor-bands.js derives enemies from', CREATION_POINTS, 14);
eq('at exactly creation, 5 more points buy the first +1', pointsToNextHp(balanced(14)), 5);
eq('one point in, 4 to go', pointsToNextHp(balanced(15)), 4);
eq('four points in, 1 to go', pointsToNextHp(balanced(18)), 1);
eq('and landing on the step resets the count', pointsToNextHp(balanced(19)), 5);

console.log('\n§7.1 + L-18 compose — size is a base, the bonus is flat on top');
{
  const f9 = balanced(164);
  eq('a Small F9 torso is 33', effectiveMaxHp(bodyPartsForSize('Small')[1], f9), 33);
  eq('a Medium F9 torso is 35', effectiveMaxHp(bodyPartsForSize('Medium')[1], f9), 35);
  ok('⭐ Small closes from 60% of a Medium at creation to 94% by F9 — an EARLY-GAME fact',
     Math.round(100 * 33 / 35) === 94);
  eq('a Huge F9 torso is 42 — the base never multiplies',
     effectiveMaxHp(bodyPartsForSize('Huge')[1], f9), 42);
  eq('a grafted part written with maxHp and no baseHp still reads the bonus (§20.3)',
     effectiveMaxHp({ name: 'Third Arm', maxHp: 2 }, f9), 32);
  eq('a part with neither field does not throw', effectiveMaxHp({ name: 'Tail' }, f9), 30);
}
eq('and the live party — 14 points each — sees no change at all today',
   [sheet(3, 4, 3, 4), sheet(5, 2, 3, 4), sheet(4, 3, 2, 5), sheet(3, 4, 4, 3)]
     .map(partHpBonus), [0, 0, 0, 0]);


console.log(`\n${pass} passed · ${fail} failed`);
process.exit(fail ? 1 : 0);
