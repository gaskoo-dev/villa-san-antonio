import type { Block } from 'payload'

export const HeroSubBlock: Block = {
  slug: 'hero-sub',
  labels: {
    singular: 'Subpage Hero',
    plural: 'Subpage Heroes',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Main Headline',
    },
    {
      name: 'accent',
      type: 'text',
      label: 'Italic Accent Text',
    },
    {
      name: 'lead',
      type: 'textarea',
      label: 'Lead Subtitle / Description',
    },
    {
      name: 'breadcrumbLabel',
      type: 'text',
      label: 'Breadcrumb Label (optional)',
      admin: {
        description: 'Overrides the default breadcrumb trail label',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Hero Background Image',
    },
  ],
}
