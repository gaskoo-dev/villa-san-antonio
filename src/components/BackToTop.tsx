'use client'

import { useEffect, useState } from 'react'
import { IconArrowUp } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'motion/react'

export function BackToTop({
  inline = false,
  className = '',
}: {
  inline?: boolean
  className?: string
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (inline) {
    return (
      <button
        type="button"
        onClick={scrollToTop}
        className={`group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14rem] text-white/50 transition-colors hover:text-white cursor-pointer ${className}`}
      >
        <span>Back to top</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:border-white">
          <IconArrowUp size={13} stroke={2} aria-hidden />
        </span>
      </button>
    )
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-paper/90 text-ink shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-ink/30 hover:bg-paper hover:shadow-xl active:scale-95 cursor-pointer sm:bottom-8 sm:right-8"
        >
          <IconArrowUp size={18} stroke={2} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
