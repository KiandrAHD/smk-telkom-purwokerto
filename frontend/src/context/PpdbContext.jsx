import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ensureSupabase, supabaseSiap } from '../services/supabase';
import { getMyPpdb, getMyPpdbDraft, savePpdbDraft, signOutPpdb, submitPpdb } from '../services/ppdbService';
import { restoreSignupBiodata } from '../utils/ppdbIdentity';
import { useLocation } from 'react-router-dom';

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
  const { pathname } = useLocation();
  const editing = ['/spmb/formulir', '/spmb/berkas'].includes(pathname);
  const [biodata, setBiodata] = useState(BIODATA_KOSONG);
  const [nilai, setNilai] = useState({});
  const [dokumen, setDokumen] = useState({});
  const [nomorRegistrasi, setNomorRegistrasi] = useState(null);
  const [draftTersimpan, setDraftTersimpan] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(supabaseSiap);
  const [draftLoading, setDraftLoading] = useState(false);
  const userIdRef = useRef(null);
  const [draftStatus, setDraftStatus] = useState('idle');
  const [draftTime, setDraftTime] = useState(null);
  const [draftLoadError, setDraftLoadError] = useState('');
  const saveQueue = useRef(Promise.resolve());
  const latestSnapshot = useRef('');
  const savedSnapshot = useRef('');
  const finalizing = useRef(false);
  const snapshot = JSON.stringify({ biodata, nilai });

  useEffect(() => { latestSnapshot.current = snapshot; }, [snapshot]);

  const resetWizard = useCallback(() => {
    setBiodata(BIODATA_KOSONG);
    setNilai({});
    setDokumen({});
    setNomorRegistrasi(null);
    setDraftTersimpan(false);
    setDraftStatus('idle');
    setDraftTime(null);
    setDraftLoadError('');
    savedSnapshot.current = '';
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
    const submissionRequest = getMyPpdb().then((submissions) => {
      if (active && submissions?.[0]) setNomorRegistrasi(submissions[0].id);
    });
    const draftRequest = getMyPpdbDraft(currentUser.id).then((draft) => {
      if (!active || !draft) return;
      setBiodata((current) => {
        const restored = { ...current, ...draft.biodata, email: currentUser.email };
        savedSnapshot.current = JSON.stringify({ biodata: restored, nilai: draft.nilai || {} });
        return restored;
      });
      setNilai(draft.nilai || {});
      setDraftTersimpan(true);
      setDraftTime(draft.updated_at || null);
      setDraftStatus('saved');
    });
    void Promise.all([submissionRequest, draftRequest])
      .catch(() => active && setDraftLoadError('Data tersimpan gagal dimuat. Muat ulang halaman sebelum melanjutkan.'))
      .finally(() => active && setDraftLoading(false));
    return () => { active = false; };
  }, [currentUser?.id, currentUser?.email]);

  const isiBiodata = useCallback((sebagian) => {
    setDraftTersimpan(false);
    setDraftStatus('idle');
    setBiodata((lama) => ({ ...lama, ...sebagian }));
  }, []);

  const isiNilai = useCallback((mapel, semester, angka) => {
    setDraftTersimpan(false);
    setDraftStatus('idle');
    setNilai((lama) => ({ ...lama, [`${mapel}|${semester}`]: angka }));
  }, []);

  const isiDokumen = useCallback((id, berkas) => {
    setDokumen((lama) => ({ ...lama, [id]: berkas }));
  }, []);

  const simpanDraft = useCallback(() => {
    const owner = currentUser?.id;
    const captured = JSON.stringify({ biodata, nilai });
    const run = saveQueue.current.catch(() => {}).then(async () => {
      if (!owner || userIdRef.current !== owner) throw new Error('Sesi SPMB telah berubah.');
      if (savedSnapshot.current === captured) return;
      setDraftStatus('saving');
      try {
        const result = await savePpdbDraft(biodata, nilai, owner);
        if (userIdRef.current !== owner) throw new Error('Sesi SPMB telah berubah.');
        savedSnapshot.current = captured;
        if (latestSnapshot.current === captured) {
          setDraftTersimpan(true);
          setDraftStatus('saved');
          setDraftTime(result?.updated_at || new Date().toISOString());
        }
      } catch (error) {
        if (userIdRef.current === owner) setDraftStatus('error');
        throw error;
      }
    });
    saveQueue.current = run;
    return run;
  }, [biodata, nilai, currentUser?.id]);

  useEffect(() => {
    if (!editing || !currentUser || draftLoading || draftLoadError || nomorRegistrasi || finalizing.current || draftTersimpan) return undefined;
    const timer = window.setTimeout(() => {
      if (!finalizing.current) void simpanDraft().catch(() => {});
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [editing, currentUser, draftLoading, draftLoadError, nomorRegistrasi, draftTersimpan, simpanDraft]);

  const finalisasiPendaftaran = useCallback(async () => {
    if (finalizing.current) return null;
    finalizing.current = true;
    try {
      await simpanDraft();
      const hasil = await submitPpdb({ biodata, nilai, dokumen: dokumen.utama, expectedUserId: currentUser?.id });
      setNomorRegistrasi(hasil.id);
      setDokumen({});
      return hasil;
    } finally { finalizing.current = false; }
  }, [biodata, nilai, dokumen, simpanDraft, currentUser?.id]);

  useEffect(() => {
    const protect = (event) => {
      if (!nomorRegistrasi && currentUser && ((!draftTersimpan && editing) || dokumen.utama)) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', protect);
    return () => window.removeEventListener('beforeunload', protect);
  }, [editing, currentUser, nomorRegistrasi, draftTersimpan, dokumen.utama]);

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
      finalisasiPendaftaran,
      draftStatus,
      draftTime,
      draftLoadError,
      logout,
      mulaiAkunBaru,
    }),
    [biodata, nilai, dokumen, nomorRegistrasi, draftTersimpan, currentUser, authLoading, draftLoading, isiBiodata, isiNilai, isiDokumen, simpanDraft, finalisasiPendaftaran, draftStatus, draftTime, draftLoadError, logout, mulaiAkunBaru]
  );

  return <PpdbContext.Provider value={nilaiContext}>{children}</PpdbContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePpdb = () => {
  const ctx = useContext(PpdbContext);
  if (!ctx) throw new Error('usePpdb harus dipakai di dalam PpdbProvider.');
  return ctx;
};
