import { ArrowRight, Bot, Briefcase, ChevronRight, Monitor, UserPlus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { landingHero, quickLinks } from '../data/dummyData';

const icons = {
  userPlus: UserPlus,
  monitor: Monitor,
  briefcase: Briefcase,
  bot: Bot,
  sparkles: Sparkles,
};

const HeroSection = () => (
  <section className="bg-white pt-4 pb-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-[2rem] border border-dark-100 bg-white p-3 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] xl:grid-cols-[34%_1fr] gap-6 lg:gap-4 items-start">
          {/* Kolom teks */}
          {/* pb-16 menyisakan ruang untuk kartu akses cepat yang menimpa dari bawah —
              lihat catatan yang sama di PrestasiHeroSection. */}
          <div className="px-3 pt-6 lg:pb-16 lg:pl-4 lg:pt-2">
            <nav className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
              {landingHero.breadcrumb.map((item, i) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="w-3 h-3" />}
                  <Link to={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </span>
              ))}
            </nav>
            <p className="mt-1 text-[10px] font-semibold text-primary">
              {landingHero.hashtag}
            </p>

            <h1 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-[1.75rem] xl:text-[1.875rem] font-extrabold leading-[1.2] tracking-tight text-dark-900">
              {landingHero.title}
              <br />
              <span className="text-primary">{landingHero.titleAccent}</span>
            </h1>

            <p className="mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-dark-500">
              {landingHero.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={landingHero.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
              >
                {landingHero.primaryCta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={landingHero.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-dark-200 bg-white px-6 py-3 text-sm font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
              >
                {landingHero.secondaryCta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Panel merah + foto + watermark TELKOM (satu aset dari Figma) */}
          <img
            src={landingHero.image}
            alt="Siswa SMK Telkom Purwokerto"
            className="w-full rounded-[1.75rem] object-contain"
          />
        </div>

        {/* Kartu akses cepat */}
        {/* Overlap ke panel merah hanya di xl, di bawah itu kolom teks terlalu sempit
            (deskripsi jadi 4 baris) sehingga tombol CTA ketutup kartu. */}
        <div className="relative z-10 mx-1 -mt-6 lg:mx-16 lg:mt-5 xl:-mt-7 rounded-2xl border border-dark-100 bg-white shadow-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-dark-100 lg:divide-y-0 lg:divide-x">
            {quickLinks.map((item) => {
              const Icon = icons[item.icon];
              return (
                <div key={item.title} className="flex gap-3 px-5 py-5">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-bold text-dark-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[10px] leading-snug text-dark-500">
                      {item.desc}
                    </p>
                    <Link
                      to={item.href}
                      className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                    >
                      {item.linkLabel}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
