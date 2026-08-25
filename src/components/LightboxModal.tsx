'use client'

import {
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

export type LightboxItem = {
  id?: string | number | null
  src: string
  thumbnailSrc?: string
  alt?: string
  title?: string
  category?: string
}

export type LightboxModalProps = {
  isOpen: boolean
  activeIndex: number | null
  items: LightboxItem[]
  onClose: () => void
  onNavigate: (index: number) => void
  showViewAllGallery?: boolean
  viewAllGalleryHref?: string
  viewAllGalleryLabel?: string
}

export function LightboxModal({
  isOpen,
  activeIndex,
  items,
  onClose,
  onNavigate,
  showViewAllGallery = false,
  viewAllGalleryHref = '/gallery',
  viewAllGalleryLabel = 'View Full Gallery →',
}: LightboxModalProps) {
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const touchStartXRef = useRef<number | null>(null)

  const hasMultiple = items.length > 1
  const active = activeIndex !== null && activeIndex >= 0 && activeIndex < items.length ? activeIndex : null
  const current = active !== null ? items[active] : null

  const show = useCallback(
    (dir: 1 | -1) => {
      if (active === null || items.length <= 1) return
      const nextIndex = (active + dir + items.length) % items.length
      onNavigate(nextIndex)
    },
    [active, items.length, onNavigate],
  )

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isOpen || active === null) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
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
  }, [isOpen, active, onClose, show])

  // Scroll active thumbnail into view inside lightbox
  useEffect(() => {
    if (active === null || !thumbnailContainerRef.current) return
    const container = thumbnailContainerRef.current
    const activeThumb = container.children[active] as HTMLElement | undefined
    if (activeThumb) {
      const offset =
        activeThumb.offsetLeft -
        container.offsetWidth / 2 +
        activeThumb.offsetWidth / 2
      container.scrollTo({ left: offset, behavior: 'smooth' })
    }
  }, [active])

  return (
    <AnimatePresence>
      {isOpen && current && active !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 p-4 backdrop-blur-xl sm:p-6 select-none"
        >
          {/* Lightbox Top Bar */}
          <div
            className="flex items-center justify-between border-b border-white/10 pb-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col pr-4 overflow-hidden">
              {current.category && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.18rem] text-white/50 truncate">
                  {current.category}
                </span>
              )}
              <h3 className="font-serif text-lg sm:text-xl text-white/95 truncate max-w-md sm:max-w-xl">
                {current.title || current.alt || 'Villa San Antonio'}
              </h3>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {showViewAllGallery && (
                <Link
                  href={viewAllGalleryHref}
                  onClick={onClose}
                  className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium tracking-wide text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black cursor-pointer"
                >
                  {viewAllGalleryLabel}
                </Link>
              )}

              {hasMultiple && (
                <span className="text-xs font-medium uppercase tracking-[0.16rem] text-white/50 tabular-nums">
                  {active + 1} / {items.length}
                </span>
              )}

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close photo viewer (Esc)"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <IconX size={18} stroke={2.2} />
              </button>
            </div>
          </div>

          {/* Main Stage / Image Viewer */}
          <div
            className="relative flex flex-1 items-center justify-center py-4 touch-pan-y"
            onClick={onClose}
            onTouchStart={(e) => {
              touchStartXRef.current = e.touches[0].clientX
            }}
            onTouchEnd={(e) => {
              if (touchStartXRef.current === null) return
              const diff = touchStartXRef.current - e.changedTouches[0].clientX
              if (Math.abs(diff) > 40) {
                if (diff > 0) show(1)
                else show(-1)
              }
              touchStartXRef.current = null
            }}
          >
            <motion.figure
              key={current.id ?? active}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-full max-w-full overflow-hidden rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current.src}
                alt={current.alt || current.title || 'Villa San Antonio'}
                width={1920}
                height={1280}
                sizes="92vw"
                priority
                className="max-h-[72dvh] w-auto max-w-[92vw] object-contain shadow-2xl rounded-xl"
              />
            </motion.figure>

            {/* Prev / Next Navigation Arrows (Only if multiple images) */}
            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    show(-1)
                  }}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 sm:left-6 cursor-pointer"
                >
                  <IconChevronLeft size={22} stroke={2.2} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    show(1)
                  }}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 sm:right-6 cursor-pointer"
                >
                  <IconChevronRight size={22} stroke={2.2} />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnail Strip (Only if multiple images) */}
          {hasMultiple && (
            <div
              className="border-t border-white/10 pt-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                ref={thumbnailContainerRef}
                className="no-scrollbar flex items-center justify-start gap-2 overflow-x-auto py-1 sm:justify-center"
              >
                {items.map((thumb, idx) => {
                  const isCurrent = idx === active
                  return (
                    <button
                      key={thumb.id ?? idx}
                      type="button"
                      onClick={() => onNavigate(idx)}
                      aria-label={`Jump to photo ${idx + 1}`}
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'scale-110 ring-2 ring-white opacity-100'
                          : 'opacity-40 hover:opacity-80 hover:scale-105'
                      }`}
                    >
                      <Image
                        src={thumb.thumbnailSrc || thumb.src}
                        alt=""
                        width={60}
                        height={60}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
