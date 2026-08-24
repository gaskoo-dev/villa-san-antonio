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
      name: 'syncCalendarNow',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/SyncCalendarButton#SyncCalendarButton',
        },
      },
    },
    {
      name: 'calendarNoStore',
      type: 'checkbox',
      label: 'Real-Time Sync (cache: no-store)',
      defaultValue: false,
      admin: {
        description:
          'When checked, the server always bypasses cache and fetches real-time calendar availability directly from the iCal URL on every visitor page load.',
      },
    },
    {
      name: 'calendarCacheMinutes',
      type: 'number',
      label: 'Calendar Cache Duration (Minutes)',
      defaultValue: 15,
      min: 1,
      max: 1440,
      admin: {
        description:
          'How many minutes availability data is cached in memory (default: 15 minutes). Ignored when Real-Time Sync (no-store) is enabled.',
      },
    },
    {
      name: 'minNights',
      type: 'number',
      label: 'Minimum Nights for Booking',
      defaultValue: 3,
      min: 1,
      max: 30,
      admin: {
        description: 'Minimum number of consecutive nights required for a direct reservation (e.g. 3 or 7 nights).',
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
        description: 'Timestamp when the calendar feed was last retrieved and synced from the iCal link.',
      },
    },
  ],
}
