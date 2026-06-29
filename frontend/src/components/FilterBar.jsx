const filters = ["All", "To Read", "Reading", "Read"];

export default function FilterBar({ current, onChange }) {
  return (
    <div className="filter-bar">
      {filters.map((f) => (
        <button key={f} className={`filter-btn ${current === f ? "active" : ""}`} onClick={() => onChange(f)}>
          {f}
        </button>
      ))}
    </div>
  );
}
