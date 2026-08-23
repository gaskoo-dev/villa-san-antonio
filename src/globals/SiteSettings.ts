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
          label: 'Contact & Location',
          name: 'contact',
          fields: [
            { name: 'email', type: 'email', required: true },
            { name: 'phone', type: 'text' },
            {
              name: 'address',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g. Podine, near Šibenik',
              },
            },
            { name: 'region', type: 'text', defaultValue: 'Dalmatia · Croatia' },
            {
              name: 'coordinates',
              type: 'group',
              fields: [
                { name: 'lat', type: 'number', required: true },
                { name: 'lng', type: 'number', required: true },
              ],
            },
            {
              name: 'distances',
              type: 'array',
              labels: {
                singular: 'Distance',
                plural: 'Distances',
              },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Social',
          name: 'social',
          fields: [
            { name: 'facebook', type: 'text' },
            { name: 'instagram', type: 'text' },
          ],
        },
        {
          label: 'Villa Stats',
          name: 'stats',
          fields: [
            {
              name: 'items',
              type: 'array',
              labels: {
                singular: 'Stat',
                plural: 'Stats',
              },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'number', required: true },
                { name: 'suffix', type: 'text', defaultValue: '' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
