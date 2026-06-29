import { useState, useEffect } from "react";

const emptyForm = { title: "", author: "", status: "To Read", rating: 0 };

export default function BookForm({ onSave, editingBook, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingBook) {
      setForm({ title: editingBook.title, author: editingBook.author, status: editingBook.status, rating: editingBook.rating });
    } else {
      setForm(emptyForm);
    }
  }, [editingBook]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRate = (rating) => {
    setForm({ ...form, rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;
    onSave({ ...form, title: form.title.trim(), author: form.author.trim(), rating: Number(form.rating) });
    if (!editingBook) setForm(emptyForm);
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
      </div>
      <div className="form-row">
        <select name="status" value={form.status} onChange={handleChange}>
          <option>To Read</option>
          <option>Reading</option>
          <option>Read</option>
        </select>
        <div className="stars" style={{ alignItems: "center", padding: "0 0.25rem" }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className={`star ${s <= form.rating ? "filled" : ""}`} onClick={() => handleRate(s)}>
              ★
            </span>
          ))}
        </div>
        {editingBook ? (
          <>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
            <button type="button" className="btn btn-danger" onClick={onCancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <button type="submit" className="btn btn-primary">
            Add Book
          </button>
        )}
      </div>
    </form>
  );
}
