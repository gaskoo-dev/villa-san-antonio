import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  IconBrandWhatsapp,
  IconCheck,
  IconClock,
  IconHeart,
  IconMail,
  IconPhone,
  IconShieldCheck,
  IconSparkles,
} from '@tabler/icons-react'

import { BookingForm } from '@/components/BookingForm'
import { PageIntro } from '@/components/PageIntro'
import { Reveal } from '@/components/Reveal'
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/content'
import { buildPageMetadata } from '@/lib/metadata'
import { getGallery, getPageBySlug, getSettings, mediaSrc } from '@/lib/queries'
import { getRequestLocale } from '@/lib/request-locale'
import type { Media, Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]
type HeroSubBlock = Extract<LayoutBlock, { blockType: 'hero-sub' }>
type BookingSectionBlockType = Extract<LayoutBlock, { blockType: 'bookingSection' }>

export const revalidate = 3600

const fallbackMetadata: Metadata = {
  title: 'Direct Booking & Availability | Villa San Antonio Šibenik',
  description:
    'Book Villa San Antonio directly with the owner for guaranteed best rates, 0% booking fees, and live availability. Heated pool, 3 bedrooms, private estate near Šibenik, Croatia.',
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  return buildPageMetadata(await getPageBySlug('booking', locale), fallbackMetadata, '/booking')
}

const DEFAULT_STEPS = [
  {
    num: '01',
    title: 'Select Your Dates',
    desc: 'Pick your preferred arrival and departure dates on the live calendar.',
  },
  {
    num: '02',
    title: 'Send Direct Inquiry',
    desc: 'No instant credit card charges and zero platform booking commissions.',
  },
  {
    num: '03',
    title: 'Confirm with Josip',
    desc: '30% deposit secures your reservation; pay the remaining balance on arrival.',
  },
]

const DEFAULT_PRIVILEGES = [
  {
    iconKey: 'shield',
    title: 'Guaranteed Best Rate',
    desc: 'Save 15–20% compared to third-party agency platforms.',
  },
  {
    iconKey: 'sparkles',
    title: 'Personal Welcome Gift',
    desc: 'Local Dalmatian wine, prosciutto & garden produce upon arrival.',
  },
  {
    iconKey: 'clock',
    title: 'Fast Direct Response',
    desc: 'Direct communication with Josip with typical replies in under 1 hour.',
  },
]

function getPrivilegeIcon(key?: string | null) {
  switch (key) {
    case 'sparkles':
      return IconSparkles
    case 'clock':
      return IconClock
    case 'heart':
      return IconHeart
    case 'check':
      return IconCheck
    case 'shield':
    default:
      return IconShieldCheck
  }
}

