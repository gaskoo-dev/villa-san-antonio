'use client'

import { useRowLabel } from '@payloadcms/ui'

type FooterLinkRow = {
  label?: string | null
  platform?: string | null
}

function formatPlatform(platform?: string | null) {
  if (!platform) return null
  if (platform === 'booking') return 'Booking.com'

  return platform.charAt(0).toUpperCase() + platform.slice(1)
}

export function FooterLinkRowLabel() {
  const { data } = useRowLabel<FooterLinkRow>()

  return <span>{data?.label?.trim() || 'Link label'}</span>
}

export function FooterSocialLinkRowLabel() {
  const { data } = useRowLabel<FooterLinkRow>()
  const label = data?.label?.trim() || formatPlatform(data?.platform)

  return <span>{label || 'Social link'}</span>
}
