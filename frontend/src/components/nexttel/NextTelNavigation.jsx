import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function NextTelNavigation({ first, last, selected, onBack, onNext }) {
  const { t } = useLanguage();
  const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <button type="button" onClick={onBack} disabled={first}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-dark-100 px-5 py-3 text-xs font-semibold text-dark-700 transition-colors hover:bg-dark-200 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6 sm:text-sm ${focus}`}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t('Kembali')}
      </button>
      <button type="button" onClick={onNext} disabled={!selected}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6 sm:text-sm ${focus}`}>
        {t(last ? 'Selesai' : 'Lanjut')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
