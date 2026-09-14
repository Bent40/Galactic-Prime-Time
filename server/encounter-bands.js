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
// Sized in MOMENTS, not Clock fractions: a mob wave is limited by BODIES (one
// contestant kills one mob per Moment, and they spread), while an elite is
// limited by the party's total Force output. Corrected from play 2026-09-14.
const SHAPES = [
  { name: 'Brush',      mobs:  4, use: 'travel noise; teaches one gate and ends' },
  { name: 'Room',       mobs: 12, use: 'the default — one exchange, one decision' },
  { name: 'Held room',  mobs: 20, use: 'they were waiting; half a Clock of work' },
  { name: 'Tide',       mobs: 40, use: 'run it as ONE horde with a count (L-15), never as N entities' },
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

const mobsFor  = (sh) => sh.mobs;
// Width cannot exceed the mobs that exist — six abreast with five mobs is five.
// Beyond that this stays a deliberate CEILING: it holds the rank full as the room
// dies, which no real room does.
const pressure = (width, count, sig) =>
  Math.min(width, count) * sig * Math.ceil(count / KILLS_PER_MOMENT);


/**
 * ── THE MODEL, CORRECTED FROM PLAYTEST (2026-09-14) ──────────────────────────
 * The owner ran it. Three observations, all of which the first model got wrong:
 *
 *   1. "They clear a room with 12 mobs with 0 issues. Not even much of a
 *       challenge."                      — predicted ~40%. Observed ~nothing.
 *   2. "They fought 2 elites at the same time and struggled badly. I had to
 *       have mercy on them multiple times, opting for non-torso shots."
 *   3. "Most mobs will not be able to deal damage to the players due to the
 *       most basic of resistances doing their job."
 *
 * (3) IS THE CAUSE, AND IT WAS SIMPLY ABSENT FROM THE FIRST MODEL. §7.3 makes
 * typed resistance a FLAT SUBTRACTION, and §12.6 stacks armor across worn
 * pieces on the struck part. Against a mob's small number that is most or all
 * of the hit; against an elite's larger one it is a shrug. So resistance does
 * not scale a threat down — IT SORTS THREATS INTO "CANNOT TOUCH YOU" AND
 * "CAN", and the F1 line between those two sits between mob and elite.
 *
 * The second error is duration. The first model spent mobs at ~2 a Moment as
 * though the party fought them as a queue. The owner: "1 Moment delay if they
 * spread, each to take care of a mob, means the mobs are nothing but a slight
 * delay." Four contestants clear four mobs in ONE Moment, in parallel — so a
 * mob wave costs ceil(mobs / party) Moments, and an elite's clock is its own
 * HP plus that delay.
 *
 *   mob damage    = min(width, mobs) x max(0, mobSig   - resist) x ceil(mobs / party)
 *   elite damage  = elites          x max(0, eliteSig - resist) x duration
 *   duration      = ceil(elite HP / party Force per Moment) + ceil(mobs / party)
 *
 * Still a ceiling — nobody moves, nothing repositions, the rank stays full.
 */
const ELITE_MULT   = 12;     // §21.2 — elite HP ~ x12 the floor's mob
const ELITE_THREAT = 0.85;   // floor-bands.js THREAT.elite
// §12.6 — armor is flat resistance on the covered part and STACKS across worn
// pieces. Tier values as seeded: Crude 0 · Basic 1 · Quality 2 · Superior 3.
// 🔒 RULED 2026-09-14: resistance = tier + ONE PER BAND STEP (§12.7), the mirror
// of a weapon's class + one per band step. So a party keeping its armor current
// carries roughly `tier + floor` on a covered part.
const TIER_RESIST = { Crude: 0, Basic: 1, Quality: 2, Superior: 3, Exceptional: 4 };
const currentArmor = (f, tier = 'Quality') => TIER_RESIST[tier] + f;
const DEFAULT_RESIST = 2;

function roomCost(f, { mobs = 0, elites = 0, width = 2, resist = DEFAULT_RESIST } = {}) {
  const s        = floorState(f);
  const mobHp    = 4 + f;                                // a mob is one swing
  const forcePM  = ATTACKS_PER_CLOCK * (4 + f) / 10;     // party Force per Moment
  const eliteSig = Math.round(s.torso * ELITE_THREAT);
  const mobMoments = mobs ? Math.ceil(mobs / PARTY) : 0;  // they SPREAD
  const eliteHp    = elites * mobHp * ELITE_MULT;
  const duration   = (eliteHp ? Math.ceil(eliteHp / forcePM) : 0) + mobMoments;

  const mobDmg   = Math.min(width, mobs) * Math.max(0, s.mobSig - resist) * mobMoments;
  const eliteDmg = elites * Math.max(0, eliteSig - resist) * duration;
  const dmg = mobDmg + eliteDmg;
  return { dmg, pct: Math.round(dmg / s.partyHp * 100), duration, mobMoments,
           mobDmg, eliteDmg, resist,
           mobThrough: Math.max(0, s.mobSig - resist),
           eliteThrough: Math.max(0, eliteSig - resist),
           mobSig: s.mobSig, eliteSig, partyHp: s.partyHp };
}


/**
 * ── THE PRESS (proposal, 2026-09-14) ────────────────────────────────────────
 * Owner's idea 1: mobs coordinate, adding Force to each other like a party's
 * combined attack. §5.7 ALREADY WRITES THIS RULE, for contestants:
 *   "Combined attacks merge damage and count as ONE hit ... the party's designed
 *    path to single-hit numbers no individual can reach."
 * Nothing in the book restricts it to contestants. Pointing it at a horde needs
 * no new machinery and no new number — the whole effect comes from resistance
 * applying ONCE to the merged total instead of once per mob.
 *
 *   pressed(n) = max(0, n * mobSig - resist)      instead of  n * max(0, mobSig - resist)
 */
function press(f, n, resist) {
  const s = floorState(f);
  return { n, raw: n * s.mobSig, through: Math.max(0, n * s.mobSig - resist),
           separate: n * Math.max(0, s.mobSig - resist),
           torso: s.torso, kills: Math.max(0, n * s.mobSig - resist) >= s.torso };
}

function report(f) {
  const s = floorState(f);
  console.log(`\n═══ FLOOR ${f} ═══  contestant body ${s.bodyHp} (torso ${s.torso}) · ` +
              `party of ${PARTY} = ${s.partyHp} HP · mob signature ${s.mobSig} · elite ${Math.round(s.torso * ELITE_THREAT)}`);
  console.log(`  MOB ROOMS — worst case, at the party's resistance on the struck part`);
  console.log(`  shape        mobs   resist 0     resist 2     resist 4`);
  for (const sh of SHAPES) {
    const n = sh.mobs;
    const cells = [0, 2, 4].map(r => {
      const x = roomCost(f, { mobs: n, width: 4, resist: r });
      return `${String(x.dmg).padStart(4)} (${String(x.pct).padStart(3)}%)`;
    }).join('  ');
    console.log(`  ${sh.name.padEnd(11)} ${String(n).padStart(4)}   ${cells}`);
  }
  const e1 = roomCost(f, { elites: 1, resist: 2 });
  const e1m = roomCost(f, { elites: 1, mobs: 4, width: 2, resist: 2 });
  const e2 = roomCost(f, { elites: 2, resist: 2 });
  console.log(`  ELITES at resist 2 —  one: ${e1.pct}%  ·  one + 4 mobs: ${e1m.pct}%  ·  TWO: ${e2.pct}%`);
  console.log(`  ⚖ ~25% standard · ~50% hard · 100% is a set piece. Mobs at ${f === 1 ? 'F1' : `F${f}`} get ` +
              `${roomCost(f, { mobs: 1, resist: 2 }).mobThrough} through resist 2; an elite gets ${e1.eliteThrough}.`);
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
console.log('\nTHE LADDER, at resist 2 — and the step that matters is the SECOND ELITE.');
console.log('  floor   6 mobs   1 elite   1 elite + 4 mobs   TWO elites');
for (let f = 1; f <= 9; f++) {
  const c = roomCost(f, { mobs: 6, width: 2 });
  const a = roomCost(f, { elites: 1 });
  const b = roomCost(f, { elites: 1, mobs: 4, width: 2 });
  const d = roomCost(f, { elites: 2 });
  console.log(`   F${f}     ${String(c.pct).padStart(4)}%    ${String(a.pct).padStart(4)}%       ${String(b.pct).padStart(4)}%            ${String(d.pct).padStart(4)}%`);
}
console.log('  ⚠️ Mobs are nearly free and adding more barely moves the number.');
console.log('  ⚠️ There is NOTHING between "one elite + mobs" and "two elites". That gap is real.');

console.log('\nTHE CLIFF — 12 mobs at F1, width 4, by the resistance on the struck part.');
console.log('  §12.6 armor is FLAT and STACKS, so it does not scale a threat down, it SWITCHES IT OFF.');
for (let r = 0; r <= 5; r++) {
  const x = roomCost(1, { mobs: 12, width: 4, resist: r });
  console.log(`   resist ${r}:  mob 4 - ${r} = ${x.mobThrough} through  ->  ${String(x.pct).padStart(3)}%` +
              (x.mobThrough === 0 ? '   <- every F1 mob is now harmless, permanently' : ''));
}
console.log('  ⭐ At F1 the line between "cannot touch you" and "can" runs exactly between MOB and ELITE.');
console.log('  ⭐ And §8.1 conditions (Chill/Poison/Infection/Dissolution) carry a TIER and no Force,');
console.log('     so flat resistance never touches them. They are what still reaches an armoured party.');
}

if (require.main === module) main();

module.exports = { floorState, mobsFor, pressure, roomCost, press, currentArmor, TIER_RESIST, SHAPES, ATTACKS_PER_CLOCK, PARTY };
