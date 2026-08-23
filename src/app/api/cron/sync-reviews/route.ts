import { NextResponse } from 'next/server'
import { syncAndDeduplicateReviews } from '@/scripts/syncReviews'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds max runtime

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // If CRON_SECRET is set in environment, verify bearer authorization
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const summary = await syncAndDeduplicateReviews()
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
    })
  } catch (error) {
    console.error('Cron review sync failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  return GET(req)
}
