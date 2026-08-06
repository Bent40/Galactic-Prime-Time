# Deploy cookbook — Render (free) + MongoDB Atlas (M0)

One web service hosts everything: Express serves `/api/*` and the built client
(`server.js` already has the static serving, SPA fallback, and `/api/health`).
The blueprint is `render.yaml` at the repo root — Render reads it from `main`.

## Phase 0 — already in the repo (nothing to do)

`render.yaml` (build + start + health check + env var slots) · `/api/health` ·
SPA fallback (deep links like `/wiki` work) · `PORT`/`MONGODB_URI`/`JWT_SECRET`/
`ADMIN_SECRET` all env-driven · `server/.env` is gitignored.

## Phase 1 — Atlas (the database) ~10 min

1. <https://www.mongodb.com/cloud/atlas/register> → free account → **Build a
   Database → M0 Free** → pick a region near where you play → create.
2. **Database Access** → Add New Database User → username + a generated
   password (save it) → role **Read and write to any database**.
3. **Network Access** → Add IP Address → **0.0.0.0/0** (allow from anywhere).
   Required: free Render has no fixed egress IPs. The password + TLS is the
   gate — use the generated password, not a pet name.
4. **Connect → Drivers** → copy the connection string and **put the database
   name in the path** (otherwise data lands in `test`):

   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/galactic-prime-time
   ```

## Phase 2 — migrate the campaign DB ~5 min

Run the **item seed runbook locally first** (CLAUDE.md), so what you upload is
the finished library. Then, from `server/` on the campaign machine:

```powershell
node backup-db.js                                        # local EJSON dump
$env:MONGODB_URI = "mongodb+srv://...galactic-prime-time"  # PowerShell
node restore-db.js backups/backup-<timestamp> --apply
```

(bash/cmd equivalents: `MONGODB_URI="..." node restore-db.js ... --apply` /
`set MONGODB_URI=...` then run.) The restore prints per-collection counts —
users travel with their password hashes, so everyone's login keeps working.

## Phase 3 — Render (the app) ~10 min

1. <https://render.com> → sign up **with GitHub** → authorize the
   `Galactic-Prime-Time` repo.
2. **New → Blueprint** → pick the repo → Render reads `render.yaml` from
   `main` → it shows one free web service.
3. Fill the three secret env vars when prompted:
   - `MONGODB_URI` — the Atlas string from Phase 1.
   - `JWT_SECRET` — long random hex. Generate one:
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `ADMIN_SECRET` — same recipe, different value.
   **Never leave these at the dev defaults — `dev_secret` on a public URL
   means anyone can forge an admin token.**
4. **Apply.** First build takes a few minutes (client build + server install).
   Watch the logs for `MongoDB connected` and `Server listening`.

## Phase 4 — verify ~2 min

- `https://<service>.onrender.com/api/health` → `{"status":"ok"}`
- Log in with an existing account → sheet loads, autosave badge behaves.
- Admin login → Items section shows the seeded library; Box Namer expands.
- Deep-link `/wiki` directly → the rulebook renders (SPA fallback working).

## Phase 5 — operations

- **Cold start:** free Render sleeps after ~15 idle minutes; first hit takes
  ~30–60s. Open the URL five minutes before session; your own 5–12s polling
  keeps it awake all night.
- **Deploys:** push to `main` → auto-deploys (`autoDeploy: true`).
- **Future seeds/migrations against prod:** any `server/` script honors
  `MONGODB_URI` — run them from your machine with the Atlas string exactly
  like Phase 2. Same runbooks, different URI.
- **Backups:** `MONGODB_URI="<atlas>" node backup-db.js` pulls a full EJSON
  dump to your machine. Do it before every seed run and occasionally on
  principle.
- **Rotating `JWT_SECRET`** logs every player out (tokens die). Fine — they
  log back in.
- **Open registration:** `POST /api/auth/register` is public — anyone with
  the URL can make an account. Stakes are low (they see only their own blank
  sheet; admin is gated by `isAdmin` + `ADMIN_SECRET`), but if the show gets
  gate-crashers, a one-line registration-code gate is a small follow-up.
- **Free-tier math:** 750 instance-hours/month — one service that sleeps when
  idle never gets close.
