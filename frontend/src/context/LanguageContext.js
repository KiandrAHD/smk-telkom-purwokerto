import { createContext, useContext } from 'react';
import { translate } from '../utils/language';

export const LanguageContext = createContext({
  language: 'id', locale: 'id-ID', t: (text, variables) => translate(text, 'id', variables), setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);
