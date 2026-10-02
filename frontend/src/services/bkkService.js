import { ensureSupabase } from './supabase';
import { saveWithContentImage } from './contentImageService';

const bkkColumns = 'id, perusahaan, posisi, deskripsi, lokasi, tipe_pekerjaan, deadline, status, link_pendaftaran, logo_url, created_at, updated_at';

const throwIfError = ({ data, error }) => {
  if (error) throw error;
  return data;
};

export async function getBkk() {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase
      .from('bkk')
      .select(bkkColumns)
      .order('deadline', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false }),
  );
}

export async function getActiveBkk() {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase
      .from('bkk')
      .select(bkkColumns)
      .eq('status', 'aktif')
      .order('deadline', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false }),
  );
}

export async function createBkk(data) {
  const supabase = ensureSupabase();
  return saveWithContentImage(supabase, data, 'bkk', 'logo_url', async (payload) =>
    throwIfError(await supabase.from('bkk').insert(payload).select(bkkColumns).single()));
}

export async function updateBkk(id, data) {
  const supabase = ensureSupabase();
  return saveWithContentImage(supabase, data, 'bkk', 'logo_url', async (payload) =>
    throwIfError(await supabase.from('bkk').update(payload).eq('id', id).select(bkkColumns).single()));
}

export async function deleteBkk(id) {
  const supabase = ensureSupabase();
  return throwIfError(await supabase.from('bkk').delete().eq('id', id));
}
