import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Halaman publik (Beranda, Jurusan, Prestasi, BKK, Berita, Pengumuman) tidak
// memakai Supabase sama sekali. Karena itu modul ini TIDAK BOLEH melempar saat
// diimpor: createClient() dipanggil di badan modul, jadi sekali ia melempar,
// createRoot().render() di main.jsx tidak pernah jalan dan seluruh situs jadi
// layar putih — bukan cuma bagian adminnya.
export const supabaseSiap = Boolean(supabaseUrl && supabaseAnonKey);

export const PESAN_SUPABASE_BELUM_SIAP =
  'Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di frontend/.env, lalu jalankan ulang dev server.';

if (!supabaseSiap) {
  console.warn(PESAN_SUPABASE_BELUM_SIAP);
}

export const supabase = supabaseSiap
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
