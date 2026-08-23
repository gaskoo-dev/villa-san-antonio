import type { Block } from 'payload'

export const BookingBandBlock: Block = {
  slug: 'bookingBand',
  labels: {
    singular: 'Booking CTA Banner',
    plural: 'Booking CTA Banners',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Main Heading',
      required: true,
      defaultValue: 'Hold your dates',
    },
    {
      name: 'accent',
      type: 'text',
      label: 'Accent Heading (Serif/Italic)',
      defaultValue: 'for this summer.',
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body Text',
      defaultValue:
        'Direct contact with the owner. Best rates guaranteed, personal check-in, and zero booking commission.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'primaryCtaLabel',
          type: 'text',
          label: 'Primary Button Label',
          defaultValue: 'Check Availability & Book',
          admin: { width: '50%' },
        },
        {
          name: 'primaryCtaLink',
          type: 'text',
          label: 'Primary Button Link',
          defaultValue: '/booking',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'whatsappLabel',
          type: 'text',
          label: 'WhatsApp Button Label',
          defaultValue: 'WhatsApp Chat',
          admin: { width: '50%' },
        },
        {
          name: 'whatsappNumber',
          type: 'text',
          label: 'WhatsApp Phone Number',
          defaultValue: '+385 91 602 1899',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'hostName',
          type: 'text',
          label: 'Host Name',
          defaultValue: 'Josip & Family',
          admin: { width: '33%' },
        },
        {
          name: 'hostRole',
          type: 'text',
          label: 'Host Role/Subtitle',
          defaultValue: 'Estate Owners & Hosts',
          admin: { width: '33%' },
        },
        {
          name: 'hostInitials',
          type: 'text',
          label: 'Host Initials (Fallback)',
          defaultValue: 'JP',
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'hostAvatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Host Avatar / Profile Photo',
      admin: {
        description: 'Profile picture of the host (circular). If left empty, initials will be displayed.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'hostPhone',
          type: 'text',
          label: 'Host Contact Phone',
          defaultValue: '+385 91 602 1899',
          admin: { width: '50%' },
        },
        {
          name: 'hostEmail',
          type: 'text',
          label: 'Host Contact Email',
          defaultValue: 'kontakt@villa-sanantonio.com',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'guarantees',
      type: 'array',
      label: 'Guarantee & Trust Cards',
      labels: {
        singular: 'Guarantee Card',
        plural: 'Guarantee Cards',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          options: [
            { label: 'Shield (Best Rate)', value: 'shield' },
            { label: 'Receipt (Deposit)', value: 'receipt' },
            { label: 'Sparkles (Host Welcome)', value: 'sparkles' },
            { label: 'Clock (Personal Care)', value: 'clock' },
            { label: 'Paw (Pet Friendly)', value: 'paw' },
            { label: 'Pool (Private Pool)', value: 'pool' },
            { label: 'Users (Guests)', value: 'users' },
            { label: 'Star (Review Rating)', value: 'star' },
          ],
          defaultValue: 'shield',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'desc',
          type: 'text',
          label: 'Description',
          required: true,
        },
      ],
    },
  ],
}
