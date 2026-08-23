import path from 'node:path'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function clean() {
  const { default: config } = await import('../payload.config')
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config })

  const allReviews = await payload.find({
    collection: 'reviews',
    limit: 100,
  })

  console.log('Total reviews before cleanup:', allReviews.totalDocs)

  for (const doc of allReviews.docs) {
    // If it's a test review with name "Villa San Antonio" or empty text, delete it
    if (doc.name === 'Villa San Antonio' || !doc.text || doc.text.length < 5) {
      console.log('Deleting placeholder review:', doc.id, doc.name)
      await payload.delete({
        collection: 'reviews',
        id: doc.id,
      })
      continue
    }

    // Ensure 5 stars for authentic verified reviews
    if (doc.stars !== 5) {
      console.log('Updating stars to 5 for:', doc.name)
      await payload.update({
        collection: 'reviews',
        id: doc.id,
        data: {
          stars: 5,
        },
      })
    }

    // Format clean sources
    let cleanSource = doc.source || 'Verified Guest'
    if (cleanSource.includes('adriaticluxuryvillas')) cleanSource = 'Adriatic Luxury Villas'
    if (cleanSource.includes('myluxoria') || cleanSource.includes('MyLuxoria')) cleanSource = 'MyLuxoria'

    if (cleanSource !== doc.source) {
      console.log('Updating source for:', doc.name, cleanSource)
      await payload.update({
        collection: 'reviews',
        id: doc.id,
        data: {
          source: cleanSource,
        },
      })
    }
  }

  const remaining = await payload.find({
    collection: 'reviews',
    limit: 100,
  })

  console.log('Total clean verified reviews in database:', remaining.totalDocs)
  process.exit(0)
}

clean().catch(console.error)
