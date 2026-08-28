import { ensureSupabase } from './supabase';

const pengumumanColumns = 'id, judul, slug, ringkasan, konten, gambar_url, status, tanggal, created_at, updated_at';

const throwIfError = ({ data, error }) => {
  if (error) throw error;
  return data;
};

export async function getPengumuman() {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase.from('pengumuman').select(pengumumanColumns).order('created_at', { ascending: false }),
  );
}

export async function getPublishedPengumuman() {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase
      .from('pengumuman')
      .select(pengumumanColumns)
      .eq('status', 'published')
      .order('tanggal', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false }),
  );
}

export async function getPengumumanById(id) {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase.from('pengumuman').select(pengumumanColumns).eq('id', id).single(),
  );
}

export async function getPengumumanBySlug(slug) {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase
      .from('pengumuman')
      .select(pengumumanColumns)
      .eq('slug', slug)
      .eq('status', 'published')
      .single(),
  );
}

export async function createPengumuman(data) {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase.from('pengumuman').insert(data).select(pengumumanColumns).single(),
  );
}

export async function updatePengumuman(id, data) {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase.from('pengumuman').update(data).eq('id', id).select(pengumumanColumns).single(),
  );
}

export async function deletePengumuman(id) {
  const supabase = ensureSupabase();
  return throwIfError(await supabase.from('pengumuman').delete().eq('id', id));
}
