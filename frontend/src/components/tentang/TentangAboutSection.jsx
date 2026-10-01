import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { aboutDescription, videoProfilSekolah } from '../../data/dummyData';
import VideoEmbed from '../VideoEmbed';

const TentangAboutSection = () => {
  const { t } = useLanguage();
  return (
  <section id="profil" className="bg-white py-6 lg:py-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-8 rounded-3xl border border-dark-100 bg-white p-6 shadow-card sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:p-10">
        <div>
          <h2 className="whitespace-pre-line font-heading text-2xl sm:text-3xl font-extrabold leading-tight text-primary">
            {t(aboutDescription.title)}
          </h2>
          <p className="mt-5 max-w-3xl text-xs sm:text-sm leading-relaxed text-dark-600">
            {t(aboutDescription.text)}
          </p>
          <a
            href="#perjalanan"
            className="mt-6 inline-flex items-center rounded-full border border-dark-200 bg-white px-6 py-2.5 text-xs font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
          >
            {t(aboutDescription.ctaText)}
            <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
          </a>
        </div>
        <VideoEmbed {...videoProfilSekolah} title={t(videoProfilSekolah.title)} desc={t(videoProfilSekolah.desc)} showCaption={false} posterHasPlayIcon />
      </div>
    </div>
  </section>
  );
};

export default TentangAboutSection;
