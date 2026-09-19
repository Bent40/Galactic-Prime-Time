/**
 * wikiIndex.js — pure helpers for the player-facing Wiki.
 *
 * NOTHING in here touches React, the DOM or the network. It takes the raw
 * markdown of `rulebook/gpt-system-v1.0.md` (imported with `?raw`, one committed
 * copy, no drift) and turns it into the structure the Wiki navigates:
 *
 *   parseVersion  — reads the version out of the book's own header, so the
 *                   topbar can never go stale again (it used to say "v1.0").
 *   slugify       — STABLE, UNIQUE anchor ids. The old one stripped every
 *                   non-alphanumeric, so "12.3 Modifiers" and "1.23 Modifiers"
 *                   both became "123-modifiers", and `§` vanished entirely.
 *   parseRulebook — the book as chapters -> sections, each carrying its own
 *                   markdown so the Wiki can render ONE chapter at a time.
 *   buildIndex / searchIndex — full-text search over the body, not just the
 *                   headings. Finding one rule mid-session is the whole job.
 *
 * Tested by wikiIndex.test.mjs against the real rulebook file.
 */

/** Markers the book uses consistently. Order matters: check longest first. */
export const MARKERS = [
  { glyph: '⛔', kind: 'stop' },
  { glyph: '🔒', kind: 'ruled' },
  { glyph: '⚠️', kind: 'warn' },
  { glyph: '🔴', kind: 'open' },
  { glyph: '⭐', kind: 'star' },
  { glyph: '⚙️', kind: 'cog' },
  { glyph: '✅', kind: 'done' },
  { glyph: '🟡', kind: 'draft' },
  { glyph: '🎯', kind: 'aim' },
  { glyph: '🆕', kind: 'new' },
  { glyph: '⚡', kind: 'star' },
  { glyph: '⚖️', kind: 'weigh' },
  // bare code points, in case a later edit drops the variation selector
  { glyph: '⚖', kind: 'weigh' },
  { glyph: '⚠', kind: 'warn' },
  { glyph: '⚙', kind: 'cog' },
];

/**
 * The book's own header line: `**Version 1.10** · 2026-09-18 — ...`
 * Returns `{ version, date }`; either may be null if the header ever changes
 * shape, and the caller must cope rather than print a wrong number.
 */
export function parseVersion(raw) {
  const m = /\*\*Version\s+([0-9]+(?:\.[0-9]+)*)\*\*(?:\s*[·-]\s*(\d{4}-\d{2}-\d{2}))?/.exec(
    String(raw || '').slice(0, 4000),
  );
  return { version: m ? m[1] : null, date: m && m[2] ? m[2] : null };
}

/**
 * A slug that survives the book's numbering.
 *
 *  - `§` becomes `s` instead of disappearing.
 *  - a dot BETWEEN DIGITS becomes a hyphen, so 12.3 and 1.23 cannot collide.
 *  - everything else non-alphanumeric collapses to a single hyphen.
 *
 * Never returns an empty string: a heading of pure punctuation gets 'section'.
 */
export function slugify(text) {
  const s = String(text == null ? '' : text)
    .toLowerCase()
    .replace(/§/g, 's')
    .replace(/(\d)\.(\d)/g, '$1-$2')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'section';
}

/** `### 12.3 Weapon tiers` -> '12.3'. Returns '' when a heading is unnumbered. */
export function sectionNumber(title) {
  const m = /^\s*§?\s*(\d+(?:\.\d+)*)\s*[.)]?\s+\S/.exec(String(title || ''));
  return m ? m[1] : '';
}

