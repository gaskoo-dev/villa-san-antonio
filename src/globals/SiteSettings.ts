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
}
