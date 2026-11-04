import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

// Shared by the public page layout and the announcements help card.
const StelaAISection = ({ variant = 'default', className, containerClassName }) => {
  const { language } = useLanguage();
  const locale = language === 'en' ? 'en' : 'id';
  const english = locale === 'en';
  const asset = `/assets/branding/nexa-${locale}`;
  const sizes = variant === 'prestasi'
    ? '(min-width: 1844px) 1683px, (min-width: 1024px) 91.27vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)'
    : '(min-width: 1280px) 1216px, (min-width: 1024px) calc(100vw - 64px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)';

  return (
    <section id="nexa" aria-label={english ? 'Ask NEXA' : 'Tanya NEXA'} className={className ?? 'bg-white py-6 lg:py-8'}>
      <div className={containerClassName ?? (variant === 'prestasi' ? 'mx-auto w-[calc(100%-2rem)] max-w-[1683px] sm:w-[calc(100%-3rem)] lg:w-[91.27%]' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8')}>
        <Link to="/nexa" aria-label={english ? 'Ask NEXA Now' : 'Tanya NEXA Sekarang'} className="block rounded-3xl transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <picture>
            <source media="(max-width: 767px)" srcSet={`${asset}-mobile-480.webp 480w, ${asset}-mobile-768.webp 768w, ${asset}-mobile-1024.webp 1024w`} sizes="(min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)" width="1024" height="1536" />
            <img src={`${asset}-desktop-1540.webp`} srcSet={`${asset}-desktop-960.webp 960w, ${asset}-desktop-1540.webp 1540w, ${asset}-desktop-2172.webp 2172w`} sizes={sizes} width="2172" height="724" alt={english ? 'Ask NEXA anything. Get answers about study programs, facilities, achievements, and admissions at SMK Telkom Purwokerto.' : 'Tanyakan apa saja ke NEXA. Tanya seputar jurusan, fasilitas, prestasi, dan pendaftaran SMK Telkom Purwokerto.'} loading="lazy" decoding="async" className="block h-auto w-full" />
          </picture>
        </Link>
        <div className="sr-only">
          <h2>{english ? 'Ask NEXA anything' : 'Tanyakan apa saja ke NEXA'}</h2>
          <p>{english ? 'I enjoy coding and building apps. Which program should I choose?' : 'Aku suka coding dan membuat aplikasi. Jurusan apa yang cocok?'}</p>
          <p>{english ? 'Try Software Engineering (RPL). You will learn programming, web development, and app development.' : 'Coba Rekayasa Perangkat Lunak (RPL). Kamu akan belajar pemrograman, pengembangan web, dan aplikasi.'}</p>
        </div>
      </div>
    </section>
  );
};

export default StelaAISection;
