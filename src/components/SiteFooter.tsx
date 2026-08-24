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
import { getSettings } from '@/lib/queries'

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
}: {
  cmsNavLinks?: Array<{ href: string; label: string }>
} = {}) {
  const [settings] = await Promise.all([getSettings()])
  const fallbackNavLinks = NAV_LINKS
  const navLinks = cmsNavLinks && cmsNavLinks.length > 0 ? cmsNavLinks : fallbackNavLinks

  const activeSocialLinks =
    settings?.social?.links && settings.social.links.length > 0
      ? settings.social.links.filter((l) => l.enabled !== false && Boolean(l.url))
      : [
          { platform: 'instagram' as const, label: 'Instagram', url: 'https://www.instagram.com' },
          { platform: 'facebook' as const, label: 'Facebook', url: 'https://www.facebook.com' },
        ]

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
            <p className="mt-6 max-w-sm text-sm leading-6 text-white/50">
              A private retreat for families and friends, tucked into the quiet Dalmatian hills near Šibenik.
            </p>
            <Link
              href={BOOKING_ANCHOR}
              className="mt-8 inline-flex items-center gap-4 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-xs font-medium uppercase tracking-wider text-ink transition-transform duration-300 ease-[var(--ease-reveal)] hover:-translate-y-0.5"
            >
              {PRIMARY_CTA_LABEL}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white">
                <IconArrowUpRight size={18} stroke={2} aria-hidden />
              </span>
            </Link>
          </div>

          <nav aria-label="Footer">
            <p className="text-xs font-medium uppercase tracking-[0.16rem] text-white/45">Explore</p>
            <ul className="mt-6 space-y-3.5">
              {[{ href: '/', label: 'Home' }, ...navLinks].map((link) => (
                <li key={link.href}>
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
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_PHONE.replace(/[^0-9+]/g, '')}`}
                  className="transition-colors hover:text-white"
                >
                  {CONTACT_PHONE}
                </a>
              </li>
              <li>
                Podine 14, near Šibenik
                <br />
                Dalmatia · Croatia
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {activeSocialLinks.map((social) => {
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
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <p>Airport 45km · Beach 10km · Krka 15km</p>
            <BackToTop inline />
          </div>
        </div>
      </div>
    </footer>
  )
}
