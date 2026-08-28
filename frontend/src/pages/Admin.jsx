import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';
import { Badge, Button, Input, Modal, PageNotice, Select, State } from '../components/UI';
import { formatDate, roleLabel, validateUserForm } from '../utils';

const links = [
  { to: '/admin', label: 'Dashboard', icon: 'D' },
  { to: '/admin/users', label: 'Users', icon: 'U' },
  { to: '/admin/stores', label: 'Stores', icon: 'S' },
  { to: '/admin/add-user', label: 'Add User', icon: '+' },
  { to: '/admin/add-store', label: 'Add Store', icon: '+' },
  { to: '/password', label: 'Password', icon: 'P' },
];

function SortButton({ label, field, sort, direction, onChange }) {
  const active = sort === field;
  return <button className="sort-button" type="button" onClick={() => onChange(field)}>{label} {!active ? '↕' : direction === 'asc' ? '↑' : '↓'}</button>;
}

export default function Admin() {
  const location = useLocation();
  const section = location.pathname === '/admin/users' ? 'users' : location.pathname === '/admin/stores' ? 'stores' : 'dashboard';
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [userSort, setUserSort] = useState({ field: 'name', direction: 'asc' });
  const [storeSort, setStoreSort] = useState({ field: 'name', direction: 'asc' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadStats() { const r = await api.get('/admin/dashboard'); setStats(r.data); }
  async function loadUsers(filters = userFilters, sorting = userSort) { const r = await api.get('/admin/users', { params: { ...filters, sort: sorting.field, dir: sorting.direction } }); setUsers(r.data); }
  async function loadStores(filters = storeFilters, sorting = storeSort) { const r = await api.get('/admin/stores', { params: { ...filters, sort: sorting.field, dir: sorting.direction } }); setStores(r.data); }

  async function loadPage() {
    setLoading(true); setError('');
    try {
      if (section === 'dashboard') await Promise.all([loadStats(), loadUsers(), loadStores()]);
      else if (section === 'users') await loadUsers();
      else await loadStores();
    } catch (e) { setError(e.response?.data?.message || 'Could not load administrator data.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadPage(); }, [section]);

  function toggleUserSort(field) {
    const next = { field, direction: userSort.field === field && userSort.direction === 'asc' ? 'desc' : 'asc' };
    setUserSort(next); loadUsers(userFilters, next).catch(() => setError('Could not sort users.'));
  }
  function toggleStoreSort(field) {
    const next = { field, direction: storeSort.field === field && storeSort.direction === 'asc' ? 'desc' : 'asc' };
    setStoreSort(next); loadStores(storeFilters, next).catch(() => setError('Could not sort stores.'));
  }
  async function openUser(userId) {
    try { const r = await api.get(`/admin/users/${userId}`); setSelectedUser(r.data); }
    catch (e) { setError(e.response?.data?.message || 'Could not load user details.'); }
  }
  async function removeUser(user) {
    if (!window.confirm(`Remove ${user.name}? This also removes their submitted ratings.`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      setSelectedUser(null); setEditingUser(null);
      await Promise.all([loadUsers(), loadStats()]);
      if (section === 'dashboard') await loadStores();
    } catch (e) { setError(e.response?.data?.message || 'Could not remove the user.'); }
  }
  async function saveUser(event) {
    event.preventDefault();
    const errors = validateUserForm(editingUser, false);
    if (Object.keys(errors).length) { setError(Object.values(errors)[0]); return; }
    try {
      await api.put(`/admin/users/${editingUser.id}`, editingUser);
      setEditingUser(null); setSelectedUser(null);
      await Promise.all([loadUsers(), loadStats()]);
    } catch (e) { setError(e.response?.data?.message || 'Could not update the user.'); }
  }

  return (
    <AppLayout links={links}>
      <PageNotice message={error} />
      {loading ? <State type="loading" title="Loading administrator workspace">Fetching current database information.</State> : null}
      {!loading && section === 'dashboard' ? (
        <>
          <header className="page-head admin-heading"><div><p className="eyebrow">Control centre</p><h1>RateBoard command dashboard</h1><p className="muted">Monitor the live directory, manage accounts and keep the rating platform healthy.</p></div><div className="live-chip"><span /> Live database</div></header>
          <div className="stat-grid admin-stat-grid">
            <Link className="stat-card stat-card-accent" to="/admin/users"><span>Total users</span><strong>{stats?.users ?? '—'}</strong><small>All registered accounts</small></Link>
            <Link className="stat-card" to="/admin/stores"><span>Stores online</span><strong>{stats?.stores ?? '—'}</strong><small>Visible in the user directory</small></Link>
            <div className="stat-card"><span>Ratings submitted</span><strong>{stats?.ratings ?? '—'}</strong><small>Customer feedback records</small></div>
          </div>
          <section className="role-overview">
            <div><span>Administrators</span><strong>{stats?.roles?.admin ?? 0}</strong></div>
            <div><span>Normal users</span><strong>{stats?.roles?.user ?? 0}</strong></div>
            <div><span>Store owners</span><strong>{stats?.roles?.owner ?? 0}</strong></div>
            <div className="role-overview-action"><Link to="/admin/add-user">+ Create account</Link></div>
          </section>
          <section className="insight-card"><div><p className="eyebrow">Publishing flow</p><h2>Stores added by Admin are immediately available to Normal Users.</h2><p>After a store is created, it appears in the authenticated store directory and can be searched by name or address and rated by customers.</p></div><Link className="btn btn-secondary" to="/admin/add-store">Publish a store</Link></section>
          <UserTable users={users} filters={userFilters} setFilters={setUserFilters} sort={userSort} onSort={toggleUserSort} onSearch={() => loadUsers()} onView={openUser} onEdit={openUserForEdit} onDelete={removeUser} compact />
          <StoreTable stores={stores} filters={storeFilters} setFilters={setStoreFilters} sort={storeSort} onSort={toggleStoreSort} onSearch={() => loadStores()} compact />
        </>
      ) : null}
      {!loading && section === 'users' ? <><PageHeader title="User management" description="Search, filter, inspect, edit or remove platform accounts." /><UserTable users={users} filters={userFilters} setFilters={setUserFilters} sort={userSort} onSort={toggleUserSort} onSearch={() => loadUsers()} onView={openUser} onEdit={openUserForEdit} onDelete={removeUser} /></> : null}
      {!loading && section === 'stores' ? <><PageHeader title="Store directory" description="Review every published store and its live average rating." /><StoreTable stores={stores} filters={storeFilters} setFilters={setStoreFilters} sort={storeSort} onSort={toggleStoreSort} onSearch={() => loadStores()} /></> : null}

      {selectedUser ? <Modal title="User details" onClose={() => setSelectedUser(null)}><div className="detail-list"><div><span>Name</span><strong>{selectedUser.name}</strong></div><div><span>Email</span><strong>{selectedUser.email}</strong></div><div><span>Address</span><strong>{selectedUser.address}</strong></div><div><span>Role</span><strong><Badge tone={selectedUser.role}>{roleLabel(selectedUser.role)}</Badge></strong></div>{selectedUser.role === 'owner' ? <div><span>Store average</span><strong>{selectedUser.rating ?? 'No ratings yet'}</strong></div> : null}</div><div className="modal-actions"><Button variant="secondary" onClick={() => setEditingUser({ ...selectedUser })}>Edit user</Button><Button variant="danger" onClick={() => removeUser(selectedUser)}>Remove user</Button></div></Modal> : null}
      {editingUser ? <Modal title="Edit user" onClose={() => setEditingUser(null)}><form className="edit-user-form" onSubmit={saveUser}><Input label="Full name" name="name" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} required /><Input label="Email" name="email" type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} required /><Input label="Address" name="address" value={editingUser.address} onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })} required /><Select label="Role" name="role" value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}><option value="user">Normal User</option><option value="owner">Store Owner</option><option value="admin">Administrator</option></Select><div className="modal-actions"><Button variant="secondary" type="button" onClick={() => setEditingUser(null)}>Cancel</Button><Button type="submit">Save changes</Button></div></form></Modal> : null}
    </AppLayout>
  );

  async function openUserForEdit(userId) {
    try { const r = await api.get(`/admin/users/${userId}`); setEditingUser(r.data); }
    catch (e) { setError(e.response?.data?.message || 'Could not load user.'); }
  }
}

