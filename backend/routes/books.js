const express = require("express");

function rowToObject(values) {
  return values.map(([id, title, author, status, rating, created_at]) => ({
    id,
    title,
    author,
    status,
    rating,
    created_at,
  }));
}

module.exports = function (db, saveDb) {
  const router = express.Router();

  router.get("/", (req, res) => {
    const { status } = req.query;
    let result;
    if (status) {
      result = db.exec("SELECT * FROM books WHERE status = ? ORDER BY created_at DESC", [status]);
    } else {
      result = db.exec("SELECT * FROM books ORDER BY created_at DESC");
    }
    res.json(result.length ? rowToObject(result[0].values) : []);
  });

  router.post("/", (req, res) => {
    const { title, author, status, rating } = req.body;
    if (!title || !author || !status || rating == null) {
      return res.status(400).json({ error: "title, author, status, and rating are required" });
    }
    db.run("INSERT INTO books (title, author, status, rating) VALUES (?, ?, ?, ?)", [title, author, status, Number(rating)]);
    saveDb();
    const result = db.exec("SELECT * FROM books ORDER BY id DESC LIMIT 1");
    const books = rowToObject(result[0].values);
    res.status(201).json(books[0]);
  });

  router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const existing = db.exec("SELECT * FROM books WHERE id = ?", [id]);
    if (!existing.length || !existing[0].values.length) {
      return res.status(404).json({ error: "Book not found" });
    }
    const row = existing[0].values[0];
    const { title, author, status, rating } = req.body;
    db.run("UPDATE books SET title = ?, author = ?, status = ?, rating = ? WHERE id = ?", [
      title ?? row[1],
      author ?? row[2],
      status ?? row[3],
      rating ?? row[4],
      id,
    ]);
    saveDb();
    const updated = db.exec("SELECT * FROM books WHERE id = ?", [id]);
    res.json(rowToObject(updated[0].values)[0]);
  });

  router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const existing = db.exec("SELECT * FROM books WHERE id = ?", [id]);
    if (!existing.length || !existing[0].values.length) {
      return res.status(404).json({ error: "Book not found" });
    }
    db.run("DELETE FROM books WHERE id = ?", [id]);
    saveDb();
    res.status(204).end();
  });

  return router;
};
