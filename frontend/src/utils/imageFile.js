export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const IMAGE_ACCEPT = '.png,.jpg,.jpeg,.gif,.webp,image/png,image/jpeg,image/gif,image/webp';

const formats = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  gif: 'image/gif', webp: 'image/webp',
};

export function validateImageUrl(value) {
  if (!value?.trim()) return '';
  try {
    if (['http:', 'https:'].includes(new URL(value.trim()).protocol)) return '';
  } catch { /* Pesan yang sama untuk URL tidak lengkap dan protokol lain. */ }
  return 'URL gambar harus menggunakan http:// atau https://.';
}

export async function validateImageFile(file) {
  const extension = file?.name?.split('.').pop().toLowerCase();
  const type = formats[extension];
  if (!type || (file.type && file.type !== type)) {
    throw new Error('Format tidak didukung. Pilih PNG, JPG, JPEG, GIF, atau WebP.');
  }
  if (!file.size) throw new Error('Berkas gambar kosong. Pilih berkas lain.');
  if (file.size > MAX_IMAGE_SIZE) throw new Error('Ukuran gambar melebihi 5 MB. Pilih berkas yang lebih kecil.');

  // Jangan hanya mempercayai ekstensi atau MIME dari browser.
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const text = String.fromCharCode(...bytes);
  const matches = {
    'image/png': [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte),
    'image/jpeg': bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255,
    'image/gif': text.startsWith('GIF87a') || text.startsWith('GIF89a'),
    'image/webp': text.startsWith('RIFF') && text.slice(8, 12) === 'WEBP',
  };
  if (!matches[type]) throw new Error('Isi berkas tidak sesuai format gambar. Berkas mungkin rusak.');
  return { type, extension: extension === 'jpeg' ? 'jpg' : extension };
}
