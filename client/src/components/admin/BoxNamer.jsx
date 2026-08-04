import { useState } from 'react';
import { apiFetch } from '../../api.js';
import { BOX_TIERS } from '../../constants.js';

// Box Namer (item-drafting-passover ID-7): the GM inputs what dropped + how it
// was earned, gets "<Tier> <Flavor> Box" name suggestions. Three lanes: earned
// (deed lexicon, unmatched text passes through title-cased so boss names just
// work), contents (dominant category/subtype of the picked loot), showbiz.

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
  Weapons: ['Arsenal', 'Armory', 'Whetstone'],
  Equipment: ['Bulwark', 'Wardrobe', 'Understudy'],
  Consumables: ['Care-Package', 'Supply-Drop', 'Triage'],
  Tools: ['Stagehand', 'Toolbox', 'Rigging'],
  Misc: ['Grab-Bag', 'Variety-Hour'],
  'System Items': ['Fine-Print', 'Terms-and-Conditions'],
  'Key Items': ['MacGuffin', 'Plot-Device'],
};
const SUB_FLAVOR = { Kit: ['Assembly', 'Some-Assembly-Required'], Growth: ['Sleeper', 'Slow-Burn'], 'Limited-magic': ['Arcana', 'Spellbound'], Trinket: ['Bling', 'Red-Carpet'] };
const SHOW = ['Primetime', 'Encore', 'Fan-Favorite', 'Sweeps-Week', 'Golden-Hour', 'Season-Finale', 'Commercial-Break', 'Ratings-Spike', 'Standing-Ovation', 'Rerun', 'Cliffhanger', 'Cold-Open'];

const TIER_COLOR = { Crude: 'var(--muted)', Basic: 'var(--text)', Quality: 'var(--cyan)', Superior: 'var(--gold)', Exceptional: 'var(--purple)' };
const TIER_STEP = { '': 0, Crude: 0, Basic: 0, Quality: 1, Superior: 2, Exceptional: 3 };
const BOX_LADDER = ['Bronze', 'Silver', 'Gold', 'Legendary'];

const pickN = (arr, n) => [...new Set(arr)].sort(() => Math.random() - 0.5).slice(0, n);
const title = s => s.replace(/\w\S*/g, t => t[0].toUpperCase() + t.slice(1));

