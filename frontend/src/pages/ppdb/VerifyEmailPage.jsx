import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle2, Mail } from 'lucide-react';
import PpdbAuthLayout from '../../components/ppdb/PpdbAuthLayout';
import { usePpdb } from '../../context/PpdbContext';
import { ppdbVerifikasi } from '../../data/dummyData';
import { ensureSupabase, supabaseSiap } from '../../services/supabase';
import { resendPpdbVerification } from '../../services/ppdbService';

const COOLDOWN_SECONDS = 60;

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { biodata, currentUser, authLoading, mulaiAkunBaru } = usePpdb();
  const [state, setState] = useState(supabaseSiap ? 'checking' : 'error');
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [sisa, setSisa] = useState(COOLDOWN_SECONDS);
  const [feedback, setFeedback] = useState('');
  const [resending, setResending] = useState(false);

  const email = useMemo(() => biodata.email || currentUser?.email || '', [biodata.email, currentUser?.email]);

  useEffect(() => {
    if (!supabaseSiap) {
      return undefined;
    }

    let mounted = true;
    const checkUser = (user) => {
      if (!mounted) return;
      if (!user) {
        setVerifiedUser(null);
        setState('unverified');
        return;
      }
      setVerifiedUser(user);
      setState(user.email_confirmed_at ? 'verified' : 'unverified');
    };

    const client = ensureSupabase();
    client.auth.getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        checkUser(data?.session?.user);
      })
      .catch(() => mounted && setState('error'));
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => checkUser(session?.user));

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (sisa <= 0) return undefined;
    const timer = window.setTimeout(() => setSisa((value) => Math.max(value - 1, 0)), 1000);
    return () => window.clearTimeout(timer);
  }, [sisa]);

  const lanjut = () => {
    if (currentUser || verifiedUser) navigate('/ppdb/formulir');
    else navigate('/ppdb/masuk');
  };

  const kirimUlang = async () => {
    if (!email || sisa > 0 || resending) return;
    setResending(true);
    setFeedback('');
    try {
      await resendPpdbVerification(email);
      setFeedback('Email verifikasi berhasil dikirim ulang.');
      setSisa(COOLDOWN_SECONDS);
    } catch {
      setFeedback('Email verifikasi gagal dikirim ulang. Silakan coba lagi nanti.');
    } finally {
      setResending(false);
    }
  };

  const ubahEmail = () => {
    mulaiAkunBaru();
    navigate('/ppdb/daftar');
  };

  if (authLoading || state === 'checking') {
    return <div className="flex min-h-screen items-center justify-center bg-dark-50 text-sm text-dark-500">Memeriksa status verifikasi...</div>;
  }

  if (state === 'error') {
    return <div className="flex min-h-screen items-center justify-center bg-dark-50 px-4 text-center text-sm text-dark-500">Status verifikasi tidak dapat diperiksa. Silakan coba lagi.</div>;
  }

  if (state === 'verified') {
    return (
      <PpdbAuthLayout aksiLabel="Kembali ke Beranda">
        <div className="mx-auto max-w-md rounded-3xl border border-green-200 bg-white p-8 text-center shadow-card sm:p-10">
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
          <h1 className="mt-6 font-heading text-2xl font-extrabold text-dark-900">Email berhasil diverifikasi</h1>
          <p className="mt-3 text-xs leading-relaxed text-dark-500">Akunmu sudah aktif. Lanjutkan untuk melengkapi pendaftaran PPDB.</p>
          <button type="button" onClick={lanjut} className="mt-6 w-full rounded-xl bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">Lanjutkan Pendaftaran</button>
        </div>
      </PpdbAuthLayout>
    );
  }

  if (!email && !currentUser && !verifiedUser) return <Navigate to="/ppdb/masuk" replace />;

  return (
    <PpdbAuthLayout aksiLabel="Butuh Bantuan?" aksiTo="/ppdb/masuk" tinggiPita="h-52">
      <div className="mx-auto max-w-md rounded-3xl border border-dark-100 bg-white p-8 text-center shadow-card sm:p-10">
        <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50"><Mail className="h-7 w-7 text-primary" /><CheckCircle2 className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white text-green-600" fill="white" /></span>
        <p className="mt-6 text-[11px] font-bold text-primary">{ppdbVerifikasi.badge}</p>
        <h1 className="mt-2 font-heading text-2xl font-extrabold text-dark-900">Cek Email Anda</h1>
        <p className="mt-3 text-xs leading-relaxed text-dark-500">Kami telah mengirimkan tautan konfirmasi pendaftaran ke alamat email</p>
        <p className="mx-auto mt-3 w-fit max-w-full truncate rounded-lg bg-dark-50 px-4 py-2 font-heading text-xs font-bold text-dark-900">{email}</p>
        <a href={ppdbVerifikasi.ctaUrl} target="_blank" rel="noreferrer" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card hover:-translate-y-0.5"><Mail className="h-4 w-4" />{ppdbVerifikasi.ctaLabel}</a>
        <div className="mt-6 rounded-xl bg-dark-50 px-5 py-4 text-left"><p className="font-heading text-[11px] font-bold text-dark-900">{ppdbVerifikasi.catatanJudul}</p><ul className="mt-2 space-y-1.5">{ppdbVerifikasi.catatan.map((catatan) => <li key={catatan} className="flex gap-2 text-[11px] leading-relaxed text-dark-500"><span aria-hidden="true">&bull;</span>{catatan}</li>)}</ul></div>
        {feedback && <p role="status" className="mt-5 rounded-xl bg-primary-50 px-4 py-3 text-[11px] font-medium text-primary-800">{feedback}</p>}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-dark-100 pt-5 text-[11px]"><span className="text-dark-500">Salah email? <button type="button" onClick={ubahEmail} className="font-bold text-dark-900 underline hover:text-primary">Ubah Email</button></span><button type="button" disabled={sisa > 0 || resending} onClick={kirimUlang} className="font-heading font-bold text-primary hover:underline disabled:cursor-not-allowed disabled:text-dark-400 disabled:no-underline">{resending ? 'Mengirim...' : sisa > 0 ? `Kirim Ulang (${sisa}s)` : 'Kirim Ulang'}</button></div>
        <button type="button" onClick={lanjut} className="mt-5 text-[11px] font-semibold text-dark-400 underline-offset-4 hover:text-primary hover:underline">Saya sudah verifikasi, cek kembali</button>
      </div>
    </PpdbAuthLayout>
  );
};

export default VerifyEmailPage;
