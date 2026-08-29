import { supabase } from './supabase';

const ppdbColumns = 'id, nama_lengkap, nisn, asal_sekolah, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, no_hp, email, pilihan_jurusan, dokumen_url, status, catatan_admin, created_at, updated_at';
const STORAGE_BUCKET = 'ppdb-documents';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const ensureSupabase = () => {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
  return supabase;
};

const throwIfError = ({ data, error }) => {
  if (error) throw error;
  return data;
};

const sanitizeFilename = (filename) => {
  const cleaned = filename.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return cleaned || 'dokumen';
};

export async function submitPpdb(data) {
  const client = ensureSupabase();
  const { dokumen, ...fields } = data;
  let documentPath = null;

  if (dokumen) {
    const uniqueId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    documentPath = `submissions/${uniqueId}/${sanitizeFilename(dokumen.name)}`;
    const { error: uploadError } = await client.storage.from(STORAGE_BUCKET).upload(documentPath, dokumen, { upsert: false, contentType: dokumen.type });
    if (uploadError) throw uploadError;
  }

  const { data: inserted, error: insertError } = await client
    .from('ppdb')
    .insert({ ...fields, dokumen_url: documentPath, status: 'menunggu', catatan_admin: null })
    .select(ppdbColumns)
    .single();

  if (insertError) {
    if (documentPath) {
      try {
        await client.storage.from(STORAGE_BUCKET).remove([documentPath]);
      } catch {
        // Policy publik hanya mengizinkan upload; cleanup dilakukan best effort.
      }
    }
    throw insertError;
  }

  return inserted;
}

export async function getPpdb() {
  return throwIfError(await ensureSupabase().from('ppdb').select(ppdbColumns).order('created_at', { ascending: false }));
}

export async function getPpdbById(id) {
  return throwIfError(await ensureSupabase().from('ppdb').select(ppdbColumns).eq('id', id).single());
}

export async function updatePpdbStatus(id, status, catatanAdmin) {
  return throwIfError(await ensureSupabase().from('ppdb').update({ status, catatan_admin: catatanAdmin?.trim() || null }).eq('id', id).select(ppdbColumns).single());
}

export async function getPpdbDocumentUrl(path, expiresIn = 300) {
  if (!path) return null;
  const { data, error } = await ensureSupabase().storage.from(STORAGE_BUCKET).createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data?.signedUrl || null;
}

export const ppdbFileRules = { maxSize: MAX_FILE_SIZE, allowedTypes: ALLOWED_TYPES };

