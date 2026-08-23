'use client'

import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { gallerySrc, mediaAlt, type GalleryEntryLike } from '@/lib/media'

export function GalleryGrid({ images }: { images: GalleryEntryLike[] }) {
  const [active, setActive] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setActive(null), [])
  const show = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? null : (i + dir + images.length) % images.length)),
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

  const current = active !== null ? images[active] : null

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {images.map((entry, i) => {
          const featured = entry.featured
          return (
            <li key={entry.id ?? i} className={featured ? 'col-span-2 row-span-2' : ''}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className="group relative block h-full w-full overflow-hidden"
                aria-label={`Open photo: ${mediaAlt(entry)}`}
              >
                <Image
                  src={gallerySrc(entry)}
                  alt={mediaAlt(entry)}
                  width={featured ? 1200 : 600}
                  height={featured ? 1200 : 600}
                  sizes={featured ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
                  className="aspect-square w-full object-cover transition-transform duration-700 ease-[var(--ease-reveal)] motion-safe:group-hover:scale-[1.04]"
                />
              </button>
            </li>
          )
        })}
      </ul>

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
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
                className="max-h-[82dvh] w-auto object-contain"
              />
            </motion.figure>

            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close photo viewer"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110 sm:right-6 sm:top-6"
            >
              <IconX size={18} stroke={2.2} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                show(-1)
              }}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110 sm:left-6"
            >
              <IconChevronLeft size={18} stroke={2.2} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                show(1)
              }}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110 sm:right-6"
            >
              <IconChevronRight size={18} stroke={2.2} />
            </button>
            <p aria-live="polite" className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-[0.14rem] text-white/50">
              {active! + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
