import { useState } from 'react';
import { apiFetch } from '../../api.js';
import { BOX_TIERS } from '../../constants.js';

// Box Builder (item-drafting-passover ID-9) — composes SEALED lootboxes and
// absorbs the Box Namer: pick contents from the library, pick recipients and
// reveal mode, note WHY it's earned (the box log's `source`), and let the namer
// suggest the "<Tier> <Flavor> Box" name. Below it: the permanent Box Log.

const GOALS = ['Overkill', 'Finish Fast', 'Environmental Kill', 'Play into a Tag', 'Say the Line', 'While Exposed', 'Without Healing', 'Solo', 'Spare the Enemy', 'Betray Expectations'];
const DEED_LEX = [
  [/overkill|massacre/i, ['Massacre', 'Carnage', 'Overkill']],
  [/fast|speed/i, ['Blitz', 'Speedrun', 'Primetime']],
  [/environment/i, ['Stagecraft', 'Hazard-Pay']],
  [/tag/i, ['Typecast', 'In-Character']],
  [/line/i, ['Catchphrase', 'Quotable']],
  [/exposed/i, ['Daredevil', 'High-Wire']],
  [/healing/i, ['Iron-Will', 'No-Sell']],
  [/solo/i, ['One-Man-Show', 'Solo-Act']],
  [/spare/i, ['Mercy', 'Clemency']],
  [/betray/i, ['Plot-Twist', 'Swerve']],
];
const CONTENT_FLAVOR = {
  Weapons: ['Arsenal', 'Armory', 'Whetstone'], Equipment: ['Bulwark', 'Wardrobe'],
  Consumables: ['Care-Package', 'Supply-Drop', 'Triage'], Tools: ['Stagehand', 'Toolbox'],
  Misc: ['Grab-Bag', 'Variety-Hour'], 'System Items': ['Fine-Print'], 'Key Items': ['MacGuffin'],
};
const SUB_FLAVOR = { Kit: ['Assembly'], Growth: ['Sleeper'], 'Limited-magic': ['Arcana'], Trinket: ['Bling'], Material: ['Quarry'], Tome: ['Book-Club'] };
const SHOW = ['Primetime', 'Encore', 'Fan-Favorite', 'Sweeps-Week', 'Golden-Hour', 'Season-Finale', 'Commercial-Break', 'Ratings-Spike', 'Cliffhanger', 'Cold-Open'];
const TIER_COLOR = { Crude: 'var(--muted)', Basic: 'var(--text)', Quality: 'var(--cyan)', Superior: 'var(--gold)', Exceptional: 'var(--purple)' };
const BOX_COLOR = { Bronze: '#cd7f32', Silver: '#c0c0c0', Gold: 'var(--gold)', Legendary: '#a855f7', Mythic: '#ec4899', Godly: '#fff' };
const TIER_STEP = { '': 0, Crude: 0, Basic: 0, Quality: 1, Superior: 2, Exceptional: 3 };
const BOX_LADDER = ['Bronze', 'Silver', 'Gold', 'Legendary'];
const pickN = (arr, n) => [...new Set(arr)].sort(() => Math.random() - 0.5).slice(0, n);
const title = s => s.replace(/\w\S*/g, t => t[0].toUpperCase() + t.slice(1));

