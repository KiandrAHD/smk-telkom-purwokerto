import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroData } from '../../data/dummyData';

const TentangHeroSection = () => (
  <section className="bg-white pt-4 pb-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-dark-100 bg-white p-3 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[38%_1fr] items-start gap-6 lg:gap-4">
          {/* Kolom teks */}
          <div className="px-3 pt-6 lg:pl-4 lg:pt-6">
            <nav className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
              {heroData.breadcrumb.map((item, i) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="h-3 w-3" />}
                  <Link to={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </span>
              ))}
            </nav>

            <h1 className="mt-5 whitespace-pre-line font-heading text-3xl sm:text-4xl lg:text-[1.75rem] xl:text-[2rem] font-extrabold leading-[1.2] tracking-tight text-dark-900">
              {heroData.heading}
              {'\n'}
              <span className="text-primary">{heroData.headingAccent}</span>
            </h1>

            <p className="mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-dark-500">
              {heroData.description}
            </p>

            <a
              href="#profil"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
            >
              {heroData.ctaText}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Panel merah + gedung + poin keunggulan (satu aset dari Figma) */}
          <img
            src={heroData.image}
            alt="Gedung SMK Telkom Purwokerto"
            className="w-full rounded-[1.75rem] object-contain"
          />
        </div>
      </div>
    </div>
  </section>
);

export default TentangHeroSection;
