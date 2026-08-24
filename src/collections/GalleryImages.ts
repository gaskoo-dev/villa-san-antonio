import type { CollectionConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'

export const GalleryImages: CollectionConfig = {
  slug: 'gallery-images',
  labels: {
    singular: 'Gallery Image',
    plural: 'Gallery Images',
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['image', 'alt', 'category', 'featured', 'sortOrder'],
    group: 'Gallery',
  },
  access: {
    read: publicRead,
    create: adminWrite,
    update: adminWrite,
    delete: adminWrite,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text / Description',
      admin: {
        description: 'Overrides the media alt text if filled in',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'gallery-categories',
      label: 'Gallery Category',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Featured images are prioritized in hero and highlights',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
