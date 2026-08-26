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

Set `DATABASE_URL`, `PAYLOAD_SECRET`, and `CRON_SECRET` on the web application container. Production migrations run automatically when Payload starts. Take a database backup before the first deployment that introduces a new migration.

Configure calendar sync as a Coolify Scheduled Task on the web/Next.js container, not the PostgreSQL container:

- Schedule: every 15 minutes
- Cron expression: `*/15 * * * *`
- Timeout: `60` seconds
- Command:

```sh
node -e "fetch('http://127.0.0.1:'+(process.env.PORT||'3000')+'/api/cron/sync-calendar',{headers:{authorization:'Bearer '+process.env.CRON_SECRET}}).then(async r=>{const body=await r.text();console.log(body);if(!r.ok)process.exit(1)}).catch(e=>{console.error(e);process.exit(1)})"
```

The calendar feed is fetched and validated, and only the last successful sync timestamp is stored. Individual availability ranges are not appended to the database.
