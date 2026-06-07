import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import RegionSelect from './pages/RegionSelect';
import Hub from './pages/Hub';
import Admin from './pages/Admin';
import AuthCallback from './pages/AuthCallback';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0e0e0e' }}>
      <div style={{ color: '#F5C518', fontSize: '18px', fontWeight: 600 }}>Loading...</div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

const RegionRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (user.region) return <Navigate to="/hub" />;
  return children;
};

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/hub" /> : <Login />} />
      <Route path="/region" element={<RegionRoute><RegionSelect /></RegionRoute>} />
      <Route path="/hub" element={<ProtectedRoute><Hub /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? '/hub' : '/login'} />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}