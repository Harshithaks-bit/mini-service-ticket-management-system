const Database = require("better-sqlite3");

const db = new Database("tickets.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    createdDate TEXT NOT NULL,
    updatedDate TEXT NOT NULL
  )
`);

console.log("Database connected successfully");

module.exports = db;