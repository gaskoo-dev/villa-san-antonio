import type { CollectionConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'
import { PUBLIC_PATHS, revalidateCollectionPaths } from '@/hooks/revalidate'

const mediaRevalidation = revalidateCollectionPaths(PUBLIC_PATHS)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: publicRead,
    create: adminWrite,
    update: adminWrite,
    delete: adminWrite,
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Media',
    pagination: {
      defaultLimit: 50,
    },
    description: 'Uploaded images with thumbnail previews, alt text, and update details.',
  },
  hooks: {
    afterChange: [mediaRevalidation.afterChange],
    afterDelete: [mediaRevalidation.afterDelete],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'desktop',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
}
