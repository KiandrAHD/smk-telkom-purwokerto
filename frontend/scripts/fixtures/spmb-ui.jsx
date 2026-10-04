import SpmbQaControls from './SpmbQaControls';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { PpdbProvider } from '../../src/context/PpdbContext';
import LanguageProvider from '../../src/context/LanguageProvider';
import RegistrationFormPage from '../../src/pages/ppdb/RegistrationFormPage';
import UploadDocumentsPage from '../../src/pages/ppdb/UploadDocumentsPage';
import DokumenPesertaPage from '../../src/pages/ppdb/DokumenPesertaPage';
import SubmitSuccessPage from '../../src/pages/ppdb/SubmitSuccessPage';
import PpdbStatusPage from '../../src/pages/ppdb/PpdbStatusPage';
import RegisterPage from '../../src/pages/ppdb/RegisterPage';
import LoginPage from '../../src/pages/ppdb/LoginPage';
import '../../src/index.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><LanguageProvider><PpdbProvider>
  <div className="bg-amber-100 px-4 py-1 text-center text-xs text-amber-900 print:hidden">QA lokal — layanan simulasi; tidak mengirim data ke sekolah</div>
  <SpmbQaControls />
  <Routes>
    <Route path="/spmb/formulir" element={<RegistrationFormPage />} />
    <Route path="/spmb/berkas" element={<UploadDocumentsPage />} />
    <Route path="/spmb/dokumen-peserta" element={<DokumenPesertaPage />} />
    <Route path="/spmb/selesai" element={<SubmitSuccessPage />} />
    <Route path="/spmb/status" element={<PpdbStatusPage />} />
    <Route path="/spmb/daftar" element={<RegisterPage />} />
    <Route path="/spmb/masuk" element={<LoginPage />} />
    <Route path="*" element={<Navigate to="/spmb/formulir" replace />} />
  </Routes>
</PpdbProvider></LanguageProvider></BrowserRouter></React.StrictMode>);
