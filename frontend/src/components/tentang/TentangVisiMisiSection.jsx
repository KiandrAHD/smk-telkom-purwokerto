import { Cpu, Handshake, Lightbulb, ShieldCheck, Target, Telescope } from 'lucide-react';
import { nilaiStematel, visiMisi } from '../../data/dummyData';

const nilaiIcons = { lightbulb: Lightbulb, shield: ShieldCheck, cpu: Cpu, handshake: Handshake };

const Card = ({ Icon, title, desc, className = '' }) => (
  <div
    className={`group rounded-2xl border border-dark-100 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 ${className}`}
  >
    <Icon className="h-8 w-8 text-primary" strokeWidth={2.2} />
    <h3 className="mt-4 font-heading text-sm font-bold text-dark-900">{title}</h3>
    <p className="mt-2 text-[11px] leading-relaxed text-dark-500">{desc}</p>
  </div>
);

const TentangVisiMisiSection = () => (
  <section className="bg-white py-6 lg:py-8">
    <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
      {/* Visi & Misi */}
      <div>
        <h2 className="font-heading text-xl font-extrabold text-primary">Visi &amp; Misi</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card Icon={Target} title="Visi" desc={visiMisi.visi} />
          <Card Icon={Telescope} title="Misi" desc={visiMisi.misi} />
        </div>
      </div>

      {/* Nilai-Nilai Stematel */}
      <div>
        <h2 className="font-heading text-xl font-extrabold text-primary">Nilai-Nilai Stematel</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {nilaiStematel.map((nilai) => (
            <Card
              key={nilai.title}
              Icon={nilaiIcons[nilai.icon]}
              title={nilai.title}
              desc={nilai.desc}
            />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default TentangVisiMisiSection;
