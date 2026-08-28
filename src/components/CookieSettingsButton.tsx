'use client'

import { IconCookie } from '@tabler/icons-react'

import { useCookieConsent } from '@/context/CookieConsentContext'
import { useLocale } from '@/context/LocaleContext'

const LABELS = {
  en: 'Cookie settings',
  de: 'Cookie-Einstellungen',
  hr: 'Postavke kolačića',
} as const

export function CookieSettingsButton({ floating = false }: { floating?: boolean }) {
  const { hasDecision, isReady, openSettings, settingsOpen } = useCookieConsent()
  const { locale } = useLocale()

  if (floating) {
    if (!isReady || !hasDecision || settingsOpen) return null

    return (
      <button
        type="button"
        onClick={openSettings}
        aria-label={LABELS[locale]}
        className="fixed bottom-20 right-2 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-paper/90 text-ink shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-ink/30 hover:bg-paper hover:shadow-xl active:scale-95 sm:bottom-[5.5rem] sm:right-8"
      >
        <IconCookie size={18} stroke={1.8} aria-hidden />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={openSettings}
      className="inline-flex min-h-11 items-center text-xs text-white/65 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
    >
      {LABELS[locale]}
    </button>
  )
}
