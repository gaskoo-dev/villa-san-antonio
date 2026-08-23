'use client'

import React, { createContext, useContext, useSyncExternalStore } from 'react'

import { LOCALES, translations, type Locale, type TranslationSchema } from '@/lib/translations'

type LocaleContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationSchema
  locales: typeof LOCALES
}

const LocaleContext = createContext<LocaleContextType | null>(null)

let listeners: (() => void)[] = []

function subscribe(callback: () => void) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter((l) => l !== callback)
  }
}

function getLocaleSnapshot(): Locale {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem('vsa_locale') as Locale | null
  if (saved && (saved === 'en' || saved === 'de' || saved === 'hr')) return saved
  const browser = navigator.language.toLowerCase()
  if (browser.startsWith('de')) return 'de'
  if (browser.startsWith('hr') || browser.startsWith('bs') || browser.startsWith('sr')) return 'hr'
  return 'en'
}

function getServerSnapshot(): Locale {
  return 'en'
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getLocaleSnapshot, getServerSnapshot)

  const setLocale = (l: Locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vsa_locale', l)
      document.cookie = `vsa_locale=${l};path=/;max-age=31536000;SameSite=Lax`
      document.documentElement.lang = l
      listeners.forEach((listener) => listener())
    }
  }

  const t = translations[locale] || translations.en

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, locales: LOCALES }}>
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
      locales: LOCALES,
    }
  }
  return ctx
}
