'use client'

import {
  IconArrowUpRight,
  IconBrandWhatsapp,
  IconCompass,
  IconMapPin,
  IconSparkles,
} from '@tabler/icons-react'
import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { Reveal } from '@/components/Reveal'
import { mediaSrc } from '@/lib/media'
import type { Media } from '@/payload-types'

export type ExperienceItem = {
  title: string
  category: 'nature' | 'adventure' | 'gastro' | 'culture' | 'beaches'
  tag?: string | null
  badge?: string | null
  externalLink?: string | null
  desc: string
  image?: (number | null) | Media
  id?: string | null
}

export type DestinationItem = {
  name: string
  category?: string | null
  distance?: string | null
  driveTime?: string | null
  desc?: string | null
  id?: string | null
}

export type DiscoverSectionData = {
  kicker?: string | null
  title: string
  accent?: string | null
  lead?: string | null
  experiences?: ExperienceItem[] | null
  destinationsTitle?: string | null
  destinationsLead?: string | null
  destinations?: DestinationItem[] | null
  conciergeTitle?: string | null
  conciergeText?: string | null
  conciergeButtonLabel?: string | null
  conciergePhone?: string | null
}

const CATEGORIES = [
  { id: 'all', label: 'All Experiences' },
  { id: 'nature', label: 'Nature & Parks' },
  { id: 'adventure', label: 'Adventures & Sea' },
  { id: 'gastro', label: 'Wine & Gastro' },
  { id: 'culture', label: 'Culture & UNESCO' },
  { id: 'beaches', label: 'Beaches' },
] as const

const FALLBACK_EXPERIENCES: ExperienceItem[] = [
  {
    title: 'Krka National Park & Waterfalls',
    category: 'nature',
    tag: '18 min drive · 18 km',
    badge: 'Must Visit',
    externalLink: 'https://www.npkrka.hr/en_US/',
    desc: 'Seven magnificent travertine waterfalls, Skradinski Buk, crystal clear lakes, and boat rides through the canyon. One of Croatia\u2019s greatest natural wonders.',
  },
  {
    title: 'Čikola Canyon Zipline & Hiking',
    category: 'adventure',
    tag: '22 min drive · 25 km',
    badge: 'Adrenaline',
    desc: 'Fly across the 1.4 km zipline over the breathtaking Čikola River canyon, climb the via ferrata, or hike the dramatic limestone cliffs.',
  },
  {
    title: 'Babić Wine Tastings & Primošten Vineyards',
    category: 'gastro',
    tag: '15 min drive · 16 km',
    badge: 'Local Taste',
    desc: 'Sample the world-renowned Dalmatian Babić red wine among the stone-walled Bucavac vineyards, recognized on the UNESCO tentative list.',
  },
  {
    title: 'St. Nicholas Island Fortress',
    category: 'culture',
    tag: '15 min drive · 14 km',
    badge: 'UNESCO Heritage',
    externalLink: 'https://www.kanal-svetog-ante.com/en',
    desc: 'A unique 16th-century Venetian sea fortress built on an islet at the entrance to St. Anthony\u2019s Channel, inscribed as a UNESCO World Heritage Site.',
  },
  {
    title: 'Kornati Archipelago Private Boat Charter',
    category: 'adventure',
    tag: 'Marina 12 min · Day Trip',
    badge: 'Island Escape',
    externalLink: 'https://www.kornati.hr/en/',
    desc: 'Cruise through a nautical maze of 89 uninhabited islands and islets, swim in secluded turquoise bays, and dine at secluded fisherman konobas.',
  },
  {
    title: 'Šibenik Medieval Old Town & St. James',
    category: 'culture',
    tag: '12 min drive · 12 km',
    badge: 'UNESCO Cathedral',
    externalLink: 'https://www.sibenik-tourism.hr/en/',
    desc: 'Stroll cobblestone alleys, climb to St. Michael\u2019s and Barone Fortresses with sunset views, and visit the monumental St. James Cathedral.',
  },
  {
    title: 'Primošten Sandy & Pebble Beaches',
    category: 'beaches',
    tag: '20 min drive · 22 km',
    badge: 'Crystal Waters',
    desc: 'Pristine pine-fringed beaches at Raduča Peninsula, scenic coastal promenades, and beachside restaurants with fresh grilled fish.',
  },
  {
    title: 'Šibenik Bridge Bungee Jumping',
    category: 'adventure',
    tag: '16 min drive · 15 km',
    badge: 'Adrenaline',
    desc: 'Experience the thrill of a 40-meter jump above the sea directly from the iconic Šibenik Bridge with spectacular views of the Krka river canyon.',
  },
]

