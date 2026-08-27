'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

import type { TurnstileAction } from '@/lib/turnstile'

type TurnstileWidgetId = string

type TurnstileApi = {
  remove: (widgetId: TurnstileWidgetId) => void
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      action: TurnstileAction
      appearance: 'interaction-only'
      language: 'auto'
      size: 'flexible'
      theme: 'light'
      'response-field': false
      callback: (token: string) => void
      'error-callback': () => void
      'expired-callback': () => void
      'timeout-callback': () => void
    },
  ) => TurnstileWidgetId
  reset: (widgetId: TurnstileWidgetId) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || ''

export const turnstileClientEnabled = Boolean(siteKey)

export function TurnstileWidget({
  action,
  onVerifiedChange,
  resetSignal,
}: {
  action: TurnstileAction
  onVerifiedChange: (verified: boolean) => void
  resetSignal: unknown
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<TurnstileWidgetId | null>(null)
  const lastResetSignalRef = useRef(resetSignal)
  const [scriptReady, setScriptReady] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile) return
    if (widgetIdRef.current) return

    const markUnverified = () => {
      setToken('')
      onVerifiedChange(false)
      setError('The security check needs another moment. Please wait and try again.')
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action,
      appearance: 'interaction-only',
      language: 'auto',
      size: 'flexible',
      theme: 'light',
      'response-field': false,
      callback: (nextToken) => {
        setToken(nextToken)
        setError('')
        onVerifiedChange(true)
      },
      'error-callback': markUnverified,
      'expired-callback': markUnverified,
      'timeout-callback': markUnverified,
    })

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
      widgetIdRef.current = null
      onVerifiedChange(false)
    }
  }, [action, onVerifiedChange, scriptReady])

  useEffect(() => {
    if (lastResetSignalRef.current === resetSignal) return
    lastResetSignalRef.current = resetSignal
    if (!widgetIdRef.current || !window.turnstile) return
    setError('')
    setToken('')
    onVerifiedChange(false)
    window.turnstile.reset(widgetIdRef.current)
  }, [onVerifiedChange, resetSignal])

  if (!siteKey) return null

  return (
    <div className="space-y-2" aria-live="polite">
      <input type="hidden" name="cf-turnstile-response" value={token} />
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => {
          onVerifiedChange(false)
          setError('The security check could not load. Check your connection and refresh the page.')
        }}
      />
      <div ref={containerRef} className="min-h-16 w-full" />
      {error && (
        <p role="alert" className="text-xs font-medium leading-5 text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
