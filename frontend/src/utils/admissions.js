// Keep stored identifiers unchanged; normalize only visible copy and site URLs.
export const OFFICIAL_ADMISSIONS_URL = 'https://ppdb.telkomschools.sch.id/welcome';

export const isHiddenAdmissionsPath = (path) => /^\/(?:spmb|ppdb)(?:\/|$)/.test(path)
  || ['/ketentuan-spmb', '/ketentuan-ppdb', '/lupa-sandi', '/auth/confirm'].includes(path.replace(/\/$/, ''));

export const formatAdmissionsText = (text) =>
  typeof text === 'string' ? text.replace(/\bPPDB\b/g, 'SPMB') : text;

export const canonicalAdmissionsPath = (path) => path
  .replace(/^\/ppdb(?=\/|[?#]|$)/, '/spmb')
  .replace(/^\/dashboard\/ppdb(?=\/|[?#]|$)/, '/dashboard/spmb')
  .replace(/^\/ketentuan-ppdb(?=\/|[?#]|$)/, '/ketentuan-spmb');
