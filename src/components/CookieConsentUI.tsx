'use client'

import {
  IconAdjustmentsHorizontal,
  IconChartBar,
  IconExternalLink,
  IconMapPin,
  IconShieldCheck,
  IconSpeakerphone,
  IconX,
} from '@tabler/icons-react'
import Image from 'next/image'
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
    settings: 'Cookie details & settings',
    closeBanner: 'Close and reject non-essential cookies',
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
    settings: 'Cookie-Details & Einstellungen',
    closeBanner: 'Schließen und nicht notwendige Cookies ablehnen',
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
    settings: 'Detalji i postavke kolačića',
    closeBanner: 'Zatvori i odbij neobavezne kolačiće',
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
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-[1240px] overflow-hidden rounded-2xl border border-white/15 bg-ink text-white animate-fade-in sm:inset-x-5 sm:bottom-5"
    >
      <button
        type="button"
        onClick={rejectNonEssential}
        aria-label={copy.closeBanner}
        className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center text-white/60 transition-colors duration-200 hover:text-white focus-visible:outline-white"
      >
        <IconX size={18} stroke={1.8} aria-hidden />
      </button>

      <div className="grid gap-5 px-5 py-5 sm:px-7 sm:py-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:gap-12 lg:px-8 lg:py-7 lg:pr-16">
        <div className="grid min-w-0 grid-cols-[56px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 sm:flex sm:gap-6">
          <div className="relative h-14 w-14 shrink-0 sm:h-[78px] sm:w-[78px]">
            <Image
              src="/branding/logo-white.png"
              alt=""
              width={500}
              height={500}
              sizes="(min-width: 640px) 78px, 64px"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0 border-l border-white/15 pl-4 pr-10 sm:pl-6 sm:pr-12 lg:pr-0">
            <h2 className="text-balance text-2xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-[2rem]">
              {copy.bannerTitle}
            </h2>
            <p className="mt-2 hidden max-w-[60ch] text-sm leading-6 text-white/70 sm:block">
              {copy.bannerBody}
            </p>
          </div>

          <p className="col-span-2 max-w-[60ch] text-sm leading-6 text-white/70 sm:hidden">
            {copy.bannerBody}
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={acceptAll}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 px-3 text-[10px] font-semibold uppercase leading-4 tracking-[0.08rem] text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink focus-visible:outline-white sm:px-5 sm:text-xs sm:tracking-[0.1rem]"
          >
            {copy.accept}
          </button>
          <button
            type="button"
            onClick={rejectNonEssential}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 px-3 text-[10px] font-semibold uppercase leading-4 tracking-[0.08rem] text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink focus-visible:outline-white sm:px-5 sm:text-xs sm:tracking-[0.1rem]"
          >
            {copy.reject}
          </button>
          <button
            type="button"
            onClick={openSettings}
            className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.1rem] text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-white"
          >
            <IconAdjustmentsHorizontal size={16} stroke={1.7} aria-hidden />
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
                className={`absolute left-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white transition-transform duration-200 ${
                  analytics ? 'translate-x-8' : 'translate-x-0'
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
                className={`absolute left-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white transition-transform duration-200 ${
                  externalMedia ? 'translate-x-8' : 'translate-x-0'
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
