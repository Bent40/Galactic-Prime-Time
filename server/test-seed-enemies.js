/**
 * Dependency-free checks for seed-enemies.js. No DB, no node_modules.
 *   node test-seed-enemies.js
 * Covers the two pieces that are NOT a copy of seed-affixes.js: the §21.2
 * doctrine gate, and the array-aware diff that decides what --force overwrites.
 */
const { doctrineCheck, damageProblems, diffFields, partsSum, SIZES, FLOOR_DAMAGE } = require('./seed-enemies');
const f1 = require('./seeds/enemies-f1.js');
const f2 = require('./seeds/enemies-f2.js');
const f3 = require('./seeds/enemies-f3.js');

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  ok    ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};

console.log('doctrine gate');
ok('the shipped F1 roster passes at F1', doctrineCheck(f1, 1).length === 0,
   JSON.stringify(doctrineCheck(f1, 1)));
// Was `=== f1.length`, which quietly assumed one problem per entry. Once entries
// carry a signature they ALSO complain about the floor mismatch, so the count moved.
// Assert the intent instead: every entry's HP is wrong at F3, and the migrated ones
// additionally say their signature was written for another floor.
const atF3 = doctrineCheck(f1, 3);
ok('the same roster fails at F3 (floor scaling is live)',
   f1.every(e => atF3.some(p => p.startsWith(`${e.name}:`) && /part budget/.test(p))),
   `${atF3.length} problems over ${f1.length} entries`);
ok('a signature written for F1 is flagged when the roster is checked at F3',
   atF3.filter(p => /checked at F3/.test(p)).length === f1.filter(e => e.signature).length);
ok('an over-fat mob is caught',
   doctrineCheck([{ name: 'x', tier: 'mob', notes: '', bodyParts: [{ name: 'B', maxHp: 6 }] }], 1)
     .some(p => p.includes('part budget 6')));
console.log('non-mob tolerance (owner ruling: only mobs are exact)');
const elite = (hp) => [{ name: 'x', tier: 'elite', size: 'Medium', notes: 'n',
                         bodyParts: [{ name: 'H', maxHp: 1 }, { name: 'T', maxHp: hp - 1 }] }];
ok('an elite at 45 passes (the Chainbearer)', doctrineCheck(elite(45), 1).length === 0);
ok('an elite at 78 passes (the Step-Warden)', doctrineCheck(elite(78), 1).length === 0);
ok('an elite at 30 passes — the low edge', doctrineCheck(elite(30), 1).length === 0);
ok('an elite at 120 passes — the high edge', doctrineCheck(elite(120), 1).length === 0);
ok('an elite at 12 is caught as a gross error', doctrineCheck(elite(12), 1).some(p => p.includes('outside')));
ok('an elite at 400 is caught as a gross error', doctrineCheck(elite(400), 1).some(p => p.includes('outside')));
ok('a mob is still EXACT — 6 is rejected',
   doctrineCheck([{ name: 'x', tier: 'mob', size: 'Medium', notes: '', bodyParts: [{ name: 'B', maxHp: 6 }] }], 1)
     .some(p => p.includes('exactly 5')));
ok('the shipped roster VARIES its elites', new Set(f1.filter(e => e.tier === 'elite').map(partsSum)).size > 1);
ok('the shipped roster VARIES its bosses', new Set(f1.filter(e => e.tier === 'boss').map(partsSum)).size > 1);
ok('every shipped mob is exactly 5', f1.filter(e => e.tier === 'mob').every(e => partsSum(e) === 5));

ok('a multi-part mob is caught (E-0.2)',
   doctrineCheck([{ name: 'x', tier: 'mob', notes: '', bodyParts: [{ name: 'H', maxHp: 2 }, { name: 'T', maxHp: 3 }] }], 1)
     .some(p => p.includes('ONE part')));
ok('a single-part elite is caught (E-0.2 — elite and above are multi-part)',
   doctrineCheck([{ name: 'x', tier: 'elite', size: 'Medium', notes: 'n', bodyParts: [{ name: 'T', maxHp: 60 }] }], 1)
     .some(p => p.includes('MULTI-part')));
ok('every shipped non-mob is multi-part', f1.filter(e => e.tier !== 'mob').every(e => e.bodyParts.length >= 2));
ok('every shipped mob is exactly one part', f1.filter(e => e.tier === 'mob').every(e => e.bodyParts.length === 1));
ok('a non-mob with no weak system is caught (E-0.3)',
   doctrineCheck([{ name: 'x', tier: 'elite', size: 'Medium', notes: '   ', bodyParts: [{ name: 'H', maxHp: 10 }, { name: 'T', maxHp: 50 }] }], 1)
     .some(p => p.includes('no notes')));
