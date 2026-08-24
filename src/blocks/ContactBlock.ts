import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contactSection',
  labels: {
    singular: 'Contact Section',
    plural: 'Contact Sections',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          label: 'Kicker (optional)',
          admin: { width: '33%' },
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Get in',
          admin: { width: '33%' },
        },
        {
          name: 'accent',
          type: 'text',
          defaultValue: 'touch.',
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'lead',
      type: 'textarea',
      defaultValue: 'We answer every message personally, usually within 30 minutes.',
      label: 'Lead Text',
    },
    {
      type: 'collapsible',
      label: 'Direct Contact Details',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'email',
              type: 'text',
              label: 'Email',
              defaultValue: 'kontakt@villa-sanantonio.com',
              admin: { width: '50%' },
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Phone Number',
              defaultValue: '+385 91 602 1899',
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
              label: 'WhatsApp Number',
              defaultValue: '+385 91 602 1899',
              admin: { width: '50%' },
            },
            {
              name: 'whatsappLabel',
              type: 'text',
              label: 'WhatsApp Button Label',
              defaultValue: 'Chat on WhatsApp',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'locationAddress',
              type: 'text',
              label: 'Location Address Text',
              defaultValue: 'Podine 14, 22000 Šibenik, Dalmatia · Croatia',
              admin: { width: '50%' },
            },
            {
              name: 'googleMapsUrl',
              type: 'text',
              label: 'Google Maps Link',
              defaultValue: 'https://maps.app.goo.gl/Xm8sAH7drKf2pADaA',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'FAQ Helper Card',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'showFaqCard',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show FAQ Helper Card in Left Column',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'faqCardTitle',
              type: 'text',
              defaultValue: 'Need immediate answers?',
              admin: { width: '50%' },
            },
            {
              name: 'faqCardText',
              type: 'text',
              defaultValue: 'Check our house guide for check-in hours, heated pool details, and pet rules.',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'faqCardLinkLabel',
              type: 'text',
              defaultValue: 'Browse Frequently Asked Questions',
              admin: { width: '50%' },
            },
            {
              name: 'faqCardLinkUrl',
              type: 'text',
              defaultValue: '/faq',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Google Maps Embed Section',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'enableMap',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Interactive Map Section',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'mapLatitude',
              type: 'number',
              defaultValue: 43.6470678,
              admin: { width: '33%' },
            },
            {
              name: 'mapLongitude',
              type: 'number',
              defaultValue: 16.0546611,
              admin: { width: '33%' },
            },
            {
              name: 'mapZoom',
              type: 'number',
              defaultValue: 13,
              admin: { width: '33%' },
            },
          ],
        },
      ],
    },
  ],
}
