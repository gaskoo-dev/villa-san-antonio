import type { Block } from 'payload'

export const FaqSectionBlock: Block = {
  slug: 'faqSection',
  labels: {
    singular: 'FAQ Section (Full)',
    plural: 'FAQ Sections (Full)',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'leftKicker',
          type: 'text',
          defaultValue: 'At a glance',
          admin: { width: '33%' },
        },
        {
          name: 'leftTitle',
          type: 'text',
          defaultValue: 'Key facts',
          admin: { width: '33%' },
        },
        {
          name: 'leftAccent',
          type: 'text',
          defaultValue: 'before arrival.',
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'leftLead',
      type: 'textarea',
      defaultValue:
        'Quick summary of our key house standards and amenities to help you plan your Dalmatian holiday.',
    },
    {
      name: 'quickFacts',
      type: 'array',
      label: 'Quick Fact Cards (Left Sidebar)',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'clock',
              options: [
                { label: 'Clock (Check-in/out)', value: 'clock' },
                { label: 'Shield / Car (Parking)', value: 'shield' },
                { label: 'Pool (Swimming pool)', value: 'pool' },
                { label: 'Paw (Pets & Yard)', value: 'paw' },
                { label: 'Wifi (High-speed Internet)', value: 'wifi' },
                { label: 'Flame (Stone BBQ House)', value: 'flame' },
                { label: 'Users (Guest Capacity)', value: 'users' },
              ],
              admin: { width: '30%' },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { width: '35%' },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { width: '35%' },
            },
          ],
        },
        {
          name: 'subtitle',
          type: 'text',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'rightKicker',
          type: 'text',
          defaultValue: 'House Guide & Details',
          admin: { width: '33%' },
        },
        {
          name: 'rightTitle',
          type: 'text',
          defaultValue: 'Frequently asked',
          admin: { width: '33%' },
        },
        {
          name: 'rightAccent',
          type: 'text',
          defaultValue: 'questions.',
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'rightLead',
      type: 'textarea',
      defaultValue:
        'Everything you need to know about staying at Villa San Antonio. Filter by category or search below.',
    },
  ],
}
