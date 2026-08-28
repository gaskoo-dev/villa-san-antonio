'use client'

import { IconZoomIn } from '@tabler/icons-react'
import Image from 'next/image'
import { useMemo, useState } from 'react'

import { LightboxModal, type LightboxItem } from '@/components/LightboxModal'
import { gallerySrc, mediaAlt, type GalleryEntryLike } from '@/lib/media'

export function GalleryStrip({
  images,
  speed = 65,
}: {
  images: GalleryEntryLike[]
  speed?: number
}) {
  const [active, setActive] = useState<number | null>(null)

  const lightboxItems = useMemo<LightboxItem[]>(
    () =>
      images.map((img, idx) => ({
        id: img.id ?? idx,
        src: gallerySrc(img, 'desktop'),
        thumbnailSrc: gallerySrc(img, 'thumbnail'),
        alt: mediaAlt(img) || 'Villa San Antonio',
        title: img.caption || mediaAlt(img) || 'Villa San Antonio',
        category:
          (typeof img.category === 'object' && img.category?.name) ||
          undefined,
      })),
    [images],
  )

  if (images.length === 0) return null

  // Ensure minimum items for a dense, continuous infinite track
  const baseList = images.length < 8 ? [...images, ...images] : images
  // Duplicate for seamless 50% translation infinite marquee loop
  const marqueeList = [...baseList, ...baseList]

  return (
    <>
      <div className="group/strip relative w-full overflow-hidden py-2">
        <div
          style={{ animationDuration: `${speed || 65}s` }}
          className="flex w-max gap-4 sm:gap-5 animate-marquee group-hover/strip:[animation-play-state:paused]"
        >
          {marqueeList.map((entry, i) => {
            const originalIndex = i % images.length
            return (
              <button
                key={`${entry.id ?? 'gal'}-${i}`}
                type="button"
                onClick={() => setActive(originalIndex)}
                className="group relative block aspect-[4/5] w-[240px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-ink/10 bg-ink/5 text-left sm:w-[320px] lg:w-[380px]"
                aria-label={`View photo: ${mediaAlt(entry)}`}
              >
                {/* Base Image with Hover Zoom */}
                <Image
                  src={gallerySrc(entry)}
                  alt={mediaAlt(entry)}
                  width={760}
                  height={950}
                  quality={70}
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 320px, 240px"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-reveal)] motion-safe:group-hover:scale-105"
                />

                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-black/45 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100" />

                {/* Centered Zoom In Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <IconZoomIn size={40} stroke={1.5} className="text-white drop-shadow-md transition-transform duration-300 group-hover:scale-110" aria-hidden />
                </div>

                {/* Subtle bottom caption/hint */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14rem] text-white backdrop-blur-md">
                    Open Photo
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Cinematic Fullscreen Lightbox Modal */}
      <LightboxModal
        isOpen={active !== null}
        activeIndex={active}
        items={lightboxItems}
        onClose={() => setActive(null)}
        onNavigate={setActive}
        showViewAllGallery={true}
        viewAllGalleryHref="/gallery"
        viewAllGalleryLabel="View Full Gallery →"
      />
    </>
  )
}
