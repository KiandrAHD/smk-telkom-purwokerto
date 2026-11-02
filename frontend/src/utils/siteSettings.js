export const schoolFields = { school_name: 'Nama Sekolah', npsn: 'NPSN', address: 'Alamat', phone: 'No. Telepon', email: 'Email', website: 'Website', logo_url: 'URL Logo' };
export const generalFields = { academic_year: 'Tahun Ajaran', spmb_open: 'Status SPMB', news_page_size: 'Berita per Halaman' };
export function validateSettings(data, group) {
  const errors = {};
  const http = (value, https = false) => { try { const url = new URL(value); return !/\s/.test(value) && (https ? url.protocol === 'https:' : ['http:', 'https:'].includes(url.protocol)) && !url.username && !url.password && !!url.hostname; } catch { return false; } };
  if (group === 'school') {
    if (data.school_name.trim().length < 2 || data.school_name.length > 150) errors.school_name = 'Isi nama sekolah (2–150 karakter).';
    if (!/^\d{8}$/.test(data.npsn)) errors.npsn = 'NPSN harus terdiri dari 8 angka.';
    if (data.address.trim().length < 5 || data.address.length > 1000) errors.address = 'Isi alamat (5–1000 karakter).';
    if (!/^[+\d() .-]{7,30}$/.test(data.phone) || !/^\d{7,15}$/.test(data.phone.replace(/\D/g, ''))) errors.phone = 'Nomor telepon harus memiliki 7–15 angka.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254) errors.email = 'Email tidak valid.';
    if (!http(data.website) || data.website.length > 2048) errors.website = 'Gunakan URL http/https yang valid.';
    if (data.logo_url && (!http(data.logo_url, true) || data.logo_url.length > 2048)) errors.logo_url = 'Logo harus menggunakan URL HTTPS.';
  } else if (group === 'general') {
    const years = String(data.academic_year).split('/').map(Number);
    if (!/^\d{4}\/\d{4}$/.test(data.academic_year) || years[0] < 2020 || years[0] > 2100 || years[1] !== years[0] + 1) errors.academic_year = 'Contoh tahun ajaran: 2027/2028.';
    if (!Number.isInteger(Number(data.news_page_size)) || Number(data.news_page_size) < 1 || Number(data.news_page_size) > 50) errors.news_page_size = 'Isi angka bulat 1–50.';
    if (typeof data.spmb_open !== 'boolean') errors.spmb_open = 'Pilih status SPMB.';
  }
  return errors;
}
