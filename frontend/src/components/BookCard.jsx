export default function BookCard({ book, onEdit, onDelete, onRate }) {
  const handleRate = async (rating) => {
    await fetch(`/api/books/${book.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });
    onRate();
  };

  const statusClass = {
    "To Read": "status-to-read",
    Reading: "status-reading",
    Read: "status-read",
  }[book.status];

  return (
    <div className="book-card">
      <div className="book-info">
        <div className="book-title">{book.title}</div>
        <div className="book-author">{book.author}</div>
        <div className="book-meta">
          <span className={`book-status ${statusClass}`}>{book.status}</span>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className={`star ${s <= book.rating ? "filled" : ""}`} onClick={() => handleRate(s)}>
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="book-actions">
        <button className="btn btn-primary btn-sm" onClick={() => onEdit(book)}>
          Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(book.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
