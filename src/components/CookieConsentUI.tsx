'use client'

import {
  IconChartBar,
  IconCookie,
  IconExternalLink,
  IconMapPin,
  IconShieldCheck,
  IconSpeakerphone,
  IconX,
} from '@tabler/icons-react'
import React, { useEffect, useRef, useState } from 'react'

import { useCookieConsent } from '@/context/CookieConsentContext'
import { useLocale } from '@/context/LocaleContext'

const COPY = {
  en: {
    bannerLabel: 'Privacy choices',
    bannerTitle: 'Your privacy, your choice.',
    bannerBody:
      'We use one essential cookie to remember your choice. With your permission, we use analytics to improve the website and load Google Maps on location sections.',
    accept: 'Accept all',
    reject: 'Reject non-essential',
    settings: 'Choose settings',
    dialogTitle: 'Cookie settings',
    dialogBody:
      'Choose whether analytics and external maps may load. You can change or withdraw this choice at any time from the footer.',
    necessaryTitle: 'Necessary',
    necessaryBody:
      'Stores your consent choice for 6 months. It is required for these privacy controls to work.',
    alwaysActive: 'Always active',
    analyticsTitle: 'Analytics',
    analyticsBody:
      'Google Analytics measures visits and successful inquiries so we can improve the website. Names, email addresses, phone numbers and form messages are never sent.',
    mapsTitle: 'Google Maps',
    mapsBody:
      'Loads interactive maps from Google Ireland Limited. Google may process technical data such as your IP address and device information.',
    googlePrivacy: 'Google privacy policy',
    marketingTitle: 'Marketing',
    marketingBody:
      'Reserved for future Google Ads and Meta campaigns. No advertising or remarketing tags are currently active.',
    notActive: 'Not active',
    save: 'Save choices',
    close: 'Close cookie settings',
  },
  de: {
    bannerLabel: 'Datenschutzauswahl',
    bannerTitle: 'Ihre Privatsphäre, Ihre Wahl.',
    bannerBody:
      'Wir verwenden ein notwendiges Cookie, um Ihre Auswahl zu speichern. Mit Ihrer Zustimmung nutzen wir Analysen zur Verbesserung der Website und laden Google Maps.',
    accept: 'Alle akzeptieren',
    reject: 'Nicht notwendige ablehnen',
    settings: 'Einstellungen wählen',
    dialogTitle: 'Cookie-Einstellungen',
    dialogBody:
      'Wählen Sie, ob Analysen und externe Karten geladen werden dürfen. Sie können diese Auswahl jederzeit im Footer ändern oder widerrufen.',
    necessaryTitle: 'Notwendig',
    necessaryBody:
      'Speichert Ihre Einwilligung 6 Monate lang. Dies ist erforderlich, damit diese Datenschutzeinstellungen funktionieren.',
    alwaysActive: 'Immer aktiv',
    analyticsTitle: 'Analyse',
    analyticsBody:
      'Google Analytics misst Besuche und erfolgreiche Anfragen, damit wir die Website verbessern können. Namen, E-Mail-Adressen, Telefonnummern und Formularnachrichten werden niemals gesendet.',
    mapsTitle: 'Google Maps',
    mapsBody:
      'Lädt interaktive Karten von Google Ireland Limited. Google kann technische Daten wie Ihre IP-Adresse und Geräteinformationen verarbeiten.',
    googlePrivacy: 'Datenschutzerklärung von Google',
    marketingTitle: 'Marketing',
    marketingBody:
      'Vorbereitet für zukünftige Google-Ads- und Meta-Kampagnen. Derzeit sind keine Werbe- oder Remarketing-Tags aktiv.',
    notActive: 'Nicht aktiv',
    save: 'Auswahl speichern',
    close: 'Cookie-Einstellungen schließen',
  },
  hr: {
    bannerLabel: 'Postavke privatnosti',
    bannerTitle: 'Vaša privatnost, vaš izbor.',
    bannerBody:
      'Koristimo jedan nužni kolačić kako bismo zapamtili vaš izbor. Uz dopuštenje koristimo analitiku za poboljšanje stranice i učitavamo Google Maps.',
    accept: 'Prihvati sve',
    reject: 'Odbij neobavezno',
    settings: 'Odaberi postavke',
    dialogTitle: 'Postavke kolačića',
    dialogBody:
      'Odaberite smiju li se koristiti analitika i vanjske karte. Izbor možete u svakom trenutku promijeniti ili povući putem podnožja stranice.',
    necessaryTitle: 'Nužni',
    necessaryBody:
      'Čuva vaš izbor privole 6 mjeseci. Potreban je za rad ovih postavki privatnosti.',
    alwaysActive: 'Uvijek aktivno',
    analyticsTitle: 'Analitika',
    analyticsBody:
      'Google Analytics mjeri posjete i uspješne upite kako bismo poboljšali stranicu. Imena, email adrese, telefonski brojevi i sadržaj obrazaca nikada se ne šalju.',
    mapsTitle: 'Google Maps',
    mapsBody:
      'Učitava interaktivne karte tvrtke Google Ireland Limited. Google može obrađivati tehničke podatke poput IP adrese i podataka o uređaju.',
    googlePrivacy: 'Googleova pravila privatnosti',
    marketingTitle: 'Marketing',
    marketingBody:
      'Pripremljeno za buduće Google Ads i Meta kampanje. Oglašivačke i remarketing oznake trenutačno nisu aktivne.',
    notActive: 'Nije aktivno',
    save: 'Spremi izbor',
    close: 'Zatvori postavke kolačića',
  },
} as const

