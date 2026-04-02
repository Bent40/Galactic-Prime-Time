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
        setTimeout(() => feedRef.current?.scrollTo(0, feedRef.current.scrollHeight), 50);
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

  return (
    <div className="two-col">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="panel">
          <div className="panel-title admin">Message Feed</div>
          <div className="msg-feed" ref={feedRef}>
            {messages.map(m => {
              const isWhisper = !!(m.recipientName);
              return (
                <div key={m._id} className={`msg-bubble ${isWhisper ? 'whisper' : 'broadcast'}`}>
                  <div className={`msg-sender ${isWhisper ? 'whisper' : 'broadcast'}`} style={{ color: m.style?.color || undefined }}>
                    {m.senderName}
                    {m.recipientName && <span className="msg-recipient"> → {m.recipientName}</span>}
                  </div>
                  <div className="msg-text">{m.text}</div>
                  <div className="msg-time">{fmtTime(m.createdAt)}</div>
                </div>
              );
            })}
            {messages.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No messages yet.</span>}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <select className="fi" style={{ flex: 1 }} value={selectedNpc} onChange={e => setSelectedNpc(e.target.value)}>
              <option value="">Send as Admin</option>
              {npcs.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
            </select>
            <select className="fi" style={{ flex: 1 }} value={recipient} onChange={e => setRecipient(e.target.value)}>
              <option value="">Broadcast</option>
              {players.map(p => <option key={p.userId} value={p.userId}>{p.username} ({p.characterName || '—'})</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <input className="fi" style={{ flex: 1 }} placeholder="Message text..." value={msgText} onChange={e => setMsgText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} />
            <button className="btn btn-purple btn-sm" onClick={sendMsg}>Send</button>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="panel">
          <div className="panel-title admin">NPCs</div>
          <div className="npc-list" style={{ marginBottom: 10 }}>
            {npcs.map(n => (
              <div key={n._id} className="npc-row">
                <div className="npc-dot" style={{ background: n.color, border: `2px solid ${n.color}` }} />
                <span style={{ flex: 1, fontSize: 12, fontWeight: 700 }}>{n.name}</span>
                <button className="btn btn-danger btn-xs" onClick={() => delNpc(n._id)}>✕</button>
              </div>
            ))}
            {npcs.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 11 }}>No NPCs.</span>}
          </div>
          <div className="row">
            <input className="fi" style={{ flex: 1 }} placeholder="NPC name..." value={newNpc.name} onChange={e => setNewNpc(n => ({ ...n, name: e.target.value }))} />
            <input type="color" value={newNpc.color} onChange={e => setNewNpc(n => ({ ...n, color: e.target.value }))} style={{ width: 34, height: 34, border: '1px solid var(--muted)', borderRadius: 3, background: 'transparent', cursor: 'pointer', padding: 2 }} />
            <button className="btn btn-purple btn-sm" onClick={createNpc}>+ NPC</button>
          </div>
        </div>
      </div>
    </div>
  );
}
