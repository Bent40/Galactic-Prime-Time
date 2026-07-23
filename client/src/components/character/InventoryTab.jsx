import { useState, useRef, useEffect } from 'react';
import { uid, catIcon, itemDmgLabel, ATK_TYPES, DMG_TYPES, AFFIX_TIERS, ITEM_TIERS, ITEM_CATS } from '../../constants.js';
import { apiFetch } from '../../api.js';

const AFFIX_TIER_COLOR = {
  Lesser: 'var(--muted)', Normal: 'var(--text)', Higher: 'var(--cyan)',
  Legendary: 'var(--gold)', Mythic: 'var(--purple)', Godly: '#ff6b6b',
};
const ITEM_TIER_COLOR = {
  Crude: 'var(--muted)', Basic: '#8899aa', Quality: 'var(--cyan)',
  Superior: 'var(--gold)', Exceptional: 'var(--purple)',
};

function AffixPicker({ type, affixes, current, onPick, onClear }) {
  const [open, setOpen] = useState(false);
  const TIERS = AFFIX_TIERS;
  const list  = affixes.filter(a => a.type === type);

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: 'var(--muted)', width: 44, textTransform: 'uppercase', letterSpacing: 1 }}>{type}</span>
        {current ? (
          <>
            <span style={{ fontSize: 11, fontWeight: 700, color: AFFIX_TIER_COLOR[current.tier], flex: 1 }}>
              {type === 'prefix' ? current.name + ' …' : '… ' + current.name}
              <span style={{ fontSize: 9, color: 'var(--muted)', marginLeft: 6 }}>[{current.tier}]</span>
            </span>
            <button className="btn btn-muted btn-xs" onClick={() => { setOpen(v => !v); }}>Change</button>
            <button className="btn btn-danger btn-xs" onClick={onClear}>✕</button>
          </>
        ) : (
          <button className="btn btn-muted btn-xs" onClick={() => setOpen(v => !v)}>
            {open ? 'Cancel' : `+ Add ${type}`}
          </button>
        )}
      </div>
      {open && (
        <div style={{ marginTop: 6, maxHeight: 200, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 4, background: 'rgba(0,0,0,.4)' }}>
          {list.length === 0 && (
            <div style={{ padding: '8px 12px', color: 'var(--muted)', fontSize: 10 }}>No {type}es defined by admin yet.</div>
          )}
          {TIERS.map(tier => {
            const items = list.filter(a => a.tier === tier);
            if (items.length === 0) return null;
            return (
              <div key={tier}>
                <div style={{ padding: '4px 10px 2px', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase',
                  color: AFFIX_TIER_COLOR[tier], borderTop: '1px solid var(--border)' }}>{tier}</div>
                {items.map(a => (
                  <div key={a._id}
                    onClick={() => { onPick(a); setOpen(false); }}
                    style={{ padding: '5px 12px', cursor: 'pointer', fontSize: 11,
                      background: current?.affixId === a._id ? 'rgba(168,85,247,.12)' : 'transparent',
                      borderLeft: `2px solid ${AFFIX_TIER_COLOR[a.tier]}` }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = current?.affixId === a._id ? 'rgba(168,85,247,.12)' : 'transparent'}
                  >
                    <span style={{ color: AFFIX_TIER_COLOR[a.tier], fontWeight: 700 }}>
                      {type === 'prefix' ? a.name + ' …' : '… ' + a.name}
                    </span>
                    {a.effects && <span style={{ color: 'var(--gold)', fontSize: 10, marginLeft: 8 }}>{a.effects}</span>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ItemPopup({ item, catId, cats, affixes, onClose, onUpdate, onDelete, onMove }) {
  const [local, setLocal] = useState({ ...item });
  function patch(k, v) { setLocal(l => ({ ...l, [k]: v })); }
  function toggleAtkType(t) {
    setLocal(l => { const arr = l.attackTypes || []; return { ...l, attackTypes: arr.includes(t) ? arr.filter(x => x !== t) : [...arr, t] }; });
  }
  function toggleDmgType(t) {
    setLocal(l => { const arr = l.damageType || []; return { ...l, damageType: arr.includes(t) ? arr.filter(x => x !== t) : [...arr, t] }; });
  }
  function pickAffix(type, a) {
    patch(type, { affixId: a._id, name: a.name, tier: a.tier, effects: a.effects, description: a.description });
  }
  function save() { onUpdate(catId, local); onClose(); }

  const icon = local.icon || catIcon(local.category || 'default');
  const otherCats = cats.filter(c => c.id !== catId);

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-title">
          <span className="modal-title-icon">{icon}</span>
          <input className="fi" style={{ flex: 1, fontSize: 16, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', background: 'transparent', border: 'none', borderBottom: '1px solid var(--muted)', borderRadius: 0, padding: '2px 4px' }}
            value={local.name} onChange={e => patch('name', e.target.value)} />
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-grid3" style={{ marginBottom: 10 }}>
          <div className="field-group">
            <label className="field-label">Icon (emoji)</label>
            <input className="fi" value={local.icon || ''} onChange={e => patch('icon', e.target.value)} placeholder="📦" />
          </div>
          <div className="field-group">
            <label className="field-label">Category</label>
            <select className="fi" value={local.category || ''} onChange={e => patch('category', e.target.value)}>
              <option value="">—</option>
              {ITEM_CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Quantity</label>
            <div className="modal-qty-row">
              <button className="btn btn-danger btn-icon btn-sm" onClick={() => patch('qty', Math.max(0, (local.qty || 1) - 1))}>−</button>
              <span className="qty-val">{local.qty || 1}</span>
              <button className="btn btn-success btn-icon btn-sm" onClick={() => patch('qty', (local.qty || 1) + 1)}>+</button>
            </div>
          </div>
        </div>

        {/* Uses / Charges */}
        <div className="modal-grid2" style={{ marginBottom: 10 }}>
          <div className="field-group">
            <label className="field-label">Max Uses <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(empty = unlimited)</span></label>
            <input className="fi" type="number" min="1"
              value={local.uses?.max ?? ''}
              onChange={e => {
                const raw = e.target.value;
                const max = raw === '' ? null : Math.max(1, +raw);
                const curr = max == null ? null : Math.min(local.uses?.current ?? max, max);
                patch('uses', { max, current: curr });
              }} />
          </div>
          <div className="field-group">
            <label className="field-label">Current Uses</label>
            {local.uses?.max != null ? (
              <div className="modal-qty-row">
                <button className="btn btn-danger btn-icon btn-sm"
                  disabled={(local.uses?.current ?? 0) <= 0}
                  onClick={() => patch('uses', { ...local.uses, current: Math.max(0, (local.uses?.current ?? 0) - 1) })}>−</button>
                <span className="qty-val">{local.uses?.current ?? 0}/{local.uses.max}</span>
                <button className="btn btn-success btn-icon btn-sm"
                  disabled={(local.uses?.current ?? 0) >= local.uses.max}
                  onClick={() => patch('uses', { ...local.uses, current: Math.min(local.uses.max, (local.uses?.current ?? 0) + 1) })}>+</button>
              </div>
            ) : (
              <div style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic', padding: '6px 0' }}>Unlimited</div>
            )}
          </div>
        </div>

        {/* Tier */}
        <div className="field-group" style={{ marginBottom: 10 }}>
          <label className="field-label">Item Tier</label>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            <button className={`badge-toggle${!local.tier ? ' on' : ''}`} onClick={() => patch('tier', '')}>None</button>
            {ITEM_TIERS.map(t => (
              <button key={t} className={`badge-toggle${local.tier === t ? ' on' : ''}`}
                style={local.tier === t ? { borderColor: ITEM_TIER_COLOR[t], color: ITEM_TIER_COLOR[t], background: `${ITEM_TIER_COLOR[t]}18` } : {}}
                onClick={() => patch('tier', t)}>{t}</button>
            ))}
          </div>
        </div>

        {/* Affixes */}
        <div style={{ marginBottom: 10, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 4 }}>
          <div className="field-label" style={{ marginBottom: 8 }}>Affixes</div>
          {local.tier ? (
            <>
              <AffixPicker type="prefix" affixes={affixes} current={local.prefix || null}
                onPick={a => pickAffix('prefix', a)} onClear={() => patch('prefix', null)} />
              <AffixPicker type="suffix" affixes={affixes} current={local.suffix || null}
                onPick={a => pickAffix('suffix', a)} onClear={() => patch('suffix', null)} />
            </>
          ) : (
            <div style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic' }}>
              Set an item tier to unlock affixes.
            </div>
          )}
        </div>

        <div className="modal-section">
          <div className="modal-section-label">Attack Types</div>
          <div className="badge-group">
            {ATK_TYPES.map(t => (
              <button key={t} className={`badge-toggle${(local.attackTypes || []).includes(t) ? ' on' : ''}`} onClick={() => toggleAtkType(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="modal-grid3" style={{ marginBottom: 10 }}>
          <div className="field-group">
            <label className="field-label">Range</label>
            <input className="fi" value={local.range || ''} onChange={e => patch('range', e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">RPM <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(ranged)</span></label>
            <input className="fi" type="number" min="1"
              value={local.rpm ?? ''}
              onChange={e => patch('rpm', e.target.value === '' ? null : Math.max(1, +e.target.value))} />
          </div>
          <div className="field-group">
            <label className="field-label">Damage</label>
            <input className="fi" value={local.damage || ''} onChange={e => patch('damage', e.target.value)} />
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-section-label">Damage Type</div>
          <div className="badge-group">
            {DMG_TYPES.map(t => (
              <button key={t} className={`badge-toggle${(local.damageType || []).includes(t) ? ' on' : ''}`} onClick={() => toggleDmgType(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="modal-grid2" style={{ marginBottom: 8 }}>
          <div className="field-group">
            <label className="field-label">Special Effects</label>
            <textarea className="fi" value={local.specialEffects || ''} onChange={e => patch('specialEffects', e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Resistance Granted</label>
            <textarea className="fi" value={local.resistance || ''} onChange={e => patch('resistance', e.target.value)} placeholder="e.g. Fire 2, Crush 1" />
          </div>
        </div>
        <div className="field-group" style={{ marginBottom: 8 }}>
          <label className="field-label">Requirements</label>
          <input className="fi" value={local.requirements || ''} onChange={e => patch('requirements', e.target.value)} />
        </div>
        <div className="field-group" style={{ marginBottom: 8 }}>
          <label className="field-label">Description</label>
          <textarea className="fi" value={local.description || ''} onChange={e => patch('description', e.target.value)} />
        </div>

        {otherCats.length > 0 && (
          <div className="field-group" style={{ marginBottom: 8 }}>
            <label className="field-label">Move to Container</label>
            <div className="badge-group">
              {otherCats.map(c => (
                <button key={c.id} className="badge-toggle" onClick={() => { onMove(catId, c.id, item.id); onClose(); }}>{c.name}</button>
              ))}
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="btn btn-danger btn-sm" onClick={() => { onDelete(catId, item.id); onClose(); }}>Remove Item</button>
          <button className="btn btn-muted btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-cyan btn-sm" onClick={save}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function InvRow({ item, catId, dragOverId, onDragStart, onDragOver, onDrop, onDragEnd, onClick, onUseChange }) {
  const icon    = item.icon || catIcon(item.category || 'default');
  const dmgLbl  = itemDmgLabel(item);
  const showQty = (item.qty || 1) > 1;
  const isOver  = dragOverId === item.id;

  // Composed display name: [prefix] name [suffix]
  const prefix  = item.prefix?.name  ? item.prefix.name + ' '  : '';
  const suffix  = item.suffix?.name  ? ' ' + item.suffix.name  : '';
  const tierCol = item.tier ? (ITEM_TIER_COLOR[item.tier] || 'var(--text)') : null;

  const hasUses  = item.uses?.max != null;
  const curUses  = item.uses?.current ?? 0;
  const depleted = hasUses && curUses <= 0;

  return (
    <div
      className={`inv-row${isOver ? ' drag-over' : ''}`}
      draggable
      onDragStart={e => onDragStart(e, catId, item.id)}
      onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOver(catId, item.id); }}
      onDrop={e => { e.preventDefault(); e.stopPropagation(); onDrop(catId, item.id); }}
      onDragEnd={onDragEnd}
      onClick={() => onClick(item, catId)}
      style={depleted ? { opacity: 0.45, filter: 'grayscale(0.7)' } : undefined}
    >
      <span className="inv-row-drag">⠿</span>
      <span className="inv-row-icon">{icon}</span>
      <span className="inv-row-name">
        {item.prefix && <span style={{ color: AFFIX_TIER_COLOR[item.prefix.tier] || 'var(--muted)', fontSize: 10 }}>{prefix}</span>}
        <span style={{ ...(tierCol ? { color: tierCol } : {}), ...(depleted ? { textDecoration: 'line-through' } : {}) }}>{item.name}</span>
        {item.suffix && <span style={{ color: AFFIX_TIER_COLOR[item.suffix.tier] || 'var(--muted)', fontSize: 10 }}>{suffix}</span>}
        {item.tier && <span style={{ fontSize: 8, color: tierCol, marginLeft: 5, opacity: 0.7 }}>[{item.tier}]</span>}
        {depleted && <span style={{ fontSize: 8, color: '#ff6b6b', marginLeft: 6, letterSpacing: 1 }}>DEPLETED</span>}
      </span>
      <span className="inv-row-meta">
        {dmgLbl && <span className="inv-row-dmg">⚔ {dmgLbl}</span>}
        {item.range && <span className="inv-row-range">{item.range}</span>}
        {item.rpm != null && <span className="inv-row-range">{item.rpm} RPM</span>}
        {item.attackTypes?.length > 0 && (
          <span className="inv-row-atk">{item.attackTypes.join(' · ')}</span>
        )}
      </span>
      {hasUses && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={e => e.stopPropagation()}>
          <button
            className="btn btn-danger btn-icon btn-xs"
            disabled={curUses <= 0}
            title="Spend a use"
            onClick={e => { e.stopPropagation(); onUseChange(catId, item.id, -1); }}
          >−</button>
          <span style={{
            fontSize: 10, fontFamily: 'monospace', minWidth: 36, textAlign: 'center',
            color: depleted ? '#ff6b6b' : 'var(--cyan)', fontWeight: 700,
          }}>{curUses}/{item.uses.max}</span>
          <button
            className="btn btn-success btn-icon btn-xs"
            disabled={curUses >= item.uses.max}
            title="Restore a use"
            onClick={e => { e.stopPropagation(); onUseChange(catId, item.id, 1); }}
          >+</button>
        </span>
      )}
      {showQty && <span className="inv-row-qty">×{item.qty}</span>}
      <span className="inv-row-edit">✎ EDIT</span>
    </div>
  );
}

function CatPanel({ cat, fixed, cats, onPatchName, onAddItem, onRemoveCat, onReorder, canUp, canDown, showReorder,
  onItemDragStart, onItemDragOver, onItemDrop, onItemDragEnd, onItemClick, onUseChange, dragOverItem, onContainerDrop }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="inv-container">
      <div
        className="inv-container-header"
        onClick={() => setCollapsed(c => !c)}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); onContainerDrop(cat.id); }}
      >
        <span style={{ color: 'var(--cyan)', fontSize: 11, flexShrink: 0 }}>{collapsed ? '▶' : '▼'}</span>
        <input
          className="inv-cat-name-in"
          value={cat.name}
          onClick={e => e.stopPropagation()}
          onChange={e => onPatchName(cat.id, e.target.value)}
        />
        <span className="inv-cat-count">{(cat.items || []).length}</span>
        {!fixed && showReorder && (
          <span style={{ display: 'flex', gap: 3 }} onClick={e => e.stopPropagation()}>
            {canUp && <button className="btn btn-muted btn-xs" onClick={() => onReorder(cat.id, -1)}>↑</button>}
            {canDown && <button className="btn btn-muted btn-xs" onClick={() => onReorder(cat.id, 1)}>↓</button>}
            <button className="btn btn-danger btn-xs" onClick={() => onRemoveCat(cat.id)}>✕</button>
          </span>
        )}
        <button className="btn btn-cyan btn-xs" onClick={e => { e.stopPropagation(); onAddItem(cat.id); }}>+</button>
      </div>
      {!collapsed && (
        <div
          className="inv-cat-body-col"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); onContainerDrop(cat.id); }}
        >
          {(cat.items || []).map(item => (
            <InvRow
              key={item.id}
              item={item}
              catId={cat.id}
              dragOverId={dragOverItem?.catId === cat.id ? dragOverItem.itemId : null}
              onDragStart={onItemDragStart}
              onDragOver={onItemDragOver}
              onDrop={onItemDrop}
              onDragEnd={onItemDragEnd}
              onClick={onItemClick}
              onUseChange={onUseChange}
            />
          ))}
          {(cat.items || []).length === 0 && (
            <span style={{ color: 'var(--muted)', fontSize: 10, letterSpacing: 1, padding: '4px 2px' }}>Empty</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function InventoryTab({ state, update, token }) {
  const [popup, setPopup] = useState(null);
  const [affixes, setAffixes] = useState([]);
  const dragItem = useRef(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  useEffect(() => {
    if (token) {
      apiFetch('/api/affixes', {}, token).then(d => { if (Array.isArray(d)) setAffixes(d); });
    }
  }, [token]);

  const cats = state.inventory?.categories || [];
  // Support both current IDs (1/2) and legacy IDs (15=Worn/Equipped, 9=Quick Slots)
  const equipped = cats.find(c => c.id === 1 || c.id === 15) || { id: 1, name: 'Equipped', items: [] };
  const hotbar   = cats.find(c => c.id === 2 || c.id === 9)  || { id: 2, name: 'Hotbar',   items: [] };
  const FIXED_IDS = new Set([1, 2, 9, 15]);
  const freeCats = cats.filter(c => !FIXED_IDS.has(c.id)).sort((a, b) => (a.order || 0) - (b.order || 0));

  function mutateCats(fn) {
    update(s => ({ ...s, inventory: { ...s.inventory, categories: fn(s.inventory?.categories || []) } }));
  }
  function patchCatName(catId, name) { mutateCats(cs => cs.map(c => c.id === catId ? { ...c, name } : c)); }
  function addItem(catId) {
    mutateCats(cs => cs.map(c => c.id === catId ? {
      ...c, items: [...(c.items || []), {
        id: uid(), name: 'New Item', icon: '', qty: 1, attackTypes: [], range: '', damage: '',
        damageType: [], specialEffects: '', resistance: '', requirements: '', description: '', category: 'Misc',
      }],
    } : c));
  }
  function updateItem(catId, updatedItem) {
    mutateCats(cs => cs.map(c => c.id === catId ? { ...c, items: (c.items || []).map(i => i.id === updatedItem.id ? updatedItem : i) } : c));
  }
  function deleteItem(catId, itemId) {
    mutateCats(cs => cs.map(c => c.id === catId ? { ...c, items: (c.items || []).filter(i => i.id !== itemId) } : c));
  }
  function moveItem(fromCatId, toCatId, itemId) {
    mutateCats(cs => {
      const item = cs.find(c => c.id === fromCatId)?.items?.find(i => i.id === itemId);
      if (!item) return cs;
      return cs.map(c => {
        if (c.id === fromCatId) return { ...c, items: (c.items || []).filter(i => i.id !== itemId) };
        if (c.id === toCatId) return { ...c, items: [...(c.items || []), item] };
        return c;
      });
    });
  }
  function changeUses(catId, itemId, delta) {
    mutateCats(cs => cs.map(c => c.id !== catId ? c : {
      ...c,
      items: (c.items || []).map(i => {
        if (i.id !== itemId || i.uses?.max == null) return i;
        const max = i.uses.max;
        const next = Math.max(0, Math.min(max, (i.uses.current ?? max) + delta));
        return { ...i, uses: { max, current: next } };
      }),
    }));
  }
  function reorderItem(catId, fromItemId, toItemId) {
    mutateCats(cs => cs.map(c => {
      if (c.id !== catId) return c;
      const items = [...(c.items || [])];
      const fromIdx = items.findIndex(i => i.id === fromItemId);
      const toIdx = items.findIndex(i => i.id === toItemId);
      if (fromIdx === -1 || toIdx === -1) return c;
      const [moved] = items.splice(fromIdx, 1);
      items.splice(toIdx, 0, moved);
      return { ...c, items };
    }));
  }
  function addCategory() {
    const maxOrder = Math.max(0, ...cats.map(c => c.order || 0));
    mutateCats(cs => [...cs, { id: uid(), name: 'New Container', locked: false, items: [], order: maxOrder + 1 }]);
  }
  function removeCat(catId) { mutateCats(cs => cs.filter(c => c.id !== catId)); }
  function reorderCat(catId, dir) {
    mutateCats(cs => {
      const sorted = [...cs].sort((a, b) => (a.order || 0) - (b.order || 0));
      const freeOnly = sorted.filter(c => !new Set([1, 2, 9, 15]).has(c.id));
      const idx = freeOnly.findIndex(c => c.id === catId);
      if (dir === -1 && idx === 0) return cs;
      if (dir === 1 && idx === freeOnly.length - 1) return cs;
      const swapIdx = idx + dir;
      const a = freeOnly[idx], b = freeOnly[swapIdx];
      return cs.map(c => c.id === a.id ? { ...c, order: b.order } : c.id === b.id ? { ...c, order: a.order } : c);
    });
  }

  function handleItemDragStart(e, catId, itemId) {
    dragItem.current = { catId, itemId };
    e.dataTransfer.effectAllowed = 'move';
  }
  function handleItemDragOver(catId, itemId) {
    if (!dragItem.current) return;
    setDragOverItem({ catId, itemId });
  }
  function handleItemDrop(toCatId, toItemId) {
    const from = dragItem.current;
    if (!from) return;
    if (from.catId === toCatId) {
      if (from.itemId !== toItemId) reorderItem(toCatId, from.itemId, toItemId);
    } else {
      moveItem(from.catId, toCatId, from.itemId);
    }
    dragItem.current = null;
    setDragOverItem(null);
  }
  function handleContainerDrop(toCatId) {
    const from = dragItem.current;
    if (!from || from.catId === toCatId) return;
    moveItem(from.catId, toCatId, from.itemId);
    dragItem.current = null;
    setDragOverItem(null);
  }
  function handleItemDragEnd() {
    dragItem.current = null;
    setDragOverItem(null);
  }

  const sharedProps = {
    cats, onPatchName: patchCatName, onAddItem: addItem, onRemoveCat: removeCat, onReorder: reorderCat,
    onItemDragStart: handleItemDragStart,
    onItemDragOver: handleItemDragOver,
    onItemDrop: handleItemDrop,
    onItemDragEnd: handleItemDragEnd,
    onItemClick: (item, catId) => setPopup({ item, catId }),
    onUseChange: changeUses,
    onContainerDrop: handleContainerDrop,
    dragOverItem,
  };

  return (
    <>
      <div className="inv-stack">
        <CatPanel cat={equipped} fixed {...sharedProps} showReorder={false} />
        <CatPanel cat={hotbar} fixed {...sharedProps} showReorder={false} />
        {freeCats.map((cat, idx) => (
          <CatPanel key={cat.id} cat={cat} {...sharedProps}
            showReorder={true}
            canUp={idx > 0} canDown={idx < freeCats.length - 1}
          />
        ))}
        <div style={{ paddingTop: 4 }}>
          <button className="btn btn-muted btn-sm" onClick={addCategory}>+ Container</button>
        </div>
      </div>
      {popup && (
        <ItemPopup
          item={popup.item} catId={popup.catId} cats={cats}
          affixes={affixes}
          onClose={() => setPopup(null)}
          onUpdate={updateItem} onDelete={deleteItem} onMove={moveItem}
        />
      )}
    </>
  );
}
