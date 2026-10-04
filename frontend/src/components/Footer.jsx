import { LockKeyhole, Mail, MapPin, Phone } from 'lucide-react';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import VisitorCounter from './VisitorCounter';
import { footerData } from '../data/dummyData';
import footerAccentFill from '../assets/footer/footer-motif-fill.svg';
import competitionSupporters from '../assets/footer/competition-supporters.png';
import { useLanguage } from '../context/LanguageContext';

const socialIcons = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
};

const supporterLogos = [
  { id: 'jagoan', name: 'Jagoan Hosting', href: 'https://www.jagoanhosting.com/' },
  { id: 'komdigi', name: 'Kementerian Komunikasi dan Digital Republik Indonesia' },
  { id: 'garuda', name: 'Garuda Spark Innovation Hub' },
  { id: 'ngalup', name: 'NGALUP.CO' },
  { id: 'jhic', name: 'Jagoan Hosting Innovation Competition 2026' },
];

const FooterAccent = ({ node }) => (
  <div className="footer-accent" data-figma-node={node}>
    <img src={footerAccentFill} alt="" className="footer-accent-shape" />
  </div>
);

const LinkColumn = ({ title, links, remake = false }) => {
  const { t } = useLanguage();
  return (
  <div className="min-w-0">
    <h3 className={remake ? "text-sm font-bold text-dark-900 lg:text-[clamp(0.875rem,1.0846vw,1.25rem)]" : 'font-heading text-xs font-bold text-dark-900'}>{t(title)}</h3>
    <ul className="mt-3 space-y-2 text-[11px] leading-relaxed">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.href}
            className={`${remake ? 'text-xs lg:text-[clamp(0.75rem,0.8677vw,1rem)]' : 'text-[11px]'} text-dark-500 transition-colors hover:text-primary`}
          >
            {t(link.label)}
          </Link>
        </li>
      ))}
    </ul>
  </div>
  );
};

