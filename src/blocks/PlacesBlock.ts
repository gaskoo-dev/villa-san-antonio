import type { Block } from 'payload'

export const PlacesBlock: Block = {
  slug: 'places',
  labels: {
    singular: 'Spaces & Places',
    plural: 'Spaces & Places Blocks',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      defaultValue: 'Spaces & Ambience',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Every corner tailored for',
    },
    {
      name: 'accent',
      type: 'text',
      defaultValue: 'shared memories.',
    },
    {
      name: 'items',
      type: 'array',
      labels: {
        singular: 'Space / Area',
        plural: 'Spaces / Areas',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'tag',
          type: 'text',
        },
        {
          name: 'time',
          type: 'text',
        },
        {
          name: 'desc',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/about-villa',
        },
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'sun',
          options: [
            { label: 'Sun', value: 'sun' },
            { label: 'Flame', value: 'flame' },
            { label: 'Moon', value: 'moon' },
            { label: 'Sparkles', value: 'sparkles' },
            { label: 'Clock', value: 'clock' },
          ],
        },
      ],
    },
  ],
}
