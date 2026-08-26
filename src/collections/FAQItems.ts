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
    defaultColumns: ['question', 'category', 'updatedAt'],
    group: 'FAQ',
    pagination: {
      defaultLimit: 50,
    },
    description: 'Drag rows to change the order in which FAQ items appear on the website.',
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
        hidden: true,
      },
    },
  ],
}
