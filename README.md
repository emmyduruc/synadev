# SYNA

Monorepo for the SYNA mobile app and API.

## Structure

```
syna/
├── client/                 # Expo SDK 57 + Expo Router + NativeWind
├── backend/                # NestJS API with nestjs-zod
└── packages/
    ├── design-tokens/      # Shared color tokens
    ├── shared-types/       # Zod schemas (single source of truth)
    └── shared-utils/       # Pure TypeScript utilities
```

## Requirements

- Node.js >= 20.19 (SDK 57 recommends 22.13+)
- Yarn 4 (enforced via `packageManager` field)

## Getting started

```bash
# Install all dependencies
yarn install

# Run backend + client in parallel
yarn dev

# Or run individually
yarn workspace @syna/backend dev
yarn workspace @syna/client dev

# iOS (always from the client workspace — not repo root)
yarn workspace @syna/client ios
# or: cd client && npx expo run:ios
```

## Type sync (Zod)

Schemas live in `packages/shared-types`. Both client and backend import them:

- **Backend**: DTOs via `nestjs-zod` (`createZodDto`)
- **Client**: Runtime validation via `schema.parse()`

Change a schema field → TypeScript errors on both sides.

## Environment

Copy the templates and fill in real values (never commit `.env`):

```bash
cp .env.example .env
# or per package:
cp backend/.env.example backend/.env
cp client/.env.example client/.env
```

Prefer a **single repo-root `.env`** — Nest and Expo both resolve it.

### Backend (`@syna/backend`)

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `DATABASE_URL` | Yes | — | Postgres URL for the running API (pooled) |
| `DIRECT_URL` | Yes | — | Postgres URL for TypeORM migrations |
| `DATABASE_SYNCHRONIZE` | No | `false` | TypeORM `synchronize` (`true` \| `false`) |
| `RESEND_API_KEY` | When sending email | — | Resend API key |
| `RESEND_FROM_EMAIL` | When sending email | — | From address |
| `RESEND_FROM_NAME` | No | `SYNA` | From display name |
| `PORT` | No | `3000` | HTTP listen port |
| `NODE_ENV` | No | — | Swagger off when `production` |
| `SWAGGER_ENABLED` | No | on | Set `false` to disable Swagger |

### Client (`@syna/client`)

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | — | Clerk publishable key |
| `EXPO_PUBLIC_API_URL` | No | `http://localhost:3000` | Nest API base URL |

For Android emulator, use `http://10.0.2.2:3000` instead of `localhost`.

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start all apps (Turborepo) |
| `yarn build` | Build all packages |
| `yarn typecheck` | Type-check all packages |
| `yarn check` | **Run before commit** — lint (zero warnings), typecheck, i18n validation |
| `yarn lint` | Lint all packages |
| `yarn lint:fix` | Auto-fix lint issues |
