import { Link } from 'react-router-dom';
import VideoEmbed from './VideoEmbed';
import { landingAbout } from '../data/dummyData';

const AboutSection = () => (
  <section id="tentang" className="bg-white py-4 lg:py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[38%_1fr] items-center gap-8 lg:gap-12">
        {/* Video profil sekolah. Iframe YouTube baru dimuat setelah tombol putar
            ditekan, jadi beranda tidak menarik skrip pihak ketiga sejak awal. */}
        <VideoEmbed
          videoId={landingAbout.video.videoId}
          poster={landingAbout.video.poster}
          title={landingAbout.video.title}
          desc={landingAbout.video.desc}
        />

        {/* Teks + badge */}
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-primary">
            {landingAbout.title}
          </h2>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-dark-500">
            {landingAbout.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {landingAbout.badges.map((badge) => (
              <div
                key={badge.title}
                className="rounded-xl bg-primary px-4 py-3 text-white"
              >
                <p className="font-heading text-xs font-bold leading-tight">
                  {badge.title}
                </p>
                <p className="mt-0.5 text-[10px] leading-tight text-white/85">
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/tentang"
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
