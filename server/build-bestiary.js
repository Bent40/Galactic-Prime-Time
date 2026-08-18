/**
 * Renders the F1 + F2 bestiary to a standalone HTML page, generated FROM the seed
 * files so the page can never drift from the data.
 *
 *   node build-bestiary.js [outfile]     (default: ./bestiary.html)
 *
 * No node_modules, no DB.
 */
const fs = require('fs');
const path = require('path');
const { floorState } = require('./floor-bands');

const FLOORS = [
  { n: 1, name: 'The Green Forest', sub: 'Floor 1', band: 'M-1 Forest ×2',
    seed: './seeds/enemies-f1.js', accent: '#4A7A3A',
    layers: [
      { key: 'shared', title: 'The Forest', note: 'Shared — every party meets these.' },
      { key: 'easy',   title: 'Easy · the grand staircase', note: 'The man, the mask, the chain.' },
      { key: 'medium', title: 'Medium · the haunted house', note: 'The arsonists, and the girl inside.' },
      { key: 'hard',   title: 'Hard · the moving city',     note: 'Crystal, and the thing on the stairs.' },
    ] },
  { n: 2, name: 'The Great Desert', sub: 'Floor 2 · seventy years later', band: 'M-2 Desert ×4',
    seed: './seeds/enemies-f2.js', accent: '#C08A3E',
    layers: [
      { key: 'shared', title: 'The Great Desert', note: 'Shared — thin on purpose. The routes carry the weight.' },
      { key: 'easy',   title: 'Easy · the ruined stair', note: 'A demon in the doorway.' },
      { key: 'medium', title: "Medium · the queen's court", note: 'Demon politics, and a song you have to answer.' },
      { key: 'hard',   title: 'Hard · the escort',       note: 'The Loong is yours now, and it is afraid.' },
    ] },
];

