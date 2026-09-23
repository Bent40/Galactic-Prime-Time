# Leaving Roll20 — what a virtual tabletop is, what GPT needs, and what to build

**Status:** research 2026-09-23, **approved and BUILT the same day** (V-8 below). The mockup
that was approved: **https://claude.ai/artifact/SB1CqERqWCGcayvbUANJWv**. The app now has the
table (`/table` for players, `/gm/:tableId` for the GM), the book's dice, sound cues and
visual effects by damage type, and — approved and built later the same day — **Socket.IO as
the notifier**, with the 2 s poll kept as the fallback (V-9).

> Sourcing note. The container's proxy blocks every first-party VTT host (roll20.net,
> help.roll20.net, foundryvtt.com, owlbear.rodeo, web.archive.org), so the Roll20 inventory
> below comes from search-indexed excerpts of the cited help-center and wiki pages plus direct
> reads of Roll20's and Owlbear's GitHub repos and Wikipedia. Feature claims are solid;
> storage and price numbers conflicted across sources and are marked ⚠. Nothing is from memory.

---

## V-0 — TL;DR

1. **Roll20's irreducible core is small**, and Owlbear Rodeo proves it: a room you join by
   link · a scene with an image and a grid · tokens you drag · fog · a ruler · a ping ·
   synced dice · real-time sync. Everything else Roll20 has (macros, roll templates,
   handouts, jukebox, dynamic lighting, the API) is a second layer.
2. **GPT needs less than Roll20 and one thing Roll20 does badly.** The book has no to-hit
   roll, no d20, no initiative order and no HP bar — it has **hexes**, a **10-Moment Clock**
   with scheduled actions, **six body parts** each with its own HP, and exactly three dice:
   the **d6 Forced-Action tables** (§6.1), the **d4/d6/d8 threshold die** (§14) and
   falling's **Nd4/Nd6** (§21.5). Roll20's macro engine is dead weight here; **the Clock rail
   is the thing Roll20 cannot do**, and the app already has it.
