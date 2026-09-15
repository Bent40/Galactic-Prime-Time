/**
 * Dependency-free checks for seed-enemies.js. No DB, no node_modules.
 *   node test-seed-enemies.js
 * Covers the two pieces that are NOT a copy of seed-affixes.js: the §21.2
 * doctrine gate, and the array-aware diff that decides what --force overwrites.
 */
const { doctrineCheck, damageProblems, resistanceProblems, renameProblems, diffFields, partsSum, WEAKNESS_MODES, SIZES, FLOOR_DAMAGE } = require('./seed-enemies');
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
// ⚡ 2026-09-01: the ladder no longer doubles, so an F1 elite is INSIDE F3's wider
// tolerance band. What must still fail is the mobs — they are exact on every floor.
ok('F1 mobs fail at F3 (the mob is exact, and F3 wants 7 not 5)',
   f1.filter(e => e.tier === 'mob')
     .every(e => atF3.some(p => p.startsWith(`${e.name}:`) && /part budget/.test(p))),
   `${atF3.length} problems over ${f1.length} entries`);
ok('a signature written for F1 is flagged when the roster is checked at F3',
   atF3.filter(p => /checked at F3/.test(p)).length === f1.filter(e => e.signature).length);
ok('an over-fat mob is caught',
   doctrineCheck([{ name: 'x', tier: 'mob', notes: '', bodyParts: [{ name: 'B', maxHp: 6 }] }], 1)
     .some(p => p.includes('part budget 6')));
console.log('resistance gate (§10 / §10.1)');
const R = (o) => ({ name: 'x', tier: 'mob', notes: 'n', bodyParts: [{ name: 'B', maxHp: 5 }], ...o });
ok('no resistances at all is fine', resistanceProblems(R({})).length === 0);
ok('a typed resistance passes', resistanceProblems(R({ resistances: [{ type: 'Fire', value: 2, why: 'w' }] })).length === 1,
   'Fire is not a DMG_TYPE — Burn is');
ok('a real typed resistance passes', resistanceProblems(R({ resistances: [{ type: 'Burn', value: 2, why: 'w' }] })).length === 0);
ok('an unknown damage type is rejected', resistanceProblems(R({ resistances: [{ type: 'Sonic', value: 2, why: 'w' }] })).length === 1);
ok('a duplicate type is rejected',
   resistanceProblems(R({ resistances: [{ type: 'Burn', value: 2, why: 'w' }, { type: 'Burn', value: 1, why: 'w' }] })).length === 1);
ok('a zero or negative typed value is rejected',
   resistanceProblems(R({ resistances: [{ type: 'Burn', value: 0, why: 'w' }] })).length === 1
   && resistanceProblems(R({ resistances: [{ type: 'Burn', value: -2, why: 'w' }] })).length === 1);
// §10.1 — the owner's rule: universal resistance is always CAUSED, never a state.
ok('universal with both cause and removal passes',
   resistanceProblems(R({ universal: { value: 4, cause: 'stone shell', removal: 'chip the shell' } })).length === 0);
// §21.3 rule 3, CORRECTED 2026-09-14 — there is NO ceiling. A boss may be genuinely
// impossible for a build that brought the wrong things; the requirement is that a
// path exists, and `removal` is where it is written.
ok('a huge universal is legal so long as it names its cause and removal',
   resistanceProblems(R({ universal: { value: 99, cause: 'a god\'s seal', removal: 'Oathbreaker ignores it' } })).length === 0);
ok('universal with NO CAUSE is refused',
   resistanceProblems(R({ universal: { value: 6, removal: 'chip the shell' } })).some(p => /CAUSE/.test(p)));
ok('universal with NO REMOVAL is refused',
   resistanceProblems(R({ universal: { value: 6, cause: 'stone shell' } })).some(p => /REMOVAL/.test(p)));
ok('universal with neither cause nor removal is refused for both',
   (() => { const p = resistanceProblems(R({ universal: { value: 4 } }));
            return p.length === 2 && p.some(x => /CAUSE/.test(x)) && p.some(x => /REMOVAL/.test(x)); })());
ok('universal 0 needs nothing — the gate skips it',
   resistanceProblems(R({ universal: { value: 0 } })).length === 0);
ok('a negative universal is rejected',
   resistanceProblems(R({ universal: { value: -1, cause: 'c', removal: 'r' } })).length === 1);
