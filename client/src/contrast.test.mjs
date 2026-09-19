/**
 * Contrast floor for the sheet's palette (owner, 2026-09-19: "the text is hard to
 * read since things are dark with dark text").
 *
 *   node --experimental-detect-module client/src/contrast.test.mjs
 *
 * Reads the real tokens out of styles/index.css and checks every one that is used
 * as TEXT against the grounds it sits on, at WCAG's contrast ratio. No browser, no
 * node_modules — it is arithmetic on six hex values.
 *
 * ⚠️ --muted is deliberately NOT checked as text: it is the structural token now
 * (borders and fills), and --muted-text is the readable half it was split from.
 * A test asserts nothing colours text with it, which is what keeps the split honest.
 */
import { readFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

let pass = 0, fail = 0;
const ok = (n, c, x = '') => c ? (pass++, console.log(`  ok    ${n}`)) : (fail++, console.log(`  FAIL  ${n}${x ? ' — ' + x : ''}`));

const css = readFileSync(new URL('./styles/index.css', import.meta.url), 'utf8');
const root = /:root\s*\{([\s\S]*?)\}/.exec(css)[1];
const TOK = Object.fromEntries([...root.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8})/g)].map(m => [m[1], m[2]]));

const srgb = (h) => {
  const v = h.replace('#', '');
  const n = v.length === 3 ? v.split('').map(c => c + c).join('') : v.slice(0, 6);
  return [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255);
};
const lum = (h) => {
  const [r, g, b] = srgb(h).map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

console.log('the palette is complete');
for (const t of ['bg', 'panel', 'panel2', 'text', 'muted', 'muted-text', 'border', 'cyan', 'gold'])
  ok(`--${t} is defined`, !!TOK[t], 'missing');

// The three grounds text actually sits on.
const GROUNDS = ['bg', 'panel', 'panel2'];
// Every token used to colour text, and the floor it must clear.
// 4.5 is WCAG AA for body text; 3.0 is AA for large/bold, which is what the
// 9-11px uppercase labels and tier chips are (bold, wide-tracked).
const TEXT = [
  ['text', 4.5], ['muted-text', 3.0], ['cyan', 3.0], ['gold', 3.0],
  ['success', 3.0], ['danger', 3.0], ['bronze', 3.0], ['silver', 3.0],
  ['legendary', 3.0], ['mythic', 3.0], ['purple', 3.0],
];

console.log('\ntext tokens clear their floor on every ground');
for (const [tok, floor] of TEXT) {
  for (const g of GROUNDS) {
    const r = ratio(TOK[tok], TOK[g]);
    ok(`--${tok} on --${g} is ${r.toFixed(2)}:1 (needs ${floor})`, r >= floor, `${r.toFixed(2)}`);
  }
}

console.log('\n⭐ the split holds — --muted is structural, never text');
ok('--muted would FAIL as text, which is why it is not used as text',
   ratio(TOK.muted, TOK.bg) < 3.0);
ok('--muted-text is meaningfully brighter than --muted',
   lum(TOK['muted-text']) > lum(TOK.muted) * 2);

// Walk the source and prove nothing colours text with the structural token.
const offenders = [];
const walk = (dir) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!/\.(jsx|css)$/.test(e)) continue;
    const t = readFileSync(p, 'utf8');
    for (const m of t.matchAll(/color:\s*'?var\(--muted\)/g)) offenders.push(`${p}`);
    for (const m of t.matchAll(/:\s*'var\(--muted\)'/g)) offenders.push(`${p} (bare colour string)`);
  }
};
walk(new URL('.', import.meta.url).pathname);
ok('🔒 no file colours text with --muted', offenders.length === 0, [...new Set(offenders)].join(', '));

console.log(`\n${pass} passed · ${fail} failed`);
process.exit(fail ? 1 : 0);
