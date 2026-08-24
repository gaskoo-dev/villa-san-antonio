'use client'

import {
  IconArrowsMaximize,
  IconChevronLeft,
  IconChevronRight,
  IconPhoto,
  IconX,
} from '@tabler/icons-react'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { gallerySrc, mediaAlt, type GalleryEntryLike } from '@/lib/media'
import type { GalleryCategory } from '@/payload-types'

function getCategorySlug(img: GalleryEntryLike): string | null {
  if (!img.category) return null
  if (typeof img.category === 'object' && 'slug' in img.category && img.category.slug) {
    return img.category.slug
  }
  return null
}

function getCategoryName(img: GalleryEntryLike): string | null {
  if (!img.category) return null
  if (typeof img.category === 'object' && 'name' in img.category && img.category.name) {
    return img.category.name
  }
  return null
}

export function GalleryGrid({
  images,
  categories = [],
}: {
  images: GalleryEntryLike[]
  categories?: GalleryCategory[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [active, setActive] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const touchStartXRef = useRef<number | null>(null)

  // Filter images according to active category tab
  const filteredImages = useMemo(() => {
    if (selectedCategory === 'all') return images
    return images.filter((img) => getCategorySlug(img) === selectedCategory)
  }, [images, selectedCategory])

  // Compute item counts for each category tab
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: images.length }
    for (const img of images) {
      const slug = getCategorySlug(img)
      if (slug) {
        counts[slug] = (counts[slug] || 0) + 1
      }
    }
    return counts
  }, [images])

  const close = useCallback(() => setActive(null), [])
  const show = useCallback(
    (dir: 1 | -1) =>
      setActive((i) =>
        i === null ? null : (i + dir + filteredImages.length) % filteredImages.length,
      ),
    [filteredImages.length],
  )

  // Keyboard navigation for lightbox
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

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug)
    setActive(null)
  }

  const current =
    active !== null && active < filteredImages.length
      ? filteredImages[active]
      : null
  const currentCategoryName = current ? getCategoryName(current) : null

  return (
    <div className="w-full">
      {/* Category Filter Tabs Bar */}
      <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
            Curated Spaces
          </p>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-ink">
            Explore the estate
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="no-scrollbar flex max-w-full flex-nowrap items-center gap-1.5 overflow-x-auto rounded-full border border-black/[0.08] bg-black/[0.03] p-1.5 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => handleSelectCategory('all')}
            className={`relative flex shrink-0 min-w-max items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12rem] whitespace-nowrap transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'text-white'
                : 'text-ink/60 hover:text-ink hover:bg-black/[0.04]'
            }`}
          >
            {selectedCategory === 'all' && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 rounded-full bg-ink shadow-md"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10 whitespace-nowrap">All</span>
            <span
              className={`relative z-10 text-[10px] tabular-nums shrink-0 ${
                selectedCategory === 'all' ? 'text-white/60' : 'text-ink/40'
              }`}
            >
              {categoryCounts.all ?? 0}
            </span>
          </button>

          {categories.map((cat) => {
            const count = categoryCounts[cat.slug] || 0
            if (count === 0) return null
            const isSelected = selectedCategory === cat.slug

            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleSelectCategory(cat.slug)}
                className={`relative flex shrink-0 min-w-max items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12rem] whitespace-nowrap transition-all duration-300 ${
                  isSelected
                    ? 'text-white'
                    : 'text-ink/60 hover:text-ink hover:bg-black/[0.04]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-full bg-ink shadow-md"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10 whitespace-nowrap">{cat.name}</span>
                <span
                  className={`relative z-10 text-[10px] tabular-nums shrink-0 ${
                    isSelected ? 'text-white/60' : 'text-ink/40'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid of Images */}
      {filteredImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-black/10 py-24 text-center">
          <IconPhoto size={40} stroke={1.5} className="text-ink/30" />
          <p className="mt-4 font-serif text-xl text-ink">No photos found in this category</p>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink underline hover:opacity-75"
          >
            View all photos
          </button>
        </div>
      ) : (
        <motion.ul
          layout={!reduce}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((entry, i) => {
              const featured = entry.featured && selectedCategory === 'all'
              const altText = mediaAlt(entry) || 'Villa San Antonio'
              const categoryName = getCategoryName(entry)

              return (
                <motion.li
                  key={entry.id ?? i}
                  layout={!reduce}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative overflow-hidden rounded-2xl bg-black/5 shadow-sm transition-all duration-300 hover:shadow-xl ${
                    featured ? 'col-span-2 row-span-2' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className="relative block h-full w-full overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                    aria-label={`Open photo: ${altText}`}
                  >
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image
                        src={gallerySrc(entry, featured ? 'desktop' : 'tablet')}
                        alt={altText}
                        width={featured ? 1200 : 600}
                        height={featured ? 1200 : 600}
                        sizes={
                          featured
                            ? '(min-width: 1024px) 50vw, 100vw'
                            : '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw'
                        }
                        className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-reveal)] motion-safe:group-hover:scale-105"
                      />
                    </div>

                    {/* Dark gradient overlay on hover */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Category badge at top-left */}
                    {categoryName && (
                      <div className="pointer-events-none absolute left-3 top-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14rem] text-white backdrop-blur-md">
                          {categoryName}
                        </span>
                      </div>
                    )}

                    {/* Description and zoom trigger at bottom */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
                      <p className="line-clamp-2 max-w-[80%] translate-y-2 text-xs font-medium leading-snug opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        {entry.caption || altText}
                      </p>
                      <span className="flex h-9 w-9 shrink-0 translate-y-2 items-center justify-center rounded-full bg-white text-ink shadow-lg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-105">
                        <IconArrowsMaximize size={16} stroke={2.2} />
                      </span>
                    </div>
                  </button>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </motion.ul>
      )}

      {/* Cinematic Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 p-4 backdrop-blur-xl sm:p-6"
          >
            {/* Lightbox Top Bar */}
            <div
              className="flex items-center justify-between border-b border-white/10 pb-4 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                {currentCategoryName && (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18rem] text-white/50">
                    {currentCategoryName}
                  </span>
                )}
                <h3 className="font-serif text-lg sm:text-xl text-white/95 truncate max-w-md sm:max-w-xl">
                  {current.caption || mediaAlt(current) || 'Villa San Antonio'}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-medium uppercase tracking-[0.16rem] text-white/50 tabular-nums">
                  {active! + 1} / {filteredImages.length}
                </span>

                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close photo viewer (Esc)"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <IconX size={18} stroke={2.2} />
                </button>
              </div>
            </div>

            {/* Main Stage / Image Viewer */}
            <div
              className="relative flex flex-1 items-center justify-center py-4 touch-pan-y"
              onClick={close}
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
                  src={gallerySrc(current, 'desktop')}
                  alt={mediaAlt(current) || 'Villa San Antonio'}
                  width={1920}
                  height={1280}
                  sizes="92vw"
                  priority
                  className="max-h-[72dvh] w-auto max-w-[92vw] object-contain shadow-2xl"
                />
              </motion.figure>

              {/* Prev / Next Navigation Arrows */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  show(-1)
                }}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 sm:left-6"
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
                className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 sm:right-6"
              >
                <IconChevronRight size={22} stroke={2.2} />
              </button>
            </div>

            {/* Bottom Thumbnail Strip */}
            <div
              className="border-t border-white/10 pt-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                ref={thumbnailContainerRef}
                className="no-scrollbar flex items-center justify-start gap-2 overflow-x-auto py-1 sm:justify-center"
              >
                {filteredImages.map((thumb, idx) => {
                  const isCurrent = idx === active
                  return (
                    <button
                      key={thumb.id ?? idx}
                      type="button"
                      onClick={() => setActive(idx)}
                      aria-label={`Jump to photo ${idx + 1}`}
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition-all duration-200 ${
                        isCurrent
                          ? 'scale-110 ring-2 ring-white opacity-100'
                          : 'opacity-40 hover:opacity-80 hover:scale-105'
                      }`}
                    >
                      <Image
                        src={gallerySrc(thumb, 'thumbnail')}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
