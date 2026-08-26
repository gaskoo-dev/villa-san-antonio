import { cookies } from 'next/headers'

import type { CMSLocale } from '@/lib/queries'

const SUPPORTED_LOCALES = new Set<CMSLocale>(['en', 'de', 'hr'])

export async function getRequestLocale(): Promise<CMSLocale> {
  const value = (await cookies()).get('vsa_locale')?.value as CMSLocale | undefined
  return value && SUPPORTED_LOCALES.has(value) ? value : 'en'
}
