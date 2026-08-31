const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

function openDatabase(databasePath) {
  if (databasePath !== ':memory:') {
    fs.mkdirSync(path.dirname(path.resolve(databasePath)), { recursive: true });
  }

  const db = new Database(databasePath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL COLLATE NOCASE UNIQUE,
      stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
      available INTEGER NOT NULL DEFAULT 1 CHECK (available IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
}

function productForApi(row) {
  return {
    id: row.id,
    name: row.name,
    stock: row.stock,
    available: Boolean(row.available),
    status: row.stock === 0 ? 'Uitverkocht' : row.available ? 'Beschikbaar' : 'Niet beschikbaar',
    updatedAt: row.updated_at,
  };
}

module.exports = { openDatabase, productForApi };

