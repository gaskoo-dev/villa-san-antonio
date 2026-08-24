import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero-slider',
  labels: {
    singular: 'Hero Slider',
    plural: 'Hero Sliders',
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      labels: {
        singular: 'Slide',
        plural: 'Slides',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'kicker',
          type: 'text',
          label: 'Kicker Tagline',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Slide Title (Main text)',
        },
        {
          name: 'accent',
          type: 'text',
          label: 'Italic Accent Text',
        },
        {
          name: 'subtext',
          type: 'textarea',
          label: 'Description / Subtitle',
        },
      ],
    },
    {
      name: 'transitionDuration',
      type: 'number',
      label: 'Transition Duration (ms)',
      defaultValue: 2000,
    },
    {
      name: 'interval',
      type: 'number',
      label: 'Slide Interval (ms)',
      defaultValue: 6500,
    },
    {
      name: 'primaryCta',
      type: 'group',
      label: 'Primary CTA Button',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Check availability' },
        { name: 'url', type: 'text', defaultValue: '/booking' },
      ],
    },
    {
      name: 'secondaryCta',
      type: 'group',
      label: 'Secondary CTA Button',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Explore the villa' },
        { name: 'url', type: 'text', defaultValue: '/about-villa' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Bottom Metadata & Editorial Bar',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'coordsText',
              type: 'text',
              label: 'Coordinates / Location Text (Left)',
              defaultValue: '43.647° N, 16.055° E · PODINE',
              admin: { width: '50%' },
            },
            {
              name: 'scrollLabel',
              type: 'text',
              label: 'Scroll Button Label (Center)',
              defaultValue: 'Scroll to explore',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'instagramUrl',
              type: 'text',
              label: 'Instagram URL (Right)',
              defaultValue: 'https://www.instagram.com/villa_sanantonio/',
              admin: { width: '50%' },
            },
            {
              name: 'facebookUrl',
              type: 'text',
              label: 'Facebook URL (Right)',
              defaultValue: 'https://web.facebook.com/villasanantoniopodine/',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
