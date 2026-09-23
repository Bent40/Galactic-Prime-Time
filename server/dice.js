/**
 * dice.js — the only dice the book rolls, rolled on the SERVER so a result cannot be
 * typed into chat.
 *
 *   body · tool   §6.1 Forced Action tables (d6) — the result carries the table row
 *   d4 · d6 · d8  §14 threshold die (per-stat, upgradeable at the Tattoo Artist)
 *   fall          §21.5 — 3–8 m ≈ 1d4–5d4, 9–14 m ≈ 2d6–6d6, then d8s; a sketch the
 *                 book says to tune when it matters. Height in metres; under 3 m is
 *                 no damage.
 *
 * No `/roll` grammar: there is no modifier stack in this game to express with one.
 * Dependency-free; `rng` is injectable for tests.
 */
const BODY_TABLE = [
  'Tear Something — 1 damage to the relevant part; escalates at 0 HP',
  'Lock-Up — the part is unusable for 3 Moments',
  'Condition Surge — advance an active condition 1 tier (the responsible one; if none, Shock T1)',
  'Drop — drop the item in the involved limb',
  'Shock Spike — +1 Shock tier',
  'Stumble — Exposed until your next Moment',
];
const TOOL_TABLE = [
  'Whiff — the action fails entirely (no ammo spent)',
  'Overcommit — Exposed',
  'Collateral — hit an ally, object, or the environment instead',
  'Slip — unarmed until your next Moment',
  'Strained Grip — +1 Moment cost on your next tool action',
  'Overextension — your next scheduled action is delayed +1 Moment',
];
const KINDS = ['body', 'tool', 'd4', 'd6', 'd8', 'fall'];

const die = (n, rng) => 1 + Math.floor(rng() * n);

function fallDice(height) {
  const h = Math.floor(Number(height) || 0);
  if (h < 3) return { count: 0, sides: 0 };
  if (h <= 8) return { count: h - 2, sides: 4 };    // 3 m → 1d4 … 8 m → 6d4 (book says ~5d4 at 8; the ladder is a sketch)
  if (h <= 14) return { count: h - 7, sides: 6 };   // 9 m → 2d6 … 14 m → 7d6
  return { count: Math.min(12, h - 12), sides: 8 };
}

function roll(kind, opts = {}, rng = Math.random) {
  if (!KINDS.includes(kind)) return null;
  if (kind === 'body' || kind === 'tool') {
    const v = die(6, rng);
    return { kind, label: `Forced Action — ${kind === 'body' ? 'Body' : 'Tool'}`, die: 'd6', rolls: [v], total: v,
             effect: (kind === 'body' ? BODY_TABLE : TOOL_TABLE)[v - 1] };
  }
  if (kind === 'fall') {
    const { count, sides } = fallDice(opts.height);
    const rolls = Array.from({ length: count }, () => die(sides, rng));
    const total = rolls.reduce((a, b) => a + b, 0);
    return { kind, label: `Falling — ${Math.floor(Number(opts.height) || 0)} m`, die: count ? `${count}d${sides}` : '—', rolls, total,
             effect: count ? `${total} Crush to the landing part (§21.5)` : 'Under 3 m — no fall damage (§21.5)' };
  }
  const sides = Number(kind.slice(1));
  const v = die(sides, rng);
  const stat = opts.stat ? String(opts.stat) : 'stat';
  return { kind, label: `Threshold die — ${stat}`, die: kind, rolls: [v], total: v,
           effect: `${stat} + ${v} against the threshold; ${stat} alone reaching it is an auto-pass (§14)` };
}

module.exports = { roll, fallDice, KINDS, BODY_TABLE, TOOL_TABLE };
