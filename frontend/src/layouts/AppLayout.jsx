import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roleLabel } from '../utils';

export default function AppLayout({ children, links }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">R</div>
          <div>
            <strong>RateBoard</strong>
            <span>Store ratings & administration</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className="nav-link">
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="account-mini">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user?.name}</strong>
              <span>{roleLabel(user?.role)}</span>
            </div>
          </div>
          <button className="logout-button" type="button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
