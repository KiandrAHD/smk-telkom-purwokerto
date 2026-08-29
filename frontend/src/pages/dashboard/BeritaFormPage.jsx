import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bold, Italic, List, Underline } from 'lucide-react';
import FormInput from '../../components/dashboard/FormInput';
import PageHeader from '../../components/dashboard/PageHeader';
import { useAdminData } from '../../context/AdminDataContext';
import { adminKategoriBerita, adminStatusBerita } from '../../data/dummyData';

const MAKS_UKURAN = 2 * 1024 * 1024; // 2MB sesuai keterangan di desain
const TIPE_DIIZINKAN = ['image/jpeg', 'image/png'];

const KOSONG = { judul: '', kategori: '', tanggal: '', status: 'Draft' };

const BeritaFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { berita, simpanBerita } = useAdminData();

  const modeEdit = Boolean(id);
  const asli = modeEdit ? berita.find((b) => String(b.id) === String(id)) : null;

  const [form, setForm] = useState(asli ? { ...asli } : KOSONG);
  const [gambar, setGambar] = useState(null);
  const [galatGambar, setGalatGambar] = useState('');
  const [seret, setSeret] = useState(false);
  const kontenRef = useRef(null);
  const berkasRef = useRef(null);

  // Alamat objek harus dilepas, kalau tidak berkasnya tetap tertahan di memori
  // selama tab dibuka.
  useEffect(() => () => { if (gambar) URL.revokeObjectURL(gambar); }, [gambar]);

  if (modeEdit && !asli) {
    return (
      <section>
        <PageHeader
          judul="Berita tidak ditemukan"
          breadcrumb={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Berita', to: '/dashboard/berita' },
            { label: 'Edit' },
          ]}
        />
        <div className="rounded-2xl border border-dark-100 bg-white p-8 text-center shadow-card">
          <p className="text-xs text-dark-500">
            Berita dengan id {id} sudah tidak ada. Mungkin baru saja dihapus.
          </p>
        </div>
      </section>
    );
  }

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));

  const terimaBerkas = (file) => {
    if (!file) return;
    if (!TIPE_DIIZINKAN.includes(file.type)) {
      setGalatGambar('Format harus JPG atau PNG.');
      return;
    }
    if (file.size > MAKS_UKURAN) {
      setGalatGambar('Ukuran gambar melebihi 2MB.');
      return;
    }
    setGalatGambar('');
    setGambar((lama) => {
      if (lama) URL.revokeObjectURL(lama);
      return URL.createObjectURL(file);
    });
  };

  // ponytail: document.execCommand sudah ditandai usang, tetapi masih berjalan di
  // semua browser dan tidak menambah satu pun dependensi. Kalau nanti butuh
  // editor sungguhan (tabel, gambar sisipan, riwayat undo), ganti bagian ini
  // dengan pustaka editor dan hapus toolbar di bawah.
  const perintah = (nama) => () => {
    kontenRef.current?.focus();
    document.execCommand(nama);
  };

  const kirim = (e) => {
    e.preventDefault();
    simpanBerita({
      ...form,
      id: asli?.id,
      konten: kontenRef.current?.textContent?.trim() || form.konten || '',
    });
    navigate('/dashboard/berita');
  };

  const tombolToolbar =
    'flex h-8 w-8 items-center justify-center rounded-lg text-dark-600 transition-colors hover:bg-dark-100 hover:text-primary';

  return (
    <section>
      <PageHeader
        judul={modeEdit ? 'Edit Berita' : 'Tambah Berita Baru'}
        breadcrumb={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Berita', to: '/dashboard/berita' },
          { label: modeEdit ? 'Edit' : 'Tambah' },
        ]}
      />

      <form onSubmit={kirim} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_24rem]">
        {/* Informasi Berita */}
        <div className="rounded-2xl border border-dark-100 bg-white p-6 shadow-card">
          <h2 className="font-heading text-lg font-extrabold text-dark-900">Informasi Berita</h2>

          <div className="mt-6 space-y-5">
            <FormInput
              label="Judul Berita"
              value={form.judul}
              onChange={ubah('judul')}
              placeholder="Masukkan judul berita"
              required
            />

            {/* Di desain mode edit, Kategori dan Tanggal berdampingan. */}
            <div className={modeEdit ? 'grid grid-cols-1 gap-5 sm:grid-cols-2' : 'space-y-5'}>
              <FormInput
                label="Kategori"
                as="select"
                value={form.kategori}
                onChange={ubah('kategori')}
                required
                options={[{ value: '', label: 'Pilih kategori' }, ...adminKategoriBerita]}
              />
              <FormInput
                label="Tanggal Publish"
                type="date"
                value={form.tanggal}
                onChange={ubah('tanggal')}
                required
              />
            </div>

            <FormInput
              label="Status"
              as="select"
              value={form.status}
              onChange={ubah('status')}
              options={adminStatusBerita}
            />

            <div>
              <p className="mb-2 text-[11px] font-bold text-dark-700">Thumbnail</p>

              {modeEdit || gambar ? (
                <>
                  <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-dark-50">
                    {gambar ? (
                      <img src={gambar} alt="Pratinjau thumbnail" className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-heading text-sm font-bold text-dark-500">Gambar berita</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => berkasRef.current?.click()}
                    className="mt-3 font-heading text-xs font-bold text-dark-900 transition-colors hover:text-primary"
                  >
                    Ubah Gambar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => berkasRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setSeret(true);
                  }}
                  onDragLeave={() => setSeret(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setSeret(false);
                    terimaBerkas(e.dataTransfer.files?.[0]);
                  }}
                  className={`flex h-36 w-full flex-col items-center justify-center rounded-xl border border-dashed text-center transition-colors ${
                    seret ? 'border-primary bg-primary-50' : 'border-dark-200 bg-dark-50'
                  }`}
                >
                  <span className="text-xs text-dark-500">Drag &amp; drop gambar di sini</span>
                  <span className="mt-1.5 text-[11px] text-dark-400">JPG, PNG &bull; Maks. 2MB</span>
                </button>
              )}

              <input
                ref={berkasRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => terimaBerkas(e.target.files?.[0])}
                className="hidden"
              />
              {galatGambar && <p className="mt-2 text-[11px] font-medium text-primary">{galatGambar}</p>}
            </div>

            <div>
              <p className="mb-2 text-[11px] font-bold text-dark-700">Konten Berita</p>
              <div className="overflow-hidden rounded-xl border border-dark-200">
                <div className="flex items-center gap-1 border-b border-dark-200 bg-dark-50 px-3 py-2">
                  <span className="mr-2 text-[11px] text-dark-500">Normal</span>
                  <button type="button" onClick={perintah('bold')} aria-label="Tebal" className={tombolToolbar}>
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={perintah('italic')} aria-label="Miring" className={tombolToolbar}>
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={perintah('underline')} aria-label="Garis bawah" className={tombolToolbar}>
                    <Underline className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={perintah('insertUnorderedList')}
                    aria-label="Daftar berpoin"
                    className={tombolToolbar}
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div
                  ref={kontenRef}
                  contentEditable
                  suppressContentEditableWarning
                  role="textbox"
                  aria-multiline="true"
                  aria-label="Konten berita"
                  data-placeholder="Tulis konten berita di sini..."
                  className="min-h-36 px-4 py-3 text-xs leading-relaxed text-dark-700 outline-none empty:before:text-dark-400 empty:before:content-[attr(data-placeholder)]"
                >
                  {asli?.konten}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <aside className="flex h-fit flex-col rounded-2xl border border-dark-100 bg-white p-6 shadow-card">
          <h2 className="font-heading text-lg font-extrabold text-dark-900">Preview</h2>

          <div className="mt-6 rounded-xl bg-dark-50 p-4">
            <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg bg-dark-200">
              {gambar ? (
                <img src={gambar} alt="" className="h-full w-full object-cover" />
              ) : (
                !form.judul && <span className="font-heading text-sm font-bold text-dark-500">Preview berita</span>
              )}
            </div>
            {form.judul && (
              <p className="mt-3 text-center text-xs font-medium leading-relaxed text-dark-700">
                {form.judul}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="rounded-xl bg-primary px-7 py-3.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              {modeEdit ? 'Update Berita' : 'Simpan Berita'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/berita')}
              className="px-3 py-3.5 font-heading text-xs font-bold text-dark-900 transition-colors hover:text-primary"
            >
              Batal
            </button>
          </div>
        </aside>
      </form>
    </section>
  );
};

export default BeritaFormPage;
