import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function seedSiteSettings() {
  console.log('🌱 Seeding Site Settings...')
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      settings: {
        calendarIcalUrl: 'https://www.myluxoria.com/api/v1/get-ical/358',
        calendarLastSyncedAt: new Date().toISOString(),
      },
      social: {
        links: [
          {
            platform: 'instagram',
            label: 'Instagram',
            url: 'https://www.instagram.com',
            enabled: true,
          },
          {
            platform: 'facebook',
            label: 'Facebook',
            url: 'https://www.facebook.com',
            enabled: true,
          },
          {
            platform: 'whatsapp',
            label: 'WhatsApp Direct',
            url: 'https://wa.me/385916021899',
            enabled: true,
          },
        ],
      },
    },
  })

  console.log('✅ Site Settings seeded successfully!')
  process.exit(0)
}

seedSiteSettings().catch((err) => {
  console.error('❌ Error seeding Site Settings:', err)
  process.exit(1)
})
