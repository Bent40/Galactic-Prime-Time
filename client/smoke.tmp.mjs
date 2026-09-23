import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(async () => chromium.launch());
const errors = [];
for (const path of ['/table', '/gm/abc', '/admin']) {
  const p = await b.newPage();
  p.on('pageerror', e => errors.push(path + ': ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/api|fetch|503|Failed to load resource/i.test(m.text())) errors.push(path + ' console: ' + m.text()); });
  await p.goto('http://localhost:4173' + path, { waitUntil: 'networkidle' }).catch(e => errors.push(path + ' nav: ' + e.message));
  const txt = await p.textContent('body');
  console.log(path, '→', txt.replace(/\s+/g, ' ').slice(0, 120));
  await p.close();
}
await b.close();
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no page errors');
