import type { CollectionConfig } from 'payload'

import { adminWrite } from '@/access'
import { sendBookingInquiryNotification } from '@/hooks/sendInquiryNotification'

export const BookingInquiries: CollectionConfig = {
  slug: 'booking-inquiries',
  labels: {
    singular: 'Booking Inquiry',
    plural: 'Booking Inquiries',
  },
  admin: {
    useAsTitle: 'lastName',
    defaultColumns: ['lastName', 'firstName', 'checkIn', 'checkOut', 'email', 'status', 'createdAt'],
    group: 'Inbox',
    pagination: {
      defaultLimit: 50,
    },
    description: 'Review the guest request, confirm availability, and update the inquiry status.',
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
      type: 'collapsible',
      label: 'Guest details',
      admin: {
        className: 'booking-inquiry-section booking-inquiry-section--guest',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'firstName',
              type: 'text',
              required: true,
              maxLength: 80,
              admin: {
                components: {
                  Field:
                    '@/components/admin/LockableBookingFields#LockableTextField',
                },
              },
            },
            {
              name: 'lastName',
              type: 'text',
              required: true,
              maxLength: 80,
              admin: {
                components: {
                  Field:
                    '@/components/admin/LockableBookingFields#LockableTextField',
                },
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'email',
              type: 'email',
              required: true,
              admin: {
                components: {
                  Field:
                    '@/components/admin/LockableBookingFields#LockableEmailField',
                },
                width: '60%',
              },
            },
            {
              name: 'country',
              type: 'text',
              maxLength: 100,
              admin: {
                components: {
                  Field:
                    '@/components/admin/LockableBookingFields#LockableTextField',
                },
                width: '40%',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Stay details',
      admin: {
        className: 'booking-inquiry-section booking-inquiry-section--stay',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'checkIn',
              type: 'date',
              required: true,
              admin: {
                components: {
                  Field:
                    '@/components/admin/LockableBookingFields#LockableDateField',
                },
                date: {
                  displayFormat: 'd. MMMM yyyy.',
                  pickerAppearance: 'dayOnly',
                },
              },
            },
            {
              name: 'checkOut',
              type: 'date',
              required: true,
              admin: {
                components: {
                  Field:
                    '@/components/admin/LockableBookingFields#LockableDateField',
                },
                date: {
                  displayFormat: 'd. MMMM yyyy.',
                  pickerAppearance: 'dayOnly',
                },
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'adults',
              type: 'number',
              min: 1,
              defaultValue: 2,
              required: true,
              admin: {
                components: {
                  Field:
                    '@/components/admin/LockableBookingFields#LockableNumberField',
                },
                width: '33.33%',
              },
            },
            {
              name: 'kids',
              type: 'number',
              min: 0,
              defaultValue: 0,
              admin: {
                components: {
                  Field:
                    '@/components/admin/LockableBookingFields#LockableNumberField',
                },
                width: '33.33%',
              },
            },
            {
              name: 'pets',
              type: 'select',
              options: [
                { label: 'No', value: 'no' },
                { label: 'Yes', value: 'yes' },
              ],
              defaultValue: 'no',
              required: true,
              admin: {
                components: {
                  Field:
                    '@/components/admin/LockableBookingFields#LockableSelectField',
                },
                width: '33.33%',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Guest request',
      admin: {
        className: 'booking-inquiry-section booking-inquiry-section--request',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'notes',
          type: 'textarea',
          label: 'Optional notes / requests',
          maxLength: 3000,
          admin: {
            components: {
              Field:
                '@/components/admin/LockableBookingFields#LockableTextareaField',
            },
            rows: 4,
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Inquiry status',
      options: [
        { label: 'New inquiry', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'new',
      admin: {
        className: 'booking-inquiry-status',
        description: 'Move this request through the booking workflow.',
        position: 'sidebar',
      },
      access: {
        // Guests cannot set status themselves; server-side only.
        create: () => false,
      },
    },
  ],
  hooks: {
    afterChange: [sendBookingInquiryNotification],
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
