'use client'

import {
  IconArrowsMaximize,
  IconPhoto,
} from '@tabler/icons-react'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { LightboxModal, type LightboxItem } from '@/components/LightboxModal'
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

  const lightboxItems = useMemo<LightboxItem[]>(
    () =>
      filteredImages.map((img, idx) => ({
        id: img.id ?? idx,
        src: gallerySrc(img, 'desktop'),
        thumbnailSrc: gallerySrc(img, 'thumbnail'),
        alt: mediaAlt(img) || 'Villa San Antonio',
        title: img.caption || mediaAlt(img) || 'Villa San Antonio',
        category: getCategoryName(img) || undefined,
      })),
    [filteredImages],
  )

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug)
    setActive(null)
  }

  return (
    <div className="w-full">
      {/* Category Filter Tabs Bar */}
      <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/65">
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
                selectedCategory === 'all' ? 'text-white/70' : 'text-ink/65'
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
                    isSelected ? 'text-white/70' : 'text-ink/65'
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
      <LightboxModal
        isOpen={active !== null}
        activeIndex={active}
        items={lightboxItems}
        onClose={() => setActive(null)}
        onNavigate={setActive}
      />
    </div>
  )
}
