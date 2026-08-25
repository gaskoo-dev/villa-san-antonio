import type { CollectionConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'
import { slugField } from '@/fields/slug'

export const DiscoverCategories: CollectionConfig = {
  slug: 'discover-categories',
  labels: {
    singular: 'Discover Category',
    plural: 'Discover Categories',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    group: 'Discover',
    pagination: {
      defaultLimit: 50,
    },
    description:
      'Categories shown as filters on the Discover page. Drag rows to change their frontend order.',
  },
  access: {
    read: publicRead,
    create: adminWrite,
    update: adminWrite,
    delete: adminWrite,
  },
  orderable: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Category Name',
      required: true,
    },
    slugField('name', {
      label: 'Category Slug',
      admin: {
        description: 'Used as the frontend filter identifier.',
      },
    }),
  ],
}
