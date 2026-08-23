import type { Block } from 'payload'

export const DistancesBlock: Block = {
  slug: 'distances',
  labels: {
    singular: 'Distances Block',
    plural: 'Distances Blocks',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      label: 'Section Kicker / Subtitle',
      defaultValue: 'Distances',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Main Heading',
      required: true,
      defaultValue: 'Quietly placed,',
    },
    {
      name: 'accent',
      type: 'text',
      label: 'Accent Heading (Serif/Italic)',
      defaultValue: 'close to everything.',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Distance Items',
      labels: {
        singular: 'Distance Item',
        plural: 'Distance Items',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Distance Value',
          required: true,
          admin: {
            description: 'e.g. 14 km, 20 min, 1.5 km',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Location / Landmark',
          required: true,
          admin: {
            description: 'e.g. Nearest beach, Šibenik old town, Split airport',
          },
        },
      ],
    },
  ],
}
