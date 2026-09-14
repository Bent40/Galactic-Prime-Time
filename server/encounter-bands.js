/**
 * ENCOUNTER SIZING (f1-enemy-pass E-4). How big is a room, and how hard does it
 * push back? Everything in FORCE (§7.3); no new dials — every constant here is
 * already load-bearing somewhere else.
 *
 *   node encounter-bands.js            → the whole ladder
 *   node encounter-bands.js --floor 3  → one floor
 *
 * No node_modules, no DB. The tables in rulebook/enemy-scaling.md S-4 are this
 * script's output — regenerate rather than hand-editing them.
 *
 * ── THE TWO DIALS ────────────────────────────────────────────────────────────
 * SIZE is how long the room takes. A mob is calibrated as ONE average swing
 * (§7.3), so mobs-per-Clock equals attacks-per-Clock — 20 — on EVERY floor.
 * Room size is therefore just the fraction of a Clock you want it to cost, and
 * it never changes as the campaign climbs.
 *
 * DANGER is how many of them can reach you. That is geometry, not floor: a
 * corridor two abreast is two abreast at F1 and at F9. What it costs you is
 *   width x mob signature x (count / 2)
 * — the party kills ~2 mobs a Moment, so a room of N lasts ~N/2 Moments, and
 * every Moment the engaged rank swings. That is a CEILING: it assumes the party
 * stands still and trades, nobody moves, nobody blocks, and the width stays full
 * as the room dies. Real rooms come in under it. Author against the ceiling.
 */
const floorIdx = process.argv.indexOf('--floor');
const only     = floorIdx !== -1 ? Number(process.argv[floorIdx + 1]) : null;

const LEVELS_PER_FLOOR = { 1: 10, 2: 10, 3: 10, 4: 16, 5: 16, 6: 16, 7: 24, 8: 24, 9: 24 };
const CREATION_POINTS  = 14;                       // §2.2
const HP_PER           = 5;                        // L-19
const BASE_PARTS = { Head: 2, Torso: 5, 'Arm L': 2, 'Arm R': 2, 'Leg L': 3, 'Leg R': 3 };  // §3.2
const PARTY            = 4;                        // §2.1 — the assumed table
const ATTACKS_PER_CLOCK = 20;                      // floor-bands.js, same constant
const MOB_THREAT       = 0.55;                     // floor-bands.js THREAT.mob
const KILLS_PER_MOMENT = ATTACKS_PER_CLOCK / 10;   // a Clock is 10 Moments (§6)

// The room shapes. Cost is a fraction of a Clock; because a mob is one swing,
// the mob count is floor-invariant.
const SHAPES = [
  { name: 'Brush',      clocks: 0.25, use: 'travel noise; teaches one gate and ends' },
  { name: 'Room',       clocks: 0.5,  use: 'the default — one exchange, one decision' },
  { name: 'Held room',  clocks: 1.0,  use: 'they were waiting; a full Clock of work' },
  { name: 'Tide',       clocks: 2.0,  use: 'run it as ONE horde with a count (L-15), never as N entities' },
];

function floorState(f) {
  let cum = 0;
  for (let i = 1; i <= f; i++) cum += LEVELS_PER_FLOOR[i];
  const points = CREATION_POINTS + cum;
  const bonus  = Math.floor((points - CREATION_POINTS) / HP_PER);
  const parts  = Object.fromEntries(Object.entries(BASE_PARTS).map(([k, v]) => [k, v + bonus]));
  const bodyHp = Object.values(parts).reduce((a, b) => a + b, 0);
  const torso  = parts.Torso;
  return { floor: f, points, torso, bodyHp, partyHp: bodyHp * PARTY,
           mobSig: Math.round(torso * MOB_THREAT) };
}

const mobsFor  = (clocks) => Math.round(ATTACKS_PER_CLOCK * clocks);
// Width cannot exceed the mobs that exist — six abreast with five mobs is five.
// Beyond that this stays a deliberate CEILING: it holds the rank full as the room
// dies, which no real room does.
const pressure = (width, count, sig) =>
  Math.min(width, count) * sig * Math.ceil(count / KILLS_PER_MOMENT);


