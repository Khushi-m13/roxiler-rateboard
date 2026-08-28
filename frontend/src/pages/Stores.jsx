import { useEffect, useRef, useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';
import { Button, Input, Modal, PageNotice, Rating, State } from '../components/UI';

const links = [
  { to: '/stores', label: 'Browse Stores', icon: 'S' },
  { to: '/password', label: 'Password', icon: 'P' },
];

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const searchRef = useRef(search);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  async function loadStores(filters = search) {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/stores', {
        params: {
          name: filters.name.trim(),
          address: filters.address.trim(),
        },
        headers: { 'Cache-Control': 'no-cache' },
      });
      setStores(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load stores.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStores();
    const timer = window.setInterval(() => loadStores(searchRef.current), 30000);
    return () => window.clearInterval(timer);
  }, []);

  function openRating(store) {
    setSelectedStore(store);
    setSelectedRating(store.myRating || 0);
  }

  async function saveRating() {
    if (!selectedStore || !selectedRating) return;

    setSaving(true);
    setError('');

    try {
      if (selectedStore.ratingId) {
        await api.put(`/ratings/${selectedStore.ratingId}`, { rating: selectedRating });
      } else {
        await api.post('/ratings', {
          storeId: selectedStore.id,
          rating: selectedRating,
        });
      }

      setSelectedStore(null);
      setSelectedRating(0);
      await loadStores();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save your rating.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout links={links}>
      <header className="page-head">
        <div>
          <p className="eyebrow">Customer workspace</p>
          <h1>Find a store worth rating</h1>
          <p className="muted">Search the directory, check the overall rating and share your experience.</p>
        </div>
      </header>

      <section className="search-panel">
        <Input label="Store name" value={search.name} onChange={(e) => setSearch({ ...search, name: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && loadStores()} placeholder="e.g. Copper Spoon" />
        <Input label="Address" value={search.address} onChange={(e) => setSearch({ ...search, address: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && loadStores()} placeholder="e.g. Pune" />
        <Button onClick={loadStores}>Search stores</Button>
      </section>
      {!loading && stores.length > 0 ? <p className="results-meta">{stores.length} {stores.length === 1 ? 'store' : 'stores'} currently available · directory refreshes automatically</p> : null}

      <PageNotice message={error} />

      {loading ? <State type="loading" title="Loading stores">Fetching the latest store ratings.</State> : null}
      {!loading && stores.length === 0 ? <State title="No stores found">Try a different store name or address.</State> : null}

      {!loading && stores.length > 0 ? (
        <div className="store-grid">
          {stores.map((store) => (
            <article className="store-card" key={store.id}>
              <div className="store-heading">
                <div className="store-avatar">{store.name.charAt(0).toUpperCase()}</div>
                <div>
                  <h2>{store.name}</h2>
                  <p>{store.address}</p>
                </div>
              </div>

              <div className="store-rating-summary">
                <div>
                  <span className="label">Overall rating</span>
                  <strong>{store.rating ?? '—'}</strong>
                  <Rating value={Math.round(store.rating || 0)} readonly />
                </div>
                <div>
                  <span className="label">My rating</span>
                  <strong>{store.myRating ? `${store.myRating}/5` : 'Not rated'}</strong>
                  <span className="small-note">{store.myRating ? 'You can update it' : 'Your first rating is welcome'}</span>
                </div>
              </div>

              <Button variant="secondary" onClick={() => openRating(store)}>
                {store.myRating ? 'Update my rating' : 'Rate this store'}
              </Button>
            </article>
          ))}
        </div>
      ) : null}

      {selectedStore ? (
        <Modal title={selectedStore.myRating ? 'Update your rating' : 'Rate this store'} onClose={() => setSelectedStore(null)}>
          <p className="modal-store-name">{selectedStore.name}</p>
          <p className="muted">Choose a rating from 1 to 5 stars.</p>
          <Rating value={selectedRating} onChange={setSelectedRating} />
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setSelectedStore(null)}>Cancel</Button>
            <Button onClick={saveRating} disabled={!selectedRating || saving}>{saving ? 'Saving…' : 'Save rating'}</Button>
          </div>
        </Modal>
      ) : null}
    </AppLayout>
  );
}
