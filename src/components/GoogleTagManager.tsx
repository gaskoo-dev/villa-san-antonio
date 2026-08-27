'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect } from 'react'

import { useCookieConsent } from '@/context/CookieConsentContext'
import { GTM_ID, isValidGtmId, pushDataLayerEvent } from '@/lib/analytics'

const GTM_SCRIPT_ID = 'villa-google-tag-manager'

function consentValue(allowed: boolean) {
  return allowed ? 'granted' : 'denied'
}

export function GoogleTagManager() {
  const pathname = usePathname()
  const {
    analyticsAllowed,
    externalMediaAllowed,
    isReady,
    marketingAllowed,
  } = useCookieConsent()
  const measurementAllowed = analyticsAllowed || marketingAllowed

  useLayoutEffect(() => {
    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function () {
      window.dataLayer?.push(arguments)
    }

    if (window.__villaConsentDefaultsSet) return

    window.__villaConsentDefaultsSet = true
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 500,
    })
    window.gtag('set', 'ads_data_redaction', true)
  }, [])

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return

    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function () {
      window.dataLayer?.push(arguments)
    }

    window.gtag('consent', 'update', {
      analytics_storage: consentValue(analyticsAllowed),
      ad_storage: consentValue(marketingAllowed),
      ad_user_data: consentValue(marketingAllowed),
      ad_personalization: consentValue(marketingAllowed),
      functionality_storage: 'granted',
      security_storage: 'granted',
    })

    window.dataLayer.push({
      event: 'villa_consent_update',
      consent_analytics: consentValue(analyticsAllowed),
      consent_external_media: consentValue(externalMediaAllowed),
      consent_marketing: consentValue(marketingAllowed),
    })
  }, [analyticsAllowed, externalMediaAllowed, isReady, marketingAllowed])

  useEffect(() => {
    if (
      !isReady ||
      !measurementAllowed ||
      !isValidGtmId(GTM_ID) ||
      typeof document === 'undefined' ||
      document.getElementById(GTM_SCRIPT_ID)
    ) {
      return
    }

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

    const script = document.createElement('script')
    script.id = GTM_SCRIPT_ID
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`
    document.head.appendChild(script)
  }, [isReady, measurementAllowed])

  useEffect(() => {
    if (!isReady || !measurementAllowed || !isValidGtmId(GTM_ID)) return

    pushDataLayerEvent('page_view', {
      page_path: pathname,
      page_title: document.title,
    })
  }, [isReady, measurementAllowed, pathname])

  return null
}