// Owner, 2026-09-14: "a mob can have any resistance as well." NO tier check.
ok('A MOB may carry typed AND universal resistance — no tier restriction',
   resistanceProblems(R({ tier: 'mob',
     resistances: [{ type: 'Bleed', value: 3, why: 'w' }, { type: 'Crush', value: 1, why: 'w' }],
     universal: { value: 4, cause: 'crystal rind', removal: 'Crush shatters it' } })).length === 0);
ok('the resistance gate runs inside doctrineCheck',
   doctrineCheck([R({ universal: { value: 6 } })], 1).some(p => /CAUSE/.test(p)));
ok('resistances show up in diffFields',
   diffFields({ resistances: [{ type: 'Burn', value: 2, why: 'w' }] }, { resistances: [{ type: 'Burn', value: 3, why: 'w' }] }).includes('resistances'));
ok('a reordered resistance list is NOT a diff',
   !diffFields({ resistances: [{ type: 'Burn', value: 2, why: 'w' }, { type: 'Bleed', value: 1, why: 'w' }] },
               { resistances: [{ type: 'Bleed', value: 1, why: 'w' }, { type: 'Burn', value: 2, why: 'w' }] }).includes('resistances'));
ok('universal shows up in diffFields',
   diffFields({ universal: { value: 6, cause: 'a', removal: 'b' } },
              { universal: { value: 4, cause: 'a', removal: 'b' } }).includes('universal'));

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
// ⚡ 2026-09-01: tides came down hard. Force grows +1/floor, so kills-per-swing
// grows linearly; what clears a tide is AREA (§7.3, area does not divide), not a
// bigger number. The old 12 x 2^(N-S) rule rode the withdrawn band.
ok('a horde of F1 mobs at F5 is ~100', Math.abs(hordeSize(1, 5) - 100) <= 40);
ok('tides grow, but only in steps — linear Force, integer kills per swing',
   [2,3,4,5,6,7,8,9].every(n => hordeSize(1, n) >= hordeSize(1, n - 1 < 2 ? 2 : n - 1)));
ok('a tide is no longer four digits — an F1 mob at F9 is hundreds, not thousands',
   hordeSize(1, 9) > 50 && hordeSize(1, 9) < 1000);
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

console.log('THE MASKED — the resistance exemplar (§7.3 / §10.1)');
const masked = f1.find(e => e.name === 'THE MASKED');
const maskPart = masked.bodyParts.find(p => p.name === 'Mask');
ok('he is weak to Burn', (masked.weaknesses || []).some(w => w.type === 'Burn'));
ok('Burn is NOT also a resistance — the gate refuses that contradiction',
   !(masked.resistances || []).some(r => r.type === 'Burn')
   && resistanceProblems({ ...masked, resistances: [...masked.resistances, { type: 'Burn', value: 1, why: 'w' }] })
        .some(p => /BOTH a weakness and a resistance/.test(p)));
ok('the ward lives on the MASK, not on the man',
   Number(maskPart.universal.value) === 6
   && !Number((masked.universal || {}).value || 0));
// §21.3 rule 4, CORRECTED 2026-09-14 — over-expression is a JUSTIFICATION failure,
// not a count. So the test is that every line carries its reason, not that there
// are few lines.
ok('every resistance and weakness names WHY',
   (masked.resistances || []).every(r => String(r.why || '').trim())
   && (masked.weaknesses || []).every(w => String(w.why || '').trim()));
ok('a resistance with no WHY is refused — the gate against inventing one to force a tactic',
   resistanceProblems({ name: 'x', tier: 'boss', bodyParts: [],
     resistances: [{ type: 'Chill', value: 2 }] }).some(p => /names no WHY/.test(p)));
ok('a weakness with no WHY is refused too',
   resistanceProblems({ name: 'x', tier: 'boss', bodyParts: [],
     weaknesses: [{ type: 'Burn' }] }).some(p => /names no WHY/.test(p)));
ok('the Mask is allowed to be out of reach — 6 against an F1 average of 5',
   Number(maskPart.universal.value) === 6 && 5 - 6 <= 0);
ok('the Mask\'s universal names both its cause and its removal (§10.1)',
   maskPart.universal.cause.trim().length > 0 && maskPart.universal.removal.trim().length > 0);
