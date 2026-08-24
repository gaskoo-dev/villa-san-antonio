import type { Block } from 'payload'

export const BookingSectionBlock: Block = {
  slug: 'bookingSection',
  labels: {
    singular: 'Booking Section',
    plural: 'Booking Sections',
  },
  fields: [
    {
      type: 'collapsible',
      label: '3-Step Reservation Timeline',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'stepsTitle',
          type: 'text',
          label: 'Steps Title',
          defaultValue: 'How direct reservation works',
        },
        {
          name: 'steps',
          type: 'array',
          label: 'Steps',
          minRows: 1,
          maxRows: 6,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'num',
                  type: 'text',
                  label: 'Step Number',
                  defaultValue: '01',
                  admin: { width: '30%' },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Step Title',
                  required: true,
                  admin: { width: '70%' },
                },
              ],
            },
            {
              name: 'desc',
              type: 'textarea',
              label: 'Step Description',
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Direct Booking Privileges',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'privilegesTitle',
          type: 'text',
          label: 'Privileges Title',
          defaultValue: 'Direct booking privileges',
        },
        {
          name: 'privileges',
          type: 'array',
          label: 'Privileges',
          minRows: 1,
          maxRows: 6,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  defaultValue: 'shield',
                  options: [
                    { label: 'Shield / Guaranteed (Best Rate)', value: 'shield' },
                    { label: 'Sparkles / Gift (Welcome)', value: 'sparkles' },
                    { label: 'Clock / Speed (Fast Reply)', value: 'clock' },
                    { label: 'Heart / Hospitality', value: 'heart' },
                    { label: 'Check / Verified', value: 'check' },
                  ],
                  admin: { width: '40%' },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                  admin: { width: '60%' },
                },
              ],
            },
            {
              name: 'desc',
              type: 'textarea',
              label: 'Description',
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Host Profile & Contact Card',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'hostImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Host Avatar Image (Optional)',
          admin: {
            description:
              'Upload a personal portrait photo of Josip / Hosts. If empty, initials will be shown.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'hostName',
              type: 'text',
              label: 'Host Name',
              defaultValue: 'Josip & Family',
              admin: { width: '50%' },
            },
            {
              name: 'hostSubtitle',
              type: 'text',
              label: 'Host Subtitle',
              defaultValue: 'Estate Owners & Hosts',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'badgeText',
              type: 'text',
              label: 'Badge Text',
              defaultValue: 'Fast Reply',
              admin: { width: '50%' },
            },
            {
              name: 'whatsappLabel',
              type: 'text',
              label: 'WhatsApp Button Label',
              defaultValue: 'WhatsApp Chat',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'whatsappNumber',
              type: 'text',
              label: 'WhatsApp Number (or phone)',
              defaultValue: '+385 91 602 1899',
              admin: { width: '33%' },
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Direct Phone',
              defaultValue: '+385 91 602 1899',
              admin: { width: '33%' },
            },
            {
              name: 'email',
              type: 'text',
              label: 'Direct Email',
              defaultValue: 'kontakt@villa-sanantonio.com',
              admin: { width: '34%' },
            },
          ],
        },
      ],
    },
  ],
}
