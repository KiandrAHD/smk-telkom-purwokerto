import { supabaseSiap } from './supabase';

// Widget chat TIDAK memanggil Claude langsung. Semua permintaan lewat Edge
// Function `stela`, karena di sanalah API key disimpan — kalau key ditaruh di
// sini, ia ikut terbundel ke browser dan bisa dibaca siapa saja lewat DevTools.
const ALAMAT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stela`;
export const PESAN_STELA_GAGAL = 'STELA sedang mengalami kendala. Silakan coba lagi.';

export const tanyaStela = async (pesan, { signal } = {}) => {
  if (!supabaseSiap) throw new Error(PESAN_STELA_GAGAL);

  try {
    const tanggapan = await fetch(ALAMAT, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        // Anon key memang dirancang untuk publik; ia hanya membuka pintu ke Edge
        // Function, bukan ke API berbayar.
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ messages: pesan }),
    });

    const data = await tanggapan.json().catch(() => ({}));
    if (!tanggapan.ok || typeof data.reply !== 'string' || !data.reply.trim()) {
      throw new Error(PESAN_STELA_GAGAL);
    }
    return data.reply.trim();
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new Error(PESAN_STELA_GAGAL, { cause: error });
  }
};
