import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import PpdbPortalLayout from '../../components/ppdb/PpdbPortalLayout';
import { usePpdb } from '../../context/PpdbContext';
import { DUPLICATE_SUBMISSION_MESSAGE, ppdbCombinedDocumentRules, submitPpdb } from '../../services/ppdbService';

const BarisDokumen = ({ berkas, onPilih }) => {
  const inputRef = useRef(null);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dark-100 bg-white px-5 py-4 transition-colors hover:border-primary/40">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
          {berkas ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <FileText className="h-4 w-4" />}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-primary">WAJIB</p>
          <p className="mt-0.5 font-heading text-xs font-bold leading-snug text-dark-900">Dokumen Persyaratan (PDF Gabungan)</p>
          <p className="mt-1 text-[11px] text-dark-500">Format: PDF. Maksimal 10MB. Gabungkan seluruh dokumen persyaratan menjadi satu PDF.</p>
        </div>
      </div>
      <div className="flex min-w-0 flex-shrink-0 items-center gap-3">
        <button type="button" onClick={() => inputRef.current?.click()} className="rounded-full border border-primary bg-primary-50 px-4 py-2 text-[11px] font-bold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">Pilih File</button>
        <span className={`max-w-48 truncate text-[11px] ${berkas ? 'font-medium text-green-600' : 'text-dark-400'}`}>{berkas ? berkas.name : 'Belum ada file'}</span>
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" aria-label="Dokumen persyaratan PDF gabungan" onChange={(e) => onPilih(e.target.files?.[0])} className="hidden" />
      </div>
    </div>
  );
};

const UploadDocumentsPage = () => {
  const navigate = useNavigate();
  const { dokumen, isiDokumen, kirimPendaftaran, biodata } = usePpdb();
  const [galat, setGalat] = useState('');
  const [duplikat, setDuplikat] = useState(false);
  const [mengirim, setMengirim] = useState(false);

  const pilihBerkas = (file) => {
    if (!file) return;
    if (!ppdbCombinedDocumentRules.allowedTypes.includes(file.type)) {
      setGalat('Dokumen harus berupa file PDF.');
      return;
    }
    if (file.size > ppdbCombinedDocumentRules.maxSize) {
      setGalat('Ukuran dokumen tidak boleh melebihi 10MB.');
      return;
    }
    setGalat('');
    setDuplikat(false);
    isiDokumen('utama', file);
  };

  const kirim = async () => {
    const berkas = dokumen.utama;
    if (!berkas) {
      setGalat('Unggah satu PDF gabungan sebelum mengirim pendaftaran.');
      return;
    }
    setGalat('');
    setDuplikat(false);
    setMengirim(true);
    try {
      const hasil = await submitPpdb({ biodata, dokumen: berkas });
      kirimPendaftaran(hasil.id);
      navigate('/ppdb/selesai');
    } catch (error) {
      if (error?.code === 'PPDB_DUPLICATE_SUBMISSION' || error?.message === DUPLICATE_SUBMISSION_MESSAGE) {
        setDuplikat(true);
        setGalat('Anda sudah memiliki pendaftaran PPDB.');
      } else {
        setGalat('Pendaftaran gagal dikirim. Silakan coba lagi.');
      }
    } finally {
      setMengirim(false);
    }
  };

  return (
    <PpdbPortalLayout>
      <h1 className="font-heading text-xl font-extrabold text-dark-900 sm:text-2xl">Upload Dokumen Persyaratan</h1>
      <p className="mt-1.5 text-xs text-dark-500">Gabungkan dokumen persyaratan menjadi satu file PDF sebelum diunggah. Ukuran maksimal 10MB.</p>
      <div className="mt-6 rounded-2xl border border-dark-100 bg-white p-5 shadow-card sm:p-6">
        <BarisDokumen berkas={dokumen.utama} onPilih={pilihBerkas} />
         {galat && <div className="mt-5 rounded-xl bg-primary-50 px-4 py-3 text-[11px] font-medium text-primary-800"><p role="alert">{galat}</p>{duplikat && <Link to="/ppdb/status" className="mt-2 inline-block font-bold underline hover:text-primary-900">Lihat Status Pendaftaran</Link>}</div>}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-dark-100 pt-6">
          <Link to="/ppdb/formulir" className="text-[11px] font-semibold text-dark-500 transition-colors hover:text-primary">&larr; Kembali ke Data Akademik</Link>
          <button type="button" onClick={kirim} disabled={mengirim} className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-white shadow-card transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
            {mengirim ? 'Mengirim...' : 'Finalisasi & Kirim Pendaftaran'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </PpdbPortalLayout>
  );
};

export default UploadDocumentsPage;
