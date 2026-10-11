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

export const KATEGORI_GALAT = {
  SCOPE: 'scope',        // Pertanyaan di luar scope (rejection oleh model)
  SECURITY: 'security',  // Prompt injection detected
  RATE_LIMIT: 'rate-limit', // Rate limit/quota exceeded
  TRANSIENT: 'transient',    // Backpressure, timeout, network issues
  CONFIG: 'config',      // Configuration issues
  UNKNOWN: 'unknown',    // Generic failure
};

// Detect error category from backend message for better UX
export const kategorikanGalat = (pesan) => {
  if (!pesan) return KATEGORI_GALAT.UNKNOWN;
  const p = pesan.toLowerCase();

  // Scope/rejection messages from backend
  if (
    p.includes('fokus membantu') ||
    p.includes('tidak bisa saya jawab') ||
    p.includes('cannot answer') ||
    p.includes('maaf, saya stela') ||
    p.includes('pertanyaan itu tidak bisa saya jawab') ||
    p.includes('lingkup ini') ||
    p.includes('outside this scope')
  ) return KATEGORI_GALAT.SCOPE;

  // Rate limiting/backpressure from backend (checked BEFORE length validation)
  if (
    p.includes('batas percakapan') ||
    p.includes('batas') && (p.includes('hari ini') || p.includes('besok')) ||
    p.includes('limit') ||
    p.includes('kuota') ||
    p.includes('ramai') ||
    p.includes('tunggu')
  ) return KATEGORI_GALAT.RATE_LIMIT;

  // Length/format validation errors (NOT scope rejection)
  if (
    p.includes('terlalu panjang') ||
    p.includes('terlalu besar') ||
    p.includes('too long') ||
    p.includes('too large') ||
    p.includes('format') && p.includes('tidak valid') ||
    p.includes('invalid format')
  ) return KATEGORI_GALAT.SECURITY;

  // Generic security/validation errors
  if (
    p.includes('valid') ||
    p.includes('scope') ||
    p.includes('safety')
  ) return KATEGORI_GALAT.SECURITY;

  return KATEGORI_GALAT.TRANSIENT;
};

export const tanyaStela = async (pesan, { signal, language = 'id' } = {}) => {
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
      body: JSON.stringify({ messages: pesan, language }),
    });

    const data = await tanggapan.json().catch(() => ({}));

    if (!tanggapan.ok) {
      // Pesan dari server ditulis sendiri oleh tim dan sudah aman ditampilkan.
      // Melewatkannya jauh lebih menolong daripada "kendala" generik, terutama
      // saat yang kurang cuma satu baris di .env.
      throw new Error(typeof data.error === 'string' && data.error ? data.error : PESAN_STELA_GAGAL);
    }

    // Server mengirim scope_rejected=true saat pertanyaan di luar scope
    if (data.scope_rejected === true && typeof data.reply === 'string') {
      const scopeError = new Error(data.reply);
      scopeError.category = KATEGORI_GALAT.SCOPE;
      throw scopeError;
    }

    if (typeof data.reply !== 'string' || !data.reply.trim()) {
      throw new Error(PESAN_STELA_GAGAL);
    }
    return data.reply.trim();
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    // Preserve category if already set
    if (error?.category) throw error;
    throw new Error(error?.message || PESAN_STELA_GAGAL, { cause: error });
  }
};
