# Payload CMS and environment setup

The portfolio already runs from `content/portfolio.json`. Connect Payload when you want an admin interface, drafts, and publishing. Starting the frontend does not create a database or administrator.

Commands run from the repository root with Node 22.12+ (Node 24 recommended) and pnpm 10.32.1.

| Service           | Local address                 | Purpose                                      |
| ----------------- | ----------------------------- | -------------------------------------------- |
| Astro             | `http://127.0.0.1:4321`       | Website; production output is static `dist/` |
| Payload / Next.js | `http://localhost:3001`       | Admin and content APIs                       |
| PostgreSQL        | `localhost:5432` with Compose | Content, users, versions, media metadata     |
| Uploaded files    | `apps/cms/media/` locally     | Use persistent disk or R2 in production      |

## 1. Environment files

```sh
pnpm install --frozen-lockfile
```

Create files only when absent. PowerShell:

```powershell
if (!(Test-Path -LiteralPath apps/cms/.env)) {
  Copy-Item -LiteralPath apps/cms/.env.example -Destination apps/cms/.env
}
if (!(Test-Path -LiteralPath apps/web/.env)) {
  Copy-Item -LiteralPath apps/web/.env.example -Destination apps/web/.env
}
```

Bash:

```sh
test -f apps/cms/.env || cp apps/cms/.env.example apps/cms/.env
test -f apps/web/.env || cp apps/web/.env.example apps/web/.env
```

