import { useEffect, useRef, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import NextTelIntro from '../components/nexttel/NextTelIntro';
import NextTelQuestionnaire from '../components/nexttel/NextTelQuestionnaire';
import NextTelResult from '../components/nexttel/NextTelResult';
import { jelaskanRekomendasiNextTel, PESAN_NEXTTEL_GAGAL } from '../services/nexttel';

const QUESTIONS = [
  { id: 'activity', prompt: 'Aktivitas yang paling kamu sukai?', options: [{ id: 'a', label: 'Membuat aplikasi' }, { id: 'b', label: 'Membuat game' }, { id: 'c', label: 'Mengatur jaringan' }, { id: 'd', label: 'Teknologi telekomunikasi' }] },
  { id: 'interest', prompt: 'Kamu lebih tertarik pada?', options: [{ id: 'a', label: 'Coding' }, { id: 'b', label: 'Game' }, { id: 'c', label: 'Hardware dan networking' }, { id: 'd', label: 'Jaringan telekomunikasi' }] },
  { id: 'project', prompt: 'Saat membuat project, kamu lebih memilih?', options: [{ id: 'a', label: 'Website atau aplikasi' }, { id: 'b', label: 'Game interaktif' }, { id: 'c', label: 'Infrastruktur jaringan' }, { id: 'd', label: 'Sistem komunikasi' }] },
  { id: 'learning', prompt: 'Kamu lebih suka belajar?', options: [{ id: 'a', label: 'Programming' }, { id: 'b', label: 'Game development' }, { id: 'c', label: 'Networking' }, { id: 'd', label: 'Telekomunikasi' }] },
  { id: 'problem', prompt: 'Masalah seperti apa yang ingin kamu selesaikan?', options: [{ id: 'a', label: 'Membuat solusi digital' }, { id: 'b', label: 'Menciptakan pengalaman bermain' }, { id: 'c', label: 'Membuat koneksi perangkat stabil' }, { id: 'd', label: 'Menghubungkan komunikasi jarak jauh' }] },
  { id: 'tool', prompt: 'Alat atau bidang mana yang paling membuatmu penasaran?', options: [{ id: 'a', label: 'Editor kode dan database' }, { id: 'b', label: 'Game engine dan desain' }, { id: 'c', label: 'Router dan server' }, { id: 'd', label: 'Kabel fiber dan perangkat akses' }] },
  { id: 'work', prompt: 'Jenis karya apa yang ingin kamu buat?', options: [{ id: 'a', label: 'Aplikasi yang membantu orang' }, { id: 'b', label: 'Game yang seru dimainkan' }, { id: 'c', label: 'Jaringan yang aman dan cepat' }, { id: 'd', label: 'Infrastruktur telekomunikasi' }] },
  { id: 'future', prompt: 'Bayangan pekerjaan masa depan yang paling menarik?', options: [{ id: 'a', label: 'Software developer' }, { id: 'b', label: 'Game developer' }, { id: 'c', label: 'Network engineer' }, { id: 'd', label: 'Teknisi telekomunikasi' }] },
];

const MAJOR_ORDER = ['RPL', 'PG', 'TKJ', 'TJAT'];
const SCORE_BY_OPTION = {
  a: { RPL: 3, PG: 1, TKJ: 0, TJAT: 0 },
  b: { RPL: 1, PG: 3, TKJ: 0, TJAT: 0 },
  c: { RPL: 0, PG: 0, TKJ: 3, TJAT: 1 },
  d: { RPL: 0, PG: 0, TKJ: 1, TJAT: 3 },
};

const hitungHasil = (answers) => {
  const scores = Object.fromEntries(MAJOR_ORDER.map((major) => [major, 0]));
  Object.values(answers).forEach((optionId) => {
    MAJOR_ORDER.forEach((major) => { scores[major] += SCORE_BY_OPTION[optionId][major]; });
  });
  const ranking = [...MAJOR_ORDER].sort((a, b) => scores[b] - scores[a] || MAJOR_ORDER.indexOf(a) - MAJOR_ORDER.indexOf(b)).map((major) => [major, scores[major]]);
  return { scores, ranking, topRecommendation: ranking[0][0], maxScore: Math.max(...Object.values(scores), 1) };
};

const NextTelPage = () => {
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
  const jawab = (questionId, optionId) => setAnswers((previous) => ({ ...previous, [questionId]: optionId }));
  const selesai = async () => {
    const computed = hitungHasil(answers);
    setResult(computed);
    setMode('result');
    setLoading(true);
    setError(null);
    setExplanation(null);
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const response = await jelaskanRekomendasiNextTel({
        answers: Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId })),
        scores: computed.scores,
        topRecommendation: computed.topRecommendation,
      }, { signal: controller.signal });
      setExplanation(response);
    } catch (requestError) {
      if (requestError?.name !== 'AbortError') setError(PESAN_NEXTTEL_GAGAL);
    } finally {
      if (controllerRef.current === controller) { controllerRef.current = null; setLoading(false); }
    }
  };
  const lanjut = () => (currentIndex === QUESTIONS.length - 1 ? selesai() : setCurrentIndex((value) => value + 1));
  const restart = () => { controllerRef.current?.abort(); setMode('intro'); setResult(null); setExplanation(null); setError(null); setLoading(false); };

  return (
    <MainLayout>
      <section className="bg-white py-8 lg:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {mode === 'intro' && <NextTelIntro onStart={mulai} />}
          {mode === 'questionnaire' && <NextTelQuestionnaire questions={QUESTIONS} currentIndex={currentIndex} answers={answers} onAnswer={jawab} onNext={lanjut} onBack={() => setCurrentIndex((value) => Math.max(0, value - 1))} />}
          {mode === 'result' && result && <NextTelResult result={result} explanation={explanation} loading={loading} error={error} onRetry={selesai} onRestart={restart} />}
        </div>
      </section>
    </MainLayout>
  );
};

export default NextTelPage;
