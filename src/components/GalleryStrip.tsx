'use client'

import { IconChevronLeft, IconChevronRight, IconX, IconZoomIn } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { gallerySrc, mediaAlt, type GalleryEntryLike } from '@/lib/media'

export function GalleryStrip({
  images,
  speed = 65,
}: {
  images: GalleryEntryLike[]
  speed?: number
}) {
  const [active, setActive] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setActive(null), [])
  const show = useCallback(
    (dir: 1 | -1) =>
      setActive((i) => (i === null ? null : (i + dir + images.length) % images.length)),
    [images.length],
  )

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') show(1)
      if (e.key === 'ArrowLeft') show(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, close, show])

  if (images.length === 0) return null

  // Ensure minimum items for a dense, continuous infinite track
  const baseList = images.length < 8 ? [...images, ...images] : images
  // Duplicate for seamless 50% translation infinite marquee loop
  const marqueeList = [...baseList, ...baseList]

  const current = active !== null ? images[active] : null

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

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
          >
            <motion.figure
              key={current.id ?? active}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={gallerySrc(current)}
                alt={mediaAlt(current)}
                width={1600}
                height={1600}
                sizes="90vw"
                className="max-h-[82dvh] w-auto rounded-xl object-contain shadow-2xl"
                priority
              />
            </motion.figure>

            {/* Close Button */}
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close photo viewer"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110"
            >
              <IconX size={18} stroke={2.2} />
            </button>

            {/* Previous Photo Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                show(-1)
              }}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110 sm:left-8"
            >
              <IconChevronLeft size={18} stroke={2.2} />
            </button>

            {/* Next Photo Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                show(1)
              }}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110 sm:right-8"
            >
              <IconChevronRight size={18} stroke={2.2} />
            </button>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3">
              <span className="rounded-full bg-black/70 px-4 py-1.5 text-xs font-medium tracking-wider text-white/80 backdrop-blur-md">
                {(active ?? 0) + 1} / {images.length}
              </span>
              <Link
                href="/gallery"
                onClick={close}
                className="hidden rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium tracking-wide text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black sm:inline-block"
              >
                View Full Gallery →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
