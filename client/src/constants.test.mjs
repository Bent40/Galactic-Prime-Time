/**
 * Dependency-free checks over the shared rules helpers in constants.js.
 *   node --experimental-detect-module client/src/constants.test.mjs
 * No DB, no browser, no node_modules. Covers the §7.1 size tables and the §2.2
 * creation arithmetic that CharacterCreation.jsx depends on.
 */
import { SIZES, SIZE_BASE_HP, bodyPartsForSize, DEFAULT_STATE, BODY_TRAITS, CORE_TRAITS,
  CREATION_RACES, RACES, STARTING_SKILLS, startingSkillQuota,
  startingSkillPool, startingSkillPools, raceLockOf, rebasePartsForSize,
  traitTotal, capBonus, totalTraitPoints, partHpBonus, pointsToNextHp,
  effectiveMaxHp, CREATION_POINTS, HP_PER_POINT,
  itemDmgLabel, materialBand, strikingMaterial, MATERIAL_BANDS,
  publicSubtype, HIDDEN_SUBTYPES, ITEM_SUBTYPES,
  reconcilePartHp, partHpBonusFor,
  skillCeiling, SKILL_CEILING_MAX, SKILL_CEILING_DEFAULT,
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
eq('a Human picks 4 general and 0 racial', startingSkillQuota('Human'), { general: 4, racial: 0 });
eq('an Animal picks 2 general and 2 racial', startingSkillQuota('Animal'), { general: 2, racial: 2 });
eq('both races pick FOUR skills in total',
   startingSkillQuota('Human').general + startingSkillQuota('Human').racial,
   startingSkillQuota('Animal').general + startingSkillQuota('Animal').racial);
eq('Robot / AI carries the same 2+2 shape as an Animal — hidden from creation, not broken',
   startingSkillQuota('Robot / AI'), { general: 2, racial: 2 });
eq('an unknown race falls back to the Human shape', startingSkillQuota('Slime'), { general: 4, racial: 0 });
eq('undefined race falls back too', startingSkillQuota(undefined), { general: 4, racial: 0 });

console.log('\n§4.4 — a skill is locked to a RACE, not to "animal or not"');
eq('no lock reads as anyone', raceLockOf({ name: 'Brace' }), '');
eq('a raceLock reads back', raceLockOf({ name: 'Voicebox', raceLock: 'Robot / AI' }), 'Robot / AI');
eq('⚠️ the legacy animalOnly boolean still reads as a lock on Animal',
   raceLockOf({ name: 'Swim', animalOnly: true }), 'Animal');
eq('raceLock wins over the legacy flag',
   raceLockOf({ name: 'X', raceLock: 'Robot / AI', animalOnly: true }), 'Robot / AI');
eq('whitespace is not a lock', raceLockOf({ name: 'X', raceLock: '   ' }), '');
eq('no template at all is safe', [raceLockOf(), raceLockOf(null)], ['', '']);

eq('a plain skill is a general pick', startingSkillPool({ name: 'Brace' }), 'general');
eq('a race-locked skill read WITHOUT a race is simply "racial"',
   startingSkillPool({ name: 'Swim', raceLock: 'Animal' }), 'racial');
eq('⭐ read WITH the matching race it is that race\'s racial pick',
   startingSkillPool({ name: 'Swim', raceLock: 'Animal' }, 'Animal'), 'racial');
eq('⭐ and read with a DIFFERENT race it is not pickable at all — a Human is never '
   + 'offered an Animal skill',
   startingSkillPool({ name: 'Swim', raceLock: 'Animal' }, 'Human'), null);
eq('🤖 nor is a Robot racial offered to an Animal',
   startingSkillPool({ name: 'Voicebox', raceLock: 'Robot / AI' }, 'Animal'), null);
eq('...and a Robot gets its own', startingSkillPool({ name: 'Voicebox', raceLock: 'Robot / AI' }, 'Robot / AI'), 'racial');
eq('a general skill is general for every race',
   ['Human', 'Animal', 'Robot / AI'].map(r => startingSkillPool({ name: 'Brace' }, r)),
   ['general', 'general', 'general']);
eq('a COMPOUND skill is never pickable', startingSkillPool({ name: 'Iron Stance', origin: 'compound' }), null);
eq('compound beats a race lock — a merged racial is still not a starting pick',
   startingSkillPool({ name: 'X', origin: 'compound', raceLock: 'Animal' }, 'Animal'), null);
eq('🔴 exclusiveTo beats everything — Mario-only is nobody\'s pick',
   startingSkillPool({ name: 'Heroic Punch', exclusiveTo: 'Mario' }, 'Human'), null);
eq('an explicit basic origin is still general', startingSkillPool({ name: 'Brace', origin: 'basic' }), 'general');
eq('a missing template is not pickable', startingSkillPool(undefined), null);

{
  const lib = [
    { name: 'Brace' }, { name: 'Feint', origin: 'basic' },
    { name: 'Swim', raceLock: 'Animal' },
    { name: 'Voicebox', raceLock: 'Robot / AI' },
    { name: 'Iron Stance', origin: 'compound' },
    { name: 'Heroic Punch', exclusiveTo: 'Mario' },
  ];
  const animal = startingSkillPools(lib, 'Animal');
  eq('an Animal sees the two general basics', animal.general.map(t => t.name), ['Brace', 'Feint']);
  eq('...and only its OWN racial', animal.racial.map(t => t.name), ['Swim']);
  const human = startingSkillPools(lib, 'Human');
  eq('⭐ a Human sees NO racials at all', human.racial, []);
  eq('...and the same two generals', human.general.map(t => t.name), ['Brace', 'Feint']);
  const robot = startingSkillPools(lib, 'Robot / AI');
  eq('🤖 a Robot sees its own', robot.racial.map(t => t.name), ['Voicebox']);
  const agnostic = startingSkillPools(lib);
  eq('with no race, every lock lands in one racial bucket — what a library listing wants',
     agnostic.racial.map(t => t.name), ['Swim', 'Voicebox']);
  eq('the compound and the exclusive are dropped from every reading',
     [animal, human, robot, agnostic].map(p => p.general.length + p.racial.length), [3, 2, 3, 4]);
}
eq('an empty library yields empty pools', startingSkillPools([]), { general: [], racial: [] });
eq('no argument yields empty pools', startingSkillPools(), { general: [], racial: [] });

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



// ── §4.4 — a character-exclusive skill is nobody's starting pick ────────────
console.log('\n§4.4 — exclusiveTo removes a skill from BOTH pools');
eq("⚠️ an exclusive RACIAL is still nobody's — the two locks compose",
   startingSkillPool({ name: 'X', raceLock: 'Animal', exclusiveTo: 'Someone' }, 'Animal'), null);
eq('whitespace is not a name', startingSkillPool({ name: 'Y', exclusiveTo: '   ' }), 'general');


// ── §7.3 — the damage number is FORCE, and §12.7's bands are Force steps ─────
console.log('\n§7.3 — item damage reads in Force');
eq('a bare number gets the unit', itemDmgLabel({ damage: '2', damageType: ['Bleed'] }), '2 Force Bleed');
eq('...and so does a numeric-typed one', itemDmgLabel({ damage: 6 }), '6 Force');
eq('free text is left exactly alone — it is not a Force number',
   itemDmgLabel({ damage: '2 per hit' }), '2 per hit');
eq('armor still reads as resistance', itemDmgLabel({ resistance: '3 Crush' }), '🛡 3 Crush');
eq('an item with neither reads as nothing', itemDmgLabel({ name: 'Rope' }), '');
eq('no item at all is safe', itemDmgLabel(null), '');

console.log('\n§12.7 / L-23 — a band step is +1 Force');
eq('baseline stock is +0', materialBand('Iron'), 0);
eq('F1 forest is +1', materialBand('Beastbone'), 1);
eq('F2 desert is +2', materialBand('Sky-Iron'), 2);
eq('F3 capital is +3', materialBand('Cursed Gold'), 3);
eq('the lookup ignores case and padding', materialBand('  jade  '), 3);
ok('⚠️ an unwritten material is NULL, never 0 — a Set 2/3 material nobody has named '
   + 'yet must not quietly read as baseline', materialBand('Unobtainium') === null);
eq('and neither an empty name nor no name throws',
   [materialBand(''), materialBand()], [null, null]);
eq('every band in the table is named by its floor and its band step is its key',
   Object.entries(MATERIAL_BANDS).every(([k, b]) => b.floor && b.name && b.materials.length
     && b.materials.every(m => materialBand(m) === Number(k))), true);
eq('no material appears in two bands',
   Object.values(MATERIAL_BANDS).flatMap(b => b.materials).length,
   new Set(Object.values(MATERIAL_BANDS).flatMap(b => b.materials.map(m => m.toLowerCase()))).size);

console.log('\n§12.7 — the STRIKING part is the one that sets it');
eq('the striking part wins over the others',
   strikingMaterial({ materials: [{ part: 'haft', material: 'Sky-Iron' },
                                  { part: 'edge', material: 'Beastbone', striking: true }] }), 'Beastbone');
eq('⭐ which is Kin-Carve exactly — a Sky-Iron haft on a Beastbone edge reads +1, not +2',
   materialBand(strikingMaterial({ materials: [{ part: 'haft', material: 'Sky-Iron' },
                                               { part: 'edge', material: 'Beastbone', striking: true }] })), 1);
eq('no striking part means no material', strikingMaterial({ materials: [{ part: 'haft', material: 'Wood' }] }), '');
eq('no bill at all is safe', [strikingMaterial({}), strikingMaterial(null)], ['', '']);
ok('🔒 RULED — `damage` IS the final Force, so the band is never folded in at display; '
   + 'MATERIAL_BANDS is a crafting reference and a reforge rewrites the card',
   itemDmgLabel({ damage: '3', materials: [{ part: 'edge', material: 'Jade', striking: true }] }) === '3 Force');


// ── L-18 — the max ADVANCES, and current HP comes with it ───────────────────
console.log('\nreconcilePartHp — a level point is not an injury');
const sheet2 = (points, parts, basis) => ({
  identity: { hpBasis: basis },
  traits: { physique: { base: points - 3 }, reflexes: { base: 1 }, mind: { base: 1 }, charm: { base: 1 } },
  bodyParts: parts,
});
eq('partHpBonusFor reads the bonus off a bare total', [14, 18, 19, 24, 164].map(partHpBonusFor), [0, 0, 1, 2, 30]);
eq('...and never goes negative', [0, 13, undefined].map(partHpBonusFor), [0, 0, 0]);

{
  const before = sheet2(14, [{ name: 'Torso', baseHp: 5, currentHp: 5 }], 14);
  ok('an unchanged sheet is returned UNTOUCHED — the same object, so React does not re-render',
     reconcilePartHp(before) === before);
}
{
  // 14 → 24 points: the bonus goes 0 → +2.
  const grown = sheet2(24, [
    { name: 'Torso',    baseHp: 5, currentHp: 5 },   // healthy
    { name: 'Head',     baseHp: 2, currentHp: 1 },   // 1 damage
    { name: 'Left Arm', baseHp: 2, currentHp: 0 },   // destroyed
  ], 14);
  const after = reconcilePartHp(grown);
  eq('⭐ a HEALTHY part stays healthy — 5/5 becomes 7/7, not 5/7',
     [after.bodyParts[0].currentHp, effectiveMaxHp(after.bodyParts[0], after)], [7, 7]);
  eq('⭐ a WOUNDED part keeps its damage — 1 taken before, 1 taken after',
     [after.bodyParts[1].currentHp, effectiveMaxHp(after.bodyParts[1], after)], [3, 4]);
  eq('⛔ a DESTROYED part stays destroyed — growing a body does not grow back an arm',
     after.bodyParts[2].currentHp, 0);
  eq('the basis is stamped forward', after.identity.hpBasis, 24);
  ok('and running it again changes nothing', reconcilePartHp(after) === after);
}
{
  // Losing points (a level revoked, a trait corrected down) must be able to take
  // a part DOWN, including to 0.
  const shrunk = sheet2(14, [{ name: 'Torso', baseHp: 5, currentHp: 7 }, { name: 'Head', baseHp: 2, currentHp: 1 }], 24);
  const after = reconcilePartHp(shrunk);
  eq('a full torso shrinks with its max, 7/7 → 5/5', after.bodyParts[0].currentHp, 5);
  eq('and a part at 1 can be taken to 0 — losing points has to be able to cost a part',
     after.bodyParts[1].currentHp, 0);
}
{
  // Points move but not across a 5-point step: nothing should change but the basis.
  const nudged = sheet2(16, [{ name: 'Torso', baseHp: 5, currentHp: 5 }], 14);
  const after = reconcilePartHp(nudged);
  eq('two points is not a step, so no HP moves', after.bodyParts[0].currentHp, 5);
  eq('but the basis still advances, so the next three points land correctly',
     after.identity.hpBasis, 16);
}
{
  const legacy = { identity: {}, traits: { physique: { base: 40 } }, bodyParts: [{ name: 'Torso', baseHp: 5, currentHp: 5 }] };
  const after = reconcilePartHp(legacy);
  eq('⚠️ a sheet with NO basis adopts today\'s total and moves nothing — there is no way '
     + 'to know what its numbers were written against', after.bodyParts[0].currentHp, 5);
  eq('...and is now tracked', after.identity.hpBasis, 40);
}
eq('DEFAULT_STATE starts life at the creation basis, so a new sheet needs no repair',
   DEFAULT_STATE.identity.hpBasis, CREATION_POINTS);
eq('a part with no currentHp at all is left alone',
   reconcilePartHp(sheet2(24, [{ name: 'Graft', baseHp: 3 }], 14)).bodyParts[0], { name: 'Graft', baseHp: 3 });
eq('no state, no crash', reconcilePartHp(null), null);
eq('no body and no traits, no crash', reconcilePartHp({ identity: { hpBasis: 14 }, traits: {} }).identity.hpBasis, 0);


// ── ⛔ the Growth tag is never shown to a player ─────────────────────────────
console.log('\n⛔ a hidden subtype never reaches a player');
eq('Growth is the hidden one', HIDDEN_SUBTYPES, ['Growth']);
ok('...and it is still a REAL subtype in the vocabulary — the marker stays in the data, '
   + 'which is what makes a reveal possible later',
   HIDDEN_SUBTYPES.every(s => ITEM_SUBTYPES.includes(s)));
eq('⭐ a growth item reads as its plain category, exactly like the junk beside it',
   publicSubtype('Growth', 'Misc'), 'Misc');
eq('...and with no fallback it reads as nothing at all, never as "Growth"',
   publicSubtype('Growth'), '');
eq('an ordinary subtype passes straight through', publicSubtype('Trinket', 'Misc'), 'Trinket');
eq('a blank subtype falls back to the category', publicSubtype('', 'Weapons'), 'Weapons');
eq('whitespace is blank', publicSubtype('   ', 'Tools'), 'Tools');
eq('no arguments at all is safe', [publicSubtype(), publicSubtype(null, null)], ['', null]);
eq('🔒 a Trinket and a Growth item are INDISTINGUISHABLE once both are in Misc',
   [publicSubtype('Growth', 'Misc'), publicSubtype('Misc', 'Misc')], ['Misc', 'Misc']);

// Walk the player-facing components and prove none prints a raw subtype.
{
  const { readdirSync, statSync, readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const offenders = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) { walk(p); continue; }
      if (!/\.jsx$/.test(e)) continue;
      const t = readFileSync(p, 'utf8');
      // `it.subtype` / `item.subtype` READ into markup, outside publicSubtype()
      for (const m of t.matchAll(/\{[^{}]*\b(?:it|item)\.subtype\b[^{}]*\}/g))
        if (!m[0].includes('publicSubtype')) offenders.push(`${e}: ${m[0].slice(0, 60)}`);
    }
  };
  walk(new URL('./components/character', import.meta.url).pathname);
  ok('🔒 no player-facing component renders a raw subtype — every one goes through publicSubtype',
     offenders.length === 0, offenders.join(' | '));
}

