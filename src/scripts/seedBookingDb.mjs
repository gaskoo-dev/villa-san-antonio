import pg from '../../node_modules/.pnpm/pg@8.20.0/node_modules/pg/lib/index.js'
import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
})

async function run() {
  await client.connect()
  console.log('Connected to PostgreSQL')

  const existing = await client.query(`
    SELECT id FROM pages_blocks_booking_section WHERE _parent_id = 6
  `)
  console.log('Existing blocks for parent 6:', existing.rows)

  if (existing.rows.length === 0) {
    const blockId = crypto.randomUUID()
    await client.query(`
      INSERT INTO pages_blocks_booking_section (
        id, _order, _parent_id, _path,
        steps_title, privileges_title, host_name, host_subtitle,
        badge_text, whatsapp_label, whatsapp_number, phone, email
      ) VALUES (
        $1, 2, 6, 'layout',
        'How direct reservation works',
        'Direct booking privileges',
        'Josip & Family',
        'Estate Owners & Hosts',
        'Fast Reply',
        'WhatsApp Chat',
        '+385 91 602 1899',
        '+385 91 602 1899',
        'kontakt@villa-sanantonio.com'
      )
    `, [blockId])
    console.log('Created booking_section block with ID:', blockId)

    // Insert steps
    const steps = [
      { num: '01', title: 'Select Your Dates', desc: 'Pick your preferred arrival and departure dates on the live calendar.' },
      { num: '02', title: 'Send Direct Inquiry', desc: 'No instant credit card charges and zero platform booking commissions.' },
      { num: '03', title: 'Confirm with Josip', desc: '30% deposit secures your reservation; pay the remaining balance on arrival.' },
    ]

    for (let i = 0; i < steps.length; i++) {
      const stepId = crypto.randomUUID()
      await client.query(`
        INSERT INTO pages_blocks_booking_section_steps (
          id, _order, _parent_id, num, title, "desc"
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [stepId, i + 1, blockId, steps[i].num, steps[i].title, steps[i].desc])
    }

    // Insert privileges
    const privileges = [
      { icon: 'shield', title: 'Guaranteed Best Rate', desc: 'Save 15–20% compared to third-party agency platforms.' },
      { icon: 'sparkles', title: 'Personal Welcome Gift', desc: 'Local Dalmatian wine, prosciutto & garden produce upon arrival.' },
      { icon: 'clock', title: 'Fast Direct Response', desc: 'Direct communication with Josip with typical replies in under 1 hour.' },
    ]

    for (let i = 0; i < privileges.length; i++) {
      const privId = crypto.randomUUID()
      await client.query(`
        INSERT INTO pages_blocks_booking_section_privileges (
          id, _order, _parent_id, icon, title, "desc"
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [privId, i + 1, blockId, privileges[i].icon, privileges[i].title, privileges[i].desc])
    }

    console.log('Successfully seeded bookingSection block, steps, and privileges into PostgreSQL!')
  } else {
    console.log('Block already exists, ID:', existing.rows[0].id)
  }

  await client.end()
}

run().catch(console.error)
