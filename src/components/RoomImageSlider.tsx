'use client'

import { IconChevronLeft, IconChevronRight, IconZoomIn } from '@tabler/icons-react'
import Image from 'next/image'
import React, { useMemo, useRef, useState } from 'react'
import { A11y, EffectFade, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

import { LightboxModal, type LightboxItem } from '@/components/LightboxModal'

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

  const lightboxItems = useMemo<LightboxItem[]>(
    () =>
      images.map((slide, idx) => ({
        id: idx,
        src: slide.src,
        thumbnailSrc: slide.src,
        alt: slide.alt || `${title} photo ${idx + 1}`,
        title: slide.alt || title,
        category: title,
      })),
    [images, title],
  )

  if (!images || images.length === 0) {
    return null
  }

  // If only 1 image, render clean clickable image without Swiper controls
  if (images.length === 1) {
    return (
      <>
        <div
          onClick={() => setLightboxIndex(0)}
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

        {/* Cinematic Fullscreen Lightbox Modal */}
        <LightboxModal
          isOpen={lightboxIndex !== null}
          activeIndex={lightboxIndex}
          items={lightboxItems}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          showViewAllGallery={false}
        />
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
              onClick={() => setLightboxIndex(i)}
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

      {/* Cinematic Fullscreen Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxIndex !== null}
        activeIndex={lightboxIndex}
        items={lightboxItems}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
        showViewAllGallery={false}
      />
    </>
  )
}
