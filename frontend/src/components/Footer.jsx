import { LockKeyhole, Mail, MapPin, Phone } from 'lucide-react';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { footerData } from '../data/dummyData';
import footerAccent from '../assets/landing/footer-accent.png';

const socialIcons = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
};

const footerAccents = [
  'left-[-104px] top-[-21px]',
  'left-[-94px] top-[164px]',
  'left-[129px] top-[200px] -rotate-90',
  'left-[310px] top-[202px]',
  'right-[375px] top-[200px] -rotate-90',
  'right-[174px] top-[204px] -rotate-90',
  'right-[-7px] top-[206px]',
  'right-[-117px] top-[18px]',
];

const LinkColumn = ({ title, links }) => (
  <div>
    <h3 className="font-heading text-xs font-bold text-dark-900">{title}</h3>
    <ul className="mt-3 space-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.href}
            className="text-[11px] text-dark-500 transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => (
  <footer className="relative overflow-hidden bg-white pt-7 lg:pt-9">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
    >
      {footerAccents.map((className) => (
        <img
          key={className}
          src={footerAccent}
          alt=""
          className={`absolute hidden h-[233px] w-[233px] max-w-none opacity-30 lg:block ${className}`}
        />
      ))}
    </div>

    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-7 sm:px-6 lg:px-8 lg:pb-9">
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr_1.4fr]">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Logo className="h-11 w-11" />
            <span className="font-heading text-base font-extrabold leading-[1.15] text-dark-900">
              SMK Telkom
              <br />
              Purwokerto
            </span>
          </div>
          <p className="mt-3 max-w-xs text-[11px] leading-relaxed text-dark-500">
            {footerData.tagline}
          </p>
          <div className="mt-4 flex items-center gap-3">
            {footerData.socials.map((social) => {
              const Icon = socialIcons[social.icon];
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.name} SMK Telkom Purwokerto`}
                  className="relative text-dark-500 transition-colors hover:text-primary before:absolute before:-inset-2 before:content-['']"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <LinkColumn title="Menu" links={footerData.menu} />
        <LinkColumn title="Informasi" links={footerData.informasi} />

        {/* Kontak */}
        <div>
          <h3 className="font-heading text-xs font-bold text-dark-900">Kontak</h3>
          <ul className="mt-3 space-y-2 text-[11px] text-dark-500">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
              {footerData.kontak.address}
            </li>
            <li>
              <a
                href={`tel:${footerData.kontak.phone.replace(/[^+\d]/g, '')}`}
                className="flex items-start gap-2 transition-colors hover:text-primary"
              >
                <Phone className="mt-0.5 h-3 w-3 flex-shrink-0" />
                {footerData.kontak.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${footerData.kontak.email}`}
                className="flex items-start gap-2 transition-colors hover:text-primary"
              >
                <Mail className="mt-0.5 h-3 w-3 flex-shrink-0" />
                {footerData.kontak.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Peta lokasi */}
        <div className="col-span-2 lg:col-span-1">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              footerData.kontak.mapsQuery ?? footerData.kontak.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buka lokasi SMK Telkom Purwokerto di Google Maps"
            className="block overflow-hidden rounded-xl transition-transform hover:scale-[1.01]"
          >
            <img
              src={footerData.map}
              alt="Peta lokasi SMK Telkom Purwokerto"
              loading="lazy"
              className="w-full rounded-xl border border-dark-100 object-cover"
            />
          </a>
        </div>
      </div>
    </div>

    <div className="relative z-10 bg-primary text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2 text-[10px] sm:flex-row sm:px-6 lg:px-8">
        <p>© 2026 SMK Telkom Purwokerto. All Rights Reserved.</p>
        <div className="flex items-center gap-3">
          <span className="underline underline-offset-2">Kebijakan Privasi</span>
          <span aria-hidden="true" className="h-3 border-l border-white/60" />
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 underline-offset-2 transition-opacity hover:opacity-80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <LockKeyhole className="h-3 w-3" aria-hidden="true" />
            Akses Staf & Admin
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
