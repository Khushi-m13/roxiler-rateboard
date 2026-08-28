import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const value = localStorage.getItem('rateboard_user');
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { token, user: loggedInUser } = response.data;

    localStorage.setItem('rateboard_token', token);
    localStorage.setItem('rateboard_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return loggedInUser;
  }

  function logout() {
    localStorage.removeItem('rateboard_token');
    localStorage.removeItem('rateboard_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
