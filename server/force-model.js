/**
 * FORCE — one unit for everything (PROPOSAL, owner direction 2026-09-01).
 *
 * "The units in which we measure success is how much force it would give, if we
 * would equate it to a basic punch." 1 Force = one basic punch. Weapon class,
 * material step, added element, poison, a weakness match — all of it is Force,
 * tagged by damage type. Enemy HP is the Force required to kill.
 *
 * Two rules carry the whole model:
 *   1. A weakness makes that type's Force count DOUBLE.
 *   2. Resistance is a flat reduction CAPPED BY THE INCOMING FORCE OF ITS TYPE.
 *      Fire resist 5 against 1 Fire eats 1 and wastes 4.
 *
 * Consequence the owner was reaching for: the material band stops being x2 per
 * floor and becomes +1 Force per step, so the system goes additive. No x512, no
 * five-digit torsos, and a floor's difficulty lives in what you brought rather
 * than in the size of the number.
 *
 * Run: node server/force-model.js
 */
// it is the weakness. Material step +1. 2+2+1 = 5 → one hit.

const ceil = (a,b) => Math.ceil(a/b);

function swing({ cls=2, matSteps=0, adds=[], weak=null }) {
  // adds: [{type:'Fire', force:1}, ...]
  const parts = [{ type:'Physical', force: cls + matSteps }];
  for (const a of adds) parts.push({ ...a, force: a.type === weak ? a.force*2 : a.force });
  return parts;
}
const total = p => p.reduce((s,x)=>s+x.force,0);

// resistance eats up to the INCOMING force of its own type — never more
function afterResist(parts, resists={}) {
  return parts.map(p => ({...p, force: Math.max(0, p.force - Math.min(p.force, resists[p.type]||0))}));
}

console.log('1 — THE OWNER\'S EXAMPLE, step by step (F1 mob = 5 Force)\n');
const steps = [
  ['bare hands',                 {cls:1}],
  ['wooden bat',                 {cls:2}],
  ['bat + flame',                {cls:2, adds:[{type:'Fire',force:1}]}],
  ['bat + flame, mob weak to fire', {cls:2, adds:[{type:'Fire',force:1}], weak:'Fire'}],
  ['+ better material (+1)',     {cls:2, matSteps:1, adds:[{type:'Fire',force:1}], weak:'Fire'}],
];
for (const [name,cfg] of steps) {
  const f = total(swing(cfg));
  console.log(`${name.padEnd(34)} ${String(f).padStart(2)} Force → ${ceil(5,f)} hit${ceil(5,f)>1?'s':''}`);
}

console.log('\n\n2 — RESISTANCE IS CAPPED BY WHAT YOU DEALT (owner\'s second example)\n');
const bat = swing({cls:3, adds:[{type:'Fire',force:1}]});
console.log('bat: 3 Physical + 1 Fire = 4 Force');
for (const r of [0,1,2,5]) {
  const out = afterResist(bat, {Fire:r});
  console.log(`  vs Fire resist ${r}: ${out.map(p=>`${p.force} ${p.type}`).join(' + ')} = ${total(out)} Force  (resist wasted: ${Math.max(0,r-1)})`);
}

console.log('\n\n3 — MONO vs MIXED vs FOUND-THE-HOLE (boss with diverse resistance)\n');
const boss = { Physical:3, Fire:3, Chill:3 };  // Poison unresisted — the hole
console.log('boss resists: Physical 3 · Fire 3 · Chill 3 · Poison 0\n');
const builds = [
  ['mono physical 6',      [{type:'Physical',force:6}]],
  ['spread 2/2/2',         [{type:'Physical',force:2},{type:'Fire',force:2},{type:'Chill',force:2}]],
  ['mono fire 6',          [{type:'Fire',force:6}]],
  ['found the hole: 6 poison', [{type:'Poison',force:6}]],
  ['hole + physical 3+3',  [{type:'Poison',force:3},{type:'Physical',force:3}]],
];
for (const [name,parts] of builds) {
  const out = afterResist(parts, boss);
  console.log(`${name.padEnd(28)} ${String(total(parts)).padStart(2)} dealt → ${String(total(out)).padStart(2)} lands  (${Math.round(100*total(out)/total(parts))}% through)`);
}

