import { useEffect, useMemo, useRef, useState } from 'react';
import { centre, gridPath, hexPath, nearestCell, hexDistance, cellsWithin, boardSize, moveCost, key } from './hex.js';
import FxLayer from './FxLayer.jsx';

/**
 * HexBoard — the shared play surface. The GM page and the player page render the same
 * component with a different `role`; what differs is what is drawn (fog solid vs dim,
 * hidden tokens) and what may be dragged (the GM: anything; a player: their own token).
 *
 * Tools: move (drag a token / drag empty space to pan) · measure (drag: distance and
 * §5.5 cost) · fog (GM: click/drag to reveal r=2) · ping · fx (GM: pick a target hex).
 * Wheel zooms around the cursor. Everything is in image pixels via the viewBox.
 */
const SIZE_SCALE = { Small: 0.72, Medium: 0.9, Large: 1.15, Huge: 1.5 };
export function pickLabel(from, cursor) {
  const d = hexDistance(from, cursor);
  return d ? `${d} space${d > 1 ? 's' : ''} · ${moveCost(d).label} — click a hex or press Enter` : 'Pick a hex: click one, or use the arrow keys and Enter. Esc cancels.';
}
const TIER_GLYPH = { mob: '●', elite: '◆', boss: '☠', legendary: '★' };

