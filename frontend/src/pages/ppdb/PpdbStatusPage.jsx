import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock3, FileText, RefreshCw } from 'lucide-react';
import PpdbPortalLayout from '../../components/ppdb/PpdbPortalLayout';
import { usePpdb } from '../../context/PpdbContext';
import { getMyPpdb } from '../../services/ppdbService';

const statusLabels = { menunggu: 'Menunggu', diproses: 'Diproses', diterima: 'Diterima', ditolak: 'Ditolak' };
const statusStyles = { menunggu: 'bg-amber-100 text-amber-700', diproses: 'bg-blue-100 text-blue-700', diterima: 'bg-green-100 text-green-700', ditolak: 'bg-red-100 text-red-700' };
const statusMessages = {
  menunggu: 'Pendaftaranmu telah diterima dan sedang menunggu pemeriksaan.',
  diproses: 'Pendaftaranmu sedang diperiksa oleh panitia.',
  diterima: 'Selamat! Kamu dinyatakan diterima.',
  ditolak: 'Maaf, pendaftaranmu belum dapat diterima.',
};

const formatDate = (value) => (value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(value)) : '-');

const PpdbStatusPage = () => {
  const { currentUser } = usePpdb();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const submissions = await getMyPpdb();
      setSubmission(submissions[0] ?? null);
    } catch {
      setError('Status pendaftaran gagal dimuat. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch sekali saat halaman dipasang; service menangani loading/error state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStatus();
  }, [loadStatus]);

  const status = submission?.status;
  const statusLabel = statusLabels[status] || 'Status belum tersedia';
  const message = statusMessages[status] || 'Status pendaftaran belum tersedia.';
  const identityEmail = currentUser?.email || '-';
  const detail = useMemo(() => [
    ['Nama Lengkap', submission?.nama_lengkap || '-'],
    ['Email', identityEmail],
    ['Pilihan Jurusan', submission?.pilihan_jurusan || '-'],
    ['Tanggal Pendaftaran', formatDate(submission?.created_at)],
    ['Nomor Referensi', submission?.id || '-'],
  ], [identityEmail, submission]);

  return (
    <PpdbPortalLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Portal PPDB</p><h1 className="mt-2 font-heading text-xl font-extrabold text-dark-900 sm:text-2xl">Status Pendaftaran</h1><p className="mt-1.5 text-xs text-dark-500">Pantau proses pendaftaranmu menggunakan akun yang sedang login.</p></div>
        <button type="button" onClick={loadStatus} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-dark-200 px-3 py-2 text-[11px] font-bold text-dark-600 hover:border-primary hover:text-primary disabled:opacity-50"><RefreshCw className={loading ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} /> Muat ulang</button>
      </div>

      {loading && <div className="mt-6 rounded-2xl border border-dark-100 bg-white p-12 text-center text-sm text-dark-500 shadow-card">Memuat status pendaftaran...</div>}
      {!loading && error && <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50 p-8 text-center"><AlertCircle className="mx-auto h-8 w-8 text-primary" /><p role="alert" className="mt-3 text-sm font-semibold text-primary-800">{error}</p><button type="button" onClick={loadStatus} className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white">Coba Lagi</button></div>}
      {!loading && !error && !submission && <div className="mt-6 rounded-2xl border border-dashed border-dark-300 bg-white p-10 text-center shadow-card"><FileText className="mx-auto h-10 w-10 text-dark-300" /><h2 className="mt-4 font-heading text-base font-bold text-dark-900">Kamu belum menyelesaikan pendaftaran.</h2><p className="mt-2 text-xs text-dark-500">Lengkapi formulir PPDB untuk mengirim data pendaftaran.</p><Link to="/ppdb/formulir" className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-xs font-bold text-white">Mulai Pendaftaran</Link></div>}
      {!loading && !error && submission && <div className="mt-6 space-y-5"><div className="rounded-2xl border border-dark-100 bg-white p-6 shadow-card"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-wide text-dark-400">Status saat ini</p><div className="mt-2 flex items-center gap-2"><span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[status] || 'bg-dark-100 text-dark-600'}`}>{statusLabel}</span>{status === 'diterima' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Clock3 className="h-5 w-5 text-dark-400" />}</div></div><p className="max-w-md text-right text-xs leading-relaxed text-dark-500">{message}</p></div><dl className="mt-6 grid gap-5 border-t border-dark-100 pt-6 sm:grid-cols-2">{detail.map(([label, value]) => <div key={label}><dt className="text-[10px] font-bold uppercase tracking-wide text-dark-400">{label}</dt><dd className="mt-1 break-words font-heading text-xs font-bold text-dark-900">{value}</dd></div>)}</dl></div>{submission.catatan_admin && <div className="rounded-2xl border border-primary-100 bg-primary-50 p-5"><p className="text-[10px] font-bold uppercase tracking-wide text-primary">Catatan Panitia</p><p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-primary-900">{submission.catatan_admin}</p></div>}</div>}
    </PpdbPortalLayout>
  );
};

export default PpdbStatusPage;
