import { useEffect } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useLanguage } from '../context/LanguageContext';
import { applyPageMetadata } from '../utils/seo';

export default function SinergiPage({ title = 'Sinergi', category = 'Karier', backHref = '/bkk', backLabel = 'Lihat BKK' }) {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const description = t('{name} sedang kami siapkan. Nantikan informasi selengkapnya di halaman ini.', { name: title });
  const status = t('Segera Hadir');
  useEffect(() => {
    applyPageMetadata({ pathname, title: `${title} — ${status} | SMK Telkom Purwokerto`, description, indexable: false });
  }, [description, status, pathname, title]);

  return (
    <MainLayout showSupportSections={false} showMarquees={false}>
      <section className="grid min-h-[60svh] place-items-center px-6 py-16 sm:py-24" aria-labelledby="sinergi-title">
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-primary-50 text-primary" aria-hidden="true">
            <LoaderCircle className="size-9 motion-safe:animate-spin" />
          </span>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t(category)}</p>
          <h1 id="sinergi-title" className="mt-3 font-heading text-4xl font-bold text-dark-900 sm:text-5xl">{title}</h1>
          <p className="mt-4 text-lg font-semibold text-dark-800">{status}</p>
          <p className="mt-3 text-sm leading-7 text-dark-500">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {backHref && <Link to={backHref} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              {t(backLabel)}<ArrowRight className="size-4" aria-hidden="true" />
            </Link>}
            <Link to="/" className="inline-flex min-h-11 items-center rounded-full border border-dark-200 px-6 py-3 text-sm font-semibold text-dark-700 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{t('Kembali ke Beranda')}</Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
