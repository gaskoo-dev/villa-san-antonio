import type { CollectionConfig } from 'payload'

import { adminWrite } from '@/access'

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
    // Public submissions go through the validated Server Action. Keeping the
    // collection private prevents direct REST/GraphQL spam writes.
    create: adminWrite,
    update: adminWrite,
    delete: adminWrite,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, maxLength: 120 },
        { name: 'email', type: 'email', required: true },
      ],
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      maxLength: 200,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 5000,
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
      ({ data, operation }) => {
        if (operation === 'create' && data && typeof data === 'object') {
          delete data.status
        }
        return data
      },
    ],
  },
}
