import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Send } from 'lucide-react';
import { tanyaStela } from '../../services/stela';
import { stelaData } from '../../data/dummyData';

// STELA sering menyebut alamat halaman detail. Pola pemisah dipakai untuk
// memecah teks, pola pencocok dipakai untuk menguji tiap potongan — sengaja dua
// regex terpisah karena regex global menyimpan lastIndex, sehingga .test() yang
// dipanggil berulang pada regex yang sama akan meleset selang-seling.
const PEMISAH = /(\/(?:jurusan|prestasi|berita|pengumuman)\/[a-z0-9-]+)/g;
const COCOK = /^\/(?:jurusan|prestasi|berita|pengumuman)\/[a-z0-9-]+$/;

const IsiPesan = ({ teks }) =>
  teks.split(PEMISAH).map((bagian, i) =>
    COCOK.test(bagian) ? (
      <Link key={i} to={bagian} className="font-semibold text-primary underline">
        {bagian}
      </Link>
    ) : (
      bagian
    )
  );

const StelaChat = ({ className = '', tampilkanSaran = true }) => {
  const [riwayat, setRiwayat] = useState([{ role: 'assistant', content: stelaData.sapaan }]);
  const [masukan, setMasukan] = useState('');
  const [memuat, setMemuat] = useState(false);
  const [galat, setGalat] = useState(null);
  const [pertanyaanGagal, setPertanyaanGagal] = useState('');
  const bawahRef = useRef(null);
  const controllerRef = useRef(null);
  const aktifRef = useRef(true);

  useEffect(() => () => {
    aktifRef.current = false;
    controllerRef.current?.abort();
  }, []);

  useEffect(() => {
    bawahRef.current?.scrollIntoView({ block: 'end' });
  }, [riwayat, memuat]);

  const kirim = async (teks, ulang = false) => {
    const pertanyaan = teks.trim();
    if (!pertanyaan || memuat) return;

    // Sapaan pembuka tidak ikut dikirim: itu tulisan kita sendiri, bukan bagian
    // percakapan, dan Claude menolak riwayat yang diawali pesan assistant.
    let basis = riwayat.slice(1);
    const pesanTerakhir = basis[basis.length - 1];
    if (!ulang && pertanyaanGagal && pesanTerakhir?.role === 'user' && pesanTerakhir.content === pertanyaanGagal) {
      basis = basis.slice(0, -1);
    }
    const percakapan = ulang
      ? basis
      : [...basis, { role: 'user', content: pertanyaan }];

    if (!ulang) setRiwayat((lama) => [...lama, { role: 'user', content: pertanyaan }]);
    setMasukan('');
    setGalat(null);
    setMemuat(true);
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const jawaban = await tanyaStela(percakapan, { signal: controller.signal });
      if (!aktifRef.current) return;
      setRiwayat((lama) => [...lama, { role: 'assistant', content: jawaban }]);
      setPertanyaanGagal('');
    } catch (error) {
      if (!aktifRef.current || error?.name === 'AbortError') return;
      setGalat('STELA sedang mengalami kendala. Silakan coba lagi.');
      setPertanyaanGagal(pertanyaan);
    } finally {
      if (aktifRef.current) setMemuat(false);
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  };

  const belumBertanya = riwayat.length === 1;

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-dark-100 bg-white ${className}`}>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite" aria-atomic="false">
        {riwayat.map((pesan, i) => (
          <div
            key={i}
            className={`flex ${pesan.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <p
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                pesan.role === 'user'
                  ? 'rounded-br-sm bg-primary text-white'
                  : 'rounded-bl-sm bg-dark-50 text-dark-700'
              }`}
            >
              {pesan.role === 'assistant' ? <IsiPesan teks={pesan.content} /> : pesan.content}
            </p>
          </div>
        ))}

        {memuat && (
          <div className="flex justify-start">
            <p className="rounded-2xl rounded-bl-sm bg-dark-50 px-4 py-3">
              <span className="sr-only">STELA sedang mengetik</span>
              <span className="flex gap-1" aria-hidden="true">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-dark-400" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-dark-400 delay-100" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-dark-400 delay-200" />
              </span>
            </p>
          </div>
        )}

        {galat && (
          <div role="alert" className="flex items-start gap-2 rounded-xl bg-primary-50 px-4 py-3 text-[11px] leading-relaxed text-primary-900">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
            <span className="flex-1">{galat}</span>
            <button
              type="button"
              onClick={() => kirim(pertanyaanGagal, true)}
              disabled={memuat || !pertanyaanGagal}
              className="flex-shrink-0 font-semibold text-primary underline disabled:opacity-50"
            >
              Coba lagi
            </button>
          </div>
        )}

        {tampilkanSaran && belumBertanya && !memuat && (
          <div className="flex flex-wrap gap-2 pt-1">
            {stelaData.saran.map((saran) => (
              <button
                key={saran}
                type="button"
                onClick={() => kirim(saran)}
                className="rounded-full border border-dark-200 px-3 py-1.5 text-left text-[10px] font-medium text-dark-600 transition-colors hover:border-primary hover:text-primary"
              >
                {saran}
              </button>
            ))}
          </div>
        )}

        <div ref={bawahRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          kirim(masukan);
        }}
        className="flex items-end gap-2 border-t border-dark-100 bg-white px-3 py-3"
      >
        <label htmlFor="stela-masukan" className="sr-only">
          Tulis pertanyaan untuk STELA
        </label>
        <textarea
          id="stela-masukan"
          rows={1}
          value={masukan}
          onChange={(e) => setMasukan(e.target.value)}
          onKeyDown={(e) => {
            // Enter mengirim, Shift+Enter membuat baris baru — kebiasaan umum
            // aplikasi chat.
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              kirim(masukan);
            }
          }}
          maxLength={1000}
          placeholder={stelaData.placeholder}
          className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-dark-200 px-3.5 py-2.5 text-xs text-dark-700 outline-none transition-colors placeholder:text-dark-400 focus:border-primary"
        />
        <button
          type="submit"
          disabled={memuat || !masukan.trim()}
          aria-label="Kirim pertanyaan"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default StelaChat;
