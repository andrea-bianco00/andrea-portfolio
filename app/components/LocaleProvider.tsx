"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "it" | "en";
type LocaleContextValue = { language: Language; setLanguage: (language: Language) => void };
const LocaleContext = createContext<LocaleContextValue>({ language: "it", setLanguage: () => {} });
const KEY = "andrea-portfolio-language";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("it");
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "it" || saved === "en") setLanguageState(saved);
    } catch { /* Storage may be unavailable. */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try { window.localStorage.setItem(KEY, next); } catch { /* Optional persistence. */ }
  };
  return <LocaleContext.Provider value={{ language, setLanguage }}>{children}</LocaleContext.Provider>;
}

export function useLanguage() { return useContext(LocaleContext); }
export function T({ it, en }: { it: ReactNode; en: ReactNode }) {
  const { language } = useLanguage();
  return <>{language === "en" ? en : it}</>;
}
