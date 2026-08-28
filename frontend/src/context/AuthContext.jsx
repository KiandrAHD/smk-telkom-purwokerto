import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

const ADMIN_ACCESS_ERROR = 'Anda tidak memiliki akses sebagai admin.';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return Boolean(data);
  }, []);

  const applySession = useCallback(
    async (nextSession) => {
      if (!nextSession?.user) {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        return;
      }

      setSession(nextSession);
      setUser(nextSession.user);

      try {
        setIsAdmin(await checkAdmin(nextSession.user.id));
      } catch (error) {
        console.error('Gagal memeriksa akses admin:', error);
        setIsAdmin(false);
      }
    },
    [checkAdmin],
  );

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Gagal membaca session:', error);
      }

      if (mounted) {
        await applySession(data?.session ?? null);
        if (mounted) setLoading(false);
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      void applySession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const signIn = useCallback(
    async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      try {
        const admin = await checkAdmin(data.user.id);

        if (!admin) {
          await supabase.auth.signOut();
          throw new Error(ADMIN_ACCESS_ERROR);
        }

        setSession(data.session);
        setUser(data.user);
        setIsAdmin(true);
        return data;
      } catch (verificationError) {
        if (verificationError.message !== ADMIN_ACCESS_ERROR) {
          await supabase.auth.signOut();
          throw new Error('Gagal memverifikasi akses admin.', { cause: verificationError });
        }
        throw verificationError;
      }
    },
    [checkAdmin],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setUser(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({ user, session, loading, isAdmin, signIn, signOut }),
    [user, session, loading, isAdmin, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook sengaja diekspor bersama provider agar API context tetap satu pintu.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider.');
  return context;
}
