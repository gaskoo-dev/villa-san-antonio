# Villa San Antonio

Next.js 16 website and Payload CMS backed by PostgreSQL.

## Local development

1. Copy `.env.example` to `.env` and provide a PostgreSQL connection, `PAYLOAD_SECRET`, and `CRON_SECRET`.
2. Install dependencies with `pnpm install`.
3. Apply committed migrations with `pnpm payload migrate`.
4. Start the app with `pnpm dev` and open `http://localhost:3000`.

Database schema changes are migration-driven. Keep `PAYLOAD_ALLOW_SCHEMA_PUSH=false` for shared and production databases. Only enable schema push for an explicitly disposable development database.

## Verification

- `pnpm run lint`
- `pnpm run generate:types`
- `pnpm run test:int`
- `pnpm run build`

The integration test creates a uniquely named temporary PostgreSQL database and removes it when finished. The configured database user therefore needs `CREATEDB`, or `TEST_DATABASE_ADMIN_URL` must point to a PostgreSQL connection that has that permission.

## Coolify deployment

Set every production value from `.env.example` on the web application container. Never commit real passwords, API keys, database credentials, or `CRON_SECRET` values. At minimum, production requires:

- `DATABASE_URL`, `PAYLOAD_SECRET`, `CRON_SECRET`, and `SITE_URL`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, and `TURNSTILE_ALLOWED_HOSTNAMES` when Turnstile is activated
- `NEXT_PUBLIC_GTM_ID` when GTM is activated
- `GOOGLE_SITE_VERIFICATION` after the Search Console property is created
- the SMTP variables documented below when inquiry notifications are activated

`SITE_URL` must be the public origin, for example `https://villa-sanantonio.com`; a trailing slash is accepted and normalized. Production migrations run automatically when Payload starts. Take a database backup before the first deployment that introduces a new migration.

After the production domain is switched, verify the canonical and social image URLs on the final domain, then submit `https://villa-sanantonio.com/sitemap.xml` in Google Search Console.

Mount Coolify persistent storage at `/app/media`. The image contains the committed media as an initial snapshot, while uploads made through Payload are written to that volume and must survive container replacements.

## Production SMTP

The mailbox is hosted in cPanel. Confirm the exact secure outgoing server in **cPanel → Email Accounts → kontakt@villa-sanantonio.com → Connect Devices**. The expected production values are:

```dotenv
SMTP_HOST=mail.villa-sanantonio.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=kontakt@villa-sanantonio.com
SMTP_PASS=<email-account-password>
SMTP_FROM_EMAIL=kontakt@villa-sanantonio.com
SMTP_FROM_NAME=Villa San Antonio
BOOKING_NOTIFICATION_EMAIL=booking@villa-sanantonio.com
CONTACT_NOTIFICATION_EMAIL=kontakt@villa-sanantonio.com
```

`SMTP_PASS` must exist only in Coolify's environment variables or local `.env`; never place it in `.env.example`, README, application logs, or Git. If cPanel shows a different secure outgoing hostname, use the cPanel value so its TLS certificate matches. Keep the guest's address in `Reply-To`; never use guest-provided input as the sender address.

When all required SMTP variables are present, Payload automatically enables the Nodemailer adapter. Every newly created booking inquiry is sent to `BOOKING_NOTIFICATION_EMAIL`, while every new contact message is sent to `CONTACT_NOTIFICATION_EMAIL`. Both are saved to the CMS first. Status updates do not resend the notification. If SMTP is unavailable, the CMS record remains saved and the delivery error is written to the server log without exposing the guest's data in analytics.

Before launch, use **cPanel → Email Deliverability** to confirm SPF, DKIM, and DMARC, then test both public forms and verify delivery to the inbox and spam folder.

## Production scheduled tasks

There are currently two required application cron jobs. Configure both as Coolify Scheduled Tasks on the web/Next.js container, not the PostgreSQL container. They inherit `PORT` and `CRON_SECRET` from the web container. A missing or incorrect secret returns an error and performs no database write.

### 1. Calendar availability sync

- Schedule: every 15 minutes
- Cron expression: `*/15 * * * *`
- Timeout: `60` seconds
- Command:

```sh
node -e "fetch('http://127.0.0.1:'+(process.env.PORT||'3000')+'/api/cron/sync-calendar',{headers:{authorization:'Bearer '+process.env.CRON_SECRET}}).then(async r=>{const body=await r.text();console.log(body);if(!r.ok)process.exit(1)}).catch(e=>{console.error(e);process.exit(1)})"
```

Expected successful response: HTTP `200` with `"success":true`, a `totalBookedRanges` value, and a current `timestamp`. The calendar feed is fetched and validated, and only the last successful sync timestamp is stored. Individual availability ranges are not appended to the database.

### 2. Review sync and deduplication

- Schedule: once daily at 04:23 UTC
- Cron expression: `23 4 * * *`
- Timeout: `60` seconds
- Command:

```sh
node -e "fetch('http://127.0.0.1:'+(process.env.PORT||'3000')+'/api/cron/sync-reviews',{headers:{authorization:'Bearer '+process.env.CRON_SECRET}}).then(async r=>{const body=await r.text();console.log(body);if(!r.ok)process.exit(1)}).catch(e=>{console.error(e);process.exit(1)})"
```

Expected successful response: HTTP `200` with `"success":true` and a `summary` containing the scraped, added, skipped, removed, and final review totals. This task removes invalid or duplicate stored reviews and imports newly found reviews from the configured public sources.

### Scheduled-task verification

After production deployment:

1. Run each task manually once from Coolify.
2. Confirm the command exits with code `0` and prints a successful JSON response.
3. Confirm **Site Settings → Last Calendar Sync** updates in Payload.
4. Confirm review totals are sensible and no curated review was removed unexpectedly.
5. Check both task histories after 24 hours and configure failed-run notifications in Coolify.

No other application cron jobs are currently required. Database backups and `/app/media` volume backups are separate infrastructure schedules and should also be enabled before launch.
