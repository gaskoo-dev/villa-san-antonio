import { IconMail } from '@tabler/icons-react'
import type { Metadata } from 'next'
import React from 'react'

import { BookingBand } from '@/components/BookingBand'
import { FaqAccordion } from '@/components/FaqAccordion'
import { PageIntro } from '@/components/PageIntro'
import { Reveal } from '@/components/Reveal'
import { CONTACT_EMAIL } from '@/lib/content'
import { getFaqItems, getGallery, getPageBySlug, mediaSrc } from '@/lib/queries'
import type { Media, Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]
type HeroSubBlock = Extract<LayoutBlock, { blockType: 'hero-sub' }>
type BookingBandBlock = Extract<LayoutBlock, { blockType: 'bookingBand' }>

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Parking, WiFi, booking, payment and cancellation terms for Villa San Antonio, answered in one place.',
}

export default async function FaqPage() {
  const [pageDoc, faqItems, gallery] = await Promise.all([getPageBySlug('faq'), getFaqItems(), getGallery()])

  const heroSub = pageDoc?.layout?.find((b): b is HeroSubBlock => b.blockType === 'hero-sub')
  const bookingBlock = pageDoc?.layout?.find((b): b is BookingBandBlock => b.blockType === 'bookingBand')
  const heroMedia = typeof heroSub?.image === 'object' && heroSub?.image ? (heroSub.image as Media) : null
  const fallbackHeroImg = gallery[3] ?? gallery[0]

  const heroSrc = heroMedia
    ? (mediaSrc(heroMedia, 'desktop') ?? mediaSrc(heroMedia) ?? '')
    : (mediaSrc(fallbackHeroImg?.image, 'desktop') ?? mediaSrc(fallbackHeroImg?.image) ?? '')

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

      <section className="mx-auto grid w-[91.5vw] max-w-[1440px] gap-12 pb-24 pt-16 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:pb-36">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="max-w-sm text-sm leading-6 text-ink/60">
              Need more information or having specific travel requirements? We are here to assist you with every detail.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-8 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.13rem] text-ink/60 underline decoration-ink/30 underline-offset-[6px] transition-colors hover:text-ink hover:decoration-ink"
            >
              <IconMail size={18} stroke={1.5} aria-hidden />
              Still unsure? Write to us
            </a>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <FaqAccordion items={faqItems.map((f) => ({ question: f.question, answer: f.answer }))} defaultOpen={0} />
        </Reveal>
      </section>

      <BookingBand {...(bookingBlock || {})} />
    </>
  )
}
