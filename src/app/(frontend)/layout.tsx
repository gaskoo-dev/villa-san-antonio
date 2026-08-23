import type { Metadata } from 'next'
import { DM_Sans, Instrument_Serif } from 'next/font/google'
import React from 'react'

import { BackToTop } from '@/components/BackToTop'
import { CursorDot } from '@/components/CursorDot'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { LocaleProvider } from '@/context/LocaleContext'
import { SITE_URL } from '@/lib/content'
import { getNavPages } from '@/lib/queries'

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
  openGraph: {
    siteName: 'Villa San Antonio',
    type: 'website',
    locale: 'en_GB',
  },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const navPages = await getNavPages()

  return (
    <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body>
        <LocaleProvider>
          <CursorDot />
          <SiteHeader cmsNavLinks={navPages} />
          <main id="content">{children}</main>
          <SiteFooter cmsNavLinks={navPages} />
          <BackToTop />
        </LocaleProvider>
      </body>
    </html>
  )
}
