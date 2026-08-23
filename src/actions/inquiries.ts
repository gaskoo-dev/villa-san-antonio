'use server'

import { getPayloadClient } from '@/lib/queries'
import type { FormState } from '@/lib/form-state'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(data: FormData, key: string): string {
  const v = data.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

export async function submitBookingInquiry(_prev: FormState, data: FormData): Promise<FormState> {
  // Honeypot: real guests never fill this
  if (str(data, 'company')) {
    return { status: 'success', message: 'Request received.' }
  }

  const errors: Record<string, string> = {}
  const firstName = str(data, 'firstName')
  const lastName = str(data, 'lastName')
  const email = str(data, 'email')
  const checkIn = str(data, 'checkIn')
  const checkOut = str(data, 'checkOut')
  const adults = Number(str(data, 'adults'))
  const kids = Number(str(data, 'kids') || '0')
  const pets = str(data, 'pets') || 'no'

  if (!firstName) errors.firstName = 'Please enter your first name.'
  if (!lastName) errors.lastName = 'Please enter your last name.'
  if (!emailRe.test(email)) errors.email = 'Please enter a valid email address.'
  if (!checkIn) errors.checkIn = 'Select a check-in date.'
  if (!checkOut) errors.checkOut = 'Select a check-out date.'
  if (checkIn && checkOut && checkOut <= checkIn) errors.checkOut = 'Check-out must be after check-in.'
  if (!Number.isFinite(adults) || adults < 1) errors.adults = 'At least one adult.'
  if (!Number.isFinite(kids) || kids < 0) errors.kids = 'Invalid number.'

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Please check the highlighted fields.', errors }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'booking-inquiries',
      data: {
        firstName,
        lastName,
        email,
        country: str(data, 'country'),
        checkIn,
        checkOut,
        adults,
        kids,
        pets: pets as 'no' | 'yes',
        notes: str(data, 'notes'),
      },
    })
    return {
      status: 'success',
      message: 'Request received. We usually reply within 30 minutes. If you don\u2019t see our email, please check your spam folder.',
    }
  } catch (e) {
    console.error('booking inquiry failed', e)
    return { status: 'error', message: 'Something went wrong on our side. Please try again or email us directly.' }
  }
}

export async function submitContactMessage(_prev: FormState, data: FormData): Promise<FormState> {
  if (str(data, 'company')) {
    return { status: 'success', message: 'Message sent.' }
  }

  const errors: Record<string, string> = {}
  const name = str(data, 'name')
  const email = str(data, 'email')
  const subject = str(data, 'subject')
  const message = str(data, 'message')
  const consent = data.get('consent') === 'on'

  if (!name) errors.name = 'Please enter your name.'
  if (!emailRe.test(email)) errors.email = 'Please enter a valid email address.'
  if (!subject) errors.subject = 'Please add a subject.'
  if (message.length < 5) errors.message = 'Please write your message.'
  if (!consent) errors.consent = 'We need your consent to reply.'

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Please check the highlighted fields.', errors }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-messages',
      data: { name, email, subject, message, consent: true },
    })
    return { status: 'success', message: 'Message sent. We\u2019ll get back to you shortly.' }
  } catch (e) {
    console.error('contact message failed', e)
    return { status: 'error', message: 'Something went wrong on our side. Please try again or email us directly.' }
  }
}
