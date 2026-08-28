import { ensureSupabase } from './supabase';

const prestasiColumns = 'id, judul, slug, kategori, deskripsi, gambar_url, tingkat, tanggal, created_at, updated_at';

const throwIfError = ({ data, error }) => {
  if (error) throw error;
  return data;
};

export async function getPrestasi() {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase
      .from('prestasi')
      .select(prestasiColumns)
      .order('tanggal', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false }),
  );
}

export async function getPrestasiById(id) {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase.from('prestasi').select(prestasiColumns).eq('id', id).single(),
  );
}

export async function getPrestasiBySlug(slug) {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase.from('prestasi').select(prestasiColumns).eq('slug', slug).single(),
  );
}

export async function createPrestasi(data) {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase.from('prestasi').insert(data).select(prestasiColumns).single(),
  );
}

export async function updatePrestasi(id, data) {
  const supabase = ensureSupabase();
  return throwIfError(
    await supabase.from('prestasi').update(data).eq('id', id).select(prestasiColumns).single(),
  );
}

export async function deletePrestasi(id) {
  const supabase = ensureSupabase();
  return throwIfError(await supabase.from('prestasi').delete().eq('id', id));
}