function PageHeader({ title, description }) { return <header className="page-head"><div><p className="eyebrow">Administration</p><h1>{title}</h1><p className="muted">{description}</p></div></header>; }

function UserTable({ users, filters, setFilters, sort, onSort, onSearch, onView, onEdit, onDelete, compact = false }) {
  return <section className="panel"><div className="panel-head"><div><h2>User directory</h2><p className="muted">Filter by name, email, address or role.</p></div>{compact ? <Link className="panel-link" to="/admin/users">View all →</Link> : null}</div><div className="filter-grid user-filter-grid"><Input label="Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} /><Input label="Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} /><Input label="Address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} /><Select label="Role" value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}><option value="">All roles</option><option value="admin">Administrator</option><option value="user">Normal User</option><option value="owner">Store Owner</option></Select><Button onClick={onSearch}>Apply filters</Button></div>{users.length === 0 ? <State title="No users found">No accounts match the current filters.</State> : <div className="table-scroll"><table><thead><tr><th><SortButton label="Name" field="name" {...sort} onChange={onSort} /></th><th><SortButton label="Email" field="email" {...sort} onChange={onSort} /></th><th><SortButton label="Address" field="address" {...sort} onChange={onSort} /></th><th><SortButton label="Role" field="role" {...sort} onChange={onSort} /></th><th>Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><strong>{user.name}</strong></td><td>{user.email}</td><td>{user.address}</td><td><Badge tone={user.role}>{roleLabel(user.role)}</Badge></td><td><div className="row-actions"><button className="text-button" onClick={() => onView(user.id)} type="button">View</button><button className="text-button" onClick={() => onEdit(user.id)} type="button">Edit</button><button className="text-button danger-text" onClick={() => onDelete(user)} type="button">Remove</button></div></td></tr>)}</tbody></table></div>}</section>;
}

function StoreTable({ stores, filters, setFilters, sort, onSort, onSearch, compact = false }) {
  return <section className="panel"><div className="panel-head"><div><h2>Store directory</h2><p className="muted">Published stores are visible to Normal Users for search and rating.</p></div>{compact ? <Link className="panel-link" to="/admin/stores">View all →</Link> : null}</div><div className="filter-grid store-filter-grid"><Input label="Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} /><Input label="Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} /><Input label="Address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} /><Button onClick={onSearch}>Apply filters</Button></div>{stores.length === 0 ? <State title="No stores found">No stores match the current filters.</State> : <div className="table-scroll"><table><thead><tr><th><SortButton label="Name" field="name" {...sort} onChange={onSort} /></th><th><SortButton label="Email" field="email" {...sort} onChange={onSort} /></th><th><SortButton label="Address" field="address" {...sort} onChange={onSort} /></th><th><SortButton label="Rating" field="rating" {...sort} onChange={onSort} /></th></tr></thead><tbody>{stores.map((store) => <tr key={store.id}><td><strong>{store.name}</strong></td><td>{store.email}</td><td>{store.address}</td><td>{store.rating == null ? <span className="muted-inline">No ratings yet</span> : `${store.rating} / 5`}</td></tr>)}</tbody></table></div>}</section>;
}
