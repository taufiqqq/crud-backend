const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbName = process.env.DB_NAME || 'crud-example';
const dbLink = process.env.DB_LINK || path.join(process.cwd(), `${dbName}.db`);

const db = new sqlite3.Database(dbLink);

function initializeDatabase() {
  return run(
    `CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`
  );
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function close() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

module.exports = {
  db,
  initializeDatabase,
  run,
  close,
};
