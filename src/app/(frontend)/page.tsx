import { IconArrowRight, IconArrowUpRight, IconClock, IconFlame, IconMoon, IconSparkles, IconSun } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import React from 'react'

import { BookingBand } from '@/components/BookingBand'
import { FaqAccordion } from '@/components/FaqAccordion'
import { GalleryStrip } from '@/components/GalleryStrip'
import { HeroSection } from '@/components/HeroSection'
import { Reveal } from '@/components/Reveal'
import { ReviewsSwiper } from '@/components/ReviewsSwiper'
import { StatsBand } from '@/components/StatsBand'
import { REVIEWS_INTRO } from '@/lib/content'
import { getFaqItems, getGallery, getPageBySlug, getReviews, mediaSrc, type GalleryEntry } from '@/lib/queries'
import type { FaqItem, Media, Page, Review } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]
type HeroSliderBlock = Extract<LayoutBlock, { blockType: 'hero-slider' }>
type PerspectiveBlock = Extract<LayoutBlock, { blockType: 'perspective' }>
type PlacesBlock = Extract<LayoutBlock, { blockType: 'places' }>
type GalleryStripBlock = Extract<LayoutBlock, { blockType: 'galleryStrip' }>
type ReviewsBlock = Extract<LayoutBlock, { blockType: 'reviews' }>
type FaqShortBlock = Extract<LayoutBlock, { blockType: 'faqShort' }>
type BookingBandBlock = Extract<LayoutBlock, { blockType: 'bookingBand' }>

const PLACE_ICON_MAP = {
  sun: IconSun,
  flame: IconFlame,
  moon: IconMoon,
  sparkles: IconSparkles,
  clock: IconClock,
} as const

export const revalidate = 3600

export const metadata: Metadata = {
  description:
    'A fully private villa for eight guests in the Dalmatian hills near Šibenik. Heated pool, BBQ house, fenced garden, pets welcome. Check availability for your dates.',
}

function img(gallery: GalleryEntry[], pattern: string) {
  return gallery.find((g) => g.image.filename?.includes(pattern))
}

function slide(entry?: GalleryEntry) {
  if (!entry) return null
  return { src: mediaSrc(entry.image, 'desktop') ?? mediaSrc(entry.image) ?? '', alt: entry.alt || entry.image.alt }
}

