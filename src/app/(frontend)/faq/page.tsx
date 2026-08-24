import {
  IconBrandWhatsapp,
  IconClock,
  IconMail,
  IconMapPin,
  IconPaw,
  IconPhone,
  IconPool,
  IconShieldCheck,
} from '@tabler/icons-react'
import Image from 'next/image'
import type { Metadata } from 'next'
import React from 'react'

import { BookingBand } from '@/components/BookingBand'
import { FaqInteractive } from '@/components/FaqInteractive'
import { PageIntro } from '@/components/PageIntro'
import { Reveal } from '@/components/Reveal'
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/content'
import { getFaqItems, getGallery, getPageBySlug, getSettings, mediaSrc } from '@/lib/queries'
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
  const [pageDoc, faqItems, gallery, settings] = await Promise.all([
    getPageBySlug('faq'),
    getFaqItems(),
    getGallery(),
    getSettings(),
  ])

  const heroSub = pageDoc?.layout?.find((b): b is HeroSubBlock => b.blockType === 'hero-sub')
  const bookingBlock = pageDoc?.layout?.find((b): b is BookingBandBlock => b.blockType === 'bookingBand')
  const heroMedia = typeof heroSub?.image === 'object' && heroSub?.image ? (heroSub.image as Media) : null
  const fallbackHeroImg = gallery[3] ?? gallery[0]

  const heroSrc = heroMedia
    ? (mediaSrc(heroMedia, 'desktop') ?? mediaSrc(heroMedia) ?? '')
    : (mediaSrc(fallbackHeroImg?.image, 'desktop') ?? mediaSrc(fallbackHeroImg?.image) ?? '')

  // Host contact info
  const hostPhone = settings?.contact?.phone || CONTACT_PHONE
  const hostEmail = settings?.contact?.email || CONTACT_EMAIL
  const cleanPhone = hostPhone.replace(/[^0-9+]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent('Hello Josip, I have a question regarding Villa San Antonio.')}`

  // Host avatar photo from media or gallery
  const hostAvatarMedia =
    (typeof bookingBlock?.hostAvatar === 'object' && bookingBlock?.hostAvatar ? (bookingBlock.hostAvatar as Media) : null) ||
    gallery.find((g) => g.image.filename?.includes('-078'))?.image ||
    gallery[0]?.image
  const hostAvatarSrc = mediaSrc(hostAvatarMedia, 'thumbnail') ?? mediaSrc(hostAvatarMedia)

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

      {/* 02 · Main FAQ & Concierge Help Section */}
      <section className="mx-auto w-[91.5vw] max-w-[1440px] py-16 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-16 items-start">
          {/* Left Column: Sticky Luxury Concierge Card */}
          <div className="lg:sticky lg:top-28 space-y-6">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-ink/12 bg-paper p-6 sm:p-8 shadow-sm">
                {/* Online Status Pill */}
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span>Host Concierge · Replies in ~30 min</span>
                </div>

                {/* Host Profile Bar */}
                <div className="mt-6 flex items-center gap-4">
                  {hostAvatarSrc ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-ink/15 shadow-xs bg-surface">
                      <Image
                        src={hostAvatarSrc}
                        alt="Josip - Villa San Antonio Host"
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-white font-bold tracking-wider shadow-xs">
                      JP
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-ink leading-snug">
                      {bookingBlock?.hostName || 'Josip & Family'}
                    </h3>
                    <p className="text-xs text-ink/60">
                      {bookingBlock?.hostRole || 'Estate Owners & Hosts'}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-ink/70">
                  Have specific arrival requirements, flexible date inquiries, or local recommendations? We answer every message personally.
                </p>

                {/* Quick Action Contact Buttons */}
                <div className="mt-6 space-y-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12rem] text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-98"
                  >
                    <IconBrandWhatsapp size={18} stroke={2} />
                    <span>WhatsApp Direct Chat</span>
                  </a>

                  <a
                    href={`mailto:${hostEmail}`}
                    className="flex w-full items-center justify-center gap-2.5 rounded-full border border-ink/15 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12rem] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                  >
                    <IconMail size={16} stroke={1.8} />
                    <span>Send Direct Email</span>
                  </a>

                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex w-full items-center justify-center gap-2.5 rounded-full border border-ink/15 bg-surface/60 px-6 py-3 text-xs font-medium tracking-wide text-ink/80 transition-colors hover:border-ink hover:text-ink"
                  >
                    <IconPhone size={15} stroke={1.8} />
                    <span>{hostPhone}</span>
                  </a>
                </div>

                {/* Location Micro Link */}
                <div className="mt-6 border-t border-ink/8 pt-5">
                  <a
                    href="https://maps.app.goo.gl/Xm8sAH7drKf2pADaA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-xs text-ink/60 hover:text-ink transition-colors"
                  >
                    <IconMapPin size={15} className="text-ink/40 group-hover:text-ink" />
                    <span>Podine 14, Šibenik (20 min to sea) ↗</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Interactive Search, Category Tabs & Card Accordion */}
          <div>
            <Reveal delay={80}>
              <FaqInteractive items={faqItems} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 · Direct Booking CTA Banner */}
      <BookingBand {...(bookingBlock || {})} />
    </>
  )
}
