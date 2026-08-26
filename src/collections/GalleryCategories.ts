import type { CollectionConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateCollectionPaths } from '@/hooks/revalidate'

const galleryCategoryRevalidation = revalidateCollectionPaths(['/gallery'])

export const GalleryCategories: CollectionConfig = {
  slug: 'gallery-categories',
  labels: {
    singular: 'Gallery Category',
    plural: 'Gallery Categories',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sortOrder'],
    group: 'Gallery',
  },
  access: {
    read: publicRead,
    create: adminWrite,
    update: adminWrite,
    delete: adminWrite,
  },
  defaultSort: 'sortOrder',
  hooks: {
    afterChange: [galleryCategoryRevalidation.afterChange],
    afterDelete: [galleryCategoryRevalidation.afterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Category Name',
    },
    slugField('name', {
      label: 'Category Slug (Identifier)',
      admin: {
        description: 'URL-friendly identifier (auto-generated from Name, click Unlock to edit)',
      },
    }),
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
