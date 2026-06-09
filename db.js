const mysql = require('mysql2/promise');

const dbName = process.env.DB_NAME || 'crud-example';
const dbLink = process.env.DB_LINK;

const connectionConfig =
  dbLink && (dbLink.startsWith('mysql://') || dbLink.startsWith('mysqls://'))
    ? dbLink
    : {
        host: process.env.DB_HOST || dbLink || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: dbName,
      };

const db = mysql.createPool(connectionConfig);

function initializeDatabase() {
  return run(
    `CREATE TABLE IF NOT EXISTS books (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
    )`
  );
}

function run(sql, params = []) {
  return db.execute(sql, params).then(([result]) => ({
    id: result.insertId || 0,
    changes: result.affectedRows || 0,
  }));
}

function close() {
  return db.end();
}

module.exports = {
  db,
  initializeDatabase,
  run,
  close,
};
