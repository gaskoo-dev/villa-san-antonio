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
 * Clean unboxed breadcrumbs above headline with zero duplicate kicker badges.
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
    <section className="relative flex min-h-[52vh] w-full flex-col justify-end overflow-hidden pb-12 pt-28 sm:min-h-[64vh] sm:pb-16 sm:pt-32 lg:min-h-[76vh] lg:pb-22 lg:pt-36">
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

      {/* Cinematic Vignettes & Gradients for Perfect Contrast */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-1 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
      <div className="pointer-events-none absolute inset-0 z-1 bg-radial-gradient from-transparent via-transparent to-black/30" />

      {/* Foreground Content */}
      <div className="container-page relative z-10 w-full space-y-3 sm:space-y-4 text-white">
        {/* Clean Unboxed Breadcrumb Navigation */}
        <Reveal y={15}>
          <Breadcrumbs
            items={activeBreadcrumbs}
            className="text-xs text-white/75 [&_a]:text-white/75 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/40"
          />
        </Reveal>

        {/* Huge Cinematic Headline */}
        <Reveal y={24} delay={40}>
          <h1 className="max-w-4xl text-[clamp(2.2rem,6.5vw,5.5rem)] font-medium tracking-tight text-white leading-[1.04]">
            {title} <span className="accent-serif font-normal text-white">{accent}</span>
          </h1>
        </Reveal>

        {/* Lead Subtitle */}
        {lead && (
          <Reveal y={20} delay={100}>
            <p className="max-w-2xl text-sm font-light leading-relaxed text-white/85 sm:text-base lg:text-lg">
              {lead}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
