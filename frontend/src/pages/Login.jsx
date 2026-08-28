import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Input, PageNotice } from '../components/UI';
import { useAuth } from '../context/AuthContext';

function homeForRole(role) {
  if (role === 'admin') return '/admin';
  if (role === 'owner') return '/owner';
  return '/stores';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      const user = await login(email, password);
      navigate(homeForRole(user.role), { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-intro">
        <div className="brand-mark large">R</div>
        <p className="eyebrow">Store ratings & administration</p>
        <h1>RateBoard</h1>
        <p>One place to browse stores, collect ratings and manage the platform.</p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in</h2>
          <p className="muted">Use the same login screen for every role.</p>
        </div>

        <PageNotice message={error} />

        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <Button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>

        <p className="form-switch">
          New to RateBoard? <Link to="/register">Create an account</Link>
        </p>

        <div className="demo-box">
          <div className="demo-head"><strong>Quick demo accounts</strong><small>Password: <b>Password@1</b></small></div>
          <div className="demo-grid">
            <button type="button" className="demo-account" onClick={() => { setEmail('admin@rateboard.example.com'); setPassword('Password@1'); }}>
              <Badge tone="admin">Admin</Badge><span>admin@rateboard.example.com</span>
            </button>
            <button type="button" className="demo-account" onClick={() => { setEmail('aarav@example.com'); setPassword('Password@1'); }}>
              <Badge>User</Badge><span>aarav@example.com</span>
            </button>
            <button type="button" className="demo-account" onClick={() => { setEmail('owner1@example.com'); setPassword('Password@1'); }}>
              <Badge tone="owner">Owner</Badge><span>owner1@example.com</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