function ConsentBanner() {
  const { acceptAll, openSettings, rejectNonEssential } = useCookieConsent()
  const { locale } = useLocale()
  const copy = COPY[locale]

  return (
    <section
      aria-label={copy.bannerLabel}
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-[1180px] border border-white/15 bg-ink text-white shadow-[0_18px_50px_rgba(9,11,12,0.28)] sm:inset-x-5 sm:bottom-5"
    >
      <div className="grid gap-5 px-5 py-5 sm:px-7 sm:py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-white/70">
            <IconCookie size={17} stroke={1.7} aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.14rem]">
              {copy.bannerLabel}
            </p>
          </div>
          <h2 className="mt-3 text-balance text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
            {copy.bannerTitle}
          </h2>
          <p className="mt-2 max-w-[72ch] text-sm leading-6 text-white/70">
            {copy.bannerBody}
          </p>
        </div>

        <div className="grid shrink-0 gap-2 sm:grid-cols-3 lg:min-w-[480px]">
          <button
            type="button"
            onClick={rejectNonEssential}
            className="inline-flex min-h-11 items-center justify-center border border-white/35 bg-white px-5 text-xs font-semibold uppercase tracking-[0.1rem] text-ink transition-colors hover:bg-paper focus-visible:outline-white"
          >
            {copy.reject}
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="inline-flex min-h-11 items-center justify-center border border-white/35 bg-white px-5 text-xs font-semibold uppercase tracking-[0.1rem] text-ink transition-colors hover:bg-paper focus-visible:outline-white"
          >
            {copy.accept}
          </button>
          <button
            type="button"
            onClick={openSettings}
            className="inline-flex min-h-11 items-center justify-center border border-white/35 px-5 text-xs font-semibold uppercase tracking-[0.1rem] text-white transition-colors hover:bg-white/10 focus-visible:outline-white"
          >
            {copy.settings}
          </button>
        </div>
      </div>
    </section>
  )
}

