import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function seedSiteSettings() {
  console.log('🌱 Seeding Site Settings...')
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      calendarIcalUrl: 'https://www.myluxoria.com/api/v1/get-ical/358',
      calendarLastSyncedAt: new Date().toISOString(),
    },
  })

  console.log('✅ Site Settings seeded successfully!')
  process.exit(0)
}

seedSiteSettings().catch((err) => {
  console.error('❌ Error seeding Site Settings:', err)
  process.exit(1)
})
