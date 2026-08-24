'use client'

import { IconArrowUpRight, IconBrandWhatsapp, IconMail, IconMenu2, IconPhone, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'

import { useLocale } from '@/context/LocaleContext'
import { BOOKING_ANCHOR, CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/content'
import type { Header } from '@/payload-types'

export function SiteHeader({
  cmsNavLinks,
  headerData,
}: {
  cmsNavLinks?: Array<{ href: string; label: string }>
  headerData?: Header | null
} = {}) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { locale, setLocale, t, locales } = useLocale()
  const pathname = usePathname()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const overHero = !scrolled && !menuOpen

  // Dynamic Top Bar
  const phone = headerData?.topBar?.phone || CONTACT_PHONE
  const email = headerData?.topBar?.email || CONTACT_EMAIL
  const enableLanguages = headerData?.topBar?.enableLanguages !== false

  // Dynamic Navigation Links
  const fallbackNavLinks = [
    { href: '/about-villa', label: t.nav.about, newTab: false },
    { href: '/gallery', label: t.nav.gallery, newTab: false },
    { href: '/faq', label: t.nav.faq, newTab: false },
    { href: '/contact-us', label: t.nav.contact, newTab: false },
  ]

  const navLinks =
    headerData?.navItems && headerData.navItems.length > 0
      ? headerData.navItems.map((item) => ({
          href: item.link,
          label: item.label,
          newTab: item.newTab || false,
        }))
      : cmsNavLinks && cmsNavLinks.length > 0
        ? cmsNavLinks.map((l) => ({ ...l, newTab: false }))
        : fallbackNavLinks

  // Dynamic CTA
  const ctaLabel = headerData?.cta?.label || t.nav.checkAvailability
  const ctaLink = headerData?.cta?.link || BOOKING_ANCHOR

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-reveal)] ${
        overHero
          ? 'border-b border-transparent bg-paper/0 backdrop-blur-none'
          : 'border-b border-ink/10 bg-paper/80 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.03)]'
      }`}
    >
      {/* Top Utility Bar (Mini Header) */}
      <div
        className={`transition-all duration-500 ease-[var(--ease-reveal)] border-b ${
          scrolled
            ? 'max-h-0 -translate-y-full opacity-0 overflow-hidden border-transparent'
            : 'max-h-12 opacity-100'
        } ${
          overHero
            ? 'text-white border-white/15'
            : 'text-ink/75 border-ink/10 bg-paper/40'
        }`}
      >
        <div className="container-page flex h-10 items-center justify-between text-[11px] font-medium tracking-[0.14rem]">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-100 opacity-90"
            >
              <IconPhone size={18} stroke={1.8} className="opacity-90" />
              <span>{phone}</span>
            </a>
            <span className="hidden opacity-30 sm:inline">/</span>
            <a
              href={`mailto:${email}`}
              className="hidden items-center gap-2.5 transition-opacity hover:opacity-100 opacity-90 sm:inline-flex"
            >
              <IconMail size={18} stroke={1.8} className="opacity-90" />
              <span>{email}</span>
            </a>
          </div>

          {enableLanguages && (
            <div className="flex items-center gap-3">
              {/* Languages */}
              <div className="flex items-center gap-1.5 font-semibold">
                {locales.map((l, i) => (
                  <React.Fragment key={l.code}>
                    {i > 0 && <span className="opacity-30 text-[9px]">/</span>}
                    <button
                      type="button"
                      onClick={() => setLocale(l.code)}
                      className={`transition-all uppercase ${
                        locale === l.code
                          ? overHero
                            ? 'font-bold text-white underline underline-offset-4'
                            : 'font-bold text-ink underline underline-offset-4'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {l.flag}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`container-page flex items-center justify-between gap-6 transition-[height] duration-500 ease-[var(--ease-reveal)] ${
          scrolled ? 'h-20 lg:h-[80px]' : 'h-24 lg:h-[96px]'
        }`}
      >
        <Link
          href="/"
          aria-label="Villa San Antonio, home"
          className="relative flex items-center"
        >
          <div
            className={`relative transition-[height,width] duration-500 ease-[var(--ease-reveal)] ${
              scrolled ? 'h-[56px] w-[56px]' : 'h-[72px] w-[72px]'
            }`}
          >
            <Image
              src="/branding/logo-white.png"
              alt=""
              width={500}
              height={500}
              priority
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ease-[var(--ease-reveal)] ${
                overHero ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <Image
              src="/branding/logo-black.png"
              alt=""
              width={500}
              height={500}
              priority
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ease-[var(--ease-reveal)] ${
                overHero ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </div>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              target={link.newTab ? '_blank' : undefined}
              rel={link.newTab ? 'noopener noreferrer' : undefined}
              className={`text-xs font-medium uppercase tracking-[0.13rem] transition-colors duration-200 ${
                overHero
                  ? 'text-white/80 hover:text-white'
                  : pathname === link.href
                    ? 'text-ink underline decoration-ink/40 underline-offset-[6px]'
                    : 'text-ink/60 hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href={ctaLink}
            className={`inline-flex items-center gap-4 rounded-full py-1.5 pl-5 pr-1.5 text-xs font-medium uppercase tracking-wider transition-transform duration-300 ease-[var(--ease-reveal)] hover:-translate-y-0.5 active:translate-y-0 ${
              overHero ? 'bg-white text-ink' : 'bg-ink text-white'
            }`}
          >
            {ctaLabel}
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${overHero ? 'bg-ink text-white' : 'bg-white text-ink'}`}>
              <IconArrowUpRight size={18} stroke={2} aria-hidden />
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          {/* Mobile Language Switcher */}
          {enableLanguages && (
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wider ${
                overHero ? 'bg-white/10 text-white/70' : 'bg-ink/5 text-ink/70'
              }`}
            >
              {locales.map((l, i) => (
                <React.Fragment key={l.code}>
                  {i > 0 && <span className="opacity-30 text-[9px]">/</span>}
                  <button
                    type="button"
                    onClick={() => setLocale(l.code)}
                    className={`transition-colors uppercase ${
                      locale === l.code
                        ? overHero
                          ? 'font-bold text-white'
                          : 'font-bold text-ink'
                        : overHero
                          ? 'hover:text-white'
                          : 'hover:text-ink'
                    }`}
                  >
                    {l.flag}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
              overHero
                ? 'border-white/25 text-white hover:border-white'
                : 'border-ink/15 text-ink hover:border-ink/40'
            }`}
          >
            {menuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-0 z-50 flex h-dvh flex-col justify-between bg-paper px-6 pb-8 pt-5 text-ink lg:hidden overflow-y-auto"
          >
            {/* Drawer Top Header with Large Logo & Clean X Close Button */}
            <div className="flex items-center justify-between border-b border-ink/10 pb-3 pt-1">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                aria-label="Villa San Antonio home"
                className="relative flex items-center"
              >
                <div className="relative h-16 w-16 sm:h-[72px] sm:w-[72px]">
                  <Image
                    src="/branding/logo-black.png"
                    alt="Villa San Antonio"
                    width={300}
                    height={300}
                    className="h-full w-full object-contain"
                  />
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-10 w-10 items-center justify-center text-ink transition-opacity hover:opacity-60 active:scale-90 cursor-pointer p-1"
              >
                <IconX size={28} stroke={1.6} />
              </button>
            </div>

            <div className="space-y-6 pt-2">
              {/* Navigation Links */}
              <nav className="flex flex-col gap-4 pt-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.href + link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * idx, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      target={link.newTab ? '_blank' : undefined}
                      rel={link.newTab ? 'noopener noreferrer' : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between text-2xl font-medium tracking-tight py-1 ${
                        pathname === link.href ? 'text-ink font-semibold' : 'text-ink/75 hover:text-ink'
                      }`}
                    >
                      <span>{link.label}</span>
                      {pathname === link.href && (
                        <span className="h-2 w-2 rounded-full bg-ink" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Language Switcher in Drawer */}
              {enableLanguages && (
                <div className="border-t border-ink/10 pt-6">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.16rem] text-ink/50 mb-3">
                    Language
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {locales.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLocale(l.code)
                          setMenuOpen(false)
                        }}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                          locale === l.code
                            ? 'bg-ink text-white shadow-xs'
                            : 'bg-surface text-ink/70 hover:bg-surface/80'
                        }`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Contact & Booking Actions */}
            <div className="space-y-4 border-t border-ink/10 pt-6 mt-6">
              <Link
                href={ctaLink}
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-ink py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-md active:scale-[0.99] transition-transform"
              >
                <span>{ctaLabel}</span>
                <IconArrowUpRight size={17} stroke={2.2} />
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-ink/15 bg-surface/60 py-3 text-xs font-medium text-ink transition-colors active:bg-surface"
                >
                  <IconPhone size={16} stroke={1.8} />
                  <span>Call host</span>
                </a>
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-ink/15 bg-surface/60 py-3 text-xs font-medium text-ink transition-colors active:bg-surface"
                >
                  <IconBrandWhatsapp size={16} stroke={1.8} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
