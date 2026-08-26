import type { CollectionConfig } from 'payload'

import { adminWrite, publicRead } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidatePageAfterChange, revalidatePageAfterDelete } from '@/hooks/revalidate'
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
import { RegionalDrivesTextBlock } from '@/blocks/RegionalDrivesTextBlock'
import { ReviewsBlock } from '@/blocks/ReviewsBlock'
import { SpacesShowcaseBlock } from '@/blocks/SpacesShowcaseBlock'
import { StoryHighlightsBlock } from '@/blocks/StoryHighlightsBlock'
import { WelcomePackageBlock } from '@/blocks/WelcomePackageBlock'

const PAGE_BLOCKS_BY_SLUG: Record<string, string[]> = {
  home: ['hero-slider', 'perspective', 'places', 'galleryStrip', 'reviews', 'faqShort', 'bookingBand'],
  'about-villa': [
    'hero-sub',
    'storyHighlights',
    'spacesShowcase',
    'welcomePackage',
    'distances',
    'bookingBand',
  ],
  gallery: ['hero-sub', 'bookingBand'],
  faq: ['hero-sub', 'faqSection', 'bookingBand'],
  'contact-us': ['hero-sub', 'contactSection', 'bookingBand'],
  booking: ['hero-sub', 'bookingSection'],
  discover: ['hero-sub', 'regionalDrivesText', 'bookingBand'],
}

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
  hooks: {
    afterChange: [revalidatePageAfterChange],
    afterDelete: [revalidatePageAfterDelete],
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
              label: 'Page Sections',
              filterOptions: ({ data }) => {
                const slug = typeof data?.slug === 'string' ? data.slug : ''
                return PAGE_BLOCKS_BY_SLUG[slug] || true
              },
              blocks: [
                HeroBlock,
                HeroSubBlock,
                StoryHighlightsBlock,
                SpacesShowcaseBlock,
                WelcomePackageBlock,
                DistancesBlock,
                BookingBandBlock,
                PerspectiveBlock,
                PlacesBlock,
                RegionalDrivesTextBlock,
                GalleryBlock,
                ReviewsBlock,
                FaqShortBlock,
                FaqSectionBlock,
                ContactBlock,
                BookingSectionBlock,
              ],
              admin: {
                initCollapsed: true,
                isSortable: false,
                description:
                  'Available sections are limited to this page template and render in the template order shown on the website.',
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