ok('a PART-level universal with no removal is refused',
   resistanceProblems({ name: 'x', tier: 'boss',
     bodyParts: [{ name: 'Shell', maxHp: 5, universal: { value: 4, cause: 'plating' } }] })
     .some(p => /part "Shell".*REMOVAL/.test(p)));
ok('a part with no resistances is not checked and not a problem',
   resistanceProblems({ name: 'x', tier: 'mob', bodyParts: [{ name: 'Body', maxHp: 5 }] }).length === 0);
ok('an unknown weakness type is rejected',
   resistanceProblems({ name: 'x', tier: 'mob', weaknesses: [{ type: 'Sonic', why: 'w' }], bodyParts: [] }).length === 1);
ok('weaknesses show up in diffFields, and reordering is not a diff',
   diffFields({ weaknesses: [{ type: 'Burn' }] }, { weaknesses: [{ type: 'Crush' }] }).includes('weaknesses')
   && !diffFields({ weaknesses: [{ type: 'Burn' }, { type: 'Crush' }] },
                  { weaknesses: [{ type: 'Crush' }, { type: 'Burn' }] }).includes('weaknesses'));

console.log('signature migration (enemy-scaling S-1) — F1/F2/F3 complete');
const rosters = { 1: f1, 2: f2, 3: f3 };
ok('ALL 53 entries carry a signature — the gate is no longer optional in practice',
   Object.values(rosters).every(r => r.every(e => e.signature && Number(e.signature.floor))),
   Object.entries(rosters).flatMap(([f, r]) =>
     r.filter(e => !(e.signature && Number(e.signature.floor))).map(e => `F${f} ${e.name}`)).join(', '));
ok('every signature is written for its OWN floor',
   Object.entries(rosters).every(([f, r]) => r.every(e => Number(e.signature.floor) === Number(f))));
ok('every roster passes its own floor\'s damage gate',
   Object.entries(rosters).every(([f, r]) => r.every(e => damageProblems(e, Number(f)).length === 0)),
   Object.entries(rosters).flatMap(([f, r]) =>
     r.flatMap(e => damageProblems(e, Number(f)))).join(' | '));
ok('the five no-attack entries declare it with `presence`, never by omission',
   Object.values(rosters).flat().filter(e => e.signature.exception === 'presence').length === 5
   && Object.values(rosters).flat().filter(e => e.signature.exception === 'presence')
        .every(e => Number(e.signature.damage) === 0 && String(e.signature.note || '').trim()));
ok('F2 damage sits on its own band — mob 5 · elite 8 · boss 10',
   f2.every(e => !e.signature.damage || e.signature.damage === FLOOR_DAMAGE[2][e.tier === 'legendary' ? 'legendary' : e.tier]));
ok('F3 damage sits on its own band — mob 6 · elite 9 · boss 12 · super 19',
   f3.every(e => !e.signature.damage || e.signature.damage === FLOOR_DAMAGE[3][e.tier === 'legendary' ? 'legendary' : e.tier]));

console.log('boss resistance sweep (§21.3) — every line carries its reason');
const allRosters = [...f1, ...f2, ...f3];
ok('every resistance across all 53 entries names WHY',
   allRosters.every(e => (e.resistances || []).every(r => String(r.why || '').trim())),
   allRosters.filter(e => (e.resistances || []).some(r => !String(r.why || '').trim())).map(e => e.name).join(', '));
ok('every weakness across all 53 entries names WHY',
   allRosters.every(e => (e.weaknesses || []).every(w => String(w.why || '').trim())));
ok('every universal — enemy or part — names cause AND removal',
   allRosters.every(e => [e, ...(e.bodyParts || [])].every(h => {
     const u = h.universal || {}; if (!Number(u.value || 0)) return true;
     return String(u.cause || '').trim() && String(u.removal || '').trim(); })));
// §21.3 rule 4 is about justification, never count — so a BLANK block is legal and
// is the right answer where the fiction wants an ordinary creature. Three bosses
// are deliberately blank; this pins that so a later pass does not "fill them in".
const blankByDesign = ['Foreman Bex', 'The Girl in the House — Vermilia', "The Hunt's Owner"];
ok('the three deliberately-blank bosses are still blank',
   blankByDesign.every(n => {
     const e = allRosters.find(x => x.name === n);
     return e && !(e.resistances || []).length && !(e.weaknesses || []).length; }),
   blankByDesign.filter(n => { const e = allRosters.find(x => x.name === n);
     return e && ((e.resistances || []).length || (e.weaknesses || []).length); }).join(', '));
