'use client'

import {
  IconArrowRight,
  IconArrowUpRight,
  IconMapPin,
  IconNavigation,
  IconSparkles,
  IconX,
  IconZoomIn,
} from '@tabler/icons-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { A11y, Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

import { LightboxModal, type LightboxItem } from '@/components/LightboxModal'
import { Reveal } from '@/components/Reveal'
import { mediaSrc } from '@/lib/media'
import type { Media } from '@/payload-types'

export type ExperienceItem = {
  title: string
  category?: DiscoverCategoryItem | number | string | null
  tag?: string | null
  badge?: string | null
  externalLink?: string | null
  mapsUrl?: string | null
  desc: unknown // Lexical JSON or string
  images?: Array<{ image: Media | number; id?: string | null }> | null
  fallbackImages?: Array<string | { url: string; id?: string | null }> | null
  id?: string | null
}

export type DiscoverCategoryItem = {
  id?: number | string | null
  name: string
  slug: string
}

export type DestinationItem = {
  name: string
  category?: string | null
  distance?: string | null
  driveTime?: string | null
  desc?: string | null
  mapsUrl?: string | null
  id?: string | null
}

export type DiscoverSectionData = {
  kicker?: string | null
  title?: string | null
  accent?: string | null
  lead?: string | null
  categories?: DiscoverCategoryItem[] | null
  experiences?: ExperienceItem[] | null
  destinationsKicker?: string | null
  destinationsTitle?: string | null
  destinationsLead?: string | null
  destinations?: DestinationItem[] | null
}

const FALLBACK_CATEGORIES: DiscoverCategoryItem[] = [
  { slug: 'nature', name: 'Nature & Parks' },
  { slug: 'adventure', name: 'Adventures & Sea' },
  { slug: 'gastro', name: 'Wine & Gastro' },
  { slug: 'culture', name: 'Culture & UNESCO' },
  { slug: 'beaches', name: 'Beaches' },
]

function getCategorySlug(category: ExperienceItem['category']): string {
  if (category && typeof category === 'object') return category.slug
  return category == null ? '' : String(category)
}

function getCategoryLabel(
  category: ExperienceItem['category'],
  categories: DiscoverCategoryItem[],
): string {
  if (category && typeof category === 'object') return category.name
  const slug = getCategorySlug(category)
  return categories.find((item) => item.slug === slug)?.name || slug || 'Experience'
}

