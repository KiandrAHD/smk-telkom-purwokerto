import VideoEmbed from '../VideoEmbed';
import bg from '../../assets/landing/partners-bg.png';
import { mitraIndustri, videoHighlight } from '../../data/dummyData';

const PrestasiDukunganSection = () => (
  <section className="bg-white py-8 lg:py-12">
    <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
      {/* Didukung & Diakui Oleh */}
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-dark-900">
          {videoHighlight.sectionTitle}
        </h2>
        {/* Latar diletakkan absolut agar tinggi pita mengikuti barisan logo —
            di layar sempit logonya membungkus ke baris kedua, tidak terpotong. */}
        <div className="relative mt-6 overflow-hidden rounded-xl">
          <img
            src={bg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative flex flex-wrap items-center justify-center gap-x-4 gap-y-3 px-4 py-5 sm:justify-between">
            {mitraIndustri.map((mitra) => (
              <img
                key={mitra.name}
                src={mitra.logo}
                alt={mitra.name}
                className="h-3.5 w-auto object-contain sm:h-4"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Video Highlight */}
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-dark-900">
          {videoHighlight.title}
        </h2>
        <div className="mt-6">
          <VideoEmbed
            videoId={videoHighlight.video.videoId}
            poster={videoHighlight.video.poster}
            title={videoHighlight.videoTitle}
            desc={videoHighlight.videoDesc}
          />
        </div>
      </div>
    </div>
  </section>
);

export default PrestasiDukunganSection;
