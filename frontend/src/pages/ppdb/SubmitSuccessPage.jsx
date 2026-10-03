import { useLanguage } from '../../context/LanguageContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle2, Clock3, Printer, RefreshCw, XCircle } from 'lucide-react';
import PpdbPortalLayout from '../../components/ppdb/PpdbPortalLayout';
import Reveal from '../../components/Reveal';
import maskot from '../../assets/pengumuman/stela-bot.png';
import { usePpdb } from '../../context/PpdbContext';
import { buatLinkFlexBox, ppdbSukses } from '../../data/dummyData';
import { getMyPpdb } from '../../services/ppdbService';

const ikonLangkah = { cetak: Printer, jadwal: CalendarDays };
const statusInfo = {
  menunggu: { label: 'Menunggu', message: 'Pendaftaran Anda telah diterima dan sedang menunggu pemeriksaan.', className: 'bg-amber-100 text-amber-700', Icon: Clock3 },
  diproses: { label: 'Diproses', message: 'Pendaftaran Anda sedang diperiksa oleh panitia.', className: 'bg-blue-100 text-blue-700', Icon: RefreshCw },
  diterima: { label: 'Diterima', message: 'Selamat! Anda dinyatakan diterima.', className: 'bg-green-100 text-green-700', Icon: CheckCircle2 },
  ditolak: { label: 'Ditolak', message: 'Maaf, pendaftaran Anda belum dapat diterima.', className: 'bg-red-100 text-red-700', Icon: XCircle },
};

