import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, CircleAlert, Mail } from 'lucide-react';
import PpdbAuthLayout from '../../components/ppdb/PpdbAuthLayout';
import { ensureSupabase, supabaseSiap } from '../../services/supabase';

const errorMessage = (code) => {
  if (code === 'otp_expired') return 'Tautan konfirmasi sudah kedaluwarsa. Silakan minta email konfirmasi baru.';
  if (code === 'otp_disabled') return 'Konfirmasi email sedang tidak tersedia. Silakan hubungi panitia PPDB.';
  return 'Tautan konfirmasi tidak valid atau sudah digunakan. Silakan minta email konfirmasi baru.';
};

const ConfirmEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState(supabaseSiap ? 'checking' : 'error');
  const [message, setMessage] = useState(supabaseSiap ? 'Memverifikasi email Anda...' : 'Layanan verifikasi belum dikonfigurasi. Silakan hubungi panitia PPDB.');

  useEffect(() => {
    if (!supabaseSiap) return undefined;

    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    const errorCode = searchParams.get('error_code') || searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    let active = true;

    const applyResult = ({ error }) => {
      if (!active) return;
      if (error) {
        setState('error');
        setMessage(error.message || errorMessage(error.code));
        return;
      }
      setState('success');
      setMessage('Email berhasil dikonfirmasi. Anda dapat melanjutkan pendaftaran PPDB.');
    };

    const run = async () => {
      if (errorCode) {
        applyResult({ error: { message: errorDescription || errorMessage(errorCode) } });
        return;
      }
      if (!tokenHash || type !== 'email') {
        applyResult({ error: { message: 'Tautan konfirmasi tidak lengkap atau tidak valid. Silakan minta email konfirmasi baru.' } });
        return;
      }
      try {
        const result = await ensureSupabase().auth.verifyOtp({ token_hash: tokenHash, type: 'email' });
        applyResult(result);
      } catch {
        applyResult({ error: { message: 'Konfirmasi email gagal diproses. Silakan minta email konfirmasi baru.' } });
      }
    };

    run();

    return () => { active = false; };
  }, [searchParams]);

  const isSuccess = state === 'success';

  return (
    <PpdbAuthLayout aksiLabel="Kembali ke Beranda">
      <div className="mx-auto max-w-md rounded-3xl border border-dark-100 bg-white p-8 text-center shadow-card sm:p-10">
        {state === 'checking' ? <Mail className="mx-auto h-14 w-14 text-primary" /> : isSuccess ? <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" /> : <CircleAlert className="mx-auto h-14 w-14 text-primary" />}
        <h1 className="mt-6 font-heading text-2xl font-extrabold text-dark-900">{state === 'checking' ? 'Memverifikasi Email' : isSuccess ? 'Email Berhasil Dikonfirmasi' : 'Konfirmasi Email Gagal'}</h1>
        <p role={state === 'error' ? 'alert' : 'status'} className="mt-3 text-sm leading-relaxed text-dark-500">{message}</p>
        {isSuccess ? (
          <button type="button" onClick={() => navigate('/ppdb/formulir', { replace: true })} className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card hover:-translate-y-0.5">Lanjutkan Pendaftaran</button>
        ) : state === 'error' ? (
          <Link to="/ppdb/masuk" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card hover:-translate-y-0.5">Kembali ke Masuk PPDB</Link>
        ) : null}
      </div>
    </PpdbAuthLayout>
  );
};

export default ConfirmEmailPage;
