'use client'

import { useEffect } from 'react'

import { useAnalytics } from '@/hooks/useAnalytics'
import type { AnalyticsEventName } from '@/lib/analytics'

function getLinkLocation(anchor: HTMLAnchorElement) {
  if (anchor.closest('header')) return 'header'
  if (anchor.closest('footer')) return 'footer'
  if (anchor.closest('nav')) return 'navigation'
  return 'content'
}

function getTrackedEvent(anchor: HTMLAnchorElement): AnalyticsEventName | null {
  const href = anchor.getAttribute('href')?.trim()
  if (!href) return null

  const normalizedHref = href.toLowerCase()
  if (normalizedHref.startsWith('mailto:')) return 'click_email'
  if (normalizedHref.startsWith('tel:')) return 'click_phone'
  if (normalizedHref.includes('wa.me/') || normalizedHref.includes('whatsapp.com/')) {
    return 'click_whatsapp'
  }

  let url: URL
  try {
    url = new URL(href, window.location.href)
  } catch {
    return null
  }

  const hostname = url.hostname.toLowerCase()
  const pathname = url.pathname.replace(/\/$/, '') || '/'

  if (
    hostname === 'maps.app.goo.gl' ||
    hostname === 'maps.google.com' ||
    (hostname.endsWith('google.com') && pathname.startsWith('/maps'))
  ) {
    return 'map_open'
  }

  if (url.origin === window.location.origin && pathname === '/booking') {
    return 'check_availability_click'
  }

  if (url.origin === window.location.origin && pathname === '/gallery') {
    return 'gallery_open'
  }

  return null
}

export function AnalyticsInteractions() {
  const track = useAnalytics()

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a')
      if (!(anchor instanceof HTMLAnchorElement)) return

      const trackedEvent = getTrackedEvent(anchor)
      if (!trackedEvent) return

      track(trackedEvent, { link_location: getLinkLocation(anchor) })
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [track])

  return null
}
