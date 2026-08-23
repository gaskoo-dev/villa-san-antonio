'use client'

import { IconArrowDown } from '@tabler/icons-react'
import React from 'react'

export function ScrollToExplore({
  targetId = 'perspective',
  label = 'Scroll to explore',
}: {
  targetId?: string
  label?: string
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className="group mx-auto flex cursor-pointer items-center gap-2 text-xs font-medium uppercase tracking-[0.16rem] text-white/75 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none md:mx-0"
    >
      <span className="underline decoration-white/30 underline-offset-[5px] transition-colors group-hover:decoration-white">
        {label}
      </span>
      <IconArrowDown
        size={18}
        stroke={2}
        className="inline-block transition-transform duration-300 group-hover:translate-y-1"
        aria-hidden
      />
    </button>
  )
}
