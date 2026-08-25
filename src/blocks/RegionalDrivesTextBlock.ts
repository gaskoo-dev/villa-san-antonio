import type { Block } from 'payload'

export const RegionalDrivesTextBlock: Block = {
  slug: 'regionalDrivesText',
  labels: {
    singular: 'Regional Drives & Distances Text',
    plural: 'Regional Drives & Distances Text Blocks',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      label: 'Kicker',
      defaultValue: 'Regional Map & Travel Times',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Everything within effortless driving distance.',
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Text',
      required: true,
      defaultValue:
        'Located in Podine (Šibenik hinterland), Villa San Antonio provides complete sanctuary without isolation — scenic highways and coastal roads take you anywhere in minutes.',
    },
  ],
}
