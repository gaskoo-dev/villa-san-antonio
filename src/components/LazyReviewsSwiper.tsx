'use client'

import type { ComponentType } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Stars } from '@/components/Stars'
import type { ReviewSlide } from '@/components/ReviewsSwiper'

type ReviewsComponent = ComponentType<{ reviews: ReviewSlide[] }>

function ReviewsPreview({ reviews }: { reviews: ReviewSlide[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {reviews.slice(0, 3).map((review, index) => (
        <article
          key={review.id}
          className={`flex h-[310px] flex-col justify-between rounded-2xl border border-ink/10 bg-surface/50 p-5 sm:h-[320px] sm:p-6 ${
            index === 1 ? 'hidden sm:flex' : index === 2 ? 'hidden lg:flex' : ''
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <Stars count={review.stars ?? 5} size={16} />
            <span className="inline-flex items-center rounded-full border border-ink/10 bg-paper px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1rem] text-ink/70">
              {review.source || 'Verified Stay'}
            </span>
          </div>
          <blockquote className="line-clamp-4 text-sm leading-relaxed text-ink/85 sm:text-[15px]">
            &ldquo;{review.text}&rdquo;
          </blockquote>
          <div className="border-t border-ink/10 pt-3.5">
            <p className="text-sm font-semibold leading-tight text-ink">{review.name}</p>
            {review.country && <p className="mt-1 text-[11px] text-ink/65">{review.country}</p>}
          </div>
        </article>
      ))}
    </div>
  )
}

export function LazyReviewsSwiper({ reviews }: { reviews: ReviewSlide[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [SwiperComponent, setSwiperComponent] = useState<ReviewsComponent | null>(null)
  const loadingRef = useRef(false)

  const loadSwiper = useCallback(() => {
    if (loadingRef.current || SwiperComponent) return
    loadingRef.current = true
    void import('@/components/ReviewsSwiper').then((module) => {
      setSwiperComponent(() => module.ReviewsSwiper)
    })
  }, [SwiperComponent])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (!('IntersectionObserver' in window)) {
      loadSwiper()
      return
    }

    const mobile = window.matchMedia('(max-width: 767px)').matches
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        loadSwiper()
        observer.disconnect()
      },
      { rootMargin: mobile ? '200px 0px' : '600px 0px' },
    )

    observer.observe(root)
    return () => observer.disconnect()
  }, [loadSwiper])

  if (reviews.length === 0) return null

  return (
    <div ref={rootRef} onPointerEnter={loadSwiper} onFocus={loadSwiper}>
      {SwiperComponent ? (
        <SwiperComponent reviews={reviews} />
      ) : (
        <ReviewsPreview reviews={reviews} />
      )}
    </div>
  )
}
