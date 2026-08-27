'use client'

import { useCookieConsent } from '@/context/CookieConsentContext'
import { useLocale } from '@/context/LocaleContext'

const LABELS = {
  en: 'Cookie settings',
  de: 'Cookie-Einstellungen',
  hr: 'Postavke kolačića',
} as const

export function CookieSettingsButton() {
  const { openSettings } = useCookieConsent()
  const { locale } = useLocale()

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
