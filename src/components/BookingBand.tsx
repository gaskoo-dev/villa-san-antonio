'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  IconArrowRight,
  IconBrandWhatsapp,
  IconClock,
  IconMail,
  IconPaw,
  IconPhone,
  IconPool,
  IconReceiptTax,
  IconShieldCheck,
  IconSparkles,
  IconStar,
  IconUsers,
} from '@tabler/icons-react'
import React from 'react'

import { Reveal } from '@/components/Reveal'
import { useLocale } from '@/context/LocaleContext'
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/content'
import { mediaSrc } from '@/lib/media'
import type { Media } from '@/payload-types'

const ICON_MAP = {
  shield: IconShieldCheck,
  receipt: IconReceiptTax,
  sparkles: IconSparkles,
  clock: IconClock,
  paw: IconPaw,
  pool: IconPool,
  users: IconUsers,
  star: IconStar,
} as const

export type BookingBandProps = {
  title?: string | null
  accent?: string | null
  body?: string | null
  primaryCtaLabel?: string | null
  primaryCtaLink?: string | null
  whatsappLabel?: string | null
  whatsappNumber?: string | null
  hostName?: string | null
  hostRole?: string | null
  hostInitials?: string | null
  hostAvatar?: Media | number | string | null
  hostPhone?: string | null
  hostEmail?: string | null
  guarantees?: Array<{
    icon?: string | null
    title: string
    desc: string
    id?: string | null
  }> | null
}

export function BookingBand(props: BookingBandProps = {}) {
  const { t } = useLocale()

  const defaultGuarantees = [
    {
      icon: 'shield' as const,
      title: 'Guaranteed Best Rate',
      desc: 'Direct owner booking with 0% platform commission fees.',
    },
    {
      icon: 'receipt' as const,
      title: 'Transparent 30% Deposit',
      desc: 'Secure your dates now, pay the remaining balance on arrival.',
    },
    {
      icon: 'sparkles' as const,
      title: 'Signature Host Welcome',
      desc: 'Complimentary local wine, prosciutto and fresh garden produce.',
    },
    {
      icon: 'clock' as const,
      title: 'Direct Personal Care',
      desc: 'Personal check-in and dedicated host assistance during your stay.',
    },
  ]

  const guaranteesList =
    props.guarantees && props.guarantees.length > 0 ? props.guarantees : defaultGuarantees

  const phone = props.hostPhone || CONTACT_PHONE
  const email = props.hostEmail || CONTACT_EMAIL
  const cleanPhone = phone.replace(/[^0-9+]/g, '')
  const whatsappNum = (props.whatsappNumber || phone).replace(/[^0-9+]/g, '')
  const whatsappUrl = `https://wa.me/${whatsappNum.replace('+', '')}?text=${encodeURIComponent('Hello Josip, I would like to inquire about Villa San Antonio availability.')}`

  const title = props.title || t.booking.title || 'Hold your dates'
  const accent = props.accent || t.booking.accent || 'for this summer.'
  const body =
    props.body ||
    t.booking.body ||
    'Direct contact with the owner. Best rates guaranteed, personal check-in, and zero booking commission.'

  const avatarSrc =
    typeof props.hostAvatar === 'object' && props.hostAvatar
      ? (mediaSrc(props.hostAvatar as Media, 'thumbnail') ?? mediaSrc(props.hostAvatar as Media))
      : typeof props.hostAvatar === 'string'
        ? props.hostAvatar
        : null

  return (
    <section
      id="booking"
      className="relative scroll-mt-24 overflow-hidden border-t border-ink/10 bg-surface/60 px-6 py-20 text-ink lg:py-28"
    >
      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Editorial Headline & Narrative */}
          <Reveal className="space-y-6">
            <h2 className="heading-section text-ink text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight">
              {title} <span className="accent-serif font-normal text-ink">{accent}</span>
            </h2>

            <p className="max-w-xl text-base sm:text-lg leading-relaxed text-ink/70">{body}</p>

            {/* Direct Booking CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <Link
                href={props.primaryCtaLink || '/booking'}
                className="group flex sm:inline-flex items-center justify-center gap-3 rounded-full bg-ink px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.14rem] text-white shadow-lg transition-all duration-300 hover:bg-ink/85 hover:shadow-xl hover:scale-105 active:scale-95 text-center"
              >
                <span>{props.primaryCtaLabel || 'Check Availability & Book'}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink transition-transform duration-200 group-hover:translate-x-0.5 shrink-0">
                  <IconArrowRight size={15} stroke={2.5} />
                </span>
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex sm:inline-flex items-center justify-center gap-2 rounded-full border border-emerald-600 bg-emerald-600 px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.12rem] text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:scale-105 active:scale-95 text-center"
              >
                <IconBrandWhatsapp size={18} stroke={2} />
                <span>{props.whatsappLabel || 'WhatsApp Chat'}</span>
              </a>
            </div>
          </Reveal>

          {/* Right: 4 Direct Guarantee Bento Cards & Host Badge */}
          <Reveal delay={120} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guaranteesList.map((item, idx) => {
                const iconKey = (item.icon as keyof typeof ICON_MAP) || 'shield'
                const Icon = ICON_MAP[iconKey] || IconShieldCheck
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-paper p-5 transition-all duration-300 hover:border-ink/25 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-white shadow-sm">
                      <Icon size={19} stroke={1.8} />
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <h4 className="text-xs sm:text-sm font-semibold text-ink leading-tight">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 text-[11px] sm:text-xs text-ink/60 leading-relaxed text-pretty">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Host Quick Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-paper p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-3.5">
                {avatarSrc ? (
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-ink/15 shadow-xs bg-surface">
                    <Image
                      src={avatarSrc}
                      alt={props.hostName || 'Host profile photo'}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white text-xs font-bold tracking-wider shadow-sm">
                    {props.hostInitials || 'JP'}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-ink leading-tight">
                    {props.hostName || 'Josip & Family'}
                  </h4>
                  <p className="text-xs text-ink/50 leading-tight">
                    {props.hostRole || 'Estate Owners & Hosts'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-surface px-3 py-1.5 font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  <IconPhone size={13} stroke={1.8} />
                  <span>{phone}</span>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-surface px-3 py-1.5 font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  <IconMail size={13} stroke={1.8} />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
