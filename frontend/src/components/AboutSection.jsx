import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import VideoEmbed from './VideoEmbed';
import Reveal from './Reveal';
import TextReveal from './TextReveal';
import { landingAbout } from '../data/dummyData';
import accreditation from '../assets/tentang/badge-akreditasi.png';
import accreditationOverlay from '../assets/tentang/badge-akreditasi-overlay.png';
import facilitiesIcon from '../assets/tentang/badge-fasilitas.svg';
import teacherIcon from '../assets/tentang/badge-guru.svg';
import curriculumIcon from '../assets/tentang/badge-kurikulum.svg';

const badgeDelays = ['delay-0', 'delay-100', 'delay-200', 'delay-300'];

const AboutSection = () => {
  const { t } = useLanguage();
  return (
  <section id="tentang" className="bg-white py-4 lg:py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[42%_1fr] items-start gap-8 lg:gap-12">
        {/* Video profil sekolah. Iframe YouTube baru dimuat setelah tombol putar
            ditekan, jadi beranda tidak menarik skrip pihak ketiga sejak awal. */}
        <Reveal>
          <VideoEmbed
            videoId={landingAbout.video.videoId}
            poster={landingAbout.video.poster}
            title={t(landingAbout.video.title)}
            desc={t(landingAbout.video.desc)}
            rasio="aspect-[646/488]"
            showCaption={false}
          />
        </Reveal>

        {/* Teks + badge */}
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-primary">
            {t(landingAbout.title)}
          </h2>
          <TextReveal
            text={t(landingAbout.description)}
            className="mt-3 max-w-2xl text-sm leading-relaxed text-dark-900 sm:text-base"
          />

          <div className="mt-6 grid auto-rows-fr grid-cols-2 gap-4">
            {landingAbout.badges.map((badge, index) => (
              <Reveal
                key={badge.title}
                className={`${badgeDelays[index % badgeDelays.length]} flex min-w-0 flex-col items-center gap-3 rounded-2xl bg-primary px-4 py-5 text-center text-white sm:flex-row sm:text-left`}
              >
                {index === 0 && <span aria-hidden="true" className="relative h-[100px] w-[100px] shrink-0">
                  <img src={accreditation} alt="" width="100" height="100" className="absolute inset-0" />
                  <img src={accreditationOverlay} alt="" width="91" height="91" className="absolute left-[5px] top-1" />
                </span>}
                {index === 1 && <img src={facilitiesIcon} alt="" aria-hidden="true" className="shrink-0" />}
                {index === 2 && <img src={teacherIcon} alt="" aria-hidden="true" className="shrink-0" />}
                {index === 3 && <img src={curriculumIcon} alt="" aria-hidden="true" width="68" height="68" className="shrink-0" />}
                <div className="min-w-0">
                  <p className="font-heading text-sm font-bold leading-tight sm:text-base">
                    {t(badge.title)}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-white/85">
                    {t(badge.desc)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Link
            to="/profil-sekolah"
            className="mt-5 inline-flex items-center rounded-full border border-dark-200 bg-white px-6 py-2.5 text-xs font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
          >
            {t(landingAbout.ctaText)}
          </Link>
        </div>
      </div>
    </div>
  </section>
  );
};

export default AboutSection;