ok('every boss and super has been considered — each is authored or deliberately blank',
   allRosters.filter(e => e.tier === 'boss' || e.tier === 'legendary')
     .every(e => (e.resistances || []).length || (e.weaknesses || []).length
                 || blankByDesign.includes(e.name)
                 || (e.bodyParts || []).some(p => Number((p.universal || {}).value || 0))));

console.log('F2 roster');
ok('the F2 roster passes the doctrine gate AT F2', doctrineCheck(f2, 2).length === 0,
   JSON.stringify(doctrineCheck(f2, 2)));
// ⚡ 2026-09-01: budgets are no longer floor-invariant. A mob is the AVERAGE
// contestant's Force for its floor, so F2 = 6 where F1 = 5.
ok('F2 mobs are 6 Force, not F1\'s 5',
   f2.filter(e => e.tier === 'mob').every(e => partsSum(e) === 6));
ok('F2 elites and bosses were NOT rescaled — they sit inside F2 tolerance as authored',
   doctrineCheck(f2.filter(e => e.tier !== 'mob'), 2).length === 0);
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
ok('the F3 roster passes the doctrine gate AT F3', doctrineCheck(f3, 3).length === 0,
   JSON.stringify(doctrineCheck(f3, 3)));
ok('F3 mobs are 7 Force', f3.filter(e => e.tier === 'mob').every(e => partsSum(e) === 7));
ok('F3 elites, bosses and supers were NOT rescaled — authored numbers still pass',
   doctrineCheck(f3.filter(e => e.tier !== 'mob'), 3).length === 0);
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

// ── rename gate (naming pass 2026-09-14) ─────────────────────────────────────
// Matching is by NAME, so a naming pass without `renamedFrom` would orphan the
// Atlas document and create a duplicate. These guard the migration key itself.
console.log('\nrename gate');
const RN = (name, renamedFrom) => (renamedFrom === undefined ? { name } : { name, renamedFrom });
ok('a roster with no renames has nothing to say',
   renameProblems([RN('A'), RN('B')]).length === 0);
ok('a clean rename passes',
   renameProblems([RN('New Name', 'Old Name'), RN('B')]).length === 0);
ok('renamedFrom pointing at its own name is rejected',
   renameProblems([RN('A', 'A')]).length === 1);
ok('renamedFrom is case-insensitive about its own name',
   renameProblems([RN('A', 'a')]).length === 1);
ok('an empty renamedFrom is rejected — drop the key instead',
   renameProblems([RN('A', '   ')]).length === 1);
