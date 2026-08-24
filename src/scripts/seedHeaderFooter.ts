import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function seedHeaderFooter() {
  console.log('🌱 Seeding Header & Footer globals...')
  const payload = await getPayload({ config })

  // 1. Seed Header
  await payload.updateGlobal({
    slug: 'header',
    data: {
      topBar: {
        phone: '+385 91 602 1899',
        email: 'kontakt@villa-sanantonio.com',
        enableLanguages: true,
      },
      navItems: [
        { label: 'About Villa', link: '/about-villa', newTab: false },
        { label: 'Gallery', link: '/gallery', newTab: false },
        { label: 'FAQ', link: '/faq', newTab: false },
        { label: 'Contact', link: '/contact-us', newTab: false },
      ],
      cta: {
        label: 'Check availability',
        link: '/booking',
      },
    },
  })
  console.log('✅ Header global seeded successfully!')

  // 2. Seed Footer
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      brandTagline:
        'A private retreat for families and friends, tucked into the quiet Dalmatian hills near Šibenik.',
      primaryCta: {
        label: 'Check availability',
        link: '/booking',
      },
      navLinks: [
        { label: 'About Villa', link: '/about-villa' },
        { label: 'Gallery', link: '/gallery' },
        { label: 'FAQ', link: '/faq' },
        { label: 'Contact', link: '/contact-us' },
      ],
      contact: {
        email: 'kontakt@villa-sanantonio.com',
        phone: '+385 91 602 1899',
        address: 'Podine 14, near Šibenik',
        region: 'Dalmatia · Croatia',
      },
      socialLinks: [
        {
          platform: 'instagram',
          label: 'Instagram',
          url: 'https://www.instagram.com',
        },
        {
          platform: 'facebook',
          label: 'Facebook',
          url: 'https://www.facebook.com',
        },
        {
          platform: 'whatsapp',
          label: 'WhatsApp',
          url: 'https://wa.me/385916021899',
        },
      ],
      bottomTicker: 'Airport 45km · Beach 10km · Krka 15km',
      copyright: 'Villa San Antonio. All rights reserved.',
    },
  })
  console.log('✅ Footer global seeded successfully!')

  process.exit(0)
}

seedHeaderFooter().catch((err) => {
  console.error('❌ Error seeding Header & Footer:', err)
  process.exit(1)
})
