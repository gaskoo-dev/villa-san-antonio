import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import type { Page } from '../payload-types'

async function seedHomeBlocks() {
  console.log('🌱 Seeding Home Page Blocks into Payload CMS...')
  const payload = await getPayload({ config })

  // 1. Fetch existing media, reviews, and FAQ items
  const mediaResult = await payload.find({
    collection: 'media',
    limit: 200,
  })
  const mediaDocs = mediaResult.docs

  const reviewsResult = await payload.find({
    collection: 'reviews',
    limit: 50,
    sort: 'sortOrder',
  })
  const reviewIds = reviewsResult.docs.map((r) => r.id)

  const faqResult = await payload.find({
    collection: 'faq-items',
    limit: 10,
    sort: 'sortOrder',
  })
  const faqIds = faqResult.docs.slice(0, 5).map((f) => f.id)

  const findMedia = (pattern: string) =>
    mediaDocs.find((m) => m.filename?.includes(pattern))?.id || mediaDocs[0]?.id

  const heroMediaA = findMedia('-071')
  const heroMediaB = findMedia('-027')
  const heroMediaC = findMedia('-005')
  const heroMediaD = findMedia('-006')

  const storyMediaA = findMedia('-027')
  const storyMediaB = findMedia('-056')

  const poolMedia = findMedia('-027')
  const bbqMedia = findMedia('-079')
  const bedroomMedia = findMedia('-056')

  const galleryMediaIds = mediaDocs.slice(0, 10).map((m) => ({
    image: m.id,
    alt: m.alt || 'Villa San Antonio',
  }))

  const homeLayout = [
    // 01 · Hero Slider Block
    {
      blockType: 'hero-slider',
      transitionDuration: 2000,
      interval: 6500,
      primaryCta: {
        label: 'Check availability',
        url: '/booking',
      },
      secondaryCta: {
        label: 'Explore the villa',
        url: '/about-villa',
      },
      slides: [
        {
          image: heroMediaA,
          kicker: 'VILLA SAN ANTONIO',
          title: 'Your Private Oasis',
          accent: 'near Šibenik.',
          subtext:
            'A fully private villa for eight near Šibenik, with a heated pool, BBQ house and a fenced garden made for slow days.',
        },
        {
          image: heroMediaB,
          kicker: 'A private villa for families & friends',
          title: 'Space to Be',
          accent: 'Together.',
          subtext:
            'Complete privacy, three quiet bedrooms, and expansive indoor and outdoor living areas built for gathering.',
        },
        {
          image: heroMediaC,
          kicker: 'Surrounded by greenery with open views and pure peace',
          title: 'Quiet Luxury',
          accent: 'in Dalmatia.',
          subtext:
            'Nestled in the tranquil Dalmatian hinterland, just minutes away from pristine beaches and Krka National Park.',
        },
        {
          image: heroMediaD,
          kicker: 'Pool days. Sunset nights. Zero stress',
          title: 'Your Summer',
          accent: 'Headquarters.',
          subtext:
            'Heated pool with waterfall, sun loungers, outdoor fireplace, and stargazing under the clear Mediterranean sky.',
        },
      ],
    },

    // 02 · Perspective & Story Block
    {
      blockType: 'perspective',
      kicker: 'The perspective',
      title: 'Quiet Dalmatian hills,',
      accent: 'twenty minutes',
      titleEnd: 'from the sea.',
      paragraphs: [
        {
          text: 'Villa San Antonio sits in the quiet village of Podine, surrounded by olive groves and karst stone. A completely private fenced estate designed for slow summer living.',
        },
        {
          text: 'Spend your mornings beside the heated pool, cook under the stars in the authentic stone BBQ house, and reach Šibenik and Krka National Park in a short drive.',
        },
      ],
      primaryImage: storyMediaA,
      secondaryImage: storyMediaB,
      stats: [
        {
          label: 'Guests capacity',
          value: 8,
          suffix: '',
          detail: 'Space for 6+2 in total comfort & privacy',
        },
        {
          label: 'Quiet bedrooms',
          value: 3,
          suffix: '',
          detail: 'Air-conditioned rooms with crisp linens',
        },
        {
          label: 'Heated pool',
          value: 36,
          suffix: 'm²',
          detail: 'Private pool with waterfall & sun deck',
        },
        {
          label: 'Fenced plot',
          value: 800,
          suffix: 'm²',
          detail: 'Mediterranean garden & stone walls',
        },
      ],
    },

    // 03 · Places & Spaces Block
    {
      blockType: 'places',
      kicker: 'Spaces & Ambience',
      title: 'Every corner tailored for',
      accent: 'shared memories.',
      items: [
        {
          name: 'The heated pool',
          tag: 'Pool & terrace',
          time: 'All day · 14:00',
          desc: '36 m² private heated pool with waterfall feature, sun loungers, and serene Dalmatian hill views.',
          image: poolMedia,
          link: '/about-villa',
          icon: 'sun',
        },
        {
          name: 'The fire room',
          tag: 'BBQ house & grill',
          time: 'After eight · 20:00',
          desc: 'Traditional stone fireplace and fully equipped dining house for long dinners under starry skies.',
          image: bbqMedia,
          link: '/about-villa',
          icon: 'flame',
        },
        {
          name: 'Three quiet rooms',
          tag: 'Master suites',
          time: 'Past midnight · 23:00',
          desc: 'Air-conditioned master suites with crisp linens, walk-in bathrooms, and total nighttime peace.',
          image: bedroomMedia,
          link: '/about-villa',
          icon: 'moon',
        },
      ],
    },

    // 04 · Gallery Strip Block
    {
      blockType: 'galleryStrip',
      kicker: 'Gallery',
      title: 'Atmosphere in',
      accent: 'still frames.',
      speed: 65,
      images: galleryMediaIds,
    },

    // 05 · Reviews Section Block
    {
      blockType: 'reviews',
      kicker: 'Guest Impressions',
      title: 'Verified words from',
      accent: 'our guests.',
      intro:
        'Authentic impressions and reviews from families, couples, and friends who spent their vacations at Villa San Antonio.',
      limit: 30,
      selectedReviews: reviewIds,
    },

    // 06 · FAQ Section Block
    {
      blockType: 'faqShort',
      kicker: 'FAQ',
      title: 'Everything you need to',
      accent: 'know before.',
      subtext:
        'Transparent answers regarding check-in, deposit terms, heated pool temperature, and local amenities.',
      items: faqIds,
    },

    // 07 · Direct Booking CTA Banner Block
    {
      blockType: 'bookingBand',
      title: 'Hold your dates',
      accent: 'for this summer.',
      body:
        'Direct contact with the owner. Best rates guaranteed, personal check-in, and zero booking commission.',
      primaryCtaLabel: 'Check Availability & Book',
      primaryCtaLink: '/booking',
      whatsappLabel: 'WhatsApp Chat',
      whatsappNumber: '+385 91 602 1899',
      hostName: 'Josip & Family',
      hostRole: 'Estate Owners & Hosts',
      hostInitials: 'JP',
      hostAvatar: findMedia('-078') || findMedia('-027'),
      hostPhone: '+385 91 602 1899',
      hostEmail: 'kontakt@villa-sanantonio.com',
      guarantees: [
        {
          icon: 'shield',
          title: 'Guaranteed Best Rate',
          desc: 'Direct owner booking with 0% platform commission fees.',
        },
        {
          icon: 'receipt',
          title: 'Transparent 30% Deposit',
          desc: 'Secure your dates now, pay the remaining balance on arrival.',
        },
        {
          icon: 'sparkles',
          title: 'Signature Host Welcome',
          desc: 'Complimentary local wine, prosciutto and fresh garden produce.',
        },
        {
          icon: 'clock',
          title: 'Direct Personal Care',
          desc: 'Personal check-in and dedicated host assistance during your stay.',
        },
      ],
    },
  ]

  // Find or create 'home' page
  const existingHome = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    limit: 1,
  })

  if (existingHome.docs.length > 0) {
    console.log('Updating Home page with full blocks layout...')
    await payload.update({
      collection: 'pages',
      id: existingHome.docs[0].id,
      data: {
        title: 'Home',
        slug: 'home',
        includeInNav: false,
        navOrder: 0,
        layout: homeLayout as unknown as Page['layout'],
        meta: {
          title: 'Villa San Antonio · Private pool villa near Šibenik, Dalmatia',
          description:
            'A fully private villa for eight guests in the Dalmatian hills near Šibenik. Heated pool, BBQ house, fenced garden, pets welcome. Book direct with 0% fees.',
        },
      },
    })
  } else {
    console.log('Creating Home page with full blocks layout...')
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        includeInNav: false,
        navOrder: 0,
        layout: homeLayout as unknown as Page['layout'],
        meta: {
          title: 'Villa San Antonio · Private pool villa near Šibenik, Dalmatia',
          description:
            'A fully private villa for eight guests in the Dalmatian hills near Šibenik. Heated pool, BBQ house, fenced garden, pets welcome. Book direct with 0% fees.',
        },
      },
    })
  }

  console.log('✅ Home Page Blocks successfully seeded into CMS!')
  process.exit(0)
}

seedHomeBlocks().catch((err) => {
  console.error('❌ Error seeding home blocks:', err)
  process.exit(1)
})