ok('an unknown tier is caught',
   doctrineCheck([{ name: 'x', tier: 'miniboss', size: 'Medium', notes: 'n', bodyParts: [{ name: 'H', maxHp: 10 }, { name: 'T', maxHp: 50 }] }], 1)
     .some(p => p.includes('unknown tier')));
ok('a mob is not required to carry notes',
   doctrineCheck([{ name: 'x', tier: 'mob', size: 'Medium', notes: '', bodyParts: [{ name: 'B', maxHp: 5 }] }], 1).length === 0);
ok('partsSum sums the F1 super to 300', partsSum(f1.find(e => e.tier === 'legendary')) === 300);

console.log('size (§7.1)');
ok('every shipped entry carries a legal size', f1.every(e => SIZES.includes(e.size)),
   f1.filter(e => !SIZES.includes(e.size)).map(e => e.name).join());
ok('a bad size is caught',
   doctrineCheck([{ name: 'x', tier: 'mob', size: 'Enormous', notes: '', bodyParts: [{ name: 'B', maxHp: 5 }] }], 1)
     .some(p => p.includes('is not one of')));
ok('a missing size is caught',
   doctrineCheck([{ name: 'x', tier: 'mob', notes: '', bodyParts: [{ name: 'B', maxHp: 5 }] }], 1)
     .some(p => p.includes('is not one of')));
ok('the Loong Kin is Huge — two sizes over Medium, so ungrappleable (§13)',
   f1.find(e => e.name === 'Loong Kin').size === 'Huge');
ok('the Loong Kin keeps 300 across its Loong-form parts',
   partsSum(f1.find(e => e.name === 'Loong Kin')) === 300);
ok('the Loong Kin opens in Warden Form and turns',
   f1.find(e => e.name === 'Loong Kin').phases[0].name === 'Warden Form' &&
   f1.find(e => e.name === 'Loong Kin').phases[1].name === 'The Turn');
ok('a changed size is reported as a difference',
   diffFields({ ...JSON.parse(JSON.stringify(f1[0])), size: 'Huge' }, f1[0]).join() === 'size');

console.log('floor bands (enemy-scaling S-1)');
const { floorState, hordeSize } = require('./floor-bands');
const b1 = floorState(1).dmg;
ok('F1 bands are 4/6/8/12', b1.mob === 4 && b1.elite === 6 && b1.boss === 8 && b1.super === 12);
ok('F9 torso is 35 band units', floorState(9).torso === 35);
ok('the ladder is monotonic in torso and damage',
   [1,2,3,4,5,6,7,8].every(f => floorState(f).torso < floorState(f + 1).torso &&
                                floorState(f).dmg.mob <= floorState(f + 1).dmg.mob));
ok('a horde of F1 mobs at F5 is ~200', Math.abs(hordeSize(1, 5) - 200) <= 50);
ok('the 12 x 2^(N-S) rule tracks the computed tide',
   [2,3,4,5,6,7,8,9].every(n => Math.abs(hordeSize(1, n) - 12 * 2 ** (n - 1)) / (12 * 2 ** (n - 1)) < 0.15));
ok('hordeSize refuses a floor at or below the mob\'s own', hordeSize(3, 3) === null && hordeSize(3, 2) === null);

// Every damage number authored into F1 notes/phases must sit in the F1 band, allowing
// telegraphed windups above it and per-Moment ticks below it (enemy-scaling S-1).
const outliers = [];
for (const e of f1) {
  const text = (e.notes || '') + ' ' + (e.phases || []).map(p => p.description).join(' ');
  const nums = [...text.matchAll(/(\d+)\s+(Bleed|Crush|Burn|Chill)/g)].map(m => +m[1]);
  const band = b1[e.tier === 'legendary' ? 'super' : e.tier];
  for (const n of nums) if (n > band * 2 || n < 1) outliers.push(`${e.name}:${n} (band ${band})`);
}
ok('no authored F1 damage is wildly outside its band', outliers.length === 0, outliers.join(' · '));

console.log('F2 roster');
ok('the F2 roster passes the doctrine gate', doctrineCheck(f2, 1).length === 0,
   JSON.stringify(doctrineCheck(f2, 1)));
ok('F2 HP budgets are identical to F1 — band units are floor-invariant',
   f2.filter(e => e.tier === 'mob').every(e => partsSum(e) === 5));
ok('F2 varies its elites and bosses',
   new Set(f2.filter(e => e.tier === 'elite').map(partsSum)).size > 1 &&
   new Set(f2.filter(e => e.tier === 'boss').map(partsSum)).size > 1);
