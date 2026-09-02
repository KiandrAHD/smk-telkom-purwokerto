import MainLayout from '../layouts/MainLayout';
import StelaChat from '../components/stela/StelaChat';
import maskot from '../assets/pengumuman/stela-bot.png';
import { stelaData } from '../data/dummyData';

// Halaman penuh untuk STELA. Tombol "Tanya STELA Sekarang" di beranda sudah
// mengarah ke /stela sejak awal — sebelumnya mendarat di Segera Hadir.
const StelaPage = () => (
  <MainLayout>
    <section className="bg-white py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <img src={maskot} alt="" aria-hidden="true" className="h-16 w-16 object-contain" />
          <div>
            {/* STELA dan NextTel dipanggil dari kartu yang sama di beranda, tapi
                halaman ini dulu tampil tanpa label dan dengan judul lebih kecil
                dari halaman mana pun -- terbaca setengah jadi di sebelah NextTel.
                Label dan ukuran judulnya kini mengikuti halaman lain. */}
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">STELA AI</p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold leading-tight text-dark-900 sm:text-4xl">
              {stelaData.title.replace('\n', ' ')}
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-dark-500 sm:text-sm">
              {stelaData.description}
            </p>
          </div>
        </div>

        <StelaChat className="mt-7 h-[32rem] shadow-card" />

        <p className="mt-4 text-[11px] leading-relaxed text-dark-400">
          STELA menjawab berdasarkan informasi yang ada di situs ini. Untuk hal yang
          memerlukan kepastian — biaya, kuota, atau berkas pendaftaran — mohon
          konfirmasi ke Tata Usaha sekolah.
        </p>
      </div>
    </section>
  </MainLayout>
);

export default StelaPage;
