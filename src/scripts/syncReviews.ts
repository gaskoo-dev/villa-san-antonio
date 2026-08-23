import path from 'node:path'
import dotenv from 'dotenv'
import https from 'node:https'
import { getPayload } from 'payload'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'hr-HR,hr;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        rejectUnauthorized: false,
      },
      (res) => {
        let data = ''
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchUrl(res.headers.location).then(resolve).catch(reject)
        }
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => resolve(data))
      },
    )
    req.on('error', reject)
  })
}

function decodeHtml(html: string): string {
  return html
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&scaron;/g, 'š')
    .replace(/&Scaron;/g, 'Š')
    .replace(/&ccaron;/g, 'č')
    .replace(/&Ccaron;/g, 'Č')
    .replace(/&cacute;/g, 'ć')
    .replace(/&Cacute;/g, 'Ć')
    .replace(/&zcaron;/g, 'ž')
    .replace(/&Zcaron;/g, 'Ž')
    .replace(/&dcroat;/g, 'đ')
    .replace(/&Dcroat;/g, 'Đ')
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export type ScrapedReview = {
  name: string
  stars: number
  text: string
  source: string
  sourceUrl: string
  country?: string | null
}

function normalizeKey(name: string, text: string): string {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const cleanText = text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 50)
  return `${cleanName}:::${cleanText}`
}

export async function scrapeAllReviews(): Promise<ScrapedReview[]> {
  const results: ScrapedReview[] = []

  // 1. Scrape Adriatic Luxury Villas
  try {
    const alvUrl = 'https://www.adriaticluxuryvillas.com/hr/vile/dalmacija/sibenik/vila-san-antonio'
    const alvHtml = await fetchUrl(alvUrl)
    const alvRevIdx = alvHtml.indexOf('id="reviews"')
    if (alvRevIdx !== -1) {
      const alvSection = alvHtml.slice(alvRevIdx, alvRevIdx + 25000)
      const alvItemRegex =
        /<div class="content">\s*<h4>([^<]+)<span class="rating-star stars-(\d+)"><\/span><\/h4>\s*<p>([\s\S]*?)<\/p>\s*<\/div>/gi
      let match: RegExpExecArray | null
      while ((match = alvItemRegex.exec(alvSection)) !== null) {
        const name = match[1].trim()
        const stars = parseInt(match[2], 10) || 5
        const text = decodeHtml(match[3])
        if (text.length > 5) {
          results.push({
            name,
            stars,
            text,
            source: 'Adriatic Luxury Villas',
            sourceUrl: alvUrl,
          })
        }
      }
    }
  } catch (err) {
    console.error('Error fetching Adriatic Luxury Villas reviews:', err)
  }

  // 2. Scrape MyLuxoria
  try {
    const luxoriaUrl = 'https://www.myluxoria.com/hr/vile-sibenik/villa-san-antonio'
    const luxoriaHtml = await fetchUrl(luxoriaUrl)
    const schemaMatch = luxoriaHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)
    if (schemaMatch) {
      for (const s of schemaMatch) {
        try {
          const clean = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '')
          const json = JSON.parse(clean)
          if (json.review && Array.isArray(json.review)) {
            for (const rev of json.review) {
              const author = rev.author?.name || 'Guest'
              const stars = rev.reviewRating?.ratingValue || 5
              const text = decodeHtml(rev.reviewBody || '')
              if (text.length > 5) {
                let country: string | null = null
                if (text.includes('Germany') || text.includes('Deutschland')) country = 'Germany'
                else if (text.includes('Hrvatska') || text.includes('Croatia')) country = 'Croatia'
                else if (text.includes('Austria') || text.includes('Österreich')) country = 'Austria'

                results.push({
                  name: author,
                  stars: typeof stars === 'number' ? Math.round(stars) : 5,
                  country,
                  text,
                  source: 'MyLuxoria',
                  sourceUrl: luxoriaUrl,
                })
              }
            }
          }
        } catch {}
      }
    }
  } catch (err) {
    console.error('Error fetching MyLuxoria reviews:', err)
  }

  return results
}

export async function syncAndDeduplicateReviews() {
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('--- Starting Reviews Sync & Deduplication ---')

  // Step 1: Scan DB and remove existing duplicates
  const existingRes = await payload.find({
    collection: 'reviews',
    limit: 300,
  })

  const seenDbKeys = new Map<string, number | string>()
  let duplicatesRemoved = 0

  for (const doc of existingRes.docs) {
    // Delete placeholder / invalid reviews
    if (doc.name === 'Villa San Antonio' || !doc.text || doc.text.length < 5) {
      console.log(`[CLEANUP] Removing invalid review ID ${doc.id} (${doc.name})`)
      await payload.delete({ collection: 'reviews', id: doc.id })
      duplicatesRemoved++
      continue
    }

    const key = normalizeKey(doc.name, doc.text)
    if (seenDbKeys.has(key)) {
      console.log(`[DEDUPE] Removing duplicate in DB: ID ${doc.id} (${doc.name})`)
      await payload.delete({ collection: 'reviews', id: doc.id })
      duplicatesRemoved++
    } else {
      seenDbKeys.set(key, doc.id)
    }
  }

  console.log(`[STEP 1 COMPLETE] Removed ${duplicatesRemoved} duplicates/invalid entries from DB.`)

  // Step 2: Scrape latest reviews from sources
  const scraped = await scrapeAllReviews()
  console.log(`[STEP 2] Scraped ${scraped.length} total reviews from online platforms.`)

  // Step 3: Insert new non-duplicate reviews
  let newAdded = 0
  let skippedDuplicates = 0

  for (let i = 0; i < scraped.length; i++) {
    const item = scraped[i]
    const key = normalizeKey(item.name, item.text)

    if (seenDbKeys.has(key)) {
      skippedDuplicates++
      continue
    }

    console.log(`[NEW REVIEW] Adding review from ${item.name} (${item.source})`)
    const created = await payload.create({
      collection: 'reviews',
      data: {
        name: item.name,
        country: item.country || null,
        stars: item.stars || 5,
        text: item.text,
        source: item.source,
        sourceUrl: item.sourceUrl,
        sortOrder: (existingRes.totalDocs || 0) + newAdded + 10,
      },
    })

    seenDbKeys.set(key, created.id)
    newAdded++
  }

  const finalRes = await payload.find({
    collection: 'reviews',
    limit: 300,
  })

  const summary = {
    scrapedTotal: scraped.length,
    skippedDuplicates,
    duplicatesRemovedFromDb: duplicatesRemoved,
    newAddedToDb: newAdded,
    totalCleanReviewsInDb: finalRes.totalDocs,
  }

  console.log('--- Review Sync Finished ---')
  console.table(summary)
  return summary
}

// Direct execution from CLI
if (process.argv[1]?.endsWith('syncReviews.ts') || process.argv[1]?.endsWith('syncReviews.js')) {
  syncAndDeduplicateReviews()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal sync error:', err)
      process.exit(1)
    })
}
