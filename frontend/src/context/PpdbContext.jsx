import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ensureSupabase, supabaseSiap } from '../services/supabase';
import { signOutPpdb } from '../services/ppdbService';

// Alur PPDB melewati beberapa halaman: daftar akun, isi formulir, unggah berkas,
// lalu bukti submit. Kalau tiap halaman menyimpan state-nya sendiri, data hilang
// begitu pengguna menekan "Lanjut" dan nomor registrasi di halaman akhir tidak
// mungkin nyambung dengan isian sebelumnya. Karena itu state alur disimpan di
// satu tempat.
//
const PpdbContext = createContext(null);

const BIODATA_KOSONG = {
  nisn: '',
  namaLengkap: '',
  email: '',
  whatsapp: '',
  jurusan: '',
  nik: '',
  agama: '',
  tempatLahir: '',
  tanggalLahir: '',
  jenisKelamin: '',
  alamat: '',
  namaSmp: '',
  tahunLulus: '',
};

export const PpdbProvider = ({ children }) => {
  const [biodata, setBiodata] = useState(BIODATA_KOSONG);
  const [nilai, setNilai] = useState({});
  const [dokumen, setDokumen] = useState({});
  const [nomorRegistrasi, setNomorRegistrasi] = useState(null);
  const [draftTersimpan, setDraftTersimpan] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(supabaseSiap);
  const userIdRef = useRef(null);

  const resetWizard = useCallback(() => {
    setBiodata(BIODATA_KOSONG);
    setNilai({});
    setDokumen({});
    setNomorRegistrasi(null);
    setDraftTersimpan(false);
  }, []);

  useEffect(() => {
    if (!supabaseSiap) {
      return undefined;
    }

    let mounted = true;
    const client = ensureSupabase();
    const applyUser = (user) => {
      if (!mounted) return;
      if (userIdRef.current && user?.id !== userIdRef.current) resetWizard();
      if (!user) resetWizard();
      userIdRef.current = user?.id ?? null;
      setCurrentUser(user ?? null);
      setAuthLoading(false);
    };

    client.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Gagal membaca sesi PPDB:', error);
      applyUser(data?.session?.user ?? null);
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [resetWizard]);

  const isiBiodata = useCallback((sebagian) => {
    setDraftTersimpan(false);
    setBiodata((lama) => ({ ...lama, ...sebagian }));
  }, []);

  const isiNilai = useCallback((mapel, semester, angka) => {
    setDraftTersimpan(false);
    setNilai((lama) => ({ ...lama, [`${mapel}|${semester}`]: angka }));
  }, []);

  const isiDokumen = useCallback((id, berkas) => {
    setDokumen((lama) => ({ ...lama, [id]: berkas }));
  }, []);

  const kirimPendaftaran = useCallback((nomor) => {
    setNomorRegistrasi(nomor);
    return nomor;
  }, []);

  const logout = useCallback(async () => {
    await signOutPpdb();
    resetWizard();
  }, [resetWizard]);

  const nilaiContext = useMemo(
    () => ({
      biodata,
      nilai,
      dokumen,
      nomorRegistrasi,
      currentUser,
      authLoading,
      draftTersimpan,
      isiBiodata,
      isiNilai,
      isiDokumen,
      setDraftTersimpan,
      kirimPendaftaran,
      logout,
    }),
    [biodata, nilai, dokumen, nomorRegistrasi, draftTersimpan, currentUser, authLoading, isiBiodata, isiNilai, isiDokumen, kirimPendaftaran, logout]
  );

  return <PpdbContext.Provider value={nilaiContext}>{children}</PpdbContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePpdb = () => {
  const ctx = useContext(PpdbContext);
  if (!ctx) throw new Error('usePpdb harus dipakai di dalam PpdbProvider.');
  return ctx;
};
