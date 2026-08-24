import { NextResponse } from 'next/server'
import { getPayloadClient, getSettings } from '@/lib/queries'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

interface BookedRange {
  start: string
  end: string
  source?: string
}

function parseIcalDate(raw: string): string | null {
  const match = raw.match(/(\d{4})(\d{2})(\d{2})/)
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }
  return null
}

export async function handleSync() {
  const bookedRanges: BookedRange[] = []
  const siteSettings = await getSettings()
  const customIcalUrl =
    siteSettings?.calendarIcalUrl || 'https://www.myluxoria.com/api/v1/get-ical/358'

  const icalRes = await fetch(customIcalUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    },
    cache: 'no-store',
  })

  if (!icalRes.ok) {
    throw new Error(`Failed to fetch iCal URL: ${icalRes.status} ${icalRes.statusText}`)
  }

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
      }
    }
  }

  const nowIso = new Date().toISOString()

  // Update last synced at timestamp in Payload CMS
  const payload = await getPayloadClient()
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      calendarIcalUrl: customIcalUrl,
      calendarLastSyncedAt: nowIso,
    },
  })

  return {
    success: true,
    url: customIcalUrl,
    totalBookedRanges: bookedRanges.length,
    timestamp: nowIso,
  }
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await handleSync()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Calendar sync failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  return GET(req)
}
