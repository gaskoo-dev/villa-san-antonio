'use client'

import { IconHelp, IconPlus, IconSearch, IconX } from '@tabler/icons-react'
import { useId, useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'

export type FaqItemData = {
  id?: string | number | null
  question: string
  answer: string
  category?: 'stay' | 'pool' | 'booking' | 'rules' | string | null
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All Questions' },
  { id: 'stay', label: 'Arrival & Stay' },
  { id: 'pool', label: 'Pool & Amenities' },
  { id: 'booking', label: 'Booking & Payment' },
  { id: 'rules', label: 'Rules & Pets' },
] as const

export function FaqInteractive({ items }: { items: FaqItemData[] }) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(4)
  const baseId = useId()

  // Auto-categorize items if category is missing or default
  const categorizedItems = useMemo(() => {
    return items.map((item) => {
      if (item.category && item.category !== 'general') {
        return item
      }
      const q = (item.question + ' ' + item.answer).toLowerCase()
      let inferredCategory = 'stay'
      if (
        q.includes('pool') ||
        q.includes('heat') ||
        q.includes('bbq') ||
        q.includes('grill') ||
        q.includes('garden') ||
        q.includes('jacuzzi')
      ) {
        inferredCategory = 'pool'
      } else if (
        q.includes('book') ||
        q.includes('pay') ||
        q.includes('card') ||
        q.includes('deposit') ||
        q.includes('refund') ||
        q.includes('cancel') ||
        q.includes('price')
      ) {
        inferredCategory = 'booking'
      } else if (
        q.includes('pet') ||
        q.includes('dog') ||
        q.includes('smoke') ||
        q.includes('party') ||
        q.includes('rule') ||
        q.includes('guest')
      ) {
        inferredCategory = 'rules'
      } else if (
        q.includes('park') ||
        q.includes('wifi') ||
        q.includes('check-in') ||
        q.includes('arrive') ||
        q.includes('location')
      ) {
        inferredCategory = 'stay'
      }
      return { ...item, category: inferredCategory }
    })
  }, [items])

  // Filter by category and search query
  const filteredItems = useMemo(() => {
    return categorizedItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory
      const query = search.trim().toLowerCase()
      const matchesSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [categorizedItems, selectedCategory, search])

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: categorizedItems.length }
    for (const item of categorizedItems) {
      const cat = item.category || 'stay'
      counts[cat] = (counts[cat] || 0) + 1
    }
    return counts
  }, [categorizedItems])

  return (
    <div className="space-y-8">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute left-4.5 flex items-center text-ink/40">
            <IconSearch size={19} stroke={1.8} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setOpenIndex(0) // open first matching on search
            }}
            placeholder="Search questions (e.g. heated pool, parking, deposit, pets)..."
            className="w-full rounded-2xl border border-ink/12 bg-paper py-4 pl-12 pr-11 text-sm sm:text-base text-ink placeholder:text-ink/40 shadow-xs transition-all duration-200 focus:border-ink focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-ink/10"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-ink/5 text-ink/60 hover:bg-ink/10 hover:text-ink transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <IconX size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills / Filter Tabs with Smooth Spring Sliding Pill */}
      <LayoutGroup id="faqTabsGroup">
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id
            const count = countsByCategory[tab.id] || 0
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(tab.id)
                  setOpenIndex(0)
                }}
                className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer outline-hidden ${
                  isActive
                    ? 'text-white'
                    : 'border border-ink/10 bg-paper text-ink/70 hover:border-ink/25 hover:text-ink hover:bg-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFaqPill"
                    className="absolute inset-0 rounded-full bg-ink shadow-xs"
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 32,
                      mass: 0.7,
                    }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={`relative z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-ink/8 text-ink/60'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>

      {/* Clean Minimalist Accordion with smooth fade-in between tabs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory + (search ? '_s_' + search : '')}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {filteredItems.length > 0 ? (
            <div className="divide-y divide-ink/10 border-y border-ink/10">
              {filteredItems.map((item, idx) => {
                const isOpen = openIndex === idx
                const panelId = `${baseId}-panel-${idx}`

                return (
                  <div key={item.question + idx} className="transition-colors duration-200">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className="group flex w-full items-center justify-between gap-4 py-5 text-left transition-colors cursor-pointer"
                      >
                        <span
                          className={`text-base sm:text-lg font-medium tracking-tight transition-colors duration-200 ${
                            isOpen ? 'text-ink font-semibold' : 'text-ink/85 group-hover:text-ink'
                          }`}
                        >
                          {item.question}
                        </span>
                        <span
                          className={`flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                            isOpen
                              ? 'rotate-45 bg-ink text-white border-ink shadow-xs'
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
                        <p className="max-w-[65ch] pb-6 text-sm sm:text-[15px] leading-relaxed text-ink/65">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-ink/20 bg-paper/50 p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink/5 text-ink/40">
                <IconHelp size={24} />
              </div>
              <h4 className="mt-4 text-base font-semibold text-ink">No questions found</h4>
              <p className="mt-1 text-sm text-ink/60">
                We couldn’t find any answers matching &ldquo;{search}&rdquo;. Try another term or reach out to us directly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSelectedCategory('all')
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white cursor-pointer"
              >
                <span>Reset Search & Filters</span>
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
