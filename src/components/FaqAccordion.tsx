'use client'

import { IconPlus } from '@tabler/icons-react'
import { useId, useState } from 'react'

export type FaqEntry = { question: string; answer: string }

export function FaqAccordion({ items, defaultOpen = 0 }: { items: FaqEntry[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number>(defaultOpen)
  const baseId = useId()

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, i) => {
        const isOpen = open === i
        const panelId = `${baseId}-panel-${i}`
        return (
          <div key={item.question} className="transition-colors duration-200">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="group flex w-full items-center justify-between gap-4 py-5 text-left transition-colors"
              >
                <span
                  className={`text-base sm:text-lg font-medium tracking-tight transition-colors duration-200 ${
                    isOpen ? 'text-ink' : 'text-ink/80 group-hover:text-ink'
                  }`}
                >
                  {item.question}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? 'rotate-45 bg-ink text-white border-ink shadow-sm'
                      : 'border-ink/20 text-ink/60 bg-transparent group-hover:border-ink group-hover:bg-ink group-hover:text-white'
                  }`}
                  aria-hidden
                >
                  <IconPlus size={16} stroke={2} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease-reveal)] ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[62ch] pb-5 text-sm sm:text-[15px] leading-relaxed text-ink/65">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
