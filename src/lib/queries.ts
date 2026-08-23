import { getPayload } from 'payload'

import type { FaqItem, GalleryImage, Media, Page, Review, SiteSetting } from '@/payload-types'
import config from '@/payload.config'

export const getPayloadClient = () => getPayload({ config })

export type NavItem = {
  href: string
  label: string
}

export async function getNavPages(): Promise<NavItem[]> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        includeInNav: {
          equals: true,
        },
      },
      sort: 'navOrder',
      limit: 50,
      depth: 0,
    })

    if (!docs || docs.length === 0) return []

    return docs.map((doc) => {
      const p = doc as unknown as { slug: string; title: string; navLabel?: string | null }
      return {
        href: `/${p.slug === 'home' ? '' : p.slug}`,
        label: p.navLabel?.trim() || p.title,
      }
    })
  } catch {
    return []
  }
}

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

export async function getSettings(): Promise<SiteSetting | null> {
  const payload = await getPayloadClient()
  try {
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

export async function getFaqItems(): Promise<FaqItem[]> {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'faq-items',
      limit: 50,
      sort: 'sortOrder',
      depth: 0,
    })
    return docs as FaqItem[]
  } catch {
    return []
  }
}

export type GalleryEntry = GalleryImage & { image: Media }

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

export { gallerySrc, mediaAlt, mediaSrc, type GalleryEntryLike } from './media'
