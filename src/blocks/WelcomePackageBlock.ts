import type { Block } from 'payload'

export const WelcomePackageBlock: Block = {
  slug: 'welcomePackage',
  labels: {
    singular: 'Welcome Package Block',
    plural: 'Welcome Package Blocks',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      label: 'Section Kicker',
      defaultValue: 'Welcome package',
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Main Headline',
      required: true,
      defaultValue: 'A welcome worthy',
    },
    {
      name: 'accent',
      type: 'text',
      label: 'Accent Text (Italic/Serif)',
      defaultValue: 'of the drive.',
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body Description',
      required: true,
      defaultValue:
        'Start your vacation with our exclusive Welcome Package, featuring homemade brandy, fine wine, prosciutto and cheese. This perfect combination of local delicacies offers an authentic experience and immediately immerses you in the pleasures of our region. Ideal for relaxation and socializing, making it the perfect start to your holiday.',
    },
    {
      name: 'delicacies',
      type: 'array',
      label: 'Delicacies Checklist Items',
      labels: {
        singular: 'Delicacy Item',
        plural: 'Delicacy Items',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'imageMain',
      type: 'upload',
      relationTo: 'media',
      label: 'Primary / Main Photo (Left tall)',
    },
    {
      name: 'imageTop',
      type: 'upload',
      relationTo: 'media',
      label: 'Secondary Photo (Right top)',
    },
    {
      name: 'imageBottom',
      type: 'upload',
      relationTo: 'media',
      label: 'Tertiary Photo (Right bottom)',
    },
  ],
}