const FALLBACK_DESTINATIONS: DestinationItem[] = [
  {
    name: 'Šibenik Old Town & St. James Cathedral',
    category: 'Historic Center · UNESCO',
    distance: '12 km',
    driveTime: '12 min',
    desc: 'Four medieval fortresses, Michelin-star dining & sea promenade.',
  },
  {
    name: 'Krka National Park (Skradinski Buk & Skradin)',
    category: 'National Park',
    distance: '18 km',
    driveTime: '18 min',
    desc: 'Cascading waterfalls, riverboat departures & nature trails.',
  },
  {
    name: 'St. Nicholas Island Fortress (UNESCO)',
    category: 'UNESCO Maritime Landmark',
    distance: '14 km',
    driveTime: '15 min',
    desc: 'Venetian coastal defense fort at the St. Anthony Channel entrance.',
  },
  {
    name: 'Primošten Old Town & Raduča Beach',
    category: 'Coastal Town & Beaches',
    distance: '22 km',
    driveTime: '20 min',
    desc: 'Peninsula beaches, stone alleys & iconic Bucavac vineyards.',
  },
  {
    name: 'Čikola River Canyon & Zipline',
    category: 'Outdoor & Adventure',
    distance: '25 km',
    driveTime: '22 min',
    desc: '1.4 km aerial zipline, via ferrata climbing & scenic viewpoints.',
  },
  {
    name: 'Kornati National Park (Boat Departure)',
    category: 'Island Excursions',
    distance: '12 km',
    driveTime: '15 min',
    desc: 'Departure points for private skippered tours to the archipelago.',
  },
  {
    name: 'Split International Airport (SPU)',
    category: 'Airport Transfer',
    distance: '48 km',
    driveTime: '40 min',
    desc: 'Easy highway & coastal route directly to the villa gates.',
  },
  {
    name: 'Zadar International Airport (ZAD)',
    category: 'Airport Transfer',
    distance: '75 km',
    driveTime: '50 min',
    desc: 'Smooth A1 highway connection directly to Šibenik exit.',
  },
]

