import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiLogin, apiLogout, apiMe } from '../services/apiAuthService';

const AuthContext = createContext(null);
const ADMIN_ACCESS_ERROR = 'Anda tidak memiliki akses sebagai admin.';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessError, setAccessError] = useState('');

  useEffect(() => {
    let active = true;
    apiMe()
      .then(({ user: current }) => {
        if (!active) return;
        setUser(current ? { id: current.id, email: current.email, role: current.role } : null);
        setSession(current ? { user: current } : null);
        setIsAdmin(current?.role === 'admin');
        setAccessError('');
      })
      .catch(() => { if (!active) return; setUser(null); setSession(null); setIsAdmin(false); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const result = await apiLogin({ email: email.trim(), password });
    try {
      const { user: current } = await apiMe();
      if (current?.role !== 'admin') {
        await apiLogout();
        throw new Error(ADMIN_ACCESS_ERROR);
      }
      setSession({ user: current });
      setUser({ id: current.id, email: current.email, role: current.role });
      setIsAdmin(true);
      return result;
    } catch (verificationError) {
      if (verificationError.message !== ADMIN_ACCESS_ERROR) {
        await apiLogout().catch(() => {});
        throw new Error('Gagal memverifikasi akses admin.', { cause: verificationError });
      }
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      throw verificationError;
    }
  }, []);

  const signOut = useCallback(async () => {
    try { await apiLogout(); } finally {
      setSession(null);
      setUser(null);
      setIsAdmin(false);
    }
  }, []);

  const value = useMemo(() => ({ user, session, loading, isAdmin, accessError, signIn, signOut }), [user, session, loading, isAdmin, accessError, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider.');
  return context;
}
