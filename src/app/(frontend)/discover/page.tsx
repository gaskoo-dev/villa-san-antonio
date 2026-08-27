import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BookingBand } from '@/components/BookingBand'
import { DiscoverExperiences, type DiscoverSectionData } from '@/components/DiscoverExperiences'
import { PageIntro } from '@/components/PageIntro'
import {
  getDiscoverCategories,
  getDiscoverItems,
  getDrives,
  getGallery,
  getPageBySlug,
  mediaSrc,
} from '@/lib/queries'
import type { Media, Page } from '@/payload-types'
import { buildPageMetadata } from '@/lib/metadata'
import { getRequestLocale } from '@/lib/request-locale'

type LayoutBlock = NonNullable<Page['layout']>[number]
type HeroSubBlock = Extract<LayoutBlock, { blockType: 'hero-sub' }>
type RegionalDrivesTextBlockType = Extract<LayoutBlock, { blockType: 'regionalDrivesText' }>
type BookingBandBlockType = Extract<LayoutBlock, { blockType: 'bookingBand' }>

export const revalidate = 3600

const fallbackMetadata: Metadata = {
  title: 'Discover Šibenik, Krka & Dalmatia | Villa San Antonio',
  description:
    'Explore Krka waterfalls, Šibenik’s UNESCO fortresses, Kornati boat tours, Primošten vineyards and Adriatic beaches near Villa San Antonio.',
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  return buildPageMetadata(await getPageBySlug('discover', locale), fallbackMetadata, '/discover')
}

export default async function DiscoverPage() {
  const locale = await getRequestLocale()
  const [pageDoc, gallery, categories, experiences, destinations] = await Promise.all([
    getPageBySlug('discover', locale),
    getGallery(200, locale),
    getDiscoverCategories(locale),
    getDiscoverItems(locale),
    getDrives(locale),
  ])

  if (!pageDoc) notFound()

  const fallbackHeroImg = gallery[2] ?? gallery[0]

  const heroSub = pageDoc?.layout?.find((b): b is HeroSubBlock => b.blockType === 'hero-sub')
  const heroMedia =
    typeof heroSub?.image === 'object' && heroSub?.image ? (heroSub.image as Media) : null

  const heroSrc = heroMedia
    ? (mediaSrc(heroMedia, 'desktop') ?? mediaSrc(heroMedia) ?? '')
    : (mediaSrc(fallbackHeroImg?.image, 'desktop') ?? mediaSrc(fallbackHeroImg?.image) ?? '')

  const bookingBandBlock = pageDoc?.layout?.find(
    (b): b is BookingBandBlockType => b.blockType === 'bookingBand',
  )
  const regionalDrivesText = pageDoc?.layout?.find(
    (b): b is RegionalDrivesTextBlockType => b.blockType === 'regionalDrivesText',
  )

  const discoverData: DiscoverSectionData = {
    categories,
    experiences,
    destinationsKicker: regionalDrivesText?.kicker ?? null,
    destinationsTitle: regionalDrivesText?.title ?? null,
    destinationsLead: regionalDrivesText?.text ?? null,
    destinations,
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
