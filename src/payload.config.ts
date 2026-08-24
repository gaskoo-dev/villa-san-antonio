import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { Media } from './collections/Media'
import { Reviews } from './collections/Reviews'
import { FAQItems } from './collections/FAQItems'
import { FAQCategories } from './collections/FAQCategories'
import { GalleryImages } from './collections/GalleryImages'
import { BookingInquiries } from './collections/BookingInquiries'
import { ContactMessages } from './collections/ContactMessages'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Pages,
    Media,
    GalleryImages,
    Reviews,
    FAQCategories,
    FAQItems,
    BookingInquiries,
    ContactMessages,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['pages'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const title = (doc as { title?: string })?.title
        return title ? `${title} · Villa San Antonio` : 'Villa San Antonio · Private Pool Villa Šibenik'
      },
      generateDescription: () =>
        'A fully private villa for eight guests near Šibenik, Dalmatia with heated pool, BBQ house and fenced garden. Book direct with 0% fees.',
      generateURL: ({ doc }) => {
        const slug = (doc as { slug?: string })?.slug
        return `https://villa-sanantonio.com${slug && slug !== 'home' ? `/${slug}` : ''}`
      },
    }),
  ],
})
