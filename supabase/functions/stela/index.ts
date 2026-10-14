// STELA - Stematel Learning Asistant.
// Edge Function ini menjadi satu-satunya perantara antara browser dan penyedia
// AI di produksi. Kunci API hanya hidup di sini; browser tidak pernah melihatnya.
//
// Prompt, validasi pesan, dan pemanggilan AI ada di ./inti.mjs karena dipakai
// juga oleh server pengembangan lokal (frontend/vite-plugin-stela.js).
// Pagar biayanya ada di ./penjaga-biaya.mjs.

import {
  BATAS,
  buatBatasPanggilan,
  amankanJawaban,
  deteksiBahasa,
  periksaPesan,
  topikDiizinkan,
  buatPesanPenolakan,
  tanyaAI,
  MODEL_BAWAAN,
  MODEL_CADANGAN,
  POLA_KUNCI,
  kategoriPertanyaan,
} from './inti.mjs';
import { buatPenjaga } from './penjaga-biaya.mjs';
import { buatReservasiKuota } from '../ai-quota.mjs';

const KUNCI: Record<string, string | undefined> = {
  ninerouter: Deno.env.get('NINEROUTER_KEY'),
  anthropic: Deno.env.get('ANTHROPIC_API_KEY'),
  gemini: Deno.env.get('GEMINI_API_KEY'),
  groq: Deno.env.get('GROQ_API_KEY'),
};
const MODEL_ENV: Record<string, string | undefined> = {
  ninerouter: Deno.env.get('STELA_NINEROUTER_MODEL') || Deno.env.get('NINEROUTER_MODEL'),
  anthropic: Deno.env.get('STELA_ANTHROPIC_MODEL'),
  gemini: Deno.env.get('STELA_GEMINI_MODEL'),
  groq: Deno.env.get('STELA_GROQ_MODEL'),
};
const BASE_URL = Deno.env.get('STELA_NINEROUTER_URL') || Deno.env.get('NINEROUTER_URL');
const STELA_CANDIDATES = ['ninerouter', 'anthropic', 'gemini', 'groq']
  .filter((penyedia) => {
    const key = KUNCI[penyedia];
    const pola = POLA_KUNCI[penyedia as keyof typeof POLA_KUNCI];
    if (penyedia === 'ninerouter' && (!BASE_URL || !/^https:\/\//i.test(BASE_URL))) return false;
    return typeof key === 'string' && key.trim().length > 0 && Boolean(pola?.test(key));
  })
  .map((penyedia) => ({
    penyedia,
    apiKey: KUNCI[penyedia]!,
    model: MODEL_ENV[penyedia] || MODEL_BAWAAN[penyedia as keyof typeof MODEL_BAWAAN],
    ...(penyedia === 'ninerouter' ? { baseUrl: BASE_URL } : {}),
  }));

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const reservasiKuota = buatReservasiKuota({
  url: SUPABASE_URL, serviceKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), fitur: 'stela',
  maksPerHari: Number(Deno.env.get('STELA_MAKS_PER_HARI')) || 500,
});
const ALLOWED_ORIGINS = (Deno.env.get('STELA_ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const MAKS_ROW_PER_TABEL = 25;
const MAKS_PANJANG_FIELD = 1200;
const penjaga = buatPenjaga({
  // Sakelar mati darurat. Setel `supabase secrets set STELA_AKTIF=false` untuk
  // membungkam STELA seketika tanpa deploy ulang -- berguna kalau tagihan
  // melonjak atau ada penyalahgunaan.
  aktif: Deno.env.get('STELA_AKTIF') !== 'false',
  maksPerHari: Number(Deno.env.get('STELA_MAKS_PER_HARI')) || 500,
  maksPerIp: Number(Deno.env.get('STELA_MAKS_PER_IP')) || 20,
});

const originDiizinkan = (origin: string | null) => {
  if (ALLOWED_ORIGINS.includes('*')) return true;
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
};

const headersCors = (origin: string | null) => ({
  'Access-Control-Allow-Origin': originDiizinkan(origin) && origin ? origin : ALLOWED_ORIGINS.includes('*') ? '*' : 'null',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  Vary: 'Origin',
});

const balas = (data: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...headersCors(origin), 'Content-Type': 'application/json' },
  });

const teksRingkas = (value: unknown) => String(value ?? '').trim().slice(0, MAKS_PANJANG_FIELD);

const ambilTabelPublik = async (table: string, columns: string, filter: string) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(columns)}&${filter}&limit=${MAKS_ROW_PER_TABEL}`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(2000),
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!response.ok) throw new Error(`Context ${table} gagal dimuat`);
  const rows = await response.json();
  return Array.isArray(rows) ? rows : [];
};

const barisContext = (label: string, rows: Record<string, unknown>[]) => {
  if (rows.length === 0) return `## ${label}\nTidak ada data publik.`;
  return `## ${label}\n${rows.map((row) => Object.entries(row)
    .map(([key, value]) => `${key}: ${teksRingkas(value)}`)
    .join(' | ')).join('\n')}`;
};

