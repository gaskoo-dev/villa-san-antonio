import type { Metadata } from 'next'
import {
  IconBrandWhatsapp,
  IconCheck,
  IconClock,
  IconHome,
  IconMail,
  IconPhone,
  IconShieldCheck,
  IconSparkles,
  IconUsers,
} from '@tabler/icons-react'

import { BookingForm } from '@/components/BookingForm'
import { PageIntro } from '@/components/PageIntro'
import { Reveal } from '@/components/Reveal'
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/content'
import { getGallery, getPageBySlug, mediaSrc } from '@/lib/queries'
import type { Media, Page } from '@/payload-types'

type LayoutBlock = NonNullable<Page['layout']>[number]
type HeroSubBlock = Extract<LayoutBlock, { blockType: 'hero-sub' }>

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Direct Booking & Availability | Villa San Antonio Šibenik',
  description:
    'Book Villa San Antonio directly with the owner for guaranteed best rates, 0% booking fees, and live availability. Heated pool, 3 bedrooms, private estate near Šibenik, Croatia.',
  alternates: {
    canonical: 'https://villa-sanantonio.com/booking',
  },
}

export default async function BookingPage() {
  const [pageDoc, gallery] = await Promise.all([getPageBySlug('booking'), getGallery()])
  const fallbackHeroImg = gallery[1] ?? gallery[0]

  const heroSub = pageDoc?.layout?.find((b): b is HeroSubBlock => b.blockType === 'hero-sub')
  const heroMedia = typeof heroSub?.image === 'object' && heroSub?.image ? (heroSub.image as Media) : null

  const heroSrc = heroMedia
    ? (mediaSrc(heroMedia, 'desktop') ?? mediaSrc(heroMedia) ?? '')
    : (mediaSrc(fallbackHeroImg?.image, 'desktop') ?? mediaSrc(fallbackHeroImg?.image) ?? '')

  const cleanPhone = CONTACT_PHONE.replace(/[^0-9+]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent('Hello Josip, I would like to inquire about Villa San Antonio availability.')}`

  const steps = [
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

  const privileges = [
    {
      icon: IconShieldCheck,
      title: 'Guaranteed Best Rate',
      desc: 'Save 15–20% compared to third-party agency platforms.',
    },
    {
      icon: IconSparkles,
      title: 'Personal Welcome Gift',
      desc: 'Local Dalmatian wine, prosciutto & garden produce upon arrival.',
    },
    {
      icon: IconClock,
      title: 'Fast Direct Response',
      desc: 'Direct communication with Josip with typical replies in under 1 hour.',
    },
  ]

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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-12 lg:gap-16 items-start">
          {/* Left Column: Guarantees, Steps & Host Card */}
          <Reveal className="space-y-8">
            {/* 3-Step Process Timeline */}
            <div className="space-y-4 rounded-3xl border border-ink/10 bg-surface/50 p-6 sm:p-7">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14rem] text-ink/50">
                How direct reservation works
              </h3>
              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.num}
                    className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-paper p-4 transition-all duration-200 hover:border-ink/20 hover:shadow-xs"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-ink text-xs font-bold tracking-wider text-white shadow-xs">
                      {step.num}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-ink leading-tight">
                        {step.title}
                      </h4>
                      <p className="mt-1 text-xs text-ink/60 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Booking Privileges */}
            <div className="space-y-3 rounded-3xl border border-ink/10 bg-surface/50 p-6 sm:p-7">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14rem] text-ink/50">
                Direct booking privileges
              </h3>
              <div className="space-y-3">
                {privileges.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                        <Icon size={16} stroke={2} />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-semibold text-ink leading-tight">
                          {item.title}
                        </h5>
                        <p className="mt-0.5 text-xs text-ink/60 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Host Profile & Contact Card */}
            <div className="rounded-3xl border border-ink/10 bg-surface/50 p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white text-xs font-bold tracking-wider shadow-sm">
                    JP
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-ink leading-tight">
                      Josip & Family
                    </h4>
                    <p className="text-xs text-ink/50 leading-tight">Estate Owners & Hosts</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                  <IconCheck size={12} stroke={2.5} />
                  <span>Fast Reply</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-ink/10 text-xs">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-600 bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:scale-105 active:scale-95"
                >
                  <IconBrandWhatsapp size={16} stroke={2} />
                  <span>WhatsApp Chat</span>
                </a>

                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-3.5 py-2 font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  <IconPhone size={15} stroke={1.8} />
                  <span>{CONTACT_PHONE}</span>
                </a>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-3.5 py-2 font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  <IconMail size={15} stroke={1.8} />
                  <span>{CONTACT_EMAIL}</span>
                </a>
              </div>
            </div>

            {/* Villa Key Highlights Pill */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink/70">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper px-3 py-1">
                <IconUsers size={14} className="text-ink/60" />
                <span>Up to 8 Guests</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper px-3 py-1">
                <IconHome size={14} className="text-ink/60" />
                <span>3 Bedrooms · 4 Baths</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper px-3 py-1">
                <IconSparkles size={14} className="text-ink/60" />
                <span>Heated Pool & Jacuzzi</span>
              </span>
            </div>
          </Reveal>

          {/* Right Column: Multi-Step Booking Form */}
          <Reveal delay={120}>
            <BookingForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
