import type { CollectionConfig } from 'payload'

import { adminWrite } from '@/access'

export const BookingInquiries: CollectionConfig = {
  slug: 'booking-inquiries',
  labels: {
    singular: 'Booking Inquiry',
    plural: 'Booking Inquiries',
  },
  admin: {
    useAsTitle: 'lastName',
    defaultColumns: ['firstName', 'lastName', 'checkIn', 'checkOut', 'email', 'status'],
    group: 'Inbox',
  },
  access: {
    // Guest data stays private: only authenticated admins can read/update.
    read: adminWrite,
    // Public submissions go through the validated Server Action. Keeping the
    // collection private prevents bots from writing directly to Payload REST/GraphQL.
    create: adminWrite,
    update: adminWrite,
    delete: adminWrite,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true, maxLength: 80 },
        { name: 'lastName', type: 'text', required: true, maxLength: 80 },
      ],
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
      maxLength: 100,
    },
    {
      type: 'row',
      fields: [
        { name: 'checkIn', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
        { name: 'checkOut', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'adults', type: 'number', min: 1, max: 8, defaultValue: 2, required: true },
        { name: 'kids', type: 'number', min: 0, max: 8, defaultValue: 0 },
      ],
    },
    {
      name: 'pets',
      type: 'select',
      options: ['no', 'yes'],
      defaultValue: 'no',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Optional notes / requests',
      maxLength: 3000,
    },
    {
      name: 'status',
      type: 'select',
      options: ['new', 'contacted', 'booked', 'archived'],
      defaultValue: 'new',
      admin: {
        position: 'sidebar',
      },
      access: {
        // Guests cannot set status themselves; server-side only.
        create: () => false,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        // New inquiries always start as "new". Updates from the admin panel
        // must retain status so the inbox workflow can advance.
        if (operation === 'create' && data && typeof data === 'object') {
          delete data.status
        }
        return data
      },
    ],
  },
}
