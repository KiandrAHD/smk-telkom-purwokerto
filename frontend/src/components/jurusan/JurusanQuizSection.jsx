import { useState } from 'react';
import { ArrowRight, Bot, CheckCircle2, RotateCcw } from 'lucide-react';
import { jurusanQuiz } from '../../data/dummyData';

// Rekomendasi = jurusan dengan skor tertinggi dari opsi yang dipilih.
const recommend = (picked) => {
  const totals = {};
  picked.forEach((i) => {
    Object.entries(jurusanQuiz.options[i].scores).forEach(([key, n]) => {
      totals[key] = (totals[key] ?? 0) + n;
    });
  });
  const best = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : null;
};

const JurusanQuizSection = () => {
  const [started, setStarted] = useState(false);
  const [picked, setPicked] = useState([]);

  const toggle = (i) =>
    setPicked((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const key = recommend(picked);
  const result = key ? jurusanQuiz.results[key] : null;

  return (
    <section id="quiz-jurusan" className="bg-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-6 rounded-3xl bg-primary-50 p-6 sm:p-8 lg:grid-cols-[30%_1fr_28%]">
          {/* Ajakan */}
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary">
              <Bot className="h-7 w-7 text-white" />
            </span>
            <div>
              <h2 className="font-heading text-sm font-extrabold text-dark-900">
                Belum Tahu Memilih <span className="text-primary">Jurusan?</span>
              </h2>
              <p className="mt-2 text-[10px] leading-relaxed text-dark-500">
                {jurusanQuiz.description}
              </p>
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-800"
              >
                {jurusanQuiz.ctaText}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Pilihan minat */}
          <div className="space-y-2.5">
            {jurusanQuiz.options.map((opt, i) => {
              const on = picked.includes(i);
              return (
                <button
                  key={opt.text}
                  type="button"
                  disabled={!started}
                  aria-pressed={on}
                  onClick={() => toggle(i)}
                  className={`block w-full rounded-xl border px-4 py-3 text-left text-[11px] transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                    on
                      ? 'border-primary bg-primary text-white'
                      : 'border-dark-100 bg-white text-dark-700 enabled:hover:border-primary'
                  }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          {/* Hasil rekomendasi */}
          <div className="relative rounded-2xl border border-primary/40 bg-white p-4 shadow-card">
            <CheckCircle2
              className={`absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white transition-opacity ${
                result ? 'text-primary opacity-100' : 'text-dark-200 opacity-60'
              }`}
              fill="currentColor"
              strokeWidth={0}
            />
            <p className="text-[9px] font-bold text-primary">{jurusanQuiz.resultLabel}</p>

            {result ? (
              <>
                <h3 className="mt-1.5 font-heading text-xs font-extrabold leading-snug text-dark-900">
                  {result.name}
                </h3>
                <p className="mt-1 text-[9px] text-dark-500">{jurusanQuiz.resultNote}</p>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href="#daftar-jurusan"
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    {result.cta}
                    <ArrowRight className="h-2.5 w-2.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setPicked([])}
                    aria-label={jurusanQuiz.resetText}
                    className="text-dark-400 transition-colors hover:text-primary"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <p className="mt-2 text-[9px] leading-relaxed text-dark-400">
                {started
                  ? 'Pilih minat di samping untuk melihat rekomendasi.'
                  : 'Tekan “Mulai Sekarang” untuk mulai menjawab.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JurusanQuizSection;
