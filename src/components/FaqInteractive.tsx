'use client'

import { IconHelp, IconPlus, IconSearch, IconX } from '@tabler/icons-react'
import { useId, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export type FaqCategoryData = {
  id?: string | number | null
  name: string
  slug: string
  sortOrder?: number | null
}

export type FaqItemData = {
  id?: string | number | null
  question: string
  answer: string
  category?: string | number | FaqCategoryData | null
}

export function FaqInteractive({
  items,
  categories = [],
  enableSearch = true,
  enableCategoryTabs = true,
}: {
  items: FaqItemData[]
  categories?: FaqCategoryData[]
  enableSearch?: boolean | null
  enableCategoryTabs?: boolean | null
}) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(4)
  const baseId = useId()

  const showSearch = enableSearch !== false
  const showTabs = enableCategoryTabs !== false

  // Dynamic Category Tabs from CMS
  const tabs = useMemo(() => {
    const list: Array<{ id: string; label: string }> = [{ id: 'all', label: 'All Questions' }]
    if (categories && categories.length > 0) {
      for (const cat of categories) {
        list.push({ id: cat.slug, label: cat.name })
      }
    } else {
      list.push(
        { id: 'stay', label: 'Arrival & Stay' },
        { id: 'pool', label: 'Pool & Amenities' },
        { id: 'booking', label: 'Booking & Payment' },
        { id: 'rules', label: 'House Rules & Pets' },
      )
    }
    return list
  }, [categories])

  // Helper to extract category slug
  const getItemCategorySlug = (item: FaqItemData): string => {
    if (typeof item.category === 'object' && item.category !== null) {
      return item.category.slug
    }
    if (typeof item.category === 'string') {
      return item.category
    }
    const q = (item.question + ' ' + item.answer).toLowerCase()
    if (
      q.includes('pool') ||
      q.includes('heat') ||
      q.includes('bbq') ||
      q.includes('grill') ||
      q.includes('garden') ||
      q.includes('jacuzzi')
    ) {
      return 'pool'
    }
    if (
      q.includes('book') ||
      q.includes('pay') ||
      q.includes('card') ||
      q.includes('deposit') ||
      q.includes('refund') ||
      q.includes('cancel') ||
      q.includes('price')
    ) {
      return 'booking'
    }
    if (
      q.includes('pet') ||
      q.includes('dog') ||
      q.includes('smoke') ||
      q.includes('party') ||
      q.includes('rule') ||
      q.includes('guest')
    ) {
      return 'rules'
    }
    return 'stay'
  }

  // Filter by category and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const itemCat = getItemCategorySlug(item)
      const matchesCategory =
        !showTabs ||
        selectedCategory === 'all' ||
        itemCat === selectedCategory
      const query = search.trim().toLowerCase()
      const matchesSearch =
        !showSearch ||
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [items, selectedCategory, search, showTabs, showSearch])

  // Counts by category tab
  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: items.length }
    for (const item of items) {
      const cat = getItemCategorySlug(item)
      counts[cat] = (counts[cat] || 0) + 1
    }
    return counts
  }, [items])

  return (
    <div className="space-y-8">
      {/* Search Input Bar */}
      {showSearch && (
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
              className="w-full rounded-2xl border border-ink/10 bg-paper py-4 pl-12 pr-11 text-sm sm:text-base text-ink placeholder:text-ink/40 transition-colors duration-200 hover:border-ink/25 focus:border-ink/30 focus:outline-hidden focus:ring-0"
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
      )}

      {/* Category Pills / Filter Tabs evenly distributed across full width matching search bar */}
      {showTabs && (
        <div className="w-full no-scrollbar overflow-x-auto rounded-full border border-black/[0.08] bg-black/[0.03] p-1.5 backdrop-blur-sm">
          <div className="flex min-w-full items-center justify-between gap-1 sm:grid sm:grid-cols-5 sm:gap-1.5">
            {tabs.map((tab) => {
              const isActive = selectedCategory === tab.id
              const count = countsByCategory[tab.id] || 0
              if (tab.id !== 'all' && count === 0) return null

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(tab.id)
                    setOpenIndex(0)
                  }}
                  className={`relative flex flex-1 shrink-0 items-center justify-center gap-2 rounded-full py-2.5 px-3 text-center text-xs font-semibold uppercase tracking-[0.12rem] transition-all duration-300 ${
                    isActive
                      ? 'text-white'
                      : 'text-ink/60 hover:text-ink hover:bg-black/[0.04]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFaqFilterPill"
                      className="absolute inset-0 rounded-full bg-ink shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 whitespace-nowrap">
                    {tab.label === 'All Questions' ? 'All' : tab.label}
                  </span>
                  <span
                    className={`relative z-10 text-[10px] tabular-nums shrink-0 ${
                      isActive ? 'text-white/60' : 'text-ink/40'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

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
