import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const FAQ_DATA: Array<{
  question: string
  answer: string
  category: 'stay' | 'pool' | 'booking' | 'rules'
  sortOrder: number
}> = [
  {
    question: 'What are the check-in and check-out times?',
    answer:
      'Check-in is from 16:00 (4:00 PM) and check-out is until 10:00 (10:00 AM). Early arrival or late departure is available upon prior request, depending on calendar schedule.',
    category: 'stay',
    sortOrder: 1,
  },
  {
    question: 'Does Villa San Antonio have private covered parking?',
    answer:
      'Yes, we provide covered, private parking space for 3 vehicles directly inside the gated and fully fenced estate. Additional vehicle parking is available on site.',
    category: 'stay',
    sortOrder: 2,
  },
  {
    question: 'Is the private swimming pool heated, and is heating included?',
    answer:
      'Yes, the 36 m² private pool features active water heating and a soothing waterfall massage nozzle. Heating is complimentary and included in your stay.',
    category: 'pool',
    sortOrder: 3,
  },
  {
    question: 'Does the villa have high-speed Wi-Fi for remote work?',
    answer:
      'Yes, high-speed Wi-Fi covers the entire interior of the villa, all master bedrooms, the living room, and the outdoor pool lounge terrace.',
    category: 'stay',
    sortOrder: 4,
  },
  {
    question: 'How do I book my stay directly with 0% fees?',
    answer:
      'You can submit a booking inquiry on our website or contact Josip directly via WhatsApp. Direct owner reservations guarantee the lowest price with zero platform commission fees.',
    category: 'booking',
    sortOrder: 5,
  },
  {
    question: 'What is the deposit and payment policy?',
    answer:
      'A 30% advance deposit secures your dates upon confirmation. The remaining 70% balance is settled on the day of arrival during personal check-in.',
    category: 'booking',
    sortOrder: 6,
  },
  {
    question: 'Can I pay by credit card or bank transfer?',
    answer:
      'Yes, advance deposits can be transferred via standard SEPA bank transfer or supported online payments. The balance on arrival can be paid in cash or instant transfer.',
    category: 'booking',
    sortOrder: 7,
  },
  {
    question: 'Do I need to leave a refundable security deposit?',
    answer:
      'A standard €300 refundable security deposit is held upon check-in and fully returned on check-out after a routine inspection of the estate.',
    category: 'booking',
    sortOrder: 8,
  },
  {
    question: 'Are pets allowed at Villa San Antonio?',
    answer:
      'Yes, well-behaved dogs and pets are warmly welcome upon prior arrangement. The entire 800 m² garden is fully fenced and safe for pets.',
    category: 'rules',
    sortOrder: 9,
  },
  {
    question: 'Is the stone BBQ house fully equipped for dining?',
    answer:
      'Yes! The authentic stone tavern features a traditional Dalmatian grill/peka fireplace, firewood, preparation counter with sink, dining table for 8+, and dedicated drinks fridge.',
    category: 'pool',
    sortOrder: 10,
  },
  {
    question: 'What is the cancellation and rescheduling policy?',
    answer:
      'If your travel plans change up to 30 days prior to arrival, your deposit can be refunded or transferred to another available date period.',
    category: 'booking',
    sortOrder: 11,
  },
]

async function seedFaqItems() {
  console.log('🌱 Seeding rich categorized FAQ items into Payload CMS...')
  const payload = await getPayload({ config })

  // Delete existing faq items to avoid duplicates
  const existing = await payload.find({
    collection: 'faq-items',
    limit: 100,
  })

  for (const doc of existing.docs) {
    await payload.delete({
      collection: 'faq-items',
      id: doc.id,
    })
  }

  for (const item of FAQ_DATA) {
    await payload.create({
      collection: 'faq-items',
      data: item,
    })
  }

  console.log(`✅ Successfully seeded ${FAQ_DATA.length} categorized FAQ items!`)
  process.exit(0)
}

seedFaqItems().catch((err) => {
  console.error('❌ Error seeding FAQ items:', err)
  process.exit(1)
})
