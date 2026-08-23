'use client'

import { IconArrowUpRight, IconMail, IconMenu2, IconPhone, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'

import { useLocale } from '@/context/LocaleContext'
import { BOOKING_ANCHOR, CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/content'

export function SiteHeader({
  cmsNavLinks,
}: {
  cmsNavLinks?: Array<{ href: string; label: string }>
} = {}) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { locale, setLocale, t, locales } = useLocale()
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const reduce = useReducedMotion()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const bookingHref = BOOKING_ANCHOR
  const overHero = !scrolled && !menuOpen

  const fallbackNavLinks = [
    { href: '/about-villa', label: t.nav.about },
    { href: '/gallery', label: t.nav.gallery },
    { href: '/faq', label: t.nav.faq },
    { href: '/contact-us', label: t.nav.contact },
  ]

  const navLinks = cmsNavLinks && cmsNavLinks.length > 0 ? cmsNavLinks : fallbackNavLinks

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
              href={`tel:${CONTACT_PHONE}`}
              className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-100 opacity-90"
            >
              <IconPhone size={18} stroke={1.8} className="opacity-90" />
              <span>{CONTACT_PHONE}</span>
            </a>
            <span className="hidden opacity-30 sm:inline">/</span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hidden items-center gap-2.5 transition-opacity hover:opacity-100 opacity-90 sm:inline-flex"
            >
              <IconMail size={18} stroke={1.8} className="opacity-90" />
              <span>{CONTACT_EMAIL}</span>
            </a>
          </div>

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
              key={link.href}
              href={link.href}
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
            href={bookingHref}
            className={`inline-flex items-center gap-4 rounded-full py-1.5 pl-5 pr-1.5 text-xs font-medium uppercase tracking-wider transition-transform duration-300 ease-[var(--ease-reveal)] hover:-translate-y-0.5 active:translate-y-0 ${
              overHero ? 'bg-white text-ink' : 'bg-ink text-white'
            }`}
          >
            {t.nav.checkAvailability}
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${overHero ? 'bg-ink text-white' : 'bg-white text-ink'}`}>
              <IconArrowUpRight size={18} stroke={2} aria-hidden />
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          {/* Mobile Language Switcher */}
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

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 ${
              overHero ? 'border-white/40 text-white' : 'border-ink/20 text-ink'
            }`}
          >
            {menuOpen ? <IconX size={18} stroke={1.5} /> : <IconMenu2 size={18} stroke={1.5} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-ink/10 bg-paper px-6 pb-8 pt-4 lg:hidden"
          >
            <nav className="flex flex-col gap-4 text-sm font-medium uppercase tracking-[0.14rem]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-2 transition-colors ${
                    pathname === link.href ? 'text-ink' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  href={bookingHref}
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full justify-center text-xs"
                >
                  {t.nav.checkAvailability}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
