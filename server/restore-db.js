/**
 * Restore a backup made by backup-db.js.
 *
 *   node restore-db.js backups/backup-<timestamp>           → dry run (lists what it would restore)
 *   node restore-db.js backups/backup-<timestamp> --apply   → REPLACES each collection with the backup
 *
 * --apply empties each collection found in the backup folder and re-inserts
 * the backed-up documents (exact _ids preserved via EJSON). Collections not
 * present in the backup folder are left untouched.
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function getEJSON() {
  try { return require('bson').EJSON; } catch (_) { /* fall through */ }
  return mongoose.mongo.BSON.EJSON;
}

async function run() {
  const EJSON = getEJSON();
  const args = process.argv.slice(2).filter(a => a !== '--apply');
  const apply = process.argv.includes('--apply');
  if (!args[0]) {
    console.error('Usage: node restore-db.js <backup-dir> [--apply]');
    process.exit(1);
  }
  const dir = path.resolve(__dirname, '..', args[0]);
  const dirAlt = path.resolve(args[0]);
  const backupDir = fs.existsSync(dir) ? dir : dirAlt;
  if (!fs.existsSync(backupDir)) {
    console.error(`Backup dir not found: ${args[0]}`);
    process.exit(1);
  }

  const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.error('No .json files in that folder — is it a backup-db.js output dir?');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  console.log(`${apply ? '=== APPLY: REPLACING collections ===' : '=== DRY RUN (pass --apply to restore) ==='}`);
  console.log(`${backupDir} → ${uri}\n`);

  for (const file of files) {
    const name = path.basename(file, '.json');
    const docs = EJSON.parse(fs.readFileSync(path.join(backupDir, file), 'utf8'));
    const current = await db.collection(name).countDocuments();
    console.log(`  ${name}: restore ${docs.length} document(s) (currently ${current})`);
    if (apply) {
      await db.collection(name).deleteMany({});
      if (docs.length > 0) await db.collection(name).insertMany(docs);
    }
  }

  console.log(`\n${apply ? 'Restore complete.' : 'Dry run — nothing changed.'}`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
