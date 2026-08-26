import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/content'
import { getPayloadClient } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 100,
    sort: 'slug',
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  return docs.map((page) => {
    const pathname = page.slug === 'home' ? '' : `/${page.slug}`
    return {
      url: `${SITE_URL}${pathname}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: page.slug === 'home' ? 'weekly' : 'monthly',
      priority: page.slug === 'home' ? 1 : 0.8,
    }
  })
}
