import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';import { CheckCircle2, CircleAlert, Mail } from 'lucide-react';
import PpdbAuthLayout from '../../components/ppdb/PpdbAuthLayout';
import { api } from '../../services/apiClient';
import { canonicalAdmissionsPath } from '../../utils/admissions';

const safeNextPath = (value) => (value?.startsWith('/') && !value.startsWith('//') ? canonicalAdmissionsPath(value) : '/spmb/verifikasi');

const ConfirmEmailPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState('checking');
  const [message, setMessage] = useState('Memuat tautan konfirmasi...');
  const [tokenHash, setTokenHash] = useState('');
  const [nextPath, setNextPath] = useState('/spmb/verifikasi');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token') || searchParams.get('token_hash');
    const redirectPath = safeNextPath(searchParams.get('next'));
    let active = true;

    const prepareConfirmation = async () => {
      setNextPath(redirectPath);
      if (!token) {
        if (!active) return;
        setState('error');
        setMessage('Tautan konfirmasi tidak lengkap atau tidak valid. Silakan minta email konfirmasi baru.');
        return;
      }
      setTokenHash(token);
      setState('ready');
      setMessage('Tautan konfirmasi siap digunakan. Tekan tombol di bawah untuk mengonfirmasi email Anda.');
    };

    void prepareConfirmation();
    return () => { active = false; };
  }, [navigate, searchParams]);

  const confirmEmail = async () => {
    if (!tokenHash || confirming || state !== 'ready') return;
    setConfirming(true);
    setMessage('Mengonfirmasi email Anda...');

    try {
      const result = await api.post('/api/auth/verify-email', { token: tokenHash });
      setState('success');
      setMessage(result.message || 'Email berhasil dikonfirmasi. Anda dapat melanjutkan pendaftaran SPMB.');
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
          <button type="button" onClick={() => navigate('/spmb/formulir', { replace: true })} className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card hover:-translate-y-0.5">{t('Lanjutkan Pendaftaran')}</button>
        ) : state === 'error' ? (
          <Link to="/spmb/masuk" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card hover:-translate-y-0.5">{t('Kembali ke Masuk SPMB')}</Link>
        ) : null}
      </div>
    </PpdbAuthLayout>
  );
};

export default ConfirmEmailPage;
