import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../api.js';

// Sealed lootboxes strip + the reveal flow (item-drafting-passover ID-9).
// Contents live server-side until opened; on open the SERVER only marks the box
// and returns snapshots — this component merges them into inventory through
// update(), the normal autosave path, so there is no state-write race.

const BOX_TIER_COLOR = {
  Bronze: 'var(--bronze, #cd7f32)', Silver: 'var(--silver, #c0c0c0)', Gold: 'var(--gold)',
  Legendary: 'var(--legendary, #a855f7)', Mythic: 'var(--mythic, #ec4899)', Godly: '#ffffff',
};
const ITEM_TIER_COLOR = { Crude: 'var(--muted)', Basic: 'var(--text)', Quality: 'var(--cyan)', Superior: 'var(--gold)', Exceptional: 'var(--purple)' };
const CAT_ID_MAP = { Equipment: 10, Weapons: 11, Tools: 12, Consumables: 13, Misc: 14, 'System Items': 17, 'Key Items': 18 };
const POLL_MS = 12000;

// Read-only detail block — the informed-decision view (owner addition).
function ItemDetail({ it }) {
  const rows = [
    ['Tier', it.tier], ['Type', it.subtype || it.category],
    ['Damage', it.damage && `${it.damage} ${(it.damageType || []).join('/')}`],
    ['Attack', (it.attackTypes || []).join(', ')], ['Range', it.range],
    ['RPM', it.rpm], ['Magazine', it.magazine],
    ['Effects', it.specialEffects], ['Resistance', it.resistance],
    ['Requirements', it.requirements],
    ['Uses', it.uses?.max != null ? `${it.uses.max}` : ''], ['Qty', it.qty > 1 ? it.qty : ''],
  ].filter(([, v]) => v != null && v !== '');
  return (
    <div style={{ background: 'rgba(0,0,0,.3)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', margin: '4px 0 8px', fontSize: 12 }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', gap: 8, padding: '1px 0' }}>
          <span style={{ color: 'var(--muted)', minWidth: 90, textTransform: 'uppercase', fontSize: 10, letterSpacing: 1, paddingTop: 2 }}>{k}</span>
          <span>{String(v)}</span>
        </div>
      ))}
      {it.description && <div style={{ color: 'var(--muted)', fontStyle: 'italic', marginTop: 4 }}>{it.description}</div>}
    </div>
  );
}

function LootRow({ it, expanded, onToggle, selectable, selected, onSelect }) {
  const col = ITEM_TIER_COLOR[it.tier] || 'var(--text)';
  return (
    <div>
      <div onClick={() => (selectable ? onSelect() : onToggle())}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4, cursor: 'pointer',
          background: selected ? 'rgba(236,72,153,.12)' : 'rgba(0,0,0,.25)', borderRadius: 6,
          border: `1px solid ${selected ? 'var(--mythic, #ec4899)' : 'var(--border)'}`,
        }}>
        <span style={{ fontSize: 20 }}>{it.icon || '📦'}</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: col }}>{it.name}</span>
        {it.qty > 1 && <span style={{ fontSize: 11, color: 'var(--muted)' }}>×{it.qty}</span>}
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--muted)' }}>
          {selectable ? (selected ? 'SELECTED' : 'select') : (expanded ? '▲ details' : '▼ details')}
        </span>
        {selectable && (
          <span onClick={e => { e.stopPropagation(); onToggle(); }} style={{ fontSize: 10, color: 'var(--cyan)', cursor: 'pointer' }}>
            {expanded ? 'hide' : 'info'}
          </span>
        )}
      </div>
      {expanded && <ItemDetail it={it} />}
    </div>
  );
}

