import { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import NextTelProgress from './NextTelProgress';
import NextTelOption from './NextTelOption';
import NextTelNavigation from './NextTelNavigation';

const NextTelQuestionnaire = ({ questions, currentIndex, answers, onAnswer, onNext, onBack }) => {
  const { t } = useLanguage();
  const headingRef = useRef(null);
  const question = questions[currentIndex];
  const selected = typeof answers[question.id] === 'string' ? answers[question.id] : answers[question.id]?.optionId;
  const freeText = answers[question.id]?.text ?? '';
  const selectedFreeText = selected === 'e';
  const answerReady = Boolean(selected && (!selectedFreeText || freeText.trim()));

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [currentIndex]);

  return (
    <div className="mx-auto rounded-3xl border border-dark-200 bg-white p-5 shadow-card sm:p-8 lg:p-10">
      <NextTelProgress current={currentIndex + 1} total={questions.length} />
      <div key={question.id} className="motion-filter-results">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t('Pilih satu jawaban')}</p>
        <h1 ref={headingRef} id="nexttel-question" tabIndex={-1} className="mt-3 font-heading text-2xl font-extrabold leading-snug text-dark-900 outline-none sm:text-3xl">
          {question.prompt}
        </h1>
        <div className="mt-7 space-y-4 sm:space-y-5" role="radiogroup" aria-labelledby="nexttel-question">
          {question.options.map((option) => <NextTelOption key={option.id} questionId={question.id} option={option} selected={selected} onAnswer={(id, optionId) => onAnswer(id, optionId, optionId === 'e' ? freeText : '')} />)}
        </div>
      </div>
      {selectedFreeText && (
        <div className="mt-4">
          <label htmlFor="nexttel-free-text" className="text-sm font-semibold text-dark-700">{t('Ceritakan sedikit')}</label>
          <textarea id="nexttel-free-text" value={freeText} maxLength={240} onChange={(event) => onAnswer(question.id, 'e', event.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-dark-200 p-3 text-sm text-dark-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" aria-describedby="nexttel-free-text-help" />
          <p id="nexttel-free-text-help" className="mt-1 text-xs text-dark-500">{freeText.length}/240</p>
        </div>
      )}
      <NextTelNavigation first={currentIndex === 0} last={currentIndex === questions.length - 1} selected={answerReady} onBack={onBack} onNext={onNext} />
    </div>
  );
};

export default NextTelQuestionnaire;
