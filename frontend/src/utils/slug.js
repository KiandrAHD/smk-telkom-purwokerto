// Judul -> potongan URL. Dipakai untuk merakit tautan detail dari data dummy,
// jadi setiap kartu punya alamatnya sendiri tanpa perlu menulis slug satu per
// satu di dummyData.js.
export const slugify = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
