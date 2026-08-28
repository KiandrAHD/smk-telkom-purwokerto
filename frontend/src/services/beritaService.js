import { ensureSupabase } from './supabase';

const beritaColumns = 'id, judul, slug, ringkasan, konten, gambar_url, penulis, status, created_at, updated_at';

const throwIfError = ({ data, error }) => {
  if (error) throw error;
  return data;
};

export async function getBerita() {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase.from('berita').select(beritaColumns).order('created_at', { ascending: false }),
  );
}

export async function getPublishedBerita() {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase
      .from('berita')
      .select(beritaColumns)
      .eq('status', 'published')
      .order('created_at', { ascending: false }),
  );
}

export async function getBeritaById(id) {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase.from('berita').select(beritaColumns).eq('id', id).single(),
  );
}

export async function getBeritaBySlug(slug) {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase
      .from('berita')
      .select(beritaColumns)
      .eq('slug', slug)
      .eq('status', 'published')
      .single(),
  );
}

export async function createBerita(data) {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase.from('berita').insert(data).select(beritaColumns).single(),
  );
}

export async function updateBerita(id, data) {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase.from('berita').update(data).eq('id', id).select(beritaColumns).single(),
  );
}

export async function deleteBerita(id) {
  const supabase = ensureSupabase();
  return throwIfError(await supabase.from('berita').delete().eq('id', id));
}
