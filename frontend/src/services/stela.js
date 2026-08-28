import { PESAN_SUPABASE_BELUM_SIAP, supabaseSiap } from './supabase';

// Widget chat TIDAK memanggil Claude langsung. Semua permintaan lewat Edge
// Function `stela`, karena di sanalah API key disimpan — kalau key ditaruh di
// sini, ia ikut terbundel ke browser dan bisa dibaca siapa saja lewat DevTools.
const ALAMAT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stela`;

export const tanyaStela = async (pesan, { signal } = {}) => {
  if (!supabaseSiap) throw new Error(PESAN_SUPABASE_BELUM_SIAP);

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
  if (!tanggapan.ok) {
    throw new Error(data.error || 'STELA sedang tidak bisa dihubungi. Coba lagi sebentar lagi.');
  }
  return data.reply;
};
