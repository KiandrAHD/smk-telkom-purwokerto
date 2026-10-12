import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PESAN_SUPABASE_BELUM_SIAP, supabase, supabaseSiap } from '../services/supabase';

const AuthContext = createContext(null);

const ADMIN_ACCESS_ERROR = 'Anda tidak memiliki akses sebagai admin.';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(supabaseSiap);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessError, setAccessError] = useState('');
  const accessUserRef = useRef(null);
  const accessRequestRef = useRef(0);

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
      const request = ++accessRequestRef.current;
      const nextUserId = nextSession?.user?.id ?? null;
      const changedUser = accessUserRef.current !== nextUserId;
      accessUserRef.current = nextUserId;
      setAccessError('');
      if (!nextSession?.user) {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (changedUser) {
        setIsAdmin(false);
        setLoading(true);
      }

      setSession(nextSession);
      setUser(nextSession.user);

      try {
        const admin = await checkAdmin(nextSession.user.id);
        if (request === accessRequestRef.current) setIsAdmin(admin);
      } catch (error) {
        console.error('Gagal memeriksa akses admin:', error);
        if (request === accessRequestRef.current) {
          setIsAdmin(false);
          setAccessError('Akses admin belum dapat diperiksa. Silakan muat ulang untuk mencoba lagi.');
        }
      } finally {
        if (request === accessRequestRef.current) setLoading(false);
      }
    },
    [checkAdmin],
  );

  useEffect(() => {
    // Tanpa konfigurasi Supabase tidak ada session yang bisa dibaca. Berhenti di
    // sini supaya halaman publik tetap tampil dan hanya area admin yang terkunci.
    if (!supabaseSiap) return undefined;

    let mounted = true;

    const initialize = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Gagal membaca session:', error);
      }

      if (mounted) {
        await applySession(data?.session ?? null);
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
      if (!supabaseSiap) throw new Error(PESAN_SUPABASE_BELUM_SIAP);

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
    if (!supabaseSiap) return;

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setUser(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({ user, session, loading, isAdmin, accessError, signIn, signOut }),
    [user, session, loading, isAdmin, accessError, signIn, signOut],
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
