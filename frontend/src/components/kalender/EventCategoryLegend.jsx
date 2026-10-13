import { useLanguage } from '../../context/LanguageContext';
import { eventCategories } from '../../data/eventCategories';
import EventCategoryLabel from './EventCategoryLabel';

export default function EventCategoryLegend({ showTitle = false }) {
  const { t } = useLanguage();
  return <div className="mt-4 border-t border-dark-100 pt-3" data-event-legend>
    <p className={showTitle ? 'mb-3 text-xs font-semibold text-dark-700' : 'sr-only'}>{t('Legenda kategori kegiatan')}</p>
    <ul aria-label={t('Legenda kategori kegiatan')} className="grid grid-cols-1 gap-x-3 gap-y-3 min-[360px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
      {eventCategories.map(category => <li key={category.value} className="min-w-0"><EventCategoryLabel category={category.value} /></li>)}
    </ul>
  </div>;
}
