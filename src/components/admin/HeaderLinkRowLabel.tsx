'use client'

import { useRowLabel } from '@payloadcms/ui'

type HeaderLinkRow = {
  label?: string | null
}

export function HeaderLinkRowLabel() {
  const { data } = useRowLabel<HeaderLinkRow>()

  return <span>{data?.label?.trim() || 'Link label'}</span>
}
