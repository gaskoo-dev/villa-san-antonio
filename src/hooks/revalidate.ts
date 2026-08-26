import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

export const PUBLIC_PATHS = [
  '/',
  '/about-villa',
  '/booking',
  '/contact-us',
  '/discover',
  '/faq',
  '/gallery',
] as const

function revalidate(paths: readonly string[], context: Record<string, unknown>, log: (message: string) => void) {
  if (context.disableRevalidate) return

  for (const path of new Set(paths)) {
    revalidatePath(path)
  }
  log(`Revalidated frontend paths: ${paths.join(', ')}`)
}

export const revalidatePageAfterChange: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req,
}) => {
  const paths: string[] = []
  const slug = typeof doc.slug === 'string' ? doc.slug : ''
  const previousSlug = typeof previousDoc?.slug === 'string' ? previousDoc.slug : ''

  if (slug) paths.push(slug === 'home' ? '/' : `/${slug}`)
  if (previousSlug && previousSlug !== slug) {
    paths.push(previousSlug === 'home' ? '/' : `/${previousSlug}`)
  }

  revalidate(paths, req.context, (message) => req.payload.logger.info(message))
  return doc
}

export const revalidatePageAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  const slug = typeof doc?.slug === 'string' ? doc.slug : ''
  if (slug) {
    revalidate([slug === 'home' ? '/' : `/${slug}`], req.context, (message) =>
      req.payload.logger.info(message),
    )
  }
  return doc
}

export function revalidateCollectionPaths(paths: readonly string[]) {
  const afterChange: CollectionAfterChangeHook = ({ doc, req }) => {
    revalidate(paths, req.context, (message) => req.payload.logger.info(message))
    return doc
  }
  const afterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
    revalidate(paths, req.context, (message) => req.payload.logger.info(message))
    return doc
  }

  return { afterChange, afterDelete }
}

export function revalidateGlobalPaths(paths: readonly string[]): GlobalAfterChangeHook {
  return ({ doc, req }) => {
    revalidate(paths, req.context, (message) => req.payload.logger.info(message))
    return doc
  }
}
