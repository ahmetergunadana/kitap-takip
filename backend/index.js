const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");
const booksRouter = require("./routes/books");

const app = express();
const PORT = 3001;

const db = new Database(path.join(__dirname, "books.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('To Read', 'Reading', 'Read')),
    rating INTEGER NOT NULL CHECK(rating >= 0 AND rating <= 5),
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

app.use(cors());
app.use(express.json());

app.use("/api/books", booksRouter(db));

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
