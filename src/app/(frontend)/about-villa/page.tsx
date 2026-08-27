import { IconArrowUpRight, IconBed, IconCheck, IconFlame, IconMapPin, IconPaw, IconPool, IconSparkles, IconSun, IconUsers } from '@tabler/icons-react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { BookingBand } from '@/components/BookingBand'
import { PageIntro } from '@/components/PageIntro'
import { Reveal } from '@/components/Reveal'
import { RoomImageSlider, type SlideImage } from '@/components/RoomImageSlider'
import { ABOUT_INTRO, WELCOME_PACKAGE } from '@/lib/content'
import { buildPageMetadata } from '@/lib/metadata'
import { getGallery, getPageBySlug, mediaSrc, type GalleryEntry } from '@/lib/queries'
import { getRequestLocale } from '@/lib/request-locale'
import type { Media, Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]
type HeroSubBlock = Extract<LayoutBlock, { blockType: 'hero-sub' }>
type StoryHighlightsBlock = Extract<LayoutBlock, { blockType: 'storyHighlights' }>
type SpacesShowcaseBlock = Extract<LayoutBlock, { blockType: 'spacesShowcase' }>
type WelcomePackageBlock = Extract<LayoutBlock, { blockType: 'welcomePackage' }>
type DistancesBlock = Extract<LayoutBlock, { blockType: 'distances' }>
type BookingBandBlock = Extract<LayoutBlock, { blockType: 'bookingBand' }>

const HIGHLIGHT_ICON_MAP = {
  users: IconUsers,
  pool: IconPool,
  flame: IconFlame,
  paw: IconPaw,
  bed: IconBed,
  sun: IconSun,
  sparkles: IconSparkles,
} as const

export const revalidate = 3600

const fallbackMetadata: Metadata = {
  title: 'About the Villa',
  description:
    'Heated pool with waterfall, BBQ house with fireplace, three quiet bedrooms and a fully fenced garden. Everything Villa San Antonio offers, inside and out.',
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  return buildPageMetadata(await getPageBySlug('about-villa', locale), fallbackMetadata, '/about-villa')
}

type SpaceItem = {
  name: string
  category?: string | null
  subtitle?: string | null
  images?: Array<{ image: Media | number; id?: string | null }> | null
  features?: Array<{ label: string; id?: string | null }> | null
}

function getSpaceSlideImages(space: SpaceItem, allGallery: GalleryEntry[]): SlideImage[] {
  const images: SlideImage[] = []

  // 1. If block has uploaded images
  if (space.images && space.images.length > 0) {
    for (const item of space.images) {
      if (typeof item.image === 'object' && item.image) {
        const src = mediaSrc(item.image, 'desktop') ?? mediaSrc(item.image)
        if (src && !images.some((img) => img.src === src)) {
          images.push({ src, alt: space.name })
        }
      }
    }
  }

  // 2. Fallback matching from full gallery by space filename patterns
  if (images.length === 0) {
    const nameLower = space.name.toLowerCase()
    const catLower = (space.category || '').toLowerCase()

    const matchFilenames: string[] = []
    if (nameLower.includes('kitchen')) {
      matchFilenames.push('-032', '-033', '-034', '-035', '-036', '-037', '-038')
    } else if (nameLower.includes('living')) {
      matchFilenames.push('-039', '-040', '-041')
    } else if (nameLower.includes('master')) {
      matchFilenames.push('-056', '-057', '-058', '-059', '-060')
    } else if (nameLower.includes('two')) {
      matchFilenames.push('-046', '-047', '-048', '-049')
    } else if (nameLower.includes('three')) {
      matchFilenames.push('-042', '-043', '-044', '-045')
    } else if (catLower === 'bathrooms' || nameLower.includes('bath') || nameLower.includes('restroom')) {
      matchFilenames.push('-030', '-031', '-050', '-051', '-052', '-061', '-062')
    } else if (catLower === 'bbq-house' || nameLower.includes('bbq')) {
      matchFilenames.push('-075', '-076', '-077', '-078', '-079', '-080', '-081')
    } else if (nameLower.includes('pool') || nameLower.includes('terrace')) {
      matchFilenames.push('-001', '-002', '-003', '-004', '-026', '-027', '-087', '-088')
    } else if (nameLower.includes('garden') || nameLower.includes('playground')) {
      matchFilenames.push('-011', '-012', '-013', '-014', '-015', '-016', '-017')
    }

    for (const g of allGallery) {
      const fn = g.image.filename || ''
      if (matchFilenames.some((pattern) => fn.includes(pattern))) {
        const src = mediaSrc(g.image, 'desktop') ?? mediaSrc(g.image)
        if (src && !images.some((img) => img.src === src)) {
          images.push({ src, alt: g.alt || g.image.alt || space.name })
        }
      }
    }
  }

  return images
}