const FALLBACK_EXPERIENCES: ExperienceItem[] = [
  {
    title: 'Krka National Park & Waterfalls',
    category: 'nature',
    tag: '18 min drive · 18 km',
    badge: 'Must Visit',
    externalLink: 'https://www.npkrka.hr/en_US/',
    mapsUrl: 'https://maps.google.com/?q=Skradinski+Buk+Krka+National+Park',
    fallbackImages: [
      'https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600&q=85',
    ],
    desc: 'Seven magnificent travertine waterfalls, Skradinski Buk, crystal clear lakes, and boat rides through the canyon. One of Croatia’s greatest natural wonders. Stroll scenic wooden walkways suspended over emerald pools, take an unforgettable boat excursion to the Franciscan island monastery of Visovac, or discover pristine swimming spots along the lower canyon cascades.',
  },
  {
    title: 'Čikola Canyon Zipline & Hiking',
    category: 'adventure',
    tag: '22 min drive · 25 km',
    badge: 'Adrenaline',
    mapsUrl: 'https://maps.google.com/?q=Zipline+Cikola+Canyon',
    fallbackImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
    ],
    desc: 'Fly across the 1.4 km zipline over the breathtaking Čikola River canyon, climb the via ferrata, or hike the dramatic limestone cliffs. Towering limestone walls rise up to 130 meters above the canyon floor, creating one of Dalmatia’s most striking geological landscapes. Perfect for thrill-seekers and nature lovers seeking active outdoor adventures.',
  },
  {
    title: 'Babić Wine Tastings & Primošten Vineyards',
    category: 'gastro',
    tag: '15 min drive · 16 km',
    badge: 'Local Taste',
    mapsUrl: 'https://maps.google.com/?q=Bucavac+Vineyards+Primosten',
    fallbackImages: [
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=1600&q=85',
    ],
    desc: 'Sample the world-renowned Dalmatian Babić red wine among the stone-walled Bucavac vineyards, recognized on the UNESCO tentative list. Hand-carved geometric stone enclosures protect the autochthonous Babić grapes against harsh sea winds. Visit authentic family-owned konobas to pair full-bodied red wines with local sheep cheese, aged prosciutto, and wood-fired peka.',
  },
  {
    title: 'St. Nicholas Island Fortress',
    category: 'culture',
    tag: '15 min drive · 14 km',
    badge: 'UNESCO Heritage',
    externalLink: 'https://www.kanal-svetog-ante.com/en',
    mapsUrl: 'https://maps.google.com/?q=St+Nicholas+Fortress+Sibenik',
    fallbackImages: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1548625361-195fe57876a4?auto=format&fit=crop&w=1600&q=85',
    ],
    desc: 'A unique 16th-century Venetian sea fortress built on an islet at the entrance to St. Anthony’s Channel, inscribed as a UNESCO World Heritage Site. Walk along the pine-fringed coastal sea promenade with panoramic archipelago views. Admire the fortress’s triangular stone architecture and centuries of maritime guardian history at sunset.',
  },
  {
    title: 'Kornati Archipelago Private Boat Charter',
    category: 'adventure',
    tag: 'Marina 12 min · Day Trip',
    badge: 'Island Escape',
    externalLink: 'https://www.kornati.hr/en/',
    mapsUrl: 'https://maps.google.com/?q=Kornati+National+Park',
    fallbackImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=85',
    ],
    desc: 'Cruise through a nautical maze of 89 uninhabited islands and islets, swim in secluded turquoise bays, and dine at secluded fisherman konobas. Private speedboat tours depart just minutes from the villa. Dive into crystal lagoons, explore untouched sea caves, and enjoy fresh sea bass caught daily.',
  },
  {
    title: 'Šibenik Medieval Old Town & St. James',
    category: 'culture',
    tag: '12 min drive · 12 km',
    badge: 'UNESCO Cathedral',
    externalLink: 'https://www.sibenik-tourism.hr/en/',
    mapsUrl: 'https://maps.google.com/?q=Cathedral+of+St+James+Sibenik',
    fallbackImages: [
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    ],
    desc: 'Stroll cobblestone alleys, climb to St. Michael’s and Barone Fortresses with sunset views, and visit the monumental St. James Cathedral. Built entirely of stone without mortar, the UNESCO cathedral is a masterpiece of Renaissance architecture. Discover Michelin-starred fine dining and cozy wine bars in medieval stone courtyards.',
  },
  {
    title: 'Primošten Sandy & Pebble Beaches',
    category: 'beaches',
    tag: '20 min drive · 22 km',
    badge: 'Crystal Waters',
    mapsUrl: 'https://maps.google.com/?q=Plaza+Raduca+Primosten',
    fallbackImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    ],
    desc: 'Pristine pine-fringed beaches at Raduča Peninsula, scenic coastal promenades, and beachside restaurants with fresh grilled fish. Crystal transparent water makes it a top destination for swimming and snorkeling. Rent sea kayaks, enjoy shade under fragrant pines, and watch the sun dip into the open Adriatic.',
  },
  {
    title: 'Šibenik Bridge Bungee Jumping',
    category: 'adventure',
    tag: '16 min drive · 15 km',
    badge: 'Adrenaline',
    mapsUrl: 'https://maps.google.com/?q=Sibenski+Most',
    fallbackImages: [
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
    ],
    desc: 'Experience the thrill of a 40-meter jump above the sea directly from the iconic Šibenik Bridge with spectacular views of the Krka river canyon. Leap towards the turquoise water where the river meets the Adriatic. Professional certified jump masters provide full safety gear and video recordings of your jump.',
  },
]

