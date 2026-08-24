import type { CollectionConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'
import { slugField } from '@/fields/slug'
import { BookingBandBlock } from '@/blocks/BookingBandBlock'
import { BookingSectionBlock } from '@/blocks/BookingSectionBlock'
import { ContactBlock } from '@/blocks/ContactBlock'
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
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
                ContactBlock,
                BookingSectionBlock,
              ],
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },
      ],
    },
    slugField('title', {
      admin: {
        description: 'URL slug for this page (e.g. "home", "about-villa", "gallery")',
      },
    }),
  ],
}
