import { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AlertCircle, ChartNoAxesCombined, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import HeroBreadcrumb from '../HeroBreadcrumb';
import NextTelRadar from './NextTelRadar';

const LABELS = {
  RPL: 'Rekayasa Perangkat Lunak (RPL)',
  PG: 'Pengembangan Game (PG)',
  TKJ: 'Teknik Komputer dan Jaringan (TKJ)',
  TJAT: 'Teknik Jaringan Akses Telekomunikasi (TJAT)',
};

const NextTelResult = ({ result, explanation, loading, error, onRetry, onRestart }) => {
  const { t, language } = useLanguage();
  const headingRef = useRef(null);
  const languageChanged = explanation?.language && explanation.language !== language;

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      <HeroBreadcrumb current="Hasil tes minat" parent="NextTel AI" parentTo="/nexttel" />
      <div className="rounded-3xl bg-primary px-6 py-8 text-white sm:px-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/85">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {t('Rekomendasi utama')}
        </div>
        <h1 ref={headingRef} tabIndex={-1} className="mt-3 font-heading text-2xl font-extrabold leading-tight outline-none sm:text-3xl">{t(LABELS[result.topRecommendation])}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85">{t('Rekomendasi ini merupakan panduan berdasarkan minat dan jawabanmu, bukan keputusan resmi penerimaan siswa.')}</p>
      </div>

      <section className="rounded-2xl border border-dark-200 bg-white p-5 sm:p-8" aria-labelledby="nexttel-statistics">
        <h2 id="nexttel-statistics" className="flex items-center gap-2 font-heading text-xl font-bold text-dark-900">
          <ChartNoAxesCombined className="h-5 w-5 text-dark-500" aria-hidden="true" /> {t('Statistik Minat Jurusan')}
        </h2>
        <div className="mt-6 grid items-center gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <NextTelRadar ranking={result.ranking} labels={LABELS} />
          <div className="rounded-2xl border border-dark-200 p-4 sm:p-5">
            <div aria-hidden="true" className="mb-5 flex flex-wrap justify-center gap-4 text-xs text-dark-600">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-primary" />{t('Nilai Kamu')}</span>
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-dark-200" />{t('Skala Maksimum')}</span>
            </div>
            <table className="w-full text-left text-sm text-dark-600">
              <caption className="sr-only">{t('Ringkasan skor')}</caption>
              <thead className="sr-only"><tr><th scope="col">{t('Jurusan')}</th><th scope="col">{t('Skor')}</th></tr></thead>
              <tbody>{result.ranking.map(([code, score]) => (
                <tr key={code} className="border-t border-dark-200">
                  <th scope="row" className="py-4 font-normal"><abbr title={t(LABELS[code])} className="no-underline">{code}</abbr></th>
                  <td className="py-4 text-right font-semibold">{score}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-dark-200 bg-white p-5 sm:p-8" aria-labelledby="nexttel-explanation">
        <h2 id="nexttel-explanation" className="flex items-center gap-2 font-heading text-xl font-bold text-dark-900">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" /> {t('Kenapa jurusan ini cocok?')}
        </h2>
        {loading && <p role="status" className="mt-5 text-sm text-dark-600">{t('NextTel sedang menyiapkan penjelasan...')}</p>}
        {(error || languageChanged) && !loading && (
          <div role="alert" className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-primary-50 px-4 py-2 text-sm text-primary">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 flex-1">{t(languageChanged ? 'Coba lagi untuk mendapatkan penjelasan dalam bahasa yang dipilih.' : error)}</span>
            <button type="button" onClick={onRetry} className="min-h-11 rounded-sm px-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{t('Coba lagi')}</button>
          </div>
        )}
        {explanation && !loading && !languageChanged && (
          <>
            <p className="mt-5 text-sm leading-relaxed text-dark-600">{t(explanation.explanation)}</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-bold text-dark-900">{t('Yang mungkin kamu sukai')}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-dark-600">
                  {explanation.strengths.map((item) => <li key={item}>{t(item)}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-dark-900">{t('Tips mulai belajar')}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-dark-600">
                  {explanation.learningSuggestions.map((item) => <li key={item}>{t(item)}</li>)}
                </ul>
              </div>
            </div>
          </>
        )}
        <button type="button" onClick={onRestart} className="mx-auto mt-8 flex min-h-11 items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> {t('Mulai ulang')}
        </button>
      </section>
    </div>
  );
};

export default NextTelResult;
