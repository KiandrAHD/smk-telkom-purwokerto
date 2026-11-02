import { ensureSupabase } from './supabase';
import { saveWithContentImage } from './contentImageService';
import { generalFields, schoolFields, validateSettings } from '../utils/siteSettings';

const unwrap = ({data,error}) => { if (error) throw error; return data; };
export const getSiteSettings = async () => unwrap(await ensureSupabase().from('site_settings').select('*').eq('id',true).single());
export async function requireAdmin(client = ensureSupabase()) {
  const { user } = unwrap(await client.auth.getUser());
  if (!user || !unwrap(await client.from('admins').select('id').eq('user_id',user.id).maybeSingle())) throw new Error('Akses admin diperlukan.');
  return user;
}
export async function saveSiteSettings(data, group, revision, file) {
  const client = ensureSupabase(); await requireAdmin(client);
  if (!['school','general'].includes(group)) throw new Error('Kelompok pengaturan tidak valid.');
  const fields = group === 'school' ? schoolFields : generalFields;
  const payload = Object.fromEntries(Object.keys(fields).map(key => [key, typeof data[key] === 'string' ? data[key].trim() : data[key]]));
  if (group === 'general') payload.news_page_size = Number(payload.news_page_size);
  if (Object.keys(validateSettings(payload,group)).length) throw new Error('Periksa kembali isian pengaturan.');
  const persist = async values => {
    const saved = unwrap(await client.from('site_settings').update(values).eq('id',true).eq('revision',revision).select('*').maybeSingle());
    if (!saved) throw new Error('Pengaturan telah berubah atau akses ditolak. Muat ulang sebelum menyimpan kembali.');
    const verified = await getSiteSettings();
    if (verified.revision !== saved.revision) throw new Error('Data berubah lagi setelah disimpan. Muat ulang untuk melihat versi terbaru.');
    window.dispatchEvent(new Event('site-settings-changed'));
    try { localStorage.setItem('site-settings-changed', String(Date.now())); } catch { /* Focus refresh remains available. */ }
    return verified;
  };
  if (group === 'school') return saveWithContentImage(client,{...payload,logo_url:payload.logo_url || null,image_file:file},'school-logo','logo_url',persist);
  return persist(payload);
}
export async function saveAdminAccount({full_name,email}, redirectTo) {
  const client = ensureSupabase(); const user = await requireAdmin(client);
  full_name = full_name.trim(); email = email.trim();
  if (!full_name || full_name.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Nama atau email akun tidak valid.');
  const changes = { data: { full_name } };
  if (email !== user.email) changes.email = email;
  unwrap(await client.auth.updateUser(changes, {emailRedirectTo:redirectTo}));
  const verified = unwrap(await client.auth.getUser()).user;
  if (verified.user_metadata?.full_name !== full_name) throw new Error('Nama akun belum dapat diverifikasi. Muat ulang untuk memeriksa.');
  return {user:verified,emailPending:!!changes.email};
}
