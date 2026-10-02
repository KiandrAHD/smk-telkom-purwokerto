import { useEffect, useId, useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { createCroppedFile, drawImageCrop } from '../../utils/imageCrop';
import { validateImageFile } from '../../utils/imageFile';

const RATIOS = [{ label: '16:9', value: 16 / 9 }, { label: '4:3', value: 4 / 3 }, { label: '1:1', value: 1 }];
const buttonClass = 'min-h-11 rounded-lg border border-dark-200 px-3 py-2 text-xs font-semibold text-dark-700 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50';

const ImageCropEditor = ({ src, fileName, coverAspect = 16 / 9, onConfirm, onCancel }) => {
  const id = useId();
  const image = useRef(null);
  const resultCanvas = useRef(null);
  const coverCanvas = useRef(null);
  const mounted = useRef(true);
  const [aspect, setAspect] = useState(coverAspect);
  const [crop, setCrop] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const reset = (ratio = aspect) => {
    const img = image.current;
    if (!img?.naturalWidth) return;
    const { width, height } = img.getBoundingClientRect();
    setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 90 }, ratio, width, height), width, height));
    setError('');
  };

  // Kedua canvas digambar ulang saat seleksi berubah, tanpa upload ke server.
  useEffect(() => {
    if (!crop || !image.current) return;
    try {
      drawImageCrop(image.current, crop, resultCanvas.current, 640);
      const source = resultCanvas.current;
      const cover = coverCanvas.current;
      cover.width = 640;
      cover.height = Math.round(640 / coverAspect);
      const scale = Math.max(cover.width / source.width, cover.height / source.height);
      const width = source.width * scale;
      const height = source.height * scale;
      cover.getContext('2d').drawImage(source, (cover.width - width) / 2, (cover.height - height) / 2, width, height);
    } catch { /* Seleksi kosong sementara saat pengguna menggambar ulang. */ }
  }, [crop, coverAspect]);

  const confirm = async () => {
    setSaving(true);
    setError('');
    try {
      const croppedFile = await createCroppedFile(image.current, crop, fileName);
      await validateImageFile(croppedFile);
      if (mounted.current) onConfirm(croppedFile);
    } catch (cause) {
      if (mounted.current) setError(cause.message || 'Gambar gagal dipotong. Silakan coba lagi.');
    } finally {
      if (mounted.current) setSaving(false);
    }
  };

  return (
    <section aria-labelledby={`${id}-title`} className="space-y-3 rounded-xl border border-primary/30 bg-white p-3">
      <h3 id={`${id}-title`} className="text-sm font-bold text-dark-900">Crop gambar</h3>
      <p className="text-xs leading-relaxed text-dark-500">Geser area pilihan atau tarik sudutnya. Gunakan tombol panah saat area crop mendapat fokus.</p>
      <div role="group" aria-label="Rasio crop" className="flex flex-wrap gap-2">
        {[{ label: 'Cover', value: coverAspect }, ...RATIOS.filter((ratio) => ratio.value !== coverAspect)].map((ratio) => <button key={ratio.label} type="button" disabled={saving} aria-pressed={aspect === ratio.value} onClick={() => { setAspect(ratio.value); reset(ratio.value); }} className={`${buttonClass} ${aspect === ratio.value ? 'border-primary bg-primary-50 text-primary' : ''}`}>{ratio.label}</button>)}
      </div>
      <div className="flex justify-center overflow-hidden rounded-lg bg-dark-900 p-2">
        <ReactCrop crop={crop} aspect={aspect} onChange={(_, percent) => setCrop(percent)} ruleOfThirds keepSelection disabled={saving} minWidth={20} minHeight={20} ariaLabels={{ cropArea: 'Area crop gambar', nwDragHandle: 'Sudut kiri atas', nDragHandle: 'Tepi atas', neDragHandle: 'Sudut kanan atas', eDragHandle: 'Tepi kanan', seDragHandle: 'Sudut kanan bawah', sDragHandle: 'Tepi bawah', swDragHandle: 'Sudut kiri bawah', wDragHandle: 'Tepi kiri' }}>
          <img ref={image} src={src} alt="Gambar untuk dipotong" onLoad={() => reset()} onError={() => { setCrop(null); setError('Gambar tidak dapat dibaca. Pilih berkas lain.'); }} className="block max-h-80 max-w-full object-contain" />
        </ReactCrop>
      </div>
      {crop && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <figure className="min-w-0"><figcaption className="mb-2 text-xs font-semibold text-dark-700">Hasil crop — preview langsung</figcaption><canvas ref={resultCanvas} aria-label="Preview hasil crop" className="h-auto w-full rounded-lg border border-dark-200 bg-dark-50" /></figure>
        <figure className="min-w-0"><figcaption className="mb-2 text-xs font-semibold text-dark-700">Preview cover</figcaption><div className="overflow-hidden rounded-lg border border-dark-200 bg-white shadow-sm"><canvas ref={coverCanvas} aria-label="Preview gambar sebagai cover" className="h-auto w-full bg-dark-50" /><p className="p-3 text-xs font-bold text-dark-900">Judul konten Anda</p></div></figure>
      </div>}
      <p className="text-[11px] leading-relaxed text-dark-500">Hasil disimpan sebagai gambar statis, maksimal sisi panjang 1600 px. GIF yang dipotong tidak mempertahankan animasi.</p>
      {error && <p role="alert" className="text-xs text-primary-700">{error}</p>}
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" disabled={saving} onClick={onCancel} className={buttonClass}>Batal crop</button>
        <button type="button" disabled={saving || !crop} onClick={() => reset()} className={buttonClass}>Reset</button>
        <button type="button" disabled={saving || !crop?.width || !crop?.height} onClick={confirm} className="min-h-11 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Memproses...' : 'Gunakan Hasil Crop'}</button>
      </div>
    </section>
  );
};

export default ImageCropEditor;
