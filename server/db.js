import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbDir = join(__dirname, 'db');
mkdirSync(dbDir, { recursive: true });
const dbPath = join(dbDir, 'diary.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT NOT NULL,
      isPublic INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      slug TEXT UNIQUE
    )
  `);
});

export default db;
