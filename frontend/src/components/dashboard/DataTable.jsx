import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Tabel bersama untuk seluruh halaman manajemen. Kolom dideskripsikan lewat prop
// `columns`, jadi setiap halaman cukup menentukan isi kolomnya tanpa menulis
// ulang markup <table>, penomoran baris, maupun pembagian halaman.
//
// Kolom dengan key 'no' diisi otomatis dengan nomor urut yang ikut menghitung
// halaman aktif, supaya baris pertama halaman kedua tidak kembali ke angka 1.
const DataTable = ({ columns, rows, keyField = 'id', perPage = 5, kosong = 'Tidak ada data.' }) => {
  const [halaman, setHalaman] = useState(1);

  const totalHalaman = Math.max(1, Math.ceil(rows.length / perPage));

  // Setelah difilter, jumlah baris bisa menyusut sampai halaman aktif tidak ada
  // lagi. Nilainya dijepit langsung saat render, bukan disamakan lewat effect,
  // supaya tidak memicu render bertingkat.
  const halamanAktif = Math.min(halaman, totalHalaman);
  const mulai = (halamanAktif - 1) * perPage;
  const tampil = rows.slice(mulai, mulai + perPage);

  return (
    <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-card sm:p-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse text-left">
          <thead>
            <tr className="bg-dark-50">
              {columns.map((kolom, i) => (
                <th
                  key={kolom.key}
                  scope="col"
                  className={`px-4 py-4 text-[11px] font-bold text-dark-600 ${
                    i === 0 ? 'rounded-l-xl' : ''
                  } ${i === columns.length - 1 ? 'rounded-r-xl' : ''} ${kolom.kelas ?? ''}`}
                >
                  {kolom.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tampil.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-xs text-dark-500">
                  {kosong}
                </td>
              </tr>
            )}

            {tampil.map((baris, i) => (
              <tr
                key={baris[keyField]}
                className="border-b border-dark-100 transition-colors last:border-b-0 hover:bg-dark-50/60"
              >
                {columns.map((kolom) => (
                  <td key={kolom.key} className={`px-4 py-5 text-xs text-dark-700 ${kolom.kelas ?? ''}`}>
                    {kolom.key === 'no' && !kolom.render
                      ? mulai + i + 1
                      : kolom.render
                        ? kolom.render(baris, mulai + i)
                        : baris[kolom.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-dark-500">
          {rows.length === 0
            ? 'Showing 0 entries'
            : `Showing ${mulai + 1} to ${Math.min(mulai + perPage, rows.length)} of ${rows.length} entries`}
        </p>

        {/* Desain hanya menampilkan teks di atas. Tombol ini ditambahkan supaya
            baris di halaman berikutnya benar-benar bisa dijangkau. */}
        {totalHalaman > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setHalaman(Math.max(1, halamanAktif - 1))}
              disabled={halamanAktif === 1}
              aria-label="Halaman sebelumnya"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-dark-200 text-dark-600 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalHalaman }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setHalaman(i + 1)}
                aria-current={halamanAktif === i + 1}
                className={`h-8 min-w-8 rounded-lg px-2 text-[11px] font-bold transition-colors ${
                  halamanAktif === i + 1
                    ? 'bg-primary text-white'
                    : 'border border-dark-200 text-dark-600 hover:border-primary hover:text-primary'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setHalaman(Math.min(totalHalaman, halamanAktif + 1))}
              disabled={halamanAktif === totalHalaman}
              aria-label="Halaman berikutnya"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-dark-200 text-dark-600 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
