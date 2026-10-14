import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import MainLayout from '../layouts/MainLayout';
import NextTelIntro from '../components/nexttel/NextTelIntro';
import NextTelQuestionnaire from '../components/nexttel/NextTelQuestionnaire';
import NextTelResult from '../components/nexttel/NextTelResult';
import { hasilFallbackNextTel, jelaskanRekomendasiNextTel, PESAN_NEXTTEL_GAGAL } from '../services/nexttel';
import { hitungHasilNextTel } from '../../../supabase/functions/nexttel/scoring.mjs';

import { NEXTTEL_QUESTIONS as QUESTIONS } from '../data/nexttelQuestions';

const NextTelPage = () => {
  const { language } = useLanguage();
  const [mode, setMode] = useState('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const mulai = () => { setMode('questionnaire'); setCurrentIndex(0); setAnswers({}); setError(null); };
  const jawab = (questionId, optionId, text = '') => setAnswers((previous) => ({ ...previous, [questionId]: { optionId, text } }));
  const selesai = async () => {
    const selectedAnswers = QUESTIONS.map(({ id: questionId }) => {
      const answer = answers[questionId];
      return { questionId, optionId: answer?.optionId, ...(answer?.optionId === 'e' ? { text: answer.text.trim() } : {}) };
    });
    const computed = hitungHasilNextTel(selectedAnswers);
    if (!computed) {
      setError(language === 'en' ? 'Please complete each answer with valid text.' : 'Lengkapi setiap jawaban dengan teks yang valid.');
      return;
    }
    setResult(computed);
    setMode('result');
    setLoading(true);
    setError(null);
    setExplanation(null);
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const response = await jelaskanRekomendasiNextTel({
        answers: selectedAnswers,
        language,
      }, { signal: controller.signal });
      if (controllerRef.current === controller && !controller.signal.aborted) setExplanation({ ...response, language });
    } catch (requestError) {
      if (requestError?.name !== 'AbortError' && controllerRef.current === controller && !controller.signal.aborted) {
        setExplanation({ ...hasilFallbackNextTel(computed, language), language });
        setError(PESAN_NEXTTEL_GAGAL);
      }
    } finally {
      if (controllerRef.current === controller) { controllerRef.current = null; setLoading(false); }
    }
  };
  const lanjut = () => {
    const answer = answers[QUESTIONS[currentIndex].id];
    if (!answer?.optionId || (answer.optionId === 'e' && !answer.text.trim())) return;
    if (currentIndex === QUESTIONS.length - 1) selesai();
    else setCurrentIndex((value) => value + 1);
  };
  const restart = () => { controllerRef.current?.abort(); controllerRef.current = null; setMode('intro'); setResult(null); setExplanation(null); setError(null); setLoading(false); };

  return (
    <MainLayout showSupportSections={false}>
      <section className="bg-white py-8 lg:py-12">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${mode === 'questionnaire' ? 'max-w-5xl' : 'max-w-7xl'}`}>
          {mode === 'intro' && <NextTelIntro onStart={mulai} />}
          {mode === 'questionnaire' && error && <p role="alert" className="mb-4 text-sm text-primary">{error}</p>}
          {mode === 'questionnaire' && <NextTelQuestionnaire questions={QUESTIONS} currentIndex={currentIndex} answers={answers} onAnswer={jawab} onNext={lanjut} onBack={() => setCurrentIndex((value) => Math.max(0, value - 1))} />}
          {mode === 'result' && result && <NextTelResult result={result} explanation={explanation} loading={loading} error={error} onRetry={selesai} onRestart={restart} />}
        </div>
      </section>
    </MainLayout>
  );
};

export default NextTelPage;
