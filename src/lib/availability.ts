import type { SiteSetting } from '@/payload-types'

import { getSettings } from '@/lib/queries'

export interface BookedRange {
  start: string
  end: string
  source?: string
}

export interface AvailabilitySnapshot {
  officialFeedAvailable: boolean
  lastUpdated: string
  minNights: number
  noStore: boolean
  cacheMinutes: number
  bookedRanges: BookedRange[]
  disabledDates: string[]
}

interface AvailabilityOptions {
  forceFresh?: boolean
  settings?: SiteSetting
}

const DEFAULT_ICAL_URL = 'https://www.myluxoria.com/api/v1/get-ical/358'
const ALV_URL =
  'https://www.adriaticluxuryvillas.com/hr/vile/dalmacija/sibenik/vila-san-antonio'

function parseIcalDate(raw: string): string | null {
  const match = raw.match(/(\d{4})(\d{2})(\d{2})/)
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null
}

function parseHrDateToIso(hrDate: string): string | null {
  const clean = hrDate.trim().replace(/\.$/, '')
  const parts = clean.split('.')
  if (parts.length < 3) return null

  const day = parts[0].padStart(2, '0')
  const month = parts[1].padStart(2, '0')
  const year = parts[2]
  return `${year}-${month}-${day}`
}

function parseIsoDay(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return date
}

function formatIsoDay(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function addDisabledRange(disabledDates: Set<string>, start: string, end: string): void {
  const current = parseIsoDay(start)
  const last = parseIsoDay(end)
  if (!current || !last || current > last) return

  while (current <= last) {
    disabledDates.add(formatIsoDay(current))
    current.setUTCDate(current.getUTCDate() + 1)
  }
}

export function isValidIsoDay(value: string): boolean {
  return Boolean(parseIsoDay(value))
}

export function dateRangeHasConflict(
  disabledDates: string[],
  checkIn: string,
  checkOut: string,
): boolean {
  const current = parseIsoDay(checkIn)
  const last = parseIsoDay(checkOut)
  if (!current || !last || current >= last) return true

  const disabled = new Set(disabledDates)
  while (current <= last) {
    if (disabled.has(formatIsoDay(current))) return true
    current.setUTCDate(current.getUTCDate() + 1)
  }

  return false
}

export async function getAvailabilitySnapshot(
  options: AvailabilityOptions = {},
): Promise<AvailabilitySnapshot> {
  const siteSettings = options.settings ?? (await getSettings())
  const customIcalUrl = siteSettings?.calendarIcalUrl || DEFAULT_ICAL_URL
  const noStore = Boolean(siteSettings?.calendarNoStore)
  const cacheMinutes =
    typeof siteSettings?.calendarCacheMinutes === 'number'
      ? siteSettings.calendarCacheMinutes
      : 15
  const revalidateSeconds = Math.max(0, cacheMinutes * 60)
  const forceFresh = Boolean(options.forceFresh)

  const bookedRanges: BookedRange[] = []
  const disabledDateSet = new Set<string>()
  let officialFeedAvailable = false

  const addRange = (range: BookedRange) => {
    const exists = bookedRanges.some(
      (booked) => booked.start === range.start && booked.end === range.end,
    )
    if (exists) return

    bookedRanges.push(range)
    addDisabledRange(disabledDateSet, range.start, range.end)
  }

  const fetchOfficialFeed = async () => {
    try {
      const fetchOptions: RequestInit = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        signal: AbortSignal.timeout(10_000),
        ...(forceFresh || noStore || revalidateSeconds === 0
          ? { cache: 'no-store' as const }
          : { next: { revalidate: revalidateSeconds } }),
      }

      const response = await fetch(customIcalUrl, fetchOptions)
      if (!response.ok) {
        console.error(`Failed to fetch MyLuxoria iCal feed: ${response.status} ${response.statusText}`)
        return
      }

      const icsText = await response.text()
      if (!icsText.includes('BEGIN:VCALENDAR')) {
        console.error('Failed to parse MyLuxoria iCal feed: response is not a calendar')
        return
      }

      officialFeedAvailable = true
      const events = icsText.split('BEGIN:VEVENT')

      for (const event of events.slice(1)) {
        const startMatch = event.match(/DTSTART[^:]*:([^\r\n]+)/)
        const endMatch = event.match(/DTEND[^:]*:([^\r\n]+)/)
        if (!startMatch || !endMatch) continue

        const start = parseIcalDate(startMatch[1])
        const end = parseIcalDate(endMatch[1])
        if (start && end) {
          addRange({ start, end, source: 'MyLuxoria / Booking.com' })
        }
      }
    } catch (error) {
      console.error('Failed to fetch MyLuxoria iCal feed:', error)
    }
  }

  const fetchAlvReservations = async () => {
    try {
      const response = await fetch(ALV_URL, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        signal: AbortSignal.timeout(10_000),
        ...(forceFresh
          ? { cache: 'no-store' as const }
          : { next: { revalidate: 900 } }),
      })
      if (!response.ok) return

      const html = await response.text()
      const reservationsMatch = html.match(/var\s+reservations\s*=\s*(\[[\s\S]*?\]);/)
      if (!reservationsMatch) return

      const reservations: { start_date: string; end_date: string }[] = JSON.parse(
        reservationsMatch[1],
      )

      for (const reservation of reservations) {
        const start = parseHrDateToIso(reservation.start_date)
        const end = parseHrDateToIso(reservation.end_date)
        if (start && end) {
          addRange({ start, end, source: 'Adriatic Luxury Villas' })
        }
      }
    } catch (error) {
      console.error('Failed to fetch ALV reservations:', error)
    }
  }

  await Promise.all([fetchOfficialFeed(), fetchAlvReservations()])

  return {
    officialFeedAvailable,
    lastUpdated: new Date().toISOString(),
    minNights: typeof siteSettings?.minNights === 'number' ? siteSettings.minNights : 3,
    noStore,
    cacheMinutes,
    bookedRanges: bookedRanges.sort((a, b) => a.start.localeCompare(b.start)),
    disabledDates: Array.from(disabledDateSet).sort(),
  }
}
