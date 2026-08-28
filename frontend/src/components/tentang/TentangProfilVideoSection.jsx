import VideoEmbed from '../VideoEmbed';
import GaleriFoto from '../GaleriFoto';
import { profilVideo } from '../../data/dummyData';

// Profil sekolah dalam bentuk tontonan: satu video yang bisa langsung diputar,
// didampingi galeri fasilitas yang bisa diperbesar.
const TentangProfilVideoSection = () => (
  <section className="bg-dark-50 py-8 lg:py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
            {profilVideo.eyebrow}
          </p>
          <h2 className="mt-2 font-heading text-xl font-extrabold text-dark-900 sm:text-2xl">
            {profilVideo.title}
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-dark-500 sm:text-sm">
            {profilVideo.description}
          </p>
        </div>

        <VideoEmbed
          videoId={profilVideo.video.videoId}
          poster={profilVideo.video.poster}
          title={profilVideo.video.title}
          desc={profilVideo.video.desc}
        />
      </div>

      <GaleriFoto
        items={profilVideo.galeri}
        title={profilVideo.galeriTitle}
        description={profilVideo.galeriDesc}
      />
    </div>
  </section>
);

export default TentangProfilVideoSection;
