export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || ''

export const isValidGtmId = (value: string) => /^GTM-[A-Z0-9]+$/i.test(value)

export type AnalyticsEventName =
  | 'booking_form_start'
  | 'check_availability_click'
  | 'click_email'
  | 'click_phone'
  | 'click_whatsapp'
  | 'date_range_selected'
  | 'gallery_open'
  | 'generate_lead'
  | 'map_open'
  | 'page_view'

export type AnalyticsEventParameters = Record<
  string,
  boolean | number | string | null | undefined
>

declare global {
  interface Window {
    __villaConsentDefaultsSet?: boolean
    dataLayer?: Array<unknown>
    gtag?: (...args: unknown[]) => void
  }
}

export function pushDataLayerEvent(
  event: AnalyticsEventName,
  parameters: AnalyticsEventParameters = {},
) {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...parameters })
}
