import type { Block } from 'payload'

export const DiscoverSectionBlock: Block = {
  slug: 'discoverSection',
  labels: {
    singular: 'Discover & Local Area Section',
    plural: 'Discover & Local Area Sections',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          label: 'Kicker',
          defaultValue: 'Local Experiences & Day Trips',
          admin: { width: '33%' },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'Between cascading waterfalls,',
          required: true,
          admin: { width: '33%' },
        },
        {
          name: 'accent',
          type: 'text',
          label: 'Accent Title',
          defaultValue: 'historic forts & Adriatic sea.',
          admin: { width: '34%' },
        },
      ],
    },
    {
      name: 'lead',
      type: 'textarea',
      label: 'Lead Paragraph',
      defaultValue:
        'Villa San Antonio is situated in the tranquil Dalmatian hinterland of Šibenik — perfectly balanced between Krka National Park, UNESCO stone fortresses, crystal Adriatic beaches, and authentic local wine cellars.',
    },
    {
      type: 'collapsible',
      label: 'Experiences & Activities Grid',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'experiences',
          type: 'array',
          label: 'Local Experiences',
          minRows: 1,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Experience Title',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'category',
                  type: 'select',
                  label: 'Category',
                  defaultValue: 'nature',
                  required: true,
                  options: [
                    { label: 'Nature & National Parks', value: 'nature' },
                    { label: 'Adventures & Sea', value: 'adventure' },
                    { label: 'Wine & Gastronomy', value: 'gastro' },
                    { label: 'Culture & UNESCO', value: 'culture' },
                    { label: 'Beaches & Coast', value: 'beaches' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  label: 'Tag / Timing',
                  defaultValue: '18 min drive',
                  admin: { width: '33%' },
                },
                {
                  name: 'badge',
                  type: 'text',
                  label: 'Badge (e.g. UNESCO, Must Visit)',
                  admin: { width: '33%' },
                },
                {
                  name: 'externalLink',
                  type: 'text',
                  label: 'External Official Link (Optional)',
                  admin: { width: '34%' },
                },
              ],
            },
            {
              name: 'desc',
              type: 'textarea',
              label: 'Description',
              required: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Cover Image',
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Regional Destinations & Travel Times',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'destinationsTitle',
              type: 'text',
              label: 'Section Title',
              defaultValue: 'Destinations & Driving Distances',
              admin: { width: '50%' },
            },
            {
              name: 'destinationsLead',
              type: 'text',
              label: 'Section Subtitle',
              defaultValue: 'Everything within effortless reach from Villa San Antonio:',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'destinations',
          type: 'array',
          label: 'Destinations List',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Destination Name',
                  required: true,
                  admin: { width: '35%' },
                },
                {
                  name: 'category',
                  type: 'text',
                  label: 'Category Tag (e.g. National Park)',
                  admin: { width: '25%' },
                },
                {
                  name: 'distance',
                  type: 'text',
                  label: 'Distance (e.g. 18 km)',
                  admin: { width: '20%' },
                },
                {
                  name: 'driveTime',
                  type: 'text',
                  label: 'Drive Time (e.g. 18 min)',
                  admin: { width: '20%' },
                },
              ],
            },
            {
              name: 'desc',
              type: 'text',
              label: 'Short Highlight / Notes',
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Host Concierge & Insider Recommendations',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'conciergeTitle',
          type: 'text',
          label: 'Concierge Title',
          defaultValue: 'Personal Host Recommendations & Concierge',
        },
        {
          name: 'conciergeText',
          type: 'textarea',
          label: 'Concierge Description',
          defaultValue:
            'Josip and the family can personally arrange private boat excursions to Kornati, authentic peka dinners, winery visits, or provide insider cycling and hiking routes starting right from the villa.',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'conciergeButtonLabel',
              type: 'text',
              label: 'Button Label',
              defaultValue: 'Ask Josip on WhatsApp',
              admin: { width: '50%' },
            },
            {
              name: 'conciergePhone',
              type: 'text',
              label: 'WhatsApp Phone Number',
              defaultValue: '+385 91 602 1899',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
