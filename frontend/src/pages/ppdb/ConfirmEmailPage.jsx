import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, CircleAlert, Mail } from 'lucide-react';
import PpdbAuthLayout from '../../components/ppdb/PpdbAuthLayout';
import { ensureSupabase, supabaseSiap } from '../../services/supabase';

const errorMessage = (code) => {
  if (code === 'otp_expired') return 'Tautan konfirmasi sudah kedaluwarsa. Silakan minta email konfirmasi baru.';
  if (code === 'otp_disabled') return 'Konfirmasi email sedang tidak tersedia. Silakan hubungi panitia PPDB.';
  return 'Tautan konfirmasi tidak valid atau sudah digunakan. Silakan minta email konfirmasi baru.';
};

const safeNextPath = (value) => (value?.startsWith('/') && !value.startsWith('//') ? value : '/ppdb/verifikasi');

const ConfirmEmailPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState(supabaseSiap ? 'checking' : 'error');
  const [message, setMessage] = useState(supabaseSiap ? 'Memuat tautan konfirmasi...' : 'Layanan verifikasi belum dikonfigurasi. Silakan hubungi panitia PPDB.');
  const [tokenHash, setTokenHash] = useState('');
  const [nextPath, setNextPath] = useState('/ppdb/verifikasi');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!supabaseSiap) return undefined;

    const token = searchParams.get('token_hash');
    const type = searchParams.get('type');
    const errorCode = searchParams.get('error_code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const redirectPath = safeNextPath(searchParams.get('next'));
    let active = true;

    const prepareConfirmation = async () => {
      setNextPath(redirectPath);
      try {
        const { data, error: userError } = await ensureSupabase().auth.getUser();
        if (!userError && data?.user?.email_confirmed_at) {
          if (!active) return;
          setState('success');
          setMessage('Email Anda sudah dikonfirmasi. Anda dapat melanjutkan pendaftaran PPDB.');
          navigate(redirectPath, { replace: true });
          return;
        }
      } catch {
        // Validasi token di bawah tetap menjadi sumber kebenaran bila sesi belum tersedia.
      }

      if (!active) return;
      if (errorCode || error) {
        setState('error');
        setMessage(errorDescription || errorMessage(errorCode || error));
      } else if (!token || type !== 'email') {
        setState('error');
        setMessage('Tautan konfirmasi tidak lengkap atau tidak valid. Silakan minta email konfirmasi baru.');
      } else {
        setTokenHash(token);
        setState('ready');
        setMessage('Tautan konfirmasi siap digunakan. Tekan tombol di bawah untuk mengonfirmasi email Anda.');
      }
    };

    void prepareConfirmation();
    return () => { active = false; };
  }, [navigate, searchParams]);

  const confirmEmail = async () => {
    if (!tokenHash || confirming || state !== 'ready') return;
    setConfirming(true);
    setMessage('Mengonfirmasi email Anda...');

    try {
      const client = ensureSupabase();
      const { error: verifyError } = await client.auth.verifyOtp({ token_hash: tokenHash, type: 'email' });
      if (verifyError) {
        setState('error');
        setMessage(verifyError.message || errorMessage(verifyError.code));
        return;
      }

      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (sessionError || !sessionData?.session) {
        setState('error');
        setMessage('Email berhasil diverifikasi, tetapi sesi belum aktif. Silakan masuk kembali untuk melanjutkan pendaftaran.');
        return;
      }

      setState('success');
      setMessage('Email berhasil dikonfirmasi. Anda dapat melanjutkan pendaftaran PPDB.');
      navigate(nextPath, { replace: true });
    } catch (verifyError) {
      setState('error');
      setMessage(verifyError?.message || 'Konfirmasi email gagal diproses. Silakan minta email konfirmasi baru.');
    } finally {
      setConfirming(false);
    }
  };

  const isSuccess = state === 'success';

  return (
    <PpdbAuthLayout aksiLabel="Kembali ke Beranda">
      <div className="mx-auto max-w-md rounded-3xl border border-dark-100 bg-white p-8 text-center shadow-card sm:p-10">
        {state === 'checking' ? <Mail className="mx-auto h-14 w-14 text-primary" /> : isSuccess ? <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" /> : state === 'ready' ? <Mail className="mx-auto h-14 w-14 text-primary" /> : <CircleAlert className="mx-auto h-14 w-14 text-primary" />}
        <h1 className="mt-6 font-heading text-2xl font-extrabold text-dark-900">{t(state === 'checking' ? 'Konfirmasi Email' : isSuccess ? 'Email Berhasil Dikonfirmasi' : state === 'ready' ? 'Konfirmasi Email' : 'Konfirmasi Email Gagal')}</h1>
        <p role={state === 'error' ? 'alert' : 'status'} className="mt-3 text-sm leading-relaxed text-dark-500">{t(message)}</p>
        {state === 'ready' ? (
          <button type="button" disabled={confirming} onClick={confirmEmail} className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">{t(confirming ? 'Mengonfirmasi...' : 'Konfirmasi Email')}</button>
        ) : isSuccess ? (
          <button type="button" onClick={() => navigate('/ppdb/formulir', { replace: true })} className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card hover:-translate-y-0.5">{t('Lanjutkan Pendaftaran')}</button>
        ) : state === 'error' ? (
          <Link to="/ppdb/masuk" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card hover:-translate-y-0.5">{t('Kembali ke Masuk PPDB')}</Link>
        ) : null}
      </div>
    </PpdbAuthLayout>
  );
};

export default ConfirmEmailPage;
