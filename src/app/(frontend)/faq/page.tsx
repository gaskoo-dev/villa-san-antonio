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
      title: 'Check-in / Out',
      value: '16:00 / 10:00',
      subtitle: 'Flexible upon prior request',
    },
    {
      icon: IconShieldCheck,
      title: 'Private Parking',
      value: '3 Covered Spaces',
      subtitle: 'Free gated parking on-site',
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

      {/* 01 · Quick Facts Bento Strip */}
      <section className="border-b border-ink/10 bg-surface/70 py-12 lg:py-16">
        <div className="mx-auto w-[91.5vw] max-w-[1440px]">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {quickFacts.map((fact, idx) => {
              const Icon = fact.icon
              return (
                <Reveal key={fact.title} delay={idx * 60} className="h-full">
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-paper p-5 sm:p-6 transition-all duration-300 hover:border-ink/25 hover:shadow-xs">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white shadow-xs">
                      <Icon size={20} stroke={1.8} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                        {fact.title}
                      </p>
                      <p className="mt-1 text-lg sm:text-xl font-medium tracking-tight text-ink">
                        {fact.value}
                      </p>
                      <p className="mt-1 text-xs text-ink/60">{fact.subtitle}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* 02 · Main Interactive FAQ Section */}
      <section className="mx-auto w-[91.5vw] max-w-[960px] py-16 lg:py-28">
        <Reveal>
          <div className="text-center mb-10 sm:mb-12">
            <p className="kicker mb-3">House Guide & Details</p>
            <h2 className="heading-section text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-ink">
              Frequently asked{' '}
              <span className="accent-serif font-normal text-ink">questions.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-ink/65">
              Everything you need to know about staying at Villa San Antonio. Filter by category or search for specific amenities below.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <FaqInteractive items={faqItems} />
        </Reveal>
      </section>

      {/* 03 · Direct Booking CTA Banner */}
      <BookingBand {...(bookingBlock || {})} />
    </>
  )
}
