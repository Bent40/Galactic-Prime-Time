/**
 * Prints the per-floor authoring reference: party body, enemy damage bands, and
 * horde counts for reused older mobs. Everything in BAND UNITS (§12.7 errata
 * 2026-08-18 — the material band is floor-relative and cancels inside a floor).
 *
 *   node floor-bands.js            → the whole ladder
 *   node floor-bands.js --floor 5  → one floor
 *
 * No node_modules, no DB. The numbers in rulebook/enemy-scaling.md are this
 * script's output — regenerate rather than hand-editing them.
 */

// rulebook/level-budget.md L-19 — levels granted per floor, escalating by set.
const LEVELS_PER_FLOOR = { 1: 10, 2: 10, 3: 10, 4: 16, 5: 16, 6: 16, 7: 24, 8: 24, 9: 24 };
const CREATION_POINTS = 14;                       // §2.2
const BASE_TORSO      = 5;                        // §7.1
const HP_PER          = 5;                        // L-19 ⚖ +1 HP per part per 5 total points past creation

// Enemy signature-hit damage as a fraction of a torso ⚖. A mob takes ~2 hits to
// destroy a torso; a boss's signature blow very nearly ends it in one.
const THREAT = { mob: 0.55, elite: 0.85, boss: 1.1, super: 1.7 };

// A party gets roughly this many attacks into a horde per Clock (4 contestants,
// ~1 attack every 2 Moments of a 10-Moment Clock) ⚖.
const ATTACKS_PER_CLOCK = 20;
const WEAPON = 3;        // §12.1 Heavy Large baseline, in band units
const MOB_HP = 5;        // §21.2 mob, in band units — the same on every floor

function floorState(f) {
  let cum = 0;
  for (let i = 1; i <= f; i++) cum += LEVELS_PER_FLOOR[i];
  const points = CREATION_POINTS + cum;
  const torso  = BASE_TORSO + Math.floor((points - CREATION_POINTS) / HP_PER);
  const dmg = {};
  for (const [rank, k] of Object.entries(THREAT)) dmg[rank] = Math.round(torso * k);
  return { floor: f, level: 6 + cum, points, torso, dmg };
}

/** Tide size for a mob native to floor `from`, met at floor `at`. */
function hordeSize(from, at) {
  if (at <= from) return null;
  const killsPerSwing = (WEAPON * 2 ** (at - 1)) / (MOB_HP * 2 ** (from - 1));
  const raw = killsPerSwing * ATTACKS_PER_CLOCK;
  const mag = 10 ** Math.floor(Math.log10(raw));
  return Math.round(raw / (mag / 2)) * (mag / 2);   // round to a table-friendly figure
}

function report() {
  const idx = process.argv.indexOf('--floor');
  const only = idx !== -1 ? Number(process.argv[idx + 1]) : null;
  const floors = only ? [only] : [1, 2, 3, 4, 5, 6, 7, 8, 9];

  console.log('Band units — the material band cancels inside a floor (§12.7 errata).\n');
  console.log('floor  level  points  torso |  mob  elite   boss  super   <- signature hit');
  for (const f of floors) {
    const s = floorState(f);
    console.log(
      `F${String(f).padEnd(5)}${String(s.level).padStart(4)}${String(s.points).padStart(8)}` +
      `${String(s.torso).padStart(7)} |${String(s.dmg.mob).padStart(5)}${String(s.dmg.elite).padStart(7)}` +
      `${String(s.dmg.boss).padStart(7)}${String(s.dmg.super).padStart(7)}`);
  }

  if (!only) {
    console.log('\nHorde counts — an F1-band mob (5 HP) reused as a tide (L-15):');
    console.log('met at floor:  ' + [2,3,4,5,6,7,8,9].map(n => `F${n}`.padStart(6)).join(''));
    console.log('tide size:     ' + [2,3,4,5,6,7,8,9].map(n => String(hordeSize(1, n)).padStart(6)).join(''));
    console.log('\nGeneral rule: a floor-S mob met at floor N arrives ~12 x 2^(N-S) strong.');
    console.log('Check:        ' + [2,3,4,5,6,7,8,9].map(n => String(12 * 2 ** (n - 1)).padStart(6)).join(''));
  }
}

if (require.main === module) report();

module.exports = { floorState, hordeSize, report, LEVELS_PER_FLOOR, THREAT };
