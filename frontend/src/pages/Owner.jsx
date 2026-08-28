import { useEffect, useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';
import { Rating, PageNotice, State } from '../components/UI';
import { formatDate } from '../utils';

const links = [
  { to: '/owner', label: 'Dashboard', icon: 'D' },
  { to: '/password', label: 'Password', icon: 'P' },
];

export default function Owner() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  async function loadDashboard() {
    setError('');
    try {
      const response = await api.get('/store-owner/dashboard');
      setDashboard(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load your dashboard.');
    }
  }

  useEffect(() => {
    loadDashboard();
    const timer = window.setInterval(loadDashboard, 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <AppLayout links={links}>
      <PageNotice message={error} />
      {!dashboard && !error ? <State type="loading" title="Loading dashboard">Fetching your store rating activity.</State> : null}
      {dashboard ? <OwnerContent dashboard={dashboard} onRefresh={loadDashboard} /> : null}
    </AppLayout>
  );
}

function OwnerContent({ dashboard, onRefresh }) {
  if (!dashboard.store) {
    return <State title="No store assigned">Your account is not currently linked to a store.</State>;
  }

  return (
    <>
      <header className="page-head owner-heading">
        <div>
          <p className="eyebrow">Store owner workspace</p>
          <h1>{dashboard.store.name}</h1>
          <p className="muted">A focused view of customer rating activity for your store.</p>
        </div>
        <button className="refresh-button" type="button" onClick={onRefresh}>↻ Refresh</button>
      </header>

      <section className="owner-hero">
        <div className="owner-score">
          <span>Average rating</span>
          <strong>{dashboard.average ?? '—'}</strong>
          <Rating value={Math.round(Number(dashboard.average) || 0)} readonly />
          <small>out of 5</small>
        </div>
        <div className="owner-summary">
          <strong>{dashboard.ratings.length}</strong>
          <span>{dashboard.ratings.length === 1 ? 'customer rating' : 'customer ratings'}</span>
        </div>
        <div className="owner-distribution">
          {[5, 4, 3, 2, 1].map((score) => {
            const count = dashboard.distribution?.[score] || 0;
            const total = dashboard.ratings.length || 1;
            return (
              <div className="distribution-row" key={score}>
                <span>{score}★</span>
                <div className="distribution-track"><i style={{ width: `${Math.round((count / total) * 100)}%` }} /></div>
                <strong>{count}</strong>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Users who rated your store</h2>
            <p className="muted">Only rating records belonging to your assigned store are shown.</p>
          </div>
        </div>

        {dashboard.ratings.length === 0 ? (
          <State title="No ratings yet">Customer ratings will appear here after a normal user submits one.</State>
        ) : (
          <div className="table-scroll">
            <table>
              <thead><tr><th>User</th><th>Email</th><th>Rating</th><th>Submitted / updated</th></tr></thead>
              <tbody>
                {dashboard.ratings.map((rating) => (
                  <tr key={`${rating.email}-${rating.updated_at}`}>
                    <td><strong>{rating.name}</strong></td>
                    <td>{rating.email}</td>
                    <td><span className="rating-pill">★ {rating.rating}</span></td>
                    <td>{formatDate(rating.updated_at || rating.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
