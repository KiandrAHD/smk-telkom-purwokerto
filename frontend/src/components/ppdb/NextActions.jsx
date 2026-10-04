import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { buatLinkFlexBox } from '../../data/dummyData';

const instructions = {
  menunggu: 'Simpan nomor registrasi dan pantau status. Panitia akan memeriksa data serta berkas Anda.',
  diproses: 'Periksa catatan panitia dan pantau status. Hubungi panitia bila ada data yang perlu diperbaiki.',
  diterima: 'Hubungi panitia untuk informasi daftar ulang dan dokumen lanjutan. Jadwal resmi belum tersedia.',
  ditolak: 'Baca catatan panitia untuk mengetahui hasil pemeriksaan. Hubungi panitia jika membutuhkan penjelasan.',
};
export default function NextActions({ submission, email }) {
  const { t } = useLanguage();
  if (!instructions[submission.status]) return null;
  const help = buatLinkFlexBox('status', { nama: submission.nama_lengkap, email, nomorPendaftaran: submission.id, halaman: '/spmb/status' });
  return <section className="mt-5 rounded-2xl border border-dark-100 bg-white p-5 shadow-card">
    <h2 className="font-heading text-sm font-bold text-dark-900">{t('Langkah berikutnya')}</h2>
    <p className="mt-2 text-sm leading-relaxed text-dark-600">{t(instructions[submission.status])}</p>
    <div className="mt-3 flex flex-wrap gap-3">
      <Link to="/spmb/dokumen-peserta" className="inline-flex min-h-11 items-center rounded-full bg-primary px-4 text-xs font-bold text-white">{t('Kartu dan Dokumen Peserta')}</Link>
      <a href={help} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-dark-200 px-4 text-xs font-bold text-primary">{t('Hubungi Panitia SPMB')}</a>
    </div>
  </section>;
}