export default function HexBoard({
  map, image, role = 'player', myUserId = null, selectedId = null, tool = 'move',
  onSelect, onMoveToken, onFogPaint, onPing, onFxTarget, onMeasure, fx = [], pings = [], live = true,
  focusRequest = null, fitRequest = 0, onPickStatus,
}) {
  const svgRef = useRef(null);
  const grid = map.grid;
  const size = useMemo(() => boardSize(map), [map.width, map.height, grid]);
  const [vb, setVb] = useState(() => ({ x: 0, y: 0, w: size.width, h: size.height }));
  useEffect(() => { setVb({ x: 0, y: 0, w: size.width, h: size.height }); }, [size.width, size.height, map._id]);

  const [drag, setDrag] = useState(null);       // { token, from, at }
  const [pan, setPan] = useState(null);         // { sx, sy, vb }
  const [measure, setMeasure] = useState(null); // { a, b }
  const [hover, setHover] = useState(null);
  // click-to-move (Company Mode VTT pass, 2026-11-22): select your token, then click a hex
  // or walk a cursor with the arrow keys. Drag still works. The shading is a guide only.
  const [pick, setPick] = useState(null);       // { tokenId, from, cursor }
  useEffect(() => { onPickStatus?.(pick ? pickLabel(pick.from, pick.cursor) : null); }, [pick?.cursor?.col, pick?.cursor?.row, !!pick]);
  useEffect(() => { if (pick && !map.tokens.some(t => t.tokenId === pick.tokenId)) setPick(null); }, [map.tokens]);

  // "Fit all": the whole picture plus every token, wherever it stands.
  useEffect(() => {
    if (!fitRequest) return;
    let x0 = 0, y0 = 0, x1 = size.width, y1 = size.height;
    for (const t of map.tokens) { const p = centre(t.col, t.row, grid); x0 = Math.min(x0, p.x - grid.size * 2); y0 = Math.min(y0, p.y - grid.size * 2); x1 = Math.max(x1, p.x + grid.size * 2); y1 = Math.max(y1, p.y + grid.size * 2); }
    const rect = svgRef.current?.getBoundingClientRect(); const aspect = rect && rect.height ? rect.width / rect.height : size.width / size.height;
    let w = x1 - x0, h = y1 - y0; if (w / h < aspect) { const nw = h * aspect; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / aspect; y0 -= (nh - h) / 2; h = nh; }
    setVb({ x: x0, y: y0, w, h });
  }, [fitRequest]);
  // Centre one cell (a token picked from the GM's list), keeping the zoom.
  useEffect(() => {
    if (!focusRequest) return;
    const p = centre(focusRequest.col, focusRequest.row, grid);
    setVb(v => ({ ...v, x: p.x - v.w / 2, y: p.y - v.h / 2 }));
  }, [focusRequest]);

  const gridD = useMemo(() => gridPath(grid), [grid]);
  const revealed = useMemo(() => new Set(map.revealed || []), [map.revealed]);
  const fogD = useMemo(() => {
    if (!map.fogEnabled) return '';
    let d = '';
    for (let r = 0; r < grid.rows; r++) for (let c = 0; c < grid.cols; c++) if (!revealed.has(`${c},${r}`)) { const p = centre(c, r, grid); d += hexPath(p.x, p.y, grid.size); }
    return d;
  }, [map.fogEnabled, revealed, grid]);

  const pt = useRef(null);
  function toBoard(e) {
    const svg = svgRef.current; if (!svg) return { x: 0, y: 0 };
    if (!pt.current) pt.current = svg.createSVGPoint();
    pt.current.x = e.clientX; pt.current.y = e.clientY;
    const p = pt.current.matrixTransform(svg.getScreenCTM().inverse());
    return { x: p.x, y: p.y };
  }
  const canDrag = (t) => role === 'gm' || (t.kind === 'player' && t.refId === String(myUserId));

  function onPointerDown(e) {
    if (e.button !== 0) return;
    const p = toBoard(e), cell = nearestCell(p.x, p.y, grid);
    const g = e.target.closest('[data-token]');
    const tok = g ? map.tokens.find(t => t.tokenId === g.dataset.token) : null;
    if (tool === 'move') {
      if (pick && !tok) { setPan({ sx: e.clientX, sy: e.clientY, vb, pickCell: cell }); svgRef.current.setPointerCapture(e.pointerId); return; }
      if (tok) { onSelect?.(tok); if (canDrag(tok)) { setDrag({ token: tok, from: { col: tok.col, row: tok.row }, at: { col: tok.col, row: tok.row } }); svgRef.current.setPointerCapture(e.pointerId); } return; }
      setPan({ sx: e.clientX, sy: e.clientY, vb }); svgRef.current.setPointerCapture(e.pointerId); return;
    }
    if (tool === 'measure') { setMeasure({ a: cell, b: cell }); svgRef.current.setPointerCapture(e.pointerId); return; }
    if (tool === 'fog' && role === 'gm') { onFogPaint?.(cellsWithin(cell, 2, grid).map(key)); setPan({ fog: true }); svgRef.current.setPointerCapture(e.pointerId); return; }
    if (tool === 'ping') { onPing?.(cell); return; }
    if (tool === 'fx') { onFxTarget?.(cell, tok); return; }
  }
  function onPointerMove(e) {
    const p = toBoard(e); const cell = nearestCell(p.x, p.y, grid);
    setHover(cell);
    if (drag) { if (cell.col !== drag.at.col || cell.row !== drag.at.row) setDrag(d => ({ ...d, at: cell })); return; }
    if (pan?.fog) { onFogPaint?.(cellsWithin(cell, 2, grid).map(key)); return; }
    if (pan) {
      const svg = svgRef.current; const rect = svg.getBoundingClientRect();
      const kx = pan.vb.w / rect.width, ky = pan.vb.h / rect.height;
      setVb({ ...pan.vb, x: pan.vb.x - (e.clientX - pan.sx) * kx, y: pan.vb.y - (e.clientY - pan.sy) * ky }); return;
    }
    if (measure) setMeasure(m => ({ ...m, b: cell }));
  }
  function onPointerUp() {
    if (drag) {
      const d = drag; setDrag(null);
      if (d.at.col !== d.from.col || d.at.row !== d.from.row) { setPick(null); onMoveToken?.(d.token, d.at, hexDistance(d.from, d.at)); }
      else setPick(pk => (pk && pk.tokenId === d.token.tokenId ? null : { tokenId: d.token.tokenId, from: d.from, cursor: d.from }));   // a click, not a drag: pick it up
    }
    if (pan) {
      const moved = pan.vb && (pan.vb.x !== vb.x || pan.vb.y !== vb.y);
      if (pan.pickCell && !moved) commitPick(pan.pickCell);
      setPan(null);
    }
    if (measure) { const m = measure; onMeasure?.(m.a, m.b, hexDistance(m.a, m.b)); setTimeout(() => setMeasure(null), 1200); }
  }
  function onWheel(e) {
    e.preventDefault();
    const p = toBoard(e); const k = e.deltaY > 0 ? 1.12 : 1 / 1.12;
    setVb(v => { const w = Math.min(size.width * 2, Math.max(size.width / 8, v.w * k)); const h = w * (v.h / v.w); return { x: p.x - (p.x - v.x) * (w / v.w), y: p.y - (p.y - v.y) * (h / v.h), w, h }; });
  }
  useEffect(() => { const el = svgRef.current; if (!el) return; el.addEventListener('wheel', onWheel, { passive: false }); return () => el.removeEventListener('wheel', onWheel); }, [size]);

  function commitPick(cell) {
    const tok = pick && map.tokens.find(t => t.tokenId === pick.tokenId); setPick(null);
    if (!tok) return;
    const dist = hexDistance({ col: tok.col, row: tok.row }, cell);
    if (dist > 0) onMoveToken?.(tok, cell, dist);
  }
  function onKeyDown(e) {
    const g = e.target.closest?.('[data-token]');
    const tok = g ? map.tokens.find(t => t.tokenId === g.dataset.token) : null;
    if (!pick) {
      if (tok && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onSelect?.(tok); if (canDrag(tok)) setPick({ tokenId: tok.tokenId, from: { col: tok.col, row: tok.row }, cursor: { col: tok.col, row: tok.row } }); }
      return;
    }
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (step) { e.preventDefault(); setPick(pk => ({ ...pk, cursor: { col: Math.min(grid.cols - 1, Math.max(0, pk.cursor.col + step[0])), row: Math.min(grid.rows - 1, Math.max(0, pk.cursor.row + step[1])) } })); return; }
    if (e.key === 'Escape') { e.preventDefault(); setPick(null); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); commitPick(pick.cursor); }
  }
  const pickShade = useMemo(() => {
    if (!pick) return null;
    let free = '', paid = '';
    for (const c of cellsWithin(pick.from, 8, grid)) { const d = hexDistance(pick.from, c); if (!d) continue; const p = centre(c.col, c.row, grid); if (d <= 4) free += hexPath(p.x, p.y, grid.size); else paid += hexPath(p.x, p.y, grid.size); }
    return { free, paid };
  }, [pick?.tokenId, pick?.from?.col, pick?.from?.row, grid]);

  const dragCost = drag ? moveCost(hexDistance(drag.from, drag.at)) : null;
  const measureD = measure ? hexDistance(measure.a, measure.b) : 0;

  return (
    <svg ref={svgRef} className={`hexboard ${role}${tool !== 'move' ? ' tool-' + tool : ''}`} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
         onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={() => setHover(null)} onKeyDown={onKeyDown}>
      <rect x={-5000} y={-5000} width={10000 + size.width} height={10000 + size.height} fill="#05060f" />
      {image ? <image href={image} x={0} y={0} width={size.width} height={size.height} preserveAspectRatio="none" /> : <rect width={size.width} height={size.height} fill="#0b0f20" />}
      <path className="hex-grid" d={gridD} />
      {hover && (tool === 'fog' || tool === 'fx' || tool === 'ping') && (
        <path className="hex-hover" d={tool === 'fog' ? cellsWithin(hover, 2, grid).map(c => { const p = centre(c.col, c.row, grid); return hexPath(p.x, p.y, grid.size); }).join('') : (() => { const p = centre(hover.col, hover.row, grid); return hexPath(p.x, p.y, grid.size); })()} />
      )}
      {fogD && <path className="hex-fog" d={fogD} />}
      {pickShade && <g pointerEvents="none"><path className="pick-free" d={pickShade.free} /><path className="pick-paid" d={pickShade.paid} />
        {(() => { const p = centre(pick.cursor.col, pick.cursor.row, grid); return <path className="pick-cursor" d={hexPath(p.x, p.y, grid.size)} />; })()}</g>}
      {!live && <text className="board-note" x={size.width / 2} y={40} textAnchor="middle">THIS MAP IS NOT LIVE — players cannot see it</text>}

      <g className="tokens">
        {map.tokens.map(t => {
          const at = drag?.token.tokenId === t.tokenId ? drag.at : { col: t.col, row: t.row };
          const p = centre(at.col, at.row, grid);
          const r = grid.size * (SIZE_SCALE[t.size] || 0.9);
          const hp = t.parts?.find(x => x.lethal && /torso|body|frame/i.test(x.name)) || t.parts?.find(x => x.lethal) || t.parts?.[0];
          const frac = hp && hp.maxHp > 0 ? Math.max(0, Math.min(1, hp.currentHp / hp.maxHp)) : null;
          const draggable = canDrag(t);
          return (
            <g key={t.tokenId} data-token={t.tokenId} className={`tok${selectedId === t.tokenId ? ' sel' : ''}${t.hidden ? ' hidden-tok' : ''}${draggable ? ' draggable' : ''}${drag?.token.tokenId === t.tokenId ? ' dragging' : ''}`}
               transform={`translate(${p.x},${p.y})`} style={{ color: t.color }}
               tabIndex={draggable && !t.hidden || role === 'gm' ? 0 : undefined} role="button" aria-label={`${t.name}${draggable ? ' — Enter to pick up, arrows to choose a hex, Enter to place' : ''}`}>
              {pick?.tokenId === t.tokenId && <circle r={r + 5} fill="none" stroke="#00d4ff" strokeWidth={3} />}
              <circle className="ring" r={r} stroke={t.color} />
              {(t.tier === 'elite' || t.tier === 'boss' || t.tier === 'legendary') && <circle r={r - 5} fill="none" stroke={t.color} strokeWidth={1} strokeDasharray="3 3" />}
              <text className="glyph" style={{ fontSize: r * 0.9 }}>{t.label || TIER_GLYPH[t.tier] || t.name.slice(0, 1).toUpperCase()}</text>
              <text className="nameplate" y={r + 12}>{t.name}{t.hidden ? ' (hidden)' : ''}</text>
              {t.conditions?.length > 0 && <text className="nameplate cond" y={-r - 5}>{t.conditions.slice(0, 3).join(' · ')}</text>}
              {frac != null && <g><rect x={-r} y={r - 3} width={2 * r} height={4} fill="#04050d" /><rect x={-r} y={r - 3} width={2 * r * frac} height={4} fill={frac < 0.5 ? '#ff4d6d' : t.color} /></g>}
            </g>
          );
        })}
      </g>

      {drag && dragCost && (() => { const a = centre(drag.from.col, drag.from.row, grid), b = centre(drag.at.col, drag.at.row, grid); const d = hexDistance(drag.from, drag.at); return d > 0 && (
        <g pointerEvents="none"><line className="measure" x1={a.x} y1={a.y} x2={b.x} y2={b.y} /><text className="measure-lbl" x={b.x + 14} y={b.y - 14}>{d} · {dragCost.label}</text></g>); })()}
      {measure && measureD > 0 && (() => { const a = centre(measure.a.col, measure.a.row, grid), b = centre(measure.b.col, measure.b.row, grid); const c = moveCost(measureD); return (
        <g pointerEvents="none"><line className="measure" x1={a.x} y1={a.y} x2={b.x} y2={b.y} /><text className="measure-lbl" x={(a.x + b.x) / 2 + 10} y={(a.y + b.y) / 2 - 10}>{measureD} spaces · {c.label}</text></g>); })()}
      {pings.map(pg => { const p = centre(pg.col, pg.row, grid); return <circle key={pg.id} className="ping" cx={p.x} cy={p.y} r={4} />; })}
      <FxLayer fx={fx} grid={grid} />
    </svg>
  );
}
