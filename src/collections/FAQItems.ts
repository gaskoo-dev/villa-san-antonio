import type { CollectionConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'
import { revalidateCollectionPaths } from '@/hooks/revalidate'

const faqRevalidation = revalidateCollectionPaths(['/', '/faq'])

export const FAQItems: CollectionConfig = {
  slug: 'faq-items',
  labels: {
    singular: 'FAQ Item',
    plural: 'FAQ Items',
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'sortOrder'],
    group: 'FAQ',
  },
  access: {
    read: publicRead,
    create: adminWrite,
    update: adminWrite,
    delete: adminWrite,
  },
  defaultSort: 'sortOrder',
  hooks: {
    afterChange: [faqRevalidation.afterChange],
    afterDelete: [faqRevalidation.afterDelete],
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'faq-categories',
      label: 'Category',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
