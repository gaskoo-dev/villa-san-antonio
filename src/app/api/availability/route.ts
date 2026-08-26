import { NextResponse } from 'next/server'

import { getAvailabilitySnapshot } from '@/lib/availability'

export const dynamic = 'force-dynamic'
export const revalidate = 900 // Cache for 15 minutes

export async function GET() {
  const availability = await getAvailabilitySnapshot()
  const revalidateSeconds = Math.max(0, availability.cacheMinutes * 60)

  return NextResponse.json(
    {
      success: true,
      ...availability,
      totalRanges: availability.bookedRanges.length,
    },
    {
      headers:
        availability.noStore || revalidateSeconds === 0
          ? { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' }
          : { 'Cache-Control': `public, s-maxage=${revalidateSeconds}, stale-while-revalidate=60` },
    }
  )
}
