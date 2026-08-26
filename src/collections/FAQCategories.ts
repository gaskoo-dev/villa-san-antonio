import type { CollectionConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateCollectionPaths } from '@/hooks/revalidate'

const faqCategoryRevalidation = revalidateCollectionPaths(['/faq'])

export const FAQCategories: CollectionConfig = {
  slug: 'faq-categories',
  labels: {
    singular: 'FAQ Category',
    plural: 'FAQ Categories',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    group: 'FAQ',
    pagination: {
      defaultLimit: 50,
    },
    description:
      'Categories shown as filters on the FAQ page. Drag rows to change their frontend order.',
  },
  access: {
    read: publicRead,
    create: adminWrite,
    update: adminWrite,
    delete: adminWrite,
  },
  orderable: true,
  defaultSort: '_order',
  hooks: {
    afterChange: [faqCategoryRevalidation.afterChange],
    afterDelete: [faqCategoryRevalidation.afterDelete],
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
        hidden: true,
      },
    },
  ],
}
