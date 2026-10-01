import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import stelaCard from '../assets/landing/stela-card.jpg';
import stelaCardEn from '../assets/landing/stela-card-en.png';
import { stelaData } from '../data/dummyData';

const StelaAISection = () => {
  const { t, language } = useLanguage();
  // Both locales retain the complete artwork, including the translated button.
  if (language === 'en') return (
    <section id="stela" className="bg-white py-6 lg:py-8">
      <div className="mx-auto max-w-[1546px] px-4 sm:px-6 lg:px-8">
        <Link to="/stela" aria-label={t(stelaData.ctaText)} className="block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <img src={stelaCardEn} width="2172" height="724" alt="" aria-hidden="true" className="block h-auto w-full rounded-3xl" />
        </Link>
        <div className="sr-only">
          <h2>{t(stelaData.title).replace('\n', ' ')}</h2>
          <p>{t(stelaData.description)}</p>
          {stelaData.chats.map((chat) => <p key={chat.from}>{t(chat.text)}</p>)}
        </div>
      </div>
    </section>
  );
  return (
  <section id="stela" className="bg-white py-6 lg:py-8">
    <div className="mx-auto max-w-[1546px] px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <img
          src={stelaCard}
          alt=""
          aria-hidden="true"
          className="w-full rounded-3xl object-contain"
        />

        <div className="sr-only">
          <h2>{t(stelaData.title).replace('\n', ' ')}</h2>
          <p>{t(stelaData.description)}</p>
          {stelaData.chats.map((chat) => (
            <p key={chat.from}>{t(chat.text)}</p>
          ))}
        </div>

        {/* sm+ : tombol menimpa kartu sesuai koordinat Figma (x 233/1533, y 372/483).
            mobile: kartu terlalu pendek untuk ditimpa, jadi tombol turun ke bawah gambar. */}
        <Link
          to="/stela"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-white shadow-sm transition-colors sm:absolute sm:left-[5.5%] sm:top-[77%] sm:mt-0 sm:bg-white sm:px-5 sm:py-2.5 sm:text-primary sm:hover:bg-primary-50 lg:px-6 lg:py-3"
        >
          {t(stelaData.ctaText)}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
  );
};

export default StelaAISection;
