const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite");

db.run(`
CREATE TABLE IF NOT EXISTS verifications (
  userId TEXT,
  steamId TEXT,
  code TEXT
)
`);

module.exports = db;
