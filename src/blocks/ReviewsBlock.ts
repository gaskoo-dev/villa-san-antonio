import type { Block } from 'payload'

export const ReviewsBlock: Block = {
  slug: 'reviews',
  labels: {
    singular: 'Reviews Section',
    plural: 'Reviews Sections',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      defaultValue: 'Guest Impressions',
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Verified words from',
    },
    {
      name: 'accent',
      type: 'text',
      defaultValue: 'our guests.',
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 30,
    },
    {
      name: 'selectedReviews',
      type: 'relationship',
      relationTo: 'reviews',
      hasMany: true,
      label: 'Featured Reviews (optional pin)',
    },
  ],
}
