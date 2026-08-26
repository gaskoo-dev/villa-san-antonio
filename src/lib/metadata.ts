import type { Metadata } from 'next'

import { SITE_URL } from '@/lib/content'
import { mediaSrc } from '@/lib/media'
import type { Media, Page } from '@/payload-types'

export function buildPageMetadata(
  page: Page | null,
  fallback: Metadata,
  pathname: string,
): Metadata {
  const cmsTitle = page?.meta?.title?.trim()
  const description = page?.meta?.description?.trim() || fallback.description
  const metaImage =
    page?.meta?.image && typeof page.meta.image === 'object'
      ? (page.meta.image as Media)
      : null
  const imageUrl = metaImage ? mediaSrc(metaImage, 'desktop') || mediaSrc(metaImage) : null
  const canonical = new URL(pathname || '/', SITE_URL).toString()

  return {
    ...fallback,
    title: cmsTitle ? { absolute: cmsTitle } : fallback.title,
    description,
    alternates: {
      ...fallback.alternates,
      canonical,
    },
    openGraph: {
      ...fallback.openGraph,
      title: cmsTitle || undefined,
      description: typeof description === 'string' ? description : undefined,
      url: canonical,
      images: imageUrl
        ? [{ url: imageUrl, alt: metaImage?.alt || cmsTitle || 'Villa San Antonio' }]
        : fallback.openGraph?.images,
    },
    twitter: {
      ...fallback.twitter,
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: cmsTitle || undefined,
      description: typeof description === 'string' ? description : undefined,
      images: imageUrl ? [imageUrl] : fallback.twitter?.images,
    },
  }
}
