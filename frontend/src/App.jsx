import { useState, useEffect, useCallback } from "react";
import BookForm from "./components/BookForm";
import BookCard from "./components/BookCard";
import FilterBar from "./components/FilterBar";

export default function App() {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editingBook, setEditingBook] = useState(null);

  const fetchBooks = useCallback(async () => {
    const url = filter === "All" ? "/api/books" : `/api/books?status=${encodeURIComponent(filter)}`;
    const res = await fetch(url);
    const data = await res.json();
    setBooks(data);
  }, [filter]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSave = async (bookData) => {
    if (editingBook) {
      await fetch(`/api/books/${editingBook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      setEditingBook(null);
    } else {
      await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
    }
    fetchBooks();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    fetchBooks();
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  return (
    <div className="app">
      <h1>Kitap Takip</h1>
      <BookForm onSave={handleSave} editingBook={editingBook} onCancelEdit={handleCancelEdit} />
      <FilterBar current={filter} onChange={setFilter} />
      {books.length === 0 ? (
        <p className="empty-state">No books yet. Add one above!</p>
      ) : (
        <div className="book-list">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onEdit={handleEdit} onDelete={handleDelete} onRate={fetchBooks} />
          ))}
        </div>
      )}
    </div>
  );
}
