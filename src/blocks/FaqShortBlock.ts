import type { Block } from 'payload'

export const FaqShortBlock: Block = {
  slug: 'faqShort',
  labels: {
    singular: 'FAQ Short Section',
    plural: 'FAQ Short Sections',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      defaultValue: 'FAQ',
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Everything you need to',
    },
    {
      name: 'accent',
      type: 'text',
      defaultValue: 'know before.',
    },
    {
      name: 'subtext',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'faq-items',
      hasMany: true,
      label: 'Selected FAQ Items',
    },
  ],
}
