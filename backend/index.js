const express = require("express");
const cors = require("cors");
const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");
const booksRouter = require("./routes/books");

const DB_PATH = path.join(__dirname, "books.db");
const PORT = process.env.PORT || 3001;

async function start() {
  const SQL = await initSqlJs();

  let db;
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('To Read', 'Reading', 'Read')),
      rating INTEGER NOT NULL CHECK(rating >= 0 AND rating <= 5),
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  function saveDb() {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/books", booksRouter(db, saveDb));

  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, "..", "frontend", "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
