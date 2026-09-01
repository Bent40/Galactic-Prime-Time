import { useMemo } from 'react';

/**
 * Bill of materials (rulebook §12.7). Parts are material capacity; the STRIKING
 * part sets the damage band. Written on every item so a disassembly at the Forge
 * can hand the materials back and the party can build something else with them.
 *
 * `value` is the array; `onChange` receives the new array. Pass readOnly for the
 * player sheet, where the bill is a fact about the item rather than a field.
 */
export default function MaterialsEditor({ value, onChange, readOnly = false }) {
  const rows = Array.isArray(value) ? value : [];
  const striking = useMemo(() => rows.find(r => r.striking), [rows]);

  function set(i, patch) {
    onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }
  function setStriking(i) {
    onChange(rows.map((r, j) => ({ ...r, striking: j === i })));
  }
  function add() { onChange([...rows, { part: '', material: '', striking: rows.length === 0 }]); }
  function rm(i) {
    const next = rows.filter((_, j) => j !== i);
    if (next.length && !next.some(r => r.striking)) next[0] = { ...next[0], striking: true };
    onChange(next);
  }

  if (readOnly) {
    if (!rows.length) return <span style={{ color: 'var(--muted)', fontSize: 11 }}>Baseline stock — no band.</span>;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {rows.map((r, i) => (
          <span key={i} title={r.striking ? 'Striking part — sets the band' : undefined}
            style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 3,
              border: `1px solid ${r.striking ? 'var(--gold)' : 'var(--border)'}`,
              background: r.striking ? 'rgba(200,168,75,.09)' : 'rgba(0,0,0,.2)',
              color: r.striking ? 'var(--gold)' : 'var(--text)',
            }}>
            {r.striking && '★ '}{r.part}: <strong>{r.material}</strong>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div>
      {rows.map((r, i) => (
        <div className="row" key={i} style={{ gap: 5, marginBottom: 4 }}>
          <input className="fi" style={{ flex: 1 }} placeholder="Part (Blade, Haft, Lining…)"
            value={r.part || ''} onChange={e => set(i, { part: e.target.value })} />
          <input className="fi" style={{ flex: 1 }} placeholder="Material (Obsidian, Sky-Iron…)"
            value={r.material || ''} onChange={e => set(i, { material: e.target.value })} />
          <button className={`btn btn-sm ${r.striking ? 'btn-gold' : 'btn-muted'}`}
            title="Striking part — sets the damage band"
            onClick={() => setStriking(i)}>★</button>
          <button className="btn btn-muted btn-sm" onClick={() => rm(i)}>✕</button>
        </div>
      ))}
      <button className="btn btn-cyan btn-sm" onClick={add}>+ Part</button>
      {rows.length > 0 && !striking && (
        <span style={{ color: 'var(--gold)', fontSize: 10, marginLeft: 8 }}>
          No striking part — the band is undefined.
        </span>
      )}
    </div>
  );
}
