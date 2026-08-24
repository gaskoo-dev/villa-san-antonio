import type { GlobalConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Configuration',
  },
  access: {
    read: publicRead,
    update: adminWrite,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Settings',
          name: 'settings',
          fields: [
            {
              name: 'calendarIcalUrl',
              type: 'text',
              label: 'Calendar iCal Link',
              defaultValue: 'https://www.myluxoria.com/api/v1/get-ical/358',
              admin: {
                description:
                  'External iCal URL feed used to sync villa availability (e.g. MyLuxoria, Airbnb, Booking.com).',
              },
            },
            {
              name: 'calendarLastSyncedAt',
              type: 'date',
              label: 'Last Calendar Sync',
              admin: {
                readOnly: true,
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'dd.MM.yyyy HH:mm',
                },
                description: 'Timestamp when the calendar feed was last retrieved and synced.',
              },
            },
          ],
        },
        {
          label: 'Social',
          name: 'social',
          fields: [
            {
              name: 'links',
              type: 'array',
              label: 'Social Networks',
              labels: {
                singular: 'Social Network',
                plural: 'Social Networks',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  defaultValue: 'instagram',
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Airbnb', value: 'airbnb' },
                    { label: 'Booking.com', value: 'booking' },
                    { label: 'Other', value: 'other' },
                  ],
                  admin: {
                    width: '30%',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label / Name',
                  admin: {
                    width: '35%',
                    placeholder: 'e.g. Instagram',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'Profile URL',
                  admin: {
                    width: '35%',
                    placeholder: 'https://instagram.com/...',
                  },
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Active / Visible on website',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
