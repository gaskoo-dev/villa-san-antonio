'use client'

import { IconArrowRight, IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { A11y, Autoplay, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper'

import 'swiper/css'

import { Stars } from '@/components/Stars'

export type ReviewSlide = {
  id: number | string
  name: string
  country?: string | null
  stars?: number | null
  text: string
  source?: string | null
}

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function ReviewsSwiper({ reviews }: { reviews: ReviewSlide[] }) {
  const swiperRef = useRef<SwiperClass | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Animated Modal state management
  const [modalReview, setModalReview] = useState<ReviewSlide | null>(null)
  const [isRendered, setIsRendered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const openModal = useCallback((review: ReviewSlide) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setModalReview(review)
    setIsRendered(true)
    // Double rAF ensures browser paints initial state before triggering CSS transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    })
  }, [])

  const closeModal = useCallback(() => {
    setIsVisible(false)
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = setTimeout(() => {
      setIsRendered(false)
      setModalReview(null)
    }, 220) // Matches transition duration
  }, [])

  // Body scroll lock and ESC key listener for modal
  useEffect(() => {
    if (!isRendered) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isRendered, closeModal])

  if (reviews.length === 0) return null

  return (
    <div className="space-y-8">
      {/* 3-Card Swiper Slider */}
      <Swiper
        modules={[Keyboard, A11y, Autoplay]}
        onSwiper={(s) => {
          swiperRef.current = s
        }}
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
        keyboard={{ enabled: true }}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        speed={600}
        spaceBetween={20}
        slidesPerView={1}
        slidesPerGroup={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 24,
          },
        }}
        aria-label="Guest reviews"
        className="w-full !py-4 !px-1 -my-4 -mx-1"
      >
        {reviews.map((review) => {
          const isLong = review.text.length > 150

          return (
            <SwiperSlide key={review.id} className="!h-auto">
              <article
                onClick={() => openModal(review)}
                className="group flex h-[310px] sm:h-[320px] cursor-pointer flex-col justify-between rounded-2xl border border-ink/10 bg-surface/50 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ink/25 hover:bg-surface hover:shadow-lg active:scale-[0.98]"
              >
                {/* Card Header: Stars & Verified Platform Badge */}
                <div className="flex items-center justify-between gap-2">
                  <Stars count={review.stars ?? 5} size={16} />
                  <span className="inline-flex items-center rounded-full border border-ink/10 bg-paper px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1rem] text-ink/70 shadow-sm">
                    {review.source
                      ? review.source
                          .replace('adriaticluxuryvillas.com', 'Adriatic Luxury')
                          .replace('myluxoria.com', 'MyLuxoria')
                      : 'Verified Stay'}
                  </span>
                </div>

                {/* Review Text Body */}
                <div className="my-auto py-1">
                  <blockquote className="text-sm sm:text-[15px] font-normal leading-relaxed text-ink/85 line-clamp-4">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>

                  {isLong && (
                    <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-ink underline decoration-ink/40 underline-offset-2 transition-colors group-hover:decoration-ink">
                      <span>Read more</span>
                      <IconArrowRight size={13} stroke={2.2} />
                    </span>
                  )}
                </div>

                {/* Card Footer: Guest Profile & Monogram */}
                <div className="flex items-center justify-between border-t border-ink/10 pt-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-semibold tracking-wider text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                      {getInitials(review.name)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-ink leading-tight">
                        {review.name}
                      </h4>
                      {review.country && (
                        <p className="text-[11px] text-ink/50 leading-tight">{review.country}</p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          )
        })}
      </Swiper>

      {/* Navigation Controls & Counter */}
      <div className="flex items-center justify-between pt-6 sm:pt-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous review"
            onClick={() => swiperRef.current?.slidePrev()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-paper text-ink shadow-sm transition-all duration-200 hover:scale-105 hover:border-ink hover:bg-ink hover:text-white active:scale-95"
          >
            <IconChevronLeft size={18} stroke={2} />
          </button>
          <button
            type="button"
            aria-label="Next review"
            onClick={() => swiperRef.current?.slideNext()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-paper text-ink shadow-sm transition-all duration-200 hover:scale-105 hover:border-ink hover:bg-ink hover:text-white active:scale-95"
          >
            <IconChevronRight size={18} stroke={2} />
          </button>
          <span className="ml-2 text-xs font-semibold uppercase tracking-[0.14rem] text-ink/50">
            {activeIndex + 1} of {reviews.length} reviews
          </span>
        </div>

        <span className="text-xs font-medium text-ink/50">
          Swipe or click any review to read full text
        </span>
      </div>

      {/* Full Review Modal Dialog with Smooth Open & Close Transitions */}
      {isRendered && modalReview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Full review by ${modalReview.name}`}
          onClick={closeModal}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-200 ease-out ${
            isVisible
              ? 'bg-black/60 backdrop-blur-sm opacity-100'
              : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-ink/10 bg-white p-6 sm:p-9 shadow-2xl space-y-6 will-change-transform transition-all duration-250 ease-out ${
              isVisible
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-[0.96] translate-y-3'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-5">
              <div className="flex items-center gap-3">
                <Stars count={modalReview.stars ?? 5} size={18} />
                <span className="inline-flex items-center rounded-full border border-ink/10 bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink/75">
                  {modalReview.source
                    ? modalReview.source
                        .replace('adriaticluxuryvillas.com', 'Adriatic Luxury Villas')
                        .replace('myluxoria.com', 'MyLuxoria')
                    : 'Verified Stay'}
                </span>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close review modal"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-ink transition-all duration-200 hover:scale-110 hover:bg-ink hover:text-white"
              >
                <IconX size={18} stroke={2.2} />
              </button>
            </div>

            {/* Modal Full Text */}
            <div className="space-y-4 py-2">
              <blockquote className="text-base sm:text-lg font-normal leading-relaxed text-ink/90 whitespace-pre-line">
                &ldquo;{modalReview.text}&rdquo;
              </blockquote>
            </div>

            {/* Modal Footer: Author Profile */}
            <div className="flex items-center justify-between border-t border-ink/10 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold tracking-wider text-white shadow-md">
                  {getInitials(modalReview.name)}
                </div>
                <div>
                  <h4 className="text-base font-semibold text-ink leading-tight">
                    {modalReview.name}
                  </h4>
                  {modalReview.country && (
                    <p className="text-xs text-ink/50 leading-tight mt-0.5">
                      {modalReview.country}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
