import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import stelaCard from '../assets/landing/stela-card.jpg';
import stelaCardEn from '../assets/landing/stela-card-en.png';
import { stelaData } from '../data/dummyData';

const StelaAISection = () => {
  const { t, language } = useLanguage();
  const english = language === 'en';
  return (
    <section id="stela" className="bg-white py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link to="/stela" aria-label={t(stelaData.ctaText)} className="block overflow-hidden rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <img src={english ? stelaCardEn : stelaCard} width={english ? 2172 : 2200} height={english ? 724 : 693} alt="" aria-hidden="true" loading="lazy" className="block h-auto w-full" />
        </Link>
        <div className="sr-only">
          <h2>{t(stelaData.title).replace('\n', ' ')}</h2>
          <p>{t(stelaData.description)}</p>
          {stelaData.chats.map((chat) => <p key={chat.from}>{t(chat.text)}</p>)}
        </div>
      </div>
    </section>
  );
};

export default StelaAISection;
