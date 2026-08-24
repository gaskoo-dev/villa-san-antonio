import type { CollectionConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'

export const FAQCategories: CollectionConfig = {
  slug: 'faq-categories',
  labels: {
    singular: 'FAQ Category',
    plural: 'FAQ Categories',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sortOrder'],
    group: 'FAQ',
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
      label: 'Category Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Category Slug (Identifier)',
      admin: {
        description: 'URL-friendly identifier (e.g. stay, pool, booking, rules)',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 100,
      label: 'Display Order',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
