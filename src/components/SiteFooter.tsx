import {
  IconArrowUpRight,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandWhatsapp,
  IconBrandYoutube,
  IconCheck,
  IconChevronRight,
  IconLink,
  IconMail,
  IconMapPin,
  IconPhone,
} from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

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
  // Top Editorial Section
  const editorialSubheading =
    footerData?.editorial?.subheading || 'Villa San Antonio · Dalmatia'
  const editorialHeading =
    footerData?.editorial?.heading || 'Your private sanctuary in the Dalmatian hills.'
  const editorialBio =
    footerData?.editorial?.shortBio ||
    'Peaceful Mediterranean seclusion with modern comforts, just minutes from the Adriatic coast.'

  // Column 1: Brand
  const brandTagline =
    footerData?.brandTagline ||
    'Where slow mornings meet warm evenings. A private retreat for families & friends, tucked into the quiet Dalmatian hills near Šibenik.'

  // Column 2: Direct Booking Perks
  const directBookingTitle =
    footerData?.directBooking?.title || 'Direct Booking Perks'
  const benefits = [
    footerData?.directBooking?.perk1 || 'Best direct rate guarantee',
    footerData?.directBooking?.perk2 || 'Heated pool & private jacuzzi',
    footerData?.directBooking?.perk3 || 'Fully fenced & pet-friendly garden',
    footerData?.directBooking?.perk4 || 'Personal host support (Josip)',
  ].filter(Boolean) as string[]
  const ctaLabel = footerData?.directBooking?.ctaLabel || PRIMARY_CTA_LABEL
  const ctaLink = footerData?.directBooking?.ctaLink || BOOKING_ANCHOR

  // Column 3: Explore Navigation
  const exploreTitle = footerData?.exploreTitle || 'Explore'
  const fallbackNavLinks = [{ href: '/', label: 'Home' }, ...NAV_LINKS]
  const rawNavLinks =
    footerData?.navLinks && footerData.navLinks.length > 0
      ? footerData.navLinks.map((item) => ({ href: item.link, label: item.label }))
      : cmsNavLinks && cmsNavLinks.length > 0
        ? cmsNavLinks
        : fallbackNavLinks

  // Deduplicate navigation links by href
  const seenHrefs = new Set<string>()
  const navLinks = rawNavLinks.filter((link) => {
    if (!link.href || seenHrefs.has(link.href)) return false
    seenHrefs.add(link.href)
    return true
  })

  // Column 4: Contact & Location
  const contactTitle = footerData?.contactSection?.title || 'Contact & Location'
  const email = footerData?.contactSection?.email || CONTACT_EMAIL
  const phone = footerData?.contactSection?.phone || CONTACT_PHONE
  const address = footerData?.contactSection?.address || 'Podine 14, near Šibenik'
  const region = footerData?.contactSection?.region || 'Dalmatia · Croatia'

  const socialLinks =
    footerData?.socialLinks && footerData.socialLinks.length > 0
      ? footerData.socialLinks
      : [
          { platform: 'instagram' as const, label: 'Instagram', url: 'https://www.instagram.com' },
          { platform: 'facebook' as const, label: 'Facebook', url: 'https://www.facebook.com' },
          { platform: 'whatsapp' as const, label: 'WhatsApp', url: 'https://wa.me/385916021899' },
        ]

  // Keep legal links hidden until approved legal copy and routes are available.
  const legalLinks: Array<{ label: string; link: string }> = []
  const copyright = footerData?.copyright || `${SITE_NAME}. All rights reserved.`

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      {/* Top ambient luxury glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-3/4 max-w-4xl rounded-full bg-white/[0.03] blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative z-10 px-6 pb-10 pt-20 lg:pt-28">
        {/* Editorial Heading Section */}
        <div className="mb-16 flex flex-col justify-between gap-6 border-b border-white/10 pb-12 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
              {editorialSubheading}
            </p>
            <h2 className="mt-2 font-serif text-3xl italic font-normal tracking-tight text-white/95 sm:text-4xl lg:text-5xl">
              {editorialHeading}
            </h2>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-white/50 md:text-right">
            {editorialBio}
          </p>
        </div>

        {/* 4-Column Balanced Grid */}
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand (Col span 3 - Left aligned) */}
          <div className="lg:col-span-3">
            <Link href="/" aria-label="Villa San Antonio home" className="inline-block">
              <Image
                src="/branding/logo-white.png"
                alt="Villa San Antonio"
                width={500}
                height={500}
                className="h-28 w-28 lg:h-[120px] lg:w-[120px] object-contain"
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
              {brandTagline}
            </p>
          </div>

          {/* Column 2: Direct Booking Perks & CTA (Col span 4 - Centered) */}
          <div className="lg:col-span-4 lg:mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.16rem] text-white/40">
              {directBookingTitle}
            </p>
            <ul className="mt-6 space-y-3.5 text-sm text-white/70">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                    <IconCheck size={11} stroke={2.5} />
                  </span>
                  <span className="leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                href={ctaLink}
                className="group inline-flex items-center gap-4 rounded-full bg-white py-2 pl-6 pr-2 text-xs font-semibold uppercase tracking-[0.14rem] text-ink shadow-lg transition-all duration-300 hover:bg-paper hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{ctaLabel}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:translate-x-0.5">
                  <IconArrowUpRight size={17} stroke={2.2} aria-hidden />
                </span>
              </Link>
            </div>
          </div>

          {/* Column 3: Navigation Links (Col span 2 - Centered) */}
          <nav aria-label="Footer" className="lg:col-span-2 lg:mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.16rem] text-white/40">
              {exploreTitle}
            </p>
            <ul className="mt-6 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/70 transition-all duration-200 hover:text-white hover:translate-x-1"
                  >
                    <IconChevronRight
                      size={13}
                      stroke={2}
                      className="opacity-0 transition-opacity duration-200 group-hover:opacity-70"
                    />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: Contact & Social (Col span 3 - Right side container with left-aligned text) */}
          <div className="flex flex-col lg:col-span-3 lg:ml-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.16rem] text-white/40">
              {contactTitle}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <IconMail size={16} stroke={1.7} className="opacity-60" />
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <IconPhone size={16} stroke={1.7} className="opacity-60" />
                  <span>{phone}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <IconMapPin size={16} stroke={1.7} className="mt-0.5 shrink-0 opacity-60" />
                <span className="leading-relaxed">
                  {address}
                  <br />
                  <span className="text-white/50">{region}</span>
                </span>
              </li>
            </ul>

            {/* Tactile Luxury Social Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
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
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 transition-all duration-200 hover:border-white hover:bg-white hover:text-ink hover:scale-110 active:scale-95 shadow-sm"
                  >
                    <IconComponent size={17} stroke={1.6} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar with Legal Policy Links and Copyright */}
        <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {copyright}</p>
          <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-xs text-white/50">
            {legalLinks.map((item) => (
              <Link
                key={item.link + item.label}
                href={item.link}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
