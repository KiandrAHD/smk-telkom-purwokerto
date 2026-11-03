import { api } from './apiClient';

const normalize = (row) => ({ ...row, tipe_pekerjaan: row.tipePekerjaan ?? row.tipe_pekerjaan, link_pendaftaran: row.linkPendaftaran ?? row.link_pendaftaran, logo_url: row.logoUrl ?? row.logo_url, created_at: row.createdAt ?? row.created_at, updated_at: row.updatedAt ?? row.updated_at, deadline: row.deadline ?? null });
const parse = (data) => ({ ...data, tipePekerjaan: data.tipe_pekerjaan ?? data.tipePekerjaan, linkPendaftaran: data.link_pendaftaran ?? data.linkPendaftaran, logoUrl: data.logo_url ?? data.logoUrl });

export async function getBkk() { const response = await api.get('/api/bkk?limit=100'); return response.data.map(normalize); }
export async function getActiveBkk() { return getBkk(); }
export async function createBkk(data) { const response = await api.post('/api/bkk', parse(data)); return normalize(response.data); }
export async function updateBkk(id, data) { const response = await api.patch(`/api/bkk/${id}`, parse(data)); return normalize(response.data); }
export async function deleteBkk(id) { return api.delete(`/api/bkk/${id}`); }
