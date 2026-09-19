import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { marked } from 'marked';
import rulebookRaw from '../../../rulebook/gpt-system-v1.0.md?raw';
import {
  MARKERS,
  buildIndex,
  parseRulebook,
  pickByNumber,
  searchIndex,
  summarize,
  totalHits,
} from '../wikiIndex.js';

/**
 * The player-facing Wiki.
 *
 * It renders `rulebook/gpt-system-v1.0.md` — the ONE committed rules master
 * (owner decision D-8). Nothing here edits the book; everything here is
 * presentation, because this page is used AT THE TABLE, mid-session, by
 * somebody who needs one rule in five seconds.
 *
 * Three panes, one at a time:
 *   HOME     a grid of chapter cards + the rules people look up most
 *   CHAPTER  one chapter, never the whole 2,000-line book
 *   SEARCH   full text of every section, not just the headings
 */

/**
 * The rules a table reaches for mid-fight, pinned to the landing page.
 * Held as SECTION NUMBERS, never slugs — renumber the book and this either
 * resolves or quietly drops the card; it can never point at the wrong rule.
 */
const PINNED = ['8.2', '7.3', '10', '7.1', '21.6', '6.1', '5.5', '12.6'];

const MARKER_LABEL = {
  ruled: 'RULED', warn: 'CAUTION', open: 'OPEN', star: 'NOTE', cog: 'HOW IT WORKS',
  stop: 'NEVER', done: 'DONE', draft: 'DRAFT', aim: 'GM', new: 'NEW', weigh: 'JUDGEMENT',
};

/** Escape a string for use inside a RegExp. */
function reEscape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ────────────────────────────────────────────────────────────────────────────
 * DOM decoration
 *
 * marked gives us plain HTML. These passes turn it into something scannable:
 * reference cards out of the tier tables, callouts out of the book's own
 * markers, a copy-link on every heading, and a horizontal-scroll box around
 * every table so a phone never scrolls the PAGE sideways.
 *
 * Safe to mutate the DOM directly because React owns this subtree only through
 * dangerouslySetInnerHTML and re-creates it wholesale whenever the html changes
 * (the container is keyed), so every pass runs on a clean tree.
 * ──────────────────────────────────────────────────────────────────────────── */

function decorateTables(root) {
  for (const table of root.querySelectorAll('table')) {
    if (table.parentElement?.classList.contains('wiki-tblwrap')) continue;
    const heads = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim().toLowerCase());
    const isTier = heads[0] === 'tier';
    if (isTier) table.classList.add('tier');
    if (heads.some(h => h === 'part' || h === 'type' || h === 'class')) table.classList.add('keyed');

    for (const row of table.querySelectorAll('tbody tr')) {
      const first = row.children[0];
      if (!first) continue;
      const m = /^T([1-4])$/.exec(first.textContent.trim());
      if (m) {
        first.setAttribute('data-tier', m[1]);
        first.classList.add('wiki-tiercell');
      }
    }

    const wrap = document.createElement('div');
    wrap.className = 'wiki-tblwrap';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);

    // A short lead paragraph immediately above a tier table is that table's
    // title — glue them into one reference card ("Bleeding" + its four tiers).
    const prev = wrap.previousElementSibling;
    if (isTier && prev && prev.tagName === 'P' && prev.textContent.trim().length < 220
        && !prev.classList.contains('wiki-callout')) {
      const card = document.createElement('div');
      card.className = 'wiki-card';
      prev.parentNode.insertBefore(card, prev);
      prev.classList.add('wiki-card-head');
      card.appendChild(prev);
      card.appendChild(wrap);
    }
  }
}

function decorateCallouts(root) {
  for (const el of root.querySelectorAll('p, li, blockquote > p')) {
    const text = el.textContent.trimStart();
    if (!text) continue;
    const hit = MARKERS.find(m => text.startsWith(m.glyph));
    if (!hit) continue;
    el.classList.add('wiki-callout');
    el.setAttribute('data-mk', hit.kind);
    el.setAttribute('data-mk-label', MARKER_LABEL[hit.kind] || '');
  }
}

function decorateHeadings(root, onCopy) {
  for (const h of root.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]')) {
    if (h.querySelector('.wiki-anchor')) continue;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wiki-anchor';
    btn.title = 'Copy a link to this rule';
    btn.setAttribute('aria-label', `Copy a link to ${h.textContent.trim()}`);
    btn.textContent = '#';
    btn.addEventListener('click', ev => {
      ev.preventDefault();
      onCopy(h.id);
    });
    h.appendChild(btn);
  }
}

/** Wrap every occurrence of `term` in <mark>, walking text nodes only. */
function highlight(root, term) {
  const needle = String(term || '').trim();
  if (needle.length < 2) return 0;
  const re = new RegExp(reEscape(needle), 'gi');
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const p = node.parentElement;
      if (!p || p.closest('mark, .wiki-anchor, script, style')) return NodeFilter.FILTER_REJECT;
      return re.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const targets = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) targets.push(n);

  let count = 0;
  for (const node of targets) {
    const text = node.nodeValue;
    const frag = document.createDocumentFragment();
    let last = 0;
    re.lastIndex = 0;
    for (let m = re.exec(text); m; m = re.exec(text)) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const mark = document.createElement('mark');
      mark.className = 'wiki-hit';
      mark.textContent = m[0];
      frag.appendChild(mark);
      last = m.index + m[0].length;
      count++;
      if (m[0].length === 0) re.lastIndex++;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }
  return count;
}

