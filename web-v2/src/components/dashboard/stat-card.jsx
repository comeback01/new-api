export function StatCard({ label, value, help }) {
  return (
    <article className="stat-card">
      <p className="stat-label">{label}</p>
      <h2 className="stat-value">{value}</h2>
      {help ? <p className="stat-help">{help}</p> : null}
    </article>
  );
}
