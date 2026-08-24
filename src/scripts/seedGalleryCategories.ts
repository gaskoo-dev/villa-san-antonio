import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const CATEGORIES_DATA = [
  {
    name: 'Exterior & Pool',
    slug: 'exterior-pool',
    sortOrder: 1,
  },
  {
    name: 'Interior & Bedrooms',
    slug: 'interior-bedrooms',
    sortOrder: 2,
  },
  {
    name: 'BBQ House & Dining',
    slug: 'bbq-dining',
    sortOrder: 3,
  },
  {
    name: 'Karst & Sunset Views',
    slug: 'surroundings-views',
    sortOrder: 4,
  },
]

async function seedAndCategorizeGallery() {
  console.log('🌱 Ensuring Gallery Categories and categorizing all 92 images...')
  const payload = await getPayload({ config })

  const categoryMap: Record<string, number> = {}

  // 1. Ensure categories exist
  for (const cat of CATEGORIES_DATA) {
    const existing = await payload.find({
      collection: 'gallery-categories',
      where: {
        slug: {
          equals: cat.slug,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      categoryMap[cat.slug] = existing.docs[0].id
    } else {
      const doc = await payload.create({
        collection: 'gallery-categories',
        data: cat,
      })
      categoryMap[cat.slug] = doc.id
    }
  }

  console.log('Categories Map:', categoryMap)

  // 2. Fetch all gallery images
  const galleryDocs = await payload.find({
    collection: 'gallery-images',
    limit: 300,
    depth: 1,
  })

  console.log(`Found ${galleryDocs.docs.length} gallery images to categorize...`)

  let updated = 0
  for (const img of galleryDocs.docs) {
    const media = typeof img.image === 'object' && img.image ? img.image : null
    const filename = media?.filename || ''
    const numMatch = filename.match(/villa-san-antonio-sibenik-(\d+)/)
    const num = numMatch ? parseInt(numMatch[1], 10) : null

    let targetCatSlug = 'exterior-pool'

    if (num !== null) {
      if (num >= 1 && num <= 30) {
        targetCatSlug = 'exterior-pool'
      } else if (num >= 31 && num <= 65) {
        targetCatSlug = 'interior-bedrooms'
      } else if (num >= 66 && num <= 80) {
        targetCatSlug = 'bbq-dining'
      } else {
        targetCatSlug = 'surroundings-views'
      }
    } else if (filename.startsWith('DSC')) {
      targetCatSlug = 'surroundings-views'
    }

    const targetCategoryId = categoryMap[targetCatSlug]

    await payload.update({
      collection: 'gallery-images',
      id: img.id,
      data: {
        category: targetCategoryId,
      },
    })
    updated++
  }

  console.log(`✅ Successfully updated category for all ${updated} gallery images!`)
  process.exit(0)
}

seedAndCategorizeGallery().catch((err) => {
  console.error('❌ Error categorizing gallery images:', err)
  process.exit(1)
})
