import { useState, useRef } from 'react';
import { uid, catIcon, itemDmgLabel, ATK_TYPES, DMG_TYPES } from '../../constants.js';

function ItemPopup({ item, catId, cats, onClose, onUpdate, onDelete, onMove }) {
  const [local, setLocal] = useState({ ...item });
  function patch(k, v) { setLocal(l => ({ ...l, [k]: v })); }
  function toggleAtkType(t) {
    setLocal(l => { const arr = l.attackTypes || []; return { ...l, attackTypes: arr.includes(t) ? arr.filter(x => x !== t) : [...arr, t] }; });
  }
  function toggleDmgType(t) {
    setLocal(l => { const arr = l.damageType || []; return { ...l, damageType: arr.includes(t) ? arr.filter(x => x !== t) : [...arr, t] }; });
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
              {['Equipment', 'Weapons', 'Tools', 'Consumables', 'Misc'].map(c => <option key={c}>{c}</option>)}
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

        <div className="modal-section">
          <div className="modal-section-label">Attack Types</div>
          <div className="badge-group">
            {ATK_TYPES.map(t => (
              <button key={t} className={`badge-toggle${(local.attackTypes || []).includes(t) ? ' on' : ''}`} onClick={() => toggleAtkType(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="modal-grid2" style={{ marginBottom: 10 }}>
          <div className="field-group">
            <label className="field-label">Range</label>
            <input className="fi" value={local.range || ''} onChange={e => patch('range', e.target.value)} />
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

function InvBlock({ item, catId, onDragStart, onClick }) {
  const icon = item.icon || catIcon(item.category || 'default');
  const dmgLbl = itemDmgLabel(item);
  const showQty = (item.qty || 1) > 1;
  return (
    <div className="item-block" draggable onDragStart={e => onDragStart(e, catId, item.id)} onClick={() => onClick(item, catId)}>
      <div className="item-block-name">{item.name}</div>
      <div className="item-block-icon">{icon}</div>
      <div className="item-block-footer">
        {dmgLbl && <div className="item-block-dmg">⚔{dmgLbl}</div>}
        {showQty && <div className="item-block-qty">{item.qty}</div>}
      </div>
    </div>
  );
}

function CatPanel({ cat, fixed, cats, onPatchName, onAddItem, onRemoveCat, onReorder, canUp, canDown, showReorder, onItemDragStart, onItemDrop, onItemClick }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="inv-container" style={{ width: fixed ? '100%' : 'calc(50% - 5px)', minWidth: 200, flex: fixed ? 'none' : '1 1 200px' }}>
      <div
        className="inv-container-header"
        onDragOver={e => e.preventDefault()}
        onDrop={e => onItemDrop(e, cat.id)}
        onClick={() => setCollapsed(c => !c)}
      >
        <span style={{ color: 'var(--cyan)', fontSize: 11 }}>{collapsed ? '▶' : '▼'}</span>
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
          className="inv-cat-body"
          onDragOver={e => e.preventDefault()}
          onDrop={e => onItemDrop(e, cat.id)}
        >
          {(cat.items || []).map(item => (
            <InvBlock key={item.id} item={item} catId={cat.id} onDragStart={onItemDragStart} onClick={onItemClick} />
          ))}
          {(cat.items || []).length === 0 && <span style={{ color: 'var(--muted)', fontSize: 10, letterSpacing: 1 }}>Empty</span>}
        </div>
      )}
    </div>
  );
}

export default function InventoryTab({ state, update }) {
  const [popup, setPopup] = useState(null);
  const dragItem = useRef(null);

  const cats = state.inventory?.categories || [];
  const equipped = cats.find(c => c.id === 1) || { id: 1, name: 'Equipped', items: [] };
  const hotbar = cats.find(c => c.id === 2) || { id: 2, name: 'Hotbar', items: [] };
  const freeCats = cats.filter(c => c.id !== 1 && c.id !== 2).sort((a, b) => (a.order || 0) - (b.order || 0));

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
  function addCategory() {
    const maxOrder = Math.max(0, ...cats.map(c => c.order || 0));
    mutateCats(cs => [...cs, { id: uid(), name: 'New Container', locked: false, items: [], order: maxOrder + 1 }]);
  }
  function removeCat(catId) { mutateCats(cs => cs.filter(c => c.id !== catId)); }
  function reorderCat(catId, dir) {
    mutateCats(cs => {
      const sorted = [...cs].sort((a, b) => (a.order || 0) - (b.order || 0));
      const freeOnly = sorted.filter(c => c.id !== 1 && c.id !== 2);
      const idx = freeOnly.findIndex(c => c.id === catId);
      if (dir === -1 && idx === 0) return cs;
      if (dir === 1 && idx === freeOnly.length - 1) return cs;
      const swapIdx = idx + dir;
      const a = freeOnly[idx], b = freeOnly[swapIdx];
      const aOrd = a.order, bOrd = b.order;
      return cs.map(c => c.id === a.id ? { ...c, order: bOrd } : c.id === b.id ? { ...c, order: aOrd } : c);
    });
  }

  function handleItemDragStart(e, catId, itemId) { dragItem.current = { catId, itemId }; e.dataTransfer.effectAllowed = 'move'; }
  function handleItemDrop(e, toCatId) {
    e.preventDefault();
    if (!dragItem.current || dragItem.current.catId === toCatId) return;
    moveItem(dragItem.current.catId, toCatId, dragItem.current.itemId);
    dragItem.current = null;
  }
  function handleItemClick(item, catId) { setPopup({ item, catId }); }

  const sharedProps = { cats, onPatchName: patchCatName, onAddItem: addItem, onRemoveCat: removeCat, onReorder: reorderCat, onItemDragStart: handleItemDragStart, onItemDrop: handleItemDrop, onItemClick: handleItemClick };

  return (
    <>
      <div className="inv-layout">
        <div className="inv-fixed">
          <CatPanel cat={equipped} fixed {...sharedProps} showReorder={false} />
          <CatPanel cat={hotbar} fixed {...sharedProps} showReorder={false} />
        </div>
        <div className="inv-free">
          {freeCats.map((cat, idx) => (
            <CatPanel key={cat.id} cat={cat} {...sharedProps}
              showReorder={true}
              canUp={idx > 0} canDown={idx < freeCats.length - 1}
            />
          ))}
          <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start', marginTop: 4 }}>
            <button className="btn btn-muted btn-sm" onClick={addCategory}>+ Container</button>
          </div>
        </div>
      </div>
      {popup && (
        <ItemPopup
          item={popup.item} catId={popup.catId} cats={cats}
          onClose={() => setPopup(null)}
          onUpdate={updateItem} onDelete={deleteItem} onMove={moveItem}
        />
      )}
    </>
  );
}