export default async function BookingPage() {
  const locale = await getRequestLocale()
  const [pageDoc, gallery, siteSettings] = await Promise.all([
    getPageBySlug('booking', locale),
    getGallery(200, locale),
    getSettings(),
  ])

  if (!pageDoc) notFound()
  const minNights = typeof siteSettings?.minNights === 'number' ? siteSettings.minNights : 3
  const fallbackHeroImg = gallery[1] ?? gallery[0]

  const heroSub = pageDoc?.layout?.find((b): b is HeroSubBlock => b.blockType === 'hero-sub')
  const heroMedia = typeof heroSub?.image === 'object' && heroSub?.image ? (heroSub.image as Media) : null

  const heroSrc = heroMedia
    ? (mediaSrc(heroMedia, 'desktop') ?? mediaSrc(heroMedia) ?? '')
    : (mediaSrc(fallbackHeroImg?.image, 'desktop') ?? mediaSrc(fallbackHeroImg?.image) ?? '')

  const bookingSection = pageDoc?.layout?.find(
    (b): b is BookingSectionBlockType => b.blockType === 'bookingSection'
  )

  const stepsTitle = bookingSection?.stepsTitle || 'How direct reservation works'
  const steps =
    bookingSection?.steps && bookingSection.steps.length > 0
      ? bookingSection.steps
      : DEFAULT_STEPS

  const privilegesTitle = bookingSection?.privilegesTitle || 'Direct booking privileges'
  const privileges =
    bookingSection?.privileges && bookingSection.privileges.length > 0
      ? bookingSection.privileges.map((p) => ({
          Icon: getPrivilegeIcon(p.icon),
          title: p.title,
          desc: p.desc,
        }))
      : DEFAULT_PRIVILEGES.map((p) => ({
          Icon: getPrivilegeIcon(p.iconKey),
          title: p.title,
          desc: p.desc,
        }))

  const hostMedia =
    typeof bookingSection?.hostImage === 'object' && bookingSection?.hostImage
      ? (bookingSection.hostImage as Media)
      : null
  const hostImgSrc = hostMedia ? (mediaSrc(hostMedia, 'thumbnail') ?? mediaSrc(hostMedia) ?? '') : ''

  const hostName = bookingSection?.hostName || 'Josip & Family'
  const hostSubtitle = bookingSection?.hostSubtitle || 'Estate Owners & Hosts'
  const badgeText = bookingSection?.badgeText || 'Fast Reply'
  const whatsappLabel = bookingSection?.whatsappLabel || 'WhatsApp Chat'
  const rawWhatsapp = bookingSection?.whatsappNumber || CONTACT_PHONE
  const rawPhone = bookingSection?.phone || CONTACT_PHONE
  const directEmail = bookingSection?.email || CONTACT_EMAIL

  const cleanPhone = rawWhatsapp.replace(/[^0-9+]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent('Hello Josip, I would like to inquire about Villa San Antonio availability.')}`

  return (
    <>
      {/* Full-Cover Cinematic Hero */}
      <PageIntro
        title={heroSub?.title || 'Hold your dates for'}
        accent={heroSub?.accent || 'this summer.'}
        lead={
          heroSub?.lead ||
          'Direct contact with the property owner. Best rates guaranteed, live calendar availability, and zero agency booking fees.'
        }
        breadcrumbs={[{ label: heroSub?.breadcrumbLabel || 'Booking' }]}
        image={{
          src: heroSrc,
          alt: heroMedia?.alt || fallbackHeroImg?.alt || fallbackHeroImg?.image?.alt || 'Villa San Antonio Booking',
        }}
      />

      <section className="mx-auto w-[91.5vw] max-w-[1440px] py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-10 lg:gap-16 items-stretch">
          {/* Left Column: Guarantees, Steps & Host Card */}
          <Reveal className="order-2 lg:order-1 h-full flex flex-col">
            <div className="rounded-3xl border border-ink/10 bg-white/90 backdrop-blur-sm p-6 sm:p-9 shadow-[0_8px_32px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between space-y-8">
              {/* 3-Step Process Timeline */}
              <div className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16rem] text-ink/65">
                  {stepsTitle}
                </h2>
                <div className="divide-y divide-ink/8 space-y-3.5">
                  {steps.map((step, idx) => (
                    <div
                      key={step.num || idx}
                      className={`flex items-start gap-4 ${idx > 0 ? 'pt-3.5' : ''}`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold tracking-wider text-white shadow-xs">
                        {step.num || `0${idx + 1}`}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-ink leading-tight">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-xs text-ink/65 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Booking Privileges */}
              <div className="space-y-4 border-t border-ink/8 pt-6">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16rem] text-ink/65">
                  {privilegesTitle}
                </h2>
                <div className="space-y-3.5">
                  {privileges.map((item, idx) => {
                    const Icon = item.Icon
                    return (
                      <div key={idx} className="flex items-start gap-3.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-800">
                          <Icon size={16} stroke={2} />
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-semibold text-ink leading-tight">
                            {item.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-ink/65 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Host Profile & Contact Card */}
              <div className="border-t border-ink/8 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {hostImgSrc ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-ink/10 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={hostImgSrc}
                          alt={hostMedia?.alt || hostName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white text-xs font-bold tracking-wider shadow-sm">
                        {hostName.split(' ').map((w) => w[0]).slice(0, 2).join('') || 'JP'}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-ink leading-tight">
                        {hostName}
                      </h4>
                      <p className="text-xs text-ink/65 leading-tight">{hostSubtitle}</p>
                    </div>
                  </div>

                  {badgeText && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                      <IconCheck size={12} stroke={2.5} />
                      <span>{badgeText}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-700 px-4 py-2 font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <IconBrandWhatsapp size={15} stroke={2} />
                    <span>{whatsappLabel}</span>
                  </a>

                  <a
                    href={`tel:${rawPhone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper/60 px-3.5 py-2 font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                  >
                    <IconPhone size={14} stroke={1.8} />
                    <span>{rawPhone}</span>
                  </a>

                  <a
                    href={`mailto:${directEmail}`}
                    className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper/60 px-3.5 py-2 font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                  >
                    <IconMail size={14} stroke={1.8} />
                    <span>{directEmail}</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Multi-Step Booking Form (Appears first on mobile) */}
          <Reveal delay={120} className="order-1 lg:order-2 h-full flex flex-col">
            <BookingForm minNights={minNights} />
          </Reveal>
        </div>
      </section>
    </>
  )
}