const ambilContextPublik = async (pertanyaan: string) => {
  const kategori = kategoriPertanyaan(pertanyaan);
  const tabel = kategori === 'bkk' ? ['bkk']
    : kategori === 'prestasi' ? ['prestasi']
      : kategori === 'berita' ? ['berita']
        : kategori === 'pengumuman' || kategori === 'ppdb' ? ['pengumuman']
          : kategori === 'umum' || kategori === 'sekolah' ? ['berita', 'pengumuman']
            : [];
  if (tabel.length === 0) return 'Tidak ada data dinamis yang relevan. Gunakan data sekolah terverifikasi.';
  const hasil = await Promise.all(tabel.map((nama) => {
    if (nama === 'bkk') return ambilTabelPublik('bkk', 'perusahaan,posisi,deskripsi,lokasi,tipe_pekerjaan,deadline,status', 'status=eq.aktif&order=deadline.asc');
    if (nama === 'prestasi') return ambilTabelPublik('prestasi', 'judul,kategori,deskripsi,tingkat,tanggal', 'order=tanggal.desc');
    if (nama === 'berita') return ambilTabelPublik('berita', 'judul,ringkasan,created_at', 'status=eq.published&order=created_at.desc');
    return ambilTabelPublik('pengumuman', 'judul,ringkasan,tanggal', 'status=eq.published&order=tanggal.desc');
  }));
  return ['## DATA DINAMIS PUBLIK RELEVAN (REFERENSI SAJA)', ...hasil.map((rows, i) => barisContext(tabel[i], rows))].join('\n\n');
};

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  if (!originDiizinkan(origin)) return balas({ error: 'Origin tidak diizinkan.' }, 403, origin);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: headersCors(origin) });
  if (req.method !== 'POST') return balas({ error: 'Gunakan metode POST.' }, 405, origin);
  if (STELA_CANDIDATES.length === 0) {
    console.error('STELA tidak memiliki provider yang terkonfigurasi');
    return balas({ error: 'STELA belum dikonfigurasi. Silakan hubungi administrator.', code: 'config' }, 503, origin);
  }

  // Gunakan header yang diisi platform edge; jangan percaya x-forwarded-for
  // yang dapat dikirim langsung oleh klien.
  const ip = req.headers.get('cf-connecting-ip')?.trim() || req.headers.get('x-real-ip')?.trim() || 'tanpa-ip';
  const ditolak = penjaga.periksa(ip);
  if (ditolak) return balas({ error: ditolak.galat }, ditolak.status, origin);

  // Tolak badan raksasa lewat header, sebelum membacanya sama sekali.
  const panjang = Number(req.headers.get('content-length') ?? 0);
  if (panjang > BATAS.MAKS_TOTAL_PANJANG * 4) {
    return balas({ error: 'Isi permintaan terlalu besar.' }, 413, origin);
  }

  let badan: unknown;
  try {
    badan = await req.json();
  } catch {
    return balas({ error: 'Isi permintaan tidak valid.' }, 400, origin);
  }

  const hasilValidasi = periksaPesan((badan as Record<string, unknown>)?.messages);
  if (!hasilValidasi.pesan) return balas({ error: hasilValidasi.galat }, 400, origin);
  const requestedLanguage = (badan as Record<string, unknown>)?.language;
  if (requestedLanguage !== undefined && requestedLanguage !== 'en' && requestedLanguage !== 'id') return balas({ error: 'Unsupported language.' }, 400, origin);

  // Pertanyaan pembuka yang sama tidak dibeli dua kali. Di situs sekolah ini
  // lapisan yang paling banyak menghemat: satu jawaban tersimpan bisa melayani
  // puluhan pengunjung yang menanyakan hal serupa.
  const latestUserMessage = [...hasilValidasi.pesan].reverse().find((message) => message.role === 'user');
  const bahasa = requestedLanguage ?? deteksiBahasa(latestUserMessage?.content ?? '');

  // Server-side scope enforcement: tolak pertanyaan di luar scope sebelum pemanggilan provider AI
  // dan sebelum penggunaan kuota provider.
  if (!topikDiizinkan(hasilValidasi.pesan)) {
    return balas({ reply: buatPesanPenolakan(bahasa), scope_rejected: true }, 200, origin);
  }

  const tersimpan = penjaga.ambilCache(hasilValidasi.pesan, bahasa);
  if (tersimpan) return balas({ reply: tersimpan }, 200, origin);

  const requestId = crypto.randomUUID();
  const mulai = Date.now();
  try {
    const batasPanggilan = buatBatasPanggilan();
    let contextPublik = 'Data dinamis publik belum tersedia. Gunakan data sekolah statis jika relevan.';
    try {
      contextPublik = await ambilContextPublik(latestUserMessage?.content ?? '');
    } catch (error) {
      console.error('Context Supabase gagal dimuat', error instanceof Error ? error.message : 'unknown');
    }

    const reservasiSetiapPanggilan = async ({ signal }: { signal: AbortSignal }) => {
      await reservasiKuota({ signal });
    };
    const { teks: teksProvider, tokenMasuk, tokenKeluar, modelDipakai } = await tanyaAI({
      daftarPenyedia: STELA_CANDIDATES,
      pesan: hasilValidasi.pesan,
      contextPublik,
      bahasa,
      sebelumPanggilan: reservasiSetiapPanggilan,
      batasPanggilan,
      signal: req.signal,
      cobaModelCadangan: true,
      catatPercobaan: (event) => console.log(JSON.stringify({ event: 'stela_provider_attempt', requestId, ...event })),
    });

    if (!teksProvider) return balas({ error: 'STELA sedang tidak tersedia.' }, 502, origin);
    const teks = amankanJawaban(teksProvider, bahasa);

    penjaga.simpanCache(hasilValidasi.pesan, teks, bahasa);
    console.log(JSON.stringify({
      event: 'stela_request', requestId, provider: modelDipakai === 'fast-sapaan' || modelDipakai === 'faq' ? 'local' : 'remote',
      model: modelDipakai, durationMs: Date.now() - mulai, attempts: batasPanggilan.percobaan, result: 'success',
      tokenIn: tokenMasuk, tokenOut: tokenKeluar,
    }));
    return balas({ reply: teks }, 200, origin);
  } catch (error) {
    const statusError = (error as { status?: number })?.status;
    console.error(JSON.stringify({
      event: 'stela_request', requestId, durationMs: Date.now() - mulai, attempts: 'unknown',
      status: statusError ?? 0, errorType: statusError === 429 ? 'rate_limit' : statusError === 504 ? 'timeout' : 'provider_failed',
      result: 'failed',
    }));
    // Hanya pesan yang memang ditulis untuk pengunjung yang diteruskan.
    // Sebelumnya semua galat 429 diteruskan mentah, sehingga pengunjung sempat
    // melihat "Gemini menolak dengan status 429" di gelembung chat.
    const ditandai = error as { untukPengguna?: boolean; status?: number; code?: string };
    if (ditandai?.untukPengguna) {
      const status = ditandai.status ?? 503;
      const code = ditandai.code ?? (status === 429 ? 'quota_exhausted' : 'quota_unavailable');
      return balas({ error: (error as Error).message, code }, status, origin);
    }
    const status = (error as { status?: number })?.status === 504 ? 504 : 502;
    const code = status === 504 ? 'provider_timeout' : 'provider_failed';
    return balas({ error: status === 504 ? 'STELA sedang membutuhkan waktu lebih lama. Silakan coba lagi.' : 'STELA sedang mengalami kendala koneksi. Silakan coba lagi.', code }, status, origin);
  }
});

// BATAS diekspor ulang supaya pengujian dan dokumentasi punya satu sumber angka.
export { BATAS };
