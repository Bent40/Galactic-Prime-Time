import { useEffect, useState } from 'react';
import { centre } from './hex.js';

/**
 * FxLayer — one burst per damage type (§7.3's seven types + Heal), drawn in SVG on the
 * board. An effect arrives from the table's `fx` queue; this layer plays each one once
 * for ~1.8 s and forgets it. If `from` is set, a projectile crosses the board first.
 *
 * Every type is a different SHAPE, not just a colour, so a colour-blind table still
 * reads the attack: slashes bleed, rings crush, tongues burn, shards chill, bubbles
 * poison, crystals infect, a spiral dissolves, a soft pulse heals.
 */
export const FX_STYLE = {
  Bleed:       { color: '#ff4d6d', glow: 'rgba(255,77,109,.6)' },
  Crush:       { color: '#d9bb63', glow: 'rgba(217,187,99,.5)' },
  Burn:        { color: '#ff8a3d', glow: 'rgba(255,138,61,.6)' },
  Chill:       { color: '#9fe8ff', glow: 'rgba(159,232,255,.6)' },
  Poison:      { color: '#7dff6b', glow: 'rgba(125,255,107,.5)' },
  Infection:   { color: '#f2a6ff', glow: 'rgba(242,166,255,.6)' },
  Dissolution: { color: '#bd7cff', glow: 'rgba(189,124,255,.6)' },
  Heal:        { color: '#3dffa2', glow: 'rgba(61,255,162,.5)' },
};
export const FX_TYPES = Object.keys(FX_STYLE);

const LIFE_MS = 1800;
const rad = (deg) => Math.PI / 180 * deg;

function Burst({ type, r }) {
  const st = FX_STYLE[type] || FX_STYLE.Crush;
  const c = st.color;
  switch (type) {
    case 'Bleed': return (
      <g className="fx-burst fx-bleed" style={{ color: c }}>
        {[-30, 10, 50].map((a, i) => <line key={i} x1={-r * Math.cos(rad(a))} y1={-r * Math.sin(rad(a))} x2={r * Math.cos(rad(a))} y2={r * Math.sin(rad(a))} stroke={c} strokeWidth={3} strokeLinecap="round" style={{ animationDelay: `${i * 90}ms` }} />)}
        {[0, 1, 2, 3].map(i => <circle key={'d' + i} className="fx-drop" cx={(i - 1.5) * r * 0.4} cy={r * 0.2} r={3} fill={c} style={{ animationDelay: `${200 + i * 80}ms` }} />)}
      </g>);
    case 'Crush': return (
      <g className="fx-burst fx-crush">
        <circle className="fx-ring" r={r * 0.3} fill="none" stroke={c} strokeWidth={4} />
        <circle className="fx-ring" r={r * 0.3} fill="none" stroke={c} strokeWidth={2} style={{ animationDelay: '150ms' }} />
        {[0, 72, 144, 216, 288].map(a => <line key={a} className="fx-crack" x1={0} y1={0} x2={r * 1.3 * Math.cos(rad(a))} y2={r * 1.3 * Math.sin(rad(a))} stroke={c} strokeWidth={2} strokeDasharray="6 4" />)}
      </g>);
    case 'Burn': return (
      <g className="fx-burst fx-burn">
        {[0, 1, 2, 3, 4, 5].map(i => <ellipse key={i} className="fx-flame" cx={(i - 2.5) * r * 0.3} cy={r * 0.3} rx={r * 0.18} ry={r * 0.45} fill={i % 2 ? '#ffd166' : c} style={{ animationDelay: `${i * 70}ms` }} />)}
      </g>);
    case 'Chill': return (
      <g className="fx-burst fx-chill">
        {[0, 60, 120, 180, 240, 300].map(a => <polygon key={a} className="fx-shard" points={`0,0 ${r * 0.25},${r * 0.9} 0,${r * 1.4} ${-r * 0.25},${r * 0.9}`} fill={c} fillOpacity={0.85} transform={`rotate(${a})`} style={{ animationDelay: `${(a / 60) * 50}ms` }} />)}
        <circle className="fx-ring" r={r * 0.5} fill="none" stroke="#fff" strokeWidth={1.5} strokeOpacity={0.7} />
      </g>);
    case 'Poison': return (
      <g className="fx-burst fx-poison">
        {[0, 1, 2, 3, 4, 5, 6].map(i => <circle key={i} className="fx-bubble" cx={(i - 3) * r * 0.28} cy={r * 0.4} r={r * (0.1 + (i % 3) * 0.05)} fill={c} fillOpacity={0.75} style={{ animationDelay: `${i * 110}ms` }} />)}
      </g>);
    case 'Infection': return (
      <g className="fx-burst fx-infection">
        {[15, 75, 135, 195, 255, 315].map((a, i) => <polygon key={a} className="fx-crystal" points={`0,0 ${r * 0.3},${r * 0.5} 0,${r * 1.2} ${-r * 0.3},${r * 0.5}`} fill={c} fillOpacity={0.8} stroke="#fff" strokeOpacity={0.5} strokeWidth={0.8} transform={`rotate(${a}) scale(${0.7 + (i % 2) * 0.4})`} style={{ animationDelay: `${i * 120}ms` }} />)}
      </g>);
    case 'Dissolution': return (
      <g className="fx-burst fx-dissolution">
        <circle className="fx-spiral" r={r * 0.9} fill="none" stroke={c} strokeWidth={3} strokeDasharray="14 10" />
        <circle className="fx-spiral rev" r={r * 0.55} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={2} strokeDasharray="6 8" />
      </g>);
    default: return (
      <g className="fx-burst fx-heal">
        <circle className="fx-pulse" r={r * 0.4} fill={c} fillOpacity={0.35} />
        <circle className="fx-pulse" r={r * 0.4} fill="none" stroke={c} strokeWidth={2} style={{ animationDelay: '250ms' }} />
        <path d={`M${-r * 0.35},0 h${r * 0.7} M0,${-r * 0.35} v${r * 0.7}`} stroke={c} strokeWidth={3} strokeLinecap="round" />
      </g>);
  }
}

