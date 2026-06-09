const mysql = require('mysql2/promise');

const dbName = process.env.DB_NAME || 'crud-example';
const dbLink = process.env.DB_LINK;
const dbCaCertBase64 = process.env.DB_CA_CERT_BASE64?.trim();

function buildSslConfig() {
  if (!dbCaCertBase64) {
    return undefined;
  }

  return {
    ca: Buffer.from(dbCaCertBase64, 'base64').toString('utf8'),
  };
}

function buildConnectionConfigFromUrl(url, ssl) {
  const parsedUrl = new URL(url);

  return {
    host: parsedUrl.hostname,
    port: parsedUrl.port ? Number(parsedUrl.port) : 3306,
    user: decodeURIComponent(parsedUrl.username || 'root'),
    password: decodeURIComponent(parsedUrl.password || ''),
    database: parsedUrl.pathname.replace(/^\//, '') || dbName,
    ...(ssl ? { ssl } : {}),
  };
}

const ssl = buildSslConfig();

const connectionConfig =
  dbLink && (dbLink.startsWith('mysql://') || dbLink.startsWith('mysqls://'))
    ? buildConnectionConfigFromUrl(dbLink, ssl)
    : {
        host: process.env.DB_HOST || dbLink || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: dbName,
        ...(ssl ? { ssl } : {}),
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
