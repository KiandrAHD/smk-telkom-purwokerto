import { useLanguage } from '../../context/LanguageContext';
import { getEventCategory } from '../../data/eventCategories';

export function EventCategoryDot({ category }) {
  const item = getEventCategory(category);
  return item.indicator
    ? <img src={item.indicator} alt="" width="18" height="18" className="inline-block shrink-0 align-middle" data-category-dot={item.value} />
    : <span aria-hidden="true" className="inline-block size-[18px] shrink-0 rounded-full bg-dark-500 align-middle" data-category-dot={item.value} />;
}

export default function EventCategoryLabel({ category, badge = false, compact = true }) {
  const { t } = useLanguage();
  const item = getEventCategory(category);
  return <span className={`inline-flex max-w-full items-center gap-1.5 font-semibold leading-relaxed ${compact ? 'text-[10px]' : 'text-sm'} ${badge ? `rounded-lg px-2 py-1 ${item.badgeClass}` : 'text-dark-600'}`}>
    <EventCategoryDot category={category} /><span className="min-w-0 break-words">{t(item.label)}</span>
  </span>;
}
