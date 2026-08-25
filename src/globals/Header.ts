import type { GlobalConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: {
    group: 'Navigation',
  },
  access: {
    read: publicRead,
    update: adminWrite,
  },
  fields: [
    {
      name: 'topBar',
      type: 'group',
      label: 'Top Utility Bar',
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
          defaultValue: '+385 91 602 1899',
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email Address',
          defaultValue: 'kontakt@villa-sanantonio.com',
        },
        {
          name: 'enableLanguages',
          type: 'checkbox',
          label: 'Show Language Switcher (EN / DE / HR / PL / IT)',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Links',
      labels: {
        singular: 'Link',
        plural: 'Links',
      },
      admin: {
        components: {
          RowLabel: '@/components/admin/HeaderLinkRowLabel#HeaderLinkRowLabel',
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
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA Button',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Check availability',
          label: 'Button Label',
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/booking',
          label: 'Button Link',
        },
      ],
    },
  ],
}
