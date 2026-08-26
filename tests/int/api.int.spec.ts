import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'

import { beforeAll, describe, expect, it } from 'vitest'

import type { DiscoverPost } from '@/payload-types'

let payload: Payload
let categoryID: number

const richText = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'CMS integration content', version: 1 }],
        direction: null,
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
} as unknown as DiscoverPost['desc']

describe('Payload CMS integration', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })

    const category = await payload.create({
      collection: 'discover-categories',
      locale: 'en',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: { name: 'Integration Category', slug: 'integration-category' },
    })
    categoryID = category.id

    await Promise.all([
      payload.create({
        collection: 'discover-posts',
        locale: 'en',
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: {
          title: 'Integration Discover Post',
          categoryRef: category.id,
          desc: richText,
          images: [],
        },
      }),
      payload.create({
        collection: 'drives-distances',
        locale: 'en',
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: {
          name: 'Integration Destination',
          distance: '18 km',
          driveTime: '18 min',
        },
      }),
    ])
  }, 30_000)

  it('stores and returns localized page and SEO content', async () => {
    const page = await payload.create({
      collection: 'pages',
      locale: 'en',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        title: 'Integration Page',
        slug: 'integration-page',
        layout: [],
        meta: {
          title: 'Integration SEO Title',
          description: 'Integration SEO Description',
        },
      },
    })

    await payload.update({
      collection: 'pages',
      id: page.id,
      locale: 'de',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: { title: 'Integrationsseite' },
    })

    const [english, german] = await Promise.all([
      payload.findByID({ collection: 'pages', id: page.id, locale: 'en' }),
      payload.findByID({ collection: 'pages', id: page.id, locale: 'de' }),
    ])

    expect(english.title).toBe('Integration Page')
    expect(english.meta?.title).toBe('Integration SEO Title')
    expect(german.title).toBe('Integrationsseite')
    expect(german.slug).toBe('integration-page')
  })

  it('returns CMS-driven Discover relationships and ordering fields', async () => {
    const [categories, posts, drives] = await Promise.all([
      payload.find({ collection: 'discover-categories', locale: 'en', sort: '_order', depth: 0 }),
      payload.find({ collection: 'discover-posts', locale: 'en', sort: '_order', depth: 1 }),
      payload.find({ collection: 'drives-distances', locale: 'en', sort: '_order', depth: 0 }),
    ])

    expect(categories.docs[0]?.id).toBe(categoryID)
    expect(posts.docs[0]?.title).toBe('Integration Discover Post')
    expect(typeof posts.docs[0]?.categoryRef).toBe('object')
    expect(drives.docs[0]?.name).toBe('Integration Destination')
    expect(posts.docs[0]?._order).toBeTruthy()
  })

  it('denies anonymous direct writes to private inbox collections', async () => {
    await expect(
      payload.create({
        collection: 'booking-inquiries',
        overrideAccess: false,
        data: {
          firstName: 'Blocked',
          lastName: 'Request',
          email: 'blocked@example.com',
          checkIn: '2030-01-01',
          checkOut: '2030-01-05',
          adults: 2,
          pets: 'no',
        },
      }),
    ).rejects.toThrow()

    await expect(
      payload.create({
        collection: 'contact-messages',
        overrideAccess: false,
        data: {
          name: 'Blocked',
          email: 'blocked@example.com',
          subject: 'Blocked request',
          message: 'This must never be stored.',
          consent: true,
        },
      }),
    ).rejects.toThrow()
  })
})
