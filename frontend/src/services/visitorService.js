import { supabase, supabaseSiap } from './supabase';

const SESSION_KEY = 'smk-visitor-recorded';
const STATS_CACHE_KEY = 'smk-visitor-stats';
const STATS_CACHE_TTL = 60_000;

function getVisitorHash() {
  const nav = globalThis.navigator || {};
  const raw = [
    nav.userAgent || '',
    nav.language || '',
    screen?.width || 0,
    screen?.height || 0,
    screen?.colorDepth || 0,
    Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone || '',
  ].join('|');
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36).padStart(8, '0');
}

function isRecordedToday() {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return false;
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
    return stored === today;
  } catch {
    return false;
  }
}

function markRecorded() {
  try {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
    sessionStorage.setItem(SESSION_KEY, today);
  } catch { /* noop */ }
}

export async function recordVisit() {
  if (!supabaseSiap || isRecordedToday()) return;
  try {
    const hash = getVisitorHash();
    await supabase.rpc('record_visit', { p_visitor_hash: hash });
    markRecorded();
  } catch { /* noop */ }
}

function getCachedStats() {
  try {
    const raw = sessionStorage.getItem(STATS_CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts < STATS_CACHE_TTL) return data;
  } catch { /* noop */ }
  return null;
}

function setCachedStats(data) {
  try {
    sessionStorage.setItem(STATS_CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* noop */ }
}

export async function getVisitorStats() {
  const cached = getCachedStats();
  if (cached) return cached;
  if (!supabaseSiap) return null;
  try {
    const { data, error } = await supabase.rpc('get_visitor_stats');
    if (error) throw error;
    setCachedStats(data);
    return data;
  } catch {
    return null;
  }
}