export default function BoxNamer({ items, token, showToast }) {
  const [open, setOpen] = useState(false);
  const [enemies, setEnemies] = useState(null);          // null = not fetched yet
  const [search, setSearch] = useState('');
  const [picked, setPicked] = useState([]);              // item _ids
  const [deedText, setDeedText] = useState('');
  const [tierPick, setTierPick] = useState('Auto');
  const [names, setNames] = useState([]);

  function expand() {
    setOpen(o => !o);
    if (enemies === null) apiFetch('/api/enemies', {}, token).then(d => setEnemies(Array.isArray(d) ? d : []));
  }
  const sel = items.filter(i => picked.includes(i._id));
  const togglePick = id => setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  function inferTier(selected) {
    if (!selected.length) return 'Bronze';
    let step = Math.max(...selected.map(i => TIER_STEP[i.tier] ?? 0));
    if (selected.some(i => i.subtype === 'Growth' || /tome/i.test(i.name))) step = Math.min(step + 1, 3);
    return BOX_LADDER[step];
  }

  function generate() {
    const tier = tierPick === 'Auto' ? inferTier(sel) : tierPick;
    const lanes = [];
    const deed = deedText.trim();
    if (deed) {
      const dW = DEED_LEX.filter(([re]) => re.test(deed)).flatMap(([, w]) => w);
      if (!dW.length) dW.push(title(deed));
      pickN(dW, 2).forEach(w => lanes.push([w, 'earned']));
    }
    const cW = sel.flatMap(i => (SUB_FLAVOR[i.subtype] || CONTENT_FLAVOR[i.category] || []));
    pickN(cW, 2).forEach(w => lanes.push([w, 'contents']));
    pickN(SHOW, 2).forEach(w => lanes.push([w, 'showbiz']));

    const seen = new Set();
    setNames(lanes.map(([w, lane]) => [`${tier} ${w} Box`, lane]).filter(([n]) => !seen.has(n) && seen.add(n)));
  }

  function copy(name) {
    if (navigator.clipboard) navigator.clipboard.writeText(name);
    showToast(`Copied "${name}"`);
  }

  const q = search.toLowerCase();
  const filtered = items.filter(i => i.name.toLowerCase().includes(q));
  const inferred = tierPick === 'Auto' ? inferTier(sel) : null;
  const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', cursor: 'pointer', fontSize: 12, borderBottom: '1px solid var(--border)' };
  const listStyle = { maxHeight: 160, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 4, marginTop: 6, background: 'rgba(0,0,0,.25)' };

  return (
    <div className="panel">
      <div className="panel-title admin" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={expand}>
        📦 Box Namer {open ? '▾' : '▸'} <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 400 }}>name loot boxes from what dropped + how it was earned</span>
      </div>
      {open && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
          <div>
            <label className="field-label">The loot — pick from the library</label>
            <input className="fi" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items…" />
            {sel.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                {sel.map(i => <button key={i._id} className="badge-toggle on" onClick={() => togglePick(i._id)}>{i.icon || '📦'} {i.name} ×</button>)}
              </div>
            )}
            <div style={listStyle}>
              {filtered.map(i => (
                <div key={i._id} style={{ ...rowStyle, color: picked.includes(i._id) ? 'var(--cyan)' : 'var(--text)' }} onClick={() => togglePick(i._id)}>
                  <span>{i.icon || '📦'} {i.name} {i.tier && <span style={{ fontSize: 10, color: TIER_COLOR[i.tier] }}>· {i.tier}</span>}</span>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>{i.subtype || i.category}</span>
                </div>
              ))}
              {filtered.length === 0 && <div style={{ ...rowStyle, cursor: 'default', color: 'var(--muted)' }}>No matches.</div>}
            </div>
          </div>

          <div>
            <label className="field-label">Earned by — Goal, enemy, or custom text</label>
            <input className="fi" value={deedText} onChange={e => setDeedText(e.target.value)} placeholder="Overkill / Incineradile / custom…" />
            <div style={listStyle}>
              <div style={{ ...rowStyle, cursor: 'default', color: 'var(--muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>🏆 Goals</div>
              {GOALS.filter(g => g.toLowerCase().includes(deedText.toLowerCase()) || deedText === '').map(g => (
                <div key={g} style={{ ...rowStyle, color: deedText === g ? 'var(--cyan)' : 'var(--text)' }} onClick={() => setDeedText(g)}>{g}</div>
              ))}
              <div style={{ ...rowStyle, cursor: 'default', color: 'var(--muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>👹 Enemies</div>
              {(enemies || []).filter(e => e.name.toLowerCase().includes(deedText.toLowerCase()) || deedText === '').map(e => (
                <div key={e._id} style={{ ...rowStyle, color: deedText === e.name ? 'var(--cyan)' : 'var(--text)' }} onClick={() => setDeedText(e.name)}>
                  <span>{e.name}</span><span style={{ fontSize: 10, color: 'var(--muted)' }}>{e.tier}</span>
                </div>
              ))}
              {enemies !== null && enemies.length === 0 && <div style={{ ...rowStyle, cursor: 'default', color: 'var(--muted)' }}>No enemies yet.</div>}
            </div>

            <div style={{ marginTop: 10 }}>
              <label className="field-label">Box tier {inferred && <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(auto: {inferred})</span>}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {['Auto', ...BOX_TIERS].map(t => (
                  <button key={t} className={`badge-toggle${tierPick === t ? ' on' : ''}`} onClick={() => setTierPick(t)}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <button className="btn btn-cyan btn-sm" onClick={generate}>Generate</button>
              <button className="btn btn-muted btn-sm" onClick={generate}>🎲 Reroll</button>
            </div>
            <label className="field-label">Suggestions — click to copy</label>
            {names.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 4 }}>Pick loot (and/or an earner), then Generate.</div>}
            {names.map(([n, lane]) => (
              <div key={n} onClick={() => copy(n)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,.25)', border: '1px solid var(--border)', borderRadius: 4, padding: '8px 12px', marginTop: 6, cursor: 'pointer', fontSize: 14 }}>
                <span>{n}</span>
                <span style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{lane}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
