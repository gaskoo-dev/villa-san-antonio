import type { CollectionConfig } from 'payload'

import { adminWrite } from '@/access'
import { sendContactMessageNotification } from '@/hooks/sendInquiryNotification'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: {
    singular: 'Contact Message',
    plural: 'Contact Messages',
  },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'name', 'email', 'status', 'createdAt'],
    group: 'Inbox',
    pagination: {
      defaultLimit: 50,
    },
    description: 'Contact form submissions with sender details, status, and received date.',
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
      type: 'collapsible',
      label: 'Sender details',
      admin: {
        className:
          'booking-inquiry-section booking-inquiry-section--guest contact-message-section contact-message-section--sender',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              maxLength: 120,
              admin: {
                components: {
                  Field:
                    '@/components/admin/LockableBookingFields#LockableTextField',
                },
              },
            },
            {
              name: 'email',
              type: 'email',
              required: true,
              admin: {
                components: {
                  Field:
                    '@/components/admin/LockableBookingFields#LockableEmailField',
                },
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Message details',
      admin: {
        className:
          'booking-inquiry-section booking-inquiry-section--request contact-message-section contact-message-section--message',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'subject',
          type: 'text',
          required: true,
          maxLength: 200,
          admin: {
            components: {
              Field:
                '@/components/admin/LockableBookingFields#LockableTextField',
            },
          },
        },
        {
          name: 'message',
          type: 'textarea',
          required: true,
          maxLength: 5000,
          admin: {
            components: {
              Field:
                '@/components/admin/LockableBookingFields#LockableTextareaField',
            },
            rows: 7,
          },
        },
        {
          name: 'consent',
          type: 'checkbox',
          required: true,
          defaultValue: false,
          admin: {
            components: {
              Field:
                '@/components/admin/LockableBookingFields#LockableCheckboxField',
            },
            description: 'The sender agreed to personal data processing',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Message status',
      options: [
        { label: 'New message', value: 'new' },
        { label: 'Handled', value: 'handled' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'new',
      admin: {
        className: 'booking-inquiry-status contact-message-status',
        description: 'Move this message through the inbox workflow.',
        position: 'sidebar',
      },
      access: {
        create: () => false,
      },
    },
  ],
  hooks: {
    afterChange: [sendContactMessageNotification],
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
