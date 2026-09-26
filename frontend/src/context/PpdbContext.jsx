import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ensureSupabase, supabaseSiap } from '../services/supabase';
import { getMyPpdbDraft, savePpdbDraft, signOutPpdb } from '../services/ppdbService';
import { restoreSignupBiodata } from '../utils/ppdbIdentity';

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
  const [draftLoading, setDraftLoading] = useState(false);
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
      const changedAccount = Boolean(userIdRef.current && user?.id !== userIdRef.current);
      const newUser = Boolean(user && user.id !== userIdRef.current);
      if (changedAccount || !user) resetWizard();
      if (user) {
        setBiodata((current) => restoreSignupBiodata(changedAccount ? BIODATA_KOSONG : current, user));
      }
      userIdRef.current = user?.id ?? null;
      setCurrentUser(user ?? null);
      setAuthLoading(false);
      if (!user) setDraftLoading(false);
      if (newUser) setDraftLoading(true);
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

  useEffect(() => {
    if (!currentUser?.id) return undefined;
    let active = true;
    void getMyPpdbDraft(currentUser.id)
      .then((draft) => {
        if (!active || !draft) return;
        setBiodata((current) => ({ ...current, ...draft.biodata, email: currentUser.email }));
        setNilai(draft.nilai);
        setDraftTersimpan(true);
      })
      .catch((error) => console.warn('Draft PPDB tidak dapat dimuat:', error))
      .finally(() => active && setDraftLoading(false));
    return () => { active = false; };
  }, [currentUser?.id, currentUser?.email]);

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

  const simpanDraft = useCallback(async () => {
    await savePpdbDraft(biodata, nilai);
    setDraftTersimpan(true);
  }, [biodata, nilai]);

  const kirimPendaftaran = useCallback((nomor) => {
    setNomorRegistrasi(nomor);
    return nomor;
  }, []);

  const mulaiAkunBaru = useCallback(() => {
    resetWizard();
    setCurrentUser(null);
  }, [resetWizard]);

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
      draftLoading,
      draftTersimpan,
      isiBiodata,
      isiNilai,
      isiDokumen,
      simpanDraft,
      kirimPendaftaran,
      logout,
      mulaiAkunBaru,
    }),
    [biodata, nilai, dokumen, nomorRegistrasi, draftTersimpan, currentUser, authLoading, draftLoading, isiBiodata, isiNilai, isiDokumen, simpanDraft, kirimPendaftaran, logout, mulaiAkunBaru]
  );

  return <PpdbContext.Provider value={nilaiContext}>{children}</PpdbContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePpdb = () => {
  const ctx = useContext(PpdbContext);
  if (!ctx) throw new Error('usePpdb harus dipakai di dalam PpdbProvider.');
  return ctx;
};
