'use client'

import { IconChevronLeft, IconChevronRight, IconX, IconZoomIn } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { A11y, EffectFade, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

export type SlideImage = {
  src: string
  alt: string
}

type RoomImageSliderProps = {
  images: SlideImage[]
  title: string
  aspectRatio?: string
  tall?: boolean
}

export function RoomImageSlider({
  images,
  title,
  aspectRatio = 'aspect-[16/10]',
  tall = false,
}: RoomImageSliderProps) {
  const swiperRef = useRef<SwiperClass | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const lightboxPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length))
  }, [images.length])

  const lightboxNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % images.length))
  }, [images.length])

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') lightboxNext()
      if (e.key === 'ArrowLeft') lightboxPrev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, closeLightbox, lightboxNext, lightboxPrev])

  if (!images || images.length === 0) {
    return null
  }

  const currentLightboxImage = lightboxIndex !== null ? images[lightboxIndex] : null

  // If only 1 image, render clean clickable image without Swiper controls
  if (images.length === 1) {
    return (
      <>
        <div
          onClick={() => openLightbox(0)}
          className={`group relative w-full cursor-pointer overflow-hidden rounded-2xl bg-surface/50 ${tall ? 'aspect-[4/5]' : aspectRatio}`}
        >
          <Image
            src={images[0].src}
            alt={images[0].alt || title}
            fill
            sizes="(min-width: 1024px) 50vw, 91vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Zoom hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
            <IconZoomIn size={36} stroke={1.5} className="text-white drop-shadow-md transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {currentLightboxImage && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${title} photo viewer`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeLightbox}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-md sm:p-8"
            >
              <motion.figure
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative max-h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={currentLightboxImage.src}
                  alt={currentLightboxImage.alt || title}
                  width={1600}
                  height={1600}
                  sizes="90vw"
                  className="max-h-[85dvh] w-auto rounded-xl object-contain shadow-2xl"
                  priority
                />
              </motion.figure>

              <button
                ref={closeRef}
                type="button"
                onClick={closeLightbox}
                aria-label="Close photo viewer"
                className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <IconX size={18} stroke={2.2} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <>
      <div className={`group relative w-full select-none overflow-hidden rounded-2xl bg-surface/50 ${tall ? 'aspect-[4/5]' : aspectRatio}`}>
        <Swiper
          modules={[Navigation, Pagination, EffectFade, Keyboard, A11y]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={450}
          keyboard={{ enabled: true }}
          loop={images.length > 1}
          allowTouchMove={true}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex)
          }}
          className="h-full w-full"
        >
          {images.map((slide, i) => (
            <SwiperSlide
              key={slide.src + i}
              onClick={() => openLightbox(i)}
              className="relative h-full w-full cursor-pointer group/slide"
            >
              <Image
                src={slide.src}
                alt={slide.alt || `${title} photo ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 50vw, 91vw"
                className="object-cover transition-transform duration-500 group-hover/slide:scale-105"
                priority={i === 0}
              />
              {/* Zoom overlay on slide hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover/slide:opacity-100 pointer-events-none">
                <IconZoomIn size={36} stroke={1.5} className="text-white drop-shadow-md transition-transform duration-300 group-hover/slide:scale-110" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Slide Index Badge */}
        <div className="absolute top-4 right-4 z-10 rounded-full bg-ink/70 px-3 py-1 text-[11px] font-medium tracking-wider text-white backdrop-blur-md shadow-xs pointer-events-none">
          {activeIndex + 1} / {images.length}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              swiperRef.current?.slidePrev()
            }}
            aria-label="Previous slide"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-paper/85 text-ink shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-paper active:scale-95 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          >
            <IconChevronLeft size={18} stroke={2} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              swiperRef.current?.slideNext()
            }}
            aria-label="Next slide"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-paper/85 text-ink shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-paper active:scale-95 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          >
            <IconChevronRight size={18} stroke={2} />
          </button>
        </div>

        {/* Bottom Dot Indicators */}
        <div className="absolute bottom-3 inset-x-0 z-10 flex items-center justify-center gap-1.5 pointer-events-none">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                swiperRef.current?.slideToLoop(idx)
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex ? 'w-5 bg-white shadow-xs' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {currentLightboxImage && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} photo viewer`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-md sm:p-8"
          >
            <motion.figure
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentLightboxImage.src}
                alt={currentLightboxImage.alt || title}
                width={1600}
                height={1600}
                sizes="90vw"
                className="max-h-[85dvh] w-auto rounded-xl object-contain shadow-2xl"
                priority
              />
            </motion.figure>

            {/* Counter badge in Lightbox - centered at bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 rounded-full bg-black/60 px-4 py-1.5 text-xs font-medium tracking-widest text-white backdrop-blur-md shadow-lg border border-white/10 pointer-events-none">
              {lightboxIndex !== null ? lightboxIndex + 1 : 1} / {images.length}
            </div>

            {/* Close Button */}
            <button
              ref={closeRef}
              type="button"
              onClick={closeLightbox}
              aria-label="Close photo viewer"
              className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <IconX size={18} stroke={2.2} />
            </button>

            {/* Previous Photo Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  lightboxPrev()
                }}
                aria-label="Previous photo"
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white hover:text-ink active:scale-95 cursor-pointer"
              >
                <IconChevronLeft size={22} stroke={2} />
              </button>
            )}

            {/* Next Photo Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  lightboxNext()
                }}
                aria-label="Next photo"
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white hover:text-ink active:scale-95 cursor-pointer"
              >
                <IconChevronRight size={22} stroke={2} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
