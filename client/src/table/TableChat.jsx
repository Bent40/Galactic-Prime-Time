import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../api.js';

/**
 * TableChat — the table's feed: talk, whispers and the rolls the server posts.
 * Players read /api/messages (which never returns a GM-only roll); the GM reads
 * /api/admin/messages. Sending reuses the existing Comms routes, so a whisper typed
 * here shows up on the sheet's Comms tab too.
 */
function fmtTime(t) { return t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''; }

export default function TableChat({ token, role, players = [], pollMs = 3000, injected = [], refreshKey = 0 }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [target, setTarget] = useState('');
  const feed = useRef(null);
  const path = role === 'gm' ? '/api/admin/messages' : '/api/messages';

  function load() { apiFetch(path, {}, token).then(d => { if (Array.isArray(d)) setMessages(d); }); }
  useEffect(() => { load(); const iv = setInterval(load, pollMs); return () => clearInterval(iv); }, [path, pollMs]);
  useEffect(() => { if (refreshKey) load(); }, [refreshKey]);
  useEffect(() => { if (injected.length) setMessages(m => m.some(x => x._id === injected[injected.length - 1]._id) ? m : [...m, injected[injected.length - 1]]); }, [injected]);
  useEffect(() => { feed.current?.scrollTo(0, feed.current.scrollHeight); }, [messages.length]);

  async function send(e) {
    e.preventDefault();
    const t = text.trim(); if (!t) return;
    const body = { text: t };
    if (target) body.recipientId = target;
    const d = await apiFetch(path, { method: 'POST', body: JSON.stringify(body) }, token);
    if (d && d._id) { setText(''); setMessages(m => [...m, d]); }
  }

  return (
    <div className="tablechat">
      <div className="chat-log" ref={feed}>
        {messages.map(m => (
          <div key={m._id} className={`msg${m.kind === 'roll' ? ' roll' : ''}${m.kind === 'skill' ? ' skill' : ''}${m.recipient || m.recipientNPC ? ' whisper' : ''}${m.gmOnly ? ' gmonly' : ''}`}>
            <div className="who">{m.senderName}{m.recipientName ? ` → ${m.recipientName}` : ''}{m.gmOnly ? ' · GM only' : ''} <span className="t">{fmtTime(m.createdAt)}</span></div>
            {m.kind === 'roll' && m.roll ? (
              <div className="rollrow"><span className={`res${/Forced/.test(m.roll.label) ? ' fa' : ''}`}>{m.roll.total}</span><span className="fx"><b>{m.roll.label}</b> <span className="die">{m.roll.die}{m.roll.rolls?.length > 1 ? ` [${m.roll.rolls.join('+')}]` : ''}</span><br />{m.roll.effect}</span></div>
            ) : <div className="fx" style={m.style?.color ? { color: m.style.color } : undefined}>{m.text}</div>}
          </div>
        ))}
        {messages.length === 0 && <div className="hint">Nothing said yet.</div>}
      </div>
      <form className="chat-send" onSubmit={send}>
        <select className="fi" value={target} onChange={e => setTarget(e.target.value)} aria-label="Recipient">
          <option value="">📢 table</option>
          {players.map(p => <option key={p.userId} value={p.userId}>🤫 {p.displayName || p.characterName || p.username}</option>)}
        </select>
        <input className="fi" value={text} onChange={e => setText(e.target.value)} placeholder="Say something…" maxLength={500} aria-label="Message" />
        <button className="btn btn-cyan btn-sm" type="submit">Send</button>
      </form>
    </div>
  );
}
