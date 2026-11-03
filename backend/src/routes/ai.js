import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db.js';
import { asyncHandler, badRequest } from '../utils/http.js';
import { hitungHasilNextTel } from '../modules/nexttel/scoring.mjs';
import { KONTEN_SEKOLAH } from '../modules/stela/konten-sekolah.mjs';

export const aiRouter = express.Router();

function hasilPenjelasan(result) {
  const labels = { RPL: 'Rekayasa Perangkat Lunak (RPL)', PG: 'Pengembangan Game (PG)', TKJ: 'Teknik Komputer dan Jaringan (TKJ)', TJAT: 'Teknik Jaringan Akses Telekomunikasi (TJAT)' };
  const label = labels[result.topRecommendation];
  return label ? { explanation: `Berdasarkan jawabanmu, skor tertinggi adalah ${label}. Hasil ini adalah panduan belajar, bukan keputusan penerimaan.`, strengths: [`Minatmu paling kuat pada ${label}.`], learningSuggestions: [`Coba proyek pemula yang berkaitan dengan ${label}.`] } : { explanation: 'Minatmu belum menunjukkan satu jurusan yang paling jelas.', strengths: ['Jawabanmu masih seimbang.'], learningSuggestions: ['Coba kegiatan di bidang software, game, jaringan, atau telekomunikasi.'] };
}

const DAILY_LIMITS = { stela: Number(process.env.STELA_MAKS_PER_HARI || 200), nexttel: Number(process.env.NEXTTEL_MAKS_PER_HARI || 200) };
async function reserveQuota(feature, limit) {
  const day = new Date(); day.setUTCHours(0, 0, 0, 0);
  try {
    const row = await prisma.aiDailyAttempt.upsert({ where: { feature_day: { feature, day } }, create: { feature, day, attempts: 1 }, update: { attempts: { increment: 1 } } });
    return row.attempts <= limit;
  } catch { return false; }
}

const stelaLimit = rateLimit({ windowMs: 60 * 1000, limit: Number(process.env.STELA_MAKS_PER_IP || 5), standardHeaders: true, legacyHeaders: false });
const nexttelLimit = rateLimit({ windowMs: 60 * 1000, limit: Number(process.env.NEXTTEL_MAKS_PER_IP || 10), standardHeaders: true, legacyHeaders: false });

aiRouter.post('/stela', stelaLimit, asyncHandler(async (req, res) => {
  const { pertanyaan } = z.object({ pertanyaan: z.string().trim().min(1).max(500) }).parse(req.body);
  if (process.env.STELA_AKTIF === 'false') return res.status(503).json({ error: 'STELA sedang nonaktif.' });
  if (!(await reserveQuota('stela', DAILY_LIMITS.stela))) return res.status(429).json({ error: 'Kuota STELA hari ini sudah habis.' });
  const apiKey = process.env.STELA_API_KEY || process.env.GEMINI_API_KEY;
  const endpoint = process.env.STELA_PROVIDER_URL;
  if (!apiKey || !endpoint) return res.status(503).json({ error: 'STELA belum dikonfigurasi.', fallback: { jawaban: KONTEN_SEKOLAH } });
  // Provider call omitted in scaffold; fallback ensures functionality without secrets.
  res.json({ reply: KONTEN_SEKOLAH, jawaban: KONTEN_SEKOLAH, sumber: 'fallback' });
}));

aiRouter.post('/nexttel', nexttelLimit, asyncHandler(async (req, res) => {
  const { answers } = z.object({ answers: z.array(z.object({ questionId: z.string(), optionId: z.string(), text: z.string().optional() })).length(8) }).parse(req.body);
  if (!(await reserveQuota('nexttel', DAILY_LIMITS.nexttel))) return res.status(429).json({ error: 'Kuota NextTel hari ini sudah habis.' });
  const result = hitungHasilNextTel(answers);
  if (!result) throw badRequest('Jawaban tidak valid.');
  res.json({ ...hasilPenjelasan(result), data: result });
}));
