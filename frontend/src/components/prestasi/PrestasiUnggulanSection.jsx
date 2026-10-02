import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { prestasiUnggulan } from '../../data/dummyData';

const PrestasiUnggulanSection = ({ items = [] }) => {
  const { t } = useLanguage();

  const [active, setActive] = useState(0);
  // Maksimal tiga item total; seluruh prestasi tetap tersedia di galeri.
  const sourceItems = items.slice(0, 3);
  const selected = active % sourceItems.length;
  const featured = sourceItems[selected];
  const others = sourceItems
    .map((item, i) => ({ item, i }))
    .filter(({ i }) => i !== selected);

  if (!featured) return null;

  return (
    <section className="bg-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-dark-900">
          {t(prestasiUnggulan.title)}
        </h2>

        <div className="mt-7 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_38%]">
          {/* Prestasi terpilih */}
          <div className="lg:pr-8">
            <span className="inline-block rounded bg-primary-50 px-2.5 py-1 text-[9px] font-bold text-primary">
              {featured.level}
            </span>
            <h3 className="mt-3 max-w-xl font-heading text-xl sm:text-2xl font-extrabold leading-snug text-dark-900">
              {featured.title}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-dark-600">
              {featured.lead || featured.desc}
            </p>
            <Link
              to={`/prestasi/${featured.slug}`}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-primary"
            >
              {t(prestasiUnggulan.ctaText)}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Daftar prestasi lain — klik untuk menukar yang tampil di kiri */}
          <div className="space-y-3">
            {others.map(({ item, i }) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActive(i)}
                className="block w-full rounded-xl border border-dark-100 bg-white px-4 py-3 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-primary"
              >
                <span className="inline-block rounded bg-primary-50 px-2 py-0.5 text-[8px] font-bold text-primary">
                  {item.level}
                </span>
                <p className="mt-1.5 font-heading text-sm font-bold leading-relaxed text-dark-900">
                  {item.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrestasiUnggulanSection;
