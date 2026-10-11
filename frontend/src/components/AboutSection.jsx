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
import poster640 from '../assets/responsive/poster-640.webp';
import poster960 from '../assets/responsive/poster-960.webp';
import poster1440 from '../assets/responsive/poster-1440.webp';

const badgeDelays = ['delay-0', 'delay-100', 'delay-200', 'delay-300'];

const AboutSection = () => {
  const { t } = useLanguage();
  return (
  <section id="tentang" className="bg-white py-12 sm:py-16 lg:py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-start gap-8 rounded-3xl border border-dark-100 bg-dark-50 p-5 sm:p-8 lg:grid-cols-[42%_1fr] lg:gap-x-10 lg:gap-y-7 lg:p-10">
        {/* Video profil sekolah. Iframe YouTube baru dimuat setelah tombol putar
            ditekan, jadi beranda tidak menarik skrip pihak ketiga sejak awal. */}
        <Reveal className="lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-full">
          <VideoEmbed
            videoId={landingAbout.video.videoId}
            poster={landingAbout.video.poster}
            posterSrcSet={`${poster640} 640w, ${poster960} 960w, ${poster1440} 1440w, ${landingAbout.video.poster} 1600w`}
            // Account for object-cover: the wide source fills a 16:9 box.
            posterSizes="(min-width: 80rem) 35.523rem, (min-width: 64rem) calc(50.3329vw - 4.7427rem), (min-width: 40rem) calc(119.8402vw - 8.6884rem), calc(119.8402vw - 5.6924rem)"
            title={t(landingAbout.video.title)}
            desc={t(landingAbout.video.desc)}
            rasio="aspect-video lg:aspect-auto lg:h-full"
            className="lg:h-full"
            showCaption={false}
          />
        </Reveal>

        {/* Teks + badge */}
        <div className="lg:contents">
          <div className="lg:col-start-2 lg:row-start-1">
            <h2 className="font-heading text-[1.75rem] font-extrabold leading-tight tracking-tight text-dark-900 sm:text-[2rem] xl:text-[2.5rem]">
              {t(landingAbout.title)}
            </h2>
            <TextReveal
              text={t(landingAbout.description)}
              className="mt-5 max-w-2xl text-base leading-relaxed text-dark-900 sm:text-lg"
            />
          </div>

          <div className="mt-7 grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 lg:col-start-2 lg:row-start-2 lg:mt-0">
            {landingAbout.badges.map((badge, index) => (
              <Reveal
                key={badge.title}
                className={`${badgeDelays[index % badgeDelays.length]} flex min-w-0 items-center gap-3 rounded-2xl border border-dark-100 bg-white p-4 text-left`}
              >
                {index === 0 && <span aria-hidden="true" className="relative h-16 w-16 shrink-0 rounded-xl bg-primary">
                  <img src={accreditation} alt="" width="100" height="100" className="absolute left-[12%] top-[12%] h-[76%] w-[76%] object-contain" />
                  <img src={accreditationOverlay} alt="" width="91" height="91" className="absolute left-[15.8%] top-[15.04%] h-[69.16%] w-[69.16%] object-contain" />
                </span>}
                {index > 0 && <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary p-3">
                  <img src={[facilitiesIcon, teacherIcon, curriculumIcon][index - 1]} alt="" width="40" height="40" className="h-10 w-10 object-contain" />
                </span>}
                <div className="min-w-0">
                  <p className="font-heading text-base font-bold leading-tight text-dark-900">
                    {t(badge.title)}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-dark-600">
                    {t(badge.desc)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Link
            to="/profil-sekolah"
            className="mt-7 inline-flex min-h-11 items-center rounded-full border border-dark-200 bg-white px-6 py-3 text-sm font-semibold text-dark-900 transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:col-start-2 lg:row-start-3 lg:mt-0 lg:justify-self-start"
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
