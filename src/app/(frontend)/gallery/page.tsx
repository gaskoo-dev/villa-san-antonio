import type { Metadata } from 'next'
import React from 'react'

import { BookingBand } from '@/components/BookingBand'
import { GalleryGrid } from '@/components/GalleryGrid'
import { PageIntro } from '@/components/PageIntro'
import { Reveal } from '@/components/Reveal'
import { GALLERY_INTRO } from '@/lib/content'
import { getGallery, getGalleryCategories, getPageBySlug, mediaSrc } from '@/lib/queries'
import type { Media, Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]
type HeroSubBlock = Extract<LayoutBlock, { blockType: 'hero-sub' }>
type BookingBandBlock = Extract<LayoutBlock, { blockType: 'bookingBand' }>

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'The pool at dusk, the BBQ evenings, the quiet bedrooms. Browse through the whole of Villa San Antonio in photographs.',
}

export default async function GalleryPage() {
  const [pageDoc, gallery, categories] = await Promise.all([
    getPageBySlug('gallery'),
    getGallery(200),
    getGalleryCategories(),
  ])

  const heroSub = pageDoc?.layout?.find((b): b is HeroSubBlock => b.blockType === 'hero-sub')
  const bookingBlock = pageDoc?.layout?.find((b): b is BookingBandBlock => b.blockType === 'bookingBand')
  const heroMedia = typeof heroSub?.image === 'object' && heroSub?.image ? (heroSub.image as Media) : null
  const fallbackHeroImg = gallery.find((g) => g.featured) ?? gallery[0]

  const heroSrc = heroMedia
    ? (mediaSrc(heroMedia, 'desktop') ?? mediaSrc(heroMedia) ?? '')
    : (mediaSrc(fallbackHeroImg?.image, 'desktop') ?? mediaSrc(fallbackHeroImg?.image) ?? '')

  return (
    <>
      <PageIntro
        title={heroSub?.title || 'Atmosphere in'}
        accent={heroSub?.accent || 'still frames.'}
        lead={heroSub?.lead || GALLERY_INTRO}
        breadcrumbs={[{ label: heroSub?.breadcrumbLabel || 'Gallery' }]}
        image={{
          src: heroSrc,
          alt: heroMedia?.alt || fallbackHeroImg?.alt || fallbackHeroImg?.image?.alt || 'Villa San Antonio',
        }}
      />

      <section className="mx-auto w-[91.5vw] max-w-[1440px] py-16 lg:py-24">
        <Reveal>
          <GalleryGrid images={gallery} categories={categories} />
        </Reveal>
      </section>

      <BookingBand {...(bookingBlock || {})} />
    </>
  )
}
