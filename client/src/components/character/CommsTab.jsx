import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../api.js';

export default function CommsTab({ auth }) {
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [sending, setSending] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [target, setTarget] = useState('');
  const feedRef = useRef();
  const initialLoad = useRef(true);

  useEffect(() => {
    load();
    apiFetch('/api/players', {}, auth.token).then(d => {
      if (Array.isArray(d)) setRecipients(d.filter(p => p.userId !== auth.userId));
    });
    const iv = setInterval(load, 5000);
    return () => clearInterval(iv);
  }, []);

  function scrollToBottom() {
    setTimeout(() => feedRef.current?.scrollTo(0, feedRef.current.scrollHeight), 50);
  }

  function load() {
    apiFetch('/api/messages', {}, auth.token).then(d => {
      if (Array.isArray(d)) {
        setMessages(d);
        if (initialLoad.current) {
          initialLoad.current = false;
          scrollToBottom();
        }
      }
    });
  }

  async function sendMsg() {
    const text = msgText.trim();
    if (!text || sending) return;
    setSending(true);
    const body = { text };
    if (target.startsWith('npc:')) body.recipientNpcId = target.slice(4);
    else if (target) body.recipientId = target;
    const d = await apiFetch('/api/messages', {
      method: 'POST', body: JSON.stringify(body),
    }, auth.token);
    setSending(false);
    if (d && d._id) {
      setMsgText('');
      setMessages(prev => [...prev, d]);
      scrollToBottom();
    }
  }

  const targetName = recipients.find(r => r.userId === target)?.displayName;

  function fmtTime(t) {
    return t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  }

  return (
    <div className="panel comms-panel">
      <div className="panel-title">Comms</div>
      <div className="chat-feed" ref={feedRef}>
        {messages.map(m => {
          const isWhisper = !!(m.recipientName);
          const color = m.style?.color;
          return (
            <div key={m._id} className={`chat-bubble${isWhisper ? ' whisper' : ' broadcast'}`}>
              <div className="chat-meta">
                <span className="chat-sender" style={color ? { color } : undefined}>{m.senderName}</span>
                {isWhisper && (
                  <span className="chat-recipient"> → {m.recipientName}</span>
                )}
                <span className="chat-time">{fmtTime(m.createdAt)}</span>
              </div>
              <div className="chat-text">{m.text}</div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="chat-empty">No messages yet.</div>
        )}
      </div>

      <div className="chat-compose">
        <div className="chat-input-row">
          <span className="chat-as-label">{auth.username}</span>
          <select
            className="fi"
            style={{ maxWidth: 150, flexShrink: 0, fontSize: 11 }}
            value={target}
            onChange={e => setTarget(e.target.value)}
            title="Who hears this — everyone, or a whisper"
          >
            <option value="">📢 Broadcast</option>
            {recipients.filter(r => !r.isNPC).map(r => (
              <option key={r.userId} value={r.userId}>🤫 {r.displayName}</option>
            ))}
            {recipients.filter(r => r.isNPC).map(r => (
              <option key={r.userId} value={r.userId}>🎭 {r.displayName}</option>
            ))}
          </select>
          <input
            className="fi chat-input"
            placeholder={target ? `Whisper to ${targetName}...` : 'Broadcast message...'}
            maxLength={500}
            value={msgText}
            onChange={e => setMsgText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMsg(); }}
            disabled={sending}
          />
          <button className="btn btn-cyan" onClick={sendMsg} disabled={sending || !msgText.trim()} style={{ flexShrink: 0 }}>
            {sending ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
