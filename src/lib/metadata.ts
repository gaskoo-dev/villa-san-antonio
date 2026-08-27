import type { Metadata } from 'next'

import { SITE_URL } from '@/lib/content'
import type { Media, Page } from '@/payload-types'

export const DEFAULT_SOCIAL_IMAGE = {
  url: new URL('/branding/social-preview.jpg', SITE_URL).toString(),
  width: 1200,
  height: 630,
  alt: 'Villa San Antonio · Private pool villa near Šibenik, Dalmatia',
  type: 'image/jpeg',
} as const

export const DEFAULT_OPEN_GRAPH = {
  siteName: 'Villa San Antonio',
  type: 'website' as const,
  locale: 'en_GB',
  images: [DEFAULT_SOCIAL_IMAGE],
}

export const DEFAULT_TWITTER = {
  card: 'summary_large_image' as const,
  images: [DEFAULT_SOCIAL_IMAGE.url],
}

function clampMetaDescription(value: Metadata['description']): Metadata['description'] {
  if (typeof value !== 'string' || value.length <= 160) return value

  const candidate = value.slice(0, 157).trimEnd()
  const lastWordBoundary = candidate.lastIndexOf(' ')
  const trimmed = lastWordBoundary >= 140 ? candidate.slice(0, lastWordBoundary) : candidate
  return `${trimmed}…`
}

export function buildPageMetadata(
  page: Page | null,
  fallback: Metadata,
  pathname: string,
): Metadata {
  const cmsTitle = page?.meta?.title?.trim()
  const description = clampMetaDescription(
    page?.meta?.description?.trim() || fallback.description,
  )
  const metaImage =
    page?.meta?.image && typeof page.meta.image === 'object'
      ? (page.meta.image as Media)
      : null
  const rendition = metaImage?.sizes?.desktop?.url
    ? metaImage.sizes.desktop
    : metaImage?.sizes?.tablet?.url
      ? metaImage.sizes.tablet
      : null
  const imageUrl = rendition?.url || metaImage?.url
  const canonical = new URL(pathname || '/', SITE_URL).toString()

  const absoluteImage = imageUrl ? new URL(imageUrl, SITE_URL) : null
  if (absoluteImage && metaImage?.updatedAt) {
    absoluteImage.searchParams.set('v', String(Date.parse(metaImage.updatedAt)))
  }
  const absoluteImageUrl = absoluteImage?.toString() || null

  const ogImages = absoluteImageUrl
    ? [
        {
          url: absoluteImageUrl,
          width: rendition?.width ?? metaImage?.width ?? 1200,
          height: rendition?.height ?? metaImage?.height ?? 630,
          alt: metaImage?.alt || cmsTitle || 'Villa San Antonio',
          type: rendition?.mimeType || metaImage?.mimeType || 'image/jpeg',
        },
      ]
    : fallback.openGraph?.images || DEFAULT_OPEN_GRAPH.images

  const twitterImages = absoluteImageUrl
    ? [absoluteImageUrl]
    : fallback.twitter?.images || DEFAULT_TWITTER.images

  return {
    ...fallback,
    title: cmsTitle ? { absolute: cmsTitle } : fallback.title,
    description,
    alternates: {
      ...fallback.alternates,
      canonical,
    },
    openGraph: {
      ...DEFAULT_OPEN_GRAPH,
      ...fallback.openGraph,
      title: cmsTitle || undefined,
      description: typeof description === 'string' ? description : undefined,
      url: canonical,
      images: ogImages,
    },
    twitter: {
      ...DEFAULT_TWITTER,
      ...fallback.twitter,
      card: 'summary_large_image',
      title: cmsTitle || undefined,
      description: typeof description === 'string' ? description : undefined,
      images: twitterImages,
    },
  }
}