const Footer = ({ variant = 'default' }) => {
  const { t } = useLanguage();
  const remake = variant === 'prestasi';
  const schoolMap = (
    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(footerData.kontak.mapsQuery ?? footerData.kontak.address)}`} target="_blank" rel="noopener noreferrer" aria-label={t('Buka lokasi SMK Telkom Purwokerto di Google Maps')} className={`${remake ? 'col-span-2 mt-3 lg:col-span-1 lg:mt-0 lg:rounded-[1.6269vw]' : 'mt-3'} block self-start overflow-hidden rounded-xl transition-transform hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}>
      <img src={footerData.map} alt={t('Peta lokasi SMK Telkom Purwokerto')} loading="lazy" className="h-auto w-full border border-dark-100" />
    </a>
  );
  return (
  <footer className={`site-footer bg-white ${remake ? "font-['Plus_Jakarta_Sans']" : ''}`}>
    <div className={`relative overflow-hidden pt-6 lg:pt-8 ${remake ? 'pb-6 lg:min-h-[16.2148vw] lg:pb-8' : ''}`}>
      {/* Accent Element / Group 478: original masks, positions and rotations. */}
      <div aria-hidden="true" className="footer-accent-side footer-accent-side-left pointer-events-none select-none">
        {['125:161', '125:167'].map((node) => <FooterAccent key={node} node={node} />)}
      </div>
      <div aria-hidden="true" className="footer-accent-side footer-accent-side-right pointer-events-none select-none">
        <FooterAccent node="125:164" />
      </div>

      <div className={`footer-content relative z-10 mx-auto px-4 pb-2 sm:px-6 lg:pb-3 ${remake ? 'max-w-[1769px] lg:w-[91.76%] lg:px-0' : 'max-w-7xl lg:px-8'}`}>
        <div className={`grid grid-cols-2 gap-x-6 gap-y-6 lg:gap-x-8 ${remake ? 'lg:grid-cols-[1.3fr_0.5fr_0.6fr_0.85fr_1.03fr]' : 'lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.3fr]'}`}>
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Logo className={remake ? 'h-11 w-11 shrink-0 lg:h-[7.05vw] lg:w-[7.05vw]' : 'h-11 w-11'} />
              <span className={remake ? 'text-base font-extrabold leading-[1.15] text-dark-900 lg:text-[clamp(1rem,1.9523vw,2.25rem)]' : 'font-heading text-base font-extrabold leading-[1.15] text-dark-900'}>
                SMK Telkom
                <br />
                Purwokerto
              </span>
            </div>
            <p className={`mt-3 leading-relaxed text-dark-500 ${remake ? 'max-w-[469px] text-xs lg:text-[clamp(0.75rem,0.8677vw,1rem)]' : 'max-w-xs text-[11px]'}`}>
              {t(footerData.tagline)}
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
                  <Icon className={remake ? 'size-5 lg:size-[1.7896vw]' : 'h-4 w-4'} />
                  </a>
                );
              })}
            </div>

            {/* Lima logo memakai bitmap asli; CSS hanya membatasi area putih tiap logo. */}
            {!remake && <div className="mt-4 max-w-[280px]">
              <h3 className="font-heading text-xs font-bold text-dark-900">Supported by</h3>
              <ul className="footer-supporters mt-3" aria-label={t('Pendukung lomba')}>
                {supporterLogos.map(({ id, name, href }) => {
                  const logo = (
                    <span className={`footer-supporter-logo footer-supporter-logo-${id}`}>
                      <img src={competitionSupporters} alt={t(name)} loading="lazy" decoding="async" width="1920" height="1080" />
                    </span>
                  );
                  return (
                    <li key={id}>
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="footer-supporter-link" aria-label={t('Kunjungi {name}', { name })}>
                          {logo}
                        </a>
                      ) : logo}
                    </li>
                  );
                })}
              </ul>
            </div>}

          </div>

          <div className="min-w-0">
            <LinkColumn title="Menu" links={footerData.menu} remake={remake} />
            {!remake && <div className="mt-6">
              <VisitorCounter />
            </div>}
          </div>
          <LinkColumn title="Informasi" links={footerData.informasi} remake={remake} />

          {/* Kontak */}
          <div className="footer-contact col-span-2 min-w-0 [overflow-wrap:anywhere] lg:col-span-1">
            <h3 className={remake ? 'text-sm font-bold text-dark-900 lg:text-[clamp(0.875rem,1.0846vw,1.25rem)]' : 'font-heading text-xs font-bold text-dark-900'}>{t('Kontak')}</h3>
            <ul className={`mt-3 space-y-2 text-dark-500 ${remake ? 'text-xs lg:text-[clamp(0.75rem,0.8677vw,1rem)]' : 'text-[11px]'}`}>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
                {t(footerData.kontak.address)}
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
            {!remake && schoolMap}
          </div>
          {remake && schoolMap}
        </div>
      </div>

      {/* Both accent canvases share the same bottom edge. */}
      <div aria-hidden="true" className={`footer-accent-band pointer-events-none select-none ${remake ? 'absolute! inset-x-0 bottom-0' : ''}`}>
        <div className="footer-accent-canvas">
          {['125:136', '125:139', '125:142', '125:145', '125:148'].map((node) => <FooterAccent key={node} node={node} />)}
        </div>
      </div>
    </div>
    <div className="footer-bottom-bar relative bg-primary text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 pl-4 pr-24 py-2 text-[10px] sm:flex-row sm:pl-6 lg:pl-8 2xl:pr-8">
        <p>© 2026 SMK Telkom Purwokerto. All Rights Reserved.</p>
        <div className="flex items-center gap-3">
          <Link
            to="/kebijakan-privasi"
            className="underline underline-offset-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {t('Kebijakan Privasi')}
          </Link>
          <span aria-hidden="true" className="h-3 border-l border-white/60" />
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 underline-offset-2 transition-opacity hover:opacity-80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <LockKeyhole className="h-3 w-3" aria-hidden="true" />
            {t('Akses Staf & Admin')}
          </Link>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
