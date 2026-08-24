import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import type { Page } from '../payload-types'

async function seedPages() {
  console.log('🌱 Starting Pages seed with HeroSubBlocks...')
  const payload = await getPayload({ config })

  // Fetch media for subpage heroes
  const mediaResult = await payload.find({
    collection: 'media',
    limit: 200,
  })
  const mediaDocs = mediaResult.docs

  const findMedia = (pattern: string) =>
    mediaDocs.find((m) => m.filename?.includes(pattern))?.id || mediaDocs[0]?.id

  const findMedias = (patterns: string[]) =>
    patterns
      .map((p) => mediaDocs.find((m) => m.filename?.includes(p))?.id)
      .filter((id): id is number => typeof id === 'number')
      .map((id) => ({ image: id }))

  const aboutHeroMedia = findMedia('-027') || mediaDocs[0]?.id
  const galleryHeroMedia = findMedia('-071') || mediaDocs[1]?.id
  const faqHeroMedia = findMedia('-005') || mediaDocs[2]?.id
  const contactHeroMedia = findMedia('-006') || mediaDocs[3]?.id
  const bookingHeroMedia = findMedia('-033') || mediaDocs[4]?.id
  const discoverHeroMedia = findMedia('-028') || mediaDocs[5]?.id
  const sharedBookingBand = {
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
  }

  const initialPages = [
    {
      title: 'Home',
      slug: 'home',
      meta: {
        title: 'Villa San Antonio · Private pool villa near Šibenik, Dalmatia',
        description:
          'A fully private villa for eight guests in the Dalmatian hills near Šibenik. Heated pool, BBQ house, fenced garden, pets welcome.',
      },
    },
    {
      title: 'About the Villa',
      slug: 'about-villa',
      layout: [
        {
          blockType: 'hero-sub',
          title: 'Three bedrooms, heated pool,',
          accent: 'total silence.',
          lead:
            'Villa San Antonio is a private family-run estate tucked in the quiet Dalmatian karst of Podine, twenty minutes from the Adriatic Sea.',
          breadcrumbLabel: 'About Villa',
          image: aboutHeroMedia,
        },
        {
          blockType: 'storyHighlights',
          kicker: 'The villa',
          title: 'One house,',
          accent: 'held for you.',
          badge: 'Podine, Šibenik · 20 min to the sea',
          showMap: true,
          mapEmbedUrl:
            'https://maps.google.com/maps?q=43.6470678,16.0546611+(Villa+San+Antonio)&hl=en&z=13&output=embed',
          mapDirectUrl: 'https://maps.app.goo.gl/Xm8sAH7drKf2pADaA',
          mapAddress: 'Podine 14, Šibenik',
          lead:
            'Welcome to Villa San Antonio, your private retreat in the peaceful Šibenik hinterland, created for guests who want complete privacy, authentic Dalmatian ambience, and effortless comfort close to the coast and Krka National Park.',
          paragraphs: [
            {
              text:
                'The villa is designed for relaxed holidays with family or friends: up to 8 guests in 3 stylish bedrooms and 4 bathrooms, bright indoor living spaces, and everything you need for a worry-free stay.',
            },
            {
              text:
                'Outside is the heart of the experience: a large heated pool with a waterfall feature, a sun deck, and a fully fenced yard that keeps the atmosphere calm, safe, and truly private.',
            },
            {
              text:
                'For unforgettable evenings, enjoy the outdoor kitchen and BBQ area, plus activities for all ages: a kids’ playground, trampoline, table tennis, bicycles and more. Private parking is on-site, and pets are welcome with a surcharge.',
            },
          ],
          highlights: [
            {
              icon: 'users',
              label: '8 Guests (6+2)',
              detail: '3 quiet master suites & 4 bathrooms',
            },
            {
              icon: 'pool',
              label: '36 m² Heated Pool',
              detail: 'Private pool with waterfall & sun deck',
            },
            {
              icon: 'flame',
              label: 'Stone BBQ House',
              detail: 'Indoor/outdoor dining & stone fireplace',
            },
            {
              icon: 'paw',
              label: '800 m² Fenced Garden',
              detail: 'Playground, bikes & pet-friendly estate',
            },
          ],
        },
        {
          blockType: 'spacesShowcase',
          kicker: 'Inside spaces',
          title: 'Light rooms,',
          accent: 'nothing missing.',
          bgStyle: 'surface',
          spaces: [
            {
              name: 'Kitchen & Dining',
              category: 'interior',
              subtitle: 'Fully equipped modern kitchen with spacious indoor dining table.',
              images: findMedias(['-032', '-033', '-034', '-035', '-036', '-037', '-038']),
              features: [
                { label: 'Stove & Oven' },
                { label: 'Refrigerator & Freezer' },
                { label: 'Dishwasher' },
                { label: 'Microwave oven' },
                { label: 'Espresso & Filter Coffee Machine' },
                { label: 'Electric kettle & Toaster' },
                { label: 'Full set of cookware & dishes' },
                { label: 'Large dining table for 8' },
                { label: 'High chair (on request)' },
              ],
            },
            {
              name: 'Living Room',
              category: 'interior',
              subtitle: 'Spacious, sunlit lounge with comfortable sofa seating and entertainment.',
              images: findMedias(['-039', '-040', '-041']),
              features: [
                { label: 'Comfortable corner sofa' },
                { label: 'Pull-out bed setup' },
                { label: 'Large SMART TV with Satellite' },
                { label: 'High-speed Wi-Fi throughout' },
                { label: 'Air conditioning' },
                { label: 'Board games for family evenings' },
              ],
            },
          ],
        },
        {
          blockType: 'spacesShowcase',
          kicker: 'Night & morning',
          title: 'Rest well,',
          accent: 'wake unhurried.',
          bgStyle: 'paper',
          spaces: [
            {
              name: 'Master Bedroom',
              category: 'bedrooms',
              subtitle: 'Master suite with private ensuite bathroom and tranquil hill views.',
              images: findMedias(['-056', '-057', '-058', '-059', '-060']),
              features: [
                { label: 'King size double bed (180x200)' },
                { label: 'En-suite bathroom with walk-in shower' },
                { label: 'Air conditioning unit' },
                { label: 'Spacious wardrobe' },
                { label: 'Premium hotel bed linen' },
                { label: 'Blackout curtains' },
              ],
            },
            {
              name: 'Bedroom Two',
              category: 'bedrooms',
              subtitle: 'Bright double bedroom overlooking the private gardens.',
              images: findMedias(['-046', '-047', '-048', '-049']),
              features: [
                { label: 'Queen size double bed' },
                { label: 'Air conditioning' },
                { label: 'Wardrobe & storage' },
                { label: 'Garden view window' },
                { label: 'Fresh linen & extra pillows' },
              ],
            },
            {
              name: 'Bedroom Three',
              category: 'bedrooms',
              subtitle: 'Quiet double bedroom designed for deep, peaceful sleep.',
              images: findMedias(['-042', '-043', '-044', '-045']),
              features: [
                { label: 'Double bed' },
                { label: 'Air conditioning' },
                { label: 'Wardrobe' },
                { label: 'Hillside view' },
                { label: 'Bedside reading lights' },
              ],
            },
            {
              name: 'Bathrooms',
              category: 'bathrooms',
              subtitle: 'Four pristine bathrooms including walk-in showers and guest toilet.',
              images: findMedias(['-030', '-031', '-050', '-051', '-052', '-061', '-062']),
              features: [
                { label: 'Walk-in rainfall shower' },
                { label: 'Soft cotton bath & pool towels' },
                { label: 'Hairdryer in each bathroom' },
                { label: 'Washing machine & iron' },
                { label: 'Complimentary toiletries' },
              ],
            },
          ],
        },
        {
          blockType: 'spacesShowcase',
          kicker: 'Outdoors & leisure',
          title: 'Sun, stone,',
          accent: 'and starry nights.',
          bgStyle: 'surface',
          spaces: [
            {
              name: 'Stone BBQ House',
              category: 'bbq-house',
              subtitle: 'Authentic Dalmatian stone tavern with open grill fireplace and dining table.',
              images: findMedias(['-075', '-076', '-077', '-078', '-079', '-080', '-081']),
              features: [
                { label: 'Traditional Dalmatian peka fireplace' },
                { label: 'Wood & charcoal grill equipment' },
                { label: 'Solid wood dining table for 8+' },
                { label: 'Summer kitchen prep area & sink' },
                { label: 'Dedicated beverage refrigerator' },
              ],
            },
            {
              name: 'Heated Pool & Sun Terrace',
              category: 'outside',
              subtitle: '36 m² private heated pool with soothing waterfall and sun deck.',
              images: findMedias(['-001', '-002', '-003', '-004', '-026', '-027', '-087', '-088']),
              features: [
                { label: '36 m² private heated swimming pool' },
                { label: 'Waterfall massage feature' },
                { label: '8 comfortable sun loungers & parasols' },
                { label: 'Outdoor solar shower' },
                { label: 'Stone sun terrace with ambient night lighting' },
              ],
            },
            {
              name: 'Garden & Playground',
              category: 'outside',
              subtitle: '800 m² fully fenced estate with games and children’s playground.',
              images: findMedias(['-011', '-012', '-013', '-014', '-015', '-016', '-017']),
              features: [
                { label: '800 m² private fenced garden (safe for kids & pets)' },
                { label: 'Children playground & trampoline' },
                { label: 'Table tennis setup' },
                { label: '4 bicycles for exploring local trails' },
                { label: 'Private gated parking on site' },
              ],
            },
          ],
        },
        {
          blockType: 'welcomePackage',
          kicker: 'Welcome package',
          headline: 'A welcome worthy',
          accent: 'of the drive.',
          body:
            'Start your vacation with our exclusive Welcome Package, featuring homemade brandy, fine wine, prosciutto and cheese. This perfect combination of local delicacies offers an authentic experience and immediately immerses you in the pleasures of our region. Ideal for relaxation and socializing, making it the perfect start to your holiday.',
          delicacies: [
            { label: 'Homemade brandy' },
            { label: 'Fine local wine' },
            { label: 'Dalmatian prosciutto' },
            { label: 'Artisan cheese' },
          ],
          imageMain: findMedia('-088'),
          imageTop: findMedia('-078'),
          imageBottom: findMedia('-072'),
        },
        {
          blockType: 'distances',
          kicker: 'Distances',
          title: 'Quietly placed,',
          accent: 'close to everything.',
          items: [
            { value: '14 km', label: 'Nearest beach' },
            { value: '18 km', label: 'Šibenik old town' },
            { value: '25 km', label: 'National Park Krka' },
            { value: '28 km', label: 'Trogir' },
            { value: '31 km', label: 'Split airport' },
          ],
        },
        sharedBookingBand,
      ],
      meta: {
        title: 'About the Villa · Villa San Antonio Šibenik',
        description:
          'Heated pool with waterfall, BBQ house with fireplace, three quiet bedrooms and a fully fenced garden. Everything Villa San Antonio offers.',
      },
    },
    {
      title: 'Gallery',
      slug: 'gallery',
      layout: [
        {
          blockType: 'hero-sub',
          title: 'Atmosphere in',
          accent: 'still frames.',
          lead:
            '80+ moments of summer at Villa San Antonio. The pool at noon, the fire room at dusk, and the quiet hills all around.',
          breadcrumbLabel: 'Gallery',
          image: galleryHeroMedia,
        },
        sharedBookingBand,
      ],
      meta: {
        title: 'Gallery · Villa San Antonio Šibenik',
        description:
          'The pool at dusk, the BBQ evenings, the quiet bedrooms. Browse through the whole of Villa San Antonio in photographs.',
      },
    },
    {
      title: 'FAQ',
      slug: 'faq',
      layout: [
        {
          blockType: 'hero-sub',
          title: 'Clear answers for your',
          accent: 'summer stay.',
          lead:
            'Check-in times, pool heating, pet policy, booking terms, and directions. Everything you need to know in one place.',
          breadcrumbLabel: 'FAQ',
          image: faqHeroMedia,
        },
        {
          blockType: 'faqSection',
          leftKicker: 'At a glance',
          leftTitle: 'Key facts',
          leftAccent: 'before arrival.',
          leftLead:
            'Quick summary of our key house standards and amenities to help you plan your Dalmatian holiday.',
          quickFacts: [
            {
              icon: 'clock',
              title: 'Check-in / Check-out',
              value: '16:00 / 10:00',
              subtitle: 'Flexible upon prior request',
            },
            {
              icon: 'shield',
              title: 'Private Parking',
              value: '3 Covered Spaces',
              subtitle: 'Free gated on-site parking',
            },
            {
              icon: 'pool',
              title: 'Heated Pool',
              value: '36 m² with Waterfall',
              subtitle: 'Private & illuminated at night',
            },
            {
              icon: 'paw',
              title: 'Pets & Garden',
              value: 'Welcome on Request',
              subtitle: '800 m² fully fenced estate',
            },
          ],
          rightKicker: 'House Guide & Details',
          rightTitle: 'Frequently asked',
          rightAccent: 'questions.',
          rightLead:
            'Everything you need to know about staying at Villa San Antonio. Filter by category or search below.',
        },
        sharedBookingBand,
      ],
      meta: {
        title: 'FAQ · Villa San Antonio Šibenik',
        description:
          'Parking, WiFi, booking, payment and cancellation terms for Villa San Antonio, answered in one place.',
      },
    },
    {
      title: 'Contact Us',
      slug: 'contact-us',
      layout: [
        {
          blockType: 'hero-sub',
          title: 'Direct line to your',
          accent: 'Dalmatian hosts.',
          lead:
            'Reach out to Josip and the family directly for special requests, flexible dates, and instant local assistance.',
          breadcrumbLabel: 'Contact',
          image: contactHeroMedia,
        },
        {
          blockType: 'contactSection',
          kicker: '',
          title: 'Get in',
          accent: 'touch.',
          lead: 'We answer every message personally, usually within 30 minutes.',
          email: 'kontakt@villa-sanantonio.com',
          phone: '+385 91 602 1899',
          whatsappNumber: '+385 91 602 1899',
          whatsappLabel: 'Chat on WhatsApp',
          locationAddress: 'Podine 14, 22000 Šibenik, Dalmatia · Croatia',
          googleMapsUrl: 'https://maps.app.goo.gl/Xm8sAH7drKf2pADaA',
          showFaqCard: true,
          faqCardTitle: 'Need immediate answers?',
          faqCardText: 'Check our house guide for check-in hours, heated pool details, and pet rules.',
          faqCardLinkLabel: 'Browse Frequently Asked Questions',
          faqCardLinkUrl: '/faq',
          enableMap: true,
          mapLatitude: 43.6470678,
          mapLongitude: 16.0546611,
          mapZoom: 13,
        },
        sharedBookingBand,
      ],
      meta: {
        title: 'Contact Us · Villa San Antonio Šibenik',
        description:
          'Questions or special requests for Villa San Antonio? Write to us and get a personal reply from the host.',
      },
    },
    {
      title: 'Direct Booking & Availability',
      slug: 'booking',
      layout: [
        {
          blockType: 'hero-sub',
          title: 'Direct booking with',
          accent: '0% fees.',
          lead:
            'Reserve Villa San Antonio directly with the owners. Best rate guaranteed, personal check-in, transparent 30% deposit, and instant booking confirmation.',
          breadcrumbLabel: 'Booking',
          image: bookingHeroMedia,
        },
        {
          blockType: 'bookingSection',
          stepsTitle: 'How direct reservation works',
          steps: [
            {
              num: '01',
              title: 'Select Your Dates',
              desc: 'Pick your preferred arrival and departure dates on the live calendar.',
            },
            {
              num: '02',
              title: 'Send Direct Inquiry',
              desc: 'No instant credit card charges and zero platform booking commissions.',
            },
            {
              num: '03',
              title: 'Confirm with Josip',
              desc: '30% deposit secures your reservation; pay the remaining balance on arrival.',
            },
          ],
          privilegesTitle: 'Direct booking privileges',
          privileges: [
            {
              icon: 'shield',
              title: 'Guaranteed Best Rate',
              desc: 'Save 15–20% compared to third-party agency platforms.',
            },
            {
              icon: 'sparkles',
              title: 'Personal Welcome Gift',
              desc: 'Local Dalmatian wine, prosciutto & garden produce upon arrival.',
            },
            {
              icon: 'clock',
              title: 'Fast Direct Response',
              desc: 'Direct communication with Josip with typical replies in under 1 hour.',
            },
          ],
          hostName: 'Josip & Family',
          hostSubtitle: 'Estate Owners & Hosts',
          badgeText: 'Fast Reply',
          whatsappLabel: 'WhatsApp Chat',
          whatsappNumber: '+385 91 602 1899',
          phone: '+385 91 602 1899',
          email: 'kontakt@villa-sanantonio.com',
        },
      ],
      meta: {
        title: 'Direct Booking & Availability · Villa San Antonio Šibenik',
        description:
          'Book Villa San Antonio directly with the owner for guaranteed best rates, 0% booking fees, and live availability.',
      },
    },
    {
      title: 'Discover Dalmatia & Local Area',
      slug: 'discover',
      layout: [
        {
          blockType: 'hero-sub',
          title: 'Discover the best of',
          accent: 'Dalmatia.',
          lead:
            'Positioned in the peaceful Šibenik hinterland, Villa San Antonio is the ultimate gateway to Krka National Park, Adriatic beaches, UNESCO heritage, and authentic local flavours.',
          breadcrumbLabel: 'Discover',
          image: discoverHeroMedia,
        },
        {
          blockType: 'discoverSection',
          kicker: 'Dalmatian Riviera & Hinterland',
          title: 'Between cascading waterfalls,',
          accent: 'historic forts & Adriatic sea.',
          lead:
            'From cascading national park waterfalls and UNESCO stone fortresses to secluded island coves and authentic wine cellars — all within minutes of Villa San Antonio.',
          conciergeTitle: 'Personal Host Recommendations & Concierge',
          conciergeText:
            'Josip and the family can personally arrange private boat excursions to Kornati, authentic peka dinners, winery visits, or provide insider cycling and hiking routes starting right from the villa.',
          conciergeButtonLabel: 'Ask Josip on WhatsApp',
          conciergePhone: '+385 91 602 1899',
        },
        sharedBookingBand,
      ],
      meta: {
        title: 'Discover Šibenik, Krka & Dalmatia · Villa San Antonio',
        description:
          'Explore the top attractions around Villa San Antonio: Krka National Park waterfalls, UNESCO fortresses, Kornati boat tours, Primošten vineyards, and pristine Adriatic beaches.',
      },
    },
  ]

  for (const pageData of initialPages) {
    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: pageData.slug,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`Updating existing page: ${pageData.slug}`)
      // preserve existing Home layout if already seeded
      const dataToSave =
        pageData.slug === 'home' && existing.docs[0].layout && existing.docs[0].layout.length > 0
          ? { ...pageData, layout: existing.docs[0].layout }
          : pageData

      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: dataToSave as unknown as Page,
      })
    } else {
      console.log(`Creating new page: ${pageData.slug}`)
      await payload.create({
        collection: 'pages',
        data: pageData as unknown as Page,
      })
    }
  }

  console.log('✅ All Pages & HeroSubBlocks seeded successfully!')
  process.exit(0)
}

seedPages().catch((err) => {
  console.error('❌ Error seeding pages:', err)
  process.exit(1)
})
