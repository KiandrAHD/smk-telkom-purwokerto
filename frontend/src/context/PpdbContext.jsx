import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Alur PPDB melewati beberapa halaman: daftar akun, isi formulir, unggah berkas,
// lalu bukti submit. Kalau tiap halaman menyimpan state-nya sendiri, data hilang
// begitu pengguna menekan "Lanjut" dan nomor registrasi di halaman akhir tidak
// mungkin nyambung dengan isian sebelumnya. Karena itu state alur disimpan di
// satu tempat.
//
// ponytail: masih di memori, jadi hilang saat halaman dimuat ulang. Untuk draft
// yang bertahan, simpan `biodata` dan `nilai` ke localStorage, atau kirim ke
// tabel `ppdb` yang sudah ada di migration Supabase.
const PpdbContext = createContext(null);

const BIODATA_KOSONG = {
  nisn: '',
  namaLengkap: '',
  email: '',
  whatsapp: '',
  jurusan: '',
  nik: '',
  agama: '',
  tempatLahir: '',
  tanggalLahir: '',
  jenisKelamin: '',
  alamat: '',
  namaSmp: '',
  tahunLulus: '',
};

// Nomor registrasi dibuat sekali saat submit supaya tidak berganti tiap render.
const buatNomorRegistrasi = () =>
  `PPDB2027-${String(Math.floor(10000 + Math.random() * 89999)).slice(0, 5)}`;

export const PpdbProvider = ({ children }) => {
  const [biodata, setBiodata] = useState(BIODATA_KOSONG);
  const [nilai, setNilai] = useState({});
  const [dokumen, setDokumen] = useState({});
  const [nomorRegistrasi, setNomorRegistrasi] = useState(null);
  const [draftTersimpan, setDraftTersimpan] = useState(false);

  const isiBiodata = useCallback((sebagian) => {
    setDraftTersimpan(false);
    setBiodata((lama) => ({ ...lama, ...sebagian }));
  }, []);

  const isiNilai = useCallback((mapel, semester, angka) => {
    setDraftTersimpan(false);
    setNilai((lama) => ({ ...lama, [`${mapel}|${semester}`]: angka }));
  }, []);

  const isiDokumen = useCallback((id, berkas) => {
    setDokumen((lama) => ({ ...lama, [id]: berkas }));
  }, []);

  const kirimPendaftaran = useCallback(() => {
    const nomor = buatNomorRegistrasi();
    setNomorRegistrasi(nomor);
    return nomor;
  }, []);

  const nilaiContext = useMemo(
    () => ({
      biodata,
      nilai,
      dokumen,
      nomorRegistrasi,
      draftTersimpan,
      isiBiodata,
      isiNilai,
      isiDokumen,
      setDraftTersimpan,
      kirimPendaftaran,
    }),
    [biodata, nilai, dokumen, nomorRegistrasi, draftTersimpan, isiBiodata, isiNilai, isiDokumen, kirimPendaftaran]
  );

  return <PpdbContext.Provider value={nilaiContext}>{children}</PpdbContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePpdb = () => {
  const ctx = useContext(PpdbContext);
  if (!ctx) throw new Error('usePpdb harus dipakai di dalam PpdbProvider.');
  return ctx;
};
