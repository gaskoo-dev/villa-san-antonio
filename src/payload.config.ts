import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import prompts from 'prompts'

// Automatically accept interactive prompts (e.g. migration confirmation when dev push was previously recorded)
prompts.override({
  confirm: true,
})

import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { Media } from './collections/Media'
import { Reviews } from './collections/Reviews'
import { FAQItems } from './collections/FAQItems'
import { FAQCategories } from './collections/FAQCategories'
import { GalleryImages } from './collections/GalleryImages'
import { GalleryCategories } from './collections/GalleryCategories'
import { BookingInquiries } from './collections/BookingInquiries'
import { ContactMessages } from './collections/ContactMessages'
import { DiscoverPosts } from './collections/DiscoverPosts'
import { DiscoverCategories } from './collections/DiscoverCategories'
import { DrivesDistances } from './collections/DrivesDistances'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'
import { withLocalizedContent } from './fields/localizeContentFields'
import { migrations } from './migrations'
import { SITE_URL } from './lib/content'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' · Villa San Antonio CMS',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/AdminBrand#AdminLogo',
        Icon: '@/components/admin/AdminBrand#AdminIcon',
      },
      views: {
        dashboard: {
          Component: '@/components/admin/DashboardView#DashboardView',
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    withLocalizedContent(Pages),
    withLocalizedContent(DiscoverPosts),
    withLocalizedContent(DiscoverCategories),
    withLocalizedContent(DrivesDistances),
    withLocalizedContent(Media),
    withLocalizedContent(GalleryImages),
    withLocalizedContent(GalleryCategories),
    Reviews,
    withLocalizedContent(FAQItems),
    withLocalizedContent(FAQCategories),
    BookingInquiries,
    ContactMessages,
  ],
  globals: [withLocalizedContent(Header), withLocalizedContent(Footer), SiteSettings],
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'de', label: 'Deutsch' },
      { code: 'hr', label: 'Hrvatski' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    migrationDir: path.resolve(dirname, 'migrations'),
    // Schema changes are migration-driven. Set this only for an explicitly
    // disposable development database; never let tests push into a shared DB.
    push: process.env.PAYLOAD_ALLOW_SCHEMA_PUSH === 'true',
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['pages'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const title = (doc as { title?: string })?.title
        return title
          ? `${title} · Villa San Antonio`
          : 'Villa San Antonio · Private Pool Villa Šibenik'
      },
      generateDescription: () =>
        'A fully private villa for eight guests near Šibenik, Dalmatia with heated pool, BBQ house and fenced garden. Book direct with 0% fees.',
      generateURL: ({ doc }) => {
        const slug = (doc as { slug?: string })?.slug
        const pathname = slug && slug !== 'home' ? `/${slug.replace(/^\/+/, '')}` : '/'
        return new URL(pathname, SITE_URL).toString()
      },
    }),
  ],
})
