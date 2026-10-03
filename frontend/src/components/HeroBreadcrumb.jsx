import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const HeroBreadcrumb = ({ current, parent = 'Tentang', parentTo = '/profil-sekolah' }) => {
  const { t, language } = useLanguage();
  return (
    <nav aria-label={language === 'en' ? 'Breadcrumb' : 'Jejak navigasi'} className="mb-4 text-xs leading-5 text-dark-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to={parentTo} className="inline-flex min-h-6 items-center rounded-sm transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {t(parent)}
          </Link>
        </li>
        <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
        <li><span aria-current="page" className="inline-flex min-h-6 items-center font-semibold text-primary">{t(current)}</span></li>
      </ol>
    </nav>
  );
};

export default HeroBreadcrumb;
