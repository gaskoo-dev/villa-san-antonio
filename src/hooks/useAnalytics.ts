'use client'

import { useCallback } from 'react'

import { useCookieConsent } from '@/context/CookieConsentContext'
import {
  pushDataLayerEvent,
  type AnalyticsEventName,
  type AnalyticsEventParameters,
} from '@/lib/analytics'

export function useAnalytics() {
  const { analyticsAllowed, isReady, marketingAllowed } = useCookieConsent()

  return useCallback(
    (event: AnalyticsEventName, parameters: AnalyticsEventParameters = {}) => {
      if (!isReady || (!analyticsAllowed && !marketingAllowed)) return
      pushDataLayerEvent(event, parameters)
    },
    [analyticsAllowed, isReady, marketingAllowed],
  )
}
