import { IconBrandWhatsapp, IconMail, IconMapPin, IconPhone } from '@tabler/icons-react'
import type { Metadata } from 'next'
import React from 'react'

import { BookingBand } from '@/components/BookingBand'
import { ContactForm } from '@/components/ContactForm'
import { PageIntro } from '@/components/PageIntro'
import { Reveal } from '@/components/Reveal'
import { CONTACT_EMAIL, CONTACT_INTRO, CONTACT_PHONE } from '@/lib/content'
import { getGallery, getPageBySlug, mediaSrc } from '@/lib/queries'
import type { Media, Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]
type HeroSubBlock = Extract<LayoutBlock, { blockType: 'hero-sub' }>
type BookingBandBlock = Extract<LayoutBlock, { blockType: 'bookingBand' }>

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact Us | Direct line to Villa San Antonio hosts',
  description:
    'Questions, booking inquiries or special requests for Villa San Antonio? Write to us and get a personal reply within 30 minutes.',
}

export default async function ContactPage() {
  const [pageDoc, gallery] = await Promise.all([
    getPageBySlug('contact-us'),
    getGallery(),
  ])

  const heroSub = pageDoc?.layout?.find((b): b is HeroSubBlock => b.blockType === 'hero-sub')
  const bookingBlock = pageDoc?.layout?.find((b): b is BookingBandBlock => b.blockType === 'bookingBand')
  const heroMedia = typeof heroSub?.image === 'object' && heroSub?.image ? (heroSub.image as Media) : null
  const fallbackHeroImg = gallery[2] ?? gallery[0]

  const heroSrc = heroMedia
    ? (mediaSrc(heroMedia, 'desktop') ?? mediaSrc(heroMedia) ?? '')
    : (mediaSrc(fallbackHeroImg?.image, 'desktop') ?? mediaSrc(fallbackHeroImg?.image) ?? '')

  const email = CONTACT_EMAIL
  const phone = CONTACT_PHONE
  const cleanPhone = phone.replace(/[^0-9+]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent('Hello Josip, I would like to inquire about Villa San Antonio.')}`

  const fullLocation = 'Podine 14, 22000 Šibenik, Dalmatia · Croatia'
  const lat = 43.6470678
  const lng = 16.0546611

  return (
    <>
      <PageIntro
        title={heroSub?.title || 'Direct line to your'}
        accent={heroSub?.accent || 'Dalmatian hosts.'}
        lead={
          heroSub?.lead ||
          CONTACT_INTRO ||
          'Reach out to Josip and the family directly for special requests, flexible dates, and instant local assistance.'
        }
        breadcrumbs={[{ label: heroSub?.breadcrumbLabel || 'Contact' }]}
        image={{
          src: heroSrc,
          alt: heroMedia?.alt || fallbackHeroImg?.alt || fallbackHeroImg?.image?.alt || 'Villa San Antonio Contact',
        }}
      />

      <section className="mx-auto grid w-[91.5vw] max-w-[1440px] gap-10 sm:gap-14 pb-16 sm:pb-24 pt-12 sm:pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24 lg:pb-36">
        <div>
          <Reveal>
            <h2 className="text-4xl font-medium leading-[0.94] tracking-[-0.05em] sm:text-5xl">
              Get in <span className="accent-serif font-normal">touch.</span>
            </h2>
            <p className="mt-4 sm:mt-6 max-w-sm text-sm leading-6 text-ink/60">
              We answer every message personally, usually within 30 minutes.
            </p>

            <ul className="mt-8 sm:mt-12 space-y-6 sm:space-y-8">
              {/* Direct Email */}
              <li className="flex items-start gap-4 sm:gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink">
                  <IconMail size={18} stroke={1.5} aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14rem] text-ink/50">Email</p>
                  <a
                    href={`mailto:${email}`}
                    className="mt-1 inline-block text-sm text-ink hover:underline"
                  >
                    {email}
                  </a>
                </div>
              </li>

              {/* Direct Phone & WhatsApp */}
              <li className="flex items-start gap-4 sm:gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink">
                  <IconPhone size={18} stroke={1.5} aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14rem] text-ink/50">Direct Phone & WhatsApp</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-sm font-medium text-ink hover:underline"
                    >
                      {phone}
                    </a>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                    >
                      <IconBrandWhatsapp size={14} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </li>

              {/* Location */}
              <li className="flex items-start gap-4 sm:gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink">
                  <IconMapPin size={18} stroke={1.5} aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14rem] text-ink/50">Location</p>
                  <a
                    href="https://maps.app.goo.gl/Xm8sAH7drKf2pADaA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm text-ink hover:underline"
                  >
                    {fullLocation} ↗
                  </a>
                </div>
              </li>
            </ul>

            {/* Quick FAQ Helper Card */}
            <div className="mt-8 sm:mt-12 rounded-2xl border border-ink/10 bg-paper/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14rem] text-ink/50">
                Need immediate answers?
              </p>
              <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                Check our house guide for check-in hours, heated pool details, and pet rules.
              </p>
              <a
                href="/faq"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink underline decoration-1 underline-offset-4 hover:opacity-75"
              >
                <span>Browse Frequently Asked Questions</span>
                <span>→</span>
              </a>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal delay={100}>
            <div className="rounded-3xl border border-ink/10 bg-white/90 backdrop-blur-sm p-6 sm:p-9 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Dynamic Google Maps Location Section */}
      <section className="h-[300px] sm:h-[420px] w-full border-t border-ink/10 relative">
        <a
          href="https://maps.app.goo.gl/Xm8sAH7drKf2pADaA"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 block cursor-pointer"
          aria-label="Open Villa San Antonio in Google Maps"
        >
          <iframe
            src={`https://maps.google.com/maps?q=${lat},${lng}+(Villa+San+Antonio)&hl=en&z=13&output=embed`}
            title="Villa San Antonio location map"
            className="pointer-events-none h-full w-full border-0"
            loading="lazy"
            tabIndex={-1}
          />
        </a>
      </section>

      <BookingBand {...(bookingBlock || {})} />
    </>
  )
}