Generate a secret and paste it into `PAYLOAD_SECRET` in `apps/cms/.env`:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Use this random value, not the placeholder. Keep it stable across restarts/deployments. Environment files are Git-ignored; production secrets belong in hosting environment settings. Next.js loads CMS environment files, including when the Payload CLI runs. See [Payload environment variables](https://payloadcms.com/docs/configuration/environment-vars).

## 2. PostgreSQL

With Docker installed and running:

```sh
docker compose up -d postgres
docker compose ps postgres
```

The supplied Compose service matches these CMS env values:

```dotenv
DATABASE_URL=postgresql://garden:garden_local_only@localhost:5432/garden
CMS_PUBLIC_URL=http://localhost:3001
PUBLIC_SITE_URL=http://127.0.0.1:4321
```

Keep your generated `PAYLOAD_SECRET` in the same file. The database password above is for local development only. Alternatively use an existing/managed PostgreSQL database and its connection string, including required SSL parameters; Docker is then unnecessary.

```sh
pnpm cms:doctor
```

This helper checks required values and optional groups without printing secrets. It reads `apps/cms/.env` and shell variables. It does **not** connect to PostgreSQL, test credentials, or modify schema/data. It does not load `.env.local`; use `.env` or shell values for this check.

## 3. Start the admin

```sh
pnpm --filter @garden/cms generate:importmap
pnpm cms:dev
```

Visit [http://localhost:3001/admin](http://localhost:3001/admin) and create the first administrator with your email and password. No default login is seeded. Subsequent writes require authentication.

Development uses PostgreSQL schema push. Keep it connected to a development database. Production disables push and uses migrations. See [Payload PostgreSQL](https://payloadcms.com/docs/database/postgres).

## 4. Import JSON or enter content

The optional seed reads `content/portfolio.json`. Customize it first when reusing this project. It refuses to run if Projects, Experience, or Blog Posts contain records; it is an initial bootstrap, not a sync tool. It updates Profile and Site Settings, so review those globals before intentionally seeding even if collections are empty.

Use once on an empty development CMS. Leave `ALLOW_SEED=false` in `.env` and enable it for the command only.

PowerShell:

```powershell
$env:ALLOW_SEED = "true"
try {
  pnpm cms:seed
} finally {
  Remove-Item Env:ALLOW_SEED
}
```

Bash:

```sh
ALLOW_SEED=true pnpm cms:seed
```

Seeding publishes Profile, Site Settings, Projects, and Experience. Blog Posts remain **drafts** for review. It does not upload a PDF, configure Resume Settings, or create a user. If it fails midway, inspect inserted records before retrying; the empty-collection guard prevents blind overwrites.

For manual entry, use Profile, Projects, Experience, Blog Posts, and Site Settings. Site Settings → **Website copy, games & appearance** accepts the complete `site` object from the JSON, not the entire portfolio. Both quote lists need at least one message. Publish your changes.

These editors plus Resume Settings feed the current frontend. Skills and Experiments collections are scaffolded for later expansion; public skill/filter labels currently derive from stack values. Legacy Site Settings fields such as navigation/footer do not override `websiteContent`.

## 5. CV and publication

1. Upload a PDF in **Media** and fill its required descriptive alt text. Raster images and PDFs up to 10 MB are allowed.
2. In **Resume Settings**, select it in `currentPdf`.
3. Set the public filename, version date, and download toggle, then publish.
4. Review and publish Blog Posts you want visible.

Check these read-only endpoints before connecting Astro:

- [http://localhost:3001/api/portfolio](http://localhost:3001/api/portfolio): validated `profile`, `site`, `projects`, `experience`, `posts`, and `resume`.
- [http://localhost:3001/api/resume](http://localhost:3001/api/resume): current PDF metadata.

Only published content is included. Missing required profile data or invalid fields fail validation. Complete and publish the relevant editor. An unset CV may return a null URL; a published Resume Settings record with a PDF completes downloading.

## 6. Connect the frontend

Set `apps/web/.env`:

```dotenv
PUBLIC_SITE_URL=http://127.0.0.1:4321
CMS_URL=http://localhost:3001
PUBLIC_CMS_URL=http://localhost:3001
CMS_READ_TOKEN=
```

- `CMS_URL` selects build-time CMS content. Leave empty for JSON mode.
- `PUBLIC_CMS_URL` optionally refreshes CV metadata in the browser. Leave empty for a static CV link. It is public, so never put credentials in this URL.
- `CMS_READ_TOKEN` is normally empty because published snapshots are public. For deliberately authenticated reads, enable a Users API key in Payload and put the key here. The header is `Authorization: users API-Key <key>`. This starter does not create a restricted read-only role; protect the key as an admin credential.
- `PUBLIC_SITE_URL` must match the browser origin allowed by CMS CORS. `localhost` and `127.0.0.1`, and different ports, are different origins.

Restart after development env/content changes:

```sh
pnpm --filter @garden/web exec astro dev stop
pnpm dev
```

Run `pnpm build` to validate the complete snapshot. The CMS snapshot replaces local content rather than merging arrays. A configured but unreachable/invalid CMS fails the build. Fix it or deliberately clear `CMS_URL` to select JSON mode.

## Environment reference

### CMS service: `apps/cms/.env`

| Variable               | Required                   | Purpose                                                              |
| ---------------------- | -------------------------- | -------------------------------------------------------------------- |
| `DATABASE_URL`         | Yes                        | PostgreSQL URL, with provider SSL settings where needed              |
| `PAYLOAD_SECRET`       | Yes                        | Stable random secret, 32+ characters                                 |
| `CMS_PUBLIC_URL`       | For configured deployment  | CMS origin, e.g. `https://cms.your-domain.example`, without `/admin` |
| `PUBLIC_SITE_URL`      | For configured deployment  | Allowed website origin for browser CV requests                       |
| `R2_BUCKET`            | Optional group             | Bucket name; enables R2                                              |
| `R2_ENDPOINT`          | With R2                    | `https://<account-id>.r2.cloudflarestorage.com`                      |
| `R2_ACCESS_KEY_ID`     | With R2                    | Storage access key                                                   |
| `R2_SECRET_ACCESS_KEY` | With R2                    | Matching storage secret                                              |
| `BUILD_WEBHOOK_URL`    | Optional pair              | Your trusted rebuild receiver URL                                    |
| `BUILD_WEBHOOK_SECRET` | With hook URL              | Separate random HMAC secret shared with receiver                     |
| `ALLOW_SEED`           | Intentional bootstrap only | Exact string `true`; otherwise false                                 |
| `NODE_ENV`             | Production service         | Set `production` to disable development schema push                  |

Set all four R2 values or leave all empty. Set both webhook values or leave both empty. Never put CMS secrets in `PUBLIC_` variables.

### Frontend build: `apps/web/.env`

| Variable          | Example                           | Scope                        |
| ----------------- | --------------------------------- | ---------------------------- |
| `PUBLIC_SITE_URL` | `https://your-domain.example`     | Canonical URLs; public       |
| `CMS_URL`         | `https://cms.your-domain.example` | Build only                   |
| `PUBLIC_CMS_URL`  | `https://cms.your-domain.example` | Browser CV request; optional |
| `CMS_READ_TOKEN`  | Optional Users API key            | Build only; secret           |

Configure each service separately. Setting `CMS_URL` on the CMS host does not configure the frontend build. A deployed static site needs a new build after environment changes.

## Production deployment

Deploy the CMS to a Node host supporting Next.js, with PostgreSQL and persistent media storage. Static Sites hosting publishes only the Astro frontend. See [Payload deployment](https://payloadcms.com/docs/production/deployment).

1. Configure production CMS variables, HTTPS origins, database and storage credentials.
2. Create/review migrations using development or staging:

   ```sh
   pnpm --filter @garden/cms migrate:create
   ```

3. Commit migration files, test on staging, back up production, then apply through your deployment step with `NODE_ENV=production` and the production environment:

   ```sh
   pnpm --filter @garden/cms migrate
   ```

4. With required environment available, build and start:

   ```sh
   pnpm --filter @garden/cms generate:importmap
   pnpm cms:build
   pnpm cms:start
   ```

5. Set the frontend build variables, verify the CMS snapshot, then build/deploy root `dist/`.

The start script uses port 3001. A Linux host assigning `PORT` can use `pnpm --filter @garden/cms exec next start -p "$PORT"` as its start command. Preserve the workspace packages during CMS builds; copying only `apps/cms` omits its shared schema dependency.

Do not run development schema push or bootstrap seed against an existing production database. Use [Payload migrations](https://payloadcms.com/docs/database/migrations) for production changes.

### Persistent media

Without R2, mount persistent storage at `apps/cms/media/` and back it up. PostgreSQL stores metadata, not file bytes; a database backup alone does not preserve uploads.

For ephemeral Node hosts, configure all R2 values. The S3 adapter uses the R2 endpoint with `region: auto`. Test a real upload/download after deployment. Storage credentials stay server-side. See [Payload storage adapters](https://payloadcms.com/docs/upload/storage-adapters).

## Publishing and automatic rebuilds

Publish in Payload → frontend build reads a fresh snapshot → deploy successful `dist/`. An open browser needs navigation/reload to receive new HTML. Cache busting does not publish pending CMS edits.

Manual rebuilds work without a hook. For automation, supported content publish hooks send:

- `X-Garden-Timestamp`: Unix time in **milliseconds**
- `X-Garden-Signature`: hexadecimal HMAC-SHA256 of `timestamp + "." + rawBody`
- Signing key: `BUILD_WEBHOOK_SECRET`

Your receiver should use [`tooling/scripts/verify-webhook.ts`](../tooling/scripts/verify-webhook.ts), verify the timestamp (five-minute window) and raw body before parsing, deduplicate deliveries, and queue your build/deploy job. Configure `BUILD_WEBHOOK_URL` only when that receiver exists. The repository includes a verifier, not a running receiver or provider-specific CI integration. A provider’s plain deploy hook is not automatically equivalent to this signed receiver.

Resume Settings does not send the rebuild hook. With `PUBLIC_CMS_URL`, the CV page fetches fresh metadata at runtime. Otherwise rebuild manually after a CV change.

## Troubleshooting

| Symptom                     | Check                                                                     |
| --------------------------- | ------------------------------------------------------------------------- |
| Secret validation error     | Replace placeholder with random secret, restart, run `cms:doctor`         |
| Database refused connection | PostgreSQL process, port, credentials, and SSL parameters                 |
| Admin import-map error      | Run `generate:importmap`, restart CMS                                     |
| No articles                 | Seeded posts are drafts; review/publish them                              |
| Snapshot validation error   | Complete/publish required fields; inspect the reported Zod path           |
| New CMS copy missing        | Rebuild and redeploy Astro; restart daemon in development                 |
| Browser CV request fails    | Exact CORS origin, `PUBLIC_CMS_URL`, HTTPS, and published Resume Settings |
| Uploads disappear           | Configure R2 or persistent CMS media storage                              |
| Seed refuses                | Inspect existing records; do not delete content blindly                   |
| JSON still showing          | Set `CMS_URL` on the frontend build service                               |

Source configuration is ready. A real CMS deployment still needs your database, admin, secrets, storage, and an end-to-end publish/rebuild check.
