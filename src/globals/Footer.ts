import type { GlobalConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Navigation',
  },
  access: {
    read: publicRead,
    update: adminWrite,
  },
  fields: [
    {
      name: 'brandTagline',
      type: 'textarea',
      label: 'Brand Tagline',
      defaultValue:
        'A private retreat for families and friends, tucked into the quiet Dalmatian hills near Šibenik.',
    },
    {
      name: 'primaryCta',
      type: 'group',
      label: 'Primary CTA Button',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'Check availability',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Button Link',
          defaultValue: '/booking',
        },
      ],
    },
    {
      name: 'navLinks',
      type: 'array',
      label: 'Explore Navigation Links',
      labels: {
        singular: 'Link',
        plural: 'Links',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Link Label',
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          label: 'URL / Path',
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'email',
          type: 'text',
          label: 'Email',
          defaultValue: 'kontakt@villa-sanantonio.com',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone',
          defaultValue: '+385 91 602 1899',
        },
        {
          name: 'address',
          type: 'text',
          label: 'Address Line 1',
          defaultValue: 'Podine 14, near Šibenik',
        },
        {
          name: 'region',
          type: 'text',
          label: 'Region / Country',
          defaultValue: 'Dalmatia · Croatia',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
      labels: {
        singular: 'Social Link',
        plural: 'Social Links',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          defaultValue: 'instagram',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Airbnb', value: 'airbnb' },
            { label: 'Booking.com', value: 'booking' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          label: 'Name / Alt',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
    {
      name: 'bottomTicker',
      type: 'text',
      label: 'Bottom Ticker Text',
      defaultValue: 'Airport 45km · Beach 10km · Krka 15km',
      admin: {
        description: 'Displayed at the bottom right next to Back to Top button.',
      },
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright Text',
      defaultValue: 'Villa San Antonio. All rights reserved.',
    },
  ],
}
