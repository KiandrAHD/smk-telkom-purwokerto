import { Link } from 'react-router-dom';
import VideoEmbed from './VideoEmbed';
import { landingAbout } from '../data/dummyData';
import accreditation from '../assets/tentang/badge-akreditasi.png';
import accreditationOverlay from '../assets/tentang/badge-akreditasi-overlay.png';
import facilitiesIcon from '../assets/tentang/badge-fasilitas.svg';
import teacherIcon from '../assets/tentang/badge-guru.svg';

const AboutSection = () => (
  <section id="tentang" className="bg-white py-4 lg:py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[42%_1fr] items-start gap-8 lg:gap-12">
        {/* Video profil sekolah. Iframe YouTube baru dimuat setelah tombol putar
            ditekan, jadi beranda tidak menarik skrip pihak ketiga sejak awal. */}
        <VideoEmbed
          videoId={landingAbout.video.videoId}
          poster={landingAbout.video.poster}
          title={landingAbout.video.title}
          desc={landingAbout.video.desc}
          rasio="aspect-[646/488]"
          showCaption={false}
          posterHasPlayIcon
        />

        {/* Teks + badge */}
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-primary">
            {landingAbout.title}
          </h2>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-dark-500">
            {landingAbout.description}
          </p>

          <div className="mt-6 grid auto-rows-fr grid-cols-2 gap-4">
            {landingAbout.badges.map((badge, index) => (
              <div
                key={badge.title}
                className="flex min-w-0 flex-col items-center gap-3 rounded-2xl bg-primary px-4 py-5 text-center text-white sm:flex-row sm:text-left"
              >
                {index === 0 && <span aria-hidden="true" className="relative h-[100px] w-[100px] shrink-0">
                  <img src={accreditation} alt="" width="100" height="100" className="absolute inset-0" />
                  <img src={accreditationOverlay} alt="" width="91" height="91" className="absolute left-[5px] top-1" />
                </span>}
                {index === 1 && <img src={facilitiesIcon} alt="" aria-hidden="true" className="shrink-0" />}
                {index === 2 && <img src={teacherIcon} alt="" aria-hidden="true" className="shrink-0" />}
                {index === 3 && <span aria-hidden="true" className="hidden w-[66px] shrink-0 sm:block" />}
                <div className="min-w-0">
                  <p className="font-heading text-sm font-bold leading-tight sm:text-base">
                    {badge.title}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-white/85">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/profil-sekolah"
            className="mt-5 inline-flex items-center rounded-full border border-dark-200 bg-white px-6 py-2.5 text-xs font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
          >
            {landingAbout.ctaText}
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
