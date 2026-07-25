import { useMemo, useRef, useState } from 'react';
import { marked } from 'marked';
import rulebookRaw from '../../../rulebook/gpt-system-v0.92.md?raw';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function stripMd(text) {
  return text.replace(/\*\*|\*|`|_/g, '').replace(/\\/g, '');
}

export default function Wiki() {
  const [filter, setFilter] = useState('');
  const contentRef = useRef(null);

  const { html, toc } = useMemo(() => {
    const rawHtml = marked.parse(rulebookRaw, { gfm: true, breaks: false });
    const entries = [];
    const seen = {};
    // Add ids to h1-h3 and collect a TOC. The book is our own committed file.
    const withIds = rawHtml.replace(/<h([123])>([\s\S]*?)<\/h\1>/g, (m, lvl, inner) => {
      const text = inner.replace(/<[^>]*>/g, '');
      let id = slugify(text) || 'section';
      if (seen[id] != null) id = `${id}-${++seen[id]}`;
      else seen[id] = 0;
      if (lvl !== '1') entries.push({ id, text: stripMd(text), level: Number(lvl) });
      return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
    });
    return { html: withIds, toc: entries };
  }, []);

  const visibleToc = filter
    ? toc.filter(e => e.text.toLowerCase().includes(filter.toLowerCase()))
    : toc;

  function jump(id) {
    const el = contentRef.current?.querySelector(`#${CSS.escape(id)}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="wiki-root">
      <style>{WIKI_CSS}</style>
      <div className="wiki-topbar">
        <div className="wiki-title">📖 GPT RULEBOOK <span className="wiki-ver">v0.92</span></div>
        <a className="wiki-back" href="/">← Back to sheet</a>
      </div>
      <div className="wiki-body">
        <nav className="wiki-toc">
          <input
            className="wiki-search"
            placeholder="Filter sections…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          {visibleToc.map(e => (
            <div
              key={e.id}
              className={`wiki-toc-item lvl${e.level}`}
              onClick={() => jump(e.id)}
            >
              {e.text}
            </div>
          ))}
        </nav>
        <main className="wiki-content" ref={contentRef}>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </main>
      </div>
    </div>
  );
}

const WIKI_CSS = `
.wiki-root { display:flex; flex-direction:column; height:100vh; background:#0d0d12; color:#e8e6e3; font-family: system-ui, sans-serif; }
.wiki-topbar { display:flex; align-items:center; justify-content:space-between; padding:10px 18px; background:#15151d; border-bottom:2px solid #e33; flex:0 0 auto; }
.wiki-title { font-weight:800; letter-spacing:2px; }
.wiki-ver { color:#e33; font-weight:600; margin-left:6px; }
.wiki-back { color:#9ad; text-decoration:none; font-size:14px; }
.wiki-back:hover { text-decoration:underline; }
.wiki-body { display:flex; flex:1 1 auto; min-height:0; }
.wiki-toc { width:270px; flex:0 0 auto; overflow-y:auto; padding:12px; border-right:1px solid #26262f; background:#111118; }
.wiki-search { width:100%; box-sizing:border-box; margin-bottom:10px; padding:6px 8px; background:#1c1c26; color:#e8e6e3; border:1px solid #33333f; border-radius:4px; }
.wiki-toc-item { cursor:pointer; padding:4px 6px; border-radius:4px; font-size:13.5px; line-height:1.3; color:#c8c6c2; }
.wiki-toc-item:hover { background:#22222e; color:#fff; }
.wiki-toc-item.lvl2 { font-weight:600; margin-top:6px; }
.wiki-toc-item.lvl3 { padding-left:18px; font-size:12.5px; }
.wiki-content { flex:1 1 auto; overflow-y:auto; padding:24px 36px 80px; max-width:100%; }
.wiki-content > div { max-width: 860px; margin: 0 auto; }
.wiki-content h1 { border-bottom:2px solid #e33; padding-bottom:8px; letter-spacing:1px; }
.wiki-content h2 { margin-top:2em; border-bottom:1px solid #33333f; padding-bottom:4px; }
.wiki-content h3 { margin-top:1.5em; color:#f2b2b2; }
.wiki-content table { border-collapse:collapse; margin:12px 0; width:100%; font-size:14px; }
.wiki-content th, .wiki-content td { border:1px solid #33333f; padding:6px 10px; text-align:left; vertical-align:top; }
.wiki-content th { background:#1c1c26; }
.wiki-content tr:nth-child(even) td { background:#14141c; }
.wiki-content blockquote { border-left:3px solid #e33; margin:12px 0; padding:6px 14px; background:#15151d; color:#d8d4cf; }
.wiki-content code { background:#1c1c26; padding:1px 5px; border-radius:3px; font-size:0.9em; }
.wiki-content hr { border:none; border-top:1px solid #26262f; margin:28px 0; }
.wiki-content a { color:#9ad; }
.wiki-content li { margin:3px 0; }
@media (max-width: 760px) {
  .wiki-toc { display:none; }
  .wiki-content { padding:16px; }
}
`;