/** Strip the inline markdown a human never wants to read in a search snippet. */
export function plainText(md) {
  return String(md == null ? '' : md)
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*\|[\s:|-]+\|\s*$/gm, ' ')
    .replace(/\|/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*|__|\*|_|~~/g, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+[.)]\s+/gm, '')
    .replace(/\\/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/** A one-line gist for a card, taken from the section's own first sentence. */
export function summarize(md, maxLen = 150) {
  // Drop EVERY heading line, not just the first: §7.3 opens straight onto an h4,
  // so a card summarising it would otherwise read "Force — the unit everything
  // is measured in One Force is one basic punch."
  const prose = String(md == null ? '' : md)
    .split('\n')
    .filter(l => !/^\s{0,3}#{1,6}\s/.test(l))
    .join('\n');
  const body = plainText(prose)
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .join(' ')
    .trim();
  if (!body) return '';
  // first sentence, or the first chunk up to maxLen on a word boundary
  const dot = body.search(/[.!?](\s|$)/);
  let out = dot >= 14 && dot < maxLen ? body.slice(0, dot + 1) : body;
  if (out.length > maxLen) {
    out = out.slice(0, maxLen);
    const sp = out.lastIndexOf(' ');
    if (sp > 40) out = out.slice(0, sp);
    out += '…';
  }
  return out;
}

/**
 * Split the raw book into chapters (`##`) each holding its sections (`###`,
 * `####`). Every node carries its own markdown slice so the Wiki can render one
 * chapter without re-parsing the other twenty.
 *
 * Ids are made unique across the WHOLE document, including h4s, which the old
 * Wiki never gave an id at all (so §7.3's "Force — the unit everything is
 * measured in" was unlinkable — and it is the single most looked-up heading).
 */
export function parseRulebook(raw) {
  const text = String(raw == null ? '' : raw);
  const lines = text.split('\n');
  const { version, date } = parseVersion(text);

  const heads = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^(#{1,6})\s+(.*\S)\s*$/.exec(lines[i]);
    if (m) heads.push({ level: m[1].length, title: m[2].trim(), line: i });
  }

  const seen = new Map();
  const uniqueId = base => {
    const n = seen.get(base) || 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  };

  const trimHr = s => s.replace(/\s*\n-{3,}\s*$/, '').trimEnd();

  const nodes = heads.map((h, i) => {
    const end = i + 1 < heads.length ? heads[i + 1].line : lines.length;
    // deep end: this heading AND everything nested under it
    let deepEnd = lines.length;
    for (let j = i + 1; j < heads.length; j++) {
      if (heads[j].level <= h.level) { deepEnd = heads[j].line; break; }
    }
    return {
      id: uniqueId(`sec-${slugify(h.title)}`),
      num: sectionNumber(h.title),
      level: h.level,
      title: h.title,
      // own markdown: heading line through to the NEXT heading of any level
      md: trimHr(lines.slice(h.line, end).join('\n')),
      // with children: what a reader sees under this heading. §7.3's own body is
      // empty — it opens straight onto an h4 — so a card or snippet for it has
      // to look one level down or it prints nothing at all.
      fullMd: trimHr(lines.slice(h.line, deepEnd).join('\n')),
      line: h.line,
    };
  });

  const title = nodes.length && nodes[0].level === 1 ? nodes[0].title : 'Rulebook';
  const intro = lines.slice(0, heads.length ? heads[0].line : 0).join('\n').trim();

  // Chapters are the h2s; everything deeper belongs to the chapter above it.
  const chapters = [];
  const flat = [];
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n.level <= 1) continue;
    if (n.level === 2) {
      const chapter = {
        ...n,
        md: n.fullMd,   // a chapter renders WITH its subsections
        ownMd: n.md,    // ... but summarises from its own preamble
        sections: [],
      };
      chapters.push(chapter);
      flat.push({ ...n, chapterId: chapter.id, chapterTitle: chapter.title, isChapter: true });
    } else if (chapters.length) {
      const chapter = chapters[chapters.length - 1];
      const sec = { ...n, chapterId: chapter.id, chapterTitle: chapter.title, isChapter: false };
      chapter.sections.push(sec);
      flat.push(sec);
    }
  }

  return { version, date, title, intro, chapters, sections: flat };
}

/**
 * Searchable rows: one per heading, holding that heading's own body text.
 * A chapter row carries ONLY its own preamble, not its children's text, so a hit
 * is attributed to the smallest heading that actually contains the words.
 */
export function buildIndex(parsed) {
  const dropHeading = md => String(md == null ? '' : md).split('\n').slice(1).join('\n');
  return (parsed.sections || []).map(s => {
    // MATCHED text is the heading's own body — the heading line is searched
    // separately, so a snippet never opens by quoting back the title the reader
    // is already looking at, and a hit is credited to the smallest heading that
    // really contains the words rather than to the chapter around it.
    const body = plainText(dropHeading(s.md));
    // PREVIEW text may reach into the children, because some headings (§7.3)
    // open straight onto a subheading and have no body of their own.
    const preview = body || plainText(dropHeading(s.fullMd));
    return {
      id: s.id,
      num: s.num,
      title: s.title,
      level: s.level,
      chapterId: s.chapterId,
      chapterTitle: s.chapterTitle,
      isChapter: !!s.isChapter,
      text: body,
      preview,
      lowerText: body.toLowerCase(),
      lowerTitle: String(s.title).toLowerCase(),
    };
  });
}

