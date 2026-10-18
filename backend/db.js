const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
const filename = process.env.DB_PATH || './data/portfolio.sqlite';
const dbPath = filename === ':memory:' ? filename : path.resolve(__dirname, filename);
if (dbPath !== ':memory:') fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new DatabaseSync(dbPath);
db.exec('PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL;');
// Only seed when the application table is first created. Deleted rows stay deleted.
const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='portfolio'").get();
db.exec('BEGIN');
try {
  db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
  if (!exists) db.exec(fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8'));
  db.exec('COMMIT');
} catch (error) { db.exec('ROLLBACK'); throw error; }
module.exports = db;
