// Server-only: reserve one attempt before every provider call, including failures.
/**
 * @param {{url?: string, serviceKey?: string, fitur: string, maksPerHari?: number}} config
 * @returns {(options?: {signal?: AbortSignal}) => Promise<void>}
 */
export const buatReservasiKuota = ({ url, serviceKey, fitur, maksPerHari = 500 }) => async ({ signal } = {}) => {
  const gagal = (status = 503, code = 'quota_unavailable') => Object.assign(new Error(status === 429
    ? 'STELA sudah mencapai batas percakapan hari ini. Silakan coba lagi besok.'
    : 'STELA sedang mengalami gangguan layanan. Silakan coba lagi.'), { status, untukPengguna: true, batasPanggilan: true, code });
  if (!url || !serviceKey) throw gagal(503, 'config');
  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/reserve_ai_attempt`, {
      method: 'POST', signal,
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_feature: fitur, p_limit: maksPerHari }),
    });
    if (response.status === 429) throw gagal(429, 'quota_exhausted');
    if (!response.ok) throw gagal(503, 'quota_unavailable');
    const reserved = await response.json();
    if (reserved === false) throw gagal(429, 'quota_exhausted');
    if (reserved !== true) throw gagal(503, 'quota_invalid_response');
  } catch (error) {
    if (signal?.aborted || error?.batasPanggilan) throw error;
    throw gagal(503, 'quota_unavailable');
  }
};
