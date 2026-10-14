export const isValidInstagramUrl = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return url.protocol === 'https:'
      && (hostname === 'instagram.com' || hostname.endsWith('.instagram.com'))
      && !url.username
      && !url.password
      && !url.port;
  } catch {
    return false;
  }
};
