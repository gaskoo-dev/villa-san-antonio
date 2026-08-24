import type { CollectionConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'
import { BookingBandBlock } from '@/blocks/BookingBandBlock'
import { DistancesBlock } from '@/blocks/DistancesBlock'
import { FaqSectionBlock } from '@/blocks/FaqSectionBlock'
import { FaqShortBlock } from '@/blocks/FaqShortBlock'
import { GalleryBlock } from '@/blocks/GalleryBlock'
import { HeroBlock } from '@/blocks/HeroBlock'
import { HeroSubBlock } from '@/blocks/HeroSubBlock'
import { PerspectiveBlock } from '@/blocks/PerspectiveBlock'
import { PlacesBlock } from '@/blocks/PlacesBlock'
import { QuoteBlock } from '@/blocks/QuoteBlock'
import { ReviewsBlock } from '@/blocks/ReviewsBlock'
import { SpacesShowcaseBlock } from '@/blocks/SpacesShowcaseBlock'
import { StoryHighlightsBlock } from '@/blocks/StoryHighlightsBlock'
import { WelcomePackageBlock } from '@/blocks/WelcomePackageBlock'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'includeInNav', 'navOrder', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: publicRead,
    create: adminWrite,
    update: adminWrite,
    delete: adminWrite,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Page Title',
            },
            {
              name: 'layout',
              type: 'blocks',
              label: 'Page Layout Builder',
              blocks: [
                HeroBlock,
                HeroSubBlock,
                StoryHighlightsBlock,
                SpacesShowcaseBlock,
                WelcomePackageBlock,
                DistancesBlock,
                BookingBandBlock,
                PerspectiveBlock,
                QuoteBlock,
                PlacesBlock,
                GalleryBlock,
                ReviewsBlock,
                FaqShortBlock,
                FaqSectionBlock,
              ],
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL slug for this page (e.g. "home", "about-villa", "gallery")',
      },
    },
    {
      name: 'includeInNav',
      type: 'checkbox',
      label: 'Show in Header Navigation',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'navOrder',
      type: 'number',
      label: 'Navigation Order',
      defaultValue: 10,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first (e.g. 1, 2, 3...)',
      },
    },
    {
      name: 'navLabel',
      type: 'text',
      label: 'Custom Nav Label',
      admin: {
        position: 'sidebar',
        description: 'If left empty, Page Title will be used in navigation',
      },
    },
  ],
}
