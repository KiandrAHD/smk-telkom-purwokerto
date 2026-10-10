import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import ContentImage from './ContentImage';

const AchievementCard = ({ title, category, image, imageAlt, slug, highlight = false }) => {
  const { t } = useLanguage();
  return (
  <Link
    to={`/prestasi/${slug}`}
    aria-label={t('Lihat detail prestasi: {title}', { title: t(title) })}
    className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition-colors ${
      highlight ? 'border-primary' : 'border-dark-100 hover:border-primary'
    }`}
  >
    <article className="flex h-full flex-col">
      <div className="shrink-0 overflow-hidden">
        <ContentImage
          src={image}
          alt={t(imageAlt || title)}
          loading="lazy"
          className="w-full aspect-[16/9] object-cover object-top transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-1 flex-col px-4 py-2.5">
        <h3 className="whitespace-pre-line font-heading text-sm font-bold leading-snug text-dark-900">
          {t(title)}
        </h3>
        <p className="mt-auto pt-1 text-[10px] text-dark-500">{t(category)}</p>
      </div>
    </article>
  </Link>
  );
};

export default AchievementCard;
