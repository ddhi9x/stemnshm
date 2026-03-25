import React, { createContext, useContext, useState } from 'react';
import vi from './vi.json';
import en from './en.json';
import zh from './zh.json';

const languages = { vi, en, zh };
const langLabels = { vi: '🇻🇳', en: '🇬🇧', zh: '🇨🇳' };

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('stem_lang') || 'vi');

  const t = (path) => {
    const keys = path.split('.');
    let result = languages[lang];
    for (const key of keys) {
      result = result?.[key];
    }
    // Fallback to Vietnamese if translation not found
    if (result === undefined) {
      result = languages.vi;
      for (const key of keys) {
        result = result?.[key];
      }
    }
    return result || path;
  };

  const switchLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('stem_lang', newLang);
  };

  return (
    <I18nContext.Provider value={{ lang, t, switchLang, langLabels }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
