import type { Block } from 'payload'

export const StoryHighlightsBlock: Block = {
  slug: 'storyHighlights',
  labels: {
    singular: 'Story & Highlights',
    plural: 'Story & Highlights Blocks',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      defaultValue: 'The villa',
      label: 'Kicker Tagline',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'One house,',
      label: 'Main Headline',
    },
    {
      name: 'accent',
      type: 'text',
      defaultValue: 'held for you.',
      label: 'Italic Accent Text',
    },
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Podine, Šibenik · 20 min to the sea',
      label: 'Location / Sub-badge',
    },
    {
      name: 'showMap',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Google Map Card in Left Column',
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      defaultValue: 'https://maps.google.com/maps?q=43.6470678,16.0546611+(Villa+San+Antonio)&hl=en&z=13&output=embed',
      label: 'Google Map Embed URL',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showMap),
      },
    },
    {
      name: 'mapDirectUrl',
      type: 'text',
      defaultValue: 'https://maps.app.goo.gl/Xm8sAH7drKf2pADaA',
      label: 'Google Maps Direct Shortlink',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showMap),
      },
    },
    {
      name: 'mapAddress',
      type: 'text',
      defaultValue: 'Podine 14, Šibenik',
      label: 'Map Card Address Display',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showMap),
      },
    },
    {
      name: 'lead',
      type: 'textarea',
      required: true,
      label: 'Editorial Lead Paragraph (Larger Font)',
    },
    {
      name: 'paragraphs',
      type: 'array',
      label: 'Additional Story Paragraphs',
      fields: [
        {
          name: 'text',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Key Villa Highlights (Cards)',
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'users',
          options: [
            { label: 'Guests / Users', value: 'users' },
            { label: 'Heated Pool', value: 'pool' },
            { label: 'Stone BBQ / Flame', value: 'flame' },
            { label: 'Pet-friendly / Garden Paw', value: 'paw' },
            { label: 'Bedrooms / Suites', value: 'bed' },
            { label: 'Sun / Terrace', value: 'sun' },
            { label: 'Sparkles / Premium', value: 'sparkles' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Highlight Title (e.g. 8 Guests)',
        },
        {
          name: 'detail',
          type: 'text',
          required: true,
          label: 'Highlight Subtitle / Detail',
        },
      ],
    },
  ],
}