export default function LootBoxes({ token, update }) {
  const [boxes, setBoxes] = useState([]);
  const [reveal, setReveal] = useState(null); // { queue, idx, phase:'items'|'pick'|'done', items|choices, picked, boxName, boxTier, mode }
  const [expanded, setExpanded] = useState({});
  const busy = useRef(false);

  function load() {
    if (!token) return;
    apiFetch('/api/boxes', {}, token).then(d => { if (Array.isArray(d)) setBoxes(d); });
  }
  useEffect(() => {
    load();
    const t = setInterval(load, POLL_MS);
    return () => clearInterval(t);
  }, [token]);

  // Merge opened items into inventory through update() — the autosave path.
  function mergeItems(items) {
    update(s => {
      const cats = [...(s.inventory?.categories || [])];
      for (const item of items) {
        const catId = CAT_ID_MAP[item.category] || 14;
        let idx = cats.findIndex(c => c.id === catId);
        if (idx === -1) {
          cats.push({ id: catId, name: item.category || 'Misc', locked: false, items: [] });
          idx = cats.length - 1;
        }
        cats[idx] = { ...cats[idx], items: [...(cats[idx].items || []), item] };
      }
      return { ...s, inventory: { ...s.inventory, categories: cats } };
    });
  }

  async function startReveal() {
    if (!boxes.length || busy.current) return;
    openBoxAt(boxes, 0);
  }

  async function openBoxAt(queue, idx) {
    if (idx >= queue.length) { setReveal({ phase: 'done' }); load(); return; }
    busy.current = true;
    setExpanded({});
    const box = queue[idx];
    const d = await apiFetch(`/api/boxes/${box._id}/open`, { method: 'POST' }, token);
    busy.current = false;
    if (d.error) { setReveal({ phase: 'done', error: d.error }); load(); return; }
    if (d.mode === 'pick-one') {
      setReveal({ queue, idx, phase: 'pick', choices: d.choices, picked: null, boxName: box.name, boxTier: box.boxTier, boxId: box._id });
    } else {
      setReveal({ queue, idx, phase: 'items', items: d.items, boxName: box.name, boxTier: box.boxTier });
    }
  }

  function takeAll() {
    mergeItems(reveal.items);
    openBoxAt(reveal.queue, reveal.idx + 1);
  }

  async function claim() {
    if (reveal.picked == null || busy.current) return;
    busy.current = true;
    const d = await apiFetch(`/api/boxes/${reveal.boxId}/claim`, { method: 'POST', body: JSON.stringify({ index: reveal.picked }) }, token);
    busy.current = false;
    if (!d.error && Array.isArray(d.items)) mergeItems(d.items);
    openBoxAt(reveal.queue, reveal.idx + 1);
  }

  if (!boxes.length && !reveal) return null;

  return (
    <>
      {boxes.length > 0 && (
        <div className="panel" style={{ marginBottom: 10 }}>
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            📦 Sealed Boxes ({boxes.length})
            <button className="btn btn-sm" style={{ marginLeft: 'auto', background: 'var(--gold)', color: '#1a1200', fontWeight: 800 }}
              onClick={startReveal}>
              🔓 Crack the seals — open all
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {boxes.map(b => {
              const col = BOX_TIER_COLOR[b.boxTier] || 'var(--border)';
              return (
                <div key={b._id} style={{ width: 140, textAlign: 'center', padding: '12px 8px', borderRadius: 8, border: `1px solid ${col}`, background: 'rgba(0,0,0,.25)', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: 4, right: 8, fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {b.mode === 'pick-one' ? 'pick one' : 'sealed'}
                  </span>
                  <div style={{ fontSize: 30 }}>📦</div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4, color: col, lineHeight: 1.3 }}>{b.name}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 8 }}>
            House rule (§20): boxes only open at the Lounge — and opening opens ALL of them.
          </div>
        </div>
      )}

      {reveal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget && reveal.phase === 'done') setReveal(null); }}>
          <div className="modal-box" style={{ maxWidth: 480 }}>
            {reveal.phase === 'items' && (
              <>
                <div className="modal-title" style={{ color: BOX_TIER_COLOR[reveal.boxTier] || 'var(--text)' }}>{reveal.boxName}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>Items looted — click any item for details:</div>
                {reveal.items.map((it, i) => (
                  <LootRow key={it.id || i} it={it}
                    expanded={!!expanded[i]} onToggle={() => setExpanded(x => ({ ...x, [i]: !x[i] }))} />
                ))}
                <div className="modal-footer">
                  <button className="btn btn-cyan btn-sm" onClick={takeAll}>Take all → inventory</button>
                </div>
              </>
            )}
            {reveal.phase === 'pick' && (
              <>
                <div className="modal-title" style={{ color: BOX_TIER_COLOR[reveal.boxTier] || 'var(--text)' }}>{reveal.boxName}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                  <b>Choose ONE — the others fade.</b> Click to select; "info" for details.
                </div>
                {reveal.choices.map((it, i) => (
                  <LootRow key={it.id || i} it={it} selectable
                    selected={reveal.picked === i}
                    onSelect={() => setReveal(r => ({ ...r, picked: i }))}
                    expanded={!!expanded[i]} onToggle={() => setExpanded(x => ({ ...x, [i]: !x[i] }))} />
                ))}
                <div className="modal-footer">
                  <button className="btn btn-cyan btn-sm" onClick={claim} disabled={reveal.picked == null}
                    style={reveal.picked == null ? { opacity: .4 } : {}}>
                    Claim
                  </button>
                </div>
              </>
            )}
            {reveal.phase === 'done' && (
              <>
                <div className="modal-title" style={{ color: 'var(--success, #00ff88)' }}>All boxes opened</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
                  {reveal.error ? `Note: ${reveal.error}` : 'Every item is in your inventory. The cameras got the whole thing.'}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-muted btn-sm" onClick={() => setReveal(null)}>Done</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
