'use client'

import * as THREE from 'three'
import { useEffect, useRef } from 'react'

import type { ShaderSlide } from '@/components/ShaderHero'

const VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const FRAGMENT = /* glsl */ `
precision highp float;
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uProgress;
uniform vec2 uRes;
uniform vec2 uTexARes;
uniform vec2 uTexBRes;
varying vec2 vUv;

const float size = 0.04;
const float zoom = 50.0;
const float colorSeparation = 0.3;

vec2 coverUv(vec2 uv, vec2 canvas, vec2 image) {
  float rC = canvas.x / canvas.y;
  float rI = image.x / image.y;
  vec2 s = (rC > rI)
    ? vec2(1.0, rI / rC)
    : vec2(rC / rI, 1.0);
  return (uv - 0.5) * s + 0.5;
}

void main() {
  vec2 uvA = coverUv(vUv, uRes, uTexARes);
  vec2 uvB = coverUv(vUv, uRes, uTexBRes);

  float inv = 1.0 - uProgress;
  vec2 disp = size * vec2(cos(zoom * uvA.x), sin(zoom * uvA.y));

  vec2 uvTo = clamp(uvB + inv * disp, 0.001, 0.999);
  vec4 texTo = texture2D(uTexB, uvTo);

  vec2 uvFromR = clamp(uvA + uProgress * disp * (1.0 - colorSeparation), 0.001, 0.999);
  vec2 uvFromG = clamp(uvA + uProgress * disp, 0.001, 0.999);
  vec2 uvFromB = clamp(uvA + uProgress * disp * (1.0 + colorSeparation), 0.001, 0.999);

  vec4 texFrom = vec4(
    texture2D(uTexA, uvFromR).r,
    texture2D(uTexA, uvFromG).g,
    texture2D(uTexA, uvFromB).b,
    1.0
  );

  gl_FragColor = texTo * uProgress + texFrom * inv;
}
`

type LoadedTexture = { texture: THREE.Texture; aspect: number }

export function ShaderHeroCanvas({
  images,
  duration,
  interval,
  initialDelay,
  onReady,
  onSlideChange,
}: {
  images: ShaderSlide[]
  duration: number
  interval: number
  initialDelay: number
  onReady: () => void
  onSlideChange?: (index: number) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onReadyRef = useRef(onReady)
  const onSlideChangeRef = useRef(onSlideChange)

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    onSlideChangeRef.current = onSlideChange
  }, [onSlideChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || images.length < 2) return

    let disposed = false
    let resizeObserver: ResizeObserver | undefined
    let transitionFrame = 0
    let advanceTimer = 0

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        uTexA: { value: null },
        uTexB: { value: null },
        uProgress: { value: 0 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uTexARes: { value: new THREE.Vector2(1, 1) },
        uTexBRes: { value: new THREE.Vector2(1, 1) },
      },
    })
    const geometry = new THREE.PlaneGeometry(2, 2)
    scene.add(new THREE.Mesh(geometry, material))

    const textureCache = new Map<number, Promise<LoadedTexture>>()
    const loadTexture = (index: number) => {
      const normalizedIndex = index % images.length
      const cached = textureCache.get(normalizedIndex)
      if (cached) return cached

      const pending = new Promise<LoadedTexture>((resolve, reject) => {
        new THREE.TextureLoader().load(
          images[normalizedIndex].src,
          (texture) => {
            texture.colorSpace = THREE.NoColorSpace
            texture.minFilter = THREE.LinearFilter
            texture.magFilter = THREE.LinearFilter
            texture.generateMipmaps = false
            const image = texture.image as HTMLImageElement | undefined
            const width = image?.naturalWidth || image?.width || 0
            const height = image?.naturalHeight || image?.height || 0
            resolve({ texture, aspect: width > 0 && height > 0 ? width / height : 1.5 })
          },
          undefined,
          reject,
        )
      })

      textureCache.set(normalizedIndex, pending)
      return pending
    }

    const render = () => renderer.render(scene, camera)
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const width = rect.width || canvas.clientWidth || window.innerWidth
      const height = rect.height || canvas.clientHeight || window.innerHeight
      renderer.setSize(width, height, false)
      material.uniforms.uRes.value.set(width, height)
      render()
    }

    const scheduleAdvance = (delay: number, advance: () => void) => {
      window.clearTimeout(advanceTimer)
      advanceTimer = window.setTimeout(advance, delay)
    }

    ;(async () => {
      try {
        const first = await loadTexture(0)
        if (disposed) return

        let current = 0
        let transitioning = false
        let loadingNext = false

        material.uniforms.uTexA.value = first.texture
        material.uniforms.uTexARes.value.set(first.aspect, 1)
        material.uniforms.uTexB.value = first.texture
        material.uniforms.uTexBRes.value.set(first.aspect, 1)
        resize()

        window.addEventListener('resize', resize)
        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(canvas)
        onReadyRef.current()

        const advance = async () => {
          if (disposed) return
          if (transitioning || loadingNext || document.hidden) {
            scheduleAdvance(1000, advance)
            return
          }

          loadingNext = true
          const nextIndex = (current + 1) % images.length

          try {
            const next = await loadTexture(nextIndex)
            if (disposed) return

            material.uniforms.uTexB.value = next.texture
            material.uniforms.uTexBRes.value.set(next.aspect, 1)
            material.uniforms.uProgress.value = 0
            loadingNext = false
            transitioning = true
            onSlideChangeRef.current?.(nextIndex)

            const transitionStart = performance.now()
            const tick = (now: number) => {
              if (disposed) return
              const progress = Math.min(1, (now - transitionStart) / duration)
              material.uniforms.uProgress.value = progress
              render()

              if (progress < 1) {
                transitionFrame = requestAnimationFrame(tick)
                return
              }

              current = nextIndex
              transitioning = false
              material.uniforms.uTexA.value = next.texture
              material.uniforms.uTexARes.value.set(next.aspect, 1)
              material.uniforms.uProgress.value = 0
              render()
              scheduleAdvance(interval, advance)

              // Warm only the following photograph; the remaining slides stay off the critical path.
              void loadTexture((current + 1) % images.length).catch(() => undefined)
            }

            transitionFrame = requestAnimationFrame(tick)
          } catch (error) {
            loadingNext = false
            console.warn('ShaderHero could not load the next image', error)
            scheduleAdvance(interval, advance)
          }
        }

        scheduleAdvance(initialDelay, advance)
      } catch (error) {
        console.warn('ShaderHero fallback to poster image', error)
      }
    })()

    return () => {
      disposed = true
      cancelAnimationFrame(transitionFrame)
      window.clearTimeout(advanceTimer)
      window.removeEventListener('resize', resize)
      resizeObserver?.disconnect()
      textureCache.forEach((pending) => {
        void pending.then(({ texture }) => texture.dispose()).catch(() => undefined)
      })
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [duration, images, initialDelay, interval])

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
}
