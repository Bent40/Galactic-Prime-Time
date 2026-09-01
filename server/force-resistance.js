/**
 * FORCE — resistance and area (PROPOSAL, owner direction 2026-09-01).
 *
 * Two additions to the Force model:
 *
 *   UNIVERSAL RESISTANCE. A flat reduction against every type at once, which is
 *   the same object as a damage threshold: "needs 7 Force to break" IS universal
 *   resistance 6. Applies to the TOTAL, once — per-type application breaks the
 *   threshold reading (8 Force would fail a 7-threshold). Typed resistance
 *   resolves FIRST, universal on the remainder; any other order is ill-defined
 *   on a mixed attack.
 *
 *   AREA DOES NOT DIVIDE. An attack's Force lands in full on every target in its
 *   space unless the attack says otherwise. Nine enemies in the arc take the
 *   whole number each. Each target then applies its own resistances.
 *
 * Together these give the two preparation problems the system was missing:
 * typed resistance asks "did you bring the right type" and universal resistance
 * asks "did you bring enough at once".
 *
 * Run: node server/force-resistance.js
 */
const T=p=>p.reduce((s,x)=>s+x.force,0);
// typed resistance first (capped per type), THEN universal on the remainder.
// Any other order is ill-defined once the attack is mixed.
function resolve(parts, {typed={}, universal=0}={}) {
  const afterTyped = parts.map(p=>({...p, force: Math.max(0,p.force-Math.min(p.force, typed[p.type]||0))}));
  const sub = T(afterTyped);
  return { typed: sub, final: Math.max(0, sub - universal) };
}
const row=(a,b)=>String(a).padEnd(38)+b;

console.log('1 — UNIVERSAL RESISTANCE IS A THRESHOLD\n');
console.log('  "needs 7 Force to break" === universal resistance 6\n');
for (const f of [4,5,6,7,8,10]) {
  const r = resolve([{type:'Physical',force:f}], {universal:6});
  console.log(row(`  a ${f}-Force blow`, `${r.final} lands  ${r.final>0?'✓ breaks':'✗ nothing'}`));
}

console.log('\n2 — WHY UNIVERSAL APPLIES TO THE TOTAL, NOT PER TYPE\n');
const mixed=[{type:'Physical',force:4},{type:'Fire',force:4}];
console.log(row('  4 Physical + 4 Fire = 8 Force',''));
console.log(row('  universal 6 on the TOTAL', `${resolve(mixed,{universal:6}).final} lands  ✓ 8 beats a 7-threshold`));
const perType = mixed.map(p=>Math.max(0,p.force-6)).reduce((a,b)=>a+b,0);
console.log(row('  universal 6 applied PER TYPE', `${perType} lands  ✗ 8 damage fails a 7-threshold`));
console.log('\n  Per-type breaks the threshold reading. Total preserves it.');

console.log('\n3 — TYPED + UNIVERSAL TOGETHER (order matters, typed goes first)\n');
const atk=[{type:'Physical',force:6},{type:'Fire',force:2}];
const r=resolve(atk,{typed:{Fire:3},universal:3});
console.log(row('  6 Physical + 2 Fire = 8 Force',''));
console.log(row('  vs Fire 3 (eats 2, wastes 1)', `${r.typed} Force survives typing`));
console.log(row('  then universal 3', `${r.final} lands`));

console.log('\n4 — AREA DOES NOT DIVIDE: the horde answer\n');
console.log('  an F1 mob is 5 Force. A sweep hits everyone in the arc at full Force.\n');
console.log('  targets'.padEnd(12)+['single-target 5F','sweep 5F (no divide)','sweep, old ÷ rule'].map(s=>s.padStart(24)).join(''));
for (const n of [1,3,6,9,20]) {
  const div = Math.floor(5/n);
  console.log(String(n).padEnd(12)+[`1 kill`, `${n} kills`, `${Math.floor(5/n)>0?n*div+' kills':'0 kills'}`].map(s=>s.padStart(24)).join(''));
}
console.log('\n  4 contestants x ~5 swings/Clock, sweeps over 9 spaces = up to 180 mobs a Clock.');
console.log('  The tide is cleared by AREA, not by a bigger number. Exactly the L-15 fantasy.');

console.log('\n5 — IS AREA STRICTLY BETTER? (the §12.1 worry)\n');
const CL={'Heavy Small':{f:2,area:1,phys:2,cost:1},'Heavy Large':{f:3,area:'arc',phys:5,cost:'1-2'},
          'Light Large':{f:2,area:'line',phys:3,cost:1},'Light Small':{f:2,area:1,phys:1,cost:1}};
for (const [k,v] of Object.entries(CL))
  console.log(`  ${k.padEnd(13)} ${v.f} Force · hits ${String(v.area).padEnd(4)} · needs Physique ${String(v.phys).padEnd(2)} · cost ${v.cost}`);
console.log('\n  Heavy Large looks dominant — until §12.1\'s own rider:');
console.log('  "2 hands + adjacent empty radius". You cannot swing it in a press of nine.');
console.log('  The counterweight to no-division is already written into the class.');
