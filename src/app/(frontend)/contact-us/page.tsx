import { IconMail, IconMapPin } from '@tabler/icons-react'
import type { Metadata } from 'next'
import React from 'react'

import { BookingBand } from '@/components/BookingBand'
import { ContactForm } from '@/components/ContactForm'
import { PageIntro } from '@/components/PageIntro'
import { Reveal } from '@/components/Reveal'
import { CONTACT_EMAIL, CONTACT_INTRO } from '@/lib/content'
import { getGallery, getPageBySlug, mediaSrc } from '@/lib/queries'
import type { Media, Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]
type HeroSubBlock = Extract<LayoutBlock, { blockType: 'hero-sub' }>
type BookingBandBlock = Extract<LayoutBlock, { blockType: 'bookingBand' }>

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Questions or special requests for Villa San Antonio? Write to us and get a personal reply.',
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

      <section className="mx-auto grid w-[91.5vw] max-w-[1440px] gap-14 pb-24 pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24 lg:pb-36">
        <div>
          <Reveal>
            <h2 className="text-4xl font-medium leading-[0.94] tracking-[-0.05em] sm:text-5xl">
              Get in <span className="accent-serif font-normal">touch.</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-6 text-ink/60">
              We answer every message personally, usually within 30 minutes.
            </p>
            <ul className="mt-12 space-y-8">
              <li className="flex items-start gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20">
                  <IconMail size={18} stroke={1.5} aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14rem] text-ink/50">Email</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="mt-1 inline-block text-sm text-ink hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20">
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
                    Podine 14, 22000 Šibenik, Dalmatia, Croatia ↗
                  </a>
                </div>
              </li>
            </ul>
          </Reveal>
        </div>

        <div>
          <Reveal delay={100}>
            <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-sm sm:p-12">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="h-[420px] w-full border-t border-ink/10 relative">
        <a
          href="https://maps.app.goo.gl/Xm8sAH7drKf2pADaA"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 block cursor-pointer"
          aria-label="Open Villa San Antonio in Google Maps"
        >
          <iframe
            src="https://maps.google.com/maps?q=43.6470678,16.0546611+(Villa+San+Antonio)&hl=en&z=13&output=embed"
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
