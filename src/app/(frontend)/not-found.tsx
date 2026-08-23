import { IconArrowUpRight } from '@tabler/icons-react'
import Link from 'next/link'

import { PRIMARY_CTA_LABEL } from '@/lib/content'

export default function NotFound() {
  return (
    <section className="flex min-h-[80dvh] items-center">
      <div className="mx-auto w-[91.5vw] max-w-[1440px] py-24 text-center">
        <p className="accent-serif text-7xl text-ink/30 sm:text-8xl">404</p>
        <h1 className="heading-display mt-6 text-5xl sm:text-6xl">
          This page took <span className="accent-serif font-normal">a day off.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-ink/60">
          The page you are looking for does not exist. The pool, however, is exactly where you left it.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Link href="/" className="pill-cta-lg">
            Back home
            <span className="pill-chip">
              <IconArrowUpRight size={18} stroke={2} aria-hidden />
            </span>
          </Link>
          <Link
            href="/#booking"
            className="text-xs font-medium uppercase tracking-[0.13rem] text-ink/60 underline decoration-ink/30 underline-offset-[6px] transition-colors hover:text-ink hover:decoration-ink"
          >
            {PRIMARY_CTA_LABEL}
          </Link>
        </div>
      </div>
    </section>
  )
}
