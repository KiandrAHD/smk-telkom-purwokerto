import { Link } from 'react-router-dom';
import ContentImage from './ContentImage';

const AchievementCard = ({ title, category, image, imageAlt, slug, highlight = false }) => (
  <Link
    to={`/prestasi/${slug}`}
    aria-label={`Lihat detail prestasi: ${title}`}
    className={`group block overflow-hidden rounded-2xl border bg-white shadow-card transition-colors ${
      highlight ? 'border-primary' : 'border-dark-100 hover:border-primary'
    }`}
  >
    <article>
      <div className="overflow-hidden">
        <ContentImage
          src={image}
          alt={imageAlt || title}
          loading="lazy"
          className="w-full aspect-[16/9] object-cover object-top transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="px-4 py-2.5">
        <h3 className="whitespace-pre-line font-heading text-sm font-bold leading-snug text-dark-900">
          {title}
        </h3>
        <p className="mt-1 text-[10px] text-dark-500">{category}</p>
      </div>
    </article>
  </Link>
);

export default AchievementCard;
