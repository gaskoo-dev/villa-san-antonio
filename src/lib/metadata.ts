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

  const absoluteImageUrl = imageUrl
    ? imageUrl.startsWith('http://') || imageUrl.startsWith('https://')
      ? imageUrl
      : new URL(imageUrl, SITE_URL).toString()
    : null

  const ogImages = absoluteImageUrl
    ? [
        {
          url: absoluteImageUrl,
          width: metaImage?.width ?? 1920,
          height: metaImage?.height ?? 1438,
          alt: metaImage?.alt || cmsTitle || 'Villa San Antonio',
          type: metaImage?.mimeType || 'image/jpeg',
        },
      ]
    : fallback.openGraph?.images

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
      images: ogImages,
    },
    twitter: {
      ...fallback.twitter,
      card: absoluteImageUrl ? 'summary_large_image' : 'summary',
      title: cmsTitle || undefined,
      description: typeof description === 'string' ? description : undefined,
      images: absoluteImageUrl ? [absoluteImageUrl] : fallback.twitter?.images,
    },
  }
}
