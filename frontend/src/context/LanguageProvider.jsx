import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LanguageContext } from './LanguageContext';
import { readLanguage, translate, LANGUAGE_STORAGE_KEY } from '../utils/language';

export default function LanguageProvider({ children }) {
  const { pathname } = useLocation();
  const [selected, setSelected] = useState(readLanguage);
  // Admin screens retain their original language; public preference is preserved.
  const language = pathname === '/login' || pathname === '/dashboard' || pathname.startsWith('/dashboard/') ? 'id' : selected;
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const value = useMemo(() => ({
    language,
    locale: language === 'en' ? 'en-US' : 'id-ID',
    t: (text, variables) => translate(text, language, variables),
    setLanguage: (next) => {
      if (!['id', 'en'].includes(next)) return;
      setSelected(next);
      try { sessionStorage.setItem(LANGUAGE_STORAGE_KEY, next); } catch { /* Storage may be disabled. */ }
    },
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