export default async function HomePage() {
  const [homePage, gallery, reviews, faqItems] = await Promise.all([
    getPageBySlug('home'),
    getGallery(),
    getReviews(200),
    getFaqItems(),
  ])

  const defaultHeroSlides = [img(gallery, '-071'), img(gallery, '-027'), img(gallery, '-005'), img(gallery, '-006')]
    .map(slide)
    .filter((s): s is { src: string; alt: string } => Boolean(s?.src))

  const heroBlock = homePage?.layout?.find((b): b is HeroSliderBlock => b.blockType === 'hero-slider')
  const cmsHeroSlides = heroBlock?.slides
    ?.map((s) => {
      const media = typeof s.image === 'object' && s.image ? (s.image as Media) : null
      const src = media ? (mediaSrc(media, 'desktop') ?? mediaSrc(media) ?? '') : ''
      return {
        src,
        alt: s.title || media?.alt || 'Villa San Antonio',
        kicker: s.kicker,
        title: s.title,
        accent: s.accent,
        subtext: s.subtext,
      }
    })
    .filter((s) => Boolean(s.src))

  const heroSlides = cmsHeroSlides && cmsHeroSlides.length > 0 ? cmsHeroSlides : defaultHeroSlides
  const heroContent =
    cmsHeroSlides && cmsHeroSlides.length > 0
      ? cmsHeroSlides.map((s) => ({
          kicker: s.kicker || 'VILLA SAN ANTONIO',
          title: s.title,
          accent: s.accent || '',
          subtext: s.subtext || '',
        }))
      : undefined

  const perspectiveBlock = homePage?.layout?.find((b): b is PerspectiveBlock => b.blockType === 'perspective')
  const placesBlock = homePage?.layout?.find((b): b is PlacesBlock => b.blockType === 'places')
  const galleryBlock = homePage?.layout?.find((b): b is GalleryStripBlock => b.blockType === 'galleryStrip')
  const reviewsBlock = homePage?.layout?.find((b): b is ReviewsBlock => b.blockType === 'reviews')
  const faqBlock = homePage?.layout?.find((b): b is FaqShortBlock => b.blockType === 'faqShort')
  const bookingBlock = homePage?.layout?.find((b): b is BookingBandBlock => b.blockType === 'bookingBand')

  const storyA = img(gallery, '-027') ?? img(gallery, '-071') ?? img(gallery, '-033') ?? gallery[0]
  const storyB = img(gallery, '-056') ?? img(gallery, '-033') ?? gallery[1]
  const poolImg = img(gallery, '-027') ?? img(gallery, '-011')
  const bbqImg = img(gallery, '-079')
  const bedroomImg = img(gallery, '-056')
  const stripImages = gallery.filter((g) => g.featured).slice(0, 10)

  const cmsSelectedReviews = reviewsBlock?.selectedReviews
    ?.map((r) => (typeof r === 'object' && r ? (r as Review) : null))
    .filter((r): r is Review => Boolean(r))

  const reviewsLimit = reviewsBlock?.limit || 30
  const reviewsToUse =
    cmsSelectedReviews && cmsSelectedReviews.length > 0
      ? cmsSelectedReviews
      : reviews.slice(0, reviewsLimit)

  const cmsFaqItems = faqBlock?.items
    ?.map((item) => (typeof item === 'object' && item ? (item as FaqItem) : null))
    .filter((item): item is FaqItem => Boolean(item))

  const faqItemsToUse =
    cmsFaqItems && cmsFaqItems.length > 0
      ? cmsFaqItems
      : faqItems.slice(0, 5)

  const cmsGalleryImages = galleryBlock?.images
    ?.map((item) => {
      const media = typeof item.image === 'object' && item.image ? (item.image as Media) : null
      if (!media) return null
      return {
        id: media.id,
        image: media,
        alt: item.alt || media.alt || 'Villa San Antonio',
        featured: true,
      }
    })
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  const galleryImagesToUse =
    cmsGalleryImages && cmsGalleryImages.length > 0
      ? cmsGalleryImages
      : stripImages.length >= 4
        ? stripImages
        : gallery.slice(0, 10)

  const cmsPlaces = placesBlock?.items
    ?.map((item) => {
      const media = typeof item.image === 'object' && item.image ? (item.image as Media) : null
      const src = media ? (mediaSrc(media, 'desktop') ?? mediaSrc(media) ?? '') : ''
      const iconKey = (item.icon as keyof typeof PLACE_ICON_MAP) || 'sun'
      return {
        src,
        alt: item.name || media?.alt || 'Villa San Antonio',
        time: item.time || '',
        tag: item.tag || '',
        name: item.name,
        desc: item.desc || '',
        link: item.link || '/about-villa',
        icon: PLACE_ICON_MAP[iconKey] || IconSun,
      }
    })
    .filter((p) => Boolean(p.src))

  const defaultPlaces = [
    {
      src: mediaSrc(poolImg?.image) ?? '',
      alt: poolImg?.alt || poolImg?.image.alt || 'The heated pool',
      time: 'All day · 14:00',
      tag: 'Pool & terrace',
      name: 'The heated pool',
      desc: '36 m² private heated pool with waterfall feature, sun loungers, and serene Dalmatian hill views.',
      link: '/about-villa',
      icon: IconSun,
    },
    {
      src: mediaSrc(bbqImg?.image) ?? '',
      alt: bbqImg?.alt || bbqImg?.image.alt || 'The fire room',
      time: 'After eight · 20:00',
      tag: 'BBQ house & grill',
      name: 'The fire room',
      desc: 'Traditional stone fireplace and fully equipped dining house for long dinners under starry skies.',
      link: '/about-villa',
      icon: IconFlame,
    },
    {
      src: mediaSrc(bedroomImg?.image) ?? '',
      alt: bedroomImg?.alt || bedroomImg?.image.alt || 'Three quiet rooms',
      time: 'Past midnight · 23:00',
      tag: 'Master suites',
      name: 'Three quiet rooms',
      desc: 'Air-conditioned master suites with crisp linens, walk-in bathrooms, and total nighttime peace.',
      link: '/about-villa',
      icon: IconMoon,
    },
  ]

  const placesToUse = cmsPlaces && cmsPlaces.length > 0 ? cmsPlaces : defaultPlaces

  const perspectivePrimaryMedia =
    perspectiveBlock?.primaryImage && typeof perspectiveBlock.primaryImage === 'object'
      ? (perspectiveBlock.primaryImage as Media)
      : null
  const perspectiveSecondaryMedia =
    perspectiveBlock?.secondaryImage && typeof perspectiveBlock.secondaryImage === 'object'
      ? (perspectiveBlock.secondaryImage as Media)
      : null

  const perspectiveLeftImg = perspectivePrimaryMedia
    ? {
        src: mediaSrc(perspectivePrimaryMedia, 'desktop') ?? mediaSrc(perspectivePrimaryMedia) ?? '',
        alt: perspectivePrimaryMedia.alt || 'Villa San Antonio heated pool',
      }
    : slide(storyA)

  const perspectiveRightImg = perspectiveSecondaryMedia
    ? {
        src: mediaSrc(perspectiveSecondaryMedia, 'desktop') ?? mediaSrc(perspectiveSecondaryMedia) ?? '',
        alt: perspectiveSecondaryMedia.alt || 'Villa San Antonio interior',
      }
    : slide(storyB)

  const fallbackMetrics = [
    { label: 'Guests capacity', value: 8, detail: 'Space for 6+2 in total comfort & privacy' },
    { label: 'Quiet bedrooms', value: 3, detail: 'Air-conditioned rooms with crisp linens' },
    { label: 'Heated pool', value: 36, suffix: 'm²', detail: 'Private pool with waterfall & sun deck' },
    { label: 'Fenced plot', value: 800, suffix: 'm²', detail: 'Mediterranean garden & stone walls' },
  ]

  const cmsMetrics = perspectiveBlock?.stats?.map((s) => ({
    label: s.label,
    value: s.value,
    suffix: s.suffix || undefined,
    detail: s.detail || undefined,
  }))

  const metricsToUse =
    cmsMetrics && cmsMetrics.length > 0
      ? cmsMetrics
      : fallbackMetrics

  const avgStars =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.stars ?? 5), 0) / reviews.length : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Villa San Antonio',
    description:
      'Premium private holiday villa for 6+2 guests near Šibenik, Dalmatia. Heated pool, jacuzzi, BBQ house, fully fenced garden, pet-friendly.',
    url: 'https://villa-sanantonio.com',
    email: 'kontakt@villa-sanantonio.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Podine, Šibenik', addressCountry: 'HR' },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.647,
      longitude: 16.055,
    },
    ...(avgStars && reviews.length > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: avgStars.toFixed(1),
            reviewCount: reviews.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 01 · Hero */}
      <HeroSection
        images={heroSlides}
        slidesContent={heroContent}
        primaryCta={heroBlock?.primaryCta}
        secondaryCta={heroBlock?.secondaryCta}
        transitionDuration={heroBlock?.transitionDuration}
        interval={heroBlock?.interval}
        coordsText={heroBlock?.coordsText}
        scrollLabel={heroBlock?.scrollLabel}
        instagramUrl={heroBlock?.instagramUrl}
        facebookUrl={heroBlock?.facebookUrl}
      />

      {/* 02 · The Perspective (Visual Storytelling + Metrics) */}
      <section id="perspective" className="mx-auto w-[91.5vw] max-w-[1440px] py-24 lg:py-36 scroll-mt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr] lg:gap-24">
          <div>
            <Reveal>
              <p className="kicker mb-5">{perspectiveBlock?.kicker || 'The perspective'}</p>
              <h2 className="heading-section text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-ink">
                {perspectiveBlock?.title || 'Quiet Dalmatian hills,'}{' '}
                <span className="accent-serif font-normal text-ink">
                  {perspectiveBlock?.accent || 'twenty minutes'}
                </span>{' '}
                {perspectiveBlock?.titleEnd || 'from the sea.'}
              </h2>
            </Reveal>
            <Reveal delay={120} className="mt-8 space-y-5 text-base sm:text-lg leading-relaxed text-ink/70">
              {perspectiveBlock?.paragraphs && perspectiveBlock.paragraphs.length > 0 ? (
                perspectiveBlock.paragraphs.map((p, i) => <p key={i}>{p.text}</p>)
              ) : (
                <>
                  <p>
                    Villa San Antonio sits in the quiet village of Podine, surrounded by olive groves and karst stone. A completely private fenced estate designed for slow summer living.
                  </p>
                  <p>
                    Spend your mornings beside the heated pool, cook under the stars in the authentic stone BBQ house, and reach Šibenik and Krka National Park in a short drive.
                  </p>
                </>
              )}
            </Reveal>
            <Reveal delay={160} className="mt-10">
              <Link
                href="/about-villa"
                className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14rem] text-ink hover:opacity-75 transition-opacity"
              >
                <span>Discover the villa</span>
                <IconArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {perspectiveLeftImg && (
              <Reveal delay={100} className="overflow-hidden rounded-3xl border border-ink/10">
                <Image
                  src={perspectiveLeftImg.src}
                  alt={perspectiveLeftImg.alt}
                  width={800}
                  height={1000}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </Reveal>
            )}
            {perspectiveRightImg && (
              <Reveal delay={200} className="overflow-hidden rounded-3xl border border-ink/10 sm:mt-12">
                <Image
                  src={perspectiveRightImg.src}
                  alt={perspectiveRightImg.alt}
                  width={800}
                  height={1000}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </Reveal>
            )}
          </div>
        </div>

        {/* Key Metrics Band */}
        <div className="mt-24 border-t border-ink/10 pt-16">
          <StatsBand metrics={metricsToUse} />
        </div>
      </section>

      {/* 03 · Living Places & Spaces */}
      <section className="border-t border-ink/10 bg-surface/40 py-24 lg:py-36">
        <div className="mx-auto w-[91.5vw] max-w-[1440px]">
          <Reveal>
            <div className="max-w-2xl space-y-4">
              <p className="kicker">{placesBlock?.kicker || 'Spaces & Ambience'}</p>
              <h2 className="heading-section text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-ink">
                {placesBlock?.title || 'Every corner tailored for'}{' '}
                <span className="accent-serif font-normal text-ink">
                  {placesBlock?.accent || 'shared memories.'}
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {placesToUse.map((place, idx) => {
              const Icon = place.icon
              return (
                <Reveal key={place.name} delay={idx * 100}>
                  <div className="group flex flex-col h-full rounded-3xl border border-ink/10 bg-paper p-6 transition-all duration-300 hover:border-ink/25 hover:shadow-lg">
                    <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                      <Image
                        src={place.src}
                        alt={place.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {place.tag && (
                        <div className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-md">
                          {place.tag}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex flex-col flex-1 justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-ink/50 text-xs font-semibold uppercase tracking-wider mb-2">
                          <Icon size={16} />
                          <span>{place.time}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-medium text-ink">{place.name}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink/70">{place.desc}</p>
                      </div>

                      <Link
                        href={place.link}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink group-hover:underline underline-offset-4 pt-2"
                      >
                        <span>Explore details</span>
                        <IconArrowUpRight size={15} />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* 04 · Gallery Showcase Strip */}
      <section className="py-24 lg:py-36 overflow-hidden">
        <div className="mx-auto w-[91.5vw] max-w-[1440px]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <Reveal>
              <p className="kicker mb-3">{galleryBlock?.kicker || 'Gallery'}</p>
              <h2 className="heading-section text-4xl sm:text-5xl font-medium tracking-tight text-ink">
                {galleryBlock?.title || 'Atmosphere in'}{' '}
                <span className="accent-serif font-normal text-ink">
                  {galleryBlock?.accent || 'still frames.'}
                </span>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-3 rounded-full border border-ink/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14rem] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                <span>View Full Gallery ({gallery.length})</span>
                <IconArrowRight size={15} />
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Full-width marquee gallery track */}
        <div className="w-full">
          <GalleryStrip images={galleryImagesToUse} speed={galleryBlock?.speed || 65} />
        </div>
      </section>

      {/* 05 · Guest Reviews & Experiences */}
      <section className="border-t border-ink/10 bg-surface/50 py-24 lg:py-36">
        <div className="mx-auto w-[91.5vw] max-w-[1440px]">
          <div className="max-w-2xl space-y-4 mb-16">
            <Reveal>
              <p className="kicker">{reviewsBlock?.kicker || 'Guest Impressions'}</p>
              <h2 className="heading-section text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-ink">
                {reviewsBlock?.title || 'Verified words from'}{' '}
                <span className="accent-serif font-normal text-ink">
                  {reviewsBlock?.accent || 'our guests.'}
                </span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-ink/70 leading-relaxed">
                {reviewsBlock?.intro || REVIEWS_INTRO}
              </p>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <ReviewsSwiper reviews={reviewsToUse} />
          </Reveal>
        </div>
      </section>

      {/* 06 · FAQ Section */}
      <section className="mx-auto w-[91.5vw] max-w-[1440px] py-24 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="kicker mb-3">{faqBlock?.kicker || 'FAQ'}</p>
              <h2 className="heading-section text-4xl sm:text-5xl font-medium tracking-tight text-ink">
                {faqBlock?.title || 'Everything you need to'}{' '}
                <span className="accent-serif font-normal text-ink">
                  {faqBlock?.accent || 'know before.'}
                </span>
              </h2>
              <p className="mt-5 text-sm sm:text-base leading-relaxed text-ink/70">
                {faqBlock?.subtext ||
                  'Transparent answers regarding check-in, deposit terms, heated pool temperature, and local amenities.'}
              </p>
              <Link
                href="/faq"
                className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14rem] text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink transition-colors"
              >
                <span>Read all FAQs</span>
                <IconArrowRight size={15} />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <FaqAccordion
              items={faqItemsToUse.map((f) => ({ question: f.question, answer: f.answer }))}
              defaultOpen={0}
            />
          </Reveal>
        </div>
      </section>

      {/* 07 · Direct Booking CTA Banner */}
      <BookingBand {...(bookingBlock || {})} />
    </>
  )
}
