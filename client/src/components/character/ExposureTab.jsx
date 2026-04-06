import { useState, useRef } from 'react';
import { uid, BOSS_TIERS } from '../../constants.js';

export default function ExposureTab({ state, update }) {
  const portraitRefs = useRef([null, null, null]);
  const [newTag, setNewTag] = useState({ name: '', effect: '' });
  const [tokenForm, setTokenForm] = useState({ tier: 'bronze' });

  function patchExposure(k, v) { update(s => ({ ...s, exposure: { ...s.exposure, [k]: v } })); }
  function adjustExposure(k, delta) { update(s => ({ ...s, exposure: { ...s.exposure, [k]: Math.max(0, (s.exposure[k] || 0) + delta) } })); }

  function cycleTag(id) {
    const cycle = ['active', 'reinforced', 'faded'];
    update(s => ({ ...s, tags: s.tags.map(t => t.id === id ? { ...t, state: cycle[(cycle.indexOf(t.state) + 1) % cycle.length] } : t) }));
  }
  function rmTag(id) { update(s => ({ ...s, tags: s.tags.filter(t => t.id !== id) })); }
  function addTag() {
    if (!newTag.name) return;
    update(s => ({ ...s, tags: [...s.tags, { id: uid(), name: newTag.name, state: 'active', effect: newTag.effect }] }));
    setNewTag({ name: '', effect: '' });
  }

  function patchPatron(rank, k, v) {
    update(s => ({ ...s, patrons: s.patrons.map(p => p.rank === rank ? { ...p, [k]: v } : p) }));
  }

  function adjustToken(k, delta) { update(s => ({ ...s, tokens: { ...s.tokens, [k]: Math.max(0, (s.tokens[k] || 0) + delta) } })); }
  function addBossToken() {
    update(s => ({ ...s, tokens: { ...s.tokens, bossTokens: [...(s.tokens.bossTokens || []), { id: uid(), tier: tokenForm.tier, used: false }] } }));
  }
  function toggleBossToken(id) {
    update(s => ({ ...s, tokens: { ...s.tokens, bossTokens: (s.tokens.bossTokens || []).map(t => t.id === id ? { ...t, used: !t.used } : t) } }));
  }
  function rmBossToken(id) {
    update(s => ({ ...s, tokens: { ...s.tokens, bossTokens: (s.tokens.bossTokens || []).filter(t => t.id !== id) } }));
  }

  const rankLabel = ['', '🥇 Top Patron', '🥈 2nd Patron', '🥉 3rd Patron'];
  const rankClass = ['', 'r1', 'r2', 'r3'];

  return (
    <>
      {/* Exposure Counters */}
      <div className="panel">
        <div className="panel-title">Exposure Metrics</div>
        <div className="exposure-counters">
          {['viewers', 'followers'].map(k => (
            <div key={k} className="exp-counter">
              <div className="exp-counter-label">{k === 'viewers' ? 'Viewers' : 'Followers'}</div>
              <div className="exp-counter-val">{state.exposure?.[k] || 0}</div>
              <div className="exp-counter-btns">
                <button className="btn-counter" onClick={() => adjustExposure(k, -1)}>−</button>
                <button className="btn-counter" onClick={() => adjustExposure(k, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="panel">
        <div className="panel-title">Tags</div>
        <div className="tags-wrap">
          {(state.tags || []).map(tag => (
            <div key={tag.id} className={`tag-chip ${tag.state || 'active'}`}>
              <div className="tag-chip-top" onClick={() => cycleTag(tag.id)}>
                <span className="tag-chip-name">{tag.name}</span>
                <span className="tag-state-lbl">{tag.state || 'active'}</span>
                <button className="tag-chip-rm" onClick={e => { e.stopPropagation(); rmTag(tag.id); }}>✕</button>
              </div>
              {tag.effect && <div className="tag-chip-effect">{tag.effect}</div>}
            </div>
          ))}
          {(!state.tags || state.tags.length === 0) && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No tags.</span>}
        </div>
        <div className="add-form" style={{ marginTop: 8 }}>
          <div className="field-group" style={{ flex: 2 }}>
            <label className="field-label">Tag Name</label>
            <input className="fi" value={newTag.name} onChange={e => setNewTag(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="field-group" style={{ flex: 3 }}>
            <label className="field-label">Effect</label>
            <input className="fi" value={newTag.effect} onChange={e => setNewTag(f => ({ ...f, effect: e.target.value }))} />
          </div>
          <button className="btn btn-cyan btn-sm" onClick={addTag} style={{ alignSelf: 'flex-end' }}>+ Tag</button>
        </div>
      </div>

      {/* Patrons */}
      <div className="panel">
        <div className="panel-title">Top Patrons</div>
        <div className="patron-list">
          {(state.patrons || []).map((p, idx) => (
            <div key={p.rank} className={`patron-row ${rankClass[p.rank]}`}>
              <div>
                <div className="patron-avatar" onClick={() => portraitRefs.current[idx].click()}>
                  {p.avatar ? <img src={p.avatar} alt="patron" /> : rankLabel[p.rank].split(' ')[0]}
                </div>
                <input ref={el => portraitRefs.current[idx] = el} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                  const f = e.target.files[0]; if (!f) return;
                  const rd = new FileReader();
                  rd.onload = ev => patchPatron(p.rank, 'avatar', ev.target.result);
                  rd.readAsDataURL(f);
                }} />
              </div>
              <div className="patron-fields">
                <input className="patron-in name-in" placeholder={rankLabel[p.rank]} value={p.name} onChange={e => patchPatron(p.rank, 'name', e.target.value)} />
                <input className="patron-in amount-in" placeholder="Contribution" value={p.amount} onChange={e => patchPatron(p.rank, 'amount', e.target.value)} />
                <input className="patron-in" placeholder="Notes" value={p.notes} onChange={e => patchPatron(p.rank, 'notes', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tokens */}
      <div className="panel">
        <div className="panel-title">Tokens</div>
        <div className="token-counters">
          {[['narrative', 'Narrative'], ['upgrade', 'Upgrade'], ['patronTokens', 'Patron']].map(([k, lbl]) => (
            <div key={k} className="token-box">
              <div className="token-box-label">{lbl}</div>
              <div className="token-box-val">{state.tokens?.[k] || 0}</div>
              <div className="token-btns">
                <button className="btn btn-danger btn-xs" onClick={() => adjustToken(k, -1)}>−</button>
                <button className="btn btn-success btn-xs" onClick={() => adjustToken(k, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <hr className="divider" />
        <div className="section-label">Boss Tokens</div>
        <div className="boss-tokens-grid">
          {(state.tokens?.bossTokens || []).map(t => (
            <div key={t.id} className={`boss-token t-${t.tier}${t.used ? ' used' : ''}`} onClick={() => toggleBossToken(t.id)}>
              {t.tier[0].toUpperCase()}
              <button className="boss-token-rm" onClick={e => { e.stopPropagation(); rmBossToken(t.id); }}>✕</button>
            </div>
          ))}
        </div>
        <div className="row gap-sm" style={{ marginTop: 8 }}>
          <select className="mini-select" value={tokenForm.tier} onChange={e => setTokenForm({ tier: e.target.value })}>
            {BOSS_TIERS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <button className="btn btn-cyan btn-sm" onClick={addBossToken}>+ Boss Token</button>
        </div>
      </div>
    </>
  );
}
