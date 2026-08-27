'use client'

import React, { createContext, useContext } from 'react'

import { LOCALES, translations, type Locale, type TranslationSchema } from '@/lib/translations'

type LocaleContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationSchema
  locales: typeof LOCALES
}

const LocaleContext = createContext<LocaleContextType | null>(null)
const PUBLIC_LOCALES = LOCALES.filter(({ code }) => code === 'en')

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale: Locale = 'en'
  const setLocale: LocaleContextType['setLocale'] = () => undefined

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t: translations.en, locales: PUBLIC_LOCALES }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    return {
      locale: 'en' as Locale,
      setLocale: () => {},
      t: translations.en,
      locales: PUBLIC_LOCALES,
    }
  }
  return ctx
}
