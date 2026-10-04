import { useLanguage } from '../../context/LanguageContext';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import PpdbPortalLayout from '../../components/ppdb/PpdbPortalLayout';
import { usePpdb } from '../../context/PpdbContext';
import { DUPLICATE_SUBMISSION_MESSAGE, ppdbCombinedDocumentRules } from '../../services/ppdbService';

import RegistrationReview from '../../components/ppdb/RegistrationReview';
import DraftFeedback from '../../components/ppdb/DraftFeedback';
import { validatePpdbForm } from '../../utils/ppdbSubmission';
import { ketentuanPpdb } from '../../data/dummyData';

const BarisDokumen = ({ berkas, onPilih }) => {
  const { t } = useLanguage();
  const inputRef = useRef(null);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dark-100 bg-white px-5 py-4 transition-colors hover:border-primary/40">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
          {berkas ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <FileText className="h-4 w-4" />}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-primary">{t("WAJIB")}</p>
          <p className="mt-0.5 font-heading text-xs font-bold leading-snug text-dark-900">{t("Dokumen Persyaratan (PDF Gabungan)")}</p>
          <p className="mt-1 text-[11px] text-dark-500">{t("Format: PDF. Maksimal 10MB. Gabungkan seluruh dokumen persyaratan menjadi satu PDF.")}</p>
        </div>
      </div>
      <div className="flex min-w-0 flex-shrink-0 items-center gap-3">
        <button type="button" onClick={() => inputRef.current?.click()} className="rounded-full border border-primary bg-primary-50 px-4 py-2 text-[11px] font-bold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">{t("Pilih File")}</button>
        <span className={`max-w-48 truncate text-[11px] ${berkas ? 'font-medium text-green-600' : 'text-dark-400'}`}>{berkas ? berkas.name : t('Belum ada file')}</span>
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" aria-label={t("Dokumen persyaratan PDF gabungan")} onChange={(e) => onPilih(e.target.files?.[0])} className="hidden" />
      </div>
    </div>
  );
};

const UploadDocumentsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { dokumen, isiDokumen, finalisasiPendaftaran, biodata, nilai, draftLoadError } = usePpdb();
  const [galat, setGalat] = useState('');
  const [duplikat, setDuplikat] = useState(false);
  const [mengirim, setMengirim] = useState(false);
  const [reviewRequested, setReviewing] = useState(false);
  const reviewing = reviewRequested && Boolean(dokumen.utama);
  const [confirmed, setConfirmed] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const reviewRef = useRef(null);
  useEffect(() => {
    if (!dokumen.utama) return undefined;
    const url = URL.createObjectURL(dokumen.utama);
    // A blob URL is an external browser resource with an effect-owned lifetime.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [dokumen.utama]);
  const periksa = () => {
    if (validatePpdbForm(biodata, nilai).length) { navigate('/spmb/formulir'); return; }
    if (!dokumen.utama) { setGalat('Unggah satu PDF gabungan sebelum mengirim pendaftaran.'); return; }
    setGalat('');
    setReviewing(true);
    requestAnimationFrame(() => reviewRef.current?.focus());
  };

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
    if (!confirmed || !reviewing || mengirim || draftLoadError) return;
    const berkas = dokumen.utama;
    if (!berkas) {
      setGalat('Unggah satu PDF gabungan sebelum mengirim pendaftaran.');
      return;
    }
    setGalat('');
    setDuplikat(false);
    setMengirim(true);
    try {
      const hasil = await finalisasiPendaftaran();
      if (!hasil) return;
      navigate('/spmb/selesai');
    } catch (error) {
      if (error?.code === 'PPDB_DUPLICATE_SUBMISSION' || error?.message === DUPLICATE_SUBMISSION_MESSAGE) {
        setDuplikat(true);
        setGalat('Anda sudah memiliki pendaftaran SPMB.');
      } else if (error?.code === 'PPDB_VALIDATION' || error?.code === 'PPDB_UPLOAD_CLEANUP_FAILED') {
        setGalat(error.message);
      } else {
        setGalat('Pendaftaran gagal dikirim. Periksa koneksi internet Anda dan pastikan dokumen telah diunggah dengan benar, lalu coba lagi.');
      }
    } finally {
      setMengirim(false);
    }
  };

  return (
    <PpdbPortalLayout>
      <h1 className="font-heading text-xl font-extrabold text-dark-900 sm:text-2xl">{t("Upload Dokumen Persyaratan")}</h1>
      <p className="mt-1.5 text-xs text-dark-500">{t("Gabungkan dokumen persyaratan menjadi satu file PDF sebelum diunggah. Ukuran maksimal 10MB.")}</p>
      <DraftFeedback />
      <div className="mt-6 rounded-2xl border border-dark-100 bg-white p-5 shadow-card sm:p-6">
        {reviewing ? <div ref={reviewRef} tabIndex={-1} className="outline-none"><RegistrationReview biodata={biodata} nilai={nilai} berkas={dokumen.utama} />
          <label className="mt-6 flex items-start gap-3 rounded-xl bg-primary-50 p-4 text-sm leading-relaxed text-dark-800"><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} disabled={mengirim} className="mt-1 h-4 w-4 shrink-0 accent-primary" />{t('Saya telah memeriksa data dan PDF; semuanya benar dan siap dikirim.')}</label>
        </div> : <>
          <h2 className="mb-3 text-sm font-bold text-dark-900">{t('Pastikan PDF gabungan memuat:')}</h2>
          <ul className="mb-5 list-disc space-y-2 pl-5 text-xs leading-relaxed text-dark-600">{ketentuanPpdb.bagian.find((b) => b.judul === 'Berkas Pendaftaran').butir.map((text) => <li key={text}>{t(text)}</li>)}</ul>
          <BarisDokumen berkas={dokumen.utama} onPilih={pilihBerkas} />
          {dokumen.utama && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs"><span className="break-all text-dark-600">{dokumen.utama.name} · {(dokumen.utama.size / 1048576).toFixed(2)} MB / 10 MB</span><button type="button" onClick={() => isiDokumen('utama', null)} className="min-h-11 font-bold text-primary">{t('Hapus file')}</button></div>}
          <p className="mt-3 text-xs leading-relaxed text-dark-500">{t('Biodata dan nilai tersimpan sebagai draft. File PDF perlu dipilih kembali jika halaman dimuat ulang sebelum pendaftaran dikirim.')}</p>
        </>}
        {dokumen.utama && previewUrl && <details className="mt-5 rounded-xl border border-dark-100 p-4"><summary className="cursor-pointer text-sm font-bold text-primary">{t('Preview PDF')}</summary><a href={previewUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center text-xs font-bold text-primary underline">{t('Buka PDF di tab baru')}</a><object data={previewUrl} type="application/pdf" aria-label={t('Preview PDF')} className="mt-3 h-80 w-full"><p className="text-xs text-dark-500">{t('Buka PDF di tab baru untuk melihat isinya.')}</p></object></details>}
         {galat && <div className="motion-feedback mt-5 rounded-xl bg-primary-50 px-4 py-3 text-[11px] font-medium text-primary-800"><p role="alert">{t(galat)}</p>{duplikat && <Link to="/spmb/status" className="mt-2 inline-block font-bold underline hover:text-primary-900">{t("Lihat Status Pendaftaran")}</Link>}</div>}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-dark-100 pt-6">
          {reviewing ? <button type="button" disabled={mengirim} onClick={() => { setReviewing(false); setConfirmed(false); }} className="min-h-11 text-xs font-semibold text-primary">{t('Ubah PDF')}</button> : <Link to="/spmb/formulir" className="min-h-11 text-xs font-semibold text-dark-500 hover:text-primary">{t("← Kembali ke Data Akademik")}</Link>}
          <button type="button" onClick={reviewing ? kirim : periksa} disabled={mengirim || Boolean(draftLoadError) || (reviewing && !confirmed)} className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-white shadow-card transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
            {t(mengirim ? 'Mengirim...' : reviewing ? 'Finalisasi & Kirim Pendaftaran' : 'Periksa Pendaftaran')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </PpdbPortalLayout>
  );
};

export default UploadDocumentsPage;