const SubmitSuccessPage = () => {
  const { t } = useLanguage();
  const { nomorRegistrasi, currentUser } = usePpdb();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const activeRef = useRef(true);

  const fetchSubmission = useCallback(async (isManualRetry = false) => {
    if (isManualRetry) {
      setLoading(true);
      setError('');
    }
    try {
      const submissions = await getMyPpdb();
      if (!activeRef.current) return;
      setSubmission(submissions[0] ?? null);
      setError('');
    } catch {
      if (!activeRef.current) return;
      setError('Data pendaftaran gagal dimuat. Silakan coba lagi.');
    } finally {
      if (activeRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    activeRef.current = true;
    getMyPpdb()
      .then((submissions) => {
        if (!activeRef.current) return;
        setSubmission(submissions[0] ?? null);
      })
      .catch(() => {
        if (!activeRef.current) return;
        setError('Data pendaftaran gagal dimuat. Silakan coba lagi.');
      })
      .finally(() => {
        if (activeRef.current) setLoading(false);
      });

    return () => {
      activeRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!submission || ['diterima', 'ditolak'].includes(submission.status)) return undefined;

    const interval = window.setInterval(() => {
      void fetchSubmission(false);
    }, 25000);

    return () => window.clearInterval(interval);
  }, [fetchSubmission, submission]);

  if (loading) {
    return <PpdbPortalLayout><div className="rounded-2xl border border-dark-100 bg-white p-12 text-center text-sm text-dark-500 shadow-card">{t("Memuat data pendaftaran...")}</div></PpdbPortalLayout>;
  }

  if (error) {
    return <PpdbPortalLayout><div className="rounded-2xl border border-primary-200 bg-primary-50 p-8 text-center"><AlertCircle className="mx-auto h-8 w-8 text-primary" /><p role="alert" className="mt-3 text-sm font-semibold text-primary-800">{t(error)}</p><button type="button" onClick={() => void fetchSubmission(true)} className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white">{t("Coba Lagi")}</button></div></PpdbPortalLayout>;
  }

  if (!submission) {
    return <PpdbPortalLayout><div className="rounded-2xl border border-dashed border-dark-300 bg-white p-10 text-center shadow-card"><AlertCircle className="mx-auto h-10 w-10 text-dark-300" /><h1 className="mt-4 font-heading text-base font-bold text-dark-900">{t("Pendaftaran belum ditemukan.")}</h1><p className="mt-2 text-xs text-dark-500">{t("Silakan lengkapi formulir sebelum melihat halaman ini.")}</p><Link to="/spmb/formulir" className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-xs font-bold text-white">{t("Mulai Pendaftaran")}</Link></div></PpdbPortalLayout>;
  }

  const info = statusInfo[submission.status];
  if (!info) {
    return <PpdbPortalLayout><div className="rounded-2xl border border-primary-200 bg-primary-50 p-8 text-center"><AlertCircle className="mx-auto h-8 w-8 text-primary" /><p role="alert" className="mt-3 text-sm font-semibold text-primary-800">{t("Status pendaftaran tidak dikenali. Silakan hubungi panitia SPMB.")}</p><button type="button" onClick={() => void fetchSubmission(true)} className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white">{t("Coba Lagi")}</button></div></PpdbPortalLayout>;
  }
  const StatusIcon = info.Icon;
  const nomor = submission.id || nomorRegistrasi || '-';
  const whatsapp = buatLinkFlexBox('status', { nama: submission.nama_lengkap, email: currentUser?.email || submission.email, nomorPendaftaran: nomor, halaman: '/spmb/selesai' });
  const statusColor = info.className.includes('green') ? 'text-green-600' : info.className.includes('red') ? 'text-red-600' : info.className.includes('blue') ? 'text-blue-600' : 'text-orange-600';

  return (
    <PpdbPortalLayout>
      <div className={`flex items-start gap-4 rounded-2xl border px-6 py-5 ${submission.status === 'diterima' ? 'border-green-200 bg-green-50' : submission.status === 'ditolak' ? 'border-red-200 bg-red-50' : 'border-dark-100 bg-white'}`}>
        <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${info.className}`}><StatusIcon className="h-5 w-5" /></span>
        <div className="min-w-0"><h1 className="font-heading text-base font-extrabold text-dark-900">{t(submission.status === 'diterima' ? 'Pendaftaran Diterima' : submission.status === 'ditolak' ? 'Pendaftaran Ditolak' : ppdbSukses.judul)}</h1><p className="mt-1.5 text-[11px] leading-relaxed text-dark-600">{t(info.message)}</p></div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {[['Nomor Registrasi', nomor, 'text-dark-900'], ['Status Pendaftaran', info.label, statusColor], ['Jalur Seleksi', submission.pilihan_jurusan || 'Jalur Prestasi / Reguler', 'text-dark-900']].map(([label, value, color], index) => <Reveal key={label} className={['', 'delay-100', 'delay-200'][index] ?? ''}><div className="h-full rounded-2xl border border-dark-100 bg-white px-5 py-5 shadow-card"><p className="text-[10px] font-bold uppercase tracking-[0.08em] text-dark-400">{t(label)}</p><p className={`mt-2 break-words font-heading text-lg font-extrabold ${color}`}>{label === 'Status Pendaftaran' || !submission.pilihan_jurusan && label === 'Jalur Seleksi' ? t(value) : value}</p></div></Reveal>)}
      </div>

      {submission.catatan_admin && <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-5"><p className="text-[10px] font-bold uppercase tracking-wide text-primary">{t("Catatan Panitia")}</p><p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-primary-900">{submission.catatan_admin}</p></div>}

      <div className="mt-6 rounded-2xl border border-dark-100 bg-white p-6 shadow-card">
        <h2 className="font-heading text-sm font-extrabold text-dark-900">{t(ppdbSukses.langkahJudul)}</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">{ppdbSukses.langkah.map((langkah) => { const Ikon = ikonLangkah[langkah.icon] ?? Printer; return <Link key={langkah.judul} to="/spmb/dokumen-peserta" className="group flex items-center gap-4 rounded-xl border border-dark-100 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-card"><span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary"><Ikon className="h-4 w-4" /></span><span className="min-w-0"><span className="block font-heading text-xs font-bold text-dark-900">{t(langkah.judul)}</span><span className="mt-0.5 block text-[11px] text-dark-500">{t(langkah.deskripsi)}</span></span><ArrowRight className="ml-auto h-4 w-4 flex-shrink-0 text-dark-300 transition-colors group-hover:text-primary" /></Link>; })}</div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-dark-100 pt-5"><p className="flex items-center gap-3 text-[11px] text-dark-500"><img src={maskot} alt="" aria-hidden="true" className="h-9 w-9 flex-shrink-0 object-contain" />{t(ppdbSukses.bantuanTeks)}</p><a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-heading text-[11px] font-bold text-primary hover:underline">{t(ppdbSukses.bantuanCta)}<ArrowRight className="h-3.5 w-3.5" /></a></div>
      </div>
    </PpdbPortalLayout>
  );
};

export default SubmitSuccessPage;
