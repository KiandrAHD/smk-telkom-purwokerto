// NextTel: AI penjelasan rekomendasi jurusan SMK Telkom Purwokerto.
// Fitur utama:
//   - Bilingual: language "id" => output Indonesia, "en" => output Inggris, fallback "id".
//   - Provider failover memakai lapisan penyedia STELA (inti.mjs), bukan mengulang logik sendiri.
//   - NEXTTEL_* keys diprioritaskan; shared keys dipakai sebagai cadangan.
//   - Request invalid tetap 400; kegagalan model/provider memakai failover/fallback.
//   - Parser JSON robust (raw maupun ```json ... ```).
//   - Fallback deterministik bilingual bila semua AI gagal atau output tidak valid.

import { pilihPenyedia, MODEL_BAWAAN, POLA_KUNCI } from '../stela/inti.mjs';
import { hitungHasilNextTel } from './scoring.mjs';
import { jelaskanHasilNextTel } from './inti.mjs';
import { buatReservasiKuota } from '../ai-quota.mjs';

const reservasiKuota = buatReservasiKuota({
  url: Deno.env.get('SUPABASE_URL'), serviceKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), fitur: 'nexttel',
  maksPerHari: Number(Deno.env.get('NEXTTEL_MAKS_PER_HARI')) || 500,
});

const KUNCI_KHUSUS: Record<string, string | undefined> = {
  gemini: Deno.env.get('NEXTTEL_GEMINI_API_KEY'),
  ninerouter: Deno.env.get('NEXTTEL_NINEROUTER_KEY'),
  anthropic: Deno.env.get('NEXTTEL_ANTHROPIC_API_KEY'),
  groq: Deno.env.get('NEXTTEL_GROQ_API_KEY'),
};
const KUNCI_BERSAMA: Record<string, string | undefined> = {
  ninerouter: Deno.env.get('NINEROUTER_KEY'),
  anthropic: Deno.env.get('ANTHROPIC_API_KEY'),
  gemini: Deno.env.get('GEMINI_API_KEY'),
  groq: Deno.env.get('GROQ_API_KEY'),
};

const KUNCI = Object.fromEntries(
  Object.keys(KUNCI_KHUSUS).map((p) => [p, KUNCI_KHUSUS[p] ?? KUNCI_BERSAMA[p]]),
) as Record<string, string | undefined>;

const PENYEDIA_DEFAULT = Object.entries(KUNCI_KHUSUS).find(([, key]) => key)?.[0]
  ?? pilihPenyedia({
    ninerouterKey: KUNCI_BERSAMA.ninerouter,
    anthropicKey: KUNCI_BERSAMA.anthropic,
    geminiKey: KUNCI_BERSAMA.gemini,
    groqKey: KUNCI_BERSAMA.groq,
  });

const NINEROUTER_BASE_URL = Deno.env.get('NEXTTEL_NINEROUTER_URL') ?? Deno.env.get('NINEROUTER_URL');
const MODEL = (PENYEDIA_DEFAULT === 'ninerouter'
  ? Deno.env.get('NEXTTEL_NINEROUTER_MODEL') ?? Deno.env.get('NINEROUTER_MODEL')
  : undefined)
  || Deno.env.get('NEXTTEL_MODEL')
  || undefined;

const ALLOWED_ORIGINS = (Deno.env.get('NEXTTEL_ALLOWED_ORIGINS') ?? '').split(',').map((o) => o.trim()).filter(Boolean);
const MAX_BODY = 6000;
const MAX_REQUESTS = 20;
const WINDOW_MS = 5 * 60 * 1000;
const FALLBACK_LANGUAGE = 'id';
const ALLOWED_LANGUAGES = new Set(['id', 'en']);
const ALLOWED_MAJORS = ['RPL', 'PG', 'TKJ', 'TJAT'];

const visits = new Map<string, { count: number; reset: number }>();

const allowed = (origin: string | null) =>
  ALLOWED_ORIGINS.includes('*')
  || (!origin && ALLOWED_ORIGINS.length === 0)
  || (!!origin && ALLOWED_ORIGINS.includes(origin));

const cors = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowed(origin) ? origin : ALLOWED_ORIGINS.includes('*') ? '*' : 'null',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  Vary: 'Origin',
});