const isWordChar = ch => ch >= 'a' && ch <= 'z' || ch >= '0' && ch <= '9';

/**
 * Count occurrences, separating the ones that START A WORD from the ones buried
 * mid-word. Substring matching is what makes typing "condi" useful, but without
 * this split "hold" scores a direct hit inside every "threshold" in the book —
 * which is exactly how §14 Dodge Thresholds out-ranked the section that
 * actually defines the Hold Threshold.
 */
function countHits(haystack, needle) {
  if (!needle) return { total: 0, word: 0 };
  let total = 0, word = 0, i = 0;
  for (;;) {
    const at = haystack.indexOf(needle, i);
    if (at === -1) return { total, word };
    total++;
    if (at === 0 || !isWordChar(haystack[at - 1])) word++;
    i = at + needle.length;
  }
}

/**
 * A snippet around the first hit, returned as three pieces so the caller can
 * wrap the middle in <mark> without ever building HTML from user input.
 */
export function snippet(text, term, radius = 90) {
  const clean0 = s => s.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ');
  const at = text.toLowerCase().indexOf(String(term || '').toLowerCase());
  if (at === -1) {
    // title-only hit: open with the section's own first words, cut on a word
    let head = clean0(text.slice(0, radius * 2));
    if (text.length > radius * 2) {
      const sp = head.lastIndexOf(' ');
      head = (sp > radius ? head.slice(0, sp) : head) + '…';
    }
    return { before: head, match: '', after: '' };
  }
  let start = Math.max(0, at - radius);
  let end = Math.min(text.length, at + term.length + radius);
  if (start > 0) {
    const sp = text.indexOf(' ', start);
    if (sp !== -1 && sp < at) start = sp + 1;
  }
  const clean = s => s.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ');
  return {
    before: (start > 0 ? '…' : '') + clean(text.slice(start, at)),
    match: text.slice(at, at + term.length),
    after: clean(text.slice(at + term.length, end)) + (end < text.length ? '…' : ''),
  };
}

/**
 * AND search over every term, scored so that a title hit outranks a body hit.
 * Returns the whole ranked list; the caller decides how many to show.
 */
export function searchIndex(index, query, limit = 60) {
  const q = String(query || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (q.length < 2) return [];
  const terms = q.split(' ').filter(t => t.length > 0);
  const out = [];

  for (const row of index) {
    let score = 0;
    let ok = true;
    let limiting = Infinity;      // the rarest term decides the honest count
    let anchor = terms[0];        // and anchors the snippet
    let anchorSeen = Infinity;

    for (const t of terms) {
      const title = countHits(row.lowerTitle, t);
      const body = countHits(row.lowerText, t);
      if (!title.total && !body.total) { ok = false; break; }
      score += title.word * 60 + (title.total - title.word) * 8;
      score += body.word * 4 + (body.total - body.word) * 1;
      const here = title.total + body.total;
      if (here < limiting) limiting = here;
      if (body.total > 0 && body.total < anchorSeen) { anchorSeen = body.total; anchor = t; }
    }
    if (!ok) continue;

    // whole-phrase hits are what somebody typing "hold threshold" wants first
    let hits = limiting;
    if (terms.length > 1) {
      const phraseTitle = countHits(row.lowerTitle, q).total;
      const phraseBody = countHits(row.lowerText, q).total;
      score += phraseTitle * 200 + phraseBody * 70;
      if (phraseBody + phraseTitle > 0) { hits = phraseBody + phraseTitle; anchor = q; }
    }
    // a deeper heading is a more precise answer than the chapter around it
    if (!row.isChapter) score += 5;

    out.push({ ...row, score, hits, term: anchor, snippet: snippet(row.preview, anchor) });
  }

  out.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return out.slice(0, limit);
}

/** Total occurrences across every section, for the "N matches" readout. */
export function totalHits(results) {
  return results.reduce((n, r) => n + r.hits, 0);
}

/** Resolve pinned quick-reference cards by SECTION NUMBER, never by slug. */
export function pickByNumber(parsed, numbers) {
  const byNum = new Map();
  for (const s of parsed.sections || []) if (s.num && !byNum.has(s.num)) byNum.set(s.num, s);
  return numbers.map(n => byNum.get(n)).filter(Boolean);
}
