import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../layouts/AppLayout';
import api from '../services/api';
import { Button, Input, PageNotice, Select } from '../components/UI';
import { validateStoreForm, validateUserForm, passwordPattern } from '../utils';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'D' },
  { to: '/admin/users', label: 'Users', icon: 'U' },
  { to: '/admin/stores', label: 'Stores', icon: 'S' },
  { to: '/admin/add-user', label: 'Add User', icon: '+' },
  { to: '/admin/add-store', label: 'Add Store', icon: '+' },
  { to: '/password', label: 'Password', icon: 'P' },
];

const emptyUser = {
  name: '',
  email: '',
  address: '',
  password: '',
  role: 'user',
};

export function AddUser() {
  const [form, setForm] = useState(emptyUser);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setMessage('');

    const validationErrors = validateUserForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setBusy(true);
    try {
      await api.post('/admin/users', form);
      navigate('/admin/users');
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Could not create the user.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppLayout links={adminLinks}>
      <FormHeader title="Add user" description="Create an administrator, normal user or store owner account." />
      <form className="panel form-card" onSubmit={submit}>
        <PageNotice message={message} />
        <Input label="Full name" name="name" value={form.name} onChange={updateField} error={errors.name} hint="20–60 characters" required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={updateField} error={errors.email} required />
        <Input label="Address" name="address" value={form.address} onChange={updateField} error={errors.address} required />
        <Input label="Password" name="password" type="password" value={form.password} onChange={updateField} error={errors.password} hint="8–16 characters, uppercase + special character" required />
        <Select label="Role" name="role" value={form.role} onChange={updateField}>
          <option value="user">Normal User</option>
          <option value="admin">Administrator</option>
          <option value="owner">Store Owner</option>
        </Select>
        <Button type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create user'}</Button>
      </form>
    </AppLayout>
  );
}

export function AddStore() {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/users', { params: { role: 'owner' } })
      .then((response) => setOwners(response.data))
      .catch(() => setMessage('Could not load store owners.'));
  }, []);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setMessage('');

    const validationErrors = validateStoreForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setBusy(true);
    try {
      await api.post('/admin/stores', { ...form, ownerId: form.ownerId || null });
      navigate('/admin/stores');
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Could not create the store.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppLayout links={adminLinks}>
      <FormHeader title="Add store" description="Register a store and optionally assign its store owner." />
      <form className="panel form-card" onSubmit={submit}>
        <PageNotice message={message} />
        <Input label="Store name" name="name" value={form.name} onChange={updateField} error={errors.name} required />
        <Input label="Store email" name="email" type="email" value={form.email} onChange={updateField} error={errors.email} required />
        <Input label="Store address" name="address" value={form.address} onChange={updateField} error={errors.address} required />
        <Select label="Store owner" name="ownerId" value={form.ownerId} onChange={updateField}>
          <option value="">Unassigned</option>
          {owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name} — {owner.email}</option>)}
        </Select>
        <Button type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create store'}</Button>
      </form>
    </AppLayout>
  );
}

export function Password() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setMessage('');

    if (!passwordPattern.test(password)) {
      setMessage('Password must be 8–16 characters and include an uppercase letter and a special character.');
      return;
    }

    setBusy(true);

    try {
      await api.patch('/auth/password', { password });
      setPassword('');
      setMessage('Password updated successfully.');
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Could not update the password.');
    } finally {
      setBusy(false);
    }
  }

  const { user } = useAuth();
  const links = user?.role === 'admin'
    ? [
        { to: '/admin', label: 'Dashboard', icon: 'D' },
        { to: '/admin/users', label: 'Users', icon: 'U' },
        { to: '/admin/stores', label: 'Stores', icon: 'S' },
        { to: '/password', label: 'Password', icon: 'P' },
      ]
    : user?.role === 'owner'
      ? [
          { to: '/owner', label: 'Dashboard', icon: 'D' },
          { to: '/password', label: 'Password', icon: 'P' },
        ]
      : [
          { to: '/stores', label: 'Browse stores', icon: 'S' },
          { to: '/password', label: 'Password', icon: 'P' },
        ];

  return (
    <AppLayout links={links}>
      <FormHeader title="Update password" description={`Change the password for your ${user?.role === 'owner' ? 'store owner' : user?.role === 'admin' ? 'administrator' : 'normal user'} account.`} />
      <form className="panel form-card" onSubmit={submit}>
        <PageNotice message={message} />
        <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} hint="8–16 characters, uppercase + special character" required />
        <Button type="submit" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</Button>
      </form>
    </AppLayout>
  );
}

function FormHeader({ title, description }) {
  return (
    <header className="page-head">
      <div>
        <p className="eyebrow">Administration</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>
    </header>
  );
}
