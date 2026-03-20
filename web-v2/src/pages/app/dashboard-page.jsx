import { useDashboard } from '../../features/dashboard/use-dashboard';
import { StatCard } from '../../components/dashboard/stat-card';

function formatNumber(value) {
  return new Intl.NumberFormat('fr-CH').format(Number(value || 0));
}

export function DashboardPage() {
  const { loading, error, user, summary, reload } = useDashboard();

  return (
    <section className="page-section">
      <div className="page-header-row">
        <div>
          <p className="eyebrow">app</p>
          <h1>Dashboard</h1>
          <p>Version simplifiée branchée au backend existant.</p>
        </div>
        <button className="button" onClick={reload} disabled={loading}>Refresh</button>
      </div>

      {error ? <div className="error-box">{error}</div> : null}

      <div className="stats-grid">
        <StatCard label="Utilisateur" value={user?.username || '-'} help="Session courante" />
        <StatCard label="Balance" value={formatNumber(user?.quota)} help="Quota actuel" />
        <StatCard label="Consumption" value={formatNumber(user?.used_quota)} help="Consommation cumulée" />
        <StatCard label="Request count" value={formatNumber(user?.request_count)} help="Compteur global" />
        <StatCard label="Requests today" value={formatNumber(summary.requests)} help="Période du jour" />
        <StatCard label="Quota today" value={formatNumber(summary.quota)} help="Quota consommé aujourd'hui" />
      </div>

      <div className="panel-block">
        <h2>Données de période</h2>
        <p>{loading ? 'Chargement...' : `${summary.items} lignes agrégées récupérées.`}</p>
      </div>
    </section>
  );
}
