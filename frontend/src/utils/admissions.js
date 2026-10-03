// Keep stored identifiers unchanged; normalize only visible copy and site URLs.
export const formatAdmissionsText = (text) =>
  typeof text === 'string' ? text.replace(/\bPPDB\b/g, 'SPMB') : text;

export const canonicalAdmissionsPath = (path) => path
  .replace(/^\/ppdb(?=\/|[?#]|$)/, '/spmb')
  .replace(/^\/dashboard\/ppdb(?=\/|[?#]|$)/, '/dashboard/spmb')
  .replace(/^\/ketentuan-ppdb(?=\/|[?#]|$)/, '/ketentuan-spmb');
