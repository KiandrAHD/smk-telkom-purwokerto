import { supabase } from './supabase';

const bkkColumns = 'id, perusahaan, posisi, deskripsi, lokasi, tipe_pekerjaan, deadline, status, link_pendaftaran, logo_url, created_at, updated_at';

const throwIfError = ({ data, error }) => {
  if (error) throw error;
  return data;
};

export async function getBkk() {
  return throwIfError(
    await supabase
      .from('bkk')
      .select(bkkColumns)
      .order('deadline', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false }),
  );
}

export async function getActiveBkk() {
  return throwIfError(
    await supabase
      .from('bkk')
      .select(bkkColumns)
      .eq('status', 'aktif')
      .order('deadline', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false }),
  );
}

export async function getBkkById(id) {
  return throwIfError(await supabase.from('bkk').select(bkkColumns).eq('id', id).single());
}

export async function createBkk(data) {
  return throwIfError(await supabase.from('bkk').insert(data).select(bkkColumns).single());
}

export async function updateBkk(id, data) {
  return throwIfError(await supabase.from('bkk').update(data).eq('id', id).select(bkkColumns).single());
}

export async function deleteBkk(id) {
  return throwIfError(await supabase.from('bkk').delete().eq('id', id));
}
