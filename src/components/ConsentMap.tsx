'use client'

import { IconExternalLink, IconMapPin } from '@tabler/icons-react'

import { useCookieConsent } from '@/context/CookieConsentContext'
import { useLocale } from '@/context/LocaleContext'
import { useAnalytics } from '@/hooks/useAnalytics'

const COPY = {
  en: {
    title: 'Google Maps is blocked',
    body: 'The map will load only after you allow external media.',
    allow: 'Allow and load map',
    external: 'Open Google Maps',
  },
  de: {
    title: 'Google Maps ist blockiert',
    body: 'Die Karte wird erst geladen, wenn Sie externe Medien erlauben.',
    allow: 'Erlauben und Karte laden',
    external: 'Google Maps öffnen',
  },
  hr: {
    title: 'Google Maps je blokiran',
    body: 'Karta će se učitati tek nakon što dopustite vanjski sadržaj.',
    allow: 'Dopusti i učitaj kartu',
    external: 'Otvori Google Maps',
  },
} as const

export function ConsentMap({
  className = '',
  directUrl,
  embedUrl,
  showDirectLink = true,
  title,
}: {
  className?: string
  directUrl: string
  embedUrl: string
  showDirectLink?: boolean
  title: string
}) {
  const { allowExternalMedia, externalMediaAllowed, isReady } = useCookieConsent()
  const { locale } = useLocale()
  const track = useAnalytics()
  const copy = COPY[locale]

  if (externalMediaAllowed) {
    return (
      <a
        href={directUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative block cursor-pointer overflow-hidden ${className}`}
        aria-label={copy.external}
      >
        <iframe
          src={embedUrl}
          title={title}
          className="pointer-events-none absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
        />
      </a>
    )
  }

  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-surface px-5 py-8 ${className}`}
    >
      <div className="max-w-md text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 bg-paper text-ink">
          <IconMapPin size={19} stroke={1.6} aria-hidden />
        </span>
        <p className="mt-4 text-lg font-semibold tracking-[-0.02em] text-ink">{copy.title}</p>
        <p className="mx-auto mt-1 max-w-[38ch] text-sm leading-6 text-ink/65">{copy.body}</p>
        <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              track('map_open', { interaction: 'embedded_map' })
              allowExternalMedia()
            }}
            disabled={!isReady}
            className="inline-flex min-h-11 items-center justify-center bg-ink px-5 text-xs font-semibold uppercase tracking-[0.09rem] text-white transition-opacity hover:opacity-80 disabled:cursor-wait disabled:opacity-50"
          >
            {copy.allow}
          </button>
          {showDirectLink ? (
            <a
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 px-4 text-sm font-semibold text-ink underline decoration-1 underline-offset-4 hover:opacity-70"
            >
              {copy.external}
              <IconExternalLink size={14} stroke={1.7} aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
