import { useLanguage } from '../../context/LanguageContext';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, CalendarDays, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';
import PpdbPortalLayout from '../../components/ppdb/PpdbPortalLayout';
import CopyRegistrationNumber from '../../components/ppdb/CopyRegistrationNumber';
import { usePpdb } from '../../context/PpdbContext';
import { dokumenPeserta, ppdbMeta } from '../../data/dummyData';
import { getMyPpdb } from '../../services/ppdbService';

export default function DokumenPesertaPage() {
  const { t } = useLanguage();
  const { currentUser } = usePpdb();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try { const rows = await getMyPpdb(); setSubmission(rows[0] || null); }
    catch { setError('Data pendaftaran gagal dimuat. Silakan coba lagi.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
  return <PpdbPortalLayout>
    <div className="print:hidden"><h1 className="font-heading text-xl font-extrabold text-dark-900 sm:text-2xl">{t(dokumenPeserta.title)}</h1><p className="mt-2 text-sm text-dark-500">{t('Kartu menggunakan data pendaftaran yang telah dikirim. Jadwal dan panduan resmi akan ditampilkan setelah tersedia.')}</p></div>
    {loading ? <p role="status" className="mt-6 text-sm text-dark-500">{t('Memuat data pendaftaran...')}</p> : error ? <div className="mt-6 rounded-xl bg-red-50 p-5"><p role="alert" className="text-sm text-red-700">{t(error)}</p><button type="button" onClick={load} className="mt-3 min-h-11 font-bold text-primary">{t('Coba Lagi')}</button></div> : !submission ? <div className="mt-6 rounded-xl bg-white p-5"><p>{t('Pendaftaran belum ditemukan.')}</p><Link to="/spmb/formulir" className="mt-3 inline-flex min-h-11 items-center font-bold text-primary">{t('Mulai Pendaftaran')}</Link></div> : <div className="mt-6 grid gap-6 lg:grid-cols-[22rem_1fr] print:mt-0 print:block">
      <article data-spmb-card className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card print:mx-auto print:max-w-lg print:shadow-none">
        <div className="flex items-center gap-3 bg-primary px-5 py-4 print:bg-white print:text-black"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1.5"><Logo className="h-full w-full" /></span><div className="min-w-0"><h2 className="font-heading text-sm font-extrabold text-white print:text-black">{t(dokumenPeserta.kartuJudul)}</h2><p className="text-xs text-white/80 print:text-black">{ppdbMeta.namaSekolah}</p></div></div>
        <dl className="space-y-4 p-5">{[['Nomor Registrasi', submission.id], ['Nama Lengkap', submission.nama_lengkap], ['NISN', submission.nisn], ['Email', submission.email || currentUser?.email], ['Pilihan Jurusan', t(submission.pilihan_jurusan)], ['Nama SMP / MTs', submission.asal_sekolah]].map(([label, value]) => <div key={label}><dt className="text-[10px] font-bold uppercase tracking-wide text-dark-400">{t(label)}</dt><dd className="mt-1 break-words text-sm font-bold text-dark-900">{value || '-'}</dd>{label === 'Nomor Registrasi' && <div className="print:hidden"><CopyRegistrationNumber value={submission.id} /></div>}</div>)}</dl>
        <p className="border-t border-dark-100 px-5 py-3 text-xs leading-relaxed text-dark-500">{t(dokumenPeserta.kartuCatatan)}</p>
      </article>
      <div className="space-y-5 print:hidden"><section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-card"><h2 className="font-heading text-sm font-extrabold text-dark-900">{t('Berkas Peserta')}</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-dark-100 p-4"><Printer className="h-5 w-5 text-primary" /><div className="min-w-0 flex-1"><p className="text-sm font-bold">{t('Kartu Peserta SPMB')}</p><p className="mt-1 text-xs text-dark-500">{t('Cetak kartu atau simpan sebagai PDF melalui browser')}</p></div><button type="button" onClick={() => window.print()} className="min-h-11 rounded-full bg-primary px-4 text-xs font-bold text-white">{t('Cetak Kartu')}</button></div>
        {[[CalendarDays, 'Jadwal Seleksi'], [BookOpen, 'Panduan Tes Seleksi']].map(([Icon, label]) => <div key={label} className="mt-3 flex flex-wrap items-center gap-4 rounded-xl border border-dark-100 p-4"><Icon className="h-5 w-5 text-dark-400" /><p className="flex-1 text-sm font-bold">{t(label)}</p><button type="button" disabled className="min-h-11 rounded-full bg-dark-50 px-4 text-xs text-dark-500">{t('Belum tersedia')}</button></div>)}
      </section><section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-card"><h2 className="font-heading text-sm font-extrabold text-dark-900">{t('Tahapan Seleksi')}</h2><p className="mt-3 rounded-xl bg-primary-50 p-4 text-sm leading-relaxed text-dark-700">{t('Jadwal resmi SPMB 2027/2028 belum tersedia. Pantau portal untuk informasi dari panitia.')}</p></section>
      <Link to="/spmb/status" className="inline-flex min-h-11 items-center gap-2 text-xs font-bold text-primary"><ArrowLeft className="h-4 w-4" />{t('Kembali ke Status Pendaftaran')}</Link></div>
    </div>}
  </PpdbPortalLayout>;
}
