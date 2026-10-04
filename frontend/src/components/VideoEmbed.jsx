import { useState } from 'react';
import { Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import schoolPoster from '../assets/tentang/profil-hero.jpg';

// Pemutar video dengan pola "facade": yang dimuat pertama cuma gambar sampul,
// iframe YouTube baru disisipkan setelah tombol putar ditekan. Alasannya bukan
// gaya-gayaan — iframe YouTube menarik ratusan kilobyte skrip pihak ketiga, dan
// memasangnya di beberapa halaman sekaligus membuat pemuatan awal terasa berat.
//
// Memakai domain youtube-nocookie agar tidak ada cookie pelacak yang dipasang
// sebelum pengunjung benar-benar memutar videonya.
const VideoEmbed = ({ videoId, poster, posterSrcSet, posterSizes, title, desc, rasio = 'aspect-video', showCaption = true, layout = 'stacked', className = '' }) => {
  const { t } = useLanguage();
  const [diputar, setDiputar] = useState(false);

  return (
    <figure className={`${layout === 'horizontal' ? 'grid overflow-hidden rounded-[20px] bg-white shadow-[0_0_16px_rgba(0,0,0,0.25)] sm:grid-cols-[57.62%_1fr] lg:rounded-[1.0846vw]' : 'overflow-hidden rounded-2xl border border-dark-100 bg-dark-900 shadow-card'} ${className}`}>
      <div className={`relative w-full overflow-hidden ${rasio} ${layout === 'horizontal' ? 'rounded-[20px] lg:rounded-[1.0846vw]' : ''}`}>
        {diputar ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={t(title)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setDiputar(true)}
            aria-label={t('Putar video: {title}', { title: t(title) })}
            className="group absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary"
          >
            <img
              src={poster || schoolPoster}
              srcSet={posterSrcSet}
              sizes={posterSizes}
              onError={({ currentTarget }) => {
                // A failed responsive candidate must not override the fallback.
                currentTarget.removeAttribute('srcset');
                currentTarget.removeAttribute('sizes');
                if (currentTarget.getAttribute('src') !== schoolPoster) currentTarget.src = schoolPoster;
              }}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
            />
            <span aria-hidden="true" className={`absolute inset-0 transition-colors ${layout === 'horizontal' ? 'group-hover:bg-dark-950/10' : 'bg-dark-950/35 group-hover:bg-dark-950/20'}`} />
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <span className={`flex items-center justify-center rounded-full bg-primary shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110 ${layout === 'horizontal' ? 'size-[clamp(3.5rem,4.88vw,5.625rem)]' : 'h-14 w-14 sm:h-16 sm:w-16'}`}>
                <Play className="ml-1 h-6 w-6 text-white sm:h-7 sm:w-7" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>

      {showCaption && (title || desc) && (
        <figcaption className={layout === 'horizontal' ? 'min-w-0 bg-white px-5 py-5 lg:px-[1.6vw] lg:py-[1.128vw]' : 'bg-white px-5 py-4'}>
          {title && (
            <p className={layout === 'horizontal' ? 'whitespace-pre-line text-base font-extrabold leading-[1.3] tracking-[0.05em] text-black lg:text-[clamp(1rem,1.3015vw,1.5rem)]' : 'whitespace-pre-line font-heading text-xs font-bold leading-snug text-dark-900 sm:text-sm'}>
              {t(title)}
            </p>
          )}
          {desc && <p className={layout === 'horizontal' ? 'mt-1 text-xs font-medium leading-snug text-black/70 lg:text-[clamp(0.75rem,0.8134vw,0.9375rem)]' : 'mt-1 text-[10px] leading-relaxed text-dark-500 sm:text-xs'}>{t(desc)}</p>}
        </figcaption>
      )}
    </figure>
  );
};

export default VideoEmbed;