export default function FxLayer({ fx, grid, now }) {
  const [seen] = useState(() => new Map());   // fxId → mount time
  const [, force] = useState(0);
  useEffect(() => {
    const t = Date.now();
    let changed = false;
    for (const f of fx || []) if (!seen.has(f.fxId)) { seen.set(f.fxId, t); changed = true; }
    if (changed) force(n => n + 1);
    const iv = setTimeout(() => force(n => n + 1), LIFE_MS + 50);
    return () => clearTimeout(iv);
  }, [fx]);
  const t = Date.now();
  const active = (fx || []).filter(f => seen.has(f.fxId) && t - seen.get(f.fxId) < LIFE_MS);
  if (!active.length) return null;
  const r = grid.size * 0.9;
  return (
    <g className="fx-layer" pointerEvents="none">
      {active.map(f => {
        const to = centre(f.to.col, f.to.row, grid);
        const from = f.from ? centre(f.from.col, f.from.row, grid) : null;
        const st = FX_STYLE[f.type] || FX_STYLE.Crush;
        return (
          <g key={f.fxId}>
            {from && (
              <g>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={st.color} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="4 6" className="fx-trail" />
                <circle r={grid.size * 0.22} fill={st.color} style={{ filter: `drop-shadow(0 0 6px ${st.glow})` }}>
                  <animate attributeName="cx" from={from.x} to={to.x} dur="0.38s" fill="freeze" />
                  <animate attributeName="cy" from={from.y} to={to.y} dur="0.38s" fill="freeze" />
                  <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.9;1" dur="0.42s" fill="freeze" />
                </circle>
              </g>
            )}
            <g transform={`translate(${to.x},${to.y})`} style={{ filter: `drop-shadow(0 0 8px ${st.glow})`, animationDelay: from ? '360ms' : '0ms' }} className={from ? 'fx-after-trail' : ''}>
              <Burst type={f.type} r={r} />
              {f.label && <text className="fx-label" y={-r - 6} textAnchor="middle" fill={st.color}>{f.label}</text>}
            </g>
          </g>
        );
      })}
    </g>
  );
}
