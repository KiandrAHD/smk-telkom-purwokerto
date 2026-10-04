import { useLanguage } from '../../context/LanguageContext';
import { ketentuanPpdb } from '../../data/dummyData';

export default function PreparationChecklist() {
  const { t } = useLanguage();
  return <details className="mt-5 rounded-xl border border-dark-100 bg-dark-50 p-4">
    <summary className="cursor-pointer text-sm font-bold text-dark-800">{t('Apa yang perlu disiapkan?')}</summary>
    <p className="mt-3 text-xs leading-relaxed text-dark-600">{t('Buat akun dengan email aktif dan kata sandi. Biodata dan nilai dilengkapi setelah verifikasi email.')}</p>
    <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-relaxed text-dark-600"><li>{t('NISN, NIK, nomor WhatsApp, dan nilai lima mata pelajaran semester 1–5.')}</li>{ketentuanPpdb.bagian.find((b) => b.judul === 'Berkas Pendaftaran').butir.map((text) => <li key={text}>{t(text)}</li>)}</ul>
    <p className="mt-3 text-xs text-dark-500">{t('Gabungkan dokumen persyaratan menjadi satu file PDF sebelum diunggah. Ukuran maksimal 10MB.')}</p>
  </details>;
}
