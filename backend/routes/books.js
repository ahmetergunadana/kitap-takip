const express = require("express");

module.exports = function (db) {
  const router = express.Router();

  router.get("/", (req, res) => {
    const { status } = req.query;
    let books;
    if (status) {
      books = db.prepare("SELECT * FROM books WHERE status = ? ORDER BY created_at DESC").all(status);
    } else {
      books = db.prepare("SELECT * FROM books ORDER BY created_at DESC").all();
    }
    res.json(books);
  });

  router.post("/", (req, res) => {
    const { title, author, status, rating } = req.body;
    if (!title || !author || !status || rating == null) {
      return res.status(400).json({ error: "title, author, status, and rating are required" });
    }
    const result = db.prepare("INSERT INTO books (title, author, status, rating) VALUES (?, ?, ?, ?)").run(title, author, status, rating);
    const book = db.prepare("SELECT * FROM books WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(book);
  });

  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { title, author, status, rating } = req.body;
    const existing = db.prepare("SELECT * FROM books WHERE id = ?").get(id);
    if (!existing) {
      return res.status(404).json({ error: "Book not found" });
    }
    db.prepare("UPDATE books SET title = ?, author = ?, status = ?, rating = ? WHERE id = ?")
      .run(title ?? existing.title, author ?? existing.author, status ?? existing.status, rating ?? existing.rating, id);
    const book = db.prepare("SELECT * FROM books WHERE id = ?").get(id);
    res.json(book);
  });

  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const existing = db.prepare("SELECT * FROM books WHERE id = ?").get(id);
    if (!existing) {
      return res.status(404).json({ error: "Book not found" });
    }
    db.prepare("DELETE FROM books WHERE id = ?").run(id);
    res.status(204).end();
  });

  return router;
};
