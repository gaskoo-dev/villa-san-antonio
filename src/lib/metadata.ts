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
  const desktopImage = metaImage?.sizes?.desktop
  const usesDesktopImage = Boolean(desktopImage?.url)
  const imageUrl = usesDesktopImage ? desktopImage?.url : metaImage?.url
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
          width: (usesDesktopImage ? desktopImage?.width : metaImage?.width) ?? 1920,
          height: (usesDesktopImage ? desktopImage?.height : metaImage?.height) ?? 1438,
          alt: metaImage?.alt || cmsTitle || 'Villa San Antonio',
          type: metaImage?.mimeType || 'image/jpeg',
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
