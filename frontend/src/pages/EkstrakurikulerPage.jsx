import { ArrowRight, Code2, Dumbbell, HeartHandshake, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HalamanHeader from '../components/HalamanHeader';
import Reveal from '../components/Reveal';
import CTASection from '../components/CTASection';
import { ekstrakurikulerData } from '../data/dummyData';

const IKON = { Teknologi: Code2, Olahraga: Dumbbell, Seni: Palette, Karakter: HeartHandshake };

const EkstrakurikulerPage = () => (
  <MainLayout>
    <HalamanHeader {...ekstrakurikulerData} />
    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ekstrakurikulerData.items.map((item, index) => {
          const Icon = IKON[item.category] || HeartHandshake;
          return (
            <Reveal key={item.title} className={`delay-${Math.min(index, 3) * 100}`}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card transition-transform duration-300 hover:-translate-y-1">
                <div className="relative overflow-hidden">
                  <img src={item.image} alt={item.title} loading="lazy" className="aspect-[4/3] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold text-white"><Icon className="h-3.5 w-3.5" />{item.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-heading text-base font-extrabold leading-snug text-dark-900">{item.title}</h2>
                  <p className="mt-2 text-xs leading-relaxed text-dark-500">{item.description}</p>
                  <Link to="/berita" className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[11px] font-bold text-primary hover:underline">Lihat kegiatan <ArrowRight className="h-3.5 w-3.5" /></Link>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
    <CTASection />
  </MainLayout>
);

export default EkstrakurikulerPage;