export function DiscoverExperiences({ data }: { data?: DiscoverSectionData | null }) {
  const [activeTab, setActiveTab] = useState<string>('all')

  const experiences = data?.experiences && data.experiences.length > 0 ? data.experiences : FALLBACK_EXPERIENCES
  const destinations = data?.destinations && data.destinations.length > 0 ? data.destinations : FALLBACK_DESTINATIONS

  const filteredExperiences =
    activeTab === 'all'
      ? experiences
      : experiences.filter((item) => item.category === activeTab)

  const conciergeTitle = data?.conciergeTitle || 'Personal Host Recommendations & Concierge'
  const conciergeText =
    data?.conciergeText ||
    'Josip and the family can personally arrange private boat excursions to Kornati, authentic peka dinners, winery visits, or provide insider cycling and hiking routes starting right from the villa.'
  const conciergeButtonLabel = data?.conciergeButtonLabel || 'Ask Josip on WhatsApp'
  const conciergePhone = data?.conciergePhone || '+385 91 602 1899'
  const cleanPhone = conciergePhone.replace(/[^0-9+]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent('Hello Josip, I would like to ask about local experiences and recommendations around Villa San Antonio.')}`

  return (
    <section className="mx-auto w-[91.5vw] max-w-[1440px] py-16 sm:py-20 lg:py-28 space-y-16 sm:space-y-24">
      {/* Category Tabs */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-ink/10 bg-white/80 backdrop-blur-sm p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`relative rounded-full px-4.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
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
                <span className="relative z-10">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredExperiences.map((exp, idx) => {
            const media = typeof exp.image === 'object' && exp.image ? (exp.image as Media) : null
            const imgSrc = media ? (mediaSrc(media, 'desktop') ?? mediaSrc(media) ?? '') : ''

            return (
              <motion.div
                key={exp.title || idx}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-ink/10 bg-white/90 backdrop-blur-sm p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)] hover:border-ink/25 transition-all duration-300"
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

                  {/* Optional Image */}
                  {imgSrc && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-ink/8 bg-paper">
                      <Image
                        src={imgSrc}
                        alt={media?.alt || exp.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="space-y-2 pt-1">
                    <h3 className="font-serif text-xl sm:text-2xl text-ink leading-tight group-hover:text-ink/90">
                      {exp.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink/70 leading-relaxed">
                      {exp.desc}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                {exp.externalLink ? (
                  <div className="pt-5 mt-4 border-t border-ink/8">
                    <a
                      href={exp.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/75 transition-colors hover:text-ink"
                    >
                      <span>Official Park & Visitor Guide</span>
                      <IconArrowUpRight size={14} stroke={2} />
                    </a>
                  </div>
                ) : (
                  <div className="pt-5 mt-4 border-t border-ink/8">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink/50">
                      <IconCompass size={14} stroke={1.8} />
                      <span>Recommended day trip</span>
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Destinations & Travel Times Matrix */}
      <Reveal className="rounded-3xl border border-ink/10 bg-white/90 backdrop-blur-sm p-7 sm:p-10 lg:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.16rem] text-ink/50">
            Regional Map & Travel Times
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-ink">
            {data?.destinationsTitle || 'Everything within effortless driving distance.'}
          </h3>
          <p className="max-w-2xl text-xs sm:text-sm text-ink/65 leading-relaxed">
            {data?.destinationsLead ||
              'Located in Podine (Šibenik hinterland), Villa San Antonio provides complete sanctuary without isolation — scenic highways and coastal roads take you anywhere in minutes.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {destinations.map((dest, idx) => (
            <div
              key={dest.name || idx}
              className="flex flex-col justify-between rounded-2xl border border-ink/8 bg-paper/40 p-4.5 space-y-3 hover:border-ink/20 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-ink/50">
                  <span>{dest.category || 'Destination'}</span>
                  <span className="rounded-md bg-white px-2 py-0.5 text-ink shadow-2xs font-bold">
                    {dest.driveTime}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-ink leading-tight pt-1">
                  {dest.name}
                </h4>
                {dest.desc && (
                  <p className="text-xs text-ink/60 leading-relaxed pt-0.5">
                    {dest.desc}
                  </p>
                )}
              </div>
              <div className="pt-2 border-t border-ink/6 flex items-center justify-between text-xs text-ink/50">
                <span>Distance:</span>
                <span className="font-medium text-ink/80">{dest.distance}</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Josip's Insider Concierge Banner */}
      <Reveal className="relative rounded-3xl border border-emerald-900/15 bg-gradient-to-br from-emerald-950 via-stone-900 to-ink p-8 sm:p-12 lg:p-14 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-900/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <IconSparkles size={14} />
              <span>Personal Local Concierge</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight">
              {conciergeTitle}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-white/75">
              {conciergeText}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 px-8 py-4 text-xs font-bold uppercase tracking-[0.14rem] shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <IconBrandWhatsapp size={18} stroke={2.2} />
              <span>{conciergeButtonLabel}</span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
