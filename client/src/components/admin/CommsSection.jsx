import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../api.js';

export default function CommsSection({ token, players, showToast }) {
  const [messages, setMessages] = useState([]);
  const [npcs, setNpcs] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [selectedNpc, setSelectedNpc] = useState('');
  const [recipient, setRecipient] = useState('');
  const [newNpc, setNewNpc] = useState({ name: '', color: '#c8a84b' });
  const feedRef = useRef();
  const initialLoad = useRef(true);

  useEffect(() => {
    loadMessages();
    loadNpcs();
    const iv = setInterval(loadMessages, 5000);
    return () => clearInterval(iv);
  }, []);

  function loadMessages() {
    apiFetch('/api/admin/messages', {}, token).then(d => {
      if (Array.isArray(d)) {
        setMessages(d);
        if (initialLoad.current) {
          initialLoad.current = false;
          setTimeout(() => feedRef.current?.scrollTo(0, feedRef.current.scrollHeight), 50);
        }
      }
    });
  }
  function loadNpcs() { apiFetch('/api/admin/npcs', {}, token).then(d => { if (Array.isArray(d)) setNpcs(d); }); }

  async function sendMsg() {
    if (!msgText.trim()) return;
    const body = { text: msgText, ...(selectedNpc ? { npcId: selectedNpc } : {}), ...(recipient ? { recipientId: recipient } : {}) };
    const d = await apiFetch('/api/admin/messages', { method: 'POST', body: JSON.stringify(body) }, token);
    if (d._id) { setMsgText(''); loadMessages(); } else showToast(d.error, 'err');
  }
  async function createNpc() {
    if (!newNpc.name) return;
    const d = await apiFetch('/api/admin/npcs', { method: 'POST', body: JSON.stringify(newNpc) }, token);
    if (d._id) { setNewNpc({ name: '', color: '#c8a84b' }); loadNpcs(); } else showToast(d.error, 'err');
  }
  async function delNpc(id) { await apiFetch(`/api/admin/npcs/${id}`, { method: 'DELETE' }, token); loadNpcs(); }

  function fmtTime(t) { return t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''; }

  const activeNpc = npcs.find(n => n._id === selectedNpc);
  const senderColor = activeNpc?.color;
  const senderLabel = activeNpc?.name || 'Admin';

  return (
    <div className="comms-layout">
      {/* Main chat column */}
      <div className="comms-main">
        <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="panel-title admin">
            Message Feed
            <span style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 1, fontWeight: 'normal' }}>
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="chat-feed" ref={feedRef}>
            {messages.map(m => {
              const isWhisper = !!(m.recipientName);
              const color = m.style?.color;
              return (
                <div key={m._id} className={`chat-bubble${isWhisper ? ' whisper' : ' broadcast'}`}>
                  <div className="chat-meta">
                    <span className="chat-sender" style={color ? { color } : undefined}>{m.senderName}</span>
                    {isWhisper && <span className="chat-recipient"> → {m.recipientName}</span>}
                    <span className="chat-time">{fmtTime(m.createdAt)}</span>
                  </div>
                  <div className="chat-text">{m.text}</div>
                </div>
              );
            })}
            {messages.length === 0 && <div className="chat-empty">No messages yet.</div>}
          </div>

          {/* Compose area */}
          <div className="chat-compose">
            <div className="chat-compose-selectors">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                {senderColor && <span style={{ width: 10, height: 10, borderRadius: '50%', background: senderColor, flexShrink: 0 }} />}
                <select className="fi" value={selectedNpc} onChange={e => setSelectedNpc(e.target.value)} style={{ flex: 1 }}>
                  <option value="">Send as Admin</option>
                  {npcs.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
                </select>
              </div>
              <select className="fi" value={recipient} onChange={e => setRecipient(e.target.value)} style={{ flex: 1 }}>
                <option value="">Broadcast to all</option>
                {players.map(p => <option key={p.userId} value={p.userId}>{p.username} ({p.characterName || '—'})</option>)}
              </select>
            </div>
            <div className="chat-input-row">
              <span className="chat-as-label" style={senderColor ? { color: senderColor } : undefined}>{senderLabel}</span>
              <input
                className="fi chat-input"
                placeholder={recipient ? `Whisper to ${players.find(p => p.userId === recipient)?.characterName || players.find(p => p.userId === recipient)?.username || '...'}` : 'Broadcast message...'}
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMsg()}
              />
              <button className="btn btn-purple" onClick={sendMsg} style={{ flexShrink: 0 }}>Send</button>
            </div>
          </div>
        </div>
      </div>

      {/* NPC sidebar */}
      <div className="comms-sidebar">
        <div className="panel">
          <div className="panel-title admin">NPCs</div>
          <div className="npc-list" style={{ marginBottom: 12 }}>
            {npcs.map(n => (
              <div key={n._id} className="npc-row" style={{ borderLeft: `3px solid ${n.color}` }}>
                <div className="npc-dot" style={{ background: n.color }} />
                <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: n.color }}>{n.name}</span>
                <button className="btn btn-danger btn-xs" onClick={() => delNpc(n._id)}>✕</button>
              </div>
            ))}
            {npcs.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No NPCs.</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input className="fi" placeholder="NPC name..." value={newNpc.name} onChange={e => setNewNpc(n => ({ ...n, name: e.target.value }))} onKeyDown={e => e.key === 'Enter' && createNpc()} />
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="color" value={newNpc.color} onChange={e => setNewNpc(n => ({ ...n, color: e.target.value }))}
                style={{ width: 34, height: 34, border: '1px solid var(--muted)', borderRadius: 3, background: 'transparent', cursor: 'pointer', padding: 2 }} />
              <button className="btn btn-purple btn-sm" onClick={createNpc} style={{ flex: 1 }}>+ NPC</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
