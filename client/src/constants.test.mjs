/**
 * Dependency-free checks over the shared rules helpers in constants.js.
 *   node --experimental-detect-module client/src/constants.test.mjs
 * No DB, no browser, no node_modules. Covers the §7.1 size tables and the §2.2
 * creation arithmetic that CharacterCreation.jsx depends on.
 */
import { SIZES, SIZE_BASE_HP, bodyPartsForSize, DEFAULT_STATE, BODY_TRAITS, CORE_TRAITS,
  CREATION_RACES, RACES, STARTING_SKILLS, startingSkillQuota,
  startingSkillPool, startingSkillPools, rebasePartsForSize,
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

console.log(`\n${pass} passed · ${fail} failed`);
process.exit(fail ? 1 : 0);
