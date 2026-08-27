'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { IconMapPin, IconSparkles } from '@tabler/icons-react'

export type Metric = {
  label: string
  value: number
  suffix?: string
  detail?: string
}

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (!inView || reduce) return
    const duration = 1200
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 4)
      setDisplay(Math.round(eased * value))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, value])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix ? <span className="ml-1 text-2xl font-normal text-ink/60 sm:text-3xl">{suffix}</span> : null}
    </span>
  )
}

const DEFAULT_DETAILS: Record<string, string> = {
  'Guests max': 'Up to 8 guests in total privacy',
  'Guests capacity': 'Up to 8 guests in total privacy',
  'Bedrooms': '3 quiet, air-conditioned rooms',
  'Heated pool': '36 m² with waterfall feature',
  'Plot area': '800 m² fully fenced garden',
  'Fenced plot': '800 m² fully fenced garden',
  'Bathrooms': '4 modern walk-in bathrooms',
}

/**
 * Editorial luxury perspective & metrics showcase
 */
export function StatsBand({
  metrics,
  leftImage,
  rightImage,
  leftBadge = 'Heated pool & private terrace',
  rightBadge = 'Complete comfort & privacy',
}: {
  metrics: Metric[]
  leftImage?: { src: string; alt: string } | null
  rightImage?: { src: string; alt: string } | null
  leftBadge?: string | null
  rightBadge?: string | null
}) {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Visual Photography Composition */}
      {(leftImage || rightImage) && (
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-12">
          {leftImage && (
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl lg:col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/5">
                <Image
                  src={leftImage.src}
                  alt={leftImage.alt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-reveal)] motion-safe:group-hover:scale-105"
                />
              </div>
              {leftBadge && (
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-ink/75 px-4 py-2 text-xs font-medium uppercase tracking-[0.14rem] text-white shadow-lg backdrop-blur-md sm:bottom-6 sm:left-6">
                  <IconMapPin size={18} stroke={1.8} className="text-white/80" />
                  <span>{leftBadge}</span>
                </div>
              )}
            </div>
          )}

          {rightImage && (
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl lg:col-span-5">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/5 lg:aspect-auto lg:h-full">
                <Image
                  src={rightImage.src}
                  alt={rightImage.alt}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-reveal)] motion-safe:group-hover:scale-105"
                />
              </div>
              {rightBadge && (
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.14rem] text-ink shadow-lg backdrop-blur-md sm:bottom-6 sm:left-6">
                  <IconSparkles size={18} stroke={1.8} className="text-ink/70" />
                  <span>{rightBadge}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4-Tile Luxury Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {metrics.map((m) => {
          const detail = m.detail || DEFAULT_DETAILS[m.label] || 'Villa San Antonio'
          return (
            <div
              key={m.label}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 bg-surface/90 p-4 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ink/25 hover:bg-surface"
            >
              <div>
                <strong className="block text-3xl sm:text-4xl lg:text-5xl font-medium leading-none tracking-[-0.04em] text-ink">
                  <Counter value={m.value} suffix={m.suffix} />
                </strong>
                <span className="mt-3 sm:mt-4 block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.13rem] sm:tracking-[0.15rem] text-ink/75">
                  {m.label}
                </span>
              </div>
              <p className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs leading-relaxed text-ink/70">
                {detail}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
