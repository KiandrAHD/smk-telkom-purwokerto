import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import NextTelProgress from './NextTelProgress';

const NextTelQuestionnaire = ({ questions, currentIndex, answers, onAnswer, onNext, onBack }) => {
  const { t } = useLanguage();
  const question = questions[currentIndex];
  const selected = typeof answers[question.id] === 'string' ? answers[question.id] : answers[question.id]?.optionId;
  const freeText = answers[question.id]?.text ?? '';
  const isLast = currentIndex === questions.length - 1;
  const selectedFreeText = selected === 'e';
  const answerReady = Boolean(selected && (!selectedFreeText || freeText.trim()));

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-dark-100 bg-white p-5 shadow-card sm:p-8">
      <NextTelProgress current={currentIndex + 1} total={questions.length} />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t("Pilih satu jawaban")}</p>
      <h1 className="mt-3 font-heading text-2xl font-extrabold leading-snug text-dark-900 sm:text-3xl">
        {t(question.prompt)}
      </h1>
      <div className="mt-7 space-y-3" role="radiogroup" aria-label={t(question.prompt)}>
        {question.options.map((option) => {
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onAnswer(question.id, option.id, option.id === 'e' ? freeText : '')}
              className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-4 text-left text-sm transition-colors ${
                active
                  ? 'border-primary bg-primary-50 text-primary-900'
                  : 'border-dark-200 text-dark-700 hover:border-primary hover:bg-primary-50/50'
              }`}
            >
              <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-primary text-white' : 'bg-dark-100 text-dark-600'}`}>
                {option.id.toUpperCase()}
              </span>
              <span className="pt-1">{t(option.label)}</span>
            </button>
          );
        })}
      </div>
      {selectedFreeText && (
        <div className="mt-4">
          <label htmlFor="nexttel-free-text" className="text-sm font-semibold text-dark-700">{t('Ceritakan sedikit')}</label>
          <textarea id="nexttel-free-text" value={freeText} maxLength={240} onChange={(event) => onAnswer(question.id, 'e', event.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-dark-200 p-3 text-sm text-dark-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" aria-describedby="nexttel-free-text-help" />
          <p id="nexttel-free-text-help" className="mt-1 text-xs text-dark-500">{freeText.length}/240</p>
        </div>
      )}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 rounded-full border border-dark-200 px-5 py-2.5 text-xs font-bold text-dark-600 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t("Kembali")} </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!answerReady}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white transition-opacity hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t(isLast ? 'Lihat hasil' : 'Lanjut')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default NextTelQuestionnaire;
