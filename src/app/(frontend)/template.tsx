'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}
