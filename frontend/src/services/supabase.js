import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isBrowserSafeKey = (key) => Boolean(key) && !/^sb_secret_|^service_role/i.test(key);

export const supabaseSiap = Boolean(supabaseUrl && isBrowserSafeKey(supabaseAnonKey));

export const PESAN_SUPABASE_BELUM_SIAP =
  'Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di frontend/.env, lalu jalankan ulang dev server.';

if (!supabaseSiap) {
  console.warn(PESAN_SUPABASE_BELUM_SIAP);
}

export const ensureSupabase = () => {
  if (!supabase) throw new Error(PESAN_SUPABASE_BELUM_SIAP);
  return supabase;
};

export const supabase = supabaseSiap
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
