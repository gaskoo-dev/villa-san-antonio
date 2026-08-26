import type { CollectionConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'
import { revalidateCollectionPaths } from '@/hooks/revalidate'

const drivesRevalidation = revalidateCollectionPaths(['/discover'])

export const DrivesDistances: CollectionConfig = {
  slug: 'drives-distances',
  labels: {
    singular: 'Drive & Distance',
    plural: 'Drives & Distances',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'distance', 'driveTime', 'updatedAt'],
    group: 'Discover',
    pagination: {
      defaultLimit: 50,
    },
    description:
      'Create one post per destination. Drag rows by the handle in the list to change their frontend order.',
  },
  access: {
    read: publicRead,
    create: adminWrite,
    update: adminWrite,
    delete: adminWrite,
  },
  orderable: true,
  hooks: {
    afterChange: [drivesRevalidation.afterChange],
    afterDelete: [drivesRevalidation.afterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Destination Name',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'text',
          label: 'Category (e.g. National Park, UNESCO)',
          admin: { width: '33.3%' },
        },
        {
          name: 'distance',
          type: 'text',
          label: 'Distance (e.g. 18 km)',
          required: true,
          admin: { width: '33.3%' },
        },
        {
          name: 'driveTime',
          type: 'text',
          label: 'Drive Time (e.g. 18 min)',
          required: true,
          admin: { width: '33.3%' },
        },
      ],
    },
    {
      name: 'mapsUrl',
      type: 'text',
      label: 'Google Maps Link',
    },
    {
      name: 'desc',
      type: 'textarea',
      label: 'Short Description',
    },
  ],
}
