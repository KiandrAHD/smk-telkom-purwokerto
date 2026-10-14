import { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import NextTelProgress from './NextTelProgress';
import NextTelOption from './NextTelOption';
import NextTelNavigation from './NextTelNavigation';

const NextTelQuestionnaire = ({ questions, currentIndex, answers, onAnswer, onNext, onBack }) => {
  const { t } = useLanguage();
  const headingRef = useRef(null);
  const question = questions[currentIndex];
  const selected = answers[question.id];

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
          {question.options.map((option) => <NextTelOption key={option.id} questionId={question.id} option={option} selected={selected} onAnswer={onAnswer} />)}
        </div>
      </div>
      <NextTelNavigation first={currentIndex === 0} last={currentIndex === questions.length - 1} selected={selected} onBack={onBack} onNext={onNext} />
    </div>
  );
};

export default NextTelQuestionnaire;
