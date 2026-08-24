import type { Metadata } from 'next'

import { BookingBand } from '@/components/BookingBand'
import { DiscoverExperiences, type DiscoverSectionData } from '@/components/DiscoverExperiences'
import { PageIntro } from '@/components/PageIntro'
import { getGallery, getPageBySlug, mediaSrc } from '@/lib/queries'
import type { Media, Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]
type HeroSubBlock = Extract<LayoutBlock, { blockType: 'hero-sub' }>
type DiscoverSectionBlockType = Extract<LayoutBlock, { blockType: 'discoverSection' }>
type BookingBandBlockType = Extract<LayoutBlock, { blockType: 'bookingBand' }>

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Discover Šibenik, Krka & Dalmatia | Villa San Antonio',
  description:
    'Explore the top attractions around Villa San Antonio: Krka National Park waterfalls, UNESCO fortresses, Kornati boat tours, Primošten vineyards, and pristine Adriatic beaches.',
  alternates: {
    canonical: 'https://villa-sanantonio.com/discover',
  },
}

export default async function DiscoverPage() {
  const [pageDoc, gallery] = await Promise.all([
    getPageBySlug('discover'),
    getGallery(),
  ])

  const fallbackHeroImg = gallery[2] ?? gallery[0]

  const heroSub = pageDoc?.layout?.find((b): b is HeroSubBlock => b.blockType === 'hero-sub')
  const heroMedia = typeof heroSub?.image === 'object' && heroSub?.image ? (heroSub.image as Media) : null

  const heroSrc = heroMedia
    ? (mediaSrc(heroMedia, 'desktop') ?? mediaSrc(heroMedia) ?? '')
    : (mediaSrc(fallbackHeroImg?.image, 'desktop') ?? mediaSrc(fallbackHeroImg?.image) ?? '')

  const discoverBlock = pageDoc?.layout?.find(
    (b): b is DiscoverSectionBlockType => b.blockType === 'discoverSection'
  )

  const bookingBandBlock = pageDoc?.layout?.find(
    (b): b is BookingBandBlockType => b.blockType === 'bookingBand'
  )

  const discoverData: DiscoverSectionData = {
    kicker: discoverBlock?.kicker || 'Dalmatian Riviera & Hinterland',
    title: discoverBlock?.title || 'Between cascading waterfalls,',
    accent: discoverBlock?.accent || 'historic forts & Adriatic sea.',
    lead:
      discoverBlock?.lead ||
      'From cascading national park waterfalls and UNESCO stone fortresses to secluded island coves and authentic wine cellars — all within minutes of Villa San Antonio.',
    experiences: discoverBlock?.experiences ?? null,
    destinationsTitle: discoverBlock?.destinationsTitle ?? null,
    destinationsLead: discoverBlock?.destinationsLead ?? null,
    destinations: discoverBlock?.destinations ?? null,
    conciergeTitle: discoverBlock?.conciergeTitle ?? null,
    conciergeText: discoverBlock?.conciergeText ?? null,
    conciergeButtonLabel: discoverBlock?.conciergeButtonLabel ?? null,
    conciergePhone: discoverBlock?.conciergePhone ?? null,
  }

  return (
    <>
      {/* Full-Cover Cinematic Hero */}
      <PageIntro
        title={heroSub?.title || 'Discover the best of'}
        accent={heroSub?.accent || 'Dalmatia.'}
        lead={
          heroSub?.lead ||
          'Positioned in the peaceful Šibenik hinterland, Villa San Antonio is the ultimate gateway to Krka National Park, Adriatic beaches, UNESCO heritage, and authentic local flavours.'
        }
        breadcrumbs={[{ label: heroSub?.breadcrumbLabel || 'Discover' }]}
        image={{
          src: heroSrc,
          alt:
            heroMedia?.alt ||
            fallbackHeroImg?.alt ||
            fallbackHeroImg?.image?.alt ||
            'Discover Dalmatia from Villa San Antonio',
        }}
      />

      {/* Main Discover Experiences & Destinations */}
      <DiscoverExperiences data={discoverData} />

      {/* Direct Booking CTA Banner */}
      <BookingBand {...(bookingBandBlock || {})} />
    </>
  )
}
