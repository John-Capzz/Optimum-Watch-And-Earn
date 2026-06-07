import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem('optimum_token');
const setToken = (t) => localStorage.setItem('optimum_token', t);
const removeToken = () => localStorage.removeItem('optimum_token');

export const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    axios.get(`${API}/auth/me`, authHeaders())
      .then(res => setUser(res.data))
      .catch(() => { removeToken(); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = () => {
    window.location.href = `${API}/auth/discord`;
  };

  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (data) => setUser(prev => ({ ...prev, ...data }));
  const saveToken = (token) => setToken(token);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, saveToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);