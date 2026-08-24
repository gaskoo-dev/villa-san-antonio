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
        { label: 'Discover', link: '/discover', newTab: false },
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
      editorial: {
        subheading: 'Villa San Antonio · Dalmatia',
        heading: 'Your private sanctuary in the Dalmatian hills.',
        shortBio:
          'Peaceful Mediterranean seclusion with modern comforts, just minutes from the Adriatic coast.',
      },
      brandTagline:
        'Where slow mornings meet warm evenings. A private retreat for families & friends, tucked into the quiet Dalmatian hills near Šibenik.',
      directBooking: {
        title: 'Direct Booking Perks',
        perk1: 'Best direct rate guarantee',
        perk2: 'Heated pool & private jacuzzi',
        perk3: 'Fully fenced & pet-friendly garden',
        perk4: 'Personal host support (Josip)',
        ctaLabel: 'Check availability',
        ctaLink: '/booking',
      },
      exploreTitle: 'Explore',
      navLinks: [
        { label: 'Home', link: '/' },
        { label: 'About Villa', link: '/about-villa' },
        { label: 'Gallery', link: '/gallery' },
        { label: 'Discover', link: '/discover' },
        { label: 'FAQ', link: '/faq' },
        { label: 'Contact', link: '/contact-us' },
      ],
      contactSection: {
        title: 'Contact & Location',
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
      legalLinks: [
        { label: 'Privacy Policy', link: '/privacy-policy' },
        { label: 'Cookie Policy', link: '/cookie-policy' },
        { label: 'Terms & Conditions', link: '/terms' },
      ],
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
