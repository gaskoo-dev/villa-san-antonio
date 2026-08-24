import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const CATEGORIES_DATA = [
  {
    name: 'Arrival & Stay',
    slug: 'stay',
    sortOrder: 1,
  },
  {
    name: 'Pool & Amenities',
    slug: 'pool',
    sortOrder: 2,
  },
  {
    name: 'Booking & Payment',
    slug: 'booking',
    sortOrder: 3,
  },
  {
    name: 'House Rules & Pets',
    slug: 'rules',
    sortOrder: 4,
  },
]

const FAQ_ITEMS_DATA = [
  // --- ARRIVAL & STAY ---
  {
    question: 'Where is Villa San Antonio located and how far are the beaches?',
    answer:
      'Villa San Antonio is situated in the peaceful Dalmatian countryside of Podine near Šibenik. The nearest crystal-clear beaches in Žaborić, Grebaštica, and Primošten are just a 10–15 minute drive away. Krka National Park is 25 minutes away, and Split and Zadar airports are approximately 45 minutes by car.',
    categorySlug: 'stay',
    sortOrder: 1,
  },
  {
    question: 'What are the check-in and check-out times?',
    answer:
      'Check-in is from 16:00 (4:00 PM) and check-out is until 10:00 (10:00 AM). Early check-in or late check-out is available upon prior request, subject to availability.',
    categorySlug: 'stay',
    sortOrder: 2,
  },
  {
    question: 'Do the owners live on the property or share any spaces?',
    answer:
      'No, the owners do not live on the property. When you stay at Villa San Antonio, you have 100% complete privacy across the entire house, pool, and 800 m² fenced grounds. Your host Josip is always reachable via phone or WhatsApp for recommendations or assistance.',
    categorySlug: 'stay',
    sortOrder: 3,
  },
  {
    question: 'How many guests can Villa San Antonio accommodate?',
    answer:
      'Villa San Antonio comfortably accommodates up to 8 guests. It features 3 spacious bedrooms with premium king-sized beds, plus additional comfortable sleeping options in the living area.',
    categorySlug: 'stay',
    sortOrder: 4,
  },
  {
    question: 'Is it possible to book only one room or apartment?',
    answer:
      'No, Villa San Antonio is rented exclusively as a whole private villa to a single group at a time. You will never share the heated pool, BBQ house, or grounds with any other guests.',
    categorySlug: 'stay',
    sortOrder: 5,
  },
  {
    question: 'Does Villa San Antonio have private covered parking?',
    answer:
      'Yes, we provide covered, private parking for up to 3 vehicles directly inside the gated and fully fenced estate, with additional secure parking space available on site.',
    categorySlug: 'stay',
    sortOrder: 6,
  },

  // --- POOL & AMENITIES ---
  {
    question: 'Is the private swimming pool heated, and is heating included?',
    answer:
      'Yes, the 36 m² private pool features active water heating and a soothing waterfall massage nozzle. Pool heating is complimentary and included in the rental price throughout your entire stay.',
    categorySlug: 'pool',
    sortOrder: 7,
  },
  {
    question: 'Is the stone BBQ house fully equipped for dining?',
    answer:
      'Yes! The authentic Dalmatian stone konoba features a traditional wood-fired fireplace for grilling and peka, preparation counter with sink, large rustic dining table for 8+, firewood, and a dedicated drinks refrigerator.',
    categorySlug: 'pool',
    sortOrder: 8,
  },
  {
    question: 'Are bed linens, bath towels, and pool towels provided?',
    answer:
      'Yes, fresh luxury bed linens, plush bath towels, and pool loungers towels are provided for all guests upon arrival. A washing machine, drying rack, and ironing set are also available free of charge.',
    categorySlug: 'pool',
    sortOrder: 9,
  },
  {
    question: 'Is the villa fully air-conditioned and heated?',
    answer:
      'Yes, the villa is equipped with modern, individually controlled inverter air-conditioning units in all bedrooms and the main living space for optimal cooling and heating.',
    categorySlug: 'pool',
    sortOrder: 10,
  },
  {
    question: 'Does the villa have high-speed Wi-Fi for remote work?',
    answer:
      'Yes, high-speed Wi-Fi covers the entire interior of the villa, all bedrooms, the living room, and the outdoor pool lounge terrace.',
    categorySlug: 'pool',
    sortOrder: 11,
  },

  // --- BOOKING & PAYMENT ---
  {
    question: 'How do I book my stay directly with 0% commission fees?',
    answer:
      'You can submit a booking inquiry on our website or contact Josip directly via WhatsApp. Direct owner bookings guarantee the absolute best rate with zero booking fees or OTA commissions.',
    categorySlug: 'booking',
    sortOrder: 12,
  },
  {
    question: 'What is the deposit and payment schedule?',
    answer:
      'A 30% advance deposit confirms your reservation dates. The remaining 70% balance is settled upon your arrival at the villa during check-in.',
    categorySlug: 'booking',
    sortOrder: 13,
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Advance deposits can be paid via SEPA bank transfer or supported online payments. The balance upon arrival can be paid in cash (EUR) or instant transfer.',
    categorySlug: 'booking',
    sortOrder: 14,
  },
  {
    question: 'Do I need to leave a refundable security deposit?',
    answer:
      'A standard €300 refundable security deposit is held upon check-in to cover accidental damage and is fully refunded upon check-out after a routine inspection.',
    categorySlug: 'booking',
    sortOrder: 15,
  },
  {
    question: 'What is the cancellation and rescheduling policy?',
    answer:
      'If your travel plans change up to 30 days prior to your arrival date, your deposit is fully refundable or can be transferred to any other available dates in the calendar.',
    categorySlug: 'booking',
    sortOrder: 16,
  },

  // --- HOUSE RULES & PETS ---
  {
    question: 'Are pets allowed at Villa San Antonio?',
    answer:
      'Yes, well-behaved dogs and family pets are warmly welcome upon prior request. The entire 800 m² property is fully enclosed and fenced, providing a safe playground for your pets.',
    categorySlug: 'rules',
    sortOrder: 17,
  },
  {
    question: 'Do you provide a baby crib and high chair for families with young children?',
    answer:
      'Yes! We are happy to provide a baby travel crib and a dining high chair free of charge upon request to ensure a comfortable stay for families with infants or toddlers.',
    categorySlug: 'rules',
    sortOrder: 18,
  },
]

