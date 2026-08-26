import type { GlobalConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'
import { PUBLIC_PATHS, revalidateGlobalPaths } from '@/hooks/revalidate'

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
  hooks: {
    afterChange: [revalidateGlobalPaths(PUBLIC_PATHS)],
  },
  fields: [
    {
      name: 'editorial',
      type: 'group',
      label: 'Top Editorial Heading',
      fields: [
        {
          name: 'subheading',
          type: 'text',
          label: 'Subheading',
          defaultValue: 'Villa San Antonio · Dalmatia',
        },
        {
          name: 'heading',
          type: 'text',
          label: 'Main Serif Heading',
          defaultValue: 'Your private sanctuary in the Dalmatian hills.',
        },
        {
          name: 'shortBio',
          type: 'textarea',
          label: 'Short Bio',
          defaultValue:
            'Peaceful Mediterranean seclusion with modern comforts, just minutes from the Adriatic coast.',
        },
      ],
    },
    {
      name: 'brandTagline',
      type: 'textarea',
      label: 'Brand Tagline (Column 1)',
      defaultValue:
        'Where slow mornings meet warm evenings. A private retreat for families & friends, tucked into the quiet Dalmatian hills near Šibenik.',
    },
    {
      name: 'directBooking',
      type: 'group',
      label: 'Direct Booking Perks (Column 2)',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Direct Booking Perks',
        },
        {
          name: 'perk1',
          type: 'text',
          label: 'Perk 1',
          defaultValue: 'Best direct rate guarantee',
        },
        {
          name: 'perk2',
          type: 'text',
          label: 'Perk 2',
          defaultValue: 'Heated pool & private jacuzzi',
        },
        {
          name: 'perk3',
          type: 'text',
          label: 'Perk 3',
          defaultValue: 'Fully fenced & pet-friendly garden',
        },
        {
          name: 'perk4',
          type: 'text',
          label: 'Perk 4',
          defaultValue: 'Personal host support (Josip)',
        },
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'CTA Button Label',
          defaultValue: 'Check availability',
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'CTA Button Link',
          defaultValue: '/booking',
        },
      ],
    },
    {
      name: 'exploreTitle',
      type: 'text',
      label: 'Explore Section Title (Column 3)',
      defaultValue: 'Explore',
    },
    {
      name: 'navLinks',
      type: 'array',
      label: 'Explore Navigation Links (Column 3)',
      labels: {
        singular: 'Link',
        plural: 'Links',
      },
      admin: {
        components: {
          RowLabel: '@/components/admin/FooterLinkRowLabels#FooterLinkRowLabel',
        },
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
      name: 'contactSection',
      type: 'group',
      label: 'Contact & Location (Column 4)',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Contact & Location',
        },
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
          label: 'Address Line',
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
      label: 'Social Media Links (Column 4)',
      labels: {
        singular: 'Social Link',
        plural: 'Social Links',
      },
      admin: {
        components: {
          RowLabel: '@/components/admin/FooterLinkRowLabels#FooterSocialLinkRowLabel',
        },
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
      name: 'legalLinks',
      type: 'array',
      label: 'Legal & Policy Links (Bottom Bar)',
      labels: {
        singular: 'Policy Link',
        plural: 'Policy Links',
      },
      admin: {
        components: {
          RowLabel: '@/components/admin/FooterLinkRowLabels#FooterLinkRowLabel',
        },
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
      name: 'copyright',
      type: 'text',
      label: 'Copyright Text',
      defaultValue: 'Villa San Antonio. All rights reserved.',
    },
  ],
}
