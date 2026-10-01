import { useLanguage } from '../context/LanguageContext';

const PublicDataState = ({ loading, error, empty, label }) => {
  const { t } = useLanguage();
  if (loading) {
    return <p key="loading" role="status" className="motion-feedback py-8 text-center text-xs text-dark-500">{t('Memuat {label}...', { label: t(label) })}</p>;
  }

  if (error) {
    return (
      // Jaraknya dibuat lewat PADDING pembungkus, bukan margin pada kotaknya.
      // Margin atas akan lolos keluar (margin collapse) karena pembungkus di
      // keempat halaman hanya mengatur jarak mendatar, tanpa padding atau
      // border tegak -- akibatnya kotak galat menempel ke bagian di atasnya.
      // Padding tidak bisa collapse, dan py-8 ini menyamakan iramanya dengan
      // keadaan "memuat" dan "kosong" di bawah.
      <div className="motion-feedback py-8">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-xs text-red-700">
          {t(error)}
        </p>
      </div>
    );
  }

  if (empty) {
    return <p key="empty" className="motion-feedback py-8 text-center text-xs text-dark-500">{t('Belum ada {label}.', { label: t(label) })}</p>;
  }

  return null;
};

export default PublicDataState;