async function seedFaqCategoriesAndItems() {
  console.log('🌱 Seeding 18 comprehensive FAQ Categories & Items...')
  const payload = await getPayload({ config })

  // 1. Seed or find categories
  const categoryMap = new Map<string, number>()

  for (const cat of CATEGORIES_DATA) {
    const existing = await payload.find({
      collection: 'faq-categories',
      where: {
        slug: { equals: cat.slug },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`Found existing category: ${cat.name} (${existing.docs[0].id})`)
      categoryMap.set(cat.slug, existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'faq-categories',
        data: cat,
      })
      console.log(`Created category: ${cat.name} (${created.id})`)
      categoryMap.set(cat.slug, created.id)
    }
  }

  // 2. Clear old items
  const existingItems = await payload.find({
    collection: 'faq-items',
    limit: 100,
  })

  for (const doc of existingItems.docs) {
    await payload.delete({
      collection: 'faq-items',
      id: doc.id,
    })
  }

  // 3. Create all 18 new FAQ items
  let createdCount = 0
  for (const item of FAQ_ITEMS_DATA) {
    const categoryId = categoryMap.get(item.categorySlug)
    await payload.create({
      collection: 'faq-items',
      data: {
        question: item.question,
        answer: item.answer,
        category: categoryId,
        sortOrder: item.sortOrder,
      },
    })
    createdCount++
  }

  console.log(`✅ Successfully seeded ${createdCount} comprehensive FAQ items!`)
  process.exit(0)
}

seedFaqCategoriesAndItems().catch((err) => {
  console.error('❌ Error seeding FAQ items:', err)
  process.exit(1)
})
