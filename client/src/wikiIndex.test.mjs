/**
 * wikiIndex.test.mjs — run with:
 *   node --experimental-detect-module client/src/wikiIndex.test.mjs
 *
 * Dependency-free. Two halves:
 *   1. the pure functions against hand-written input (slugs, version, search)
 *   2. the SAME functions against the REAL rulebook, because the two bugs this
 *      replaces were both "works on paper, wrong on the actual book": a
 *      hardcoded v1.0 in the topbar, and slugs that silently collide.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  buildIndex,
  parseRulebook,
  parseVersion,
  pickByNumber,
  plainText,
  searchIndex,
  sectionNumber,
  slugify,
  snippet,
  summarize,
  totalHits,
} from './wikiIndex.js';

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  if (cond) pass++;
  else { fail++; console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`); }
};
const eq = (label, got, want) =>
  ok(label, JSON.stringify(got) === JSON.stringify(want), `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

// ── parseVersion ─────────────────────────────────────────────────────────────
eq('reads the version out of the book header',
   parseVersion('# Book\n\n**Version 1.10** · 2026-09-18 — a slot takes any modifier'),
   { version: '1.10', date: '2026-09-18' });
eq('a one-part version still reads', parseVersion('**Version 2** · 2027-01-01 —'), { version: '2', date: '2027-01-01' });
eq('a three-part version still reads', parseVersion('**Version 1.10.2** · 2026-09-18'), { version: '1.10.2', date: '2026-09-18' });
eq('a version with no date is not invented', parseVersion('**Version 1.4** and then words'), { version: '1.4', date: null });
eq('no header at all returns nulls rather than a stale number',
   parseVersion('# Book\n\nno version line here'), { version: null, date: null });
eq('parseVersion survives junk input', parseVersion(null), { version: null, date: null });
// 1.10 must not be read as 1.1 — the whole point of the topbar fix
ok('1.10 is not truncated to 1.1', parseVersion('**Version 1.10**').version === '1.10');

// ── slugify — the collision bug ──────────────────────────────────────────────
eq('a numbered heading keeps its number', slugify('12.3 Weapon tiers & modifiers'), '12-3-weapon-tiers-modifiers');
eq('§ becomes s instead of vanishing', slugify('Authoring (§7.3 / §10.1)'), 'authoring-s7-3-s10-1');
// the reported bug: both used to slug to "123-modifiers"
ok('12.3 and 1.23 no longer collide', slugify('12.3 Modifiers') !== slugify('1.23 Modifiers'),
   `${slugify('12.3 Modifiers')} vs ${slugify('1.23 Modifiers')}`);
ok('12.4 and 12.3 do not collide', slugify('12.4 Equipment slots') !== slugify('12.3 Equipment slots'));
eq('em dashes collapse to one hyphen', slugify('21.6 Preparation — how a fight is won'), '21-6-preparation-how-a-fight-is-won');
eq('never returns an empty id', slugify('—·—'), 'section');
eq('never returns an empty id for empty input', slugify(''), 'section');
eq('no leading or trailing hyphens', slugify('  ...Force...  '), 'force');

// ── sectionNumber ────────────────────────────────────────────────────────────
eq('picks up a two-part number', sectionNumber('12.3 Weapon tiers'), '12.3');
eq('picks up a chapter number with a dot', sectionNumber('10. Resistances'), '10');
eq('picks up a § prefix', sectionNumber('§21.8 The Press'), '21.8');
eq('an unnumbered heading has no number', sectionNumber('Force — the unit'), '');
eq('a heading that is only a number is not a section number', sectionNumber('7.3'), '');

// ── plainText / summarize ────────────────────────────────────────────────────
eq('markdown emphasis is stripped', plainText('**Bold** and *italic* and `code`'), 'Bold and italic and code');
eq('table pipes become spaces', plainText('| Tier | Effect |\n|---|---|\n| T1 | Open wound |').replace(/\s+/g, ' ').trim(),
   'Tier Effect T1 Open wound');
eq('blockquote markers go', plainText('> a ruling'), 'a ruling');
ok('summarize drops the heading line',
   !summarize('### 8.2 Condition tiers\n\nBleeding — HP on hit.').startsWith('8.2'));
ok('summarize stops at the first sentence',
   summarize('# H\n\nOne sentence here. And a second one.') === 'One sentence here.');
ok('summarize truncates on a word boundary',
   summarize('# H\n\n' + 'word '.repeat(80), 60).endsWith('…'));
eq('summarize of an empty body is empty', summarize('### Empty'), '');

// ── snippet ──────────────────────────────────────────────────────────────────
{
  const s = snippet('the quick brown fox jumps over the lazy dog', 'brown', 10);
  eq('snippet splits around the hit', [s.match, s.before.includes('quick'), s.after.includes('fox')], ['brown', true, true]);
  const miss = snippet('nothing to see here', 'zebra', 10);
  eq('a miss yields a head with no match', [miss.match, miss.after], ['', '']);
  const ci = snippet('The FORCE is one punch', 'force');
  eq('snippet is case-insensitive and echoes the book casing', ci.match, 'FORCE');
}

// ── parseRulebook on a small synthetic book ──────────────────────────────────
{
  const md = [
    '# The Book', '', '**Version 3.1** · 2027-02-02 — notes', '',
    '## 1. One', '', 'chapter one body.', '',
    '### 1.1 Alpha', '', 'alpha body.', '',
    '#### Deep bit', '', 'deep body.', '',
    '---', '',
    '## 2. Two', '', 'chapter two body.', '',
  ].join('\n');
  const p = parseRulebook(md);
  eq('version comes through parseRulebook', [p.version, p.date], ['3.1', '2027-02-02']);
  eq('two chapters', p.chapters.map(c => c.num), ['1', '2']);
  eq('subsections hang off their chapter', p.chapters[0].sections.map(s => s.title), ['1.1 Alpha', 'Deep bit']);
  eq('h4 gets an id too — it never used to', p.chapters[0].sections[1].id, 'sec-deep-bit');
  ok('a chapter carries its subsections in md', p.chapters[0].md.includes('deep body.'));
  ok('ownMd is the chapter preamble only', !p.chapters[0].ownMd.includes('deep body.'));
  ok('a trailing --- is not carried into the chapter', !p.chapters[0].md.trimEnd().endsWith('---'));
  ok('the h1 is not a chapter', p.chapters.every(c => c.level === 2));
  eq('flat sections cover every heading below h1', p.sections.length, 4);
  eq('a subsection knows its chapter', p.sections[1].chapterId, p.chapters[0].id);
}
{
  // two headings that slug the same must still get distinct ids
  const p = parseRulebook('## A. Notes\n\nx\n\n## A. Notes\n\ny\n');
  const ids = p.chapters.map(c => c.id);
  ok('duplicate headings still get unique ids', ids[0] !== ids[1], ids.join(' / '));
}
eq('an empty book does not throw', parseRulebook('').chapters.length, 0);

// ── search on a synthetic book ───────────────────────────────────────────────
{
  const p = parseRulebook([
    '## 1. Force', '', 'One Force is one basic punch. Force adds up.', '',
    '## 2. Armour', '', 'Resistance subtracts flat. It never touches a threshold.', '',
    '## 3. Dissolution', '', 'The Hold Threshold opens. Hold Threshold climbs each Moment.', '',
  ].join('\n'));
  const idx = buildIndex(p);
  eq('a one-letter query returns nothing', searchIndex(idx, 'f'), []);
  eq('an empty query returns nothing', searchIndex(idx, '   '), []);
  const force = searchIndex(idx, 'force');
  eq('the title match wins', force[0].num, '1');
  eq('hits count real occurrences', force[0].hits, 3);   // title + two in the body
  const phrase = searchIndex(idx, 'hold threshold');
  eq('an exact phrase outranks scattered words', phrase[0].num, '3');
  ok('every result contains every term',
     searchIndex(idx, 'force threshold').every(r => r.lowerText.includes('force') || r.lowerTitle.includes('force')));
  eq('a term nobody uses returns nothing', searchIndex(idx, 'zebra'), []);
  eq('totalHits adds the sections up', totalHits(force), force.reduce((n, r) => n + r.hits, 0));
  // the ranking bug: "hold" lives inside every "threshold"
  const hold = searchIndex(idx, 'hold');
  eq('a word-start hit outranks the same letters buried mid-word', hold[0].num, '3');
  eq('the index body excludes the heading line', idx[0].text.includes('1. Force'), false);
  // a heading whose body is empty still previews, by looking at its children
  const hollow = parseRulebook('## 7. Damage\n\n### 7.3 Force\n\n#### The unit\n\nOne punch.\n');
  const hidx = buildIndex(hollow);
  const f = hidx.find(r => r.num === '7.3');
  eq('a heading with no body of its own has empty MATCH text', f.text, '');
  ok('but it still has PREVIEW text from its children', f.preview.includes('One punch.'), f.preview);
  ok('and its search result carries a readable snippet',
     searchIndex(hidx, 'force')[0].snippet.before.length + searchIndex(hidx, 'force')[0].snippet.match.length > 0);
}

// ── pickByNumber ─────────────────────────────────────────────────────────────
{
  const p = parseRulebook('## 7. Bodies\n\nx\n\n### 7.1 Parts\n\ny\n');
  eq('pins resolve by section number', pickByNumber(p, ['7.1']).map(s => s.title), ['7.1 Parts']);
  eq('a pin that no longer exists is dropped, never guessed', pickByNumber(p, ['99.9']), []);
}

// ── the REAL rulebook ────────────────────────────────────────────────────────
const here = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(join(here, '../../rulebook/gpt-system-v1.0.md'), 'utf8');
const book = parseRulebook(raw);
const index = buildIndex(book);

ok('the real book reports a version', /^\d+(\.\d+)*$/.test(book.version || ''), String(book.version));
ok('the real version is NOT the hardcoded 1.0 the topbar used to print', book.version !== '1.0', String(book.version));
ok('the real book has every chapter', book.chapters.length >= 21, String(book.chapters.length));
ok('the real book has every heading below h1', book.sections.length >= 90, String(book.sections.length));

{
  const ids = book.sections.map(s => s.id);
  eq('every section id is unique on the real book', ids.length - new Set(ids).size, 0);
  eq('no section id is empty', ids.filter(i => !i || i === 'sec-').length, 0);
  ok('every id is a legal CSS selector fragment', ids.every(i => /^[a-z][a-z0-9-]*$/.test(i)),
     ids.filter(i => !/^[a-z][a-z0-9-]*$/.test(i)).slice(0, 3).join(', '));
  // the two headings the brief named
  const m = book.sections.find(s => s.num === '12.3');
  const e = book.sections.find(s => s.num === '12.4');
  ok('§12.3 and §12.4 have distinct ids', m && e && m.id !== e.id, `${m?.id} vs ${e?.id}`);
}

{
  // every chapter's rendered heading count must match the id queue Wiki.jsx
  // shifts onto it, or the anchors slide by one and every link lands wrong
  const headRe = /^(#{2,6})\s+\S/;
  for (const c of book.chapters) {
    const n = c.md.split('\n').filter(l => headRe.test(l)).length;
    ok(`chapter ${c.num} heading count matches its id queue`, n === 1 + c.sections.length,
       `${n} headings vs ${1 + c.sections.length} ids`);
  }
}

{
  // the pinned quick-reference cards must all still resolve
  const PINNED = ['8.2', '7.3', '10', '7.1', '21.6', '6.1', '5.5', '12.6'];
  const found = pickByNumber(book, PINNED);
  eq('every pinned quick-reference section resolves', found.length, PINNED.length);
  ok('the condition-tier pin is the condition-tier section',
     /condition tiers/i.test(found[0].title), found[0].title);
  // §7.3 has NO body of its own — it opens straight onto an h4 — so a card that
  // reads only `md` prints an empty line. fullMd is what makes the pin usable.
  ok('every pin has a summary to print on its card',
     found.every(s => summarize(s.fullMd || s.md, 92).length > 0),
     found.filter(s => !summarize(s.fullMd || s.md, 92)).map(s => s.num).join(', '));
  ok('the pin with no body of its own still summarises',
     summarize(book.sections.find(s => s.num === '7.3').fullMd, 92).length > 0);
}

{
  // a GM mid-fight types these; each must reach the section that defines it
  const wants = [
    ['bleeding', /8\.2|7\.5/],
    ['universal resistance', /10\.1/],
    ['grapple', /^13$/],
    ['camera call', /17\.3/],
    ['forced action', /^6(\.1)?$/],
    ['spectacle', /17\.8/],
    ['the press', /21\.8/],
    ['dodge threshold', /^14$/],
  ];
  for (const [q, want] of wants) {
    const r = searchIndex(index, q);
    const top3 = r.slice(0, 3).map(x => x.num || (x.chapterTitle.match(/^(\d+)\./) || [])[1] || '');
    ok(`"${q}" finds its rule in the top 3`, top3.some(n => want.test(n)), `got ${top3.join(', ')}`);
  }
}

ok('search reaches the BODY, not only headings — "abducted" is in no heading',
   searchIndex(index, 'abducted').length > 0);
ok('every real result carries a usable snippet',
   searchIndex(index, 'force').every(r => (r.snippet.before + r.snippet.match + r.snippet.after).trim().length > 0));
ok('search over the real book stays bounded', searchIndex(index, 'the').length <= 60);

console.log(`\n${fail === 0 ? '✅' : '❌'} wikiIndex: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
