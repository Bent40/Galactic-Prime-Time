import { useState, useRef } from 'react';
import { ALL_TRAITS, BODY_TRAITS, TRAIT_LABELS, RACES } from '../../constants.js';
import { uid, dmgClass, traitTotal as traitTotalOf, capBonus, effectiveMaxHp } from '../../constants.js';

function CondAddForm({ onAdd, onCancel }) {
  const [text, setText] = useState('');
  const [tier, setTier] = useState('1');
  return (
    <div className="cond-add-form">
      <input className="fi" style={{ flex: 1, fontSize: 11, padding: '3px 6px' }} placeholder="Condition name" value={text} onChange={e => setText(e.target.value)} autoFocus />
      <select className="mini-select" value={tier} onChange={e => setTier(e.target.value)}>
        <option value="1">T1</option><option value="2">T2</option><option value="3">T3</option><option value="4">T4</option>
      </select>
      <button className="btn btn-success btn-xs" onClick={() => onAdd(text, tier)}>Add</button>
      <button className="btn btn-muted btn-xs" onClick={onCancel}>✕</button>
    </div>
  );
}

export default function BodyTab({ state, update }) {
  const portraitRef = useRef();
  const [condForms, setCondForms] = useState({});
  const id = state.identity;

  function patchId(k, v) { update(s => ({ ...s, identity: { ...s.identity, [k]: v } })); }

  function patchBP(bpId, k, v) {
    update(s => ({ ...s, bodyParts: s.bodyParts.map(b => b.id === bpId ? { ...b, [k]: v } : b) }));
  }
  function addCondition(bpId, text, tier) {
    if (!text.trim()) return;
    update(s => ({ ...s, bodyParts: s.bodyParts.map(b =>
      b.id === bpId ? { ...b, conditions: [...(b.conditions || []), { id: uid(), text, tier: +tier }] } : b
    ) }));
  }
  function rmCondition(bpId, cId) {
    update(s => ({ ...s, bodyParts: s.bodyParts.map(b =>
      b.id === bpId ? { ...b, conditions: b.conditions.filter(c => c.id !== cId) } : b
    ) }));
  }
  function addBodyPart() {
    update(s => ({ ...s, bodyParts: [...s.bodyParts, { id: uid(), name: 'New Part', baseHp: 3, maxHp: 3, currentHp: 3, lethal: false, conditions: [] }] }));
  }
  function setBaseHp(bpId, v) {
    const val = Math.max(0, v);
    // baseHp is canonical; maxHp kept in sync so no consumer ever reads a stale value
    update(s => ({ ...s, bodyParts: s.bodyParts.map(b => b.id === bpId ? { ...b, baseHp: val, maxHp: val } : b) }));
  }
  function rmBodyPart(bpId) { update(s => ({ ...s, bodyParts: s.bodyParts.filter(b => b.id !== bpId) })); }

  function adjustPhysRes(key, delta) {
    const scb = state.statCapBonuses || {};
    const pEarned = capBonus(state, 'reflexes');
    const pSpent = (scb.bleed || 0) + (scb.crush || 0) + (scb.burn || 0);
    const current = scb[key] || 0;
    if (delta > 0 && pSpent >= pEarned) return;
    if (delta < 0 && current <= 0) return;
    update(s => ({ ...s, statCapBonuses: { ...s.statCapBonuses, [key]: Math.max(0, current + delta) } }));
  }

  function traitTotal(t) { return traitTotalOf(state, t); }
  function isBodyTrait(t) { return BODY_TRAITS.includes(t); }
  function traitPool(t) { return isBodyTrait(t) ? 'body' : 'core'; }

  function adjustBonus(t, delta) {
    const pool = traitPool(t);
    const available = state.bonusPoints[pool] || 0;
    const current = state.traits?.[t]?.bonus || 0;
    if (delta > 0 && available <= 0) return;
    if (delta < 0 && current <= 0) return;
    const maxKey = pool === 'body' ? 'bodyMax' : 'coreMax';
    const ceiling = state.bonusPoints?.[maxKey] ?? 5;
    update(s => ({
      ...s,
      traits: { ...s.traits, [t]: { ...(s.traits[t] || {}), bonus: (s.traits[t]?.bonus || 0) + delta } },
      bonusPoints: { ...s.bonusPoints, [pool]: Math.min(ceiling, (s.bonusPoints[pool] || 0) - delta) },
    }));
  }
  function investLevel(t) {
    if ((state.levelPoints?.pool || 0) <= 0) return;
    update(s => ({
      ...s,
      traits: { ...s.traits, [t]: { ...(s.traits[t] || {}), levelBonus: (s.traits[t]?.levelBonus || 0) + 1 } },
      levelPoints: { ...s.levelPoints, pool: Math.max(0, (s.levelPoints?.pool || 0) - 1) },
    }));
  }

  function setShockTier(tier) {
    const current = state.shock?.tier ?? 0;
    update(s => ({ ...s, shock: { ...s.shock, tier: current === tier ? 0 : tier } }));
  }

  function addEffect() {
    const text = prompt('New effect:');
    if (!text) return;
    update(s => ({ ...s, effects: [...(s.effects || []), { id: uid(), text }] }));
  }
  function rmEffect(eId) { update(s => ({ ...s, effects: s.effects.filter(e => e.id !== eId) })); }

  function toggleCondForm(bpId) { setCondForms(f => ({ ...f, [bpId]: !f[bpId] })); }

  const bodyPts = state.bonusPoints?.body ?? 0;
  const corePts = state.bonusPoints?.core ?? 0;
  const lvlPool = state.levelPoints?.pool ?? 0;
  const isLevelOne = (id.level || 1) <= 1;

  const hpBonus       = capBonus(state, 'physique');
  const physResEarned = capBonus(state, 'reflexes');
  const dissolution   = capBonus(state, 'mind');
  const scb = state.statCapBonuses || {};
  const physResSpent  = (scb.bleed || 0) + (scb.crush || 0) + (scb.burn || 0);
  const physResRemain = Math.max(0, physResEarned - physResSpent);

  return (
    <>
      {/* Identity */}
      <div className="panel">
        <div className="panel-title">Contestant Identity</div>
        <div className="identity-row">
          <div>
            <div className="portrait-box" onClick={() => portraitRef.current.click()}>
              {id.portrait ? <img src={id.portrait} alt="portrait" /> : '👤'}
            </div>
            <input ref={portraitRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
              const f = e.target.files[0]; if (!f) return;
              const rd = new FileReader();
              rd.onload = ev => patchId('portrait', ev.target.result);
              rd.readAsDataURL(f);
            }} />
          </div>
          <div className="identity-fields">
            <div className="field-group">
              <label className="field-label">Character Name</label>
              <input className="fi" value={id.name} onChange={e => patchId('name', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Player Name</label>
              <input className="fi" value={id.player} onChange={e => patchId('player', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Race</label>
              <select className="fi" value={id.race} onChange={e => patchId('race', e.target.value)}>
                {RACES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">Level</label>
              <input className="fi" type="number" value={id.level} readOnly disabled />
            </div>
            <div className="field-group" style={{ gridColumn: '1 / -1' }}>
              <label className="field-label">Background</label>
              <input className="fi" value={id.background} onChange={e => patchId('background', e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Contestant #</label>
              <input className="fi" value={id.contestantNumber} onChange={e => patchId('contestantNumber', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Traits */}
      <div className="panel">
        <div className="panel-title">
          Traits
          <div className="row gap-sm" style={{ fontWeight: 'normal' }}>
            {isLevelOne && <span className={`pts-badge${bodyPts === 0 ? ' empty' : bodyPts <= 2 ? ' warn' : ''}`}>BODY {bodyPts} pts</span>}
            {isLevelOne && <span className={`pts-badge${corePts === 0 ? ' empty' : corePts <= 2 ? ' warn' : ''}`}>CORE {corePts} pts</span>}
            {lvlPool > 0 && <span className="pts-badge warn">▲ {lvlPool} Lv pts to spend</span>}
          </div>
        </div>
        <div className="traits-grid">
          {ALL_TRAITS.map(t => {
            const total = traitTotal(t);
            const base = state.traits?.[t]?.base || 0;
            const bonus = state.traits?.[t]?.bonus || 0;
            const lbonus = state.traits?.[t]?.levelBonus || 0;
            const pool = traitPool(t);
            const poolAv = state.bonusPoints[pool] || 0;
            const lvlAv = state.levelPoints?.pool || 0;
            return (
              <div key={t} className="trait-card">
                <div className="trait-name">{TRAIT_LABELS[t]}</div>
                <div className="trait-sub">{isBodyTrait(t) ? 'Body' : 'Core'}</div>
                <div className="trait-val">{total}</div>
                {isLevelOne && (
                  <div className="trait-controls">
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => adjustBonus(t, -1)} disabled={bonus <= 0}>−</button>
                    <span className="trait-bonus-display">Base {base}{bonus > 0 ? ` +${bonus}` : ''}{lbonus > 0 ? ` +${lbonus}Lv` : ''}</span>
                    <button className="btn btn-cyan btn-icon btn-sm" onClick={() => adjustBonus(t, 1)} disabled={poolAv <= 0}>+</button>
                  </div>
                )}
                {!isLevelOne && (bonus > 0 || lbonus > 0) && (
                  <div className="trait-bonus-display" style={{ textAlign: 'center', fontSize: 9, color: 'var(--muted)' }}>
                    Base {base}{bonus > 0 ? ` +${bonus}` : ''}{lbonus > 0 ? ` +${lbonus}Lv` : ''}
                  </div>
                )}
                {lvlAv > 0 && (
                  <div className="trait-sp">
                    <button className="btn btn-gold btn-xs" onClick={() => investLevel(t)}>+ Spend</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Body Parts */}
      <div className="panel">
        <div className="panel-title">
          Body Parts
          <button className="btn btn-cyan btn-sm" onClick={addBodyPart}>+ Part</button>
        </div>
        <div className="body-parts-grid">
          {state.bodyParts.map(bp => {
            const baseHp = bp.baseHp ?? bp.maxHp;
            const effectiveMax = effectiveMaxHp(bp, state);
            const cls = dmgClass(bp.currentHp, effectiveMax);
            const boxes = Array.from({ length: effectiveMax }, (_, i) => i >= bp.currentHp);
            return (
              <div key={bp.id} className={`bp-card${cls ? ' ' + cls : ''}`}>
                <div className="bp-header">
                  <input className="bp-name-input" value={bp.name} onChange={e => patchBP(bp.id, 'name', e.target.value)} />
                  <label className="lethal-toggle">
                    <input type="checkbox" checked={!!bp.lethal} onChange={e => patchBP(bp.id, 'lethal', e.target.checked)} />
                    LETHAL
                  </label>
                  <button className="btn btn-danger btn-xs" onClick={() => rmBodyPart(bp.id)}>✕</button>
                </div>
                <div className="hp-row">
                  <span className="hp-label">HP</span>
                  <input className="hp-max-input" type="number" min="0" value={baseHp}
                    title={hpBonus > 0 ? `Base ${baseHp} + ${hpBonus} Physique = ${effectiveMax}` : undefined}
                    onChange={e => setBaseHp(bp.id, +e.target.value)} />
                  {hpBonus > 0 && <span style={{ fontSize: 9, color: 'var(--cyan)', marginLeft: 2 }}>+{hpBonus}</span>}
                  <div className="hp-boxes">
                    {boxes.map((isDmg, i) => (
                      <div key={i} className={`hp-box${isDmg ? ' dmg' : ''}`}
                        onClick={() => {
                          const newBoxes = [...boxes]; newBoxes[i] = !newBoxes[i];
                          const currentHp = effectiveMax - newBoxes.filter(Boolean).length;
                          patchBP(bp.id, 'currentHp', currentHp);
                        }} />
                    ))}
                  </div>
                </div>
                <div className="cond-list">
                  {(bp.conditions || []).map(c => (
                    <span key={c.id} className={`cond-badge cond-t${c.tier}`}>
                      {c.text}
                      <button className="cond-remove" onClick={() => rmCondition(bp.id, c.id)}>✕</button>
                    </span>
                  ))}
                </div>
                {condForms[bp.id] ? (
                  <CondAddForm
                    onAdd={(txt, tier) => { addCondition(bp.id, txt, tier); toggleCondForm(bp.id); }}
                    onCancel={() => toggleCondForm(bp.id)}
                  />
                ) : (
                  <button className="btn btn-muted btn-xs" onClick={() => toggleCondForm(bp.id)}>+ Condition</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Shock Tier Tracker */}
      <div className="panel">
        <div className="panel-title">Shock</div>
        <div className="shock-tracker">
          {[
            { tier: 1, label: 'Shout',    color: '#ffdd00', shadow: 'rgba(255,221,0,.35)' },
            { tier: 2, label: 'Stutter',  color: '#ff8800', shadow: 'rgba(255,136,0,.35)' },
            { tier: 3, label: 'Faint',    color: 'var(--danger)', shadow: 'rgba(255,34,85,.35)' },
            { tier: 4, label: 'Helpless', color: 'var(--danger)', shadow: 'rgba(255,34,85,.6)' },
          ].map(({ tier, label, color, shadow }) => {
            const active = (state.shock?.tier ?? 0) >= tier;
            const current = (state.shock?.tier ?? 0) === tier;
            return (
              <button
                key={tier}
                className={`shock-tier-btn${active ? ' active' : ''}${current ? ' current' : ''}`}
                style={active ? { '--shock-color': color, '--shock-shadow': shadow } : {}}
                onClick={() => setShockTier(tier)}
              >
                <span className="shock-tier-num">T{tier}</span>
                <span className="shock-tier-label">{label}</span>
              </button>
            );
          })}
          <div className="shock-clear-col">
            <button
              className="btn btn-muted btn-xs"
              style={{ opacity: (state.shock?.tier ?? 0) === 0 ? 0.35 : 1 }}
              onClick={() => update(s => ({ ...s, shock: { ...s.shock, tier: 0 } }))}
            >
              Clear
            </button>
            {(state.shock?.tier ?? 0) === 0 && (
              <span className="shock-none-label">No Shock</span>
            )}
          </div>
        </div>
      </div>

      {/* Resistance Display */}
      <div className="panel">
        <div className="panel-title">Resistances</div>
        <div className="resist-grid">
          {/* Physical — player allocates earned points from Reflexes */}
          <div className="resist-group">
            <div className="resist-group-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Physical
              {physResEarned > 0 && (
                <span style={{ fontSize: 9, color: physResRemain > 0 ? 'var(--cyan)' : 'var(--muted)', fontWeight: 700 }}>
                  {physResRemain}/{physResEarned} pts
                </span>
              )}
            </div>
            {[{ key: 'bleed', label: 'Bleed' }, { key: 'crush', label: 'Crush' }, { key: 'burn', label: 'Burn' }].map(({ key, label }) => {
              const val = scb[key] || 0;
              return (
                <div key={key} className="resist-row">
                  <span className="resist-label">{label}</span>
                  {physResEarned > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button className="btn btn-danger btn-icon btn-xs" onClick={() => adjustPhysRes(key, -1)} disabled={val <= 0}>−</button>
                      <span className={`resist-val flat${val > 0 ? ' has-val' : ''}`}>{val > 0 ? `−${val}` : '—'}</span>
                      <button className="btn btn-cyan btn-icon btn-xs" onClick={() => adjustPhysRes(key, 1)} disabled={physResRemain <= 0}>+</button>
                    </div>
                  ) : (
                    <span className={`resist-val flat${val > 0 ? ' has-val' : ''}`}>{val > 0 ? `−${val}` : '—'}</span>
                  )}
                </div>
              );
            })}
          </div>
          {/* Affliction — admin-controlled */}
          <div className="resist-group">
            <div className="resist-group-label">Affliction</div>
            {[{ key: 'chill', label: 'Chill' }, { key: 'poison', label: 'Poison' }, { key: 'infection', label: 'Infection' }].map(({ key, label }) => {
              const val = scb[key] ?? 0;
              return (
                <div key={key} className="resist-row">
                  <span className="resist-label">{label}</span>
                  <span className={`resist-val tier${val > 0 ? ' has-val' : ''}`}>{val > 0 ? `T${val} Immune` : '—'}</span>
                </div>
              );
            })}
          </div>
          {/* Psychic — auto-computed from Mind */}
          <div className="resist-group">
            <div className="resist-group-label">Psychic</div>
            <div className="resist-row">
              <span className="resist-label">Dissolution</span>
              <span className={`resist-val tier${dissolution > 0 ? ' has-val' : ''}`}>{dissolution > 0 ? `T${dissolution} Immune` : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forced Action Consequences */}
      <div className="panel">
        <div className="panel-title">Forced Action Consequences</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div className="section-label" style={{ marginBottom: 8 }}>Body</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                ['Tear Something', 'You take 1 damage to the relevant body part. If at 0 HP, the condition escalates.'],
                ['Lock-Up', 'The body part is unusable for the next 3 Moments.'],
                ['Condition Surge', 'Advance one active condition by 1 clock. Prioritizes conditions responsible for the forced action. If no active condition exists, apply Shock Tier 1 instead.'],
                ['Drop', 'Drop the item held in the limb involved in the action. If no specific limb is responsible, choose one hand to drop its item.'],
                ['Shock Spike', 'Increase Shock by 1 tier.'],
                ['Stumble', 'You become exposed until your next moment.'],
              ].map(([name, desc]) => (
                <div key={name} style={{ padding: '6px 8px', background: 'rgba(0,0,0,.2)', borderLeft: '2px solid var(--danger)', borderRadius: 3 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--danger)', letterSpacing: 1, marginBottom: 2 }}>{name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.4 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="section-label" style={{ marginBottom: 8 }}>Tool</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                ['Whiff', 'The action fails to meaningfully impact its intended target.'],
                ['Overcommit', 'You become exposed.'],
                ['Collateral', 'Ally, object or environment affected.'],
                ['Slip', 'You are unarmed until your next moment.'],
                ['Strained Grip', '+1 Moment cost on your next action with the tool.'],
                ['Overextension', 'Your next scheduled action is delayed by 1 additional Moment.'],
              ].map(([name, desc]) => (
                <div key={name} style={{ padding: '6px 8px', background: 'rgba(0,0,0,.2)', borderLeft: '2px solid var(--gold)', borderRadius: 3 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold)', letterSpacing: 1, marginBottom: 2 }}>{name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.4 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Effects */}
      <div className="panel">
        <div className="panel-title">
          Active Effects
          <button className="btn btn-cyan btn-sm" onClick={addEffect}>+</button>
        </div>
        <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
          {(state.effects || []).map(e => (
            <span key={e.id} className="effect-chip">
              {e.text}
              <button className="chip-rm" onClick={() => rmEffect(e.id)}>✕</button>
            </span>
          ))}
          {(!state.effects || state.effects.length === 0) && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No active effects</span>}
        </div>
      </div>

    </>
  );
}
