/**
 * Full database backup — no mongodump needed, uses the driver you already have.
 *
 *   node backup-db.js
 *
 * Dumps EVERY collection to ./backups/backup-<timestamp>/<collection>.json in
 * canonical Extended JSON (EJSON), which preserves ObjectIds and Dates exactly,
 * so a restore is byte-faithful. Read-only: never writes to the database.
 * Restore with: node restore-db.js backups/backup-<timestamp> --apply
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');

function getEJSON() {
  try { return require('bson').EJSON; } catch (_) { /* fall through */ }
  return mongoose.mongo.BSON.EJSON;
}


/**
 * The connection string with the password blanked out, for logging.
 * A seed run gets pasted into chat, issues and commit messages routinely — the
 * banner must never be the thing that leaks a live Atlas credential.
 * (Learned the hard way 2026-08-25: a pasted runbook exposed the campaign
 * password and it had to be rotated.)
 */
function redactUri(uri) {
  return String(uri).replace(/(mongodb(?:\+srv)?:\/\/[^:@/]+:)[^@]*@/i, '$1****@');
}

async function run() {
  const EJSON = getEJSON();
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outDir = path.join(__dirname, 'backups', `backup-${stamp}`);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Backing up ${redactUri(uri)}\n→ ${outDir}\n`);

  const collections = await db.listCollections().toArray();
  let total = 0;
  for (const { name } of collections) {
    if (name.startsWith('system.')) continue;
    const docs = await db.collection(name).find({}).toArray();
    fs.writeFileSync(path.join(outDir, `${name}.json`), EJSON.stringify(docs, { relaxed: false }));
    console.log(`  ${name}: ${docs.length} document(s)`);
    total += docs.length;
  }

  console.log(`\nDone — ${collections.length} collection(s), ${total} document(s).`);
  console.log(`Restore with: node restore-db.js backups/backup-${stamp} --apply`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