const FALLBACK_DESTINATIONS: DestinationItem[] = [
  {
    name: 'Šibenik Old Town & St. James Cathedral',
    category: 'Historic Center · UNESCO',
    distance: '12 km',
    driveTime: '12 min',
    desc: 'Four medieval fortresses, Michelin-star dining & sea promenade.',
    mapsUrl: 'https://maps.google.com/?q=Cathedral+of+St+James+Sibenik',
  },
  {
    name: 'Krka National Park (Skradinski Buk & Skradin)',
    category: 'National Park',
    distance: '18 km',
    driveTime: '18 min',
    desc: 'Cascading waterfalls, riverboat departures & nature trails.',
    mapsUrl: 'https://maps.google.com/?q=Skradinski+Buk+Krka+National+Park',
  },
  {
    name: 'St. Nicholas Island Fortress (UNESCO)',
    category: 'UNESCO Maritime Landmark',
    distance: '14 km',
    driveTime: '15 min',
    desc: 'Venetian coastal defense fort at the St. Anthony Channel entrance.',
    mapsUrl: 'https://maps.google.com/?q=St+Nicholas+Fortress+Sibenik',
  },
  {
    name: 'Primošten Old Town & Raduča Beach',
    category: 'Coastal Town & Beaches',
    distance: '22 km',
    driveTime: '20 min',
    desc: 'Peninsula beaches, stone alleys & iconic Bucavac vineyards.',
    mapsUrl: 'https://maps.google.com/?q=Primosten+Old+Town',
  },
  {
    name: 'Čikola River Canyon & Zipline',
    category: 'Outdoor & Adventure',
    distance: '25 km',
    driveTime: '22 min',
    desc: '1.4 km aerial zipline, via ferrata climbing & scenic viewpoints.',
    mapsUrl: 'https://maps.google.com/?q=Zipline+Cikola+Canyon',
  },
  {
    name: 'Kornati National Park (Boat Departure)',
    category: 'Island Excursions',
    distance: '12 km',
    driveTime: '15 min',
    desc: 'Departure points for private skippered tours to the archipelago.',
    mapsUrl: 'https://maps.google.com/?q=Sibenik+Port',
  },
  {
    name: 'Split International Airport (SPU)',
    category: 'Airport Transfer',
    distance: '48 km',
    driveTime: '40 min',
    desc: 'Easy highway & coastal route directly to the villa gates.',
    mapsUrl: 'https://maps.google.com/?q=Split+Airport+SPU',
  },
  {
    name: 'Zadar International Airport (ZAD)',
    category: 'Airport Transfer',
    distance: '75 km',
    driveTime: '50 min',
    desc: 'Smooth A1 highway connection directly to Šibenik exit.',
    mapsUrl: 'https://maps.google.com/?q=Zadar+Airport+ZAD',
  },
]

type LexicalNode = {
  type: string
  text?: string
  tag?: string
  format?: number | string
  url?: string
  newTab?: boolean
  fields?: {
    url?: string
    newTab?: boolean
    linkType?: 'custom' | 'internal'
    doc?: {
      relationTo: string
      value: { slug?: string; id?: string | number }
    }
  }
  checked?: boolean
  listType?: 'bullet' | 'number' | 'check'
  indent?: number
  value?: unknown
  children?: LexicalNode[]
  [key: string]: unknown
}

