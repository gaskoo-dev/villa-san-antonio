import type { CollectionConfig } from 'payload'
import { adminWrite, publicRead } from '@/access'
import {
  lexicalEditor,
  AlignFeature,
  BlockquoteFeature,
  ChecklistFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical'

export const DiscoverPosts: CollectionConfig = {
  slug: 'discover-posts',
  labels: {
    singular: 'Discover Post',
    plural: 'Discover Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categoryRef', 'tag', 'updatedAt'],
    group: 'Discover',
    pagination: {
      defaultLimit: 50,
    },
    description:
      'Create one post per local experience. Drag rows by the handle in the list to change their frontend order.',
  },
  access: {
    read: publicRead,
    create: adminWrite,
    update: adminWrite,
    delete: adminWrite,
  },
  orderable: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'categoryRef',
          type: 'relationship',
          relationTo: 'discover-categories',
          label: 'Category',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Distance / Timing (e.g. 18 min drive · 18 km)',
          defaultValue: '18 min drive · 18 km',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge (e.g. Must Visit, UNESCO, Adrenaline)',
          admin: { width: '50%' },
        },
        {
          name: 'externalLink',
          type: 'text',
          label: 'Official Website Link (Optional)',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'mapsUrl',
      type: 'text',
      label: 'Google Maps Link',
      admin: {
        description: 'Direct Google Maps destination URL',
      },
    },
    {
      name: 'desc',
      type: 'richText',
      label: 'Description & Rich Content',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
          ChecklistFeature(),
          HorizontalRuleFeature(),
          UnderlineFeature(),
          StrikethroughFeature(),
          SubscriptFeature(),
          SuperscriptFeature(),
          InlineCodeFeature(),
          BlockquoteFeature(),
          AlignFeature(),
          IndentFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'images',
      type: 'array',
      label: 'Card & Modal Gallery Images',
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
      ],
    },
  ],
}
