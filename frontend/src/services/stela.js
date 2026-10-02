import { supabaseSiap } from './supabase';

// Widget chat tidak memanggil Gemini langsung. Semua permintaan lewat backend,
// karena API key hanya disimpan di server dan tidak pernah masuk ke bundel browser.
//
// Ada dua backend, dan yang dipakai ditentukan otomatis:
//
//   1. Edge Function Supabase — dipakai begitu VITE_SUPABASE_URL terisi.
//      Ini jalur produksi dan menggunakan Gemini.
//   2. /api/stela — endpoint lokal dari vite-plugin-stela.js, hanya hidup
//      selama `npm run dev`. Endpoint lokal ini juga hanya menggunakan Gemini.
const PAKAI_EDGE_FUNCTION = supabaseSiap;
const ALAMAT = PAKAI_EDGE_FUNCTION
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stela`
  : '/api/stela';

// import.meta.env.DEV dilipat saat build, jadi cabang lokal ini hilang total
// dari bundel produksi — bukan sekadar tidak terpanggil.
export const stelaSiap = PAKAI_EDGE_FUNCTION || import.meta.env.DEV;

export const PESAN_STELA_GAGAL = 'STELA sedang mengalami kendala. Silakan coba lagi.';
export const PESAN_STELA_BELUM_SIAP =
  'STELA belum dikonfigurasi. Isi GEMINI_API_KEY di frontend/.env untuk mode lokal, atau VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY untuk memakai Edge Function.';

export const tanyaStela = async (pesan, { signal } = {}) => {
  if (!stelaSiap) throw new Error(PESAN_STELA_BELUM_SIAP);

  try {
    const tanggapan = await fetch(ALAMAT, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        // Anon key memang dirancang untuk publik; ia hanya membuka pintu ke Edge
        // Function, bukan ke API berbayar. Endpoint lokal tidak memerlukannya.
        ...(PAKAI_EDGE_FUNCTION
          ? { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` }
          : {}),
      },
      body: JSON.stringify({ messages: pesan }),
    });

    const data = await tanggapan.json().catch(() => ({}));

    if (!tanggapan.ok) {
      // Pesan dari server ditulis sendiri oleh tim dan sudah aman ditampilkan.
      // Melewatkannya jauh lebih menolong daripada "kendala" generik, terutama
      // saat yang kurang cuma satu baris di .env.
      throw new Error(typeof data.error === 'string' && data.error ? data.error : PESAN_STELA_GAGAL);
    }
    if (typeof data.reply !== 'string' || !data.reply.trim()) {
      throw new Error(PESAN_STELA_GAGAL);
    }
    return data.reply.trim();
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new Error(error?.message || PESAN_STELA_GAGAL, { cause: error });
  }
};
