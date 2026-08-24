import { NextResponse } from 'next/server'
import { getPayloadClient, getSettings } from '@/lib/queries'

export const dynamic = 'force-dynamic'
export const revalidate = 900 // Cache for 15 minutes

interface BookedRange {
  start: string
  end: string
  source?: string
}

function parseIcalDate(raw: string): string | null {
  // Handles 20260823T160000, 20260823, DTSTART;VALUE=DATE:20260823
  const match = raw.match(/(\d{4})(\d{2})(\d{2})/)
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }
  return null
}

function parseHrDateToIso(hrDate: string): string | null {
  const clean = hrDate.trim().replace(/\.$/, '')
  const parts = clean.split('.')
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0')
    const month = parts[1].padStart(2, '0')
    const year = parts[2]
    return `${year}-${month}-${day}`
  }
  return null
}

export async function GET() {
  const bookedRanges: BookedRange[] = []
  const disabledDateSet = new Set<string>()

  const siteSettings = await getSettings()
  const customIcalUrl =
    siteSettings?.calendarIcalUrl || 'https://www.myluxoria.com/api/v1/get-ical/358'
  const noStore = Boolean(siteSettings?.calendarNoStore)
  const cacheMinutes =
    typeof siteSettings?.calendarCacheMinutes === 'number'
      ? siteSettings.calendarCacheMinutes
      : 15
  const revalidateSeconds = Math.max(0, cacheMinutes * 60)

  // 1. Fetch official iCal Feed
  try {
    const fetchOptions: RequestInit = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      ...(noStore || revalidateSeconds === 0
        ? { cache: 'no-store' }
        : { next: { revalidate: revalidateSeconds } }),
    }

    const icalRes = await fetch(customIcalUrl, fetchOptions)

    if (icalRes.ok) {
      // Record last sync timestamp in site-settings
      getPayloadClient()
        .then((payload) =>
          payload.updateGlobal({
            slug: 'site-settings',
            data: {
              calendarIcalUrl: customIcalUrl,
              calendarLastSyncedAt: new Date().toISOString(),
            },
          })
        )
        .catch(() => {})

      const icsText = await icalRes.text()
      const events = icsText.split('BEGIN:VEVENT')

      for (const ev of events.slice(1)) {
        const dtstartMatch = ev.match(/DTSTART[^:]*:([^\r\n]+)/)
        const dtendMatch = ev.match(/DTEND[^:]*:([^\r\n]+)/)

        if (dtstartMatch && dtendMatch) {
          const startIso = parseIcalDate(dtstartMatch[1])
          const endIso = parseIcalDate(dtendMatch[1])

          if (startIso && endIso) {
            bookedRanges.push({
              start: startIso,
              end: endIso,
              source: 'MyLuxoria / Booking.com',
            })

            const cur = new Date(startIso)
            const end = new Date(endIso)
            while (cur <= end) {
              const y = cur.getFullYear()
              const m = String(cur.getMonth() + 1).padStart(2, '0')
              const d = String(cur.getDate()).padStart(2, '0')
              disabledDateSet.add(`${y}-${m}-${d}`)
              cur.setDate(cur.getDate() + 1)
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch MyLuxoria iCal feed:', err)
  }

  // 2. Fetch Adriatic Luxury Villas reservations (for cross-platform completeness)
  try {
    const alvUrl =
      'https://www.adriaticluxuryvillas.com/hr/vile/dalmacija/sibenik/vila-san-antonio'
    const alvRes = await fetch(alvUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 900 },
    })

    if (alvRes.ok) {
      const html = await alvRes.text()
      const resMatch = html.match(/var\s+reservations\s*=\s*(\[[\s\S]*?\]);/)

      if (resMatch) {
        const rawReservations: { start_date: string; end_date: string }[] =
          JSON.parse(resMatch[1])

        for (const r of rawReservations) {
          const startIso = parseHrDateToIso(r.start_date)
          const endIso = parseHrDateToIso(r.end_date)

          if (startIso && endIso) {
            // Avoid duplicate range if already added from iCal
            const exists = bookedRanges.some(
              (b) => b.start === startIso && b.end === endIso
            )
            if (!exists) {
              bookedRanges.push({
                start: startIso,
                end: endIso,
                source: 'Adriatic Luxury Villas',
              })

              const cur = new Date(startIso)
              const end = new Date(endIso)
              while (cur <= end) {
                const y = cur.getFullYear()
                const m = String(cur.getMonth() + 1).padStart(2, '0')
                const d = String(cur.getDate()).padStart(2, '0')
                disabledDateSet.add(`${y}-${m}-${d}`)
                cur.setDate(cur.getDate() + 1)
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch ALV reservations:', err)
  }

  return NextResponse.json(
    {
      success: true,
      lastUpdated: new Date().toISOString(),
      minNights: typeof siteSettings?.minNights === 'number' ? siteSettings.minNights : 3,
      noStore,
      cacheMinutes,
      totalRanges: bookedRanges.length,
      bookedRanges: bookedRanges.sort((a, b) => a.start.localeCompare(b.start)),
      disabledDates: Array.from(disabledDateSet).sort(),
    },
    {
      headers:
        noStore || revalidateSeconds === 0
          ? { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' }
          : { 'Cache-Control': `public, s-maxage=${revalidateSeconds}, stale-while-revalidate=60` },
    }
  )
}
