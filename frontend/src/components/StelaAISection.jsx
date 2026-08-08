import { ArrowRight } from 'lucide-react';
import stelaCard from '../assets/landing/stela-card.jpg';
import { stelaData } from '../data/dummyData';

// Di Figma seluruh kartu STELA (latar merah, judul, deskripsi, maskot, gelembung chat)
// adalah SATU gambar; hanya tombolnya elemen hidup. Teksnya dipasang sr-only agar tetap
// terbaca screen reader dan mesin pencari.
// ponytail: teks ikut mengecil di layar kecil karena menyatu di gambar — kalau perlu
// terbaca di mobile, section ini harus dibongkar jadi teks HTML.
const StelaAISection = () => (
  <section id="stela" className="bg-white py-6 lg:py-8">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <img
          src={stelaCard}
          alt=""
          aria-hidden="true"
          className="w-full rounded-3xl object-contain"
        />

        <div className="sr-only">
          <h2>{stelaData.title.replace('\n', ' ')}</h2>
          <p>{stelaData.description}</p>
          {stelaData.chats.map((chat) => (
            <p key={chat.from}>{chat.text}</p>
          ))}
        </div>

        {/* sm+ : tombol menimpa kartu sesuai koordinat Figma (x 233/1533, y 372/483).
            mobile: kartu terlalu pendek untuk ditimpa, jadi tombol turun ke bawah gambar. */}
        <a
          href="#stela"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-white shadow-sm transition-colors sm:absolute sm:left-[5.5%] sm:top-[77%] sm:mt-0 sm:bg-white sm:px-5 sm:py-2.5 sm:text-primary sm:hover:bg-primary-50 lg:px-6 lg:py-3"
        >
          {stelaData.ctaText}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  </section>
);

export default StelaAISection;
