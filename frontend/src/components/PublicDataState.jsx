import { useLanguage } from '../context/LanguageContext';
import ContentSkeleton from './ContentSkeleton';

const PublicDataState = ({ loading, error, empty, label, onRetry, carousel = false, deferred = false }) => {
  const { t } = useLanguage();
  if (loading) {
    // Scroll restoration must not wait for a request that requires scrolling.
    return <div aria-busy={!deferred}><p role="status" className="pt-6 text-center text-sm text-dark-500">{t('Memuat {label}...', { label: t(label) })}</p><ContentSkeleton carousel={carousel} /></div>;
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
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          <p>{t(error)}</p>
          {onRetry && <button type="button" onClick={onRetry} className="mt-3 min-h-11 rounded-full border border-red-700 px-5 py-2 font-semibold transition-colors hover:bg-red-100">{t('Coba lagi')}</button>}
        </div>
      </div>
    );
  }

  if (empty) {
    return <p key="empty" className="motion-feedback py-8 text-center text-xs text-dark-500">{t('Belum ada {label}.', { label: t(label) })}</p>;
  }

  return null;
};

export default PublicDataState;
