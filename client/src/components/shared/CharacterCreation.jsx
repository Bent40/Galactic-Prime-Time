import { useState, useEffect, useMemo } from 'react';
import {
  CREATION_RACES, SIZES, SIZE_BASE_HP, bodyPartsForSize,
  DEFAULT_STATE, BODY_TRAITS, CORE_TRAITS, TRAIT_LABELS,
  startingSkillQuota, startingSkillPools, startingSkillPool, uid,
} from '../../constants.js';
import { apiFetch } from '../../api.js';

/**
 * Character creation — shown once, when a registered user has no character yet.
 *
 * Before this existed, registering dropped you straight onto a blank nine-tab
 * sheet: no name, every trait at 1, ten unspent bonus points and a Medium body
 * whatever you actually were. Every one of those had to be fixed by hand.
 *
 * Three steps, each one a rule that already exists:
 *   1. IDENTITY   — §2.1
 *   2. BODY       — §7.1 size sets base part HP (ruled 2026-09-15). This is the
 *                   step that could not be skipped: DEFAULT_STATE hardcodes a
 *                   Medium body, so a Small contestant started with 17 body HP
 *                   instead of 11.
 *   3. ALLOCATION — §2.2, the ten bonus points: 5 Body (Physique/Reflexes) and
 *                   5 Core (Mind/Charm), on top of 1 in each trait. Four base
 *                   plus ten is the 14 creation points the level budget assumes.
 *   4. SKILLS     — owner ruling 2026-09-19. A Human picks 4 skills not locked to
 *                   another race; an Animal picks 2 of those plus 2 of its own.
 *                   BASIC skills only — a compound is a Gemstone merge product
 *                   (§4.5), and you cannot start with the thing you fuse INTO.
 *                   Nothing fits? Suggest one; the GM approves it.
 *
 * It writes the state ONCE on finish and then never appears again. Everything it
 * sets stays editable on the sheet — this is a guided start, not a lock.
 */
const STEPS = 4;

