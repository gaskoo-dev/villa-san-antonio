import type { CollectionConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'stars', 'source', 'sortOrder'],
    group: 'Reviews',
  },
  access: {
    read: publicRead,
    create: adminWrite,
    update: adminWrite,
    delete: adminWrite,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Guest name',
    },
    {
      name: 'country',
      type: 'text',
    },
    {
      name: 'stars',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: {
        description: 'Guest rating from 1 to 5',
      },
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
      label: 'Review text',
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'e.g. adriaticluxuryvillas.com',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: {
        description: 'Link to the original review',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first',
      },
    },
  ],
}
