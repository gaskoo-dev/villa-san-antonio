'use client'

import { IconArrowRight, IconBrandFacebook, IconBrandInstagram, IconMapPin } from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { ScrollToExplore } from '@/components/ScrollToExplore'
import { ShaderHero, type ShaderSlide } from '@/components/ShaderHero'
import { useLocale } from '@/context/LocaleContext'

export type HeroContentItem = {
  kicker: string
  title: string
  accent: string
  subtext: string
}

export const HERO_SLIDES_CONTENT: HeroContentItem[] = [
  {
    kicker: 'VILLA SAN ANTONIO',
    title: 'Your Private Oasis',
    accent: 'near Šibenik.',
    subtext: 'A fully private villa for eight near Šibenik, with a heated pool, BBQ house and a fenced garden made for slow days.',
  },
  {
    kicker: 'A private villa for families & friends',
    title: 'Space to Be',
    accent: 'Together.',
    subtext: 'Complete privacy, three quiet bedrooms, and expansive indoor and outdoor living areas built for gathering.',
  },
  {
    kicker: 'Surrounded by greenery with open views and pure peace',
    title: 'Quiet Luxury',
    accent: 'in Dalmatia.',
    subtext: 'Nestled in the tranquil Dalmatian hinterland, just minutes away from pristine beaches and Krka National Park.',
  },
  {
    kicker: 'Pool days. Sunset nights. Zero stress',
    title: 'Your Summer',
    accent: 'Headquarters.',
    subtext: 'Heated pool with waterfall, sun loungers, outdoor fireplace, and stargazing under the clear Mediterranean sky.',
  },
]

export type HeroSectionProps = {
  images: ShaderSlide[]
  slidesContent?: HeroContentItem[]
  primaryCta?: { label?: string | null; url?: string | null } | null
  secondaryCta?: { label?: string | null; url?: string | null } | null
  transitionDuration?: number | null
  interval?: number | null
}

export function HeroSection({
  images,
  slidesContent,
  primaryCta,
  secondaryCta,
  transitionDuration = 2000,
  interval = 6500,
}: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { t } = useLocale()

  const items = slidesContent && slidesContent.length > 0 ? slidesContent : t.hero.slides
  const current = items[activeIndex % items.length]

  const animDuration = (transitionDuration ?? 2000) / 1000

  const ctaPrimary = {
    label: primaryCta?.label?.trim() || t.nav.checkAvailability,
    url: primaryCta?.url?.trim() || '#booking',
  }
  const ctaSecondary = {
    label: secondaryCta?.label?.trim() || t.nav.exploreVilla,
    url: secondaryCta?.url?.trim() || '/about-villa',
  }

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      <ShaderHero
        images={images}
        duration={transitionDuration ?? 2000}
        interval={interval ?? 6500}
        onSlideChange={(index) => setActiveIndex(index)}
      />
      <div className="absolute inset-0 z-10 bg-black/50" />

      <div className="container-page relative z-20 flex flex-col items-center pb-24 pt-36 text-center lg:pb-28 lg:pt-40">
        <div className="grid w-full grid-cols-1 grid-rows-1 place-items-center min-h-[260px] sm:min-h-[290px]">
          <AnimatePresence initial={false}>
            <motion.div
              key={activeIndex}
              style={{ gridArea: '1 / 1 / 2 / 2' }}
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -22, filter: 'blur(6px)' }}
              transition={{ duration: animDuration, ease: [0.22, 1, 0.36, 1] }}
              className="flex w-full flex-col items-center text-center"
            >
              <p className="mb-4 sm:mb-6 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2rem] text-white/80">
                {current.kicker}
              </p>
              <h1 className="max-w-[92vw] text-center text-[clamp(2.35rem,6.8vw,7.2rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-white break-words sm:break-normal">
                <span className="block">{current.title}</span>
                <span className="accent-serif mt-1 block font-normal italic tracking-[-0.02em] text-white sm:mt-2.5">
                  {current.accent}
                </span>
              </h1>
              <p className="mt-6 sm:mt-8 max-w-lg text-center text-sm leading-relaxed text-white/85 sm:text-[15px]">
                {current.subtext}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-7 w-full sm:w-auto px-4 sm:px-0">
          <Link
            href={ctaPrimary.url}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-4 rounded-full bg-white py-3 sm:py-2 pl-6 pr-2.5 text-xs font-semibold uppercase tracking-wider text-ink shadow-lg transition-transform duration-300 ease-[var(--ease-reveal)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{ctaPrimary.label}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white">
              <IconArrowRight size={18} stroke={2} aria-hidden />
            </span>
          </Link>
          <Link
            href={ctaSecondary.url}
            className="text-xs font-semibold uppercase tracking-[0.15rem] text-white/85 underline decoration-white/40 underline-offset-[6px] transition-colors hover:text-white hover:decoration-white py-2"
          >
            {ctaSecondary.label}
          </Link>
        </div>
      </div>

      {/* Bottom editorial metadata bar */}
      <div className="container-page absolute inset-x-0 bottom-6 z-30 flex items-center justify-between text-xs font-medium uppercase tracking-[0.16rem] text-white/75 lg:bottom-8">
        <div className="hidden items-center gap-2 md:flex">
          <IconMapPin size={18} stroke={1.8} className="text-white/85 shrink-0" aria-hidden />
          <span>{t.hero.meta.coords}</span>
        </div>
        <ScrollToExplore targetId="perspective" label={t.hero.meta.scroll} />
        <div className="hidden md:flex items-center gap-5 text-xs font-medium tracking-[0.14rem]">
          <a
            href="https://www.instagram.com/villa_sanantonio/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            <IconBrandInstagram size={18} stroke={1.8} />
            <span>Instagram</span>
          </a>
          <span className="opacity-30">·</span>
          <a
            href="https://web.facebook.com/villasanantoniopodine/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            <IconBrandFacebook size={18} stroke={1.8} />
            <span>Facebook</span>
          </a>
        </div>
      </div>
    </section>
  )
}
