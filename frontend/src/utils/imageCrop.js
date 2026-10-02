// Crop persentase tetap akurat walaupun ukuran editor berubah di ponsel.
export function drawImageCrop(image, crop, canvas, maxDimension = 1600) {
  if (!image.naturalWidth || !image.naturalHeight || crop?.unit !== '%' ||
    ![crop.x, crop.y, crop.width, crop.height].every(Number.isFinite) ||
    crop.x < 0 || crop.y < 0 || crop.width <= 0 || crop.height <= 0 ||
    crop.x + crop.width > 100.001 || crop.y + crop.height > 100.001) {
    throw new Error('Pilih area crop yang valid terlebih dahulu.');
  }
  const x = image.naturalWidth * crop.x / 100;
  const y = image.naturalHeight * crop.y / 100;
  const width = Math.min(image.naturalWidth - x, image.naturalWidth * crop.width / 100);
  const height = Math.min(image.naturalHeight - y, image.naturalHeight * crop.height / 100);
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Browser tidak dapat memproses gambar.');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, x, y, width, height, 0, 0, canvas.width, canvas.height);
}

export async function createCroppedFile(image, crop, name) {
  const canvas = document.createElement('canvas');
  drawImageCrop(image, crop, canvas);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.92));
  if (!blob) throw new Error('Hasil crop gagal dibuat. Silakan coba lagi.');
  // Canvas dapat memakai PNG sebagai fallback jika encoder WebP tidak tersedia.
  const extension = blob.type === 'image/webp' ? 'webp' : 'png';
  return new File([blob], `${name.replace(/\.[^.]+$/, '')}-crop.${extension}`, { type: blob.type });
}
