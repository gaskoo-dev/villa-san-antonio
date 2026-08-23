'use client'

import type * as ThreeNS from 'three'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

export type ShaderSlide = { src: string; alt: string }

const VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

/**
 * FlyEye transition: lens "bug eye" bulge plus faceted pixelation that peak
 * mid-transition, chromatic separation, and a center-out blend to the next
 * photograph. In the spirit of the uiinitiative shaders slider (flyeye effect),
 * implemented on a fullscreen three.js plane.
 */
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

/**
 * 100vh hero background: WebGL flyeye crossfading slider with an <Image>
 * poster underneath for instant paint and a no-WebGL fallback.
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasReady, setCanvasReady] = useState(false)
  const reduce = useReducedMotion()
  const reduceRef = useRef(reduce)
  const onSlideChangeRef = useRef(onSlideChange)
  const durationRef = useRef(duration)
  const intervalRef = useRef(interval)

  useEffect(() => {
    onSlideChangeRef.current = onSlideChange
  }, [onSlideChange])

  useEffect(() => {
    durationRef.current = duration
    intervalRef.current = interval
  }, [duration, interval])

  useEffect(() => {
    reduceRef.current = reduce
  }, [reduce])

  useEffect(() => {
    if (images.length < 2) return
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false
    let cleanup: (() => void) | undefined

    ;(async () => {
      const THREE = await import('three')
      if (disposed) return

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

      const loadTexture = (src: string) =>
        new Promise<{ texture: ThreeNS.Texture; aspect: number }>((resolve, reject) => {
          new THREE.TextureLoader().load(
            src,
            (texture) => {
              texture.colorSpace = THREE.NoColorSpace
              texture.minFilter = THREE.LinearFilter
              texture.magFilter = THREE.LinearFilter
              texture.generateMipmaps = false
              const img = texture.image as HTMLImageElement | undefined
              const w = img?.naturalWidth || img?.width || 0
              const h = img?.naturalHeight || img?.height || 0
              const aspect = w > 0 && h > 0 ? w / h : 1.5
              resolve({ texture, aspect })
            },
            undefined,
            reject,
          )
        })

      try {
        const loaded = await Promise.all(images.map((s) => loadTexture(s.src)))
        if (disposed) return

        let current = 0
        material.uniforms.uTexA.value = loaded[0].texture
        material.uniforms.uTexARes.value = new THREE.Vector2(loaded[0].aspect, 1)
        material.uniforms.uTexB.value = loaded[1 % loaded.length].texture
        material.uniforms.uTexBRes.value = new THREE.Vector2(loaded[1 % loaded.length].aspect, 1)

        const resize = () => {
          const rect = canvas.getBoundingClientRect()
          const w = rect.width || canvas.clientWidth || window.innerWidth
          const h = rect.height || canvas.clientHeight || window.innerHeight
          renderer.setSize(w, h, false)
          material.uniforms.uRes.value.set(w, h)
          render()
        }
        resize()

        const DURATION = durationRef.current || 2000
        const INTERVAL = intervalRef.current || 6500
        let transitionStart = 0
        let transitioning = false
        let raf = 0
        let needsRender = true

        function render() {
          renderer.render(scene, camera)
        }

        function tick(now: number) {
          if (transitioning) {
            const t = Math.min(1, (now - transitionStart) / DURATION)
            material.uniforms.uProgress.value = t
            render()
            if (t >= 1) {
              transitioning = false
              current = (current + 1) % loaded.length
              const next = (current + 1) % loaded.length
              material.uniforms.uTexA.value = loaded[current].texture
              material.uniforms.uTexARes.value = new THREE.Vector2(loaded[current].aspect, 1)
              material.uniforms.uTexB.value = loaded[next].texture
              material.uniforms.uTexBRes.value = new THREE.Vector2(loaded[next].aspect, 1)
              material.uniforms.uProgress.value = 0
              render()
            }
          }
          if (needsRender || transitioning) {
            if (needsRender && !transitioning) render()
            needsRender = false
          }
          raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)

        const advance = () => {
          if (transitioning || disposed || document.hidden) return
          if (reduceRef.current) return // static first photo under reduced motion
          transitioning = true
          transitionStart = performance.now()
          const nextIndex = (current + 1) % loaded.length
          onSlideChangeRef.current?.(nextIndex)
        }
        const timer = reduceRef.current ? 0 : window.setInterval(advance, INTERVAL)

        const onResize = () => resize()
        window.addEventListener('resize', onResize)
        const ro = new ResizeObserver(() => resize())
        ro.observe(canvas)
        setCanvasReady(true)

        cleanup = () => {
          cancelAnimationFrame(raf)
          if (timer) window.clearInterval(timer)
          window.removeEventListener('resize', onResize)
          ro.disconnect()
          material.dispose()
          renderer.dispose()
        }
      } catch (e) {
        // WebGL or texture failure: poster <Image> stays as the hero
        console.warn('ShaderHero fallback to poster image', e)
      }
    })()

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [images])

  const poster = images[0]

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {poster && (
        <Image
          src={poster.src}
          alt={poster.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 h-full w-full ${canvasReady ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
