import {
  IconArrowUpRight,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandWhatsapp,
  IconBrandYoutube,
  IconLink,
} from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

import { BackToTop } from '@/components/BackToTop'
import {
  BOOKING_ANCHOR,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  NAV_LINKS,
  PRIMARY_CTA_LABEL,
  SITE_NAME,
} from '@/lib/content'
import type { Footer } from '@/payload-types'

const SOCIAL_ICON_MAP = {
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
  whatsapp: IconBrandWhatsapp,
  tiktok: IconBrandTiktok,
  youtube: IconBrandYoutube,
  airbnb: IconLink,
  booking: IconLink,
  other: IconLink,
} as const

export async function SiteFooter({
  cmsNavLinks,
  footerData,
}: {
  cmsNavLinks?: Array<{ href: string; label: string }>
  footerData?: Footer | null
} = {}) {
  const fallbackNavLinks = NAV_LINKS
  const navLinks =
    footerData?.navLinks && footerData.navLinks.length > 0
      ? footerData.navLinks.map((item) => ({ href: item.link, label: item.label }))
      : cmsNavLinks && cmsNavLinks.length > 0
        ? cmsNavLinks
        : fallbackNavLinks

  const brandTagline =
    footerData?.brandTagline ||
    'A private retreat for families and friends, tucked into the quiet Dalmatian hills near Šibenik.'
  const ctaLabel = footerData?.primaryCta?.label || PRIMARY_CTA_LABEL
  const ctaLink = footerData?.primaryCta?.link || BOOKING_ANCHOR

  const email = footerData?.contact?.email || CONTACT_EMAIL
  const phone = footerData?.contact?.phone || CONTACT_PHONE
  const address = footerData?.contact?.address || 'Podine 14, near Šibenik'
  const region = footerData?.contact?.region || 'Dalmatia · Croatia'

  const socialLinks =
    footerData?.socialLinks && footerData.socialLinks.length > 0
      ? footerData.socialLinks
      : [
          { platform: 'instagram' as const, label: 'Instagram', url: 'https://www.instagram.com' },
          { platform: 'facebook' as const, label: 'Facebook', url: 'https://www.facebook.com' },
        ]

  const bottomTicker = footerData?.bottomTicker || 'Airport 45km · Beach 10km · Krka 15km'
  const copyright = footerData?.copyright || `${SITE_NAME}. All rights reserved.`

  return (
    <footer className="bg-ink px-6 pb-8 pt-20 text-white lg:pt-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-b border-white/15 pb-16 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Image
              src="/branding/logo-white.png"
              alt="Villa San Antonio"
              width={500}
              height={500}
              className="h-[124px] w-[124px]"
            />
            <p className="mt-6 max-w-sm text-sm leading-6 text-white/50">{brandTagline}</p>
            <Link
              href={ctaLink}
              className="mt-8 inline-flex items-center gap-4 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-xs font-medium uppercase tracking-wider text-ink transition-transform duration-300 ease-[var(--ease-reveal)] hover:-translate-y-0.5"
            >
              {ctaLabel}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white">
                <IconArrowUpRight size={18} stroke={2} aria-hidden />
              </span>
            </Link>
          </div>

          <nav aria-label="Footer">
            <p className="text-xs font-medium uppercase tracking-[0.16rem] text-white/45">Explore</p>
            <ul className="mt-6 space-y-3.5">
              {[{ href: '/', label: 'Home' }, ...navLinks].map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16rem] text-white/45">Contact</p>
            <ul className="mt-6 space-y-3.5 text-sm text-white/70">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="transition-colors hover:text-white"
                >
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="transition-colors hover:text-white"
                >
                  {phone}
                </a>
              </li>
              <li>
                {address}
                <br />
                {region}
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {socialLinks.map((social) => {
                const IconComponent =
                  (social.platform && SOCIAL_ICON_MAP[social.platform as keyof typeof SOCIAL_ICON_MAP]) ||
                  IconLink
                return (
                  <a
                    key={social.url + social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label || `Villa San Antonio on ${social.platform}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/60 transition-colors hover:border-white hover:text-white"
                  >
                    <IconComponent size={18} stroke={1.5} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {copyright}</p>
          <div className="flex items-center gap-6">
            <p>{bottomTicker}</p>
            <BackToTop inline />
          </div>
        </div>
      </div>
    </footer>
  )
}
