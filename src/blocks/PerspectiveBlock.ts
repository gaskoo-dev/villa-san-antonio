import type { Block } from 'payload'

export const PerspectiveBlock: Block = {
  slug: 'perspective',
  labels: {
    singular: 'Perspective & Story',
    plural: 'Perspective & Story Blocks',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      defaultValue: 'The perspective',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Quiet Dalmatian hills,',
    },
    {
      name: 'accent',
      type: 'text',
      defaultValue: 'twenty minutes',
    },
    {
      name: 'titleEnd',
      type: 'text',
      defaultValue: 'from the sea.',
    },
    {
      name: 'paragraphs',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'primaryImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'secondaryImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'stats',
      type: 'array',
      labels: {
        singular: 'Stat / Metric',
        plural: 'Stats / Metrics',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text' },
        { name: 'detail', type: 'text' },
      ],
    },
  ],
}