function CookieSettingsDialog() {
  const {
    analyticsAllowed,
    closeSettings,
    externalMediaAllowed,
    rejectNonEssential,
    savePreferences,
  } = useCookieConsent()
  const { locale } = useLocale()
  const copy = COPY[locale]
  const [analytics, setAnalytics] = useState(analyticsAllowed)
  const [externalMedia, setExternalMedia] = useState(externalMediaAllowed)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeSettings()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [closeSettings])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/65 p-3 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeSettings()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        aria-describedby="cookie-settings-description"
        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto bg-paper text-ink shadow-[0_24px_80px_rgba(9,11,12,0.35)]"
      >
        <div className="flex items-start justify-between gap-6 border-b border-ink/10 px-5 py-5 sm:px-8 sm:py-7">
          <div className="min-w-0">
            <h2
              id="cookie-settings-title"
              className="text-balance text-3xl font-medium tracking-[-0.03em] sm:text-4xl"
            >
              {copy.dialogTitle}
            </h2>
            <p
              id="cookie-settings-description"
              className="mt-2 max-w-[58ch] text-sm leading-6 text-ink/70"
            >
              {copy.dialogBody}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeSettings}
            aria-label={copy.close}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-white"
          >
            <IconX size={19} stroke={1.7} aria-hidden />
          </button>
        </div>

        <div className="space-y-0 px-5 sm:px-8">
          <div className="grid gap-4 border-b border-ink/10 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex min-w-0 gap-3.5">
              <IconShieldCheck className="mt-0.5 shrink-0 text-ink/65" size={21} stroke={1.6} aria-hidden />
              <div>
                <h3 className="text-base font-semibold">{copy.necessaryTitle}</h3>
                <p className="mt-1 max-w-[52ch] text-sm leading-6 text-ink/65">
                  {copy.necessaryBody}
                </p>
              </div>
            </div>
            <span className="inline-flex min-h-8 w-fit items-center border border-ink/15 bg-surface px-3 text-xs font-semibold text-ink/75">
              {copy.alwaysActive}
            </span>
          </div>

          <div className="grid gap-4 border-b border-ink/10 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex min-w-0 gap-3.5">
              <IconChartBar className="mt-0.5 shrink-0 text-ink/65" size={21} stroke={1.6} aria-hidden />
              <div>
                <h3 className="text-base font-semibold">{copy.analyticsTitle}</h3>
                <p className="mt-1 max-w-[52ch] text-sm leading-6 text-ink/65">
                  {copy.analyticsBody}
                </p>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold underline decoration-1 underline-offset-4 hover:opacity-70"
                >
                  {copy.googlePrivacy}
                  <IconExternalLink size={14} stroke={1.7} aria-hidden />
                </a>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={analytics}
              aria-label={copy.analyticsTitle}
              onClick={() => setAnalytics((allowed) => !allowed)}
              className={`relative h-11 w-[68px] shrink-0 rounded-full border transition-colors ${
                analytics
                  ? 'border-ink bg-ink'
                  : 'border-ink/25 bg-surface-deep'
              }`}
            >
              <span
                aria-hidden
                className={`absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white transition-transform duration-200 ${
                  analytics ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid gap-4 border-b border-ink/10 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex min-w-0 gap-3.5">
              <IconMapPin className="mt-0.5 shrink-0 text-ink/65" size={21} stroke={1.6} aria-hidden />
              <div>
                <h3 className="text-base font-semibold">{copy.mapsTitle}</h3>
                <p className="mt-1 max-w-[52ch] text-sm leading-6 text-ink/65">
                  {copy.mapsBody}
                </p>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold underline decoration-1 underline-offset-4 hover:opacity-70"
                >
                  {copy.googlePrivacy}
                  <IconExternalLink size={14} stroke={1.7} aria-hidden />
                </a>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={externalMedia}
              aria-label={copy.mapsTitle}
              onClick={() => setExternalMedia((allowed) => !allowed)}
              className={`relative h-11 w-[68px] shrink-0 rounded-full border transition-colors ${
                externalMedia
                  ? 'border-ink bg-ink'
                  : 'border-ink/25 bg-surface-deep'
              }`}
            >
              <span
                aria-hidden
                className={`absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white transition-transform duration-200 ${
                  externalMedia ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid gap-4 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex min-w-0 gap-3.5">
              <IconSpeakerphone className="mt-0.5 shrink-0 text-ink/65" size={21} stroke={1.6} aria-hidden />
              <div>
                <h3 className="text-base font-semibold">{copy.marketingTitle}</h3>
                <p className="mt-1 max-w-[52ch] text-sm leading-6 text-ink/65">
                  {copy.marketingBody}
                </p>
              </div>
            </div>
            <span className="inline-flex min-h-8 w-fit items-center border border-ink/15 bg-surface px-3 text-xs font-semibold text-ink/75">
              {copy.notActive}
            </span>
          </div>
        </div>

        <div className="grid gap-2 border-t border-ink/10 px-5 py-5 sm:grid-cols-2 sm:px-8 sm:py-6">
          <button
            type="button"
            onClick={rejectNonEssential}
            className="inline-flex min-h-11 items-center justify-center border border-ink bg-ink px-5 text-xs font-semibold uppercase tracking-[0.1rem] text-white transition-opacity hover:opacity-80"
          >
            {copy.reject}
          </button>
          <button
            type="button"
            onClick={() => savePreferences({ analytics, externalMedia, marketing: false })}
            className="inline-flex min-h-11 items-center justify-center border border-ink bg-ink px-5 text-xs font-semibold uppercase tracking-[0.1rem] text-white transition-opacity hover:opacity-80"
          >
            {copy.save}
          </button>
        </div>
      </div>
    </div>
  )
}

export function CookieConsentUI() {
  const { hasDecision, isReady, settingsOpen } = useCookieConsent()

  if (!isReady) return null

  return (
    <>
      {!hasDecision && !settingsOpen ? <ConsentBanner /> : null}
      {settingsOpen ? <CookieSettingsDialog /> : null}
    </>
  )
}
