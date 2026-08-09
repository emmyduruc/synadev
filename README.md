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
| `CLERK_SECRET_KEY` | Yes (for `/users/me*`) | — | Verifies Clerk session JWTs |
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

## Deploy (Cloud Run)

The Nest API is containerized from the monorepo root (`Dockerfile`).

### Deploy from your machine (no CI)

Uses your logged-in `gcloud` user — no GitHub / Workload Identity setup required.

```bash
# One-time: install gcloud, then
gcloud auth login
gcloud auth application-default login   # optional but useful locally

# Deploy (defaults: project macro-outpost-463419-j8, region europe-west1)
# Reads CLERK_SECRET_KEY, DATABASE_URL, DIRECT_URL from repo-root `.env`
# Builds the image with Cloud Build in GCP (avoids Docker Desktop npm TLS issues)
yarn deploy:backend
```

Migrations are **not** run on container start. Apply them separately against `DIRECT_URL`:

```bash
yarn workspace @syna/backend db:migration:run
```

### Local image (smoke test)

```bash
docker build --platform=linux/amd64 -t syna-backend .
docker run --rm -p 8080:8080 \
  -e CLERK_SECRET_KEY=... \
  -e DATABASE_URL=... \
  -e DIRECT_URL=... \
  -e NODE_ENV=production \
  syna-backend
# Health: curl http://localhost:8080/health
```

### CI on `main` (optional, later)

[`.github/workflows/deploy-backend.yml`](.github/workflows/deploy-backend.yml) deploys on every push to `main` once GitHub variables/secrets and Workload Identity are configured.

### One-time GCP setup (for CI)

Replace `PROJECT_ID`, `REGION` (e.g. `europe-west1`), and account emails as needed.

```bash
export PROJECT_ID=your-gcp-project
export REGION=europe-west1
export REPO=syna
export SERVICE=syna-backend

gcloud config set project "$PROJECT_ID"
gcloud services enable run.googleapis.com artifactregistry.googleapis.com \
  iamcredentials.googleapis.com secretmanager.googleapis.com

gcloud artifacts repositories create "$REPO" \
  --repository-format=docker \
  --location="$REGION"

# Deployer service account used by GitHub Actions
gcloud iam service-accounts create github-deploy \
  --display-name="GitHub Actions Cloud Run deploy"

PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
DEPLOY_SA="github-deploy@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${DEPLOY_SA}" --role="roles/run.admin"
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${DEPLOY_SA}" --role="roles/artifactregistry.writer"
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${DEPLOY_SA}" --role="roles/iam.serviceAccountUser"

# Workload Identity Federation (GitHub → GCP, no JSON keys)
gcloud iam workload-identity-pools create github \
  --location=global --display-name="GitHub Actions"
gcloud iam workload-identity-pools providers create-oidc github \
  --location=global \
  --workload-identity-pool=github \
  --display-name="GitHub" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
  --attribute-condition="assertion.repository_owner=='YOUR_GITHUB_ORG'" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# Allow this repo to impersonate the deployer SA (replace OWNER/REPO)
gcloud iam service-accounts add-iam-policy-binding "$DEPLOY_SA" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github/attribute.repository/OWNER/REPO"
```

Store app secrets in Secret Manager, then attach them to the Cloud Run service once (later deploys keep them when only the image changes):

```bash
# Example: create secrets from stdin
echo -n "$CLERK_SECRET_KEY" | gcloud secrets create clerk-secret-key --data-file=-
echo -n "$DATABASE_URL" | gcloud secrets create database-url --data-file=-
echo -n "$DIRECT_URL" | gcloud secrets create direct-url --data-file=-

# First deploy / bind secrets (run once, or after secret changes)
gcloud run deploy "$SERVICE" \
  --region="$REGION" \
  --image="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE}:latest" \
  --port=8080 \
  --set-env-vars="NODE_ENV=production,DATABASE_SYNCHRONIZE=false" \
  --set-secrets="CLERK_SECRET_KEY=clerk-secret-key:latest,DATABASE_URL=database-url:latest,DIRECT_URL=direct-url:latest" \
  --allow-unauthenticated
```

Grant the Cloud Run runtime service account `roles/secretmanager.secretAccessor` on those secrets.

### GitHub configuration

**Repository variables**

| Variable | Example |
|----------|---------|
| `GCP_PROJECT_ID` | `your-gcp-project` |
| `GCP_REGION` | `europe-west1` |
| `GCP_ARTIFACT_REGISTRY` | `syna` |
| `GCP_CLOUD_RUN_SERVICE` | `syna-backend` |

**Repository secrets**

| Secret | Value |
|--------|--------|
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/github` |
| `GCP_SERVICE_ACCOUNT` | `github-deploy@PROJECT_ID.iam.gserviceaccount.com` |

Point the mobile app at the Cloud Run URL via `EXPO_PUBLIC_API_URL`.
