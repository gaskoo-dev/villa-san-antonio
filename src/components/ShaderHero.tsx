'use client'

import Image from 'next/image'
import type { ComponentType } from 'react'
import { useCallback, useEffect, useState } from 'react'

export type ShaderSlide = { src: string; alt: string }

type ShaderCanvasProps = {
  images: ShaderSlide[]
  duration: number
  interval: number
  initialDelay: number
  onReady: () => void
  onSlideChange?: (index: number) => void
}

const SHADER_BOOT_DELAY = 4000

/**
 * Paint a regular responsive image immediately, then add the WebGL transition
 * engine after the critical rendering window. Mobile and reduced-motion
 * visitors keep the fast static photograph.
 */
export function ShaderHero({
  images,
  duration = 2000,
  interval = 6500,
  onSlideChange,
}: {
  images: ShaderSlide[]
  duration?: number
  interval?: number
  onSlideChange?: (index: number) => void
}) {
  const [Canvas, setCanvas] = useState<ComponentType<ShaderCanvasProps> | null>(null)
  const [canvasReady, setCanvasReady] = useState(false)
  const handleReady = useCallback(() => setCanvasReady(true), [])

  useEffect(() => {
    if (images.length < 2) return

    const desktop = window.matchMedia('(min-width: 768px)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!desktop.matches || reducedMotion.matches) return

    let cancelled = false
    let idleId: number | undefined
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    const timer = window.setTimeout(() => {
      const loadCanvas = () => {
        void import('@/components/ShaderHeroCanvas').then((module) => {
          if (!cancelled) setCanvas(() => module.ShaderHeroCanvas)
        })
      }

      if (idleWindow.requestIdleCallback) {
        idleId = idleWindow.requestIdleCallback(loadCanvas, { timeout: 1500 })
      } else {
        loadCanvas()
      }
    }, SHADER_BOOT_DELAY)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId)
    }
  }, [images.length])

  const poster = images[0]
  const initialDelay = Math.max(1400, interval - SHADER_BOOT_DELAY)

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {poster && (
        <Image
          src={poster.src}
          alt={poster.alt}
          fill
          priority
          quality={70}
          sizes="100vw"
          className="object-cover"
        />
      )}
      {Canvas && (
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-out ${
            canvasReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Canvas
            images={images}
            duration={duration}
            interval={interval}
            initialDelay={initialDelay}
            onReady={handleReady}
            onSlideChange={onSlideChange}
          />
        </div>
      )}
    </div>
  )
}
