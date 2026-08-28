import type { CollectionAfterChangeHook } from 'payload'

import type { BookingInquiry, ContactMessage } from '@/payload-types'
import { SITE_URL } from '@/lib/content'

const MAIL_STYLE = `
  color: #1c211d;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  line-height: 1.55;
`

function isEmailNotificationConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      process.env.SMTP_FROM_EMAIL?.trim(),
  )
}

function bookingNotificationRecipient(): string {
  return process.env.BOOKING_NOTIFICATION_EMAIL?.trim() || 'booking@villa-sanantonio.com'
}

function contactNotificationRecipient(): string {
  return process.env.CONTACT_NOTIFICATION_EMAIL?.trim() || 'kontakt@villa-sanantonio.com'
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function oneLine(value: unknown, fallback = '—'): string {
  const normalized = String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()

  return normalized || fallback
}

function formatDate(value: unknown): string {
  const raw = oneLine(value)
  if (raw === '—') return raw

  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw

  return new Intl.DateTimeFormat('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/Zagreb',
    year: 'numeric',
  }).format(date)
}

function adminRecordUrl(collection: string, id: number | string): string {
  return new URL(`/admin/collections/${collection}/${id}`, SITE_URL).toString()
}

function emailShell(title: string, content: string, adminUrl: string): string {
  return `<!doctype html>
<html lang="hr">
  <body style="margin:0;background:#f3f1eb;padding:24px;${MAIL_STYLE}">
    <div style="margin:0 auto;max-width:680px;overflow:hidden;border:1px solid #ddd8cc;border-radius:18px;background:#ffffff;">
      <div style="background:#1c211d;padding:24px 28px;color:#ffffff;">
        <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.72;">Villa San Antonio</div>
        <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:26px;font-weight:400;line-height:1.25;">${escapeHtml(title)}</h1>
      </div>
      <div style="padding:28px;${MAIL_STYLE}">
        ${content}
        <p style="margin:28px 0 0;">
          <a href="${escapeHtml(adminUrl)}" style="display:inline-block;border-radius:999px;background:#1c211d;padding:12px 20px;color:#ffffff;text-decoration:none;font-weight:700;">Otvori zapis u CMS-u</a>
        </p>
      </div>
    </div>
  </body>
</html>`
}

function detailsTable(rows: Array<[string, unknown]>): string {
  return `<table role="presentation" style="width:100%;border-collapse:collapse;">
    ${rows
      .map(
        ([label, value]) => `<tr>
          <td style="width:34%;border-bottom:1px solid #ece8df;padding:10px 12px 10px 0;color:#667067;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="border-bottom:1px solid #ece8df;padding:10px 0;font-weight:600;vertical-align:top;">${escapeHtml(oneLine(value))}</td>
        </tr>`,
      )
      .join('')}
  </table>`
}

function paragraph(value: unknown): string {
  const normalized = String(value ?? '').trim()
  if (!normalized) return '<p style="margin:0;color:#667067;">Nema dodatne poruke.</p>'

  return `<p style="margin:0;white-space:pre-wrap;">${escapeHtml(normalized)}</p>`
}

export const sendBookingInquiryNotification: CollectionAfterChangeHook<BookingInquiry> = async ({
  context,
  doc,
  operation,
  req,
}) => {
  if (
    operation !== 'create' ||
    context.skipEmailNotification ||
    !isEmailNotificationConfigured()
  ) {
    return doc
  }

  const recipient = bookingNotificationRecipient()
  const guestName = `${oneLine(doc.firstName, '')} ${oneLine(doc.lastName, '')}`.trim()
  const checkIn = formatDate(doc.checkIn)
  const checkOut = formatDate(doc.checkOut)
  const adminUrl = adminRecordUrl('booking-inquiries', doc.id)
  const title = `Novi booking upit · ${guestName || 'Gost'}`
  const content = `
    ${detailsTable([
      ['Gost', guestName],
      ['Email', doc.email],
      ['Država', doc.country],
      ['Dolazak', checkIn],
      ['Odlazak', checkOut],
      ['Odrasli', doc.adults],
      ['Djeca', doc.kids],
      ['Kućni ljubimci', doc.pets === 'yes' ? 'Da' : 'Ne'],
    ])}
    <h2 style="margin:26px 0 10px;font-family:Georgia,serif;font-size:19px;font-weight:400;">Napomena gosta</h2>
    ${paragraph(doc.notes)}
  `

  try {
    await req.payload.sendEmail({
      html: emailShell(title, content, adminUrl),
      replyTo: {
        address: doc.email,
        name: guestName || doc.email,
      },
      subject: `Novi booking upit: ${oneLine(guestName, 'Gost')} · ${checkIn} – ${checkOut}`,
      text: [
        title,
        `Email: ${doc.email}`,
        `Država: ${oneLine(doc.country)}`,
        `Dolazak: ${checkIn}`,
        `Odlazak: ${checkOut}`,
        `Odrasli: ${doc.adults}`,
        `Djeca: ${doc.kids ?? 0}`,
        `Kućni ljubimci: ${doc.pets === 'yes' ? 'Da' : 'Ne'}`,
        '',
        'Napomena gosta:',
        oneLine(doc.notes),
        '',
        `CMS: ${adminUrl}`,
      ].join('\n'),
      to: recipient,
    })
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: 'Slanje email obavijesti za booking upit nije uspjelo.',
    })
  }

  return doc
}

export const sendContactMessageNotification: CollectionAfterChangeHook<ContactMessage> = async ({
  context,
  doc,
  operation,
  req,
}) => {
  if (
    operation !== 'create' ||
    context.skipEmailNotification ||
    !isEmailNotificationConfigured()
  ) {
    return doc
  }

  const recipient = contactNotificationRecipient()
  const senderName = oneLine(doc.name, 'Gost')
  const messageSubject = oneLine(doc.subject, 'Bez predmeta')
  const adminUrl = adminRecordUrl('contact-messages', doc.id)
  const title = `Nova kontakt poruka · ${senderName}`
  const content = `
    ${detailsTable([
      ['Ime', senderName],
      ['Email', doc.email],
      ['Predmet', messageSubject],
    ])}
    <h2 style="margin:26px 0 10px;font-family:Georgia,serif;font-size:19px;font-weight:400;">Poruka</h2>
    ${paragraph(doc.message)}
  `

  try {
    await req.payload.sendEmail({
      html: emailShell(title, content, adminUrl),
      replyTo: {
        address: doc.email,
        name: senderName,
      },
      subject: `Nova kontakt poruka: ${messageSubject.slice(0, 160)}`,
      text: [
        title,
        `Email: ${doc.email}`,
        `Predmet: ${messageSubject}`,
        '',
        'Poruka:',
        String(doc.message ?? '').trim(),
        '',
        `CMS: ${adminUrl}`,
      ].join('\n'),
      to: recipient,
    })
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: 'Slanje email obavijesti za kontakt poruku nije uspjelo.',
    })
  }

  return doc
}