console.log('\n§4.2 — the skill ceiling is PER SKILL (ruled 2026-09-22, rulebook v1.13)');
ok('the designated maximum is 15', SKILL_CEILING_MAX === 15);
ok('the ordinary ceiling is 10', SKILL_CEILING_DEFAULT === 10);
// A template written before the ruling has no maxCapacity. It must read as the OLD
// universal value, or the ruling would silently re-cap the whole live library.
eq('🔒 an unset ceiling reads as 10, so nothing written before the ruling changes',
   skillCeiling({ capacity: 5 }), 10);
eq('a basic skill designated 5 stops at 5', skillCeiling({ capacity: 5, maxCapacity: 5 }), 5);
eq('a designated few reach 15', skillCeiling({ capacity: 5, maxCapacity: 15 }), 15);
eq('nothing may be designated past 15', skillCeiling({ capacity: 5, maxCapacity: 40 }), 15);
// A ceiling under the skill's own current cap would strand a level nobody could
// reach — a contestant already sitting at cap 7 on a skill later designated 5.
eq('⚠️ a ceiling below the skill\'s own cap is raised to it, never stranding a level',
   skillCeiling({ capacity: 7, maxCapacity: 5 }), 7);
eq('junk reads as the ordinary ceiling', skillCeiling({ capacity: 5, maxCapacity: 'x' }), 10);
eq('a missing skill does not throw', skillCeiling(undefined), 10);
eq('a fractional ceiling floors', skillCeiling({ capacity: 5, maxCapacity: 10.9 }), 10);

// SkillsTab must not carry the withdrawn flat ceiling any more.
{
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('./components/character/SkillsTab.jsx', import.meta.url).pathname, 'utf8');
  ok('🔒 SkillsTab caps against the skill\'s ceiling, not a hardcoded 10',
     !/cap\s*[<>]=?\s*10/.test(src) && src.includes('skillCeiling'));
}

console.log(`\n${pass} passed · ${fail} failed`);
process.exit(fail ? 1 : 0);
