import { loadEnv } from 'vite';
import {
  BATAS,
  MODEL_BAWAAN,
  periksaPesan,
  pilihPenyedia,
  tanyaAI,
} from '../supabase/functions/stela/inti.mjs';
import { buatPenjaga } from '../supabase/functions/stela/penjaga-biaya.mjs';

// Menyediakan POST /api/stela selama `npm run dev`, supaya STELA bisa diajak
// bicara tanpa perlu punya proyek Supabase dan tanpa deploy Edge Function.
//
// Kuncinya: berkas ini hanya berjalan di proses Node milik dev server, tidak
// pernah ikut ke bundel browser. Kunci API dibaca di sini dan tidak pernah
// menyeberang ke sisi klien. Karena itu kuncinya TIDAK boleh diberi awalan
// VITE_ -- awalan itu justru membuat Vite menyuntikkannya ke browser.
//
// Di produksi endpoint ini tidak ada; yang dipakai Edge Function Supabase.

// Plafon harian mode lokal sengaja jauh lebih ketat daripada produksi. Sumber
// pemborosan terbesar saat mengembangkan bukan pengunjung, melainkan loop tak
// sengaja -- useEffect keliru, tombol yang tertekan berulang, hot-reload yang
// memicu ulang permintaan.
const MAKS_PER_HARI_DEV = 100;

export const stelaDevPlugin = () => ({
  name: 'stela-dev',
  apply: 'serve',

  configureServer(server) {
    const env = loadEnv(server.config.mode, server.config.envDir ?? process.cwd(), '');
    const baca = (nama) => env[nama] ?? process.env[nama];

    const anthropicKey = baca('ANTHROPIC_API_KEY');
    const geminiKey = baca('GEMINI_API_KEY');
    const penyedia = pilihPenyedia({ anthropicKey, geminiKey });
    const apiKey = penyedia === 'anthropic' ? anthropicKey : geminiKey;
    const model = baca('STELA_MODEL') || (penyedia ? MODEL_BAWAAN[penyedia] : '');

    const penjaga = buatPenjaga({
      aktif: baca('STELA_AKTIF') !== 'false',
      maksPerHari: Number(baca('STELA_MAKS_PER_HARI')) || MAKS_PER_HARI_DEV,
    });

    server.config.logger.info(
      penyedia
        ? `  \x1b[32m➜\x1b[0m  STELA lokal siap di /api/stela (${penyedia}, ${model}, maks ${penjaga.statistik().maksPerHari}/hari)`
        : '  \x1b[33m➜\x1b[0m  STELA nonaktif: isi ANTHROPIC_API_KEY atau GEMINI_API_KEY di frontend/.env',
    );

    server.middlewares.use('/api/stela', async (req, res) => {
      const kirim = (data, status) => {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };

      if (req.method !== 'POST') return kirim({ error: 'Gunakan metode POST.' }, 405);
      if (!penyedia) {
        return kirim(
          {
            error:
              'Kunci AI belum diisi. Isi ANTHROPIC_API_KEY atau GEMINI_API_KEY di frontend/.env, lalu jalankan ulang dev server.',
          },
          503,
        );
      }

      const ditolak = penjaga.periksa('lokal');
      if (ditolak) return kirim({ error: ditolak.galat }, ditolak.status);

      let mentah = '';
      try {
        for await (const bagian of req) {
          mentah += bagian;
          // Tolak badan raksasa sebelum sempat menumpuk di memori.
          if (mentah.length > BATAS.MAKS_TOTAL_PANJANG * 4) {
            return kirim({ error: 'Isi permintaan terlalu besar.' }, 413);
          }
        }
      } catch {
        return kirim({ error: 'Gagal membaca permintaan.' }, 400);
      }

      let badan;
      try {
        badan = JSON.parse(mentah);
      } catch {
        return kirim({ error: 'Isi permintaan tidak valid.' }, 400);
      }

      const { pesan, galat } = periksaPesan(badan?.messages);
      if (!pesan) return kirim({ error: galat }, 400);

      const tersimpan = penjaga.ambilCache(pesan);
      if (tersimpan) {
        server.config.logger.info('  [stela] dijawab dari cache, tanpa panggilan API');
        return kirim({ reply: tersimpan }, 200);
      }

      try {
        penjaga.catatPanggilan();
        const { teks, tokenMasuk, tokenKeluar } = await tanyaAI({
          penyedia,
          apiKey,
          model,
          pesan,
          // Tanpa Supabase di lokal, data dinamis memang tidak ada. STELA tetap
          // menjawab dari data sekolah statis yang sudah lengkap.
          contextPublik:
            'Data dinamis publik tidak tersedia di mode pengembangan lokal. Gunakan data sekolah statis.',
        });
        if (!teks) return kirim({ error: 'STELA tidak memberi jawaban.' }, 502);

        penjaga.simpanCache(pesan, teks);
        const { terpakaiHariIni, maksPerHari } = penjaga.statistik();
        server.config.logger.info(
          `  [stela] ${terpakaiHariIni}/${maksPerHari} hari ini | token masuk ${tokenMasuk}, keluar ${tokenKeluar}`,
        );
        return kirim({ reply: teks }, 200);
      } catch (error) {
        server.config.logger.error(`  [stela] ${error?.message ?? 'kesalahan tidak dikenal'}`);
        return kirim({ error: 'STELA sedang mengalami kendala.' }, error?.status ? 502 : 500);
      }
    });
  },
});

export default stelaDevPlugin;
