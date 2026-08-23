'use client'

import Image from 'next/image'
import { IconArrowUpRight } from '@tabler/icons-react'

export type WeekMoment = {
  num: string
  time: string
  title: string
  body: string
  image: {
    src: string
    alt: string
  }
}

export function WeekUnfolds({ moments }: { moments: WeekMoment[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
      {moments.map((m) => (
        <article
          key={m.num}
          className="group relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-white/35 hover:shadow-2xl sm:min-h-[500px] sm:p-7 lg:min-h-[540px]"
        >
          {/* Background Image with Hover Zoom */}
          {m.image.src && (
            <Image
              src={m.image.src}
              alt={m.image.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-[var(--ease-reveal)] motion-safe:group-hover:scale-110"
            />
          )}

          {/* Cinematic Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/85 transition-opacity duration-300 group-hover:from-black/70 group-hover:to-black/90" />

          {/* Top Content: Number, Time & Main Title */}
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3">
              <span className="accent-serif text-3xl font-normal text-white/50 transition-colors duration-300 group-hover:text-white sm:text-4xl">
                {m.num}
              </span>
              <span className="rounded-full border border-white/20 bg-ink/75 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14rem] text-white/90 shadow-md backdrop-blur-md">
                {m.time}
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-medium leading-tight tracking-tight text-white transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl">
              {m.title}
            </h3>
          </div>

          {/* Bottom Content: Narrative & Interaction */}
          <div className="relative z-10 pt-6">
            <p className="text-sm leading-relaxed text-white/75 transition-colors duration-300 group-hover:text-white/90">
              {m.body}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15rem] text-white/55 transition-colors group-hover:text-white/80">
                Villa Moments
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-white group-hover:bg-white group-hover:text-ink">
                <IconArrowUpRight size={18} stroke={2} />
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
