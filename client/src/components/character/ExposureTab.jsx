import { useState, useRef, useMemo, useEffect } from 'react';
import { uid, capBonus } from '../../constants.js';
import { apiFetch } from '../../api.js';


export default function ExposureTab({ state, update, token }) {
  const portraitRefs = useRef([null, null, null]);
  const [tagSearch, setTagSearch] = useState('');
  const [tagPickerOpen, setTagPickerOpen] = useState(false);
  const [masterTags, setMasterTags] = useState([]);

  useEffect(() => {
    apiFetch('/api/tags', {}, token).then(d => { if (Array.isArray(d)) setMasterTags(d); });
  }, [token]);

  function patchExposure(k, v) { update(s => ({ ...s, exposure: { ...s.exposure, [k]: v } })); }

  // Rulebook 18.4 — a Mark has no lifecycle. It is always present; clicking it
  // toggles whether the current scene has woken it.
  function cycleTag(id) {
    const cycle = ['active', 'reinforced', 'faded'];
    update(s => ({
      ...s,
      tags: s.tags.map(t => {
        if (t.id !== id) return t;
        if (t.kind === 'mark') return { ...t, state: t.state === 'lit' ? 'dormant' : 'lit' };
        return { ...t, state: cycle[(cycle.indexOf(t.state) + 1) % cycle.length] };
      }),
    }));
  }
  // A Mark cannot be shed (18.4). The GM removes one from the admin panel if a
  // data fix is ever needed.
  function rmTag(id) {
    update(s => ({ ...s, tags: s.tags.filter(t => !(t.id === id && t.kind !== 'mark')) }));
  }
  function addTagFromMaster(master) {
    const isMark = master.kind === 'mark';
    update(s => ({ ...s, tags: [...(s.tags || []), {
      id: uid(),
      name: master.name,
      state: isMark ? 'dormant' : 'active',
      effect: master.effect || '',
      ...(isMark ? { kind: 'mark', activeNear: master.activeNear || '' } : {}),
    }] }));
    setTagSearch('');
    setTagPickerOpen(false);
  }

  const filteredMaster = useMemo(() => {
    const q = tagSearch.trim().toLowerCase();
    const owned = new Set((state.tags || []).map(t => t.name.toLowerCase()));
    return masterTags
      // Marks are granted by the deed, never picked off a list (18.4).
      .filter(t => t.kind !== 'mark')
      .filter(t => !owned.has(t.name.toLowerCase()))
      .filter(t => !q || t.name.toLowerCase().includes(q) || (t.effect || '').toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
  }, [tagSearch, state.tags, masterTags]);

  const masterDesc = useMemo(() => {
    const m = {};
    masterTags.forEach(t => { if (t.description) m[t.name.toLowerCase()] = t.description; });
    return m;
  }, [masterTags]);

  function patchPatron(rank, k, v) {
    update(s => ({ ...s, patrons: s.patrons.map(p => p.rank === rank ? { ...p, [k]: v } : p) }));
  }

  function adjustToken(k, delta) { update(s => ({ ...s, tokens: { ...s.tokens, [k]: Math.max(0, (s.tokens[k] || 0) + delta) } })); }

  const rankLabel = ['', '🥇 Top Patron', '🥈 2nd Patron', '🥉 3rd Patron'];
  const rankClass = ['', 'r1', 'r2', 'r3'];

  const cameraCallEarned = capBonus(state, 'charm');
  const cameraCallUsed = state.cameraCallUsed || 0;
  const cameraCallAvail = Math.max(0, cameraCallEarned - cameraCallUsed);

  return (
    <>
      {/* Camera Call */}
      {cameraCallEarned > 0 && (
        <div className="panel">
          <div className="panel-title">Camera Call</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: cameraCallEarned }, (_, i) => {
                const used = i >= cameraCallAvail;
                return (
                  <div key={i} style={{
                    width: 28, height: 28, borderRadius: 4, border: `2px solid ${used ? 'var(--border)' : 'var(--gold)'}`,
                    background: used ? 'transparent' : 'rgba(200,168,75,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, color: used ? 'var(--muted)' : 'var(--gold)',
                  }}>
                    {used ? '✕' : '★'}
                  </div>
                );
              })}
            </div>
            <span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>
              {cameraCallAvail}/{cameraCallEarned} available
            </span>
            <button
              className="btn btn-gold btn-sm"
              disabled={cameraCallAvail <= 0}
              onClick={() => update(s => ({ ...s, cameraCallUsed: (s.cameraCallUsed || 0) + 1 }))}
            >
              Use Stack
            </button>
            {cameraCallUsed > 0 && (
              <button
                className="btn btn-muted btn-sm"
                onClick={() => update(s => ({ ...s, cameraCallUsed: 0 }))}
              >
                Reset (New Session)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Exposure Counters */}
      <div className="panel">
        <div className="panel-title">Exposure Metrics</div>
        <div className="exposure-counters">
          {['viewers', 'followers'].map(k => (
            <div key={k} className="exp-counter">
              <div className="exp-counter-label">{k === 'viewers' ? 'Viewers' : 'Followers'}</div>
              <div className="exp-counter-val" style={{ fontSize: 18 }}>{state.exposure?.[k] || '0'}</div>
              <input
                className="fi"
                style={{ marginTop: 6, textAlign: 'center', fontSize: 13, letterSpacing: 1 }}
                placeholder="e.g. 1.5B, 200.6T"
                defaultValue={state.exposure?.[k] || ''}
                key={state.exposure?.[k]}
                onBlur={e => { const val = e.target.value.trim(); if (val) patchExposure(k, val); }}
                onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="panel">
        <div className="panel-title">Tags</div>
        <div className="tags-wrap">
          {(state.tags || []).filter(t => t.kind !== 'mark').map(tag => (
            <div key={tag.id} className={`tag-chip ${tag.state || 'active'}`} title={masterDesc[tag.name.toLowerCase()] || undefined}>
              <div className="tag-chip-top" onClick={() => cycleTag(tag.id)}>
                <span className="tag-chip-name">{tag.name}</span>
                <span className="tag-state-lbl">{tag.state || 'active'}</span>
                <button className="tag-chip-rm" onClick={e => { e.stopPropagation(); rmTag(tag.id); }}>✕</button>
              </div>
              {tag.effect && <div className="tag-chip-effect">{tag.effect}</div>}
            </div>
          ))}
          {(state.tags || []).filter(t => t.kind !== 'mark').length === 0 && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No tags.</span>}
        </div>
        <div style={{ marginTop: 8 }}>
          {!tagPickerOpen ? (
            <button className="btn btn-cyan btn-sm" onClick={() => setTagPickerOpen(true)}>+ Add Tag</button>
          ) : (
            <div style={{ border: '1px solid var(--border)', borderRadius: 4, background: 'rgba(0,0,0,.25)', padding: 8 }}>
              <div className="row" style={{ gap: 6, marginBottom: 6 }}>
                <input
                  className="fi"
                  style={{ flex: 1 }}
                  placeholder="Search tags..."
                  value={tagSearch}
                  onChange={e => setTagSearch(e.target.value)}
                  autoFocus
                />
                <button className="btn btn-muted btn-sm" onClick={() => { setTagPickerOpen(false); setTagSearch(''); }}>Cancel</button>
              </div>
              <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {filteredMaster.map(t => (
                  <div
                    key={t.name}
                    onClick={() => addTagFromMaster(t)}
                    style={{ padding: '6px 10px', cursor: 'pointer', borderRadius: 3, border: '1px solid var(--border)', background: 'rgba(0,0,0,.2)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,.2)'}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan)', letterSpacing: 1 }}>{t.name}</div>
                    {t.description && <div style={{ fontSize: 10, color: 'var(--text)', opacity: 0.8, marginTop: 2, lineHeight: 1.35 }}>{t.description}</div>}
                    {t.effect && <div style={{ fontSize: 10, color: 'var(--gold)', marginTop: 2 }}>{t.effect}</div>}
                  </div>
                ))}
                {filteredMaster.length === 0 && (
                  <span style={{ color: 'var(--muted)', fontSize: 11, padding: '6px 4px', fontStyle: 'italic' }}>
                    {tagSearch ? 'No matching tags.' : 'All master tags are already on your sheet.'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Marks — rulebook 18.4 */}
      <div className="panel">
        <div className="panel-title">Marks</div>
        <div className="tags-wrap">
          {(state.tags || []).filter(t => t.kind === 'mark').map(mark => (
            <div
              key={mark.id}
              className={`tag-chip mark ${mark.state === 'lit' ? 'lit' : 'dormant'}`}
              title={masterDesc[mark.name.toLowerCase()] || undefined}
            >
              <div className="tag-chip-top" onClick={() => cycleTag(mark.id)}>
                <span className="tag-chip-name">{mark.name}</span>
                <span className="tag-state-lbl">{mark.state === 'lit' ? 'lit' : 'dormant'}</span>
              </div>
              {mark.activeNear && <div className="tag-chip-effect">Stirs near: {mark.activeNear}</div>}
            </div>
          ))}
          {(state.tags || []).filter(t => t.kind === 'mark').length === 0 && (
            <span style={{ color: 'var(--muted)', fontSize: 11 }}>Unmarked.</span>
          )}
        </div>
        <div style={{ marginTop: 8, fontSize: 10, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.4 }}>
          A Mark is burned into you by something you did. It does not fade and it cannot be
          removed. Click one when a scene wakes it.
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
      </div>
    </>
  );
}
