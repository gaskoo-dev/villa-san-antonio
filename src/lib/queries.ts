import { getPayload } from 'payload'

import type {
  DestinationItem,
  DiscoverCategoryItem,
  ExperienceItem,
} from '@/components/DiscoverExperiences'
import type {
  FaqCategory,
  FaqItem,
  Footer,
  GalleryCategory,
  GalleryImage,
  Header,
  Media,
  Page,
  Review,
  SiteSetting,
} from '@/payload-types'
import config from '@/payload.config'

export const getPayloadClient = () => getPayload({ config })

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const payload = await getPayloadClient()
  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 2,
    })
    return (docs[0] as Page) || null
  } catch {
    return null
  }
}

export async function getHeader(): Promise<Header | null> {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'header', depth: 1 })
  } catch {
    return null
  }
}

export async function getFooter(): Promise<Footer | null> {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'footer', depth: 1 })
  } catch {
    return null
  }
}

export async function getSettings(): Promise<SiteSetting | null> {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  } catch {
    return null
  }
}

export async function getReviews(limit = 30): Promise<Review[]> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'reviews',
      limit,
      sort: 'sortOrder',
      depth: 0,
    })
    return docs as Review[]
  } catch {
    return []
  }
}

export async function getFaqCategories(): Promise<FaqCategory[]> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'faq-categories',
      limit: 50,
      sort: 'sortOrder',
      depth: 0,
    })
    return docs as FaqCategory[]
  } catch {
    return []
  }
}

export async function getFaqItems(): Promise<FaqItem[]> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'faq-items',
      limit: 50,
      sort: 'sortOrder',
      depth: 1,
    })
    return docs as FaqItem[]
  } catch {
    return []
  }
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'gallery-categories',
      limit: 50,
      sort: 'sortOrder',
      depth: 0,
    })
    return docs as GalleryCategory[]
  } catch {
    return []
  }
}

export type GalleryEntry = GalleryImage & {
  image: Media
  category?: GalleryCategory | number | null
}

export async function getGallery(limit = 200): Promise<GalleryEntry[]> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'gallery-images',
      limit,
      sort: 'sortOrder',
      depth: 1,
    })
    return docs.filter((d) => typeof d.image !== 'number' && d.image) as GalleryEntry[]
  } catch {
    return []
  }
}

export async function getDiscoverItems(): Promise<ExperienceItem[]> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'discover-posts',
      limit: 100,
      sort: '_order',
      depth: 2,
    })
    if (docs.length > 0) {
      return docs.map((doc) => ({
        ...doc,
        category: doc.categoryRef,
      })) as unknown as ExperienceItem[]
    }
  } catch {}

  return []
}

export async function getDiscoverCategories(): Promise<DiscoverCategoryItem[]> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'discover-categories',
      limit: 100,
      sort: '_order',
      depth: 0,
    })
    return docs as DiscoverCategoryItem[]
  } catch {
    return []
  }
}

export async function getDrives(): Promise<DestinationItem[]> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'drives-distances',
      limit: 100,
      sort: '_order',
      depth: 0,
    })
    if (docs.length > 0) {
      return docs as unknown as DestinationItem[]
    }
  } catch {}

  return []
}

export { gallerySrc, mediaAlt, mediaSrc, type GalleryEntryLike } from './media'
