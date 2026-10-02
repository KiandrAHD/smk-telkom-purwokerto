import { validateImageFile, validateImageUrl } from '../utils/imageFile';

// Dipakai keempat CRUD: upload dahulu, lalu simpan URL permanen ke record.
// ponytail: gambar lama dipertahankan karena bisa dipakai record lain;
// tambahkan cleanup berbasis referensi jika berkas tak terpakai menumpuk.
export async function saveWithContentImage(client, data, folder, urlField, save) {
  const { image_file: file, ...payload } = data;
  const storage = file ? client.storage.from('content-images') : null;
  let path;
  try {
    if (file) {
      const { type, extension } = await validateImageFile(file);
      path = `${folder}/${crypto.randomUUID()}.${extension}`;
      const { error } = await storage.upload(path, file, { contentType: type, upsert: false });
      if (error) throw error;
      payload[urlField] = storage.getPublicUrl(path).data.publicUrl;
    } else {
      const urlError = validateImageUrl(payload[urlField]);
      if (urlError) throw new Error(urlError);
    }
  } catch (cause) {
    const error = new Error(`Gambar gagal diunggah atau diproses. ${cause.message || 'Periksa koneksi dan izin Storage, lalu coba lagi.'}`);
    error.code = 'CONTENT_IMAGE_UPLOAD';
    error.cause = cause;
    throw error;
  }

  try {
    return await save(payload);
  } catch (error) {
    // Hapus hanya unggahan baru setelah penolakan database yang pasti.
    // Respons jaringan hilang bisa terjadi setelah commit; pertahankan gambarnya.
    if (path && /^(23|42|P0)/.test(error.code || '')) {
      let cleanupError;
      try { ({ error: cleanupError } = await storage.remove([path])); } catch (cause) { cleanupError = cause; }
      if (cleanupError) {
        const cleanupFailure = new Error('Data gagal disimpan dan gambar sementara belum dapat dihapus. Hubungi admin untuk membersihkan berkas sementara.');
        cleanupFailure.code = 'CONTENT_IMAGE_CLEANUP';
        cleanupFailure.cause = error;
        throw cleanupFailure;
      }
    }
    throw error;
  }
}