ok('every F2 entry carries a legal size', f2.every(e => SIZES.includes(e.size)));
ok('every F2 non-mob names a weak system', f2.filter(e => e.tier !== 'mob').every(e => (e.notes || '').trim()));
ok('no name collides between the F1 and F2 rosters',
   f2.every(e => !f1.some(x => x.name.toLowerCase() === e.name.toLowerCase())));
{
  const b2 = floorState(2).dmg, bad = [];
  for (const e of f2) {
    const text = (e.notes || '') + ' ' + (e.phases || []).map(p => p.description).join(' ');
    const nums = [...text.matchAll(/(\d+)\s+(Bleed|Crush|Burn|Chill)/g)].map(m => +m[1]);
    const band = b2[e.tier === 'legendary' ? 'super' : e.tier];
    for (const n of nums) if (n > band * 2 || n < 1) bad.push(`${e.name}:${n} (band ${band})`);
  }
  ok('F2 authored damage sits in the F2 band', bad.length === 0, bad.join(' · '));
}

console.log('F3 roster');
ok('the F3 roster passes the doctrine gate', doctrineCheck(f3, 1).length === 0,
   JSON.stringify(doctrineCheck(f3, 1)));
ok('F3 varies its elites', new Set(f3.filter(e => e.tier === 'elite').map(partsSum)).size > 1);
ok('F3 has a super boss at 300 (Nullrot)',
   f3.some(e => e.tier === 'legendary' && partsSum(e) === 300));
ok('every F3 entry carries a legal size', f3.every(e => SIZES.includes(e.size)));
{
  const b3 = floorState(3).dmg, bad = [];
  for (const e of f3) {
    const text = (e.notes || '') + ' ' + (e.phases || []).map(p => p.description).join(' ');
    const nums = [...text.matchAll(/(\d+)\s+(Bleed|Crush|Burn|Chill)/g)].map(m => +m[1]);
    const band = b3[e.tier === 'legendary' ? 'super' : e.tier];
    for (const n of nums) if (n > band * 2 || n < 1) bad.push(`${e.name}:${n} (band ${band})`);
  }
  ok('F3 authored damage sits in the F3 band', bad.length === 0, bad.join(' · '));
}

// The seeder matches by NAME across one collection, so a duplicate between rosters
// would silently overwrite. Guard every pair.
{
  const all = [...f1, ...f2, ...f3].map(e => e.name.toLowerCase());
  const dupes = [...new Set(all.filter((n, i) => all.indexOf(n) !== i))];
  ok('no name is reused across the F1/F2/F3 rosters', dupes.length === 0, dupes.join(', '));
}

console.log('diff (what --force would overwrite)');
const seed = f1[0];
const clone = () => JSON.parse(JSON.stringify(seed));
ok('an identical doc reports no differences', diffFields(clone(), seed).length === 0);
ok('a changed scalar is reported',
   diffFields({ ...clone(), notes: 'owner edited this' }, seed).join() === 'notes');
ok('a changed part HP is reported',
   diffFields({ ...clone(), bodyParts: [{ name: 'Bramble Body', maxHp: 9 }] }, seed).join() === 'bodyParts');
ok('a renamed part is reported',
   diffFields({ ...clone(), bodyParts: [{ name: 'Thorn Body', maxHp: 5 }] }, seed).join() === 'bodyParts');
ok('an added phase is reported',
   diffFields({ ...clone(), phases: [{ name: 'P', description: 'd', hpThreshold: 't' }] }, seed).join() === 'phases');
const boss = f1.find(e => e.name === 'THE MASKED');
ok('a boss round-trips its 3 phases with no false difference',
   diffFields(JSON.parse(JSON.stringify(boss)), boss).length === 0);
ok('extra Mongoose subdoc bookkeeping is not a difference',
   diffFields({ ...clone(), bodyParts: [{ name: 'Bramble Body', maxHp: 5, _id: 'abc', $__: {} }] }, seed).length === 0);
ok('a missing field on either side is not a false difference',
   diffFields({ ...clone(), color: undefined }, { ...seed, color: '' }).length === 0);

console.log('signature damage gate (enemy-scaling S-1)');
const sigMob = (sig, tier = 'mob') => ({ name: 'T', tier, size: 'Medium', bodyParts: [{ name: 'B', maxHp: 5 }], notes: 'x', signature: sig });
ok('no signature at all is skipped — existing rosters keep passing',
   damageProblems({ name: 'T', tier: 'mob' }, 1).length === 0);
ok('signature.floor 0 is skipped (the unmigrated default)',
   damageProblems(sigMob({ floor: 0, damage: 999, type: 'Crush' }), 1).length === 0);
ok('an on-band F1 mob passes',
   damageProblems(sigMob({ floor: 1, damage: 4, type: 'Crush' }), 1).length === 0);
ok('an off-band F1 mob fails',
   damageProblems(sigMob({ floor: 1, damage: 7, type: 'Crush' }), 1).length === 1);