ok('renaming ONTO another live seed is rejected — both would claim one document',
   renameProblems([RN('A'), RN('B', 'A')]).some(p => /another seed's live name/.test(p)));
ok('two seeds claiming the same old document is rejected',
   renameProblems([RN('A', 'Old'), RN('B', 'Old')]).some(p => /already claimed/.test(p)));
ok('doctrineCheck runs the rename gate too',
   doctrineCheck([{ ...seed, name: 'X', renamedFrom: 'X' }], 1).some(p => /nothing to migrate/.test(p)));
ok('the two live renames are legal at their own floors',
   renameProblems(f2).length === 0 && renameProblems(f3).length === 0);
ok('renamedFrom is bookkeeping, never a content difference',
   diffFields(clone(), { ...seed, renamedFrom: 'Anything At All' }).length === 0);

// ── weakness MODE + per-part weaknesses (§7.3 / §20.3, built 2026-09-15) ─────
// `heal` is the negative weakness the Incinedile needed: "all fire damage and Burn
// received heals the boss". A PART overrides the body, which is why its Network —
// mycelium, which burns — can take fire while the puppet is healed by it.
console.log('\nweakness modes');
const WK = (o) => ({ tier: 'elite', name: 'W', size: 'Medium', notes: 'n',
  bodyParts: [{ name: 'A', maxHp: 30 }, { name: 'B', maxHp: 30 }], ...o });
ok('the two modes are double and heal',
   WEAKNESS_MODES.join(',') === 'double,heal');
ok('a heal weakness passes when it names its why',
   resistanceProblems(WK({ weaknesses: [{ type: 'Burn', mode: 'heal', why: 'fire feeds it' }] }), 1).length === 0);
ok('an unknown mode is rejected',
   resistanceProblems(WK({ weaknesses: [{ type: 'Burn', mode: 'absorb', why: 'x' }] }), 1)
     .some(p => /mode "absorb"/.test(p)));
ok('a heal weakness still needs a WHY — §21.3 applies to every mode',
   resistanceProblems(WK({ weaknesses: [{ type: 'Burn', mode: 'heal', why: '' }] }), 1)
     .some(p => /names no WHY/.test(p)));
ok('mode defaults to double when omitted, and still passes',
   resistanceProblems(WK({ weaknesses: [{ type: 'Burn', why: 'wood' }] }), 1).length === 0);
ok('a PART may carry its own weakness',
   resistanceProblems(WK({ bodyParts: [
     { name: 'Network', maxHp: 30, weaknesses: [{ type: 'Burn', mode: 'double', why: 'mycelium burns' }] },
     { name: 'B', maxHp: 30 }] }), 1).length === 0);
ok('⭐ the Incinedile shape: fire HEALS the body and HARMS one part',
   resistanceProblems(WK({
     weaknesses: [{ type: 'Burn', mode: 'heal', why: 'all fire received heals the puppet' }],
     bodyParts: [
       { name: 'Network', maxHp: 30, weaknesses: [{ type: 'Burn', mode: 'double', why: 'mycelium burns' }] },
       { name: 'B', maxHp: 30 }] }), 1).length === 0);
ok('a part weakness is checked against the PART\'s resistances, not the body\'s',
   resistanceProblems(WK({
     resistances: [{ type: 'Burn', value: 2, why: 'hide' }],
     bodyParts: [
       { name: 'Network', maxHp: 30, weaknesses: [{ type: 'Burn', mode: 'double', why: 'mycelium burns' }] },
       { name: 'B', maxHp: 30 }] }), 1).length === 0);
ok('but a part that both resists and is weak to one type is still rejected',
   resistanceProblems(WK({ bodyParts: [
     { name: 'Network', maxHp: 30,
       resistances: [{ type: 'Burn', value: 2, why: 'r' }],
       weaknesses:  [{ type: 'Burn', mode: 'double', why: 'w' }] },
     { name: 'B', maxHp: 30 }] }), 1).some(p => /BOTH a weakness and a resistance/.test(p)));
ok('an unknown type is rejected on a part too',
   resistanceProblems(WK({ bodyParts: [
     { name: 'N', maxHp: 30, weaknesses: [{ type: 'Rust', mode: 'heal', why: 'x' }] },
     { name: 'B', maxHp: 30 }] }), 1).some(p => /is not one of/.test(p)));

// 🔴 normParts used to compare { name, maxHp } ONLY, so the per-part resistances and
// universals added 2026-09-14 never showed up as a difference and --force would not
// have written them. These pin the fix.
console.log('\npart-level diff (regression)');
const PB = () => ({ tier: 'boss', size: 'Large', color: '', description: '', notes: 'x',
  bodyParts: [{ name: 'Mask', maxHp: 15, resistances: [], universal: { value: 6, cause: 'a', removal: 'b' }, weaknesses: [] }],
  phases: [], resistances: [], universal: {}, weaknesses: [] });
const mut = (f) => { const c = JSON.parse(JSON.stringify(PB())); f(c); return c; };
ok('a changed PART universal is a bodyParts difference',
   diffFields(PB(), mut(c => { c.bodyParts[0].universal.value = 0; })).includes('bodyParts'));
ok('a changed PART resistance is a bodyParts difference',
   diffFields(PB(), mut(c => { c.bodyParts[0].resistances = [{ type: 'Bleed', value: 2, why: 'w' }]; })).includes('bodyParts'));
ok('a changed PART weakness is a bodyParts difference',
   diffFields(PB(), mut(c => { c.bodyParts[0].weaknesses = [{ type: 'Burn', mode: 'heal', why: 'w' }]; })).includes('bodyParts'));
ok('a changed weakness MODE is a weaknesses difference',
   diffFields(mut(c => { c.weaknesses = [{ type: 'Burn', mode: 'heal', why: 'w' }]; }),
              mut(c => { c.weaknesses = [{ type: 'Burn', mode: 'double', why: 'w' }]; })).includes('weaknesses'));
ok('identical parts are still not a difference',
   diffFields(PB(), PB()).length === 0);

console.log(`\n${pass} passed · ${fail} failed`);
process.exit(fail ? 1 : 0);
