'use client'

import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconLoader2,
  IconLock,
  IconRefresh,
} from '@tabler/icons-react'
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
  onSelectRange,
}: {
  checkIn: string
  checkOut: string
  onSelectRange: (start: string, end: string) => void
}) {
  const [data, setData] = useState<AvailabilityData>({
    bookedRanges: [],
    disabledDates: [],
  })
  const [loading, setLoading] = useState(true)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  // Current viewing month (0-indexed)
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

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
          <h4 className="text-sm font-semibold tracking-wider uppercase text-ink">
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
              return <div key={`empty-${idx}`} className="h-10 sm:h-11 w-full" />
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
              'text-ink hover:bg-ink/10 hover:border-ink/20 border border-transparent font-medium'

            if (isPast) {
              stateClass =
                'text-ink/20 cursor-not-allowed border border-transparent font-normal'
            } else if (booked) {
              stateClass =
                'bg-rose-50 text-rose-400 border border-rose-200/80 line-through cursor-not-allowed'
            } else if (isStart || isEnd) {
              stateClass =
                'bg-ink text-white font-bold shadow-md scale-105 border border-ink z-10'
            } else if (isSelected) {
              stateClass = 'bg-ink/10 text-ink font-semibold'
            } else if (isHovered) {
              stateClass = 'bg-ink/5 text-ink border-dashed border-ink/30'
            }

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isPast || booked}
                onClick={() => handleDateClick(dateStr)}
                onMouseEnter={() => !isPast && !booked && setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`relative flex h-10 sm:h-11 w-full items-center justify-center rounded-xl text-xs sm:text-sm transition-all duration-150 ${stateClass}`}
                title={
                  booked
                    ? 'Booked on Booking.com / ALV'
                    : isPast
                      ? 'Past date'
                      : `Select ${dateStr}`
                }
              >
                {day}
                {booked && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] text-white shadow-xs">
                    <IconLock size={9} stroke={2.5} />
                  </span>
                )}
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
    <div className="rounded-2xl border border-ink/10 bg-surface/50 p-4 sm:p-5 space-y-4">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between border-b border-ink/10 pb-3">
        <div className="flex items-center gap-2">
          <IconCalendar size={18} stroke={1.8} className="text-ink/70" />
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-ink">
            Availability Calendar
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
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <IconChevronLeft size={16} stroke={2} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
          >
            <IconChevronRight size={16} stroke={2} />
          </button>
        </div>
      </div>

      {/* 2-Month Grid (Single on mobile, Dual on tablet/desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {renderMonth(viewYear, viewMonth)}
        <div className="hidden md:block">
          {renderMonth(secondYear, secondMonth)}
        </div>
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
            <span className="h-3 w-3 rounded-full bg-rose-100 border border-rose-300" />
            <span className="text-rose-600 font-medium">Booked</span>
          </div>
        </div>

        {checkIn && (
          <button
            type="button"
            onClick={() => onSelectRange('', '')}
            className="inline-flex items-center gap-1 text-[11px] text-ink/60 underline decoration-ink/30 hover:text-ink hover:decoration-ink transition-colors"
          >
            <IconRefresh size={12} stroke={2} />
            <span>Clear dates</span>
          </button>
        )}
      </div>
    </div>
  )
}
