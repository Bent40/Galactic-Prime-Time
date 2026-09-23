/**
 * hex.js — the board's geometry, no React.
 *
 * Pointy-top hexes, odd rows shoved right ("odd-r" offset coordinates), the lattice
 * the mockup drew and TableMap.grid describes: `size` is the circumradius in image
 * pixels, `offsetX/Y` shifts the whole lattice so it can be lined up with a map that
 * was painted on its own grid. 1 space = 1 hex (§5.5).
 */
export const SQRT3 = Math.sqrt(3);

export function hexWidth(size) { return SQRT3 * size; }
export function hexHeight(size) { return 2 * size; }

/** Pixel centre of cell (col,row). */
export function centre(col, row, grid) {
  const s = grid.size, w = SQRT3 * s;
  return { x: (grid.offsetX || 0) + w * (col + 0.5 * (row & 1)) + w / 2, y: (grid.offsetY || 0) + 1.5 * s * row + s };
}

/** SVG path for one hex around (x,y). */
export function hexPath(x, y, size) {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 180 * (60 * i - 30);
    d += (i ? 'L' : 'M') + (x + size * Math.cos(a)).toFixed(1) + ',' + (y + size * Math.sin(a)).toFixed(1);
  }
  return d + 'Z';
}

/** Path for every cell of the grid (one <path>, cheap to draw). */
export function gridPath(grid) {
  let d = '';
  for (let r = 0; r < grid.rows; r++) for (let c = 0; c < grid.cols; c++) { const p = centre(c, r, grid); d += hexPath(p.x, p.y, grid.size); }
  return d;
}

/** Offset → cube coordinates, for distances. */
export function toCube(col, row) { const q = col - (row - (row & 1)) / 2; return { q, r: row, s: -q - row }; }

/** Distance in hexes between two cells. */
export function hexDistance(a, b) {
  const A = toCube(a.col, a.row), B = toCube(b.col, b.row);
  return Math.max(Math.abs(A.q - B.q), Math.abs(A.r - B.r), Math.abs(A.s - B.s));
}

/** Nearest cell to a pixel point, clamped to the grid. */
export function nearestCell(x, y, grid) {
  const s = grid.size, w = SQRT3 * s;
  // coarse guess from the lattice, then refine over the 3×3 neighbourhood
  const row0 = Math.round(((y - (grid.offsetY || 0)) - s) / (1.5 * s));
  let best = null, bd = Infinity;
  for (let r = row0 - 1; r <= row0 + 1; r++) {
    if (r < 0 || r >= grid.rows) continue;
    const col0 = Math.round(((x - (grid.offsetX || 0)) - w / 2) / w - 0.5 * (r & 1));
    for (let c = col0 - 1; c <= col0 + 1; c++) {
      if (c < 0 || c >= grid.cols) continue;
      const p = centre(c, r, grid); const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < bd) { bd = d; best = { col: c, row: r }; }
    }
  }
  if (best) return best;
  return { col: Math.min(grid.cols - 1, Math.max(0, Math.round((x - (grid.offsetX || 0)) / w))), row: Math.min(grid.rows - 1, Math.max(0, row0)) };
}

/** All cells within `radius` hexes of `cell` (inclusive), inside the grid. */
export function cellsWithin(cell, radius, grid) {
  const out = [];
  for (let r = Math.max(0, cell.row - radius); r <= Math.min(grid.rows - 1, cell.row + radius); r++)
    for (let c = Math.max(0, cell.col - radius - 1); c <= Math.min(grid.cols - 1, cell.col + radius + 1); c++)
      if (hexDistance(cell, { col: c, row: r }) <= radius) out.push({ col: c, row: r });
  return out;
}

export const FREE_MOVE = 4;   // §5.5 (v1.15): 1–4 spaces free, once per Moment

/** §5.5 movement pricing. `slowed` halves the free allowance to 1 and doubles Moments. */
export function moveCost(spaces, { slowed = false } = {}) {
  const free = slowed ? 1 : FREE_MOVE;
  if (spaces <= 0) return { moments: 0, free: true, label: 'no move' };
  if (spaces <= free) return { moments: 0, free: true, label: 'free move' };
  const moments = Math.ceil((spaces - free) / 4) * (slowed ? 2 : 1);
  return { moments, free: false, label: `${moments} Moment${moments > 1 ? 's' : ''}` };
}

/** Pixel size of the board: the image if it has one, else the lattice extent. */
export function boardSize(map) {
  if (map.width && map.height) return { width: map.width, height: map.height };
  const g = map.grid; const w = SQRT3 * g.size;
  return { width: Math.ceil((g.offsetX || 0) + w * (g.cols + 0.5) + 2), height: Math.ceil((g.offsetY || 0) + 1.5 * g.size * g.rows + g.size * 0.5 + 2) };
}

export const key = (c) => `${c.col},${c.row}`;