const reply = (body: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(origin), 'Content-Type': 'application/json' } });

const fail = (origin: string | null) =>
  reply({ error: 'NextTel sedang mengalami kendala. Silakan coba lagi.' }, 500, origin);

const rateLimited = (key: string) => {
  const now = Date.now();
  const current = visits.get(key);
  if (!current || now > current.reset) {
    visits.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS;
};

const normalizeLanguage = (lang: unknown) => {
  const l = String(lang ?? FALLBACK_LANGUAGE).trim().toLowerCase();
  return ALLOWED_LANGUAGES.has(l) ? l : FALLBACK_LANGUAGE;
};

const kunciValid = (penyedia: string, key: string | undefined) =>
  !!key && !!POLA_KUNCI[penyedia as keyof typeof POLA_KUNCI]?.test(key);

const buildDaftarPenyedia = () => {
  const daftar: { penyedia: string; apiKey: string; model?: string; baseUrl?: string }[] = [];
  const ditambahkan = new Set<string>();
  // Prioritas: penyedia yang punya kunci khusus dulu, lalu sisanya dari shared keys.
  for (const p of Object.keys(KUNCI_KHUSUS)) {
    const key = KUNCI[p];
    if (kunciValid(p, key)) {
      daftar.push({
        penyedia: p,
        apiKey: key!,
        model: p === 'ninerouter' ? Deno.env.get('NEXTTEL_NINEROUTER_MODEL') ?? Deno.env.get('NINEROUTER_MODEL') ?? MODEL_BAWAAN[p] : MODEL,
        baseUrl: p === 'ninerouter' ? NINEROUTER_BASE_URL : undefined,
      });
      ditambahkan.add(p);
    }
  }
  for (const p of Object.keys(KUNCI_BERSAMA)) {
    if (ditambahkan.has(p)) continue;
    const key = KUNCI[p];
    if (kunciValid(p, key)) {
      daftar.push({
        penyedia: p,
        apiKey: key!,
        model: p === 'ninerouter' ? Deno.env.get('NINEROUTER_MODEL') ?? MODEL_BAWAAN[p] : MODEL,
        baseUrl: p === 'ninerouter' ? NINEROUTER_BASE_URL : undefined,
      });
      ditambahkan.add(p);
    }
  }
  return daftar;
};

const bodyJson = async (request: Request): Promise<unknown> => {
  const raw = await request.text();
  if (raw.length > MAX_BODY) throw new Error('body too large');
  if (!raw.trim()) return {};
  return JSON.parse(raw);
};

Deno.serve(async (request) => {
  const origin = request.headers.get('origin');
  if (!allowed(origin)) return reply({ error: 'Origin tidak diizinkan.' }, 403, origin);
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors(origin) });
  if (request.method !== 'POST') return reply({ error: 'Gunakan metode POST.' }, 405, origin);
  if (rateLimited(request.headers.get('x-forwarded-for') ?? 'unknown')) return reply({ error: 'Terlalu banyak permintaan.' }, 429, origin);

  try {
    const body = await bodyJson(request);
    if (!body || typeof body !== 'object') return reply({ error: 'Body tidak valid.' }, 400, origin);

    const answers = (body as Record<string, unknown>).answers;
    const result = hitungHasilNextTel(answers);
    if (!result) return reply({ error: 'Jawaban NextTel tidak valid.' }, 400, origin);

    const requestedLanguage = (body as Record<string, unknown>).language;
    if (requestedLanguage !== undefined && !ALLOWED_LANGUAGES.has(requestedLanguage as string)) return reply({ error: 'Unsupported language.' }, 400, origin);
    const lang = normalizeLanguage(requestedLanguage) as 'id' | 'en';
    const output = await jelaskanHasilNextTel({ hasil: result, language: lang, daftarPenyedia: buildDaftarPenyedia(),
      sebelumPanggilan: reservasiKuota, signal: request.signal });
    return reply(output, 200, origin);
  } catch (error) {
    if ((error as Error)?.message === 'body too large') return reply({ error: 'Isi permintaan terlalu besar.' }, 413, origin);
    if (error instanceof SyntaxError) return reply({ error: 'Format JSON tidak valid.' }, 400, origin);
    console.error('NextTel unhandled error:', error);
    return fail(origin);
  }
});