const ROUTE_OF = (e) => {
  const d = (e.description || '').toUpperCase();
  if (d.includes('EASY ROUTE')) return 'easy';
  if (d.includes('MEDIUM ROUTE')) return 'medium';
  if (d.includes('HARD ROUTE')) return 'hard';
  return 'shared';
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sum = (e) => e.bodyParts.reduce((a, p) => a + p.maxHp, 0);
const RANK = { mob: 'Mob', elite: 'Elite', boss: 'Boss', legendary: 'Super Boss' };
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** notes are plain text: === HEADERS === become spoiler panels, LEAD WORDS get emphasis. */
function renderNotes(notes) {
  const out = [];
  let spoiler = null, buf = [];
  const flush = () => {
    if (!buf.length) return;
    const text = buf.join('\n').trim();
    if (text) out.push(para(text, spoiler));
    buf = [];
  };
  for (const line of (notes || '').split('\n')) {
    const m = line.match(/^\s*===\s*(.+?)\s*===\s*$/);
    if (m) { flush(); spoiler = spoiler ? null : m[1]; if (spoiler) out.push(`<div class="spoiler"><p class="spoiler-tag">${esc(spoiler)}</p>`); else out.push('</div>'); continue; }
    if (!line.trim()) { flush(); continue; }
    buf.push(line);
  }
  flush();
  if (spoiler) out.push('</div>');
  return out.join('\n');
}

function para(text, inSpoiler) {
  let html = esc(text).replace(/\n/g, ' ');
  // lead label: "GATE — ...", "WEAK SYSTEM ...", "CARVE:", "GM:", numbered steps
  html = html.replace(/^([A-Z][A-Z0-9'’ \-/()+.]{2,40})(\s*[—:-])/, '<b class="lead">$1</b>$2');
  // inline all-caps emphasis of 3+ words
  html = html.replace(/\b([A-Z][A-Z' ]{12,}[A-Z])\b/g, '<em class="shout">$1</em>');
  html = html.replace(/§(\d+(?:\.\d+)?)/g, '<span class="ref">§$1</span>');
  return `<p${inSpoiler ? ' class="in-spoiler"' : ''}>${html}</p>`;
}

function card(e, floor) {
  const total = sum(e);
  const parts = e.bodyParts.map(p =>
    `<div class="part"><span>${esc(p.name)}</span><b>${p.maxHp}</b></div>`).join('');
  const phases = (e.phases || []).length ? `
      <div class="phases">
        <p class="block-label">Phases</p>
        <ol>${e.phases.map(p => `
          <li>
            <div class="ph-head"><b>${esc(p.name)}</b><span class="trigger">${esc(p.hpThreshold)}</span></div>
            <p>${esc(p.description)}</p>
          </li>`).join('')}
        </ol>
      </div>` : '';
  return `
    <article class="entry" id="${slug(e.name)}" style="--rank:var(--r-${e.tier})">
      <header class="entry-head">
        <div class="entry-id">
          <h3>${esc(e.name)}</h3>
          <p class="desc">${esc(e.description)}</p>
        </div>
        <div class="chips">
          <span class="chip rank">${RANK[e.tier]}</span>
          <span class="chip">${esc(e.size || 'Medium')}</span>
          <span class="chip hp">${total} <i>band units</i></span>
        </div>
      </header>
      <div class="entry-body">
        <div class="parts">
          <p class="block-label">Body parts</p>
          <div class="part-grid">${parts}</div>
        </div>
        <div class="notes">${renderNotes(e.notes)}</div>
      </div>
      ${phases}
    </article>`;
}

const ladder = [1,2,3,4,5,6,7,8,9].map(f => {
  const s = floorState(f);
  return `<tr${f <= 2 ? ' class="live"' : ''}><td>F${f}</td><td>${s.level}</td><td>${s.torso}</td>
    <td>${s.dmg.mob}</td><td>${s.dmg.elite}</td><td>${s.dmg.boss}</td><td>${s.dmg.super}</td></tr>`;
}).join('');

let nav = '', body = '';
for (const F of FLOORS) {
  const seed = require(F.seed);
  const st = floorState(F.n);
  nav += `<p class="nav-floor" style="--fa:${F.accent}">${F.sub}</p>`;
  body += `
  <section class="floor" id="floor-${F.n}" style="--fa:${F.accent}">
    <div class="floor-head">
      <p class="eyebrow">${esc(F.sub)}</p>
      <h2>${esc(F.name)}</h2>
      <dl class="floor-facts">
        <div><dt>Band</dt><dd>${esc(F.band)}</dd></div>
        <div><dt>Party torso</dt><dd>${st.torso} HP</dd></div>
        <div><dt>Signature hits</dt><dd>mob ${st.dmg.mob} · elite ${st.dmg.elite} · boss ${st.dmg.boss}${F.n === 1 ? ` · super ${st.dmg.super}` : ''}</dd></div>
        <div><dt>Entries</dt><dd>${seed.length}</dd></div>
      </dl>
    </div>`;
  for (const L of F.layers) {
    const items = seed.filter(e => ROUTE_OF(e) === L.key);
    if (!items.length) continue;
    const id = `f${F.n}-${L.key}`;
    nav += `<a href="#${id}">${esc(L.title)}</a>`;
    body += `
    <div class="layer" id="${id}">
      <div class="layer-head"><h3>${esc(L.title)}</h3><p>${esc(L.note)}</p></div>
      ${items.map(e => card(e, F)).join('')}
    </div>`;
  }
  body += `\n  </section>`;
}

const html = `<title>Broadcast Bestiary</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=JetBrains+Mono:wght@500;700&display=swap">
<style>
:root{
  --paper:#EDEBE4; --raise:#F7F6F2; --ink:#191B1F; --dim:#5C6067; --hair:#D3D1C8;
  --r-mob:#7E8590; --r-elite:#1F7F8C; --r-boss:#A8781F; --r-legendary:#6B4193;
  --spoil-bg:#20232A; --spoil-ink:#E6E3DA; --spoil-tag:#C9A227;
  --fa:#4A7A3A;
  --disp:"Archivo","Helvetica Neue",Arial,sans-serif;
  --serif:"Source Serif 4",Georgia,"Times New Roman",serif;
  --mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,monospace;
}
@media (prefers-color-scheme:dark){ :root:not([data-theme="light"]){
  --paper:#131519; --raise:#1B1E24; --ink:#E7E4DC; --dim:#9AA0A9; --hair:#2E323A;
  --r-mob:#98A0AB; --r-elite:#4FC3D4; --r-boss:#D8A93A; --r-legendary:#A67BD8;
  --spoil-bg:#0C0E12; --spoil-ink:#DDD9CF; --spoil-tag:#E0BC3E;
}}
:root[data-theme="dark"]{
  --paper:#131519; --raise:#1B1E24; --ink:#E7E4DC; --dim:#9AA0A9; --hair:#2E323A;
  --r-mob:#98A0AB; --r-elite:#4FC3D4; --r-boss:#D8A93A; --r-legendary:#A67BD8;
  --spoil-bg:#0C0E12; --spoil-ink:#DDD9CF; --spoil-tag:#E0BC3E;
}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--serif);
  font-size:16.5px;line-height:1.62;-webkit-font-smoothing:antialiased}
.wrap{display:grid;grid-template-columns:minmax(0,1fr);max-width:1180px;margin:0 auto;padding:0 clamp(16px,4vw,40px)}
@media(min-width:1000px){.wrap{grid-template-columns:232px minmax(0,1fr);gap:52px}}
h1,h2,h3,.eyebrow,.chip,.block-label,.nav-floor{font-family:var(--disp)}
h1,h2,h3{text-wrap:balance;margin:0}

/* masthead */
.mast{border-bottom:2px solid var(--ink);padding:clamp(34px,7vw,72px) 0 22px;margin-bottom:34px}
.mast h1{font-size:clamp(40px,7.5vw,76px);font-weight:800;letter-spacing:-.028em;line-height:.95}
.mast .strap{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--dim);margin:0 0 14px}
.mast .lede{max-width:60ch;margin:18px 0 0;color:var(--dim);font-size:17px}

/* nav */
nav{display:none}
@media(min-width:1000px){nav{display:block;position:sticky;top:0;align-self:start;
  max-height:100vh;overflow-y:auto;padding:34px 0 40px}}
nav a{display:block;font-size:13.5px;color:var(--dim);text-decoration:none;padding:5px 0 5px 12px;
  border-left:2px solid var(--hair);line-height:1.35}
nav a:hover,nav a:focus-visible{color:var(--ink);border-left-color:var(--fa);outline:none}
.nav-floor{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--fa);
  margin:22px 0 8px;font-weight:600}
.nav-floor:first-child{margin-top:0}

/* ladder */
.ladder{margin:0 0 44px;overflow-x:auto}
.ladder table{border-collapse:collapse;width:100%;font-family:var(--mono);font-size:12.5px;
  font-variant-numeric:tabular-nums;min-width:520px}
.ladder th{font-family:var(--disp);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--dim);text-align:right;padding:0 0 8px;font-weight:600}
.ladder th:first-child,.ladder td:first-child{text-align:left}
.ladder td{text-align:right;padding:5px 0;border-top:1px solid var(--hair);color:var(--dim)}
.ladder tr.live td{color:var(--ink);font-weight:700}

/* floor */
.floor{margin:0 0 76px}
.floor-head{border-top:2px solid var(--fa);padding-top:16px;margin-bottom:34px}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.17em;text-transform:uppercase;
  color:var(--fa);margin:0 0 6px}
.floor-head h2{font-size:clamp(28px,4.6vw,42px);font-weight:800;letter-spacing:-.022em}
.floor-facts{display:flex;flex-wrap:wrap;gap:10px 30px;margin:16px 0 0}
.floor-facts div{display:flex;flex-direction:column;gap:1px}
.floor-facts dt{font-family:var(--disp);font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--dim)}
.floor-facts dd{margin:0;font-family:var(--mono);font-size:13px}

.layer-head{margin:44px 0 18px;display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px}
.layer-head h3{font-size:19px;font-weight:600;letter-spacing:-.01em}
.layer-head p{margin:0;color:var(--dim);font-size:14.5px;font-style:italic}

/* entry */
.entry{background:var(--raise);border:1px solid var(--hair);border-left:4px solid var(--rank);
  border-radius:2px;padding:22px 24px;margin:0 0 16px}
.entry-head{display:flex;flex-wrap:wrap;gap:12px 18px;justify-content:space-between;align-items:flex-start}
.entry-id h3{font-size:21px;font-weight:800;letter-spacing:-.015em}
.desc{margin:5px 0 0;color:var(--dim);font-size:15px;max-width:62ch}
.chips{display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0}
.chip{font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;
  border:1px solid var(--hair);border-radius:2px;padding:4px 8px;color:var(--dim);white-space:nowrap}
.chip.rank{border-color:var(--rank);color:var(--rank)}
.chip.hp{font-family:var(--mono);letter-spacing:0;font-size:12px;color:var(--ink)}
.chip.hp i{font-style:normal;color:var(--dim);font-size:10px}

.entry-body{display:grid;gap:22px;margin-top:20px}
@media(min-width:760px){.entry-body{grid-template-columns:196px minmax(0,1fr);gap:30px}}
.block-label{font-family:var(--disp);font-size:10px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--dim);margin:0 0 8px;font-weight:600}
.part-grid{display:flex;flex-direction:column;gap:2px}
.part{display:flex;justify-content:space-between;gap:10px;font-family:var(--mono);font-size:12.5px;
  font-variant-numeric:tabular-nums;padding:3px 0;border-bottom:1px dotted var(--hair)}
.part span{color:var(--dim)}
.notes p{margin:0 0 11px;font-size:15.5px;max-width:68ch}
.notes p:last-child{margin-bottom:0}
.lead{font-family:var(--disp);font-weight:600;font-size:13px;letter-spacing:.07em;color:var(--rank)}
.shout{font-style:normal;font-weight:600;font-family:var(--disp);font-size:13.5px;letter-spacing:.05em}
.ref{font-family:var(--mono);font-size:12.5px;color:var(--dim)}

.spoiler{background:var(--spoil-bg);color:var(--spoil-ink);border-radius:2px;padding:16px 18px;margin:14px 0}
.spoiler-tag{font-family:var(--disp);font-size:10px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--spoil-tag);margin:0 0 9px;font-weight:600}
.spoiler p.in-spoiler{color:var(--spoil-ink);font-size:15px}
.spoiler .lead,.spoiler .shout{color:var(--spoil-tag)}
.spoiler .ref{color:#9AA0A9}

.phases{margin-top:20px;border-top:1px solid var(--hair);padding-top:16px}
.phases ol{margin:0;padding:0;list-style:none;counter-reset:ph;display:flex;flex-direction:column;gap:12px}
.phases li{counter-increment:ph;padding-left:34px;position:relative}
.phases li::before{content:counter(ph);position:absolute;left:0;top:1px;font-family:var(--mono);
  font-size:11px;font-weight:700;color:var(--rank);border:1px solid var(--rank);border-radius:2px;
  width:22px;height:22px;display:grid;place-items:center}
.ph-head{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline}
.ph-head b{font-family:var(--disp);font-size:14.5px;letter-spacing:-.005em}
.trigger{font-family:var(--mono);font-size:11.5px;color:var(--dim)}
.phases li p{margin:3px 0 0;font-size:15px;color:var(--dim);max-width:66ch}

footer{border-top:1px solid var(--hair);margin-top:20px;padding:26px 0 60px;color:var(--dim);font-size:14px}
footer code{font-family:var(--mono);font-size:12.5px}
</style>

<header class="mast">
  <div class="wrap" style="display:block">
    <p class="strap">Galactic Prime Time · GM reference · proposal, not yet blessed</p>
    <h1>Broadcast Bestiary</h1>
    <p class="lede">Floors 1 and 2, statted to the §21.2 horde doctrine. Every number below is
    in <b>band units</b> — the floor's material band multiplies both sides of every exchange, so
    it cancels and never reaches the page. A mob is 5 here and 5 on Floor 9. What grows is the
    contestant.</p>
  </div>
</header>

<div class="wrap">
  <nav aria-label="Contents">${nav}</nav>
  <main>
    <div class="ladder">
      <p class="block-label">The ladder — what the party can take, and what hits them</p>
      <table>
        <thead><tr><th>Floor</th><th>Level</th><th>Torso</th><th>Mob</th><th>Elite</th><th>Boss</th><th>Super</th></tr></thead>
        <tbody>${ladder}</tbody>
      </table>
    </div>
    ${body}
    <footer>
      <p>Generated from <code>server/seeds/enemies-f1.js</code> and <code>enemies-f2.js</code> by
      <code>server/build-bestiary.js</code> — the page cannot drift from the seed data.
      Rebuild with <code>node server/build-bestiary.js</code>.</p>
      <p>Enemy HP is identical on every floor; only damage tracks the contestant's growing body.
      Elites and above vary by design — only mobs are exact.</p>
    </footer>
  </main>
</div>`;

const out = process.argv[2] || path.join(__dirname, 'bestiary.html');
fs.writeFileSync(out, html);
console.log(`bestiary → ${out}  (${(html.length / 1024).toFixed(0)} KB)`);
