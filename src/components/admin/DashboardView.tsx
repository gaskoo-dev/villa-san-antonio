import {
  ArrowUpRight,
  CalendarCheck02,
  ChevronRight,
  Edit05,
  File02,
  HelpCircle,
  Image03,
  Inbox01,
  Plus,
  RefreshCcw01,
  Settings01,
  Star01,
  UploadCloud02,
} from '@untitledui/icons'
import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'

const supportedLocales = ['en', 'de', 'hr'] as const
type SupportedLocale = (typeof supportedLocales)[number]

type RecentContentItem = {
  href: string
  id: number | string
  title: string
  type: 'Discover post' | 'Page'
  updatedAt: string
}

const numberLabel = (value: number, singular: string, plural: string) =>
  `${value.toLocaleString('en-GB')} ${value === 1 ? singular : plural}`

const formatRelativeTime = (value?: null | string) => {
  if (!value) return 'Not synchronized yet'

  const timestamp = new Date(value).getTime()
  if (!Number.isFinite(timestamp)) return 'Sync time unavailable'

  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000))
  if (elapsedMinutes < 1) return 'Just now'
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`

  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) return `${elapsedHours} hr ago`

  const elapsedDays = Math.floor(elapsedHours / 24)
  return `${elapsedDays} ${elapsedDays === 1 ? 'day' : 'days'} ago`
}

const formatDateTime = (value: string, locale: SupportedLocale) =>
  new Intl.DateTimeFormat(locale === 'hr' ? 'hr-HR' : locale === 'de' ? 'de-DE' : 'en-GB', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    timeZone: 'Europe/Zagreb',
    year: 'numeric',
  }).format(new Date(value))

const isOlderThanMinutes = (value: null | string | undefined, minutes: number) => {
  if (!value) return true
  const timestamp = new Date(value).getTime()
  return !Number.isFinite(timestamp) || Date.now() - timestamp > minutes * 60_000
}

export async function DashboardView({ locale, payload, user }: AdminViewServerProps) {
  if (!user) return null

  const localeCode = locale?.code
  const currentLocale: SupportedLocale = supportedLocales.includes(localeCode as SupportedLocale)
    ? (localeCode as SupportedLocale)
    : 'en'

  const [
    pages,
    discoverPosts,
    galleryImages,
    reviews,
    bookingInquiries,
    contactMessages,
    recentPages,
    recentDiscoverPosts,
    siteSettings,
  ] = await Promise.all([
    payload.count({ collection: 'pages', overrideAccess: false, user }),
    payload.count({ collection: 'discover-posts', overrideAccess: false, user }),
    payload.count({ collection: 'gallery-images', overrideAccess: false, user }),
    payload.count({ collection: 'reviews', overrideAccess: false, user }),
    payload.count({
      collection: 'booking-inquiries',
      overrideAccess: false,
      user,
      where: { status: { equals: 'new' } },
    }),
    payload.count({
      collection: 'contact-messages',
      overrideAccess: false,
      user,
      where: { status: { equals: 'new' } },
    }),
    payload.find({
      collection: 'pages',
      depth: 0,
      limit: 4,
      locale: currentLocale,
      overrideAccess: false,
      sort: '-updatedAt',
      user,
    }),
    payload.find({
      collection: 'discover-posts',
      depth: 0,
      limit: 4,
      locale: currentLocale,
      overrideAccess: false,
      sort: '-updatedAt',
      user,
    }),
    payload.findGlobal({
      slug: 'site-settings',
      locale: currentLocale,
      overrideAccess: false,
      user,
    }),
  ])

  const inboxTotal = bookingInquiries.totalDocs + contactMessages.totalDocs
  const lastCalendarSync = siteSettings.calendarLastSyncedAt
  const calendarNeedsAttention = isOlderThanMinutes(lastCalendarSync, 30)

  const recentContent: RecentContentItem[] = [
    ...recentPages.docs.map((doc) => ({
      href: `/admin/collections/pages/${doc.id}`,
      id: doc.id,
      title: doc.title || doc.slug || 'Untitled page',
      type: 'Page' as const,
      updatedAt: doc.updatedAt,
    })),
    ...recentDiscoverPosts.docs.map((doc) => ({
      href: `/admin/collections/discover-posts/${doc.id}`,
      id: doc.id,
      title: doc.title || 'Untitled discover post',
      type: 'Discover post' as const,
      updatedAt: doc.updatedAt,
    })),
  ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)

  const latestContent = recentContent[0]
  const metrics = [
    {
      helper: numberLabel(pages.totalDocs, 'published page', 'published pages'),
      icon: File02,
      label: 'Pages',
      value: pages.totalDocs,
    },
    {
      helper: numberLabel(discoverPosts.totalDocs, 'published post', 'published posts'),
      icon: Edit05,
      label: 'Discover posts',
      value: discoverPosts.totalDocs,
    },
    {
      helper: numberLabel(galleryImages.totalDocs, 'uploaded image', 'uploaded images'),
      icon: Image03,
      label: 'Gallery images',
      value: galleryImages.totalDocs,
    },
    {
      helper: numberLabel(reviews.totalDocs, 'live review', 'live reviews'),
      icon: Star01,
      label: 'Published reviews',
      value: reviews.totalDocs,
    },
  ]

  const quickActions = [
    {
      href: '/admin/collections/discover-posts/create',
      icon: Edit05,
      label: 'Add discover post',
    },
    {
      href: '/admin/collections/gallery-images/create',
      icon: UploadCloud02,
      label: 'Upload gallery image',
    },
    {
      href: '/admin/collections/faq-items/create',
      icon: HelpCircle,
      label: 'Add FAQ item',
    },
    {
      href: '/admin/collections/pages',
      icon: File02,
      label: 'Edit website pages',
    },
  ]

  return (
    <main className="uui-dashboard">
      <header className="uui-dashboard__page-header">
        <div className="uui-dashboard__breadcrumb" aria-label="Breadcrumb">
          <span>CMS</span>
          <span aria-hidden="true">/</span>
          <strong>Dashboard</strong>
        </div>

        <div className="uui-dashboard__heading-row">
          <div>
            <h1>Website overview</h1>
            <p>Manage content, enquiries, and website health.</p>
          </div>
          <div className="uui-dashboard__header-actions">
            <a className="uui-button uui-button--secondary" href="/" rel="noreferrer" target="_blank">
              View website <ArrowUpRight aria-hidden="true" size={17} />
            </a>
            <Link className="uui-button uui-button--primary" href="/admin/collections/discover-posts/create">
              <Plus aria-hidden="true" size={17} /> Create content
            </Link>
          </div>
        </div>
      </header>

      <section className="uui-health" aria-labelledby="site-health-title">
        <h2 id="site-health-title">Site health</h2>
        <div className="uui-health__items">
          <div className={`uui-health__item${calendarNeedsAttention ? ' is-attention' : ''}`}>
            <span className="uui-health__dot" aria-hidden="true" />
            <span>Calendar {formatRelativeTime(lastCalendarSync)}</span>
          </div>
          <div className="uui-health__item">
            <span className="uui-health__dot" aria-hidden="true" />
            <span>{numberLabel(reviews.totalDocs, 'review available', 'reviews available')}</span>
          </div>
          <div className={`uui-health__item${inboxTotal > 0 ? ' has-new-items' : ''}`}>
            <span className="uui-health__dot" aria-hidden="true" />
            <span>{numberLabel(inboxTotal, 'new inbox item', 'new inbox items')}</span>
          </div>
        </div>
        <Link className="uui-health__link" href="/admin/globals/site-settings">
          View status <ChevronRight aria-hidden="true" size={16} />
        </Link>
      </section>

      <section className="uui-metrics" aria-label="Content overview">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <article className="uui-metric-card" key={metric.label}>
              <div className="uui-metric-card__topline">
                <span className="uui-featured-icon">
                  <Icon aria-hidden="true" size={22} />
                </span>
                <span>{metric.label}</span>
              </div>
              <strong>{metric.value.toLocaleString('en-GB')}</strong>
              <p>{metric.helper}</p>
            </article>
          )
        })}
      </section>

      <div className="uui-dashboard__content-grid">
        <section className="uui-card uui-recent-content" aria-labelledby="recent-content-title">
          <div className="uui-card__header">
            <div>
              <h2 id="recent-content-title">Recent content</h2>
              <p>Latest updates across pages and Discover.</p>
            </div>
            <Link className="uui-text-link" href="/admin/collections/pages">
              View pages <ChevronRight aria-hidden="true" size={16} />
            </Link>
          </div>

          {recentContent.length > 0 ? (
            <div className="uui-table-wrap">
              <table className="uui-table">
                <thead>
                  <tr>
                    <th>Content</th>
                    <th>Type</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {recentContent.map((item) => (
                    <tr key={`${item.type}-${item.id}`}>
                      <td data-label="Content">
                        <Link className="uui-content-cell" href={item.href}>
                          <span className="uui-content-cell__icon">
                            {item.type === 'Page' ? (
                              <File02 aria-hidden="true" size={18} />
                            ) : (
                              <Edit05 aria-hidden="true" size={18} />
                            )}
                          </span>
                          <strong>{item.title}</strong>
                        </Link>
                      </td>
                      <td data-label="Type">{item.type}</td>
                      <td data-label="Language">
                        <span className="uui-badge">{currentLocale.toUpperCase()}</span>
                      </td>
                      <td data-label="Status">
                        <span className="uui-status-badge">
                          <span aria-hidden="true" /> Live
                        </span>
                      </td>
                      <td data-label="Updated">{formatDateTime(item.updatedAt, currentLocale)}</td>
                      <td className="uui-table__action">
                        <Link aria-label={`Edit ${item.title}`} href={item.href}>
                          <ChevronRight aria-hidden="true" size={17} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="uui-empty-state">
              <File02 aria-hidden="true" size={24} />
              <strong>No content yet</strong>
              <p>Create the first page or Discover post to see it here.</p>
            </div>
          )}
        </section>

        <aside className="uui-dashboard__sidebar">
          <section className="uui-card" aria-labelledby="quick-actions-title">
            <div className="uui-card__header uui-card__header--compact">
              <h2 id="quick-actions-title">Quick actions</h2>
            </div>
            <nav className="uui-action-list" aria-label="Quick actions">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link href={action.href} key={action.href}>
                    <span className="uui-action-list__icon">
                      <Icon aria-hidden="true" size={17} />
                    </span>
                    <span>{action.label}</span>
                    <ChevronRight aria-hidden="true" size={16} />
                  </Link>
                )
              })}
            </nav>
          </section>

          <section className="uui-card" aria-labelledby="operations-title">
            <div className="uui-card__header uui-card__header--compact">
              <h2 id="operations-title">Operational summary</h2>
            </div>
            <div className="uui-activity-list">
              <div className="uui-activity-item">
                <span className="uui-activity-item__icon">
                  <CalendarCheck02 aria-hidden="true" size={17} />
                </span>
                <div>
                  <strong>Calendar synchronization</strong>
                  <span>{formatRelativeTime(lastCalendarSync)}</span>
                </div>
              </div>
              <div className="uui-activity-item">
                <span className="uui-activity-item__icon">
                  <RefreshCcw01 aria-hidden="true" size={17} />
                </span>
                <div>
                  <strong>Review collection</strong>
                  <span>{numberLabel(reviews.totalDocs, 'review available', 'reviews available')}</span>
                </div>
              </div>
              <div className="uui-activity-item">
                <span className="uui-activity-item__icon">
                  <Inbox01 aria-hidden="true" size={17} />
                </span>
                <div>
                  <strong>Guest inbox</strong>
                  <span>{numberLabel(inboxTotal, 'new item', 'new items')}</span>
                </div>
              </div>
              <div className="uui-activity-item">
                <span className="uui-activity-item__icon">
                  <Edit05 aria-hidden="true" size={17} />
                </span>
                <div>
                  <strong>Latest content update</strong>
                  <span>{latestContent ? `${latestContent.title} · ${formatRelativeTime(latestContent.updatedAt)}` : 'No content yet'}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="uui-card uui-settings-card" aria-label="Global website controls">
            <span className="uui-featured-icon">
              <Settings01 aria-hidden="true" size={20} />
            </span>
            <div>
              <strong>Global website controls</strong>
              <p>Header, footer and booking settings.</p>
            </div>
            <Link aria-label="Open global website controls" href="/admin/globals/site-settings">
              <ChevronRight aria-hidden="true" size={17} />
            </Link>
          </section>
        </aside>
      </div>
    </main>
  )
}
