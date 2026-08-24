import Image from 'next/image'

import { Breadcrumbs, type BreadcrumbItem } from '@/components/Breadcrumbs'
import { Reveal } from '@/components/Reveal'

type PageIntroProps = {
  kicker?: string
  title: string
  accent: string
  lead?: string
  image?: { src: string; alt: string }
  breadcrumbs?: BreadcrumbItem[]
}

/**
 * Full-Cover Cinematic Immersive Hero for subpages.
 * Clean unboxed breadcrumbs above headline with luxury typography and robust responsive layout.
 */
export function PageIntro({
  kicker,
  title,
  accent,
  lead,
  image,
  breadcrumbs,
}: PageIntroProps) {
  const activeBreadcrumbs: BreadcrumbItem[] = breadcrumbs ?? [{ label: kicker || title }]

  return (
    <section className="relative flex min-h-[75dvh] w-full flex-col justify-end overflow-hidden pb-10 pt-28 sm:min-h-[82dvh] sm:pb-16 sm:pt-36 lg:min-h-[88dvh] lg:pb-24 lg:pt-40">
      {/* Background Image Layer */}
      {image?.src ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={image.src}
            alt={image.alt || title}
            fill
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out"
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-[#121316]" />
      )}

      {/* Cinematic Vignettes & Gradients for Contrast & Legibility */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-36 sm:h-48 bg-gradient-to-b from-black/75 via-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-1 bg-gradient-to-t from-black/90 via-black/50 to-black/15" />
      <div className="pointer-events-none absolute inset-0 z-1 bg-radial-gradient from-transparent via-transparent to-black/30" />

      {/* Foreground Content */}
      <div className="container-page relative z-10 w-full text-white">
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          {/* Clean Unboxed Breadcrumb Navigation */}
          <Reveal y={12}>
            <Breadcrumbs
              items={activeBreadcrumbs}
              className="text-[11px] sm:text-xs font-medium tracking-wide text-white/75 [&_a]:text-white/75 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/40"
            />
          </Reveal>

          {/* Cinematic Headline with Descender Clearance */}
          <Reveal y={20} delay={40}>
            <h1 className="text-[clamp(1.85rem,5.5vw,4.5rem)] sm:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-[-0.035em] text-white leading-[1.12] sm:leading-[1.08] break-words">
              <span className="inline">{title} </span>
              <span className="accent-serif inline font-normal italic tracking-[-0.015em] text-white/95">
                {accent}
              </span>
            </h1>
          </Reveal>

          {/* Lead Subtitle */}
          {lead && (
            <Reveal y={16} delay={80}>
              <p className="max-w-2xl text-xs sm:text-sm md:text-base font-light leading-relaxed text-white/85 sm:leading-relaxed pt-0.5 sm:pt-1">
                {lead}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