console.log('\n\n4 — LINEAR FLOOR SCALING: what keeps the ratio honest?\n');
console.log('assume material step = +1 Force per band, so a contestant gains ~1 Force/floor\n');
console.log('floor'.padEnd(7)+['avg Force','mob Force','hits','prepared','hits'].map(s=>s.padStart(11)).join(''));
for (let f=1; f<=9; f++) {
  const avg = 2 + f;            // class 2 + one material step per floor
  const prep = avg + 3;         // + element + weakness + coating
  for (const rate of [1]) {
    const mob = 4 + f*rate;     // F1 = 5, +1 per floor
    console.log(String('F'+f).padEnd(7)+[avg, mob, ceil(mob,avg), prep, ceil(mob,prep)].map(s=>String(s).padStart(11)).join(''));
  }
}

console.log('\n\n5 — WHAT ADDITIVE COSTS: the horde power fantasy\n');
console.log('an F1 mob (5 Force) met later — kills per swing, before area multipliers\n');
for (const f of [1,3,5,7,9]) {
  const avg = 2+f, prep = avg+3;
  console.log(`  at F${f}: average ${avg} Force → ${Math.floor(avg/5)} kills/swing · prepared ${prep} → ${Math.floor(prep/5)} kills/swing`);
}
console.log('\n  (multiplicative would have given ~9+ at F5. Additive leans on AREA instead.)');

const CATS = {
  gear:      { max:3, steps:['material band step','added damage type','affix / coating'] },
  situation: { max:2, steps:['ambush','terrain / positioning'] },
  party:     { max:1, steps:['assist — held, flanked or opened'] },
  sponsor:   { max:1, steps:['patron intervention (granted, not bought)'] },
};
const MAXSTEPS = Object.values(CATS).reduce((s,c)=>s+c.max,0);

console.log('CATEGORY BUDGET — max ' + MAXSTEPS + ' steps above the bare weapon\n');
for (const [k,c] of Object.entries(CATS))
  console.log(`  ${k.padEnd(11)} ${c.max} — ${c.steps.join(' · ')}`);

console.log('\n\nCALIBRATION — mob Force set EQUAL to the average contestant\n');
console.log('floor'.padEnd(6)+['weapon','under(-2)','hits','AVERAGE','hits','prepared(+3)','hits','ceiling(+6)','hits'].map(s=>s.padStart(13)).join(''));
for (let f=1;f<=9;f++){
  const weapon = 2;                 // class 2, baseline material
  const avg    = weapon + 1 + (f-1);// +1 band step, +1 more per floor of material
  const mob    = avg;               // ← the calibration
  const under  = Math.max(1, avg-2);
  const prep   = avg+3;
  const ceilF  = avg+6;
  console.log(('F'+f).padEnd(6)+[weapon,under,ceil(mob,under),avg,ceil(mob,avg),prep,ceil(mob,prep),ceilF,ceil(mob,ceilF)]
    .map((s,i)=>String(s).padStart(13)).join(''));
}
console.log('\nmob Force = the AVERAGE column. F1 mob 3? — see note below.');

console.log('\n\nSAME, anchored to the existing F1 mob of 5 Force\n');
console.log('floor'.padEnd(6)+['mob','under','hits','AVERAGE','hits','prepared','hits','ceiling','hits'].map(s=>s.padStart(11)).join(''));
for (let f=1;f<=9;f++){
  const avg   = 4+f;      // F1 average = 5, +1/floor
  const mob   = 4+f;      // mob tracks it exactly
  const under = avg-2, prep = avg+3, cl = avg+6;
  console.log(('F'+f).padEnd(6)+[mob,under,ceil(mob,under),avg,ceil(mob,avg),prep,ceil(mob,prep),cl,ceil(mob,cl)]
    .map(s=>String(s).padStart(11)).join(''));
}

console.log('\n\nWHERE THE AVERAGE COMES FROM AT F1 (mob 5)\n');
const build = [['bare weapon (class 2)',2],['+ gear: floor material',1],['+ gear: added type',1],['+ party: assist',1]];
let t=0; for(const [n,v] of build){t+=v; console.log(`  ${n.padEnd(28)} ${String(v).padStart(2)}  → ${t} Force`);}
console.log(`  ${'= AVERAGE'.padEnd(28)}     ${t} Force → one-shots a 5 Force mob`);
console.log('\n  under-prepared = weapon + material only  → 3 Force → 2 hits');
console.log('  prepared       = + affix + ambush + terrain → 8 Force → 1 hit, 3 spare to cleave');
console.log('  ceiling        = every category maxed      → 11 Force → 2 kills per swing');
