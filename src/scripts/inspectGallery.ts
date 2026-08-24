import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function inspectImages() {
  const payload = await getPayload({ config })
  const images = await payload.find({
    collection: 'gallery-images',
    limit: 300,
    depth: 1,
  })

  for (const img of images.docs) {
    const media = typeof img.image === 'object' && img.image ? img.image : null
    const filename = media?.filename || ''
    const alt = img.alt || media?.alt || ''
    console.log(`ID: ${img.id} | Filename: ${filename} | Alt: ${alt}`)
  }

  process.exit(0)
}

inspectImages()