function SpaceRow({
  space,
  index,
  allGallery,
}: {
  space: SpaceItem
  index: number
  allGallery: GalleryEntry[]
}) {
  const isReversed = index % 2 === 1
  const images = getSpaceSlideImages(space, allGallery)
  const rows = (space.features ?? []).filter((f): f is { label: string; id?: string | null } => Boolean(f?.label))

  return (
    <div className="grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24 border-t border-ink/10 first:border-t-0 first:pt-0">
      {/* Visual Slider Column */}
      <div className={`w-full ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper p-3 sm:p-4 shadow-xs">
            <RoomImageSlider images={images} title={space.name} />
          </div>
        </Reveal>
      </div>

      {/* Narrative & Checklist Column */}
      <div className={`space-y-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
        <Reveal delay={80}>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-medium tracking-widest text-ink/65">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="h-px w-8 bg-ink/20" />
            <span className="text-xs font-semibold uppercase tracking-[0.14rem] text-ink/60">
              {(space.category || 'space').replace('-', ' ')}
            </span>
          </div>

          <h3 className="mt-3 text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl text-ink">
            {space.name}
          </h3>

          {space.subtitle && (
            <p className="mt-3 text-base leading-relaxed text-ink/65 max-w-xl">
              {space.subtitle}
            </p>
          )}
        </Reveal>

        {rows.length > 0 && (
          <Reveal delay={140}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 pt-4">
              {rows.map((f) => (
                <li key={f.label} className="flex items-center gap-3 text-sm font-medium text-ink/80">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface text-ink border border-ink/10 shadow-2xs">
                    <IconCheck size={11} stroke={2.5} />
                  </span>
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </div>
  )
}

const DEFAULT_DISTANCES = [
  { label: 'Split Airport (SPU)', value: '45 km · 40 min drive' },
  { label: 'Zadar Airport (ZAD)', value: '75 km · 50 min drive' },
  { label: 'Historic Šibenik Old Town', value: '14 km · 15 min drive' },
  { label: 'Krka National Park waterfalls', value: '15 km · 15 min drive' },
  { label: 'Nearest Adriatic pebble beaches', value: '10 km · 12 min drive' },
  { label: 'Supermarket & local grocery', value: '3 km · 4 min drive' },
]

export default async function AboutPage() {
  const locale = await getRequestLocale()
  const [pageDoc, gallery] = await Promise.all([
    getPageBySlug('about-villa', locale),
    getGallery(200, locale),
  ])

  if (!pageDoc) notFound()

  const heroSub = pageDoc?.layout?.find((b): b is HeroSubBlock => b.blockType === 'hero-sub')
  const storyBlock = pageDoc?.layout?.find((b): b is StoryHighlightsBlock => b.blockType === 'storyHighlights')
  const showcaseBlocks =
    pageDoc?.layout?.filter((b): b is SpacesShowcaseBlock => b.blockType === 'spacesShowcase') ?? []

  const heroMedia = typeof heroSub?.image === 'object' && heroSub?.image ? (heroSub.image as Media) : null
  const fallbackHeroImg = gallery.find((g) => g.image.filename?.includes('-088')) ?? gallery[0]

  const heroSrc = heroMedia
    ? (mediaSrc(heroMedia, 'desktop') ?? mediaSrc(heroMedia) ?? '')
    : (mediaSrc(fallbackHeroImg?.image, 'desktop') ?? mediaSrc(fallbackHeroImg?.image) ?? '')

  const storyParagraphs =
    storyBlock?.paragraphs && storyBlock.paragraphs.length > 0
      ? storyBlock.paragraphs.map((p) => p.text)
      : ABOUT_INTRO.slice(1)

  const distancesBlock = pageDoc?.layout?.find((b): b is DistancesBlock => b.blockType === 'distances')
  const distancesToUse =
    distancesBlock?.items && distancesBlock.items.length > 0
      ? distancesBlock.items
      : DEFAULT_DISTANCES

  const welcomeBlock = pageDoc?.layout?.find((b): b is WelcomePackageBlock => b.blockType === 'welcomePackage')
  const bookingBlock = pageDoc?.layout?.find((b): b is BookingBandBlock => b.blockType === 'bookingBand')

  const welcomeKicker = welcomeBlock?.kicker || WELCOME_PACKAGE.kicker
  const welcomeHeadline = welcomeBlock?.headline || WELCOME_PACKAGE.headline
  const welcomeAccent = welcomeBlock?.accent || WELCOME_PACKAGE.accent
  const welcomeBody = welcomeBlock?.body || WELCOME_PACKAGE.body
  const welcomeDelicacies =
    welcomeBlock?.delicacies && welcomeBlock.delicacies.length > 0
      ? welcomeBlock.delicacies
      : WELCOME_PACKAGE.delicacies

  const welcomeImg1 =
    (typeof welcomeBlock?.imageMain === 'object' && welcomeBlock?.imageMain && mediaSrc(welcomeBlock.imageMain as Media, 'desktop')) ||
    mediaSrc(gallery.find((g) => g.image.filename?.includes('-088'))?.image, 'desktop') ||
    mediaSrc(gallery[0]?.image, 'desktop') ||
    ''
  const welcomeImg2 =
    (typeof welcomeBlock?.imageTop === 'object' && welcomeBlock?.imageTop && mediaSrc(welcomeBlock.imageTop as Media, 'desktop')) ||
    mediaSrc(gallery.find((g) => g.image.filename?.includes('-078'))?.image, 'desktop') ||
    mediaSrc(gallery[1]?.image, 'desktop') ||
    ''
  const welcomeImg3 =
    (typeof welcomeBlock?.imageBottom === 'object' && welcomeBlock?.imageBottom && mediaSrc(welcomeBlock.imageBottom as Media, 'desktop')) ||
    mediaSrc(gallery.find((g) => g.image.filename?.includes('-072'))?.image, 'desktop') ||
    mediaSrc(gallery[2]?.image, 'desktop') ||
    ''

  const defaultHighlights = [
    {
      icon: 'users' as const,
      label: '8 Guests (6+2)',
      detail: '3 quiet master suites & 4 bathrooms',
    },
    {
      icon: 'pool' as const,
      label: '36 m² Heated Pool',
      detail: 'Private pool with waterfall & sun deck',
    },
    {
      icon: 'flame' as const,
      label: 'Stone BBQ House',
      detail: 'Indoor/outdoor dining & stone fireplace',
    },
    {
      icon: 'paw' as const,
      label: '800 m² Fenced Garden',
      detail: 'Playground, bikes & pet-friendly estate',
    },
  ]

  const highlightsToUse =
    storyBlock?.highlights && storyBlock.highlights.length > 0
      ? storyBlock.highlights
      : defaultHighlights

  return (
    <>
      <PageIntro
        title={heroSub?.title || 'A private estate in'}
        accent={heroSub?.accent || 'the hinterland.'}
        lead={
          heroSub?.lead ||
          'Complete privacy, authentic Dalmatian ambience, and effortless comfort close to the coast and Krka National Park.'
        }
        breadcrumbs={[{ label: heroSub?.breadcrumbLabel || 'About Villa' }]}
        image={{
          src: heroSrc,
          alt: heroMedia?.alt || fallbackHeroImg?.alt || fallbackHeroImg?.image?.alt || 'Villa San Antonio',
        }}
      />

      {/* Intro story */}
      <section className="mx-auto grid w-[91.5vw] max-w-[1440px] gap-12 sm:gap-14 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:py-36 items-stretch">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-6">
            <Reveal>
              <p className="kicker mb-4">{storyBlock?.kicker || 'The villa'}</p>
              <h2 className="text-4xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl text-ink">
                {storyBlock?.title || 'One house,'}{' '}
                <span className="accent-serif font-normal text-ink">
                  {storyBlock?.accent || 'held for you.'}
                </span>
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface/70 px-4.5 py-2 text-xs font-medium text-ink/75">
                <IconMapPin size={15} className="text-ink/60" />
                <span>{storyBlock?.badge || 'Podine, Šibenik · 20 min to the sea'}</span>
              </div>
            </Reveal>
          </div>

          {/* Embedded Interactive Google Map Card */}
          {storyBlock?.showMap !== false && (
            <Reveal delay={120} className="mt-8 flex flex-1 flex-col min-h-[340px] overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-xs">
              <a
                href={storyBlock?.mapDirectUrl || 'https://maps.app.goo.gl/Xm8sAH7drKf2pADaA'}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex-1 min-h-[280px] w-full overflow-hidden block cursor-pointer group"
                aria-label="Open Villa San Antonio in Google Maps"
              >
                <iframe
                  src={
                    storyBlock?.mapEmbedUrl ||
                    'https://maps.google.com/maps?q=43.6470678,16.0546611+(Villa+San+Antonio)&hl=en&z=13&output=embed'
                  }
                  title="Villa San Antonio location on Google Maps"
                  className="pointer-events-none absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  tabIndex={-1}
                />
              </a>
              <div className="flex items-center justify-between border-t border-ink/10 bg-surface/60 px-5 py-3.5 text-xs shrink-0">
                <span className="text-ink/75 font-medium truncate">
                  {storyBlock?.mapAddress || 'Podine 14, Šibenik'}
                </span>
                <a
                  href={storyBlock?.mapDirectUrl || 'https://maps.app.goo.gl/Xm8sAH7drKf2pADaA'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-ink hover:underline shrink-0"
                >
                  <span>Open in Google Maps</span>
                  <IconArrowUpRight size={14} />
                </a>
              </div>
            </Reveal>
          )}
        </div>

        <div className="space-y-8">
          {/* Editorial Lead Paragraph */}
          <Reveal delay={100}>
            <p className="text-lg sm:text-xl font-light leading-relaxed text-ink/90 max-w-[65ch]">
              {storyBlock?.lead || ABOUT_INTRO[0]}
            </p>
          </Reveal>

          {/* Secondary Narrative Paragraphs */}
          <Reveal delay={140}>
            <div className="max-w-[65ch] space-y-4 text-[15px] sm:text-base leading-relaxed text-ink/65">
              {storyParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </Reveal>

          {/* Key Highlight Metric Cards Grid */}
          <Reveal delay={180}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {highlightsToUse.map((h) => {
                const iconKey = (h.icon as keyof typeof HIGHLIGHT_ICON_MAP) || 'users'
                const Icon = HIGHLIGHT_ICON_MAP[iconKey] || IconUsers
                return (
                  <div
                    key={h.label}
                    className="group flex items-start gap-4 rounded-2xl border border-ink/10 bg-paper p-5 transition-all duration-300 hover:border-ink/25 hover:shadow-xs"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-ink transition-transform duration-300 group-hover:scale-105">
                      <Icon size={22} stroke={1.75} />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink leading-tight">{h.label}</h3>
                      <p className="mt-1 text-xs text-ink/60 leading-relaxed">{h.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Dynamic SpacesShowcase CMS Blocks */}
      {showcaseBlocks.map((block, bIdx) => (
        <section
          key={bIdx}
          className={`${block.bgStyle === 'paper' ? 'bg-paper' : 'bg-surface'} px-4 sm:px-6 py-16 sm:py-24 lg:py-36`}
        >
          <div className="mx-auto max-w-[1440px]">
            <Reveal>
              {block.kicker && <p className="kicker mb-5">{block.kicker}</p>}
              <h2 className="heading-section max-w-3xl">
                {block.title}{' '}
                {block.accent && <span className="accent-serif font-normal">{block.accent}</span>}
              </h2>
            </Reveal>
            <div className="mt-12 sm:mt-16">
              {(block.spaces ?? []).map((s, i) => (
                <SpaceRow key={s.name + i} space={s} index={i} allGallery={gallery} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Welcome Package Section */}
      <section className="border-t border-ink/10 bg-surface px-4 sm:px-6 py-16 sm:py-24 lg:py-36">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Narrative & Delicacy Tags */}
            <div className="space-y-6">
              <Reveal>
                <p className="kicker mb-5">{welcomeKicker}</p>

                <h2 className="mt-4 text-3xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-5xl text-ink">
                  {welcomeHeadline}{' '}
                  <span className="accent-serif font-normal text-ink">{welcomeAccent}</span>
                </h2>

                <p className="mt-5 text-base sm:text-lg leading-relaxed text-ink/75 max-w-xl">
                  {welcomeBody}
                </p>
              </Reveal>

              <Reveal delay={120}>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 pt-2">
                  {welcomeDelicacies.map((item) => (
                    <li key={item.label} className="flex items-center gap-3 text-sm font-medium text-ink/80">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-paper text-ink border border-ink/10 shadow-2xs">
                        <IconCheck size={11} stroke={2.5} />
                      </span>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Right: 3-Image Luxury Grid Collage */}
            <Reveal delay={100}>
              <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper p-3 sm:p-4 shadow-xs">
                <div className="grid grid-cols-12 gap-3 sm:gap-3.5">
                  {/* Main large image */}
                  <div className="col-span-12 sm:col-span-7 overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-xs group">
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                      <Image
                        src={welcomeImg1}
                        alt="Villa San Antonio pool and welcome setting"
                        fill
                        sizes="(min-width: 1024px) 30vw, 91vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Stacked 2 images on the right */}
                  <div className="col-span-12 sm:col-span-5 flex flex-col gap-3 sm:gap-3.5">
                    <div className="flex-1 overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-xs group">
                      <div className="relative aspect-[16/11] sm:h-full w-full overflow-hidden">
                        <Image
                          src={welcomeImg2}
                          alt="Outdoor kitchen and dining"
                          fill
                          sizes="(min-width: 1024px) 20vw, 91vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-xs group">
                      <div className="relative aspect-[16/11] sm:h-full w-full overflow-hidden">
                        <Image
                          src={welcomeImg3}
                          alt="Villa San Antonio terrace at dusk"
                          fill
                          sizes="(min-width: 1024px) 20vw, 91vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Distances (Swapped after Welcome Package) */}
      {distancesToUse.length > 0 && (
        <section className="mx-auto w-[91.5vw] max-w-[1440px] py-16 sm:py-24 lg:py-36">
          <Reveal>
            <p className="kicker mb-5">{distancesBlock?.kicker || 'Distances'}</p>
            <h2 className="heading-section max-w-3xl">
              {distancesBlock?.title || 'Quietly placed,'}{' '}
              <span className="accent-serif font-normal">
                {distancesBlock?.accent || 'close to everything.'}
              </span>
            </h2>
          </Reveal>
          <div className="mt-12 sm:mt-16 grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
            {distancesToUse.map((d, i) => (
              <Reveal key={d.label + i} delay={i * 70} y={30} className="h-full">
                <div className="flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-paper p-4 sm:p-6 transition-all duration-300 hover:border-ink/25 hover:shadow-xs">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-ink">{d.value}</p>
                  <p className="mt-2 text-xs sm:text-sm text-ink/70 leading-snug">{d.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <BookingBand {...(bookingBlock || {})} />
    </>
  )
}
