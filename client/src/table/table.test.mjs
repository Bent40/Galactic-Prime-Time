// node --experimental-detect-module client/src/table/table.test.mjs
import { centre, hexDistance, nearestCell, moveCost, cellsWithin, boardSize, gridPath, key, FREE_MOVE } from './hex.js';
import { parseTimecode, formatTimecode, parseYouTubeRef, segmentLength, expectedPosition, elapsedSince, shouldSeek, tick } from './soundEngine.js';

let pass = 0, fail = 0;
const ok = (label, cond, detail) => { if (cond) pass++; else { fail++; console.log(`  ✗ ${label}${detail ? ' — ' + detail : ''}`); } };
const eq = (label, got, want) => ok(label, JSON.stringify(got) === JSON.stringify(want), `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

// ── hex geometry ─────────────────────────────────────────────────────────────
const G = { size: 20, offsetX: 0, offsetY: 0, cols: 10, rows: 8 };
eq('centre of (0,0)', [Math.round(centre(0, 0, G).x), centre(0, 0, G).y], [17, 20]);
ok('odd rows are shoved right by half a hex', centre(0, 1, G).x - centre(0, 0, G).x > 17 && centre(0, 1, G).x - centre(0, 0, G).x < 18);
eq('offset shifts the lattice', centre(0, 0, { ...G, offsetX: 5, offsetY: 7 }).y, 27);
eq('distance to self is 0', hexDistance({ col: 3, row: 3 }, { col: 3, row: 3 }), 0);
eq('distance along a row', hexDistance({ col: 0, row: 0 }, { col: 4, row: 0 }), 4);
eq('distance across rows (odd-r)', hexDistance({ col: 0, row: 0 }, { col: 0, row: 2 }), 2);
eq('distance on a diagonal', hexDistance({ col: 0, row: 0 }, { col: 2, row: 3 }), 4);
for (let r = 0; r < G.rows; r++) for (let c = 0; c < G.cols; c++) { const p = centre(c, r, G); const n = nearestCell(p.x + 3, p.y - 4, G); if (n.col !== c || n.row !== r) { fail++; console.log(`  ✗ nearestCell round-trips (${c},${r}) got ${n.col},${n.row}`); } else pass++; }
eq('nearestCell clamps off-grid points', nearestCell(-500, -500, G), { col: 0, row: 0 });
eq('nearestCell clamps beyond the far edge', nearestCell(9999, 9999, G), { col: 9, row: 7 });
eq('cellsWithin radius 0 is the cell', cellsWithin({ col: 4, row: 4 }, 0, G), [{ col: 4, row: 4 }]);
eq('cellsWithin radius 1 is seven hexes', cellsWithin({ col: 4, row: 4 }, 1, G).length, 7);
eq('cellsWithin radius 2 is nineteen', cellsWithin({ col: 4, row: 4 }, 2, G).length, 19);
ok('cellsWithin stays inside the grid at a corner', cellsWithin({ col: 0, row: 0 }, 2, G).every(c => c.col >= 0 && c.row >= 0));
eq('FREE_MOVE is the v1.15 number', FREE_MOVE, 4);
eq('§5.5: 4 spaces is free', moveCost(4), { moments: 0, free: true, label: 'free move' });
eq('§5.5: 5 spaces costs 1 Moment', moveCost(5).moments, 1);
eq('§5.5: 8 spaces costs 1 Moment', moveCost(8).moments, 1);
eq('§5.5: 9 spaces costs 2 Moments', moveCost(9).moments, 2);
eq('§11 Slowed: 2 spaces is no longer free', moveCost(2, { slowed: true }).free, false);
eq('§11 Slowed: Moment costs double', moveCost(5, { slowed: true }).moments, 2);
eq('boardSize prefers the image', boardSize({ width: 800, height: 600, grid: G }), { width: 800, height: 600 });
ok('boardSize covers the lattice when there is no image', boardSize({ grid: G }).width >= centre(9, 1, G).x + Math.sqrt(3) * 10);
ok('gridPath draws cols×rows hexes', (gridPath(G).match(/M/g) || []).length === 80);
eq('key', key({ col: 3, row: 9 }), '3,9');

// ── sound engine ─────────────────────────────────────────────────────────────
eq('parseTimecode m:ss', parseTimecode('1:50'), 110);
eq('parseTimecode seconds', parseTimecode('36'), 36);
eq('parseTimecode fractional', parseTimecode('0:36.5'), 36.5);
eq('parseTimecode number', parseTimecode(12), 12);
eq('parseTimecode junk → 0', parseTimecode('abc'), 0);
eq('formatTimecode', formatTimecode(110), '1:50');
eq('formatTimecode pads', formatTimecode(5), '0:05');
eq('YouTube bare id', parseYouTubeRef('dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
eq('YouTube watch URL', parseYouTubeRef('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s'), 'dQw4w9WgXcQ');
eq('YouTube short URL', parseYouTubeRef('https://youtu.be/dQw4w9WgXcQ'), 'dQw4w9WgXcQ');
eq('YouTube junk → empty', parseYouTubeRef('not a video'), '');
const A = { start: 0, end: 36, loop: true }, B = { start: 36, end: 110, loop: true }, ONCE = { start: 36, end: 110, loop: false }, OPEN = { start: 10, end: 0, loop: true };
eq('segmentLength', segmentLength(A), 36);
eq('segmentLength with a known duration bounds an open cue', segmentLength(OPEN, 180), 170);
eq('loop: 10 s in is 10', expectedPosition(A, 10), 10);
eq('loop: 40 s in wraps to 4', expectedPosition(A, 40), 4);
eq('loop: 72 s in wraps to 0', expectedPosition(A, 72), 0);
eq('phase 2 starts at 36', expectedPosition(B, 0), 36);
eq('phase 2 loops inside 36–110', expectedPosition(B, 80), 42);
eq('one-shot runs to its end', expectedPosition(ONCE, 30), 66);
eq('one-shot past its end is finished', expectedPosition(ONCE, 100), null);
eq('open cue with unknown duration plays on', expectedPosition(OPEN, 500), 510);
eq('open cue with a duration loops on it', expectedPosition(OPEN, 175, 180), 15);
eq('negative elapsed clamps to the start', expectedPosition(B, -5), 36);
const started = new Date('2026-09-23T10:00:00Z').getTime();
eq('elapsedSince uses server time', elapsedSince(started, started + 12_000, 5000, 5000), 12);
eq('elapsedSince projects the client clock forward', elapsedSince(started, started + 12_000, 8000, 5000), 15);
eq('elapsedSince never negative', elapsedSince(started + 9000, started, 0, 0), 0);
eq('shouldSeek within tolerance → no', shouldSeek(10, 11), false);
eq('shouldSeek past tolerance → yes', shouldSeek(10, 13), true);
eq('shouldSeek with nothing expected → no', shouldSeek(10, null), false);
eq('tick: nothing playing → stop', tick(A, { playing: false }, 5, 5), { action: 'stop' });
eq('tick: in the segment, on time → none', tick(A, { playing: true }, 10, 10), { action: 'none' });
eq('tick: reached the end of a loop → seek to start', tick(A, { playing: true }, 36, 36), { action: 'seek', to: 0 });
eq('tick: reached the end of a one-shot → stop', tick(ONCE, { playing: true }, 110, 74), { action: 'stop' });
eq('tick: late joiner seeks into the loop', tick(B, { playing: true }, 0, 80), { action: 'seek', to: 42 });
eq('tick: drift inside tolerance is left alone', tick(B, { playing: true }, 41, 80), { action: 'none' });
eq('tick: one-shot whose time has passed → stop', tick(ONCE, { playing: true }, 50, 200), { action: 'stop' });

console.log(`\ntable: ${pass} passed · ${fail} failed`);
process.exit(fail ? 1 : 0);