/* ──────────────────────────────────────────────────────────────────────────── */

export default function Wiki() {
  const book = useMemo(() => parseRulebook(rulebookRaw), []);
  const index = useMemo(() => buildIndex(book), [book]);
  const byId = useMemo(() => new Map(book.sections.map(s => [s.id, s])), [book]);
  const pinned = useMemo(() => pickByNumber(book, PINNED), [book]);

  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [chapterId, setChapterId] = useState(null);
  const [anchorId, setAnchorId] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState('');

  const contentRef = useRef(null);
  const searchRef = useRef(null);
  const toastTimer = useRef(null);

  const results = useMemo(
    () => (query.trim().length >= 2 ? searchIndex(index, query) : []),
    [index, query],
  );
  const searching = showResults && query.trim().length >= 2;
  const chapter = chapterId ? book.chapters.find(c => c.id === chapterId) : null;
  const pane = searching ? 'search' : chapter ? 'chapter' : 'home';

  const flash = useCallback(msg => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* ── navigation: the hash IS the state, so deep links and Back both work ── */

  const applyHash = useCallback(() => {
    let id = '';
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { id = window.location.hash.slice(1); }
    const sec = id ? byId.get(id) : null;
    if (!sec) { setChapterId(null); setAnchorId(null); return; }
    setChapterId(sec.isChapter ? sec.id : sec.chapterId);
    setAnchorId(sec.id);
  }, [byId]);

  useEffect(() => {
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [applyHash]);

  const go = useCallback(id => {
    setShowResults(false);
    setNavOpen(false);
    const current = (() => {
      try { return decodeURIComponent(window.location.hash.slice(1)); } catch { return ''; }
    })();
    if (!id) {
      if (current) window.location.hash = '';
      else { setChapterId(null); setAnchorId(null); }
      return;
    }
    if (current === id) applyHash();        // same target: just re-scroll
    else window.location.hash = id;          // otherwise let hashchange drive it
  }, [applyHash]);

  /* ── the rendered chapter ────────────────────────────────────────────────── */

  const html = useMemo(() => {
    if (!chapter) return '';
    const ids = [chapter.id, ...chapter.sections.map(s => s.id)];
    let i = 0;
    const raw = marked.parse(chapter.md, { gfm: true, breaks: false });
    // Headings come out in exactly document order, so the ids computed by the
    // parser can be shifted onto them in order. That keeps the anchors, the TOC
    // and the search results using one and the same id.
    return raw.replace(/<h([2-6])>([\s\S]*?)<\/h\1>/g, (m, lvl, inner) => {
      const id = ids[i++];
      return id ? `<h${lvl} id="${id}">${inner}</h${lvl}>` : m;
    });
  }, [chapter]);

  const copyLink = useCallback(id => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    const done = () => flash('Link copied');
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(done, () => flash(url));
    else flash(url);
  }, [flash]);

  // Decorate + highlight after every content swap. useLayoutEffect so the reader
  // never sees one frame of undecorated markdown.
  useLayoutEffect(() => {
    const root = contentRef.current;
    if (!root || pane !== 'chapter') return;
    decorateTables(root);
    decorateCallouts(root);
    decorateHeadings(root, copyLink);
    if (query.trim().length >= 2) highlight(root, query.trim());
  }, [html, query, pane, copyLink]);

  // Scroll to the anchor once its chapter is on screen.
  useEffect(() => {
    if (pane !== 'chapter' || !anchorId) return;
    const root = contentRef.current;
    if (!root) return;
    const el = root.querySelector(`#${CSS.escape(anchorId)}`);
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
    else root.scrollTop = 0;
  }, [anchorId, html, pane]);

  useEffect(() => {
    if (pane !== 'chapter' && contentRef.current) contentRef.current.scrollTop = 0;
  }, [pane, query]);

  /* ── keyboard: `/` and ctrl/cmd-K focus search, Escape backs out ─────────── */

  useEffect(() => {
    const onKey = e => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName || '');
      if (!typing && (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'))) {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }
      if (e.key === 'Escape') {
        if (navOpen) { setNavOpen(false); return; }
        if (showResults) { setShowResults(false); return; }
        if (query) { setQuery(''); searchRef.current?.blur(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen, showResults, query]);

  const chapterIdx = chapter ? book.chapters.indexOf(chapter) : -1;
  const prev = chapterIdx > 0 ? book.chapters[chapterIdx - 1] : null;
  const next = chapterIdx >= 0 && chapterIdx < book.chapters.length - 1 ? book.chapters[chapterIdx + 1] : null;

  return (
    <div className="wiki-root">
      <style>{WIKI_CSS}</style>

      <header className="wiki-topbar">
        <button
          className="wiki-burger"
          type="button"
          onClick={() => setNavOpen(v => !v)}
          aria-label="Contents"
        >☰</button>
        <button className="wiki-brand" type="button" onClick={() => go('')}>
          <span className="wiki-brand-ico">📖</span>
          <span className="wiki-brand-txt">GPT RULEBOOK</span>
          <span className="wiki-ver">v{book.version || '?'}</span>
        </button>
        <div className="wiki-searchwrap">
          <span className="wiki-search-ico" aria-hidden="true">🔎</span>
          <input
            ref={searchRef}
            className="wiki-search"
            placeholder="Search every rule…"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowResults(true); }}
            onFocus={() => { if (query.trim().length >= 2) setShowResults(true); }}
            aria-label="Search the rulebook"
          />
          {query
            ? <button className="wiki-search-clear" type="button" onClick={() => { setQuery(''); setShowResults(false); searchRef.current?.focus(); }} aria-label="Clear search">✕</button>
            : <span className="wiki-kbd" aria-hidden="true">/</span>}
        </div>
        <a className="wiki-back" href="/">← Sheet</a>
      </header>

      <div className="wiki-body">
        {navOpen && <div className="wiki-scrim" onClick={() => setNavOpen(false)} />}

        <nav className={`wiki-toc${navOpen ? ' open' : ''}`} aria-label="Contents">
          <button
            className={`wiki-toc-home${pane === 'home' ? ' active' : ''}`}
            type="button"
            onClick={() => go('')}
          >⌂ Contents</button>
          {book.chapters.map(c => {
            const active = c.id === chapterId;
            return (
              <div key={c.id} className={`wiki-toc-group${active ? ' active' : ''}`}>
                <button className="wiki-toc-ch" type="button" onClick={() => go(c.id)}>
                  <span className="wiki-toc-num">{c.num || '·'}</span>
                  <span>{stripNum(c.title)}</span>
                </button>
                {active && c.sections.filter(s => s.level === 3).map(s => (
                  <button
                    key={s.id}
                    className={`wiki-toc-sec${s.id === anchorId ? ' here' : ''}`}
                    type="button"
                    onClick={() => go(s.id)}
                  >{s.title}</button>
                ))}
              </div>
            );
          })}
        </nav>

        <main className="wiki-content" ref={contentRef}>
          {pane === 'search' && (
            <SearchPane
              query={query}
              results={results}
              onPick={go}
              onClose={() => setShowResults(false)}
            />
          )}

          {pane === 'home' && (
            <HomePane book={book} pinned={pinned} onPick={go} />
          )}

          {pane === 'chapter' && chapter && (
            <article className="wiki-article">
              <div className="wiki-chapbar">
                <button className="wiki-crumb" type="button" onClick={() => go('')}>⌂ Contents</button>
                {chapter.sections.filter(s => s.level === 3).length > 0 && (
                  <div className="wiki-chips">
                    {chapter.sections.filter(s => s.level === 3).map(s => (
                      <button
                        key={s.id}
                        className={`wiki-chip${s.id === anchorId ? ' here' : ''}`}
                        type="button"
                        onClick={() => go(s.id)}
                      >{s.num || stripNum(s.title)}</button>
                    ))}
                  </div>
                )}
              </div>

              {query.trim().length >= 2 && (
                <button className="wiki-backtohits" type="button" onClick={() => setShowResults(true)}>
                  ← back to “{query.trim()}” results
                </button>
              )}

              <div
                key={chapter.id}
                className="wiki-md"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              <div className="wiki-pager">
                {prev
                  ? <button className="wiki-pagebtn" type="button" onClick={() => go(prev.id)}>
                      <span className="wiki-pagedir">← previous</span>
                      <span className="wiki-pagettl">{prev.title}</span>
                    </button>
                  : <span />}
                {next
                  ? <button className="wiki-pagebtn right" type="button" onClick={() => go(next.id)}>
                      <span className="wiki-pagedir">next →</span>
                      <span className="wiki-pagettl">{next.title}</span>
                    </button>
                  : <span />}
              </div>
            </article>
          )}
        </main>
      </div>

      {toast && <div className="wiki-toast">{toast}</div>}
    </div>
  );
}

/* ── panes ─────────────────────────────────────────────────────────────────── */

function HomePane({ book, pinned, onPick }) {
  return (
    <div className="wiki-home">
      <div className="wiki-hero">
        <h1>{book.title.replace(/^GALACTIC PRIME TIME\s*—\s*/i, '')}</h1>
        <p className="wiki-hero-sub">
          GALACTIC PRIME TIME · version {book.version || '?'}
          {book.date ? ` · ${book.date}` : ''} · {book.chapters.length} chapters
        </p>
        <p className="wiki-hero-hint">
          Press <kbd>/</kbd> to search every rule, not just the headings.
        </p>
      </div>

      {pinned.length > 0 && (
        <section className="wiki-sec">
          <h2 className="wiki-sec-h">⚡ Looked up most</h2>
          <div className="wiki-grid pins">
            {pinned.map(s => (
              <button key={s.id} className="wiki-pin" type="button" onClick={() => onPick(s.id)}>
                <span className="wiki-pin-num">§{s.num}</span>
                <span className="wiki-pin-ttl">{stripNum(s.title)}</span>
                <span className="wiki-pin-sum">{summarize(s.md, 92)}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="wiki-sec">
        <h2 className="wiki-sec-h">📚 The whole book</h2>
        <div className="wiki-grid chapters">
          {book.chapters.map(c => (
            <button key={c.id} className="wiki-chcard" type="button" onClick={() => onPick(c.id)}>
              <span className="wiki-chcard-num">{c.num || '·'}</span>
              <span className="wiki-chcard-body">
                <span className="wiki-chcard-ttl">{stripNum(c.title)}</span>
                <span className="wiki-chcard-sum">{summarize(c.ownMd, 108)}</span>
                {c.sections.filter(s => s.level === 3).length > 0 && (
                  <span className="wiki-chcard-meta">
                    {c.sections.filter(s => s.level === 3).length} sections
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SearchPane({ query, results, onPick, onClose }) {
  const q = query.trim();
  const hits = totalHits(results);
  return (
    <div className="wiki-results">
      <div className="wiki-results-head">
        <span className="wiki-results-count">
          {results.length === 0
            ? <>No rule mentions <b>{q}</b></>
            : <><b>{hits}</b> {hits === 1 ? 'mention' : 'mentions'} of <b>{q}</b> across <b>{results.length}</b> {results.length === 1 ? 'section' : 'sections'}</>}
        </span>
        <button className="wiki-results-close" type="button" onClick={onClose}>✕ close</button>
      </div>

      {results.length === 0 && (
        <p className="wiki-results-empty">
          Try fewer words, or a word the book itself uses — Force, tier, Clock, Moment,
          Exposure, carve, band.
        </p>
      )}

      <ol className="wiki-results-list">
        {results.map(r => (
          <li key={r.id}>
            <button className="wiki-result" type="button" onClick={() => onPick(r.id)}>
              <span className="wiki-result-top">
                <span className="wiki-result-num">{r.num ? `§${r.num}` : r.chapterTitle.replace(/^(\d+)\..*$/, '§$1')}</span>
                <span className="wiki-result-ttl">{stripNum(r.title)}</span>
                <span className="wiki-result-hits">{r.hits}×</span>
              </span>
              {!r.isChapter && <span className="wiki-result-in">in {r.chapterTitle}</span>}
              <span className="wiki-result-snip">
                {r.snippet.before}
                {r.snippet.match && <mark className="wiki-hit">{r.snippet.match}</mark>}
                {r.snippet.after}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** "8.2 Condition tiers" -> "Condition tiers" (the number is shown separately). */
function stripNum(title) {
  return String(title || '').replace(/^\s*\d+(\.\d+)*\s*[.)]?\s+/, '');
}

/* ── styles (scoped to .wiki-root; nothing here reaches the sheet) ─────────── */

const WIKI_CSS = `
.wiki-root {
  --w-rail: 272px;
  --w-ruled: var(--cyan); --w-warn: var(--gold); --w-open: var(--danger);
  --w-star: var(--purple); --w-cog: #6fb3c9; --w-stop: var(--danger);
  --w-done: var(--success); --w-draft: var(--gold); --w-aim: var(--mythic);
  --w-new: var(--success); --w-weigh: var(--silver);
  display: flex; flex-direction: column; height: 100vh; height: 100dvh;
  background: var(--bg); color: var(--text);
  font-family: system-ui, -apple-system, sans-serif; font-size: 14px;
  overflow: hidden;
}
.wiki-root *, .wiki-root *::before, .wiki-root *::after { box-sizing: border-box; }
.wiki-root button { font-family: inherit; }

/* ---- topbar ---- */
.wiki-topbar {
  display: flex; align-items: center; gap: 10px; flex: 0 0 auto;
  padding: 8px 14px; background: linear-gradient(180deg,#0b1024,#070a18);
  border-bottom: 1px solid var(--cyan); box-shadow: 0 2px 18px rgba(0,212,255,.12);
  position: relative; z-index: 30;
}
.wiki-burger {
  display: none; background: none; border: 1px solid var(--border); color: var(--text);
  border-radius: 4px; padding: 5px 9px; font-size: 14px; cursor: pointer; flex: 0 0 auto;
}
.wiki-burger:hover { border-color: var(--cyan); color: var(--cyan); }
.wiki-brand {
  display: flex; align-items: center; gap: 7px; background: none; border: none;
  cursor: pointer; padding: 2px 0; color: var(--cyan); flex: 0 0 auto;
}
.wiki-brand-ico { font-size: 15px; }
.wiki-brand-txt {
  font-weight: 900; letter-spacing: 3px; font-size: 13px; text-transform: uppercase;
  text-shadow: 0 0 16px rgba(0,212,255,.55); white-space: nowrap;
}
.wiki-brand:hover .wiki-brand-txt { color: #7fe8ff; }
.wiki-ver {
  font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700;
  color: var(--gold); background: rgba(200,168,75,.12);
  border: 1px solid rgba(200,168,75,.35); border-radius: 3px; padding: 1px 6px;
}
.wiki-searchwrap { position: relative; flex: 1 1 auto; min-width: 0; max-width: 620px; }
.wiki-search-ico {
  position: absolute; left: 9px; top: 50%; transform: translateY(-50%);
  font-size: 12px; opacity: .65; pointer-events: none;
}
.wiki-search {
  width: 100%; padding: 8px 34px 8px 30px; background: #05070f; color: var(--text);
  border: 1px solid var(--border); border-radius: 5px; font-family: inherit; font-size: 13px;
}
.wiki-search::placeholder { color: var(--muted); }
.wiki-search:focus {
  outline: none; border-color: var(--cyan); box-shadow: 0 0 0 2px rgba(0,212,255,.16);
}
.wiki-kbd {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  font-family: 'Courier New', monospace; font-size: 10px; color: var(--muted);
  border: 1px solid var(--border); border-radius: 3px; padding: 0 5px; pointer-events: none;
}
.wiki-search-clear {
  position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--muted); cursor: pointer;
  font-size: 12px; padding: 2px 5px;
}
.wiki-search-clear:hover { color: var(--danger); }
.wiki-back {
  color: var(--muted); text-decoration: none; font-size: 11px; letter-spacing: 1px;
  text-transform: uppercase; font-weight: 700; white-space: nowrap; flex: 0 0 auto;
}
.wiki-back:hover { color: var(--cyan); }

/* ---- layout ---- */
.wiki-body { display: flex; flex: 1 1 auto; min-height: 0; position: relative; }
.wiki-scrim { display: none; }

.wiki-toc {
  width: var(--w-rail); flex: 0 0 var(--w-rail); overflow-y: auto; padding: 10px 8px 60px;
  border-right: 1px solid var(--border); background: #06081a;
}
.wiki-toc-home {
  width: 100%; text-align: left; background: none; border: 1px solid transparent;
  color: var(--muted); cursor: pointer; padding: 7px 9px; border-radius: 4px;
  font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  margin-bottom: 8px;
}
.wiki-toc-home:hover { color: var(--cyan); border-color: var(--border); }
.wiki-toc-home.active { color: var(--cyan); background: rgba(0,212,255,.08); border-color: rgba(0,212,255,.3); }
.wiki-toc-group { margin-bottom: 1px; }
.wiki-toc-ch {
  width: 100%; display: flex; gap: 8px; align-items: baseline; text-align: left;
  background: none; border: none; color: var(--text); cursor: pointer;
  padding: 6px 8px; border-radius: 4px; font-size: 12.5px; line-height: 1.3;
  border-left: 2px solid transparent;
}
.wiki-toc-ch:hover { background: rgba(0,212,255,.06); color: #dcecff; }
.wiki-toc-group.active > .wiki-toc-ch {
  color: var(--cyan); font-weight: 700; border-left-color: var(--cyan);
  background: rgba(0,212,255,.07);
}
.wiki-toc-num {
  font-family: 'Courier New', monospace; font-size: 10px; color: var(--muted);
  min-width: 18px; flex: 0 0 auto; text-align: right;
}
.wiki-toc-group.active .wiki-toc-num { color: var(--cyan); }
.wiki-toc-sec {
  display: block; width: 100%; text-align: left; background: none; border: none;
  color: var(--muted); cursor: pointer; padding: 4px 8px 4px 30px; border-radius: 4px;
  font-size: 11.5px; line-height: 1.35;
}
.wiki-toc-sec:hover { color: var(--text); background: rgba(255,255,255,.03); }
.wiki-toc-sec.here { color: var(--gold); }

.wiki-content { flex: 1 1 auto; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; }

/* ---- home ---- */
.wiki-home { max-width: 1060px; margin: 0 auto; padding: 26px 20px 80px; }
.wiki-hero { border-bottom: 1px solid var(--border); padding-bottom: 16px; margin-bottom: 22px; }
.wiki-hero h1 {
  font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #e6f4ff;
  line-height: 1.2; margin-bottom: 6px;
}
.wiki-hero-sub {
  font-size: 10.5px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted);
}
.wiki-hero-hint { font-size: 12px; color: var(--muted); margin-top: 8px; }
.wiki-hero-hint kbd {
  font-family: 'Courier New', monospace; border: 1px solid var(--border);
  border-radius: 3px; padding: 0 5px; color: var(--cyan);
}
.wiki-sec { margin-bottom: 30px; }
.wiki-sec-h {
  font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted);
  border-left: 3px solid var(--cyan); padding-left: 9px; margin-bottom: 12px; font-weight: 700;
}
.wiki-grid { display: grid; gap: 10px; }
.wiki-grid.pins { grid-template-columns: repeat(auto-fill, minmax(215px, 1fr)); }
.wiki-grid.chapters { grid-template-columns: repeat(auto-fill, minmax(268px, 1fr)); }

.wiki-pin {
  display: flex; flex-direction: column; gap: 4px; text-align: left; cursor: pointer;
  background: linear-gradient(160deg, rgba(200,168,75,.10), rgba(9,12,26,.9));
  border: 1px solid rgba(200,168,75,.32); border-radius: 6px; padding: 11px 12px;
  transition: border-color .15s, transform .15s, box-shadow .15s;
}
.wiki-pin:hover {
  border-color: var(--gold); transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(200,168,75,.16);
}
.wiki-pin-num {
  font-family: 'Courier New', monospace; font-size: 10px; font-weight: 700;
  color: var(--gold); letter-spacing: 1px;
}
.wiki-pin-ttl { font-size: 13.5px; font-weight: 700; color: #ffe9b0; line-height: 1.25; }
.wiki-pin-sum { font-size: 11px; color: var(--muted); line-height: 1.4; }

.wiki-chcard {
  display: flex; gap: 11px; align-items: flex-start; text-align: left; cursor: pointer;
  background: var(--panel); border: 1px solid var(--border); border-radius: 6px;
  padding: 12px; transition: border-color .15s, transform .15s, background .15s;
}
.wiki-chcard:hover {
  border-color: var(--cyan); transform: translateY(-2px); background: var(--panel2);
}
.wiki-chcard-num {
  font-family: 'Courier New', monospace; font-size: 17px; font-weight: 700;
  color: var(--cyan); opacity: .8; min-width: 26px; flex: 0 0 auto; line-height: 1.1;
}
.wiki-chcard-body { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.wiki-chcard-ttl { font-size: 14px; font-weight: 700; color: #dcecff; line-height: 1.25; }
.wiki-chcard-sum { font-size: 11.5px; color: var(--muted); line-height: 1.45; }
.wiki-chcard-meta {
  font-size: 9.5px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted);
  opacity: .8; margin-top: 2px;
}

/* ---- search results ---- */
.wiki-results { max-width: 900px; margin: 0 auto; padding: 18px 20px 80px; }
.wiki-results-head {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  flex-wrap: wrap; border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 14px;
}
.wiki-results-count { font-size: 12px; color: var(--muted); }
.wiki-results-count b { color: var(--cyan); }
.wiki-results-close {
  background: none; border: 1px solid var(--border); border-radius: 4px; color: var(--muted);
  cursor: pointer; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 9px;
}
.wiki-results-close:hover { color: var(--danger); border-color: var(--danger); }
.wiki-results-empty { font-size: 12.5px; color: var(--muted); line-height: 1.6; }
.wiki-results-list { list-style: none; display: flex; flex-direction: column; gap: 7px; }
.wiki-result {
  display: flex; flex-direction: column; gap: 4px; width: 100%; text-align: left; cursor: pointer;
  background: var(--panel); border: 1px solid var(--border); border-left: 3px solid var(--border);
  border-radius: 5px; padding: 10px 12px; transition: border-color .12s, background .12s;
}
.wiki-result:hover { background: var(--panel2); border-left-color: var(--cyan); border-color: rgba(0,212,255,.35); }
.wiki-result-top { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.wiki-result-num {
  font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700; color: var(--gold);
}
.wiki-result-ttl { font-size: 13.5px; font-weight: 700; color: #dcecff; }
.wiki-result-hits {
  margin-left: auto; font-family: 'Courier New', monospace; font-size: 10px; color: var(--muted);
  border: 1px solid var(--border); border-radius: 10px; padding: 1px 7px; flex: 0 0 auto;
}
.wiki-result-in {
  font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); opacity: .75;
}
.wiki-result-snip { font-size: 12px; color: var(--text); opacity: .85; line-height: 1.5; }

mark.wiki-hit {
  background: rgba(0,212,255,.22); color: #b6f0ff; border-radius: 2px; padding: 0 1px;
  box-shadow: 0 0 0 1px rgba(0,212,255,.3);
}

/* ---- chapter ---- */
.wiki-article { max-width: 880px; margin: 0 auto; padding: 0 20px 90px; }
.wiki-chapbar {
  position: sticky; top: 0; z-index: 10; display: flex; align-items: center; gap: 10px;
  background: rgba(4,5,13,.94); backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--border); padding: 8px 0; margin-bottom: 4px; flex-wrap: wrap;
}
.wiki-crumb {
  background: none; border: 1px solid var(--border); border-radius: 4px; color: var(--muted);
  cursor: pointer; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
  padding: 4px 9px; flex: 0 0 auto;
}
.wiki-crumb:hover { color: var(--cyan); border-color: var(--cyan); }
.wiki-chips { display: flex; gap: 5px; flex-wrap: wrap; min-width: 0; }
.wiki-chip {
  background: rgba(255,255,255,.03); border: 1px solid var(--border); border-radius: 12px;
  color: var(--muted); cursor: pointer; font-family: 'Courier New', monospace;
  font-size: 11px; padding: 2px 9px;
}
.wiki-chip:hover { color: var(--cyan); border-color: var(--cyan); }
.wiki-chip.here { color: var(--bg); background: var(--cyan); border-color: var(--cyan); font-weight: 700; }
.wiki-backtohits {
  display: block; margin: 10px 0 0; background: rgba(0,212,255,.08);
  border: 1px solid rgba(0,212,255,.3); border-radius: 4px; color: var(--cyan);
  cursor: pointer; font-size: 11px; padding: 5px 10px;
}
.wiki-backtohits:hover { background: rgba(0,212,255,.16); }

/* ---- rendered markdown ---- */
.wiki-md { padding-top: 6px; line-height: 1.65; }
.wiki-md h2, .wiki-md h3, .wiki-md h4, .wiki-md h5, .wiki-md h6 {
  scroll-margin-top: 54px; position: relative; line-height: 1.25;
}
.wiki-md h2 {
  font-size: 22px; font-weight: 900; color: #e6f4ff; letter-spacing: .5px;
  margin: 18px 0 14px; padding-bottom: 9px; border-bottom: 2px solid var(--cyan);
}
.wiki-md h3 {
  font-size: 16.5px; font-weight: 800; color: var(--cyan); margin: 30px 0 10px;
  padding: 7px 0 7px 11px; border-left: 3px solid var(--cyan);
  background: linear-gradient(90deg, rgba(0,212,255,.08), transparent 70%);
  border-radius: 0 4px 4px 0;
}
.wiki-md h4 {
  font-size: 13.5px; font-weight: 800; color: var(--gold); margin: 22px 0 8px;
  letter-spacing: 1.2px; text-transform: uppercase;
}
.wiki-md h5, .wiki-md h6 { font-size: 12.5px; font-weight: 700; color: var(--text); margin: 16px 0 6px; }
.wiki-md p { margin: 0 0 12px; }
.wiki-md ul, .wiki-md ol { margin: 0 0 12px; padding-left: 22px; }
.wiki-md li { margin: 5px 0; }
.wiki-md li > ul, .wiki-md li > ol { margin: 5px 0 0; }
.wiki-md strong { color: #e8f2ff; font-weight: 700; }
.wiki-md em { color: #cfe0f5; }
.wiki-md a { color: var(--cyan); }
.wiki-md hr { border: none; border-top: 1px solid var(--border); margin: 26px 0; }
.wiki-md code {
  font-family: 'Courier New', monospace; font-size: .88em; color: var(--gold);
  background: rgba(200,168,75,.08); border: 1px solid rgba(200,168,75,.2);
  border-radius: 3px; padding: 0 4px;
}
.wiki-md blockquote {
  margin: 14px 0; padding: 11px 15px; border-left: 3px solid var(--gold);
  background: linear-gradient(90deg, rgba(200,168,75,.10), rgba(200,168,75,.02));
  border-radius: 0 5px 5px 0; color: #ecdfc0;
}
.wiki-md blockquote p:last-child { margin-bottom: 0; }

.wiki-anchor {
  background: none; border: none; color: var(--muted); cursor: pointer; opacity: 0;
  font-size: .72em; padding: 0 6px; transition: opacity .12s, color .12s; vertical-align: middle;
}
.wiki-md h2:hover .wiki-anchor, .wiki-md h3:hover .wiki-anchor,
.wiki-md h4:hover .wiki-anchor, .wiki-md h5:hover .wiki-anchor,
.wiki-md h6:hover .wiki-anchor, .wiki-anchor:focus { opacity: 1; }
.wiki-anchor:hover { color: var(--cyan); }

/* ---- tables as reference cards ---- */
.wiki-tblwrap {
  overflow-x: auto; margin: 12px 0; border: 1px solid var(--border);
  border-radius: 6px; background: #05070f; -webkit-overflow-scrolling: touch;
}
.wiki-md table { border-collapse: collapse; width: 100%; font-size: 12.8px; min-width: 100%; }
.wiki-md th, .wiki-md td {
  padding: 7px 11px; text-align: left; vertical-align: top;
  border-bottom: 1px solid var(--border); line-height: 1.5;
}
.wiki-md th {
  background: #0b1024; color: var(--cyan); font-size: 9.5px; font-weight: 700;
  letter-spacing: 1.6px; text-transform: uppercase; white-space: nowrap;
  border-bottom: 1px solid var(--cyan); position: sticky; top: 0;
}
.wiki-md tbody tr:last-child td { border-bottom: none; }
.wiki-md tbody tr:nth-child(even) td { background: rgba(255,255,255,.018); }
.wiki-md tbody tr:hover td { background: rgba(0,212,255,.05); }
.wiki-md table.keyed td:first-child { color: #dcecff; font-weight: 700; white-space: nowrap; }

.wiki-md td.wiki-tiercell {
  font-family: 'Courier New', monospace; font-weight: 700; text-align: center;
  white-space: nowrap; width: 1%; font-size: 12px;
}
.wiki-md td.wiki-tiercell[data-tier="1"] { color: var(--success); background: rgba(0,255,136,.07); border-left: 3px solid var(--success); }
.wiki-md td.wiki-tiercell[data-tier="2"] { color: var(--gold); background: rgba(200,168,75,.09); border-left: 3px solid var(--gold); }
.wiki-md td.wiki-tiercell[data-tier="3"] { color: #ff9a3c; background: rgba(255,154,60,.10); border-left: 3px solid #ff9a3c; }
.wiki-md td.wiki-tiercell[data-tier="4"] { color: var(--danger); background: rgba(255,34,85,.13); border-left: 3px solid var(--danger); }

.wiki-card {
  margin: 16px 0; border: 1px solid var(--border); border-radius: 7px;
  background: linear-gradient(180deg, var(--panel), #05070f); overflow: hidden;
}
.wiki-card .wiki-card-head {
  margin: 0; padding: 10px 13px; background: rgba(0,212,255,.05);
  border-bottom: 1px solid var(--border); font-size: 13px;
}
.wiki-card .wiki-card-head strong { color: var(--cyan); letter-spacing: .5px; }
.wiki-card .wiki-tblwrap { margin: 0; border: none; border-radius: 0; background: transparent; }

/* ---- the book's own markers, as callouts ---- */
.wiki-md .wiki-callout {
  position: relative; border-left: 3px solid var(--border);
  background: rgba(255,255,255,.022); border-radius: 0 5px 5px 0;
  padding: 9px 13px; margin: 12px 0;
}
.wiki-md li.wiki-callout { margin: 7px 0; padding: 7px 11px; list-style: none; margin-left: -22px; }
.wiki-md .wiki-callout[data-mk="ruled"] { border-left-color: var(--w-ruled); background: rgba(0,212,255,.055); }
.wiki-md .wiki-callout[data-mk="warn"]  { border-left-color: var(--w-warn);  background: rgba(200,168,75,.06); }
.wiki-md .wiki-callout[data-mk="open"]  { border-left-color: var(--w-open);  background: rgba(255,34,85,.06); }
.wiki-md .wiki-callout[data-mk="stop"]  { border-left-color: var(--w-stop);  background: rgba(255,34,85,.08); }
.wiki-md .wiki-callout[data-mk="star"]  { border-left-color: var(--w-star);  background: rgba(168,85,247,.06); }
.wiki-md .wiki-callout[data-mk="cog"]   { border-left-color: var(--w-cog);   background: rgba(111,179,201,.05); }
.wiki-md .wiki-callout[data-mk="done"]  { border-left-color: var(--w-done);  background: rgba(0,255,136,.05); }
.wiki-md .wiki-callout[data-mk="draft"] { border-left-color: var(--w-draft); background: rgba(200,168,75,.045); }
.wiki-md .wiki-callout[data-mk="aim"]   { border-left-color: var(--w-aim);   background: rgba(236,72,153,.055); }
.wiki-md .wiki-callout[data-mk="new"]   { border-left-color: var(--w-new);   background: rgba(0,255,136,.05); }
.wiki-md .wiki-callout[data-mk="weigh"] { border-left-color: var(--w-weigh); background: rgba(192,192,192,.045); }
.wiki-md .wiki-callout::after {
  content: attr(data-mk-label); position: absolute; top: -8px; right: 9px;
  font-size: 8px; font-weight: 700; letter-spacing: 1.6px; color: var(--muted);
  background: var(--bg); padding: 0 5px; border-radius: 2px;
}
.wiki-md .wiki-callout[data-mk="ruled"]::after { color: var(--w-ruled); }
.wiki-md .wiki-callout[data-mk="open"]::after,
.wiki-md .wiki-callout[data-mk="stop"]::after { color: var(--w-open); }
.wiki-md .wiki-callout[data-mk="warn"]::after { color: var(--w-warn); }

/* ---- pager ---- */
.wiki-pager {
  display: flex; justify-content: space-between; gap: 12px; margin-top: 36px;
  padding-top: 18px; border-top: 1px solid var(--border);
}
.wiki-pagebtn {
  display: flex; flex-direction: column; gap: 3px; text-align: left; cursor: pointer;
  background: var(--panel); border: 1px solid var(--border); border-radius: 6px;
  padding: 9px 13px; max-width: 47%;
}
.wiki-pagebtn.right { text-align: right; align-items: flex-end; }
.wiki-pagebtn:hover { border-color: var(--cyan); background: var(--panel2); }
.wiki-pagedir {
  font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted);
}
.wiki-pagettl { font-size: 12.5px; color: #dcecff; font-weight: 700; }

/* ---- toast ---- */
.wiki-toast {
  position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%); z-index: 60;
  background: #0b1024; border: 1px solid var(--cyan); border-radius: 5px;
  color: var(--cyan); font-size: 12px; padding: 8px 16px;
  box-shadow: 0 6px 26px rgba(0,0,0,.6); max-width: 90vw; overflow-wrap: anywhere;
}

/* ---- phone ---- */
@media (max-width: 860px) {
  .wiki-burger { display: block; }
  .wiki-topbar { flex-wrap: wrap; padding: 7px 10px; gap: 8px; }
  .wiki-searchwrap { order: 5; flex: 1 0 100%; max-width: none; }
  .wiki-brand-txt { font-size: 11px; letter-spacing: 2px; }
  .wiki-kbd { display: none; }
  .wiki-toc {
    position: absolute; inset: 0 auto 0 0; z-index: 25; transform: translateX(-100%);
    transition: transform .18s ease; box-shadow: 4px 0 24px rgba(0,0,0,.6);
    width: min(84vw, var(--w-rail)); flex-basis: auto;
  }
  .wiki-toc.open { transform: translateX(0); }
  .wiki-scrim { display: block; position: absolute; inset: 0; z-index: 20; background: rgba(0,0,0,.55); }
  .wiki-home, .wiki-results, .wiki-article { padding-left: 16px; padding-right: 16px; }
  .wiki-grid.pins, .wiki-grid.chapters { grid-template-columns: 1fr; }
  .wiki-hero h1 { font-size: 19px; }
  .wiki-md h2 { font-size: 18px; }
  .wiki-md h3 { font-size: 15px; }
  .wiki-md { font-size: 13.5px; }
  .wiki-md table { font-size: 12px; }
  .wiki-md th, .wiki-md td { padding: 6px 8px; }
  .wiki-md th { position: static; }
  .wiki-pagebtn { max-width: 48%; }
  .wiki-md li.wiki-callout { margin-left: -14px; }
  .wiki-md ul, .wiki-md ol { padding-left: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .wiki-content { scroll-behavior: auto; }
  .wiki-pin:hover, .wiki-chcard:hover { transform: none; }
  .wiki-toc { transition: none; }
}
`;
