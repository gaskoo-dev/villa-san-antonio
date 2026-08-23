import type { Media } from '@/payload-types'

export type GalleryEntryLike = {
  id?: string | number | null
  image: Media | number | string
  caption?: string | null
  alt?: string | null
  featured?: boolean | null
}

export function mediaAlt(entry: { alt?: string | null; image?: Media | number | string | null }): string {
  if (!entry) return ''
  if (entry.alt) return entry.alt
  if (typeof entry.image === 'object' && entry.image && 'alt' in entry.image && entry.image.alt) {
    return entry.image.alt
  }
  return ''
}

export function mediaSrc(
  image?: Media | null,
  size: 'desktop' | 'tablet' | 'thumbnail' = 'desktop',
): string | null {
  if (!image) return null
  const sized = image.sizes?.[size]?.url
  return sized || image.url || null
}

export function gallerySrc(entry: GalleryEntryLike, size: 'desktop' | 'tablet' | 'thumbnail' = 'desktop'): string {
  if (!entry) return ''
  if (typeof entry.image === 'object' && entry.image) {
    return mediaSrc(entry.image as Media, size) ?? (entry.image as Media).url ?? ''
  }
  if (typeof entry.image === 'string') {
    return entry.image
  }
  return ''
}
