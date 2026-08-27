import 'server-only'

import { randomUUID } from 'node:crypto'

export type TurnstileAction = 'booking_inquiry' | 'contact_message'

type TurnstileFailureReason =
  | 'configuration'
  | 'hostname'
  | 'invalid'
  | 'service'

type TurnstileResult =
  | { success: true; skipped: boolean }
  | { success: false; reason: TurnstileFailureReason }

type SiteverifyResponse = {
  success?: boolean
  hostname?: string
  action?: string
  'error-codes'?: string[]
}

const siteverifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const cloudflareTestSiteKeys = new Set([
  '1x00000000000000000000AA',
  '2x00000000000000000000AB',
  '1x00000000000000000000BB',
  '2x00000000000000000000BB',
  '3x00000000000000000000FF',
])

function configuredHostnames(): Set<string> {
  const explicitHostnames = process.env.TURNSTILE_ALLOWED_HOSTNAMES
    ?.split(',')
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean)

  if (explicitHostnames?.length) return new Set(explicitHostnames)

  try {
    const hostname = new URL(process.env.SITE_URL || '').hostname.toLowerCase()
    return hostname ? new Set([hostname]) : new Set()
  } catch {
    return new Set()
  }
}

export function turnstileMessage(reason: TurnstileFailureReason): string {
  if (reason === 'invalid') {
    return 'Please complete the security check and try again.'
  }

  return "We couldn't complete the security check. Please refresh and try again, or contact us directly."
}

export async function verifyTurnstileToken({
  action,
  remoteIp,
  token,
}: {
  action: TurnstileAction
  remoteIp?: string
  token: string
}): Promise<TurnstileResult> {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim()
  const partiallyConfigured = Boolean(siteKey || secretKey)

  // Local and preview environments continue to work until both production
  // credentials are installed. A partial configuration fails closed.
  if (!partiallyConfigured) return { success: true, skipped: true }

  if (!siteKey || !secretKey) {
    console.error('Turnstile is partially configured; both site and secret keys are required.')
    return { success: false, reason: 'configuration' }
  }

  if (!token || token.length > 2_048) {
    return { success: false, reason: 'invalid' }
  }

  const body = new FormData()
  body.set('secret', secretKey)
  body.set('response', token)
  body.set('idempotency_key', randomUUID())
  if (remoteIp && remoteIp !== 'unknown') body.set('remoteip', remoteIp)

  try {
    const response = await fetch(siteverifyUrl, {
      method: 'POST',
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    })

    if (!response.ok) {
      console.error(`Turnstile Siteverify returned HTTP ${response.status}.`)
      return { success: false, reason: 'service' }
    }

    const result = (await response.json()) as SiteverifyResponse

    // Cloudflare's documented dummy keys omit the action in Siteverify
    // responses. Production widgets must always echo the exact action.
    const actionMatches =
      result.action === action || (cloudflareTestSiteKeys.has(siteKey) && !result.action)

    if (!result.success || !actionMatches) {
      console.warn('Turnstile verification rejected.', {
        actionMatches,
        errorCodes: result['error-codes'] || [],
        receivedAction: result.action || null,
      })
      return { success: false, reason: 'invalid' }
    }

    const allowedHostnames = configuredHostnames()
    const hostnameMatches =
      cloudflareTestSiteKeys.has(siteKey) ||
      allowedHostnames.size === 0 ||
      Boolean(result.hostname && allowedHostnames.has(result.hostname.toLowerCase()))
    if (!hostnameMatches) {
      console.warn('Turnstile verification rejected because the hostname did not match.', {
        receivedHostname: result.hostname || null,
      })
      return { success: false, reason: 'hostname' }
    }

    return { success: true, skipped: false }
  } catch (error) {
    console.error('Turnstile Siteverify request failed.', error)
    return { success: false, reason: 'service' }
  }
}
