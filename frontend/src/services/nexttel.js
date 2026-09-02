import { supabaseSiap } from './supabase';

export const PESAN_NEXTTEL_GAGAL = 'NextTel sedang mengalami kendala. Silakan coba lagi.';

// Dua backend, sama seperti STELA: Edge Function saat Supabase terkonfigurasi,
// endpoint lokal /api/nexttel saat `npm run dev`. Sebelumnya NextTel hanya
// punya jalur Edge Function, sehingga tidak bisa dicoba sama sekali tanpa
// deploy Supabase lebih dulu.
const PAKAI_EDGE_FUNCTION = supabaseSiap;
const alamatNextTel = PAKAI_EDGE_FUNCTION
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nexttel`
  : '/api/nexttel';

// import.meta.env.DEV dilipat saat build, jadi cabang lokal hilang dari bundel
// produksi -- bukan sekadar tidak terpanggil.
export const nextTelSiap = PAKAI_EDGE_FUNCTION || import.meta.env.DEV;

export async function jelaskanRekomendasiNextTel(payload, { signal } = {}) {
  if (!nextTelSiap) throw new Error(PESAN_NEXTTEL_GAGAL);

  try {
    const response = await fetch(alamatNextTel, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        ...(PAKAI_EDGE_FUNCTION
          ? { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` }
          : {}),
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || typeof data.explanation !== 'string') throw new Error(PESAN_NEXTTEL_GAGAL);
    return {
      explanation: data.explanation.trim(),
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      learningSuggestions: Array.isArray(data.learningSuggestions) ? data.learningSuggestions : [],
    };
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new Error(PESAN_NEXTTEL_GAGAL, { cause: error });
  }
}
