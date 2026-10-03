import english from '../data/translations';
import { formatAdmissionsText } from './admissions';

export const LANGUAGE_STORAGE_KEY = 'smk-telkom-language';

export function readLanguage() {
  try { return sessionStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'id'; }
  catch { return 'id'; }
}

export function translate(text, language, variables = {}) {
  if (typeof text !== 'string') return text;
  const displayText = formatAdmissionsText(text);
  let value = displayText;
  if (language === 'en') {
    if (Object.hasOwn(english, displayText)) value = english[displayText];
    else if (Object.hasOwn(english, text)) value = english[text];
    // Imported articles contain separate paragraphs and an attribution URL.
    else if (text.includes('\n')) value = text.split(/(\n+)/).map((part) => /^\n+$/.test(part) ? part : translate(part, language)).join('');
    else if (/^Sumber:\s*https?:\/\//.test(text)) value = text.replace(/^Sumber:/, 'Source:');
  }
  return formatAdmissionsText(value.replace(/\{(\w+)\}/g, (token, key) => Object.hasOwn(variables, key) ? String(variables[key]) : token));
}
