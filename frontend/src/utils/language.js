import english from '../data/translations';

export const LANGUAGE_STORAGE_KEY = 'smk-telkom-language';

export function readLanguage() {
  try { return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'id'; }
  catch { return 'id'; }
}

export function translate(text, language, variables = {}) {
  if (typeof text !== 'string') return text;
  const value = language === 'en' && Object.hasOwn(english, text) ? english[text] : text;
  return value.replace(/\{(\w+)\}/g, (token, key) => Object.hasOwn(variables, key) ? String(variables[key]) : token);
}
