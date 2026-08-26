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

export type CMSLocale = 'en' | 'de' | 'hr'

export const getPayloadClient = () => getPayload({ config })

export async function getPageBySlug(slug: string, locale: CMSLocale = 'en'): Promise<Page | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    locale,
    fallbackLocale: 'en',
    limit: 1,
    depth: 2,
  })
  return (docs[0] as Page) || null
}

export async function getHeader(locale: CMSLocale = 'en'): Promise<Header> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'header', locale, fallbackLocale: 'en', depth: 1 })
}

export async function getFooter(locale: CMSLocale = 'en'): Promise<Footer> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'footer', locale, fallbackLocale: 'en', depth: 1 })
}

export async function getSettings(): Promise<SiteSetting> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 0 })
}

export async function getReviews(limit = 30): Promise<Review[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'reviews',
    limit,
    sort: '_order',
    depth: 0,
  })
  return docs as Review[]
}

export async function getFaqCategories(locale: CMSLocale = 'en'): Promise<FaqCategory[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'faq-categories',
    locale,
    fallbackLocale: 'en',
    limit: 50,
    sort: '_order',
    depth: 0,
  })
  return docs as FaqCategory[]
}

export async function getFaqItems(locale: CMSLocale = 'en'): Promise<FaqItem[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'faq-items',
    locale,
    fallbackLocale: 'en',
    limit: 50,
    sort: '_order',
    depth: 1,
  })
  return docs as FaqItem[]
}

export async function getGalleryCategories(locale: CMSLocale = 'en'): Promise<GalleryCategory[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'gallery-categories',
    locale,
    fallbackLocale: 'en',
    limit: 50,
    sort: '_order',
    depth: 0,
  })
  return docs as GalleryCategory[]
}

export type GalleryEntry = GalleryImage & {
  image: Media
  category?: GalleryCategory | number | null
}

export async function getGallery(
  limit = 200,
  locale: CMSLocale = 'en',
): Promise<GalleryEntry[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'gallery-images',
    locale,
    fallbackLocale: 'en',
    limit,
    sort: '_order',
    depth: 1,
  })
  return docs.filter((doc) => typeof doc.image !== 'number' && doc.image) as GalleryEntry[]
}

export async function getDiscoverItems(locale: CMSLocale = 'en'): Promise<ExperienceItem[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'discover-posts',
    locale,
    fallbackLocale: 'en',
    limit: 100,
    sort: '_order',
    depth: 2,
  })

  return docs.map((doc) => ({
    ...doc,
    category: doc.categoryRef,
  })) as unknown as ExperienceItem[]
}

export async function getDiscoverCategories(
  locale: CMSLocale = 'en',
): Promise<DiscoverCategoryItem[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'discover-categories',
    locale,
    fallbackLocale: 'en',
    limit: 100,
    sort: '_order',
    depth: 0,
  })
  return docs as DiscoverCategoryItem[]
}

export async function getDrives(locale: CMSLocale = 'en'): Promise<DestinationItem[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'drives-distances',
    locale,
    fallbackLocale: 'en',
    limit: 100,
    sort: '_order',
    depth: 0,
  })
  return docs as unknown as DestinationItem[]
}

export { gallerySrc, mediaAlt, mediaSrc, type GalleryEntryLike } from './media'
