import type { CollectionConfig } from 'payload'

import { adminWrite, anyoneCanCreate } from '@/access'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: {
    singular: 'Contact Message',
    plural: 'Contact Messages',
  },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['name', 'email', 'subject', 'status', 'createdAt'],
    group: 'Inbox',
  },
  access: {
    read: adminWrite,
    create: anyoneCanCreate,
    update: adminWrite,
    delete: adminWrite,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
      ],
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'consent',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        description: 'The sender agreed to personal data processing',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['new', 'handled', 'archived'],
      defaultValue: 'new',
      admin: {
        position: 'sidebar',
      },
      access: {
        create: () => false,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && typeof data === 'object') {
          delete data.status
        }
        return data
      },
    ],
  },
}
