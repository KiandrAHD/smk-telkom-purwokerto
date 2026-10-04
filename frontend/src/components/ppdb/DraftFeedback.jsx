import { useLanguage } from '../../context/LanguageContext';
import { usePpdb } from '../../context/PpdbContext';

export default function DraftFeedback() {
  const { t, locale } = useLanguage();
  const { draftStatus, draftTime, draftLoadError, simpanDraft } = usePpdb();
  if (draftLoadError) return <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{t(draftLoadError)}</p>;
  return <div className="mt-4 flex flex-wrap items-center gap-3 text-xs" role="status" aria-live="polite">
    <span className={draftStatus === 'error' ? 'text-red-700' : 'text-dark-500'}>{t(draftStatus === 'saving' ? 'Menyimpan draft otomatis...' : draftStatus === 'error' ? 'Draft belum tersimpan. Periksa koneksi dan coba lagi.' : draftStatus === 'saved' ? 'Draft tersimpan otomatis' : 'Biodata dan nilai disimpan otomatis.')}{draftStatus === 'saved' && draftTime && ` · ${new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(draftTime))}`}</span>
    {draftStatus === 'error' && <button type="button" onClick={() => void simpanDraft().catch(() => {})} className="min-h-11 font-bold text-primary underline">{t('Coba Lagi')}</button>}
  </div>;
}
