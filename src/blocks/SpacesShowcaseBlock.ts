import type { Block } from 'payload'

export const SpacesShowcaseBlock: Block = {
  slug: 'spacesShowcase',
  labels: {
    singular: 'Spaces & Rooms Showcase',
    plural: 'Spaces & Rooms Showcases',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      label: 'Section Kicker / Subtitle',
      defaultValue: 'Inside spaces',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Main Heading',
      required: true,
      defaultValue: 'Light rooms,',
    },
    {
      name: 'accent',
      type: 'text',
      label: 'Accent Heading (Serif/Italic)',
      defaultValue: 'nothing missing.',
    },
    {
      name: 'bgStyle',
      type: 'select',
      label: 'Background Style',
      options: [
        { label: 'Surface (Muted Beige)', value: 'surface' },
        { label: 'Paper (White / Light)', value: 'paper' },
      ],
      defaultValue: 'surface',
    },
    {
      name: 'spaces',
      type: 'array',
      label: 'Rooms / Spaces in this Section',
      labels: {
        singular: 'Room / Space',
        plural: 'Rooms / Spaces',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Space Name',
          required: true,
          admin: {
            description: 'e.g. Kitchen & Dining, Master Bedroom, BBQ House',
          },
        },
        {
          name: 'category',
          type: 'text',
          label: 'Category Tag',
          defaultValue: 'interior',
          admin: {
            description: 'e.g. interior, bedrooms, bathrooms, outdoors',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle / Description',
        },
        {
          name: 'images',
          type: 'array',
          label: 'Swiper Slider Photos',
          labels: {
            singular: 'Slider Photo',
            plural: 'Slider Photos',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        {
          name: 'features',
          type: 'array',
          label: 'Equipment & Feature Checklist',
          labels: {
            singular: 'Feature',
            plural: 'Features',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
