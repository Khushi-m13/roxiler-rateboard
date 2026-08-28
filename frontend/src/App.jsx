import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Stores from './pages/Stores';
import Admin from './pages/Admin';
import Owner from './pages/Owner';
import { AddStore, AddUser, Password } from './pages/Forms';
import './styles/app.css';

function RoleHome() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'owner') return <Navigate to="/owner" replace />;
  return <Navigate to="/stores" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RoleHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stores" element={<ProtectedRoute roles={['user']}><Stores /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
          <Route path="/admin/stores" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
          <Route path="/admin/add-user" element={<ProtectedRoute roles={['admin']}><AddUser /></ProtectedRoute>} />
          <Route path="/admin/add-store" element={<ProtectedRoute roles={['admin']}><AddStore /></ProtectedRoute>} />
          <Route path="/owner" element={<ProtectedRoute roles={['owner']}><Owner /></ProtectedRoute>} />
          <Route path="/password" element={<ProtectedRoute roles={['admin', 'user', 'owner']}><Password /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
