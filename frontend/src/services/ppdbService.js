import { ensureSupabase } from './supabase';
import { preparePpdbSubmission } from '../utils/ppdbSubmission';

const ppdbColumns = 'id, auth_user_id, nama_lengkap, nisn, nik, agama, asal_sekolah, tahun_lulus, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, no_hp, email, pilihan_jurusan, nilai_rapor, dokumen_url, status, catatan_admin, created_at, updated_at';
const STORAGE_BUCKET = 'ppdb-documents';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const COMBINED_DOCUMENT_TYPES = ['application/pdf'];
export const DUPLICATE_SUBMISSION_MESSAGE = 'Anda sudah memiliki pendaftaran PPDB. Silakan melihat status pendaftaran Anda.';

const throwIfError = ({ data, error }) => {
  if (error) throw error;
  return data;
};

const buatErrorDuplicateSubmission = () => {
  const error = new Error(DUPLICATE_SUBMISSION_MESSAGE);
  error.code = 'PPDB_DUPLICATE_SUBMISSION';
  return error;
};

export async function submitPpdb(data) {
  const client = ensureSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  const user = userData?.user;
  if (!user) throw new Error('Sesi PPDB tidak ditemukan. Silakan login kembali.');

  const { data: existingSubmissions, error: existingError } = await client
    .from('ppdb')
    .select('id')
    .eq('auth_user_id', user.id)
    .limit(1);
  if (existingError) throw existingError;
  if (existingSubmissions?.length) throw buatErrorDuplicateSubmission();

  const { dokumen, biodata, nilai, ...legacyFields } = data;
  const fields = biodata ? preparePpdbSubmission(biodata, nilai) : legacyFields;
  let documentPath = null;
  const ppdbId = globalThis.crypto?.randomUUID?.();
  if (!ppdbId) throw new Error('Browser tidak mendukung pembuatan ID pendaftaran yang aman.');

  if (dokumen) {
    if (!COMBINED_DOCUMENT_TYPES.includes(dokumen.type) || dokumen.size > MAX_FILE_SIZE) {
      throw new Error('Dokumen harus berupa PDF dengan ukuran maksimal 10MB.');
    }
    documentPath = `submissions/${user.id}/document.pdf`;
    const { error: uploadError } = await client.storage.from(STORAGE_BUCKET).upload(documentPath, dokumen, { upsert: false, contentType: dokumen.type });
    if (uploadError) throw uploadError;
  }

  const { data: inserted, error: insertError } = await client
    .from('ppdb')
    .insert({
      id: ppdbId,
      ...fields,
      email: user.email,
      auth_user_id: user.id,
      dokumen_url: documentPath,
      status: 'menunggu',
      catatan_admin: null,
    })
    .select(ppdbColumns)
    .single();

  if (insertError) {
    if (documentPath) {
      let cleanupError;
      try {
        ({ error: cleanupError } = await client.storage.from(STORAGE_BUCKET).remove([documentPath]));
      } catch (error) {
        cleanupError = error;
      }
      if (cleanupError) {
        const error = new Error('Pendaftaran gagal disimpan dan dokumen sementara belum dapat dihapus. Hubungi admin sekolah sebelum mencoba kembali.');
        error.code = 'PPDB_UPLOAD_CLEANUP_FAILED';
        error.cause = insertError;
        throw error;
      }
    }
    if (insertError.code === '23505' && insertError.message?.includes('ppdb_one_submission_per_auth_user_idx')) {
      throw buatErrorDuplicateSubmission();
    }
    throw insertError;
  }

  const { error: draftDeleteError } = await client.from('ppdb_drafts').delete().eq('auth_user_id', user.id);
  if (draftDeleteError) console.warn('Draft PPDB belum terhapus setelah pendaftaran:', draftDeleteError);

  return inserted;
}

export async function getPpdb() {
  return throwIfError(await ensureSupabase().from('ppdb').select(ppdbColumns).order('created_at', { ascending: false }));
}

export async function getPpdbById(id) {
  return throwIfError(await ensureSupabase().from('ppdb').select(ppdbColumns).eq('id', id).single());
}

export async function getMyPpdb() {
  const client = ensureSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  if (!userData?.user) throw new Error('Sesi PPDB tidak ditemukan. Silakan login kembali.');
  return throwIfError(await client.from('ppdb').select(ppdbColumns).eq('auth_user_id', userData.user.id).order('created_at', { ascending: false }));
}

export async function signUpPpdb(email, password, biodata) {
  const client = ensureSupabase();
  return throwIfError(await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/ppdb/verifikasi`,
      data: { ppdb: {
        nisn: biodata.nisn.trim(),
        namaLengkap: biodata.namaLengkap.trim(),
        whatsapp: biodata.whatsapp.trim(),
        jurusan: biodata.jurusan,
      } },
    },
  }));
}

export async function getMyPpdbDraft(userId) {
  const client = ensureSupabase();
  if (!userId) throw new Error('Sesi PPDB tidak ditemukan.');
  return throwIfError(await client.from('ppdb_drafts')
    .select('biodata,nilai')
    .eq('auth_user_id', userId)
    .maybeSingle());
}

export async function savePpdbDraft(biodata, nilai) {
  const client = ensureSupabase();
  const { data: { user }, error } = await client.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error('Sesi PPDB tidak ditemukan.');
  return throwIfError(await client.from('ppdb_drafts')
    .upsert({ auth_user_id: user.id, biodata, nilai, updated_at: new Date().toISOString() })
    .select('updated_at')
    .single());
}

export async function signInPpdb(email, password) {
  const client = ensureSupabase();
  return throwIfError(await client.auth.signInWithPassword({ email, password }));
}

export async function sendPpdbPasswordReset(email) {
  const client = ensureSupabase();
  return throwIfError(await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/ppdb/atur-sandi`,
  }));
}

export async function updatePpdbPassword(password) {
  const client = ensureSupabase();
  return throwIfError(await client.auth.updateUser({ password }));
}

export async function resendPpdbVerification(email) {
  const client = ensureSupabase();
  return throwIfError(await client.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${window.location.origin}/ppdb/verifikasi` },
  }));
}

export async function signOutPpdb() {
  const client = ensureSupabase();
  return throwIfError(await client.auth.signOut());
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
export const ppdbCombinedDocumentRules = { maxSize: MAX_FILE_SIZE, allowedTypes: COMBINED_DOCUMENT_TYPES };

