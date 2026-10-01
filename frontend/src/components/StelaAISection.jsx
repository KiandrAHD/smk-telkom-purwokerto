import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import stelaCard from '../assets/landing/stela-card.jpg';
import stelaMascot from '../assets/bkk/stela-mascot.png';
import { stelaData } from '../data/dummyData';

const StelaAISection = () => {
  const { t, language } = useLanguage();
  // Teks bahasa Indonesia menyatu di bitmap; versi Inggris memakai teks HTML.
  if (language === 'en') return (
    <section id="stela" className="bg-white py-6 lg:py-8">
      <div className="mx-auto max-w-[1546px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-primary px-6 py-8 text-white sm:p-10 lg:grid-cols-[1fr_1fr] lg:p-12">
          <div>
            <h2 className="whitespace-pre-line font-heading text-3xl font-extrabold leading-tight sm:text-4xl">{t(stelaData.title)}</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85">{t(stelaData.description)}</p>
            <Link to="/stela" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-primary transition-colors hover:bg-primary-50">
              {t(stelaData.ctaText)}<ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative grid grid-cols-[5rem_1fr] items-center gap-4 sm:grid-cols-[8rem_1fr]">
            <img src={stelaMascot} alt="" aria-hidden="true" className="w-full" />
            <div className="space-y-3">
              {stelaData.chats.map((chat) => (
                <p key={chat.from} className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${chat.from === 'user' ? 'bg-white text-dark-700' : 'bg-white/15 text-white'}`}>{t(chat.text)}</p>
              ))}
            </div>
          </div>
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