export default function BoxBuilder({ items, players, token, showToast }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [picked, setPicked] = useState([]);        // [{ itemId, name, icon, tier, category, subtype, qty }]
  const [recips, setRecips] = useState([]);
  const [mode, setMode] = useState('all');
  const [source, setSource] = useState('');
  const [name, setName] = useState('');
  const [tierPick, setTierPick] = useState('Auto');
  const [logOpen, setLogOpen] = useState(false);
  const [log, setLog] = useState(null);

  const addItem = (it) => setPicked(p => {
    const i = p.findIndex(x => x.itemId === it._id);
    if (i !== -1) return p.map((x, j) => j === i ? { ...x, qty: x.qty + 1 } : x);
    return [...p, { itemId: it._id, name: it.name, icon: it.icon, tier: it.tier, category: it.category, subtype: it.subtype, qty: 1 }];
  });
  const removeItem = (itemId) => setPicked(p => p
    .map(x => x.itemId === itemId ? { ...x, qty: x.qty - 1 } : x)
    .filter(x => x.qty > 0));

  function inferTier() {
    if (!picked.length) return 'Bronze';
    let step = Math.max(...picked.map(i => TIER_STEP[i.tier] ?? 0));
    if (picked.some(i => i.subtype === 'Growth' || /tome/i.test(i.name))) step = Math.min(step + 1, 3);
    return BOX_LADDER[step];
  }
  const tier = tierPick === 'Auto' ? inferTier() : tierPick;

  function suggest() {
    const lanes = [];
    if (source.trim()) {
      const dW = DEED_LEX.filter(([re]) => re.test(source)).flatMap(([, w]) => w);
      if (!dW.length) dW.push(title(source.trim()));
      lanes.push(...pickN(dW, 2));
    }
    lanes.push(...pickN(picked.flatMap(i => (SUB_FLAVOR[i.subtype] || CONTENT_FLAVOR[i.category] || [])), 2));
    lanes.push(...pickN(SHOW, 2));
    const w = lanes[Math.floor(Math.random() * lanes.length)] || 'Mystery';
    setName(`${tier} ${w} Box`);
  }

  async function give() {
    if (!picked.length) return showToast('Pick some contents first', 'err');
    if (!recips.length) return showToast('Pick at least one recipient', 'err');
    const d = await apiFetch('/api/boxes', {
      method: 'POST',
      body: JSON.stringify({
        userIds: recips, name: name || `${tier} Mystery Box`, boxTier: tier, mode, source,
        items: picked.map(p => ({ itemId: p.itemId, qty: p.qty })),
      }),
    }, token);
    if (d.error) return showToast(d.error, 'err');
    const ok = d.results?.filter(r => r.ok).length || 0;
    showToast(`Sealed "${name || `${tier} Mystery Box`}" → ${ok}/${recips.length} player(s)`);
    setPicked([]); setRecips([]); setName(''); setSource('');
    if (log) loadLog();
  }

  function loadLog() {
    apiFetch('/api/boxes/admin/log', {}, token).then(d => { if (Array.isArray(d)) setLog(d); });
  }

  const q = search.toLowerCase();
  const filtered = (items || []).filter(i => i.name.toLowerCase().includes(q));
  const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', cursor: 'pointer', fontSize: 12, borderBottom: '1px solid var(--border)' };
  const listStyle = { maxHeight: 160, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 4, marginTop: 6, background: 'rgba(0,0,0,.25)' };

  return (
    <div className="panel">
      <div className="panel-title admin" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setOpen(o => !o)}>
        📦 Box Builder {open ? '▾' : '▸'} <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 400 }}>compose sealed lootboxes — the Box Namer lives inside</span>
      </div>
      {open && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
            <div>
              <label className="field-label">Contents — click to add (again for +1)</label>
              <input className="fi" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search the library…" />
              {picked.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                  {picked.map(p => (
                    <button key={p.itemId} className="badge-toggle on" onClick={() => removeItem(p.itemId)}>
                      {p.icon || '📦'} {p.name}{p.qty > 1 ? ` ×${p.qty}` : ''} −
                    </button>
                  ))}
                </div>
              )}
              <div style={listStyle}>
                {filtered.map(i => (
                  <div key={i._id} style={rowStyle} onClick={() => addItem(i)}>
                    <span>{i.icon || '📦'} {i.name} {i.tier && <span style={{ fontSize: 10, color: TIER_COLOR[i.tier] }}>· {i.tier}</span>}</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{i.subtype || i.category}</span>
                  </div>
                ))}
                {filtered.length === 0 && <div style={{ ...rowStyle, cursor: 'default', color: 'var(--muted)' }}>No matches.</div>}
              </div>
            </div>

            <div>
              <label className="field-label">Recipients</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {(players || []).map(p => (
                  <button key={p.userId} className={`badge-toggle${recips.includes(p.userId) ? ' on' : ''}`}
                    onClick={() => setRecips(r => r.includes(p.userId) ? r.filter(x => x !== p.userId) : [...r, p.userId])}>
                    {p.username}
                  </button>
                ))}
              </div>
              <label className="field-label" style={{ marginTop: 10 }}>Reveal mode</label>
              <div style={{ display: 'flex', gap: 5 }}>
                <button className={`badge-toggle${mode === 'all' ? ' on' : ''}`} onClick={() => setMode('all')}>Open all</button>
                <button className={`badge-toggle${mode === 'pick-one' ? ' on' : ''}`} onClick={() => setMode('pick-one')}>Pick one of N</button>
              </div>
              <label className="field-label" style={{ marginTop: 10 }}>Earned by — WHY (logged) · feeds the namer</label>
              <input className="fi" value={source} onChange={e => setSource(e.target.value)} placeholder="Incineradile / Overkill / quest…" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
                {GOALS.slice(0, 5).map(g => (
                  <button key={g} className={`badge-toggle${source === g ? ' on' : ''}`} style={{ fontSize: 10 }} onClick={() => setSource(g)}>{g}</button>
                ))}
              </div>
              <label className="field-label" style={{ marginTop: 10 }}>Box tier <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(auto: {inferTier()})</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {['Auto', ...BOX_TIERS].map(t => (
                  <button key={t} className={`badge-toggle${tierPick === t ? ' on' : ''}`} onClick={() => setTierPick(t)}>{t}</button>
                ))}
              </div>
              <label className="field-label" style={{ marginTop: 10 }}>Box name</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input className="fi" value={name} onChange={e => setName(e.target.value)} placeholder={`${tier} Mystery Box`} />
                <button className="btn btn-muted btn-sm" onClick={suggest}>🎲 Suggest</button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="btn btn-cyan btn-sm" onClick={give}>Give sealed box</button>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              {picked.reduce((n, p) => n + p.qty, 0)} item(s) · {recips.length} recipient(s) · {mode === 'pick-one' ? 'they choose one' : 'they get everything'}
            </span>
          </div>

          <div className="panel-title admin" style={{ cursor: 'pointer', userSelect: 'none', marginTop: 16 }}
            onClick={() => { setLogOpen(o => !o); if (!log) loadLog(); }}>
            📜 Box Log {logOpen ? '▾' : '▸'} <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 400 }}>every box: who, what, why, and what was chosen</span>
          </div>
          {logOpen && (
            <div>
              <button className="btn btn-muted btn-xs" style={{ marginBottom: 8 }} onClick={loadLog}>↻ Refresh</button>
              {!log && <div style={{ fontSize: 11, color: 'var(--muted)' }}>Loading…</div>}
              {log && log.length === 0 && <div style={{ fontSize: 11, color: 'var(--muted)' }}>No boxes given yet.</div>}
              {log && log.map(b => (
                <div key={b._id} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', marginBottom: 6, background: 'rgba(0,0,0,.2)' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: BOX_COLOR[b.boxTier] || 'var(--text)' }}>{b.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--cyan)' }}>→ {b.username}</span>
                    {b.source && <span style={{ fontSize: 11, color: 'var(--gold)' }}>({b.source})</span>}
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: b.status === 'opened' ? 'var(--success, #00ff88)' : 'var(--muted)' }}>
                      {b.status === 'opened' ? `opened ${new Date(b.openedAt).toLocaleDateString()}` : 'sealed'}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: 11, marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(b.items || []).map((it, i) => (
                      <span key={i} style={{
                        padding: '1px 8px', borderRadius: 9, border: '1px solid var(--border)',
                        ...(b.mode === 'pick-one' && b.chosenIndex === i ? { borderColor: '#ec4899', color: '#ec4899', fontWeight: 700 } : {}),
                        ...(b.mode === 'pick-one' && b.status === 'opened' && b.chosenIndex !== i ? { opacity: .4, textDecoration: 'line-through' } : {}),
                      }}>
                        {it.icon} {it.name}{it.qty > 1 ? ` ×${it.qty}` : ''}{b.mode === 'pick-one' && b.chosenIndex === i ? ' ✓chosen' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
