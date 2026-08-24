import { IconArrowUpRight, IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

import { BackToTop } from '@/components/BackToTop'
import { CONTACT_EMAIL, NAV_LINKS, PRIMARY_CTA_LABEL, SITE_NAME, BOOKING_ANCHOR } from '@/lib/content'
import { getSettings } from '@/lib/queries'

export async function SiteFooter({
  cmsNavLinks,
}: {
  cmsNavLinks?: Array<{ href: string; label: string }>
} = {}) {
  const settings = await getSettings()
  const contact = settings?.contact
  const social = settings?.social

  const fallbackNavLinks = NAV_LINKS
  const navLinks = cmsNavLinks && cmsNavLinks.length > 0 ? cmsNavLinks : fallbackNavLinks

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
                  href={`mailto:${contact?.email || CONTACT_EMAIL}`}
                  className="transition-colors hover:text-white"
                >
                  {contact?.email || CONTACT_EMAIL}
                </a>
              </li>
              {contact?.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                    className="transition-colors hover:text-white"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              <li>
                {contact?.address ?? 'Podine, near Šibenik'}
                <br />
                {contact?.region ?? 'Dalmatia · Croatia'}
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-3">
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Villa San Antonio on Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/60 transition-colors hover:border-white hover:text-white"
                >
                  <IconBrandInstagram size={18} stroke={1.5} />
                </a>
              )}
              {social?.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Villa San Antonio on Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/60 transition-colors hover:border-white hover:text-white"
                >
                  <IconBrandFacebook size={18} stroke={1.5} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <p>
              {(contact?.distances ?? [])
                .slice(0, 3)
                .map((d) => `${d.label} ${d.value}`)
                .join(' · ')}
            </p>
            <BackToTop inline />
          </div>
        </div>
      </div>
    </footer>
  )
}
