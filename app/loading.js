export default function Loading() {
  return <div className="container" role="status" aria-label="Loading page">
    <div className="page-heading" aria-hidden="true">
      <div className="skeleton-block skeleton-line short" style={{ marginInline: "auto" }} />
      <div className="skeleton-block skeleton-line long" style={{ width: "45%", height: 28, marginInline: "auto" }} />
    </div>
    <div className="card-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {[0, 1, 2].map((item) => <div className="skeleton-card" key={item}><div className="skeleton-block skeleton-cover" /><div className="skeleton-block skeleton-line short" /><div className="skeleton-block skeleton-line long" /><div className="skeleton-block skeleton-line" /></div>)}
    </div>
  </div>;
}
