// Static marketing copy (migrated from villa-sanantonio.com) and site constants.
// Dynamic collections (reviews, FAQ, gallery, amenities, settings) live in Payload.

const configuredSiteUrl =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://villa-sanantonio.com'

function normalizeSiteUrl(value: string): string {
  const trimmed = value.trim()
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  const url = new URL(candidate)

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`SITE_URL must use http or https, received "${url.protocol}"`)
  }

  const pathname = url.pathname.replace(/\/+$/, '')
  return `${url.origin}${pathname}`
}

export const SITE_URL = normalizeSiteUrl(configuredSiteUrl)
export const SITE_NAME = 'Villa San Antonio'
export const CONTACT_EMAIL = 'kontakt@villa-sanantonio.com'
export const CONTACT_PHONE = '+385 91 602 1899'

export const NAV_LINKS = [
  { href: '/about-villa', label: 'About Villa' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/discover', label: 'Discover' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact-us', label: 'Contact' },
] as const

export const BOOKING_ANCHOR = '/booking'
export const PRIMARY_CTA_LABEL = 'Check availability'

export const HERO = {
  headline: 'Your private oasis in the Dalmatian hills',
  subtext:
    'A fully private villa for eight near Šibenik, with a heated pool, BBQ house and a fenced garden made for slow days.',
} as const

export const VILLA_STORY = [
  'Villa San Antonio is a premium private holiday villa for 6+2 guests, set in a quiet Dalmatian village near Šibenik. Designed for comfort and complete privacy, the villa is perfect for families and friends who want a relaxed stay close to the coast.',
  'Enjoy a heated pool, jacuzzi, and a fully equipped outdoor kitchen and BBQ for long summer lunches and evenings under the stars. Private parking is available on-site, and the villa is pet-friendly, so your four-legged family members are welcome too.',
  'With beaches, restaurants and Šibenik\u2019s attractions within easy reach, the villa is an ideal base for exploring the region, while still feeling like your own private oasis.',
] as const

export const EXPERIENCE = {
  headline: 'More than a stay. Your private Dalmatian experience.',
  lead: 'Not just a place to sleep, but a place to truly switch off. Tucked away in a peaceful village, the villa offers complete privacy, space, and the freedom to enjoy your holiday exactly your way.',
  body: 'Start the day with coffee by the pool, spend afternoons in the sun while the kids play, and gather in the evening for BBQ dinners under the stars. No crowds, no noise. Just your people, your pace.',
  moments: [
    'Wake up in total peace',
    'Relax in your private heated pool',
    'Enjoy long summer nights outdoors',
    'Explore beaches and nature minutes away',
    'On-site covered parking',
  ],
  closing: 'The best dates fill up quickly. Secure your stay and experience Dalmatia the way it\u2019s meant to be.',
} as const

export const GALLERY_INTRO = 'Discover the spaces, the details, and the views.' as const

export const CONTACT_INTRO = 'Questions? Special requests? Send us a message.' as const

export const REVIEWS_INTRO =
  'Read real experiences from guests who have stayed at the villa, so you can book with confidence.' as const

export const WELCOME_PACKAGE = {
  kicker: 'Welcome package',
  headline: 'A welcome worthy of the drive',
  accent: 'local flavors on arrival.',
  body:
    'Start your vacation with our exclusive Welcome Package, featuring homemade brandy, fine wine, prosciutto and cheese. This perfect combination of local delicacies offers an authentic experience and immediately immerses you in the pleasures of our region. Ideal for relaxation and socializing, making it the perfect start to your holiday.',
  delicacies: [
    { label: 'Homemade brandy' },
    { label: 'Fine local wine' },
    { label: 'Dalmatian prosciutto' },
    { label: 'Artisan cheese' },
  ],
} as const

export const ABOUT_INTRO = [
  'Welcome to Villa San Antonio, your private retreat in the peaceful Šibenik hinterland, created for guests who want complete privacy, authentic Dalmatian ambience, and effortless comfort close to the coast and Krka National Park.',
  'The villa is designed for relaxed holidays with family or friends: up to 8 guests in 3 stylish bedrooms and 4 bathrooms, bright indoor living spaces, and everything you need for a worry-free stay.',
  'Outside is the heart of the experience: a large heated pool with a waterfall feature, a sun deck, and a fully fenced yard that keeps the atmosphere calm, safe, and truly private.',
  'For unforgettable evenings, enjoy the outdoor kitchen and BBQ area, plus activities for all ages: a kids\u2019 playground, trampoline, table tennis, bicycles and more. Private parking is on-site, and pets are welcome with a surcharge.',
] as const
