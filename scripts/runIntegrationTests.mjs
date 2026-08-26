import 'dotenv/config'

import { spawnSync } from 'node:child_process'
import { realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const adminUrl = new URL(process.env.TEST_DATABASE_ADMIN_URL || process.env.DATABASE_URL || '')
const databaseName = `vsa_integration_${process.pid}_${Date.now()}`
const testUrl = new URL(adminUrl)
testUrl.pathname = `/${databaseName}`

if (!/^vsa_integration_\d+_\d+$/.test(databaseName)) {
  throw new Error('Invalid integration database name')
}

const requireFromAdapter = createRequire(
  realpathSync(path.resolve('node_modules/@payloadcms/db-postgres/package.json')),
)
const { Client } = requireFromAdapter('pg')

async function withAdminClient(task) {
  const client = new Client({ connectionString: adminUrl.toString() })
  await client.connect()
  try {
    await task(client)
  } finally {
    await client.end()
  }
}

let exitCode = 1

try {
  await withAdminClient((client) => client.query(`CREATE DATABASE "${databaseName}"`))

  const result = spawnSync(
    process.execPath,
    ['node_modules/vitest/vitest.mjs', 'run', '--config', './vitest.config.mts'],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        DATABASE_URL: testUrl.toString(),
        NODE_ENV: 'production',
        NODE_OPTIONS: '--loader ./src/scripts/css-loader.mjs --no-deprecation',
      },
      stdio: 'inherit',
    },
  )

  exitCode = result.status ?? 1
} finally {
  await withAdminClient(async (client) => {
    await client.query('SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1', [
      databaseName,
    ])
    await client.query(`DROP DATABASE IF EXISTS "${databaseName}"`)
  })
}

process.exit(exitCode)
