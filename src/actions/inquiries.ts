'use server'

import { headers } from 'next/headers'

import { getPayloadClient, getSettings } from '@/lib/queries'
import type { FormState } from '@/lib/form-state'
import { consumeRateLimit } from '@/lib/rate-limit'
import {
  dateRangeHasConflict,
  getAvailabilitySnapshot,
  isValidIsoDay,
} from '@/lib/availability'
import { turnstileMessage, verifyTurnstileToken } from '@/lib/turnstile'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(data: FormData, key: string): string {
  const v = data.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

async function getClientAddress(): Promise<string> {
  const requestHeaders = await headers()
  const forwardedFor = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwardedFor || requestHeaders.get('x-real-ip') || 'unknown'
}

function isRateLimited(form: 'booking' | 'contact', clientAddress: string): boolean {
  const result = consumeRateLimit(`${form}:${clientAddress.slice(0, 128)}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  })
  return !result.allowed
}

function exceeds(value: string, maximum: number): boolean {
  return value.length > maximum
}

export async function submitBookingInquiry(_prev: FormState, data: FormData): Promise<FormState> {
  // Honeypot: real guests never fill this
  if (str(data, 'company')) {
    return { status: 'success', message: 'Request received.' }
  }

  const clientAddress = await getClientAddress()
  if (isRateLimited('booking', clientAddress)) {
    return {
      status: 'error',
      message: 'Too many requests from this connection. Please wait 15 minutes and try again.',
    }
  }

  const siteSettings = await getSettings()
  const minNights = typeof siteSettings?.minNights === 'number' ? siteSettings.minNights : 3

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
  if (exceeds(firstName, 80)) errors.firstName = 'First name is too long.'
  if (!lastName) errors.lastName = 'Please enter your last name.'
  if (exceeds(lastName, 80)) errors.lastName = 'Last name is too long.'
  if (!emailRe.test(email)) errors.email = 'Please enter a valid email address.'
  if (exceeds(email, 254)) errors.email = 'Email address is too long.'
  if (exceeds(str(data, 'country'), 100)) errors.country = 'Country is too long.'
  if (exceeds(str(data, 'notes'), 3_000)) errors.notes = 'Notes are too long.'
  if (!checkIn) errors.checkIn = 'Select a check-in date.'
  if (!checkOut) errors.checkOut = 'Select a check-out date.'
  if (checkIn && !isValidIsoDay(checkIn)) errors.checkIn = 'Select a valid check-in date.'
  if (checkOut && !isValidIsoDay(checkOut)) errors.checkOut = 'Select a valid check-out date.'
  if (checkIn && checkOut && checkOut <= checkIn) errors.checkOut = 'Check-out must be after check-in.'

  if (checkIn && checkOut && checkOut > checkIn) {
    const d1 = new Date(checkIn)
    const d2 = new Date(checkOut)
    const diffTime = d2.getTime() - d1.getTime()
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (nights < minNights) {
      errors.checkOut = `Minimum stay is ${minNights} nights.`
    }
  }
  if (!Number.isFinite(adults) || adults < 1) errors.adults = 'At least one adult.'
  if (!Number.isFinite(kids) || kids < 0) errors.kids = 'Invalid number.'
  if (!['no', 'yes'].includes(pets)) errors.pets = 'Invalid option.'

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Please check the highlighted fields.', errors }
  }

  const turnstile = await verifyTurnstileToken({
    action: 'booking_inquiry',
    remoteIp: clientAddress,
    token: str(data, 'cf-turnstile-response'),
  })

  if (!turnstile.success) {
    const message = turnstileMessage(turnstile.reason)
    return { status: 'error', message, errors: { turnstile: message } }
  }

  const availability = await getAvailabilitySnapshot({
    forceFresh: true,
    settings: siteSettings,
  })

  if (!availability.officialFeedAvailable) {
    const message = "We couldn't verify live availability right now. Please wait a moment and try again."
    return {
      status: 'error',
      message,
      errors: { checkIn: message, checkOut: message },
    }
  }

  if (dateRangeHasConflict(availability.disabledDates, checkIn, checkOut)) {
    const message = 'These dates are no longer available. Please choose another stay.'
    return {
      status: 'error',
      message,
      errors: { checkIn: message, checkOut: message },
    }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'booking-inquiries',
      // Trusted server-side operation. Collection REST/GraphQL create access
      // remains admin-only so submissions cannot bypass this validation.
      overrideAccess: true,
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

  const clientAddress = await getClientAddress()
  if (isRateLimited('contact', clientAddress)) {
    return {
      status: 'error',
      message: 'Too many messages from this connection. Please wait 15 minutes and try again.',
    }
  }

  const errors: Record<string, string> = {}
  const name = str(data, 'name')
  const email = str(data, 'email')
  const subject = str(data, 'subject')
  const message = str(data, 'message')
  const privacyAcknowledged = data.get('privacyAcknowledged') === 'on'

  if (!name) errors.name = 'Please enter your name.'
  if (exceeds(name, 120)) errors.name = 'Name is too long.'
  if (!emailRe.test(email)) errors.email = 'Please enter a valid email address.'
  if (exceeds(email, 254)) errors.email = 'Email address is too long.'
  if (!subject) errors.subject = 'Please add a subject.'
  if (exceeds(subject, 200)) errors.subject = 'Subject is too long.'
  if (message.length < 5) errors.message = 'Please write your message.'
  if (exceeds(message, 5_000)) errors.message = 'Message is too long.'
  if (!privacyAcknowledged) {
    errors.privacyAcknowledged = 'Please confirm how your contact details will be used.'
  }

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Please check the highlighted fields.', errors }
  }

  const turnstile = await verifyTurnstileToken({
    action: 'contact_message',
    remoteIp: clientAddress,
    token: str(data, 'cf-turnstile-response'),
  })

  if (!turnstile.success) {
    const turnstileError = turnstileMessage(turnstile.reason)
    return {
      status: 'error',
      message: turnstileError,
      errors: { turnstile: turnstileError },
    }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-messages',
      overrideAccess: true,
      data: { name, email, subject, message, consent: true },
    })
    return { status: 'success', message: 'Message sent. We\u2019ll get back to you shortly.' }
  } catch (e) {
    console.error('contact message failed', e)
    return { status: 'error', message: 'Something went wrong on our side. Please try again or email us directly.' }
  }
}
