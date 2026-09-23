import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch } from '../api.js';

/**
 * useTablePoll — the table's heartbeat. Polls GET /api/tables/:id/live every `ms`
 * (2 s by default: a dragged token lands on the other screen inside that) and fetches
 * a map's image ONCE per map id. Also keeps the clock offset the sound engine needs:
 * `serverNow` as the server reported it and `syncedAt`, the client time it arrived.
 *
 * This is the polling fallback named in docs/vtt-research.md V-4. When Socket.IO is
 * approved it becomes the notifier's re-fetch; nothing above it changes.
 */
export default function useTablePoll(tableId, token, ms = 2000) {
  const [live, setLive] = useState(null);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const [clock, setClock] = useState({ serverNow: Date.now(), syncedAt: Date.now() });
  const imgFor = useRef('');
  const inflight = useRef(false);

  const refresh = useCallback(async () => {
    if (!tableId || !token || inflight.current) return;
    inflight.current = true;
    try {
      const d = await apiFetch(`/api/tables/${tableId}/live`, {}, token);
      if (d && !d.error) {
        setLive(d); setError('');
        if (typeof d.serverNow === 'number') setClock({ serverNow: d.serverNow, syncedAt: Date.now() });
        const mid = d.map?._id ? String(d.map._id) : '';
        if (mid !== imgFor.current) {
          imgFor.current = mid;
          if (!mid) setImage(null);
          else {
            const im = await apiFetch(`/api/tables/${tableId}/maps/${mid}/image`, {}, token);
            if (imgFor.current === mid) setImage(im && !im.error && im.image ? im.image : null);
          }
        }
      } else setError(d?.error || 'Table unavailable');
    } catch { setError('Connection lost — retrying'); }
    finally { inflight.current = false; }
  }, [tableId, token]);

  useEffect(() => { refresh(); const iv = setInterval(refresh, ms); return () => clearInterval(iv); }, [refresh, ms]);

  // optimistic local patch (a token you just dragged) so the board does not snap back
  const patchLocal = useCallback((fn) => setLive(l => (l ? fn(l) : l)), []);

  return { live, error, image, clock, refresh, patchLocal };
}
