import { createContext, useContext, useState, useCallback } from 'react';
import { login as loginApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(() => localStorage.getItem('dixi_username'));
  const [token, setToken] = useState(() => localStorage.getItem('dixi_token'));

  const login = useCallback(async (usuario, senha) => {
    const data = await loginApi(usuario, senha);
    localStorage.setItem('dixi_token', data.token);
    localStorage.setItem('dixi_username', data.username);
    setToken(data.token);
    setUsername(data.username);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dixi_token');
    localStorage.removeItem('dixi_username');
    setToken(null);
    setUsername(null);
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ username, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return ctx;
}
