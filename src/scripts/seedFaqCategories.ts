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
  {
    question: 'What are the check-in and check-out times?',
    answer:
      'Check-in is from 16:00 (4:00 PM) and check-out is until 10:00 (10:00 AM). Early arrival or late departure is available upon prior request, depending on calendar schedule.',
    categorySlug: 'stay',
    sortOrder: 1,
  },
  {
    question: 'Does Villa San Antonio have private covered parking?',
    answer:
      'Yes, we provide covered, private parking space for 3 vehicles directly inside the gated and fully fenced estate. Additional vehicle parking is available on site.',
    categorySlug: 'stay',
    sortOrder: 2,
  },
  {
    question: 'Is the private swimming pool heated, and is heating included?',
    answer:
      'Yes, the 36 m² private pool features active water heating and a soothing waterfall massage nozzle. Heating is complimentary and included in your stay.',
    categorySlug: 'pool',
    sortOrder: 3,
  },
  {
    question: 'Does the villa have high-speed Wi-Fi for remote work?',
    answer:
      'Yes, high-speed Wi-Fi covers the entire interior of the villa, all master bedrooms, the living room, and the outdoor pool lounge terrace.',
    categorySlug: 'stay',
    sortOrder: 4,
  },
  {
    question: 'How do I book my stay directly with 0% fees?',
    answer:
      'You can submit a booking inquiry on our website or contact Josip directly via WhatsApp. Direct owner reservations guarantee the lowest price with zero platform commission fees.',
    categorySlug: 'booking',
    sortOrder: 5,
  },
  {
    question: 'What is the deposit and payment policy?',
    answer:
      'A 30% advance deposit secures your dates upon confirmation. The remaining 70% balance is settled on the day of arrival during personal check-in.',
    categorySlug: 'booking',
    sortOrder: 6,
  },
  {
    question: 'Can I pay by credit card or bank transfer?',
    answer:
      'Yes, advance deposits can be transferred via standard SEPA bank transfer or supported online payments. The balance on arrival can be paid in cash or instant transfer.',
    categorySlug: 'booking',
    sortOrder: 7,
  },
  {
    question: 'Do I need to leave a refundable security deposit?',
    answer:
      'A standard €300 refundable security deposit is held upon check-in and fully returned on check-out after a routine inspection of the estate.',
    categorySlug: 'booking',
    sortOrder: 8,
  },
  {
    question: 'Are pets allowed at Villa San Antonio?',
    answer:
      'Yes, well-behaved dogs and pets are warmly welcome upon prior arrangement. The entire 800 m² garden is fully fenced and safe for pets.',
    categorySlug: 'rules',
    sortOrder: 9,
  },
  {
    question: 'Is the stone BBQ house fully equipped for dining?',
    answer:
      'Yes! The authentic stone tavern features a traditional Dalmatian grill/peka fireplace, firewood, preparation counter with sink, dining table for 8+, and dedicated drinks fridge.',
    categorySlug: 'pool',
    sortOrder: 10,
  },
  {
    question: 'What is the cancellation and rescheduling policy?',
    answer:
      'If your travel plans change up to 30 days prior to arrival, your deposit can be refunded or transferred to another available date period.',
    categorySlug: 'booking',
    sortOrder: 11,
  },
]

async function seedFaqCategoriesAndItems() {
  console.log('🌱 Seeding FAQ Categories & Items...')
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

  // 2. Re-create / link FAQ Items
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

  for (const item of FAQ_ITEMS_DATA) {
    const categoryId = categoryMap.get(item.categorySlug)
    await payload.create({
      collection: 'faq-items',
      data: {
        question: item.question,
        answer: item.answer,
        category: categoryId ?? null,
        sortOrder: item.sortOrder,
      },
    })
  }

  console.log(`✅ Successfully seeded ${CATEGORIES_DATA.length} categories and ${FAQ_ITEMS_DATA.length} FAQ items!`)
  process.exit(0)
}

seedFaqCategoriesAndItems().catch((err) => {
  console.error('❌ Error seeding FAQ categories and items:', err)
  process.exit(1)
})
