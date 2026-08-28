import { AlertCircle, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

const LABELS = {
  RPL: 'Rekayasa Perangkat Lunak (RPL)',
  PG: 'Pengembangan Game (PG)',
  TKJ: 'Teknik Komputer dan Jaringan (TKJ)',
  TJAT: 'Teknik Jaringan Akses Telekomunikasi (TJAT)',
};

const NextTelResult = ({ result, explanation, loading, error, onRetry, onRestart }) => (
  <div className="mx-auto max-w-3xl space-y-5">
    <div className="rounded-3xl bg-primary px-6 py-8 text-white shadow-card sm:px-10">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/75">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Rekomendasi utama
      </div>
      <h1 className="mt-4 font-heading text-2xl font-extrabold leading-tight sm:text-4xl">
        {LABELS[result.topRecommendation]}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-white/85">
        Rekomendasi ini merupakan panduan berdasarkan minat dan jawabanmu, bukan keputusan resmi penerimaan siswa.
      </p>
    </div>

    <div className="rounded-3xl border border-dark-100 bg-white p-5 shadow-card sm:p-8">
      <h2 className="font-heading text-lg font-extrabold text-dark-900">Ringkasan skor</h2>
      <div className="mt-5 space-y-4">
        {result.ranking.map(([code, score]) => (
          <div key={code}>
            <div className="mb-1.5 flex justify-between text-xs font-semibold text-dark-600">
              <span>{LABELS[code]}</span><span>{score}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-dark-100">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(score / result.maxScore) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="rounded-3xl border border-dark-100 bg-white p-5 shadow-card sm:p-8">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="font-heading text-lg font-extrabold text-dark-900">Kenapa jurusan ini cocok?</h2>
      </div>
      {loading && <p className="mt-5 text-sm text-dark-500">NextTel sedang menyiapkan penjelasan...</p>}
      {error && (
        <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl bg-primary-50 p-4 text-sm text-primary-900">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={onRetry} className="font-bold underline">Coba lagi</button>
        </div>
      )}
      {explanation && !loading && (
        <>
          <p className="mt-5 text-sm leading-relaxed text-dark-600">{explanation.explanation}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold text-dark-900">Yang mungkin kamu sukai</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-dark-600">
                {explanation.strengths.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-dark-900">Tips mulai belajar</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-dark-600">
                {explanation.learningSuggestions.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>

    <button type="button" onClick={onRestart} className="mx-auto flex items-center gap-2 rounded-full border border-dark-200 px-5 py-2.5 text-xs font-bold text-dark-600 transition-colors hover:border-primary hover:text-primary">
      <RotateCcw className="h-4 w-4" aria-hidden="true" /> Mulai ulang
    </button>
  </div>
);

export default NextTelResult;
