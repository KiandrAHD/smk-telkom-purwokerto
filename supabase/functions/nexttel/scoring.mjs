const QUESTION_IDS = ['activity', 'interest', 'project', 'learning', 'problem', 'tool', 'work', 'future'];
const MAJOR_ORDER = ['RPL', 'PG', 'TKJ', 'TJAT'];
const SCORE_BY_OPTION = {
  a: { RPL: 3, PG: 1, TKJ: 0, TJAT: 0 },
  b: { RPL: 1, PG: 3, TKJ: 0, TJAT: 0 },
  c: { RPL: 0, PG: 0, TKJ: 3, TJAT: 1 },
  d: { RPL: 0, PG: 0, TKJ: 1, TJAT: 3 },
  // Pilihan bebas sengaja netral agar tidak mengubah kompatibilitas scoring lama.
  e: { RPL: 0, PG: 0, TKJ: 0, TJAT: 0 },
};

const MAX_FREE_TEXT = 240;

export function hitungHasilNextTel(answers) {
  if (!Array.isArray(answers) || answers.length !== QUESTION_IDS.length) return null;

  const pilihan = new Map();
  for (const answer of answers) {
    if (!answer || typeof answer.questionId !== 'string' || typeof answer.optionId !== 'string'
      || !QUESTION_IDS.includes(answer.questionId)
      || !Object.hasOwn(SCORE_BY_OPTION, answer.optionId)
      || pilihan.has(answer.questionId)) return null;
    if (answer.optionId === 'e' && (typeof answer.text !== 'string' || !answer.text.trim() || answer.text.trim().length > MAX_FREE_TEXT)) return null;
    pilihan.set(answer.questionId, answer.optionId);
  }

  const normalizedAnswers = QUESTION_IDS.map((questionId) => {
    const answer = answers.find((item) => item.questionId === questionId);
    const normalized = { questionId, optionId: pilihan.get(questionId) };
    if (normalized.optionId === 'e') normalized.text = answer.text.trim().slice(0, MAX_FREE_TEXT);
    return normalized;
  });
  const scores = Object.fromEntries(MAJOR_ORDER.map((major) => [major, 0]));
  for (const questionId of QUESTION_IDS) {
    const optionScore = SCORE_BY_OPTION[pilihan.get(questionId)];
    for (const major of MAJOR_ORDER) scores[major] += optionScore[major];
  }
  /** @type {Array<[string, number]>} */
  const ranking = [...MAJOR_ORDER]
    .sort((a, b) => scores[b] - scores[a] || MAJOR_ORDER.indexOf(a) - MAJOR_ORDER.indexOf(b))
    .map((major) => [major, scores[major]]);
  return { answers: normalizedAnswers, scores, ranking, topRecommendation: ranking[0][0], maxScore: Math.max(...Object.values(scores), 1) };
}
