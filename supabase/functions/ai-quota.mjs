// Server-only: reserve one attempt before every provider call, including failures.
/**
 * @param {{url?: string, serviceKey?: string, fitur: string, maksPerHari?: number}} config
 * @returns {(options?: {signal?: AbortSignal}) => Promise<void>}
 */
export const buatReservasiKuota = ({ url, serviceKey, fitur, maksPerHari = 500 }) => async ({ signal } = {}) => {
  const gagal = (status = 503) => Object.assign(new Error(status === 429
    ? 'Batas percobaan AI hari ini tercapai. Silakan coba lagi besok.'
    : 'Layanan AI sedang tidak tersedia. Silakan coba lagi.'), { status, untukPengguna: true, batasPanggilan: true });
  if (!url || !serviceKey) throw gagal();
  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/reserve_ai_attempt`, {
      method: 'POST', signal,
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_feature: fitur, p_limit: maksPerHari }),
    });
    if (!response.ok) throw gagal();
    const reserved = await response.json();
    if (reserved === false) throw gagal(429);
    if (reserved !== true) throw gagal();
  } catch (error) {
    if (signal?.aborted || error?.batasPanggilan) throw error;
    throw gagal();
  }
};
