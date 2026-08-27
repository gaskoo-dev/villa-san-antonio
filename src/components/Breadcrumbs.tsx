import Link from 'next/link'
import { IconChevronRight } from '@tabler/icons-react'

import { SITE_URL } from '@/lib/content'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({
  items,
  className = '',
}: {
  items: BreadcrumbItem[]
  className?: string
}) {
  const allItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...items,
  ]

  // Schema.org BreadcrumbList for rich Google Search snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, SITE_URL).toString() } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-2 text-xs font-medium tracking-wide text-ink/50 ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-2">
          {allItems.map((item, idx) => {
            const isLast = idx === allItems.length - 1

            return (
              <li key={idx} className="flex items-center gap-2">
                {idx > 0 && (
                  <IconChevronRight
                    size={12}
                    stroke={2}
                    className="text-ink/30 shrink-0"
                    aria-hidden
                  />
                )}

                {isLast || !item.href ? (
                  <span className="text-ink font-semibold" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