export function RenderRichText({ content }: { content: unknown }) {
  if (!content) return null

  if (typeof content === 'string') {
    return (
      <div className="space-y-3 text-ink/80 text-sm sm:text-base leading-relaxed">
        {content.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    )
  }

  const root = (content as { root?: LexicalNode })?.root
  if (!root || !Array.isArray(root.children)) return null

  const getAlignmentClass = (format?: number | string) => {
    if (format === 'center' || format === 2) return 'text-center'
    if (format === 'right' || format === 3) return 'text-right'
    if (format === 'justify' || format === 4) return 'text-justify'
    return 'text-left'
  }

  const renderNode = (node: LexicalNode, index: number): React.ReactNode => {
    if (!node) return null

    // Inline Text with all bitmask styles
    if (node.type === 'text') {
      let textContent: React.ReactNode = node.text || ''
      const format = typeof node.format === 'number' ? node.format : 0
      if (format & 1)
        textContent = (
          <strong key="b" className="font-semibold text-ink">
            {textContent}
          </strong>
        )
      if (format & 2)
        textContent = (
          <em key="i" className="italic">
            {textContent}
          </em>
        )
      if (format & 8)
        textContent = (
          <u key="u" className="underline underline-offset-2">
            {textContent}
          </u>
        )
      if (format & 4)
        textContent = (
          <s key="s" className="line-through">
            {textContent}
          </s>
        )
      if (format & 16)
        textContent = (
          <code
            key="c"
            className="rounded bg-paper px-1.5 py-0.5 text-xs font-mono text-emerald-900 border border-ink/10"
          >
            {textContent}
          </code>
        )
      if (format & 32)
        textContent = (
          <sub key="sub" className="text-xs">
            {textContent}
          </sub>
        )
      if (format & 64)
        textContent = (
          <sup key="sup" className="text-xs">
            {textContent}
          </sup>
        )
      return <span key={index}>{textContent}</span>
    }

    const children = Array.isArray(node.children)
      ? node.children.map((child, childIdx) => renderNode(child, childIdx))
      : null

    const alignClass = getAlignmentClass(node.format)
    const indentStyle =
      node.indent && node.indent > 0 ? { paddingLeft: `${node.indent * 1.5}rem` } : undefined

    switch (node.type) {
      case 'paragraph':
        return (
          <p
            key={index}
            style={indentStyle}
            className={`leading-relaxed text-ink/80 text-sm sm:text-base mb-3.5 last:mb-0 ${alignClass}`}
          >
            {children}
          </p>
        )

      case 'heading': {
        const tag = (node.tag || 'h3').toLowerCase()
        const headingStyles: Record<string, string> = {
          h1: 'font-serif text-2xl sm:text-3xl font-semibold text-ink mt-6 mb-3',
          h2: 'font-serif text-xl sm:text-2xl font-semibold text-ink mt-5 mb-2.5',
          h3: 'font-serif text-lg sm:text-xl font-semibold text-ink mt-4 mb-2',
          h4: 'font-serif text-base sm:text-lg font-semibold text-ink mt-3.5 mb-1.5',
          h5: 'font-serif text-sm sm:text-base font-semibold text-ink mt-3 mb-1',
          h6: 'font-serif text-xs sm:text-sm font-semibold uppercase tracking-wider text-ink/75 mt-3 mb-1',
        }
        const Tag = (
          ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag) ? tag : 'h3'
        ) as keyof React.JSX.IntrinsicElements
        return (
          <Tag
            key={index}
            style={indentStyle}
            className={`${headingStyles[tag] || headingStyles.h3} ${alignClass} first:mt-0`}
          >
            {children}
          </Tag>
        )
      }

      case 'list': {
        if (node.listType === 'check') {
          return (
            <ul
              key={index}
              style={indentStyle}
              className="my-3 space-y-2 text-ink/80 text-sm sm:text-base"
            >
              {children}
            </ul>
          )
        }
        const isOrdered = node.tag === 'ol' || node.listType === 'number'
        const ListTag = isOrdered ? 'ol' : 'ul'
        return (
          <ListTag
            key={index}
            style={indentStyle}
            className={`my-3 space-y-1.5 pl-5 text-ink/80 text-sm sm:text-base ${
              isOrdered ? 'list-decimal' : 'list-disc'
            } ${alignClass}`}
          >
            {children}
          </ListTag>
        )
      }

      case 'listitem': {
        if (node.checked !== undefined) {
          return (
            <li key={index} className="flex items-start gap-2.5 list-none leading-relaxed">
              <span
                className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  node.checked
                    ? 'bg-emerald-800 border-emerald-800 text-white'
                    : 'border-ink/30 bg-white'
                }`}
              >
                {node.checked && (
                  <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 12 12">
                    <path d="M10.28 2.28L3.989 8.575 1.72 6.305a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z" />
                  </svg>
                )}
              </span>
              <span className={node.checked ? 'line-through text-ink/50' : 'text-ink/80'}>
                {children}
              </span>
            </li>
          )
        }
        return (
          <li key={index} className="leading-relaxed">
            {children}
          </li>
        )
      }

      case 'quote':
        return (
          <blockquote
            key={index}
            style={indentStyle}
            className={`border-l border-ink/20 bg-paper/40 py-2.5 px-4 rounded-r-xl italic text-ink/85 my-4 ${alignClass}`}
          >
            {children}
          </blockquote>
        )

      case 'link':
      case 'autolink': {
        let href = node.fields?.url || node.url || '#'
        if (node.fields?.linkType === 'internal' && node.fields?.doc?.value?.slug) {
          href = `/${node.fields.doc.value.slug}`
        }
        const isNewTab = node.fields?.newTab ?? node.newTab
        return (
          <a
            key={index}
            href={href}
            target={isNewTab ? '_blank' : undefined}
            rel={isNewTab ? 'noopener noreferrer' : undefined}
            className="text-emerald-800 font-semibold underline underline-offset-2 hover:text-emerald-950 transition-colors"
          >
            {children}
          </a>
        )
      }

      case 'horizontalrule':
        return <hr key={index} className="my-6 border-ink/15" />

      case 'code':
        return (
          <pre
            key={index}
            className="my-4 overflow-x-auto rounded-xl bg-ink text-white p-4 font-mono text-xs leading-relaxed"
          >
            <code>{children}</code>
          </pre>
        )

      case 'upload': {
        const uploadVal = node.value as Media | null
        if (typeof uploadVal === 'object' && uploadVal?.url) {
          return (
            <div
              key={index}
              className="my-4 overflow-hidden rounded-2xl border border-ink/10 shadow-sm relative aspect-[16/10] w-full"
            >
              <Image
                src={uploadVal.url}
                alt={uploadVal.alt || 'Experience photo'}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 600px, 90vw"
              />
            </div>
          )
        }
        return null
      }

      default:
        return <div key={index}>{children}</div>
    }
  }

  return (
    <div className="space-y-3 prose-custom">{root.children.map((n, i) => renderNode(n, i))}</div>
  )
}

function getCardSnippet(content: unknown, maxSentences: number = 3): string {
  let plainText = ''
  if (typeof content === 'string') {
    plainText = content
  } else if (content && typeof content === 'object') {
    const textPieces: string[] = []
    const traverse = (node: LexicalNode | { root?: LexicalNode } | undefined) => {
      if (!node) return
      if ('text' in node && node.text) textPieces.push(node.text)
      if ('children' in node && Array.isArray(node.children)) node.children.forEach(traverse)
      if ('root' in node && node.root) traverse(node.root)
    }
    traverse(content as { root?: LexicalNode })
    plainText = textPieces.join(' ').replace(/\s+/g, ' ').trim()
  }

  if (!plainText) return ''

  const sentences = plainText.match(/[^.!?]+[.!?]+/g)
  if (sentences && sentences.length > 0) {
    return sentences.slice(0, maxSentences).join(' ').trim()
  }
  return plainText
}

function getExperienceImages(exp: ExperienceItem): string[] {
  const list: string[] = []
  if (exp.images && exp.images.length > 0) {
    for (const item of exp.images) {
      if (typeof item.image === 'object' && item.image) {
        const src = mediaSrc(item.image, 'desktop') ?? mediaSrc(item.image)
        if (src && !list.includes(src)) list.push(src)
      }
    }
  }
  if (list.length === 0 && exp.fallbackImages && exp.fallbackImages.length > 0) {
    for (const fb of exp.fallbackImages) {
      const u = typeof fb === 'string' ? fb : fb?.url
      if (u && !list.includes(u)) list.push(u)
    }
  }
  return list
}

function ExperienceImageSlider({
  images,
  title,
  onImageClick,
}: {
  images: string[]
  title: string
  onImageClick: (index: number) => void
}) {
  const [activeSlide, setActiveSlide] = useState(0)

  if (images.length === 0) return null

  if (images.length === 1) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation()
          onImageClick(0)
        }}
        className="group/img relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-ink/8 bg-paper cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={`Open photo viewer for ${title}`}
      >
        <Image
          src={images[0]}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
          className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover/img:opacity-100 pointer-events-none">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-transform duration-300 group-hover/img:scale-110">
            <IconZoomIn size={20} stroke={2} />
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="group/slider relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-ink/8 bg-paper select-none">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={500}
        autoplay={{
          delay: 3800,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={images.length > 1}
        allowTouchMove={true}
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        className="h-full w-full"
      >
        {images.map((src, i) => (
          <SwiperSlide
            key={src + i}
            onClick={(e) => {
              e.stopPropagation()
              onImageClick(i)
            }}
            className="relative h-full w-full cursor-pointer group/slide"
          >
            <Image
              src={src}
              alt={`${title} photo ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
              className="object-cover transition-transform duration-700 ease-out group-hover/slide:scale-105"
            />
            {/* Hover Zoom Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover/slide:opacity-100 pointer-events-none">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-transform duration-300 group-hover/slide:scale-110">
                <IconZoomIn size={20} stroke={2} />
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom Dot Indicators */}
      <div className="absolute bottom-2.5 inset-x-0 z-10 flex items-center justify-center gap-1.5 pointer-events-none">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === activeSlide ? 'w-4 bg-white shadow-xs' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export function DiscoverExperiences({ data }: { data?: DiscoverSectionData | null }) {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [lightboxState, setLightboxState] = useState<{
    items: LightboxItem[]
    activeIndex: number
  } | null>(null)

  // Animated Modal for expanded experience card (matching ReviewsSwiper modal)
  const [modalExperience, setModalExperience] = useState<ExperienceItem | null>(null)
  const [isModalRendered, setIsModalRendered] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const openExperienceModal = useCallback((exp: ExperienceItem) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setModalExperience(exp)
    setIsModalRendered(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsModalVisible(true)
      })
    })
  }, [])

  const closeExperienceModal = useCallback(() => {
    setIsModalVisible(false)
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = setTimeout(() => {
      setIsModalRendered(false)
      setModalExperience(null)
    }, 220)
  }, [])

  // Body scroll lock and ESC key listener for modal
  useEffect(() => {
    if (!isModalRendered) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeExperienceModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalRendered, closeExperienceModal])

  const allowStaticFallbacks = process.env.NEXT_PUBLIC_DISCOVER_STATIC_FALLBACKS === 'true'
  const experiences =
    data?.experiences && data.experiences.length > 0
      ? data.experiences
      : allowStaticFallbacks
        ? FALLBACK_EXPERIENCES
        : []
  const categories =
    data?.categories && data.categories.length > 0
      ? data.categories
      : allowStaticFallbacks
        ? FALLBACK_CATEGORIES
        : []
  const categoryTabs: DiscoverCategoryItem[] = [
    { slug: 'all', name: 'All Experiences' },
    ...categories,
  ]
  const destinations =
    data?.destinations && data.destinations.length > 0
      ? data.destinations
      : allowStaticFallbacks
        ? FALLBACK_DESTINATIONS
        : []

  const filteredExperiences =
    activeTab === 'all'
      ? experiences
      : experiences.filter((item) => getCategorySlug(item.category) === activeTab)

  const openLightboxForExperience = (exp: ExperienceItem, initialIndex: number = 0) => {
    const images = getExperienceImages(exp)
    if (images.length === 0) return
    const items: LightboxItem[] = images.map((src, idx) => ({
      id: `${exp.title}-${idx}`,
      src,
      thumbnailSrc: src,
      alt: `${exp.title} photo ${idx + 1}`,
      title: exp.title,
      category: getCategoryLabel(exp.category, categories).toUpperCase(),
    }))
    setLightboxState({
      items,
      activeIndex: initialIndex,
    })
  }

  return (
    <>
      <section className="mx-auto w-[91.5vw] max-w-[1440px] py-16 sm:py-20 lg:py-28 space-y-16 sm:space-y-24">
        {/* Category Tabs */}
        <div className="flex min-w-0 max-w-full flex-col items-center justify-center">
          <div className="no-scrollbar min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-full border border-black/[0.08] bg-black/[0.03] p-1.5">
            <div className="flex w-max min-w-full flex-nowrap items-center gap-1 sm:gap-1.5">
              {categoryTabs.map((cat) => {
                const isActive = activeTab === cat.slug
                return (
                  <button
                    key={cat.id || cat.slug}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      setActiveTab(cat.slug)
                      setLightboxState(null)
                    }}
                    className={`relative flex min-h-11 min-w-max flex-none items-center justify-center rounded-full px-3.5 py-2 text-center text-xs font-semibold uppercase tracking-[0.12rem] whitespace-nowrap transition-colors duration-200 cursor-pointer sm:flex-1 ${
                      isActive ? 'text-white' : 'text-ink/65 hover:text-ink hover:bg-black/[0.03]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeDiscoverTabPill"
                        className="absolute inset-0 rounded-full bg-ink shadow-xs"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 whitespace-nowrap">{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Experiences Grid */}
        {filteredExperiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredExperiences.map((exp, idx) => {
              const images = getExperienceImages(exp)
              const cardSnippet = getCardSnippet(exp.desc, 3)

              return (
                <motion.div
                  key={exp.title || idx}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  onClick={() => openExperienceModal(exp)}
                  className="group relative flex flex-col justify-between rounded-3xl border border-ink/10 bg-white/90 backdrop-blur-sm p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)] hover:border-ink/25 transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Top Badge & Timing Header */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper/60 px-3 py-1 font-semibold uppercase tracking-wider text-ink/75">
                        <IconMapPin size={13} className="text-ink/60" />
                        <span>{exp.tag || 'Near Villa'}</span>
                      </span>

                      {exp.badge && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          <IconSparkles size={11} />
                          <span>{exp.badge}</span>
                        </span>
                      )}
                    </div>

                    {/* Multi-image slider without navigation arrows */}
                    {images.length > 0 && (
                      <ExperienceImageSlider
                        images={images}
                        title={exp.title}
                        onImageClick={(photoIdx) => openLightboxForExperience(exp, photoIdx)}
                      />
                    )}

                    {/* Content - Title max in 2 lines & 3-sentence snippet */}
                    <div className="space-y-2 pt-1">
                      <h3 className="font-serif text-xl sm:text-2xl text-ink leading-snug line-clamp-2 min-h-[3.2rem] flex items-center group-hover:text-emerald-950 transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink/70 leading-relaxed line-clamp-3">
                        {cardSnippet}
                      </p>
                    </div>
                  </div>

                  {/* Footer Action Links */}
                  <div className="pt-5 mt-4 border-t border-ink/8 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 group-hover:text-emerald-950 group-hover:underline underline-offset-2 transition-colors">
                      <span>Explore full details</span>
                      <IconArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>

                    {exp.mapsUrl && (
                      <a
                        href={exp.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 rounded-full px-2.5 py-1 hover:bg-emerald-100 transition-colors"
                      >
                        <IconNavigation size={12} stroke={2.2} />
                        <span>Maps</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              )
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-ink/20 bg-paper/50 px-6 py-16 text-center">
            <p className="font-serif text-2xl text-ink">No Discover posts are published yet.</p>
            <p className="mt-2 text-sm text-ink/60">Add posts and categories in Payload CMS.</p>
          </div>
        )}

        {/* Destinations & Travel Times Matrix */}
        <Reveal className="rounded-3xl border border-ink/10 bg-white/90 backdrop-blur-sm p-7 sm:p-10 lg:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-8">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.16rem] text-ink/50">
              {data?.destinationsKicker || 'Regional Map & Travel Times'}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink">
              {data?.destinationsTitle || 'Everything within effortless driving distance.'}
            </h3>
            <p className="max-w-2xl text-xs sm:text-sm text-ink/65 leading-relaxed">
              {data?.destinationsLead ||
                'Located in Podine (Šibenik hinterland), Villa San Antonio provides complete sanctuary without isolation — scenic highways and coastal roads take you anywhere in minutes.'}
            </p>
          </div>

          {destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {destinations.map((dest, idx) => (
              <a
                key={dest.name || idx}
                href={dest.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(dest.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-2xl border border-ink/8 bg-paper/40 p-4.5 space-y-3 hover:border-ink/25 hover:bg-paper/70 hover:shadow-xs transition-all cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-ink/50">
                    <span>{dest.category || 'Destination'}</span>
                    <span className="rounded-md bg-white px-2 py-0.5 text-ink shadow-2xs font-bold">
                      {dest.driveTime}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-ink leading-tight pt-1 group-hover:text-ink/80 flex items-center justify-between gap-1">
                    <span>{dest.name}</span>
                    <IconArrowUpRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-ink/60"
                    />
                  </h4>
                  {dest.desc && (
                    <p className="text-xs text-ink/60 leading-relaxed pt-0.5">{dest.desc}</p>
                  )}
                </div>
                <div className="pt-2 border-t border-ink/6 flex items-center justify-between text-xs text-ink/50">
                  <span>Distance:</span>
                  <span className="font-semibold text-ink/85">{dest.distance}</span>
                </div>
              </a>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-ink/20 px-5 py-10 text-center text-sm text-ink/60">
              No drives and distances are published yet.
            </div>
          )}
        </Reveal>
      </section>

      {/* Expanded Experience Details Modal (matching Reviews modal design) */}
      {isModalRendered && modalExperience && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modalExperience.title}
          onClick={closeExperienceModal}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-200 ease-out ${
            isModalVisible
              ? 'bg-black/60 backdrop-blur-sm opacity-100'
              : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl border border-ink/10 bg-white p-6 sm:p-9 shadow-2xl space-y-6 will-change-transform transition-all duration-250 ease-out ${
              isModalVisible
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-[0.96] translate-y-3'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3 py-1 font-semibold uppercase tracking-wider text-ink/75">
                  <IconMapPin size={13} className="text-ink/60" />
                  <span>{modalExperience.tag || 'Near Villa'}</span>
                </span>
                {modalExperience.badge && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    <IconSparkles size={11} />
                    <span>{modalExperience.badge}</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={closeExperienceModal}
                aria-label="Close experience modal"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-ink transition-all duration-200 hover:scale-110 hover:bg-ink hover:text-white cursor-pointer"
              >
                <IconX size={18} stroke={2.2} />
              </button>
            </div>

            {/* Modal Title */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
                {getCategoryLabel(modalExperience.category, categories).toUpperCase()}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ink leading-tight">
                {modalExperience.title}
              </h3>
            </div>

            {/* Modal Image Slider */}
            {getExperienceImages(modalExperience).length > 0 && (
              <div className="rounded-2xl overflow-hidden shadow-xs border border-ink/8">
                <ExperienceImageSlider
                  images={getExperienceImages(modalExperience)}
                  title={modalExperience.title}
                  onImageClick={(photoIdx) => {
                    openLightboxForExperience(modalExperience, photoIdx)
                  }}
                />
              </div>
            )}

            {/* Modal Full Rich Text Content */}
            <div className="space-y-4 py-1 text-ink/80 text-sm sm:text-base">
              <RenderRichText content={modalExperience.desc} />
            </div>

            {/* Modal Footer Actions */}
            <div className="border-t border-ink/10 pt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {modalExperience.mapsUrl && (
                  <a
                    href={modalExperience.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 text-xs font-semibold tracking-wide shadow-xs transition-colors"
                  >
                    <IconNavigation size={14} stroke={2.2} />
                    <span>Get Directions on Maps</span>
                  </a>
                )}

                {modalExperience.externalLink && (
                  <a
                    href={modalExperience.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white hover:bg-paper text-ink px-4 py-2 text-xs font-semibold tracking-wide transition-colors"
                  >
                    <span>Official Visitor Guide</span>
                    <IconArrowUpRight size={14} stroke={2} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Fullscreen Lightbox Modal (Card-scoped only, without View full gallery) */}
      <LightboxModal
        isOpen={lightboxState !== null}
        activeIndex={lightboxState?.activeIndex ?? null}
        items={lightboxState?.items ?? []}
        onClose={() => setLightboxState(null)}
        onNavigate={(idx) =>
          setLightboxState((prev) => (prev ? { ...prev, activeIndex: idx } : null))
        }
        showViewAllGallery={false}
      />
    </>
  )
}