ok('an F1 elite is held to 6, not the mob 4',
   damageProblems(sigMob({ floor: 1, damage: 4, type: 'Crush' }, 'elite'), 1).length === 1
   && damageProblems(sigMob({ floor: 1, damage: 6, type: 'Crush' }, 'elite'), 1).length === 0);
ok("the Step-Warden's telegraphed 10 passes as a windup, and would fail on-band",
   damageProblems(sigMob({ floor: 1, damage: 10, type: 'Crush', exception: 'windup' }, 'elite'), 1).length === 0
   && damageProblems(sigMob({ floor: 1, damage: 10, type: 'Crush' }, 'elite'), 1).length === 1);
ok('a windup is still capped — 2x band is the ceiling, 13 is not "telegraphed"',
   damageProblems(sigMob({ floor: 1, damage: 13, type: 'Crush', exception: 'windup' }, 'elite'), 1).length === 1);
ok("the Husk-Moth's per-Moment 2 passes as a tick, and would fail on-band",
   damageProblems(sigMob({ floor: 1, damage: 2, type: 'Infected', exception: 'tick' }), 1).length === 0
   && damageProblems(sigMob({ floor: 1, damage: 2, type: 'Infected' }), 1).length === 1);
ok('a tick has a floor too — 0.2x band, so it cannot be a rounding error',
   damageProblems(sigMob({ floor: 1, damage: 0, type: 'Infected', exception: 'tick' }), 1).length > 0);
// E-7 ruled 2026-09-01 — two more legitimate shapes, both found by the gate's first run.
ok("THE MASKED's 6 passes as an aura, and would fail on-band",
   damageProblems(sigMob({ floor: 1, damage: 6, type: 'Crush', exception: 'aura' }, 'boss'), 1).length === 0
   && damageProblems(sigMob({ floor: 1, damage: 6, type: 'Crush' }, 'boss'), 1).length === 1);
ok('an aura has a floor — 0.5x band, so it cannot excuse a token number',
   damageProblems(sigMob({ floor: 1, damage: 3, type: 'Crush', exception: 'aura' }, 'boss'), 1).length === 1);
ok('an aura cannot go ABOVE band either — that is a windup, not an aura',
   damageProblems(sigMob({ floor: 1, damage: 10, type: 'Crush', exception: 'aura' }, 'boss'), 1).length === 1);
ok("Vermilia's no-attack passes as presence",
   damageProblems(sigMob({ floor: 1, damage: 0, type: '', exception: 'presence',
     note: 'noble-class presence; she never swings' }, 'boss'), 1).length === 0);
ok('presence with a damage number is rejected — it is a claim of NO attack',
   damageProblems(sigMob({ floor: 1, damage: 4, type: 'Crush', exception: 'presence',
     note: 'x' }, 'boss'), 1).length === 1);
ok('presence with no note is rejected — the threat has to be written down',
   damageProblems(sigMob({ floor: 1, damage: 0, type: '', exception: 'presence' }, 'boss'), 1).length === 1);
ok('presence is still floor-checked — an F1 claim fails at F3',
   damageProblems(sigMob({ floor: 1, damage: 0, type: '', exception: 'presence',
     note: 'x' }, 'boss'), 3).length === 1);
ok('an unknown exception word is rejected',
   damageProblems(sigMob({ floor: 1, damage: 4, type: 'Crush', exception: 'special' }), 1).length === 1);
ok('a number with no damage type is rejected',
   damageProblems(sigMob({ floor: 1, damage: 4, type: '' }), 1).length === 1);
ok('a roster checked at the wrong floor is caught',
   damageProblems(sigMob({ floor: 2, damage: 5, type: 'Crush' }), 1).some(p => /checked at F1/.test(p)));
ok('signature.floor outside F1-F9 is rejected',
   damageProblems(sigMob({ floor: 12, damage: 4, type: 'Crush' }), 1).length === 1);
ok('damage RISES per floor while HP does not (the whole point of S-1)',
   FLOOR_DAMAGE[1].mob === 4 && FLOOR_DAMAGE[9].mob === 19 && FLOOR_DAMAGE[3].legendary === 19);
ok('doctrineCheck runs the damage gate too',
   doctrineCheck([sigMob({ floor: 1, damage: 99, type: 'Crush' })], 1).some(p => /enemy-scaling S-1/.test(p)));
ok('a signature difference is reported by diffFields',
   diffFields({ ...clone(), signature: { floor: 1, damage: 4, type: 'Crush' } }, seed).join() === 'signature');
ok('an absent signature on both sides is not a false difference',
   diffFields(clone(), seed).length === 0);

console.log(`\n${pass} passed · ${fail} failed`);
process.exit(fail ? 1 : 0);
