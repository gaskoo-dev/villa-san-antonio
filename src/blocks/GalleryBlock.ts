import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'galleryStrip',
  labels: {
    singular: 'Gallery Strip',
    plural: 'Gallery Strips',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      defaultValue: 'Gallery',
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Atmosphere in',
    },
    {
      name: 'accent',
      type: 'text',
      defaultValue: 'still frames.',
    },
    {
      name: 'speed',
      type: 'number',
      label: 'Animation Speed (in seconds)',
      defaultValue: 65,
      min: 10,
      max: 200,
      admin: {
        description:
          'Duration in seconds for one full loop cycle. Lower number = faster movement, higher number = slower movement (e.g. 45 for fast, 65 for default, 90 for slow).',
      },
    },
    {
      name: 'images',
      type: 'array',
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
  ],
}
