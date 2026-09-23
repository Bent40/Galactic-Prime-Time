import { useEffect, useRef, useState } from 'react';
import { tick, elapsedSince, formatTimecode } from './soundEngine.js';

/**
 * SoundPlayer — plays whatever the table says is playing, in sync.
 *
 * Two backends behind one loop: the YouTube IFrame API (audio from a video) and a
 * plain <audio> element (an mp3 by URL). Every 250 ms it asks the backend where it is,
 * asks soundEngine.tick() what to do about it, and seeks/stops accordingly. The GM's
 * page runs the same component, so the GM hears exactly what the players hear.
 *
 * Browsers refuse to play anything before a user gesture, so the first render is an
 * "Enable sound" button. After that click every cue plays unasked.
 */
let ytApiPromise = null;
function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise(resolve => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev && prev(); resolve(window.YT); };
    const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; s.async = true;
    document.head.appendChild(s);
  });
  return ytApiPromise;
}

export default function SoundPlayer({ cue, sound, serverNow, syncedAt, compact = false }) {
  const [enabled, setEnabled] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [status, setStatus] = useState('');
  const [ytReady, setYtReady] = useState(false);
  const holder = useRef(null);
  const yt = useRef(null);
  const audio = useRef(null);
  const loaded = useRef({ seq: -1, ref: '' });

  // build the YouTube player once sound is enabled
  useEffect(() => {
    if (!enabled) return;
    let dead = false;
    loadYouTubeApi().then(YT => {
      if (dead || yt.current || !holder.current) return;
      yt.current = new YT.Player(holder.current, {
        width: 240, height: 135, videoId: '',
        playerVars: { controls: 0, disablekb: 1, modestbranding: 1, rel: 0, playsinline: 1, origin: window.location.origin },
        events: { onReady: () => setYtReady(true), onError: (e) => setStatus(`YouTube error ${e.data} — the video may not allow embedding`) },
      });
    });
    return () => { dead = true; };
  }, [enabled]);

  const playing = !!(enabled && cue && sound?.playing);

  // (re)load when the cue or the sequence changes
  useEffect(() => {
    if (!enabled) return;
    const seq = sound?.seq ?? 0;
    if (!playing) {
      loaded.current = { seq, ref: '' };
      try { yt.current?.pauseVideo?.(); } catch {}
      if (audio.current) { audio.current.pause(); }
      setStatus(cue ? 'stopped' : '');
      return;
    }
    if (loaded.current.seq === seq && loaded.current.ref === cue.ref) return;
    loaded.current = { seq, ref: cue.ref };
    const elapsed = elapsedSince(sound.startedAt, serverNow, Date.now(), syncedAt);
    const startAt = (cue.start || 0) + (cue.loop && cue.end > cue.start ? elapsed % (cue.end - cue.start) : elapsed);
    if (cue.source === 'youtube') {
      if (audio.current) audio.current.pause();
      if (!ytReady || !yt.current) return;   // will re-run when ytReady flips
      try { yt.current.setVolume(cue.volume ?? 80); yt.current.loadVideoById({ videoId: cue.ref, startSeconds: startAt }); yt.current.playVideo(); } catch (e) { setStatus('YouTube: ' + e.message); }
    } else {
      try { yt.current?.pauseVideo?.(); } catch {}
      const a = audio.current; if (!a) return;
      if (a.src !== cue.ref) a.src = cue.ref;
      a.volume = (cue.volume ?? 80) / 100;
      a.currentTime = startAt;
      a.play().catch(err => setStatus('audio: ' + err.message));
    }
    setStatus(`▶ ${cue.name}`);
  }, [enabled, playing, cue?.cueId, cue?.ref, cue?.start, cue?.end, cue?.loop, cue?.volume, sound?.seq, ytReady]);

  // the sync loop
  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => {
      let current = NaN, duration = 0, backend = null;
      if (cue.source === 'youtube') { if (!yt.current?.getCurrentTime) return; try { current = yt.current.getCurrentTime(); duration = yt.current.getDuration?.() || 0; } catch { return; } backend = 'yt'; }
      else { const a = audio.current; if (!a || !a.src) return; current = a.currentTime; duration = a.duration || 0; backend = 'audio'; }
      const elapsed = elapsedSince(sound.startedAt, serverNow, Date.now(), syncedAt);
      const act = tick(cue, sound, current, elapsed, duration);
      if (act.action === 'seek') { if (backend === 'yt') yt.current.seekTo(act.to, true); else audio.current.currentTime = act.to; }
      else if (act.action === 'stop') { if (backend === 'yt') yt.current.pauseVideo(); else audio.current.pause(); }
      setStatus(`▶ ${cue.name} · ${formatTimecode(current)}${cue.end ? ' / ' + formatTimecode(cue.end) : ''}${cue.loop ? ' ⟳' : ''}`);
    }, 250);
    return () => clearInterval(iv);
  }, [playing, cue?.cueId, sound?.seq, serverNow, syncedAt]);

  return (
    <div className={`soundplayer${compact ? ' compact' : ''}${showVideo ? ' show-video' : ''}`}>
      {!enabled ? (
        <button className="btn btn-gold btn-sm" type="button" onClick={() => setEnabled(true)}>🔊 Enable sound</button>
      ) : (
        <div className="sound-status">
          <span className={`sound-dot${playing ? ' on' : ''}`} />
          <span className="sound-text">{status || (cue ? cue.name : 'no cue')}</span>
          {cue?.source === 'youtube' && <button className="btn btn-muted btn-xs" type="button" onClick={() => setShowVideo(v => !v)}>{showVideo ? 'hide video' : 'video'}</button>}
        </div>
      )}
      <div className="yt-holder"><div ref={holder} /></div>
      <audio ref={audio} preload="auto" />
    </div>
  );
}
