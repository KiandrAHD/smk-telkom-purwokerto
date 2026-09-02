import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroStatsBar from '../HeroStatsBar';
import { pengumumanHero, pengumumanStats } from '../../data/dummyData';

// Hero ini dulu terasa datar dibanding halaman lain karena tiga hal yang
// dipunyai Jurusan/Prestasi/BKK tapi tidak ada di sini: chip penanda di atas
// judul, garis tepi bernuansa merah, dan bilah statistik yang mengunci bagian
// bawah panel. Ketiganya sekarang disamakan.
const PengumumanHeroSection = () => (
  <section className="bg-white pt-4 pb-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-primary/30 bg-white p-3 sm:p-4">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[38%_1fr] lg:gap-4">
          {/* pb-16 menyisakan ruang untuk kartu statistik yang menimpa dari bawah —
              lihat catatan yang sama di PrestasiHeroSection. */}
          <div className="px-3 pt-6 lg:pb-16 lg:pl-4 lg:pt-4">
            {/* Breadcrumb dihapus: satu-satunya tautannya menuju Beranda,
                yang sudah tersedia di navbar. Halaman detail tetap memakai
                breadcrumb sendiri lewat DetailLayout karena letaknya lebih dalam. */}
            <span className="inline-block rounded-md bg-primary-50 px-2.5 py-1 text-[10px] font-bold text-primary">
              {pengumumanHero.badge}
            </span>

            <h1 className="mt-4 whitespace-pre-line font-heading text-3xl sm:text-4xl lg:text-[1.75rem] xl:text-[2rem] font-extrabold leading-[1.2] tracking-tight text-dark-900">
              {pengumumanHero.heading}
              {'\n'}
              <span className="text-primary">{pengumumanHero.headingAccent}</span>
            </h1>

            <p className="mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-dark-500">
              {pengumumanHero.description}
            </p>

            <Link
              to="/ppdb"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
            >
              {pengumumanHero.ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Ilustrasi megafon + ponsel di atas sapuan merah (satu aset dari Figma) */}
          <img
            src={pengumumanHero.image}
            alt="Pengumuman SMK Telkom Purwokerto"
            className="w-full rounded-[1.75rem] object-contain"
          />
        </div>

        <HeroStatsBar items={pengumumanStats} />
      </div>
    </div>
  </section>
);

export default PengumumanHeroSection;
