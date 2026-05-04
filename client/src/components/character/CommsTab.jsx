import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../api.js';

export default function CommsTab({ auth }) {
  const [messages, setMessages] = useState([]);
  const feedRef = useRef();
  const initialLoad = useRef(true);

  useEffect(() => {
    load();
    const iv = setInterval(load, 5000);
    return () => clearInterval(iv);
  }, []);

  function load() {
    apiFetch('/api/messages', {}, auth.token).then(d => {
      if (Array.isArray(d)) {
        setMessages(d);
        if (initialLoad.current) {
          initialLoad.current = false;
          setTimeout(() => feedRef.current?.scrollTo(0, feedRef.current.scrollHeight), 50);
        }
      }
    });
  }

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
    </div>
  );
}
