import { supabase } from './supabase';

const prestasiColumns = 'id, judul, slug, kategori, deskripsi, gambar_url, tingkat, tanggal, created_at, updated_at';

const throwIfError = ({ data, error }) => {
  if (error) throw error;
  return data;
};

export async function getPrestasi() {
  return throwIfError(
    await supabase
      .from('prestasi')
      .select(prestasiColumns)
      .order('tanggal', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false }),
  );
}

export async function getPrestasiById(id) {
  return throwIfError(
    await supabase.from('prestasi').select(prestasiColumns).eq('id', id).single(),
  );
}

export async function createPrestasi(data) {
  return throwIfError(
    await supabase.from('prestasi').insert(data).select(prestasiColumns).single(),
  );
}

export async function updatePrestasi(id, data) {
  return throwIfError(
    await supabase.from('prestasi').update(data).eq('id', id).select(prestasiColumns).single(),
  );
}

export async function deletePrestasi(id) {
  return throwIfError(await supabase.from('prestasi').delete().eq('id', id));
}

