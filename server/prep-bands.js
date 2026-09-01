/**
 * PREP BANDS — the preparation model (PROPOSAL, owner direction 2026-09-01).
 *
 * The owner's frame: stop balancing on damage numbers, balance on HITS TO KILL,
 * and make hits-to-kill a function of PREPARATION rather than of floor. Define
 * what an under-prepared, average and prepared party achieves; that spread is the
 * band the whole game is tuned inside. At the table it resolves to a flat
 * modifier — the planning is where the complexity lives, not the arithmetic.
 *
 * Anchor (owner): "Mobs should be one shot at an average rate of success or
 * slightly below it even."
 *
 * Companion to floor-bands.js, which owns the CROSS-floor axis. This owns the
 * WITHIN-floor axis, which the §12.7 errata left empty — and that emptiness is
 * why every floor read as the same fight in a new colour.
 *
 * Run: node server/prep-bands.js
 */
// Anchor: mob = 5 HP (band units, floor-invariant, §21.2 / E-0).
// Weapon classes §12.1: Light Small 2, Light Large 2, Heavy Small 2, Heavy Large 3.
// Material band: a floor's own material DOUBLES the M-0 baseline (§12.7, "F1 ×2").

const CLASSES = { 'Light Small': 2, 'Light Large': 2, 'Heavy Small': 2, 'Heavy Large': 3 };
const MOB = 5, ELITE = 60, BOSS = 125, SUPER = 300;

// preparation steps, each expressed as what it does to one swing
const STEPS = {
  band:     { label: 'floor-band material',  apply: d => d * 2 },
  inherent: { label: 'material inherent (+1)', apply: d => d + 1 },
  type:     { label: 'damage-type match',    apply: d => Math.round(d * 1.5) },
  coating:  { label: 'coating / consumable', apply: d => d + 1 },
  affix:    { label: 'affix',                apply: d => d + 1 },
};

function dmg(cls, steps) {
  let d = CLASSES[cls];
  for (const s of steps) d = STEPS[s].apply(d);
  return d;
}
const hits = (d, hp) => Math.ceil(hp / d);

const TIERS = [['scrap only',[]],
               ['floor band',['band']],
               ['band + inherent',['band','inherent']],
               ['band + type match',['band','type']],
               ['band + inherent + type',['band','inherent','type']],
               ['band + inherent + type + coating',['band','inherent','type','coating']]];

console.log('HITS TO KILL ONE 5 HP MOB — the calibration anchor\n');
console.log('preparation'.padEnd(36) + Object.keys(CLASSES).map(c=>c.padStart(14)).join(''));
for (const [name, steps] of TIERS) {
  const row = Object.keys(CLASSES).map(c => {
    const d = dmg(c, steps);
    return `${d} → ${hits(d,MOB)} hit${hits(d,MOB)>1?'s':''}`.padStart(14);
  }).join('');
  console.log(name.padEnd(36) + row);
}

console.log('\n\nTHE BAND, per weapon class (damage in band units)\n');
for (const c of Object.keys(CLASSES)) {
  const lo = dmg(c, []), mid = dmg(c, ['band']), hi = dmg(c, ['band','inherent','type','coating']);
  console.log(`${c.padEnd(14)} under ${String(lo).padStart(2)}  ·  average ${String(mid).padStart(2)}  ·  prepared ${String(hi).padStart(2)}   (spread ×${(hi/lo).toFixed(1)})`);
}

// Party throughput. Clock = 10 Moments; an attack costs 1; assume a contestant
// actually swings ATT of those 10 (rest is movement, skills, repositioning).
const PARTY = 4, ATT = 5;
console.log(`\n\nCLOCKS TO CLEAR — party of ${PARTY}, ${ATT} swings each per Clock (${PARTY*ATT} swings)\n`);
console.log('preparation'.padEnd(36) + ['ELITE 60','BOSS 125','SUPER 300'].map(s=>s.padStart(12)).join(''));
for (const [name, steps] of TIERS) {
  const d = dmg('Heavy Large', steps) * PARTY * ATT;
  const row = [ELITE,BOSS,SUPER].map(hp => `${(hp/d).toFixed(2)}`.padStart(12)).join('');
  console.log(name.padEnd(36) + row);
}

console.log('\n\nSENSITIVITY — Clocks to clear at AVERAGE prep (floor-band Heavy Large, 6 dmg)\n');
console.log('swings/Clock each'.padEnd(20) + ['party dmg/Clock','ELITE 60','BOSS 125','SUPER 300'].map(s=>s.padStart(16)).join(''));
for (const att of [2,3,4,5,8]) {
  const d = 6 * PARTY * att;
  console.log(String(att).padEnd(20) + [d, (ELITE/d).toFixed(1), (BOSS/d).toFixed(1), (SUPER/d).toFixed(1)].map(s=>String(s).padStart(16)).join(''));
}

console.log('\n\nWHAT HP WOULD GIVE THE INTENDED FIGHT LENGTH? (average prep, 3 swings each)\n');
const dpc = 6 * PARTY * 3;
console.log(`party output = ${dpc} per Clock at average prep\n`);
for (const [tier, clocks] of [['mob (instant)',0.05],['elite',1],['boss',3],['super',5]]) {
  console.log(`${tier.padEnd(16)} ${String(clocks).padStart(4)} Clock(s) → needs ${Math.round(dpc*clocks)} HP`);
}
console.log('\ncurrent budgets:  elite 60 · boss 125 · super 300');

console.log('\n\nOVERKILL WASTE — damage does not pool across parts (§7.3)\n');
// a boss's budget is spread over parts; a swing into a small part wastes the surplus
const bossParts = [15,14,45,12,12,13,14]; // THE MASKED, actual
const swing = 6;
let wasted = 0, spent = 0;
for (const p of bossParts) { const n = Math.ceil(p/swing); spent += n*swing; wasted += n*swing - p; }
console.log(`THE MASKED parts ${bossParts.join('/')} = ${bossParts.reduce((a,b)=>a+b)} budget`);
console.log(`at ${swing} per swing: ${Math.ceil(spent/swing)} swings, ${wasted} damage wasted on overkill (${(100*wasted/spent).toFixed(0)}%)`);
console.log(`effective HP ≈ ${spent} rather than ${bossParts.reduce((a,b)=>a+b)}`);
