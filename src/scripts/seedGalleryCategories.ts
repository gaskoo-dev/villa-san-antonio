import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const DEFAULT_CATEGORIES = [
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

async function seedGalleryCategories() {
  console.log('🌱 Seeding Gallery Categories...')
  const payload = await getPayload({ config })

  const createdCategories: Record<string, number> = {}

  for (const cat of DEFAULT_CATEGORIES) {
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
      console.log(`  ✓ Category already exists: "${cat.name}"`)
      createdCategories[cat.slug] = existing.docs[0].id
    } else {
      const doc = await payload.create({
        collection: 'gallery-categories',
        data: cat,
      })
      console.log(`  + Created Category: "${cat.name}" (ID: ${doc.id})`)
      createdCategories[cat.slug] = doc.id
    }
  }

  // Optionally assign unassigned gallery images to the default category (Exterior & Pool)
  const images = await payload.find({
    collection: 'gallery-images',
    limit: 300,
    depth: 0,
  })

  console.log(`Found ${images.docs.length} gallery images. Categorizing unassigned images...`)
  let updatedCount = 0

  for (const img of images.docs) {
    if (!img.category) {
      // Determine category based on alt text or filename if possible
      const alt = (img.alt || '').toLowerCase()
      let targetCategoryId = createdCategories['exterior-pool']

      if (alt.includes('bed') || alt.includes('room') || alt.includes('interior') || alt.includes('bath') || alt.includes('kitchen') || alt.includes('living')) {
        targetCategoryId = createdCategories['interior-bedrooms']
      } else if (alt.includes('bbq') || alt.includes('grill') || alt.includes('dining') || alt.includes('tavern') || alt.includes('konoba')) {
        targetCategoryId = createdCategories['bbq-dining']
      } else if (alt.includes('sunset') || alt.includes('view') || alt.includes('hill') || alt.includes('landscape') || alt.includes('nature') || alt.includes('dalmatia')) {
        targetCategoryId = createdCategories['surroundings-views']
      }

      await payload.update({
        collection: 'gallery-images',
        id: img.id,
        data: {
          category: targetCategoryId,
        },
      })
      updatedCount++
    }
  }

  console.log(`✅ Seeded Gallery Categories and categorized ${updatedCount} images!`)
  process.exit(0)
}

seedGalleryCategories().catch((err) => {
  console.error('❌ Error seeding Gallery Categories:', err)
  process.exit(1)
})
