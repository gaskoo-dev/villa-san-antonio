import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'updatedAt', 'createdAt'],
    pagination: {
      defaultLimit: 50,
    },
    description: 'CMS users with account activity and creation details.',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
