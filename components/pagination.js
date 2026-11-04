import { ArrowLeft, ArrowRight } from "lucide-react";

export function Pagination({ page, total, pageSize, onPageChange, label = "items" }) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount < 2) return null;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  return (
    <nav className="pagination" aria-label={`${label} pages`}>
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page"><ArrowLeft size={14} /> Previous</button>
      <span aria-live="polite">{first}–{last} of {total}</span>
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === pageCount} aria-label="Next page">Next <ArrowRight size={14} /></button>
    </nav>
  );
}
