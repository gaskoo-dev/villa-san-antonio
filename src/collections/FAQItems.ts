import type { CollectionConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'

export const FAQItems: CollectionConfig = {
  slug: 'faq-items',
  labels: {
    singular: 'FAQ Item',
    plural: 'FAQ Items',
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'sortOrder'],
    group: 'Content',
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
      type: 'select',
      defaultValue: 'stay',
      options: [
        { label: 'Arrival & Stay', value: 'stay' },
        { label: 'Pool & Amenities', value: 'pool' },
        { label: 'Booking & Payment', value: 'booking' },
        { label: 'House Rules & Pets', value: 'rules' },
      ],
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
