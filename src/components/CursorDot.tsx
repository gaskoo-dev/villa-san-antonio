'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary, [tabindex="0"]'

/**
 * Custom cursor dot that stays 1:1 with the mouse pointer with zero lag,
 * scaling smoothly when hovering over interactive elements.
 */
export function CursorDot() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const opacity = useMotionValue(0)
  const grow = useMotionValue(1)
  const scale = useSpring(grow, { stiffness: 450, damping: 30 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const update = () => setEnabled(fine.matches && !reduce)
    update()
    fine.addEventListener('change', update)
    return () => fine.removeEventListener('change', update)
  }, [reduce])

  useEffect(() => {
    if (!enabled) return

    const move = (e: PointerEvent) => {
      setHasMoved(true)
      x.set(e.clientX)
      y.set(e.clientY)
      opacity.set(1)
    }

    const over = (e: PointerEvent) => {
      const target = e.target as Element | null
      grow.set(target?.closest?.(INTERACTIVE) ? 2.8 : 1)
    }

    const leave = () => {
      opacity.set(0)
    }

    const enter = () => {
      opacity.set(1)
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('pointerleave', leave)
    document.addEventListener('pointerenter', enter)

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', leave)
      document.removeEventListener('pointerenter', enter)
    }
  }, [enabled, grow, opacity, x, y])

  if (!enabled || !hasMoved) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[120] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference lg:block"
      style={{ x, y, scale, opacity }}
    />
  )
}