/**
 * ── MIXED ROOMS ─────────────────────────────────────────────────────────────
 * The width formula above sizes a MOB room. A room with an elite in it has a
 * different shape: the mobs die in the first Moments and the elite is still
 * there at the end, so the elite's damage is multiplied by the WHOLE room's
 * duration, not the mobs'.
 *
 *   room duration  = ceil(total enemy HP / party Force per Moment)
 *   mob window     = ceil(total mob HP  / party Force per Moment)
 *   ceiling        = min(width, mobs) x mobSig x mobWindow
 *                  + (elites x eliteSig x duration)
 *
 * Same caveat: a CEILING. Nobody moves, nothing repositions, the front rank
 * stays full. Author against it.
 */
const ELITE_MULT  = 12;     // §21.2 — elite HP ~ x12 the floor's mob
const ELITE_THREAT = 0.85;  // floor-bands.js THREAT.elite

function roomCost(f, { mobs = 0, elites = 0, width = 2 }) {
  const s = floorState(f);
  const mobHp   = 4 + f;                                   // a mob is one swing
  const forcePM = ATTACKS_PER_CLOCK * (4 + f) / 10;        // party Force per Moment
  const eliteSig = Math.round(s.torso * ELITE_THREAT);
  const totalHp  = mobs * mobHp + elites * mobHp * ELITE_MULT;
  const duration = Math.max(1, Math.ceil(totalHp / forcePM));
  const mobWin   = Math.max(mobs ? 1 : 0, Math.ceil(mobs * mobHp / forcePM));
  const dmg = Math.min(width, mobs) * s.mobSig * mobWin + elites * eliteSig * duration;
  return { dmg, pct: Math.round(dmg / s.partyHp * 100), duration, mobWin,
           mobSig: s.mobSig, eliteSig, partyHp: s.partyHp };
}

function report(f) {
  const s = floorState(f);
  console.log(`\n═══ FLOOR ${f} ═══  contestant body ${s.bodyHp} (torso ${s.torso}) · ` +
              `party of ${PARTY} = ${s.partyHp} HP · mob signature ${s.mobSig}`);
  console.log('  shape        mobs   width 2      width 4      width 6      (worst-case damage to the party)');
  for (const sh of SHAPES) {
    const n = mobsFor(sh.clocks);
    const cells = [2, 4, 6].map(w => {
      const d = pressure(w, n, s.mobSig);
      return `${String(d).padStart(4)} (${String(Math.round(d / s.partyHp * 100)).padStart(3)}%)`;
    }).join('  ');
    console.log(`  ${sh.name.padEnd(11)} ${String(n).padStart(4)}   ${cells}`);
  }
  console.log(`  ⚖ author to ~25% for a standard room · ~50% for a hard one · 100% is a set piece, not a room.`);
}

function main() {
if (only) report(only);
else {
  console.log('ENCOUNTER SIZING — mob counts are FLOOR-INVARIANT (a mob is one swing, by calibration).');
  console.log('Only the damage moves, and it moves with the body, so the PERCENTAGES stay put.');
  for (let f = 1; f <= 9; f++) report(f);
  console.log('\nmobs = 20 x the Clock fraction · damage ceiling = width x mob signature x ceil(count / 2)');
}
// The dial the rulebook (§21.7) claims is floor-invariant. Printed so it is
// checkable rather than asserted.
console.log('\nTHE ELITE DIAL — an elite alone is a standard room; an elite plus four mobs is a hard one.');
console.log('  floor   elite alone   elite + 4 mobs   6 mobs at width 2');
for (let f = 1; f <= 9; f++) {
  const a = roomCost(f, { elites: 1, width: 2 });
  const b = roomCost(f, { elites: 1, mobs: 4, width: 2 });
  const c = roomCost(f, { mobs: 6, width: 2 });
  console.log(`   F${f}      ${String(a.pct).padStart(4)}%          ${String(b.pct).padStart(4)}%            ${String(c.pct).padStart(4)}%`);
}
console.log('  ⚠️ F1 is the hot end (small parts); F3 onward converges to ~23% / ~41%.');
}

if (require.main === module) main();

module.exports = { floorState, mobsFor, pressure, roomCost, SHAPES, ATTACKS_PER_CLOCK, PARTY };
