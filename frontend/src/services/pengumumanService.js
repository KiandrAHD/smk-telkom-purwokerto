import { supabase } from './supabase';

const pengumumanColumns = 'id, judul, slug, ringkasan, konten, gambar_url, status, tanggal, created_at, updated_at';

const throwIfError = ({ data, error }) => {
  if (error) throw error;
  return data;
};

export async function getPengumuman() {
  return throwIfError(
    await supabase.from('pengumuman').select(pengumumanColumns).order('created_at', { ascending: false }),
  );
}

export async function getPengumumanById(id) {
  return throwIfError(
    await supabase.from('pengumuman').select(pengumumanColumns).eq('id', id).single(),
  );
}

export async function createPengumuman(data) {
  return throwIfError(
    await supabase.from('pengumuman').insert(data).select(pengumumanColumns).single(),
  );
}

export async function updatePengumuman(id, data) {
  return throwIfError(
    await supabase.from('pengumuman').update(data).eq('id', id).select(pengumumanColumns).single(),
  );
}

export async function deletePengumuman(id) {
  return throwIfError(await supabase.from('pengumuman').delete().eq('id', id));
}

