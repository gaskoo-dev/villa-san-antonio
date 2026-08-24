import {
  IconClock,
  IconPaw,
  IconPool,
  IconShieldCheck,
} from '@tabler/icons-react'
import type { Metadata } from 'next'
import React from 'react'

import { BookingBand } from '@/components/BookingBand'
import { FaqInteractive } from '@/components/FaqInteractive'
import { PageIntro } from '@/components/PageIntro'
import { Reveal } from '@/components/Reveal'
import { getFaqItems, getGallery, getPageBySlug, mediaSrc } from '@/lib/queries'
import type { Media, Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]
type HeroSubBlock = Extract<LayoutBlock, { blockType: 'hero-sub' }>
type BookingBandBlock = Extract<LayoutBlock, { blockType: 'bookingBand' }>

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Frequently Asked Questions & House Guide | Villa San Antonio Šibenik',
  description:
    'Detailed answers regarding check-in times, heated pool temperature, covered parking, WiFi, payment terms, and pet policies for Villa San Antonio.',
}

export default async function FaqPage() {
  const [pageDoc, faqItems, gallery] = await Promise.all([
    getPageBySlug('faq'),
    getFaqItems(),
    getGallery(),
  ])

  const heroSub = pageDoc?.layout?.find((b): b is HeroSubBlock => b.blockType === 'hero-sub')
  const bookingBlock = pageDoc?.layout?.find((b): b is BookingBandBlock => b.blockType === 'bookingBand')
  const heroMedia = typeof heroSub?.image === 'object' && heroSub?.image ? (heroSub.image as Media) : null
  const fallbackHeroImg = gallery[3] ?? gallery[0]

  const heroSrc = heroMedia
    ? (mediaSrc(heroMedia, 'desktop') ?? mediaSrc(heroMedia) ?? '')
    : (mediaSrc(fallbackHeroImg?.image, 'desktop') ?? mediaSrc(fallbackHeroImg?.image) ?? '')

  const quickFacts = [
    {
      icon: IconClock,
      title: 'Check-in / Check-out',
      value: '16:00 / 10:00',
      subtitle: 'Flexible upon prior request',
    },
    {
      icon: IconShieldCheck,
      title: 'Private Parking',
      value: '3 Covered Spaces',
      subtitle: 'Free gated on-site parking',
    },
    {
      icon: IconPool,
      title: 'Heated Pool',
      value: '36 m² with Waterfall',
      subtitle: 'Private & illuminated at night',
    },
    {
      icon: IconPaw,
      title: 'Pets & Garden',
      value: 'Welcome on Request',
      subtitle: '800 m² fully fenced estate',
    },
  ]

  return (
    <>
      <PageIntro
        title={heroSub?.title || 'Clear answers for your'}
        accent={heroSub?.accent || 'summer stay.'}
        lead={
          heroSub?.lead ||
          'Check-in times, pool heating, pet policy, booking terms, and directions. Everything you need to know in one place.'
        }
        breadcrumbs={[{ label: heroSub?.breadcrumbLabel || 'FAQ' }]}
        image={{
          src: heroSrc,
          alt: heroMedia?.alt || fallbackHeroImg?.alt || fallbackHeroImg?.image?.alt || 'Villa San Antonio FAQ',
        }}
      />

      {/* Main 2-Column Section: Left Quick Facts + Right Interactive FAQ */}
      <section className="mx-auto w-[91.5vw] max-w-[1440px] py-16 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[380px_1fr] xl:grid-cols-[400px_1fr] lg:gap-16 items-start">
          {/* Left Column: Sticky Quick Facts Cards */}
          <div className="lg:sticky lg:top-28 space-y-6">
            <Reveal>
              <div>
                <p className="kicker mb-2.5">At a glance</p>
                <h2 className="heading-section text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                  Key facts <span className="accent-serif font-normal text-ink">before arrival.</span>
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-ink/65 leading-relaxed">
                  Quick summary of our key house standards and amenities to help you plan your Dalmatian holiday.
                </p>
              </div>
            </Reveal>

            <div className="space-y-3 sm:space-y-3.5">
              {quickFacts.map((fact, idx) => {
                const Icon = fact.icon
                return (
                  <Reveal key={fact.title} delay={idx * 50}>
                    <div className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-paper p-4.5 sm:p-5 transition-all duration-300 hover:border-ink/25 hover:shadow-xs">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-white shadow-xs">
                        <Icon size={19} stroke={1.8} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/50">
                          {fact.title}
                        </p>
                        <p className="mt-0.5 text-base font-semibold tracking-tight text-ink">
                          {fact.value}
                        </p>
                        <p className="mt-0.5 text-xs text-ink/60">{fact.subtitle}</p>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>

          {/* Right Column: Search, Category Tabs & Interactive FAQ Cards */}
          <div>
            <Reveal>
              <div className="mb-8">
                <p className="kicker mb-2.5">House Guide & Details</p>
                <h2 className="heading-section text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-ink">
                  Frequently asked <span className="accent-serif font-normal text-ink">questions.</span>
                </h2>
                <p className="mt-3 max-w-xl text-sm sm:text-base text-ink/65 leading-relaxed">
                  Everything you need to know about staying at Villa San Antonio. Filter by category or search below.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <FaqInteractive items={faqItems} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Direct Booking CTA Banner */}
      <BookingBand {...(bookingBlock || {})} />
    </>
  )
}
