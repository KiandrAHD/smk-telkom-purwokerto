import { ensureSupabase } from './supabase';

const beritaColumns = 'id, judul, slug, ringkasan, konten, gambar_url, penulis, status, created_at, updated_at';
const STATUS_BERITA = ['draft', 'published'];

const normalizePayload = (data) => {
  const payload = { ...data, status: String(data.status || '').toLowerCase() };
  if (!STATUS_BERITA.includes(payload.status)) {
    throw new Error('Status berita tidak valid. Pilih Draft atau Published.');
  }
  return payload;
};

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
    await supabase.from('berita').insert(normalizePayload(data)).select(beritaColumns).single(),
  );
}

export async function updateBerita(id, data) {
  const supabase = ensureSupabase();
  const result = await supabase.from('berita').update(normalizePayload(data)).eq('id', id).select(beritaColumns).single();
  const updated = throwIfError(result);
  if (!updated || updated.id !== id || !STATUS_BERITA.includes(updated.status)) {
    throw new Error('Berita tidak ditemukan atau status gagal diperbarui.');
  }
  return updated;
}

export async function deleteBerita(id) {
  const supabase = ensureSupabase();
  return throwIfError(await supabase.from('berita').delete().eq('id', id));
}
