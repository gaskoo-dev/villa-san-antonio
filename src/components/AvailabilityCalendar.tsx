'use client'

import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconLoader2,
  IconRefresh,
} from '@tabler/icons-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

const DAYS_OF_WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

interface AvailabilityData {
  bookedRanges: { start: string; end: string }[]
  disabledDates: string[]
}

export function AvailabilityCalendar({
  checkIn,
  checkOut,
  minNights = 3,
  onSelectRange,
}: {
  checkIn: string
  checkOut: string
  minNights?: number
  onSelectRange: (start: string, end: string) => void
}) {
  const [data, setData] = useState<AvailabilityData>({
    bookedRanges: [],
    disabledDates: [],
  })
  const [apiMinNights, setApiMinNights] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  const effectiveMinNights = apiMinNights || minNights

  // Current viewing month (0-indexed) & transition direction
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [direction, setDirection] = useState<1 | -1>(1)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const res = await fetch('/api/availability')
        const json = await res.json()
        if (!ignore && json.success) {
          setData({
            bookedRanges: json.bookedRanges || [],
            disabledDates: json.disabledDates || [],
          })
          if (typeof json.minNights === 'number') {
            setApiMinNights(json.minNights)
          }
        }
      } catch (err) {
        console.error('Failed to load availability:', err)
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [])

  const nextMonth = () => {
    setDirection(1)
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const prevMonth = () => {
    if (
      viewYear === today.getFullYear() &&
      viewMonth <= today.getMonth()
    ) {
      return
    }
    setDirection(-1)
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const isDateBooked = (dateStr: string) => {
    return data.disabledDates.includes(dateStr)
  }

  const isDateInPast = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day, 23, 59, 59)
    return d < today
  }

  const formatDateStr = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${year}-${m}-${d}`
  }

  const handleDateClick = (dateStr: string) => {
    if (isDateBooked(dateStr)) return

    if (!checkIn || (checkIn && checkOut)) {
      onSelectRange(dateStr, '')
      return
    }

    if (checkIn && !checkOut) {
      if (dateStr <= checkIn) {
        onSelectRange(dateStr, '')
        return
      }

      let hasBookedInRange = false
      const cur = new Date(checkIn)
      const target = new Date(dateStr)

      while (cur <= target) {
        const y = cur.getFullYear()
        const m = String(cur.getMonth() + 1).padStart(2, '0')
        const d = String(cur.getDate()).padStart(2, '0')
        const s = `${y}-${m}-${d}`

        if (s !== checkIn && s !== dateStr && isDateBooked(s)) {
          hasBookedInRange = true
          break
        }
        cur.setDate(cur.getDate() + 1)
      }

      if (hasBookedInRange) {
        onSelectRange(dateStr, '')
      } else {
        onSelectRange(checkIn, dateStr)
      }
    }
  }

  const renderMonth = (year: number, month: number) => {
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7 // Monday = 0
    const totalDays = new Date(year, month + 1, 0).getDate()

    const days: (number | null)[] = []
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null)
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(d)
    }

    return (
      <div className="space-y-3">
        <div className="text-center">
          <h4 className="text-xs font-semibold tracking-[0.14rem] uppercase text-ink/80">
            {MONTH_NAMES[month]} {year}
          </h4>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-ink/40">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-10 sm:h-10.5 w-full" />
            }

            const dateStr = formatDateStr(year, month, day)
            const isPast = isDateInPast(year, month, day)
            const booked = isDateBooked(dateStr)

            const isStart = checkIn === dateStr
            const isEnd = checkOut === dateStr
            const isSelected =
              checkIn &&
              checkOut &&
              dateStr >= checkIn &&
              dateStr <= checkOut
            const isHovered =
              checkIn &&
              !checkOut &&
              hoveredDate &&
              dateStr > checkIn &&
              dateStr <= hoveredDate

            let stateClass =
              'text-ink hover:bg-black/[0.05] hover:border-ink/20 border border-transparent font-medium'

            if (isPast) {
              stateClass =
                'text-ink/20 cursor-not-allowed border border-transparent font-normal'
            } else if (booked) {
              stateClass =
                'bg-black/[0.03] text-ink/30 border border-transparent line-through cursor-not-allowed select-none'
            } else if (isStart || isEnd) {
              stateClass =
                'bg-ink text-white font-bold shadow-md scale-105 border border-ink z-10'
            } else if (isSelected) {
              stateClass = 'bg-ink/10 text-ink font-semibold'
            } else if (isHovered) {
              stateClass = 'bg-ink/5 text-ink border-dashed border-ink/25'
            }

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isPast || booked}
                onClick={() => handleDateClick(dateStr)}
                onMouseEnter={() => !isPast && !booked && setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`relative flex h-10 sm:h-10.5 w-full items-center justify-center rounded-xl text-xs sm:text-sm transition-all duration-150 cursor-pointer disabled:cursor-not-allowed ${stateClass}`}
                title={
                  booked
                    ? 'Unavailable / Reserved'
                    : isPast
                      ? 'Past date'
                      : `Select ${dateStr}`
                }
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const secondMonth = viewMonth === 11 ? 0 : viewMonth + 1
  const secondYear = viewMonth === 11 ? viewYear + 1 : viewYear

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/70 p-4 sm:p-5.5 space-y-4">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between border-b border-ink/10 pb-3">
        <div className="flex items-center gap-2">
          <IconCalendar size={18} stroke={1.8} className="text-ink/70" />
          <span className="text-xs font-semibold uppercase tracking-[0.14rem] text-ink">
            Availability Calendar
          </span>
          <span className="hidden sm:inline-flex items-center rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-ink/55">
            Min. {effectiveMinNights} nights
          </span>
          {loading && (
            <IconLoader2 size={14} className="animate-spin text-ink/50" />
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={prevMonth}
            disabled={
              viewYear === today.getFullYear() &&
              viewMonth <= today.getMonth()
            }
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <IconChevronLeft size={16} stroke={2} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white cursor-pointer"
          >
            <IconChevronRight size={16} stroke={2} />
          </button>
        </div>
      </div>

      {/* Animated 2-Month Grid */}
      <div className="relative overflow-hidden min-h-[290px]">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={`${viewYear}-${viewMonth}`}
            custom={direction}
            initial={{ opacity: 0, x: direction * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 28 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1"
          >
            {renderMonth(viewYear, viewMonth)}
            <div className="hidden md:block">
              {renderMonth(secondYear, secondMonth)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Calendar Legend & Selection Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-3 text-[11px] text-ink/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border border-ink/30 bg-transparent" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-ink text-white" />
            <span className="text-ink font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-black/[0.06] border border-black/10" />
            <span className="text-ink/50 line-through">Reserved</span>
          </div>
        </div>

        {checkIn && (
          <button
            type="button"
            onClick={() => onSelectRange('', '')}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-ink/60 underline decoration-ink/30 hover:text-ink hover:decoration-ink transition-colors cursor-pointer"
          >
            <IconRefresh size={12} stroke={2} />
            <span>Clear dates</span>
          </button>
        )}
      </div>
    </div>
  )
}