3. **The app already owns the hard half.** Auth, the player list, the character sheet (which
   *is* the token's HP), the enemy library, chat with whispers, and the Moment tracker all
   exist. What is missing is a **table** to scope them to, a **map** with tokens on it,
   **dice in the chat**, and **real-time sync** — the app polls at 5–12 s today.
4. **Built this session:** `Table` + `TableMap` models, 17 routes, an admin **Tables**
   section (create a table · seat players · upload Inkarnate exports · put one map live),
   a 57-check route test, and the login `userId` bug fixed — then, on approval, the play
   surface, the dice, sound cues and visual effects (V-8), then the socket (V-9).
5. **Inkarnate stays.** It is the map *painter*; the table only needs its PNG export. Nothing
   in Roll20 replaces Inkarnate either.

---

## V-1 — What Roll20 offers (the inventory, condensed)

| Area | Roll20 feature set |
|---|---|
| **Game / table** | A "game" per campaign; **player join link** (rotates when the list changes); invite by email as Player or GM; **GM link** single-use, 48 h; promote / demote / kick; Creator · Co-GM · Player roles; copy/extend a game; chat archive (paginated, hide whispers, clear) |
| **Pages (maps)** | Any number per game, in folders; **the player ribbon** decides which page players see (GM roams freely); per-player pages; size in grid units (≤100×100 recommended, no hard cap); **square / horizontal hex / vertical hex** grid, cell 70 px default, snapping on/off; scale + unit (5 ft default); diagonal rules; grid colour/opacity; background colour; **fog of war** (free); **dynamic lighting** (paid): walls, doors, windows, lights, vision, daylight slider, explorer mode; align-to-grid tool; **layers**: map · tokens · GM overlay · lighting |
| **Tokens** | Image tokens sized in cells, free resize, alt-drag unsnapped; nameplate with per-player see/edit; **3 bars** (value/max, linkable to sheet attributes); **2 auras**; **40+ status markers** with numeric badges + custom marker sets; "represents character" with a default token; controlled-by; GM notes; tint, flip, rotate, lock, z-order; light/vision per token; token-action macro bar; multi-sided tokens from rollable tables; **turn tracker** (initiative sort, custom rows like "Round +1") |
| **Dice** | `/roll NdX+…`; exploding `!` `!!` `!p`; keep/drop `kh kl dh dl`; rerolls; success counting; crit ranges; grouped rolls; Fate dice; inline `[[ ]]` with hover breakdown; labels; roll queries `?{}`; `@{attr}` refs; `/gmroll`; 3D dice; **rollable tables** with weights; card decks |
| **Chat** | Persistent log; `/w` whisper (to player, character, or `gm`); `/em`, `/desc`, `/as`, `/ooc`; speak-as dropdown; macros (global or per character), macro quick bar, token actions; roll templates from the sheet; chat menu buttons |
| **Handouts** | Journal tree with folders + tags; handout = image + player notes + **GM notes**; per-player visibility and edit rights; "show to players" force-opens it; archive |
| **Drawing / measure** | Freehand, shapes, polygon, text tool; **ruler** (line / radius / cone / box), show-to-all or GM-only; **ping** (click-hold; GM shift-ping recentres everyone); map pins; fog hide/reveal by rectangle or polygon; zoom |
| **Audio / A/V** | Jukebox (own uploads 20 MB/track + Tabletop Audio / Incompetech / BattleBards), playlists; built-in WebRTC voice/video that groups replace with Discord |
| **Sheets / compendium** | 800+ community sheet templates; custom sheets Pro-only; compendium with drag-and-drop from bought books; Charactermancer; character vault |
| **Tiers** | Free (100 MB ⚠, fog, everything above except DL/API); Plus $5.99/mo (dynamic lighting, vault, no ads); Pro $10.99/mo (Mod/API scripts, custom sheets, transmogrifier) |
| **Why people leave** | Performance on big maps and many light sources; dated cluttered UI; dynamic lighting and the API behind a subscription; unreliable A/V; tiny free storage |

**Owlbear Rodeo's "minimum viable VTT"** for contrast: room + join link + GM/player role ·
scene with image, grid (square/hex/iso, cell size, unit) and snapping · tokens with label,
size, hide, lock · manual fog (fill + reveal shapes) · ruler with units · pointer/ping ·
simple drawing · synced dice public/private · real-time sync. **No** sheets, journals,
macros or A/V, deliberately. Free tier 200 MB.

---

## V-2 — What GPT actually needs: the filter

Derived from the rulebook, not from Roll20. Each row says why.

### ✅ NEED — the table cannot run without it

| Need | Why (book) | Roll20 has it? |
|---|---|---|
| **A table with seated players** | The GM runs one game; a player must only ever see their own | Yes (game + join link) |
| **A map with a HEX grid** | §5.5 *"1 space = 1 hex on the map"*; every range, move and cone is in hexes | Yes (hex grids) |
| **Tokens for contestants and enemies, draggable, snapping to hexes** | §5.5 movement, §21.8 the Press is a *positioning* threat, §15 vision cones | Yes |
| **Movement priced by the book** | free 1–4 spaces once per Moment, `ceil((spaces − 4)/4)` Moments beyond (v1.15) | No — Roll20 measures feet, never Moments |
| **The Clock rail on the table** | §5 scheduling: declare on Moment N, resolve on N − cost; the whole combat model | **No.** Roll20's turn tracker is an initiative list. The app already has this (`MomentTracker`) |
| **Body-part HP, not a bar** | §7.1 six parts, §7.3 per-part resolution, §12.6 per-part armor | No — 3 bars max, one number each |
| **The book's three dice, in chat, attributed** | §6.1 d6 Body/Tool tables; §14 threshold d4→d6→d8; §21.5 falling Nd4/Nd6 | Yes, but as a generic roller with no table lookup |
| **Fog of war, GM-revealed** | §15 vision is a cone out to 2×Mind; "the GM's map is the authority" | Yes (free) |
| **Ruler in spaces** | ranges are stat-valued ("Range: Reflexes"), cones are hex counts | Yes (in feet) |
| **Ping** | pointing at the table | Yes |
| **Whispers + GM-only rolls** | Comms already does whispers; a Forced Action the GM rolls for an enemy must be hideable | Yes |
| **Hidden tokens** | an unrevealed elite (the Kindler waiting) — the GM-overlay layer | Yes (GM layer) |
| **Real-time sync** | a dragged token must land on every screen inside a second | Yes |

### 🟡 NICE — worth having, not first

| Item | Why | Note |
|---|---|---|
| Condition badges on tokens | §8.2 tiers are the whole damage model; a token should show *Bleed T2* | Roll20 status markers. The sheet already stores `conditions[]` per part |
| The Press highlighter | §21.8: mobs adjacent to one target that a live elite can see | Nothing in Roll20 does this; it is pure hex arithmetic on data the table has |
| Vision cone overlay | §15 2×Mind, cone-shaped | Roll20's dynamic lighting does circles, paid; a cone is a polygon we can draw |
| Handouts with GM notes | murals, journals, the F2 letter | `Message` + `NPC` cover some; a handout is a small model |
| Drawing tools | fire spreading, the reservoir's blooms | Roll20 has them; cheap in SVG |
| Multiple maps on a table, one live | prep the next room while this one plays | Built (the table's `activeMapId`) |
| Spectacle / Exposure ticks from the table | §17.8 | later, once the table is the source of combat events |

### ⛔ SKIP — Roll20 has it, GPT does not want it

| Item | Why not |
|---|---|
| d20 macro engine, keep/drop, exploding dice, roll queries, roll templates | there is no to-hit roll and no modifier stack in this game |
| Initiative-ordered turn tracker | the Clock is not a queue; "there is no fixed order within a Moment" (§5.2) |
| Three HP bars, auras | the body is six parts; the sheet is the truth |
| Compendium, sheet templates, character vault | the app *is* the sheet |
| Jukebox, built-in voice/video | Discord, like every Roll20 table |
| Dynamic lighting with walls and doors | §15's rule is a cone and the GM's judgement; a wall editor is a month of work for a rule the book does not have |
| Card decks, rollable-table tokens, map pins, marketplace | no referent in the book |
| The Mod/API script sandbox | we own the server |

---

## V-3 — What the app already has (survey, 2026-09-23)

| Piece | State | Reuse |
|---|---|---|
| **Auth** | JWT, `requireAuth` / `requireAdmin`, one secret; admin is a User with `isAdmin` | As is. 🔴 **Bug fixed today:** login/register never returned `userId`, so `localStorage.userId` held the string `"undefined"` and CommsTab's self-filter never matched. The routes now return it and the sheet falls back to the JWT payload for old sessions |
| **Player list** | `GET /api/players` (any user) · `GET /api/admin/players` (admin; carries `hasCharacter`, `characterName`, `level`) | Seats are `userId`s from this list |
| **Character sheet** | `state` blob, `bodyParts[{name, baseHp, maxHp, currentHp, lethal, conditions[]}]`, `identity.size/name/portrait` | **A player token reads HP from here, never stores it** |
| **Enemy library** | full statlines incl. `bodyParts[].maxHp`, `size`, `color`, resistances — but **templates only, no current HP**, and **admin-only routes** | An enemy token carries its own `parts[]` (instance HP). Players never read `/api/enemies` |
| **Moment tracker** | singleton `MomentTracker`; GET for all, writes admin-only; 5 s / 12 s polls | **The Clock rail is done.** It needs a `tableId` when a second table exists |
| **Comms** | `Message` with broadcast / player whisper / NPC whisper; 5 s poll; no `kind` field | A roll is a Message with `kind: 'roll'` + payload |
| **Real-time** | **none** — every live thing is `setInterval` | V-4 |
| **Images** | portraits as base64 data URLs in the state blob, `express.json` 10 MB, no cap | Map backgrounds use the same convention, **capped at 8M chars (~6 MB)** |
| **Deploy** | one free Render web service serving `client/dist` + `/api`; ephemeral disk; sleeps after 15 min idle | WebSockets work on Render free. No disk for uploads |
| **Tests** | dependency-free `node` scripts, route tests stub models through `require.cache` | `test-tables.js` follows the pattern |

⚠️ **The sync hazard that shapes the design.** The sheet autosaves the **whole state blob**
(last writer wins, no per-field merge) and re-reads only when clean. If the table lets the GM
edit a player's part HP through `PUT /players/:id/state`, a player mid-edit can overwrite the
GM's damage with a stale copy 1.5 s later. **Rule: the table never writes a player's sheet
wholesale.** GM damage to a contestant goes through a **per-part PATCH** (to be built:
`PATCH /api/admin/players/:id/parts/:partId { currentHp, conditions }`) that touches one
field, and the sheet's poll picks it up on the 12 s tick — or over the socket, once V-4 lands.

---

## V-4 — Architecture proposal

### The data model (BUILT)

```
Table      { name, description, status: open|closed, seats:[{userId, seatedAt}], activeMapId, createdBy }
TableMap   { tableId, name, image (data: or https:), width, height,
             grid: { type:'hex', size, offsetX, offsetY, cols, rows },
             visible, fogEnabled, revealed:['col,row'…], notes (GM-only),
             tokens:[{ tokenId, kind: player|enemy|npc|marker, refId, name, label, color, tier, size,
                       col, row, hidden, parts:[{name, currentHp, maxHp, lethal}], conditions:[] }] }
```

- **The seat is the permission.** `GET /api/tables/mine` returns only tables the caller is
  seated at, each with its **live** map projected for a player: no `notes`, no hidden tokens,
  the fog key-set only when fog is on. 57 checks pin this.
- **One player write exists:** `PATCH /api/tables/:id/tokens/:tokenId/move` — your own
  `player` token, on the live map, nothing else (403 otherwise).
- **A player token never stores HP.** `refId` is the `userId`; the table reads the sheet.
  An enemy token stores `parts[]` because an Enemy is a template.
- **Maps are separate documents** so a table with a dozen Inkarnate exports never nears
  Mongo's 16 MB document cap; the list endpoints strip `image`.
- **Pointy-top hexes, odd rows shoved right** — the lattice the mockup draws; `grid.offsetX/Y`
  lines it up with a map painted on a different grid. Roll20's *align to grid* tool is the
  model for a later alignment UI (drag a box over three hexes).

### Real-time — recommend Socket.IO on the existing Express server

| Option | Latency | Cost | Verdict |
|---|---|---|---|
| Keep polling, drop to 2 s on the table page | 0–2 s | zero deps; ~2 req/s per seated player, keeps Render awake | acceptable **fallback**, not the target: a dragged token that lands two seconds later feels broken |
| **Socket.IO** attached to `app.listen()`'s server | <100 ms | one dependency each side; JWT handshake; rooms = tables; Render free supports WebSockets; single instance so an in-memory hub is fine | **recommended.** Emit `table:<id>` events on every route write (token moved, map went live, fog revealed, roll posted, Clock advanced) and have clients re-fetch or apply the delta |
| Server-sent events | <100 ms one-way | no deps | half a solution: writes still go over HTTP, fine, but no room fan-out without hand-rolling it |

The socket is a *notifier*, not the source of truth: every event is also a normal route
write, so a client that misses an event (Render restart, phone sleep) re-fetches and is
correct. That is the same discipline `syncGate.js` already enforces for the sheet.

### Storage — data URL now, CDN later, model unchanged

Inkarnate's free export is 1024 px wide; Pro exports 4k/8k. A 2k JPG at quality 80 is
~1 MB, 8M characters of base64 is ~6 MB, so the cap fits anything a table needs. Atlas M0
gives 512 MB: room for ~80 large maps, or several hundred sensible ones. When that pinches,
`image` becomes a Cloudinary URL (25 GB free) and nothing else changes — the field is a
string and `imageProblem()` already accepts `https://`.

### Dice — the book's dice, as chat

A roll is `POST /api/messages { kind: 'roll', roll: { label, die, result, table, effect }, gmOnly }`.
`kind` is a new field on `Message`; `gmOnly` reuses the whisper-to-admin path. The three
rollers are buttons, not a parser: **Forced Action Body / Tool** (d6, prints the table row
verbatim from §6.1), **Threshold** (d4/d6/d8 per the contestant's upgraded die), **Falling**
(Nd4 / Nd6 by height). No `/roll` grammar: there is nothing in the book to express with it.

### The Clock — already built; scope it to the table

`MomentTracker` gains `tableId` (default `null` = the legacy singleton, so nothing breaks);
the table page renders the existing `TrackerBar`. The Clock's advance is the one event that
needs to reach every screen in the same instant, which is the socket's first customer.

---

## V-5 — Build order (each step ships something usable)

| # | Step | Size | Done when |
|---|---|---|---|
| 0 | **Foundation** — Table/TableMap, routes, admin Tables section, login `userId` | ✅ built | GM creates a table, seats players, uploads a map, sets it live; player `/mine` returns it |
| 1 | **Player table page** `/table` — the live map as a hex board (SVG over the image), tokens, own token draggable, Clock rail, 2 s poll | ✅ built | two browsers see each other's tokens move within 2 s |
| 2 | **GM table page** `/gm/:tableId` — every token draggable, hide/reveal, add from the enemy library or the seated players, fog brush, ruler, ping | ✅ built | the GM runs a room from the app with no Roll20 tab open |
| 3 | **Dice** — the server rolls, posts a `kind: 'roll'` Message, GM-only option, the §6.1 row printed | ✅ built | a Forced Action rolled on the table reads its consequence aloud in chat |
| 4 | **Socket.IO** — rooms per table, events on every write, clients re-fetch; polling stays as fallback | ✅ built (V-9) | a token drag lands on the other screen in <100 ms |
| 5 | **Per-part damage from the table** — `PATCH players/:id/parts/:partId`, tokens show part HP + condition badges | ✅ built (the Press highlighter is not) | GM clicks −, the player's sheet updates on its next poll |
| 5b | **Sound cues** and **visual effects by damage type** (owner ask, 2026-09-23) | ✅ built | see V-8 |
| 6 | Handouts, drawing, vision cones, map alignment UI, the Press highlighter, GM prep view of a non-live map | later | — |

---

## V-8 — What was built (2026-09-23) and how the two new tools work

### The table, end to end
- **`/table`** (player): picks the seated table (a selector if several), polls `GET /api/tables/:id/live`
  every 2 s (`useTablePoll`), fetches the map image once per map, draws the board, drags only the
  player's own token (`PATCH …/tokens/:id/move`), shows the Clock (`TrackerBar`), their body from the
  sheet, the dice tray and the chat. A "🎲 Table" button on the sheet's topbar opens it.
- **`/gm/:tableId`** (GM, admin token): the same `HexBoard` with `role="gm"` — every token drags;
  hide / reveal / remove; add a token from the enemy library (parts snapshotted from `bodyParts`,
  placed hidden at 1,1) or a seated player (size from their sheet); per-part − / + (an enemy token's
  own `parts[]`; a player's via the new `PATCH /api/admin/players/:id/parts/:partId`); conditions;
  the fog brush (radius 2, debounced 400 ms) with on/off and cover-all; ruler; ping; the **fx** tool;
  the cue buttons; Clock advance/retreat; GM-only dice rolled *as* the selected token; the chat.
  "Open the GM table" sits on each table in Admin → Tables.
- **Board geometry** is pure (`client/src/table/hex.js`, 140 tests with the sound engine): pointy-top
  odd-r hexes, `nearestCell` round-trips every cell, `moveCost` is §5.5 at v1.15, wheel-zoom and pan.
- **One honest limit:** the GM page shows the **live** map only. Prep happens with hidden tokens on
  the live map, or by putting the next map live between rooms. A "preview a non-live map" mode is
  step 6.

### Sound cues — "song A: loop 0–0:36, then 0:36–1:50, then stop"
- A **cue** is a segment of a source: `{ name, source: youtube|audio, ref, start, end, loop, volume,
  trigger }`. The owner's example is **three cues on one video**: *phase 1* 0:00–0:36 looping,
  *phase 2* 0:36–1:50 looping, and the **Stop** button. Cues are authored in Admin → Tables (paste a
  YouTube link or id; or an https mp3 URL; or upload a small file, which is stored as a data URL under
  the same ~6 MB cap as a map) and fired from the GM table's left pane.
- **Trigger `map-live`** binds a cue to a map: the moment that map goes live the cue starts. That is
  the "on map entry" trigger. Everything else is a button.
- **Sync without a socket:** the table's `sound` state holds `{ cueId, playing, startedAt, seq }`.
  Every client computes *where in the source it should be* from `startedAt` (server time, with the
  client clock offset from the poll) — so a player who opens the page mid-boss lands inside the
  loop at the right second — and a 250 ms loop seeks when it drifts more than 1.5 s or reaches the
  segment's end (`soundEngine.tick`). A cue change is seen within one poll (≤ 2 s).
- **Backends:** the YouTube IFrame API (audio from a video; a 1 px player sits in the corner, a
  "video" toggle shows it) and a plain `<audio>` element. Same loop drives both.
- ⚠️ **The browser rule:** nothing plays before a user gesture. Each player page shows **"🔊 Enable
  sound"** once; after that click every cue the GM fires plays unasked. The GM page runs the same
  player, so the GM hears what the table hears.
- ⚠️ **YouTube limits:** the video must allow embedding (most music does; some labels block it —
  the status line says so), and a few videos refuse to play in a 1 px frame; the "video" toggle is
  the workaround. Playback on a phone that has locked its screen stops (the OS, not us).

### Visual effects by damage type
- `POST /api/tables/:id/fx { type, to, from?, label }` queues an effect; pollers see it for 20 s and
  play it once. **Eight types, eight SHAPES** (`FxLayer.jsx`): Bleed slashes and drips · Crush rings
  and cracks · Burn tongues rising · Chill shards · Poison bubbles · Infection crystals growing ·
  Dissolution an unravelling spiral · Heal a soft pulse — shape not just colour, so a colour-blind
  table still reads the attack. With a token selected the effect **travels from it** (a projectile,
  then the burst on the target).
- **How the GM fires one:** pick the **fx** tool, pick a type from the toolbar, click a hex or a
  token. The label ("Burn → The Rack") is drawn over the burst.
- **Not yet automatic from skills.** A skill has `damageType[]` on its template, so "cast this
  skill" firing the matching effect is a small follow-up once the table knows which skill was used
  (that needs a "use skill" action on the table, which does not exist yet). Today the GM picks the
  type by hand.

### Tests and verification
`test-tables.js` **105** (poll projection per role, live-only image, server rolls, cue validation,
map-live trigger, fx) · `table.test.mjs` **140** (hex geometry, §5.5 pricing, the cue arithmetic) ·
every older suite green · `vite build` clean · **headless Chromium loads `/table`, `/gm/:id` and
`/admin` with no runtime errors.** ⚠️ **Not seen:** a logged-in table with a real map — there is no
MongoDB in the container. The first real session is the test.

---

## V-6 — Inkarnate

Keep it. The pipeline is: paint in Inkarnate → export PNG/JPG → *Add map* on the table with
the hex size Inkarnate used (its hex grid overlay reports cell size; match it, or use a plain
grid on the table and switch Inkarnate's own grid off). Nothing in Roll20 paints maps
either; Roll20 users buy or import them the same way. The one Inkarnate-shaped feature worth
copying is Roll20's *align to grid* box-drag, queued as step 6.

---

## V-7 — Open calls for the owner

1. **Approve the mockup** (GM view + player view), or say what to change. Steps 1–2 wait on it.
2. **One table at a time, or many?** The model allows several open tables; the Clock and
   Comms are still global singletons. If the campaign only ever runs one table, scoping the
   tracker and chat can wait; if two groups run in parallel, it is step 1.5.
3. **Who may move enemy tokens?** Today only the GM. Roll20 lets "controlled by" players
   move anything they own — do contestants ever drag a mob (a grapple, a thrown roach)?
4. **Should players see enemy part HP?** The sheet shows their own body; the mockup shows an
   enemy's parts when selected. The book's §21.3 win conditions are *discovered*, which argues
   for **names only, no numbers** on enemy tokens for players. Recommend: names + condition
   badges, numbers GM-only.
5. **Socket.IO** adds a dependency to both packages. Approve before step 4.


---

## V-9 — Socket.IO, built 2026-09-23 (owner: "go ahead with socket.io")

- **A notifier, never the source of truth.** `server/realtime.js` attaches Socket.IO to the
  same HTTP server. Every table write in `routes/tables.js` still goes through its route and
  then calls `notify(tableId, event, hint)`; the tracker routes call `notifyTracker`, the
  message routes and the roll route call `notifyChat`. Clients **re-fetch** on an event —
  `useTableSocket` hands `table:changed` to the poll's `refresh()`, `tracker:changed` to the
  tracker loader, `chat:changed` to the chat. Nothing on the wire is state, so a missed event
  costs at most one poll.
- **The seat is still the permission.** The handshake verifies the JWT (`auth.token`, same
  secret as the routes); `join <tableId>` succeeds only for a seated user or an admin, and a
  socket holds one table room at a time. `tracker` and `chat` are global rooms.
- **The poll is the fallback, not gone.** While the socket is connected the table poll runs
  every 15 s, the tracker/sheet loaders every 20 s and the chat every 20 s; the moment it
  drops they return to 2 / 6 / 3 s. A green dot in the table's topbar says which mode you are in.
- **Fails open.** With nothing attached (the route tests, a missing module) every `notify` is a
  no-op; the client swallows a connect error and keeps polling.
- **Deploy:** Render free supports WebSockets on the same service, no config. Vite dev proxies
  `/socket.io` with `ws: true`. Dependencies: `socket.io` (server) and `socket.io-client`
  (client; also a server devDependency for the test).
- **Tests:** `node server/test-realtime.js` — 22 checks with a real server on port 0 and a real
  client: no/bad/wrong-secret token refused, seated joins and unseated is refused, admin joins
  anything, a notify reaches only its room, moving rooms leaves the old one, the global rooms
  reach everyone, the event shape, and no-op before attach and after close.
- ⚠️ **Still not seen with a real database** — same limit as V-8. The first live session
  verifies the whole chain; if the green dot never lights, check the browser console for the
  handshake error and that the deploy is on HTTPS (mixed-content blocks `ws://`).

---

## V-10 — Skills auto-fire their damage-type effect (owner, 2026-09-23 — built)

Owner: *"Skills should auto-fire their damage type effect when used."* V-8's fx tool made the
GM pick a type by hand; this makes the skill carry it.

- **The route:** `POST /api/tables/:id/use-skill` (`requireAuth`; a player must be seated, the
  table must have a live map).
  - **Player** `{ skillId | templateId, targetTokenId? | to?{col,row} }` — the skill must be on
    their own sheet (`enrichSkills` over `character.state.skills`; anything else is 404). The
    effect travels **from their own token** if they have one on the live map; with no target
    it bursts on themselves.
  - **GM** `{ name, actorTokenId?, actorName?, type?, effect?, targetTokenId? | to? }` — an
    enemy ability by name from a selected token; `type` overrides the inference.
  - Queues one `fx` entry **per type** (label on the first), saves, `notify(… 'fx')`, and posts
    a `Message{ kind: 'skill', roll: { skill, types, target } }` so the chat announces
    *"⚡ Sasha uses Fire Ball → The Kindler (Burn)"* and `notifyChat` wakes every feed.
- **Where the type comes from** — `server/skill-fx.js`, pure and dependency-free:
  1. **Authored** `SkillTemplate.damageTypes` (new `[String]` field, coerced to the seven §7.3
     types by `normDamageTypes`; whitelisted in the library create, update and bulk-import
     routes, joined by `enrichSkills`, projected to the player). A ⚡ checkbox row in the skill
     library's edit modal and a `⚡ Burn` badge on the card.
  2. Else **read off the skill's own text** (name · effect · description) with the book's
     vocabulary: fire/flame/ember/torch → Burn · frost/ice/cold → Chill · slash/cut/claw/bite/
     blade → Bleed · punch/slam/smash/kick → Crush · poison/venom/toxic → Poison · infect/
     plague/spore/rot → Infection · dissolve/unravel/psychic/dread → Dissolution. Word-bounded,
     so *cutscene* is not a cut.
  3. Else heal words (heal/mend/triage/bandage/cure) → **Heal**.
  4. Else the neutral **Skill** burst (cyan ring, dashed cross, pulse) — **no skill is silent.**
  At most **two** types fire (a torch that also cuts).
- **Client:** `TablePage` has a *Skills — click one, then a target* panel built from the sheet's
  non-passive skills; arming one switches the board to the fx tool and the next click on a token
  or hex posts `use-skill`. `GmTablePage`'s fx tool gains an ability-name input and an **auto**
  type button; with a name set, `fireFx` goes through `use-skill` instead of the raw fx queue.
  `TableChat` renders `kind === 'skill'` rows; `FxLayer` has the `Skill` shape.
- ⚠️ **None of the 49 live templates carries `damageTypes` yet.** Inference does the work until
  the GM tags them; a wrong read is one checkbox in the library. Good candidates to check first:
  anything whose effect names a type only obliquely (a "wall" skill, a psychic taunt).
- **Not built, on purpose:** the route does not touch HP or conditions — it is the *broadcast*
  of a skill use, never its resolution. Damage still goes through the GM's per-part − / + so the
  sheet-sync rule (V-4: the table never writes a sheet wholesale) holds.
- **Tests:** `node server/test-skill-fx.js` (19: authored wins and caps at two, each vocabulary
  family, heal, neutral, word boundaries, coercion) and section 8g of `test-tables.js` (122:
  player fires from own token with the projectile `from`, authored two-type skill queues two
  effects, unknown skill 404, unseated 403, GM explicit type, GM inferred type, GM neutral,
  GM without a name 400, effects reach the poll and the chat).
