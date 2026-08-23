'use client'

import Image from 'next/image'
import { A11y, Autoplay, EffectFade, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-fade'

export type HeroSlide = { src: string; alt: string }

export function HeroSlider({ images }: { images: HeroSlide[] }) {
  if (images.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, EffectFade, Keyboard, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1400}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        keyboard={{ enabled: true }}
        loop={images.length > 1}
        allowTouchMove={true}
        aria-label="Villa San Antonio Hero Gallery"
        className="h-full w-full"
      >
        {images.map((slide, i) => (
          <SwiperSlide key={slide.src + i} className="relative h-full w-full">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
