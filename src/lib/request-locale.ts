import type { CMSLocale } from '@/lib/queries'

export async function getRequestLocale(): Promise<CMSLocale> {
  return 'en'
}
