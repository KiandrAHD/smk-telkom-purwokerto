import { useEffect, useId, useRef, useState } from 'react';
import { Crop, ImagePlus, Upload } from 'lucide-react';
import { IMAGE_ACCEPT, validateImageFile, validateImageUrl } from '../../utils/imageFile';
import ImageCropEditor from './ImageCropEditor';

// File tetap di browser hingga form disimpan. URL lama tetap bisa digunakan.
const ImageUploadField = ({ label = 'Gambar', value, file, coverAspect = 16 / 9, onUrlChange, onFileChange, onValidityChange, disabled }) => {
  const id = useId();
  const input = useRef(null);
  const request = useRef(0);
  const previewRequest = useRef(0);
  const original = useRef(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [draft, setDraft] = useState(null);

  // Bebaskan blob saat gambar diganti/dihapus atau modal ditutup.
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => () => { if (draft) URL.revokeObjectURL(draft.src); }, [draft]);
  useEffect(() => () => { request.current += 1; }, []);

  const chooseFiles = async (files) => {
    if (disabled || !files.length) return;
    const currentRequest = ++request.current;
    setError('');
    setChecking(true);
    onValidityChange(false);
    try {
      if (files.length !== 1) throw new Error('Pilih satu gambar saja.');
      await validateImageFile(files[0]);
      if (currentRequest !== request.current) return;
      setDraft({ file: files[0], src: URL.createObjectURL(files[0]), request: currentRequest });
    } catch (validationError) {
      if (currentRequest === request.current) setError(validationError.message || 'Gambar tidak dapat dibaca. Silakan pilih ulang.');
    } finally {
      if (currentRequest === request.current) setChecking(false);
    }
  };

  const clearImage = () => {
    request.current += 1;
    setPreview('');
    setDraft(null);
    original.current = null;
    setChecking(false);
    setError('');
    onFileChange(null);
    onUrlChange('');
    onValidityChange(true);
  };

  const previewSrc = file ? preview : (!validateImageUrl(value) ? value?.trim() : '');
  return (
    <fieldset disabled={disabled} className="min-w-0 space-y-3">
      <legend className="mb-1.5 text-xs font-semibold text-dark-700">{label}</legend>
      <div
        role="group" aria-label={`Area unggah ${label.toLowerCase()}`} aria-describedby={`${id}-help ${id}-error`}
        onDragOver={(event) => { event.preventDefault(); if (!disabled) { event.dataTransfer.dropEffect = 'copy'; setDragging(true); } }}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }}
        onDrop={(event) => { event.preventDefault(); setDragging(false); void chooseFiles(Array.from(event.dataTransfer.files)); }}
        className={`rounded-xl border-2 border-dashed p-4 text-center transition-colors ${dragging ? 'border-primary bg-primary-50' : 'border-dark-200 bg-dark-50'} ${disabled ? 'opacity-60' : ''}`}
      >
        <ImagePlus className="mx-auto h-7 w-7 text-primary" aria-hidden="true" />
        <p className="mt-2 text-xs font-semibold text-dark-700">Tarik dan lepas gambar di sini</p>
        <p id={`${id}-help`} className="mt-1 text-[11px] text-dark-500">PNG, JPG, JPEG, GIF, WebP · Maksimal 5 MB</p>
        <input ref={input} id={`${id}-file`} type="file" accept={IMAGE_ACCEPT} className="hidden" aria-label={`Pilih berkas ${label.toLowerCase()}`} onChange={(event) => { void chooseFiles(Array.from(event.target.files)); event.target.value = ''; }} />
        <button type="button" onClick={() => input.current.click()} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-dark-200 bg-white px-3 py-2 text-xs font-bold text-dark-700 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed">
          <Upload className="h-4 w-4" aria-hidden="true" />Pilih berkas
        </button>
      </div>
      {checking && <p role="status" className="text-xs text-dark-500">Memeriksa gambar...</p>}
      {error && <p id={`${id}-error`} role="alert" className="text-xs text-primary-700">{error}</p>}
      {draft && <ImageCropEditor key={draft.src} src={draft.src} fileName={draft.file.name} coverAspect={coverAspect} onCancel={() => {
        request.current += 1;
        setDraft(null);
        setChecking(false);
        setError('');
        onValidityChange(!validateImageUrl(value));
      }} onConfirm={(croppedFile) => {
        if (draft.request !== request.current) return;
        original.current = draft.file;
        previewRequest.current = request.current;
        setPreview(URL.createObjectURL(croppedFile));
        onFileChange(croppedFile);
        onUrlChange('');
        setDraft(null);
        // Validitas diaktifkan setelah preview berkas hasil berhasil dimuat.
      }} />}
      {previewSrc && !draft && (
        <div className="overflow-hidden rounded-xl border border-dark-200 bg-dark-50">
          <img key={previewSrc} src={previewSrc} alt={`Pratinjau ${label.toLowerCase()}`} className="max-h-48 w-full object-contain" onLoad={() => { if (file && !draft && previewRequest.current === request.current) onValidityChange(true); }} onError={() => {
            if (!file || previewRequest.current === request.current) {
              setError('Pratinjau gagal dimuat. Periksa gambar atau URL Anda.');
              if (file) onValidityChange(false);
            }
          }} />
          {file && <p className="break-all border-t border-dark-200 px-3 py-2 text-[11px] text-dark-500">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p>}
        </div>
      )}
      {file && !draft && <button type="button" disabled={checking} onClick={() => { onValidityChange(false); const source = original.current || file; setDraft({ file: source, src: URL.createObjectURL(source), request: ++request.current }); }} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-dark-200 px-3 py-2 text-xs font-semibold text-dark-700 hover:border-primary hover:text-primary"><Crop className="h-4 w-4" aria-hidden="true" />Crop ulang</button>}
      {(file || value || error) && <button type="button" onClick={clearImage} className="text-xs font-semibold text-primary underline underline-offset-2">Hapus gambar</button>}
      <details className="text-xs text-dark-500" open={file ? false : undefined}>
        <summary className="cursor-pointer font-semibold">Atau gunakan URL gambar</summary>
        <label htmlFor={`${id}-url`} className="sr-only">URL {label.toLowerCase()}</label>
        <input id={`${id}-url`} type="url" value={value || ''} disabled={disabled || Boolean(file) || Boolean(draft)} placeholder="https://..." onChange={(event) => {
          request.current += 1;
          setChecking(false);
          const urlError = validateImageUrl(event.target.value);
          setError(urlError);
          onUrlChange(event.target.value);
          onValidityChange(!urlError);
        }} className="mt-2 w-full rounded-lg border border-dark-200 bg-white px-3 py-2.5 text-sm text-dark-900 outline-none placeholder:text-dark-400 focus:border-primary disabled:opacity-50" />
      </details>
    </fieldset>
  );
};

export default ImageUploadField;
