import type { Metadata } from 'next'
import { DM_Sans, Instrument_Serif } from 'next/font/google'
import React from 'react'

import { BackToTop } from '@/components/BackToTop'
import { AnalyticsInteractions } from '@/components/AnalyticsInteractions'
import { CookieConsentUI } from '@/components/CookieConsentUI'
import { CookieSettingsButton } from '@/components/CookieSettingsButton'
import { CursorDot } from '@/components/CursorDot'
import { GoogleTagManager } from '@/components/GoogleTagManager'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { CookieConsentProvider } from '@/context/CookieConsentContext'
import { LocaleProvider } from '@/context/LocaleContext'
import { SITE_URL } from '@/lib/content'
import { DEFAULT_OPEN_GRAPH, DEFAULT_TWITTER } from '@/lib/metadata'
import { getFooter, getHeader } from '@/lib/queries'
import { getRequestLocale } from '@/lib/request-locale'

import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['italic', 'normal'],
  variable: '--font-instrument',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Villa San Antonio · Private pool villa near Šibenik, Dalmatia',
    template: '%s · Villa San Antonio',
  },
  description:
    'A fully private villa for eight guests in the Dalmatian hills near Šibenik. Heated pool, BBQ house, fenced garden, pets welcome. Inquire directly for your dates.',
  icons: {
    icon: '/branding/logo-black.png',
    apple: '/branding/logo-black.png',
  },
  openGraph: DEFAULT_OPEN_GRAPH,
  twitter: DEFAULT_TWITTER,
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale()
  const [headerData, footerData] = await Promise.all([
    getHeader(locale),
    getFooter(locale),
  ])

  return (
    <html lang={locale} className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body>
        <LocaleProvider>
          <CookieConsentProvider>
            <GoogleTagManager />
            <AnalyticsInteractions />
            <CursorDot />
            <SiteHeader headerData={headerData} />
            <main id="content">{children}</main>
            <SiteFooter footerData={footerData} />
            <CookieSettingsButton floating />
            <BackToTop />
            <CookieConsentUI />
          </CookieConsentProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