export default function CharacterCreation({ username, token, onDone, onSkip }) {
  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState({
    ...DEFAULT_STATE.identity,
    name: '',
    player: username || '',
  });
  // Spent counts, not remaining — easier to reason about and to render.
  const [spent, setSpent] = useState({ physique: 0, reflexes: 0, mind: 0, charm: 0 });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  // The skill library. null = not fetched yet; [] = fetched and empty.
  const [library, setLibrary] = useState(null);
  const [libErr, setLibErr] = useState('');
  const [picked, setPicked] = useState([]);        // template _ids, in pick order
  const [suggestions, setSuggestions] = useState([]); // free-text, GM approves
  // Per-pool, not shared: one draft string showed the same text in both boxes.
  const [suggestDraft, setSuggestDraft] = useState({ general: '', racial: '' });
  const [skillFilter, setSkillFilter] = useState('');

  // Fetch once, when they first reach the skill step — the first three steps
  // should not wait on a request they may never need.
  useEffect(() => {
    if (step !== 4 || library !== null) return;
    apiFetch('/api/character/skills', {}, token)
      .then(d => {
        if (Array.isArray(d)) setLibrary(d);
        else { setLibrary([]); setLibErr(d?.error || 'Could not load the skill library.'); }
      })
      .catch(() => { setLibrary([]); setLibErr('Could not load the skill library.'); });
  }, [step, library, token]);

  const quota = startingSkillQuota(identity.race);
  // The race decides what a race-locked skill counts as, so a Human is never
  // shown an Animal's skills and neither of them sees a Robot's.
  const pools = useMemo(() => startingSkillPools(library || [], identity.race), [library, identity.race]);
  const byId = useMemo(() => {
    const m = {};
    for (const t of library || []) m[t._id] = t;
    return m;
  }, [library]);

  const pickedIn = (pool) => picked.filter(id => {
    const t = byId[id];
    return t && startingSkillPool(t, identity.race) === pool;
  });
  const suggestedIn = (pool) => suggestions.filter(s => s.pool === pool);
  const filledIn = (pool) => pickedIn(pool).length + suggestedIn(pool).length;
  const roomIn = (pool) => quota[pool] - filledIn(pool);
  const totalWanted = quota.general + quota.racial;
  const totalFilled = picked.length + suggestions.length;

  function togglePick(tpl) {
    // Only ever called on a card drawn from a pool, but a template that is
    // compound or character-exclusive belongs to neither — refuse rather than
    // index quota with null.
    const pool = startingSkillPool(tpl, identity.race);
    if (!pool) return;
    setPicked(p => {
      if (p.includes(tpl._id)) return p.filter(x => x !== tpl._id);
      if (roomIn(pool) <= 0) return p;                  // that pool is full
      return [...p, tpl._id];
    });
  }
  function addSuggestion(pool) {
    const text = (suggestDraft[pool] || '').trim();
    if (!text || roomIn(pool) <= 0) return;
    setSuggestions(s => [...s, { id: uid(), pool, text }]);
    setSuggestDraft(d => ({ ...d, [pool]: '' }));
  }
  const rmSuggestion = (id) => setSuggestions(s => s.filter(x => x.id !== id));

  const BODY_MAX = DEFAULT_STATE.bonusPoints.bodyMax ?? 5;
  const CORE_MAX = DEFAULT_STATE.bonusPoints.coreMax ?? 5;
  const bodySpent = BODY_TRAITS.reduce((a, t) => a + spent[t], 0);
  const coreSpent = CORE_TRAITS.reduce((a, t) => a + spent[t], 0);
  const bodyLeft = BODY_MAX - bodySpent;
  const coreLeft = CORE_MAX - coreSpent;

  const set = (patch) => setIdentity(i => ({ ...i, ...patch }));
  const isBody = (t) => BODY_TRAITS.includes(t);
  const leftFor = (t) => (isBody(t) ? bodyLeft : coreLeft);

  function bump(t, delta) {
    setSpent(s => {
      const next = s[t] + delta;
      if (next < 0) return s;
      if (delta > 0 && leftFor(t) <= 0) return s;
      return { ...s, [t]: next };
    });
  }

  async function finish() {
    setSaving(true);
    setErr('');
    const traits = Object.fromEntries(
      Object.keys(DEFAULT_STATE.traits).map(t => [t, { base: 1 + spent[t], bonus: 0, levelBonus: 0 }])
    );
    // Starting skills arrive at LEVEL 1 with NO spend record. The empty
    // traitCosts is the point: §4's refund path already states that "a level with
    // no spend history refunds nothing", so a free starting level costs no skill
    // points and gives none back. It is your background, not your training budget.
    const skills = picked.map(id => ({
      id: uid(),
      templateId: id,
      level: 1,
      capacity: byId[id]?.capacity || 5,
      traitCosts: [],
    }));
    // A suggestion is not a skill yet — it is a request the GM approves, so it
    // goes where the GM reads, never into the skills array as a fake template.
    const note = suggestions.length
      ? `— SUGGESTED SKILLS (awaiting GM approval) —\n` +
        suggestions.map(s => `• [${s.pool}] ${s.text}`).join('\n') + '\n\n'
      : '';

    // onDone returns an error string, or null on a confirmed save. Stay open on
    // failure — this overlay holds the only copy of what they just built.
    const problem = await onDone({
      ...DEFAULT_STATE,
      identity: { ...identity, name: identity.name.trim() || username || 'Unnamed Contestant' },
      traits,
      // The points are SPENT, so the remaining pools are what is left.
      bonusPoints: { ...DEFAULT_STATE.bonusPoints, body: bodyLeft, core: coreLeft },
      bodyParts: bodyPartsForSize(identity.size),
      skills,
      notes: note + (DEFAULT_STATE.notes || ''),
    });
    if (problem) { setErr(problem); setSaving(false); }
  }

  const hp = SIZE_BASE_HP[identity.size] || SIZE_BASE_HP.Medium;
  const bodyTotal = hp.Head + hp.Torso + 2 * hp.Arm + 2 * hp.Leg;

  return (
    <div className="login-overlay">
      <div className="login-box" style={{ width: 460, maxWidth: '92vw', maxHeight: '88vh', overflowY: 'auto' }}>
        <div className="login-title">⚡ New Contestant — Step {step} of {STEPS}</div>

        {/* ── 1. IDENTITY ────────────────────────────────────────────────── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="field-group">
              <label className="field-label">Contestant name</label>
              <input className="fi" value={identity.name} autoFocus
                     placeholder="What the audience will chant"
                     onChange={e => set({ name: e.target.value })} />
            </div>
            <div className="field-group">
              <label className="field-label">Player</label>
              <input className="fi" value={identity.player} onChange={e => set({ player: e.target.value })} />
            </div>
            <div className="field-group">
              <label className="field-label">Background <span style={{ opacity: .6 }}>— who you were before the abduction</span></label>
              <textarea className="fi" rows={3} value={identity.background}
                        onChange={e => set({ background: e.target.value })} />
            </div>
            <button className="btn btn-cyan" style={{ padding: 9, marginTop: 6 }} onClick={() => setStep(2)}>
              Next — the body
            </button>
          </div>
        )}

        {/* ── 2. BODY: race, species, size ───────────────────────────────── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="field-group">
              <label className="field-label">Race</label>
              <select className="fi" value={identity.race} onChange={e => set({ race: e.target.value })}>
                {CREATION_RACES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">
                Species <span style={{ opacity: .6 }}>— free text (sea lion, cat, K-pop unit…)</span>
              </label>
              <input className="fi" value={identity.species} placeholder={identity.race === 'Human' ? 'Human' : 'e.g. cat'}
                     onChange={e => set({ species: e.target.value })} />
            </div>
            <div className="field-group">
              <label className="field-label">Size <span style={{ opacity: .6 }}>— §7.1, this sets your body</span></label>
              <div style={{ display: 'flex', gap: 6 }}>
                {SIZES.map(sz => (
                  <button key={sz}
                          className={`btn btn-xs ${identity.size === sz ? 'btn-cyan' : ''}`}
                          style={{ flex: 1 }}
                          onClick={() => set({ size: sz })}>{sz}</button>
                ))}
              </div>
            </div>
            <div style={{ border: '1px solid var(--border, #333)', borderRadius: 4, padding: 10, fontSize: 11 }}>
              <div style={{ letterSpacing: 1, opacity: .7, marginBottom: 6 }}>YOUR BODY AT {identity.size.toUpperCase()}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 2 }}>
                <span>Head <span style={{ opacity: .5 }}>(lethal)</span></span><b>{hp.Head}</b>
                <span>Torso <span style={{ opacity: .5 }}>(lethal)</span></span><b>{hp.Torso}</b>
                <span>Arms <span style={{ opacity: .5 }}>(each)</span></span><b>{hp.Arm}</b>
                <span>Legs <span style={{ opacity: .5 }}>(each)</span></span><b>{hp.Leg}</b>
                <span style={{ marginTop: 4, borderTop: '1px solid var(--border, #333)', paddingTop: 4 }}>Total</span>
                <b style={{ marginTop: 4, borderTop: '1px solid var(--border, #333)', paddingTop: 4 }}>{bodyTotal}</b>
              </div>
              <div style={{ marginTop: 8, opacity: .65, lineHeight: 1.45 }}>
                A smaller body goes where a larger one cannot — that is the whole of what size
                buys. Everything else about it is a cost, and the compensation lives in your race.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <button className="btn btn-xs" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-cyan" style={{ flex: 2, padding: 9 }} onClick={() => setStep(3)}>
                Next — spend your points
              </button>
            </div>
          </div>
        )}

        {/* ── 3. ALLOCATION ──────────────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 11, opacity: .7, lineHeight: 1.5 }}>
              Every trait starts at <b>1</b>. You have <b>{BODY_MAX} Body</b> points
              (Physique · Reflexes) and <b>{CORE_MAX} Core</b> points (Mind · Charm) to place.
              You can leave points unspent and place them later on the sheet.
            </div>

            {[['Body', BODY_TRAITS, bodyLeft, BODY_MAX], ['Core', CORE_TRAITS, coreLeft, CORE_MAX]].map(
              ([label, traits, left, max]) => (
                <div key={label} className="field-group">
                  <label className="field-label">
                    {label} <span style={{ opacity: .6 }}>— {left} of {max} left</span>
                  </label>
                  {traits.map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ flex: 1, fontSize: 12 }}>{TRAIT_LABELS[t]}</span>
                      <button className="btn btn-xs" onClick={() => bump(t, -1)} disabled={spent[t] === 0}>−</button>
                      <b style={{ minWidth: 28, textAlign: 'center', fontSize: 14 }}>{1 + spent[t]}</b>
                      <button className="btn btn-xs" onClick={() => bump(t, +1)} disabled={left <= 0}>+</button>
                    </div>
                  ))}
                </div>
              )
            )}

            <div style={{ fontSize: 11, opacity: .7 }}>
              Total trait points: <b>{4 + bodySpent + coreSpent}</b> of 14
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <button className="btn btn-xs" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-cyan" style={{ flex: 2, padding: 9 }} onClick={() => setStep(4)}>
                Next — what you can do
              </button>
            </div>
          </div>
        )}

        {/* ── 4. SKILLS ──────────────────────────────────────────────────── */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 11, opacity: .7, lineHeight: 1.5 }}>
              {identity.race === 'Animal'
                ? <>You pick <b>{quota.general} general</b> skills and <b>{quota.racial} {identity.race}</b> skills —
                   things this body can do that a human's cannot.</>
                : <>You pick <b>{quota.general} skills</b>, none of them locked to another race's body.</>}
              {' '}Basic skills only. If nothing here matches what you already know how to do,
              <b> suggest it</b> and the GM will rule on it.
            </div>

            {library === null && <div style={{ fontSize: 11, opacity: .6 }}>Loading the skill library…</div>}
            {libErr && <div className="login-err">{libErr}</div>}

            {library !== null && (
              <>
                <input className="fi" placeholder="Filter skills…" value={skillFilter}
                       onChange={e => setSkillFilter(e.target.value)} />

                {['general', 'racial'].filter(pool => quota[pool] > 0).map(pool => {
                  const want = quota[pool];
                  const have = filledIn(pool);
                  const list = pools[pool].filter(t =>
                    !skillFilter || t.name.toLowerCase().includes(skillFilter.toLowerCase()));
                  return (
                    <div key={pool} className="field-group">
                      <label className="field-label">
                        {pool === 'racial' ? `${identity.race} skills` : 'General skills'}{' '}
                        <span style={{ opacity: .6, color: have === want ? 'var(--success)' : undefined }}>
                          — {have} of {want} chosen
                        </span>
                      </label>

                      {list.length === 0 && (
                        <div style={{ fontSize: 11, opacity: .6, padding: '4px 0' }}>
                          {pools[pool].length === 0
                            ? <>Nothing in the library is marked as {pool === 'racial' ? `a ${identity.race} skill` : 'a general skill'} yet — use the suggestion box below.</>
                            : <>No match for “{skillFilter}”.</>}
                        </div>
                      )}

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxHeight: 170, overflowY: 'auto' }}>
                        {list.map(t => {
                          const on = picked.includes(t._id);
                          const full = !on && roomIn(pool) <= 0;
                          return (
                            <button key={t._id}
                                    className={`btn btn-xs ${on ? 'btn-cyan' : ''}`}
                                    disabled={full}
                                    title={[t.stats?.join(' · '), t.momentCost, t.effect].filter(Boolean).join(' — ')}
                                    onClick={() => togglePick(t)}>
                              {on ? '✓ ' : ''}{t.name}
                            </button>
                          );
                        })}
                      </div>

                      {suggestedIn(pool).map((s) => (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 11 }}>
                          <span style={{ flex: 1, fontStyle: 'italic', opacity: .8 }}>“{s.text}” — for the GM to rule on</span>
                          <button className="btn btn-danger btn-xs" onClick={() => rmSuggestion(s.id)}>✕</button>
                        </div>
                      ))}

                      {roomIn(pool) > 0 && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                          <input className="fi" style={{ flex: 1 }} value={suggestDraft[pool] || ''}
                                 placeholder={`Suggest ${pool === 'racial' ? `a ${identity.race}` : 'a'} skill…`}
                                 onChange={e => setSuggestDraft(d => ({ ...d, [pool]: e.target.value }))}
                                 onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSuggestion(pool); } }} />
                          <button className="btn btn-xs" disabled={!(suggestDraft[pool] || '').trim()}
                                  onClick={() => addSuggestion(pool)}>Suggest</button>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div style={{ fontSize: 11, opacity: .7 }}>
                  Chosen: <b>{totalFilled}</b> of {totalWanted}
                  {totalFilled < totalWanted &&
                    <span style={{ opacity: .7 }}> — you can enter with fewer and add the rest later.</span>}
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <button className="btn btn-xs" style={{ flex: 1 }} onClick={() => setStep(3)}>← Back</button>
              <button className="btn btn-gold" style={{ flex: 2, padding: 9 }} onClick={finish} disabled={saving}>
                {saving ? 'Entering…' : 'Enter the Arena'}
              </button>
            </div>
          </div>
        )}

        {err && <div className="login-err">{err}</div>}

        <div className="login-toggle" onClick={onSkip}>
          Skip — I'll fill the sheet in myself
        </div>
      </div>
    </div>
  );
}
