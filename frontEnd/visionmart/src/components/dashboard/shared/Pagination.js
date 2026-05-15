function Pagination({ meta, onPageChange }) {
  if (!meta || !meta.last_page || meta.last_page <= 1) return null;

  const current = Number(meta.current_page || 1);
  const last = Number(meta.last_page || 1);
  const pages = Array.from({ length: last }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === last || Math.abs(p - current) <= 2
  );

  return (
    <div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
      <button className="btn btn-sm btn-inverse-primary" disabled={current <= 1} onClick={() => onPageChange(current - 1)}>
        Previous
      </button>
      {pages.map((p, index) => {
        const prev = pages[index - 1];
        return (
          <span key={p} className="d-inline-flex align-items-center gap-2">
            {prev && p - prev > 1 && <span className="text-muted">...</span>}
            <button
              className={`btn btn-sm ${p === current ? 'btn-primary' : 'btn-inverse-primary'}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          </span>
        );
      })}
      <button className="btn btn-sm btn-inverse-primary" disabled={current >= last} onClick={() => onPageChange(current + 1)}>
        Next
      </button>
    </div>
  );
}

export default Pagination;
