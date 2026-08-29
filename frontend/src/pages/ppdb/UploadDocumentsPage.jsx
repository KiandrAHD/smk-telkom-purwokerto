import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import PpdbPortalLayout from '../../components/ppdb/PpdbPortalLayout';
import { usePpdb } from '../../context/PpdbContext';
import { ppdbDokumen } from '../../data/dummyData';

const BarisDokumen = ({ dokumen, berkas, onPilih }) => {
  const inputRef = useRef(null);
  const [galat, setGalat] = useState('');

  const terima = (file) => {
    if (!file) return;
    if (file.size > dokumen.maksMb * 1024 * 1024) {
      setGalat(`Ukuran berkas melebihi ${dokumen.maksMb}MB.`);
      return;
    }
    setGalat('');
    onPilih(file);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dark-100 bg-white px-5 py-4 transition-colors hover:border-primary/40">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
          {berkas ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <FileText className="h-4 w-4" />}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-primary">WAJIB</p>
          <p className="mt-0.5 font-heading text-xs font-bold leading-snug text-dark-900">
            {dokumen.nama}
          </p>
          <p className="mt-1 text-[11px] text-dark-500">{dokumen.format}</p>
          {galat && <p className="mt-1 text-[11px] font-medium text-primary">{galat}</p>}
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-primary bg-primary-50 px-4 py-2 text-[11px] font-bold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Choose File
        </button>
        <span className={`text-[11px] ${berkas ? 'font-medium text-green-600' : 'text-dark-400'}`}>
          {berkas ? berkas.name : 'No file chosen'}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={dokumen.tipe}
          aria-label={dokumen.nama}
          onChange={(e) => terima(e.target.files?.[0])}
          className="hidden"
        />
      </div>
    </div>
  );
};

const UploadDocumentsPage = () => {
  const navigate = useNavigate();
  const { dokumen, isiDokumen, kirimPendaftaran } = usePpdb();
  const [galat, setGalat] = useState('');

  const kirim = () => {
    const belum = ppdbDokumen.filter((d) => !dokumen[d.id]);
    if (belum.length) {
      setGalat(`Masih ada ${belum.length} dokumen wajib yang belum diunggah.`);
      return;
    }
    setGalat('');
    kirimPendaftaran();
    navigate('/ppdb/selesai');
  };

  return (
    <PpdbPortalLayout>
      <h1 className="font-heading text-xl font-extrabold text-dark-900 sm:text-2xl">
        Upload Dokumen Persyaratan
      </h1>
      <p className="mt-1.5 text-xs text-dark-500">
        Unggah dokumen pendukung dengan format PDF, JPG, atau PNG (Maksimal ukuran file 2MB).
      </p>

      <div className="mt-6 rounded-2xl border border-dark-100 bg-white p-5 shadow-card sm:p-6">
        <div className="space-y-4">
          {ppdbDokumen.map((d) => (
            <BarisDokumen
              key={d.id}
              dokumen={d}
              berkas={dokumen[d.id]}
              onPilih={(file) => isiDokumen(d.id, file)}
            />
          ))}
        </div>

        {galat && (
          <p role="alert" className="mt-5 rounded-xl bg-primary-50 px-4 py-3 text-[11px] font-medium text-primary-800">
            {galat}
          </p>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-dark-100 pt-6">
          <Link
            to="/ppdb/formulir"
            className="text-[11px] font-semibold text-dark-500 transition-colors hover:text-primary"
          >
            &larr; Kembali ke Data Akademik
          </Link>

          <button
            type="button"
            onClick={kirim}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-card transition-transform hover:-translate-y-0.5"
          >
            Finalisasi &amp; Kirim Pendaftaran
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </PpdbPortalLayout>
  );
};

export default UploadDocumentsPage;
