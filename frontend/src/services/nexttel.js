import { supabaseSiap } from './supabase';

export const PESAN_NEXTTEL_GAGAL = 'NextTel sedang mengalami kendala. Silakan coba lagi.';

const alamatNextTel = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nexttel`
  : '';

export async function jelaskanRekomendasiNextTel(payload, { signal } = {}) {
  if (!supabaseSiap || !alamatNextTel) throw new Error(PESAN_NEXTTEL_GAGAL);

  try {
    const response = await fetch(alamatNextTel, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || typeof data.explanation !== 'string') throw new Error(PESAN_NEXTTEL_GAGAL);
    return {
      explanation: data.explanation.trim(),
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      learningSuggestions: Array.isArray(data.learningSuggestions) ? data.learningSuggestions : [],
    };
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new Error(PESAN_NEXTTEL_GAGAL, { cause: error });
  }
}
