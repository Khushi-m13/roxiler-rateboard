import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button, Input, PageNotice } from '../components/UI';
import { validateUserForm } from '../utils';

const initialForm = {
  name: '',
  email: '',
  address: '',
  password: '',
  role: 'user',
};

const roles = [
  {
    value: 'user',
    icon: 'U',
    title: 'Normal User',
    description: 'Browse registered stores and submit or update ratings.',
  },
  {
    value: 'owner',
    icon: 'S',
    title: 'Store Owner',
    description: 'Access your store dashboard and view customer ratings.',
  },
];

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function selectRole(role) {
    setForm((current) => ({ ...current, role }));
    setErrors((current) => ({ ...current, role: undefined }));
    setServerError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    setSuccess('');

    const validationErrors = validateUserForm(form);
    if (!['user', 'owner'].includes(form.role)) {
      validationErrors.role = 'Choose a valid account type.';
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setBusy(true);

    try {
      await api.post('/auth/register', form);
      setSuccess(
        form.role === 'owner'
          ? 'Store Owner account created. Redirecting to sign in…'
          : 'Normal User account created. Redirecting to sign in…',
      );
      setTimeout(() => navigate('/login'), 900);
    } catch (requestError) {
      setServerError(requestError.response?.data?.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-intro">
        <div className="brand-mark large">R</div>
        <p className="eyebrow">Create your RateBoard account</p>
        <h1>Join RateBoard</h1>
        <p>Choose the account type that matches how you will use the platform.</p>
      </div>

      <form className="auth-card wide" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Account setup</p>
          <h2>Registration</h2>
          <p className="muted">System Administrator accounts are created securely by an existing administrator.</p>
        </div>

        <div className="role-picker" aria-label="Choose account type">
          <span className="role-picker-label">Account type</span>
          <div className="role-options">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                className={`role-option ${form.role === role.value ? 'selected' : ''}`}
                onClick={() => selectRole(role.value)}
                aria-pressed={form.role === role.value}
              >
                <span className="role-icon">{role.icon}</span>
                <span className="role-copy">
                  <strong>{role.title}</strong>
                  <small>{role.description}</small>
                </span>
                <span className="role-check" aria-hidden="true">{form.role === role.value ? '✓' : ''}</span>
              </button>
            ))}
          </div>
          {errors.role ? <small className="field-error">{errors.role}</small> : null}
        </div>

        <PageNotice message={serverError || success} />
        <Input label="Full name" name="name" value={form.name} onChange={updateField} error={errors.name} hint="20–60 characters" required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={updateField} error={errors.email} required />
        <Input label="Address" name="address" value={form.address} onChange={updateField} error={errors.address} hint="Maximum 400 characters" required />
        <Input label="Password" name="password" type="password" value={form.password} onChange={updateField} error={errors.password} hint="8–16 characters, at least one uppercase letter + one special character" required />

        <Button type="submit" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</Button>
        <p className="form-switch">Already registered? <Link to="/login">Sign in</Link></p>
      </form>
    </div>
  );
}
