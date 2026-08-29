import { loadEnv } from 'vite';
import { BATAS, MODEL_BAWAAN, periksaPesan, tanyaClaude } from '../supabase/functions/stela/inti.mjs';

// Menyediakan POST /api/stela selama `npm run dev`, supaya STELA bisa diajak
// bicara tanpa perlu punya proyek Supabase dan tanpa deploy Edge Function.
//
// Kuncinya: berkas ini hanya berjalan di proses Node milik dev server, tidak
// pernah ikut ke bundel browser. ANTHROPIC_API_KEY dibaca di sini dan tidak
// pernah menyeberang ke sisi klien. Karena itu kuncinya TIDAK boleh diberi
// awalan VITE_ -- awalan itu justru membuat Vite menyuntikkannya ke browser.
//
// Di produksi endpoint ini tidak ada; yang dipakai Edge Function Supabase.

// Pagar biaya. Dev server bisa saja kena loop tak sengaja (useEffect keliru,
// tombol yang ditekan berkali-kali), dan tiap permintaan memakai token asli
// yang dibayar. Batas per proses ini murah dan menahan tagihan kejut.
const MAKS_PERMINTAAN_PER_SESI = 100;

export const stelaDevPlugin = () => ({
  name: 'stela-dev',
  apply: 'serve',

  configureServer(server) {
    const env = loadEnv(server.config.mode, server.config.envDir ?? process.cwd(), '');
    const apiKey = env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY;
    const model = env.STELA_MODEL || MODEL_BAWAAN;
    let terpakai = 0;

    server.config.logger.info(
      apiKey
        ? `  \x1b[32m➜\x1b[0m  STELA lokal siap di /api/stela (model ${model})`
        : '  \x1b[33m➜\x1b[0m  STELA nonaktif: ANTHROPIC_API_KEY belum diisi di frontend/.env',
    );

    server.middlewares.use('/api/stela', async (req, res) => {
      const kirim = (data, status) => {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };

      if (req.method !== 'POST') return kirim({ error: 'Gunakan metode POST.' }, 405);
      if (!apiKey) {
        return kirim(
          { error: 'ANTHROPIC_API_KEY belum diisi di frontend/.env. Isi lalu jalankan ulang dev server.' },
          503,
        );
      }
      if (terpakai >= MAKS_PERMINTAAN_PER_SESI) {
        return kirim(
          { error: `Batas ${MAKS_PERMINTAAN_PER_SESI} permintaan per sesi dev tercapai. Jalankan ulang dev server.` },
          429,
        );
      }

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

      terpakai += 1;
      try {
        const jawaban = await tanyaClaude({
          apiKey,
          model,
          pesan,
          // Tanpa Supabase di lokal, data dinamis memang tidak ada. STELA tetap
          // menjawab dari data sekolah statis yang sudah lengkap.
          contextPublik:
            'Data dinamis publik tidak tersedia di mode pengembangan lokal. Gunakan data sekolah statis.',
        });
        if (!jawaban) return kirim({ error: 'STELA tidak memberi jawaban.' }, 502);
        return kirim({ reply: jawaban }, 200);
      } catch (error) {
        server.config.logger.error(`[stela] ${error?.message ?? 'kesalahan tidak dikenal'}`);
        return kirim({ error: 'STELA sedang mengalami kendala.' }, error?.status ? 502 : 500);
      }
    });
  },
});

export default stelaDevPlugin;
