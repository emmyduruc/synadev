#!/usr/bin/env bash
# Deploy @syna/backend to Google Cloud Run from your machine (no GitHub CI).
#
# Builds the Docker image with Google Cloud Build (runs in GCP) so yarn/npm
# installs are not blocked by Docker Desktop TLS issues on your laptop.
#
# Prerequisites:
#   - gcloud CLI installed and logged in: gcloud auth login
#   - Billing enabled on the GCP project
#
# Usage (from monorepo root):
#   ./scripts/deploy-backend-cloud-run.sh
#
# Optional:
#   USE_LOCAL_DOCKER=1  — build with local Docker instead of Cloud Build
#   GCP_PROJECT_ID=... GCP_REGION=europe-west1 ./scripts/deploy-backend-cloud-run.sh
#
# Backend runtime config (loaded from repo-root `.env`, then `backend/.env`):
#   Secrets → Secret Manager, mounted on Cloud Run:
#     CLERK_SECRET_KEY, DATABASE_URL, DIRECT_URL, OPENAI_API_KEY, RESEND_API_KEY
#   Plain env vars → Cloud Run:
#     NODE_ENV, DATABASE_SYNCHRONIZE, OPENAI_MODEL, RESEND_FROM_EMAIL, RESEND_FROM_NAME
#
# Client-only keys (EXPO_PUBLIC_*) are ignored.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Load local env files without overriding variables already set in the shell.
load_env_file() {
  local file="$1"
  [[ -f "$file" ]] || return 0

  echo "==> Loading env from ${file#"$ROOT_DIR"/}"
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]] || continue

    local key="${BASH_REMATCH[1]}"
    local value="${BASH_REMATCH[2]}"

    if [[ "$value" =~ ^\"(.*)\"$ ]]; then
      value="${BASH_REMATCH[1]}"
    elif [[ "$value" =~ ^\'(.*)\'$ ]]; then
      value="${BASH_REMATCH[1]}"
    fi

    if [[ -z "${!key:-}" ]]; then
      export "${key}=${value}"
    fi
  done < "$file"
}

load_env_file "${ROOT_DIR}/.env"
load_env_file "${ROOT_DIR}/backend/.env"

PROJECT_ID="${GCP_PROJECT_ID:-macro-outpost-463419-j8}"
REGION="${GCP_REGION:-europe-west1}"
ARTIFACT_REGISTRY="${GCP_ARTIFACT_REGISTRY:-syna}"
SERVICE="${GCP_CLOUD_RUN_SERVICE:-syna-backend}"
IMAGE_NAME="${SERVICE}"
TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)}"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY}/${IMAGE_NAME}"
IMAGE_TAGGED="${IMAGE}:${TAG}"
IMAGE_LATEST="${IMAGE}:latest"
USE_LOCAL_DOCKER="${USE_LOCAL_DOCKER:-0}"

echo "==> Project:  ${PROJECT_ID}"
echo "==> Region:   ${REGION}"
echo "==> Service:  ${SERVICE}"
echo "==> Image:    ${IMAGE_TAGGED}"

REQUIRED_KEYS=(CLERK_SECRET_KEY DATABASE_URL DIRECT_URL OPENAI_API_KEY)
MISSING_REQUIRED=()
for key in "${REQUIRED_KEYS[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    MISSING_REQUIRED+=("${key}")
  fi
done

if [[ ${#MISSING_REQUIRED[@]} -eq 0 ]]; then
  echo "==> Required backend env: CLERK_SECRET_KEY, DATABASE_URL, DIRECT_URL, OPENAI_API_KEY (found)"
else
  echo "==> Required backend env: missing ${MISSING_REQUIRED[*]}"
  echo "    Put them in .env at the repo root, then re-run."
  exit 1
fi

if ! command -v gcloud >/dev/null 2>&1; then
  echo "error: gcloud CLI not found. Install: https://cloud.google.com/sdk/docs/install"
  exit 1
fi

gcloud config set project "${PROJECT_ID}" >/dev/null

echo "==> Enabling required APIs (safe to re-run)..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  --project="${PROJECT_ID}"

echo "==> Ensuring Artifact Registry repo exists..."
if ! gcloud artifacts repositories describe "${ARTIFACT_REGISTRY}" \
  --location="${REGION}" \
  --project="${PROJECT_ID}" >/dev/null 2>&1; then
  gcloud artifacts repositories create "${ARTIFACT_REGISTRY}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="SYNA backend images" \
    --project="${PROJECT_ID}"
fi

PROJECT_NUMBER="$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')"
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo "==> Ensuring Cloud Build can push to Artifact Registry..."
for SA in "${CLOUDBUILD_SA}" "${COMPUTE_SA}"; do
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${SA}" \
    --role="roles/artifactregistry.writer" \
    --condition=None \
    --quiet >/dev/null || true
done

if [[ "${USE_LOCAL_DOCKER}" == "1" ]]; then
  if ! command -v docker >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
    echo "error: USE_LOCAL_DOCKER=1 but Docker is not available/running."
    exit 1
  fi

  echo "==> Configuring Docker auth for Artifact Registry..."
  gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

  echo "==> Building image locally (linux/amd64)..."
  docker build \
    --platform=linux/amd64 \
    --tag "${IMAGE_TAGGED}" \
    --tag "${IMAGE_LATEST}" \
    --file Dockerfile \
    .

  echo "==> Pushing image..."
  docker push "${IMAGE_TAGGED}"
  docker push "${IMAGE_LATEST}"
else
  echo "==> Building & pushing image with Cloud Build (in GCP)..."
  echo "    Tip: set USE_LOCAL_DOCKER=1 to build on your laptop instead."
  gcloud builds submit \
    --project="${PROJECT_ID}" \
    --config=cloudbuild.yaml \
    --substitutions="_REGION=${REGION},_REPO=${ARTIFACT_REGISTRY},_SERVICE=${SERVICE},_TAG=${TAG}" \
    --quiet \
    .
fi

# --- Cloud Run env + secrets -------------------------------------------------

# Escape commas in env values for gcloud --set-env-vars (comma-separated list).
escape_env_value() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//,/\\,}"
  printf '%s' "${value}"
}

ENV_VAR_FLAGS=(
  "NODE_ENV=production"
  "DATABASE_SYNCHRONIZE=false"
)

if [[ -n "${OPENAI_MODEL:-}" ]]; then
  ENV_VAR_FLAGS+=("OPENAI_MODEL=$(escape_env_value "${OPENAI_MODEL}")")
else
  ENV_VAR_FLAGS+=("OPENAI_MODEL=gpt-4o-mini")
fi

if [[ -n "${RESEND_FROM_EMAIL:-}" ]]; then
  ENV_VAR_FLAGS+=("RESEND_FROM_EMAIL=$(escape_env_value "${RESEND_FROM_EMAIL}")")
fi

if [[ -n "${RESEND_FROM_NAME:-}" ]]; then
  ENV_VAR_FLAGS+=("RESEND_FROM_NAME=$(escape_env_value "${RESEND_FROM_NAME}")")
fi

SECRET_FLAGS=()
SECRET_NAMES=()

# Upsert a Secret Manager secret and map it to a Cloud Run env var.
# Args: ENV_VAR_NAME secret-manager-id
upsert_secret() {
  local env_key="$1"
  local secret_name="$2"
  local value="${!env_key:-}"

  if [[ -z "${value}" ]]; then
    return 1
  fi

  echo "==> Upserting Secret Manager: ${secret_name} → ${env_key}"
  if gcloud secrets describe "${secret_name}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
    printf '%s' "${value}" | gcloud secrets versions add "${secret_name}" \
      --project="${PROJECT_ID}" --data-file=-
  else
    printf '%s' "${value}" | gcloud secrets create "${secret_name}" \
      --project="${PROJECT_ID}" --data-file=-
  fi

  SECRET_FLAGS+=("${env_key}=${secret_name}:latest")
  SECRET_NAMES+=("${secret_name}")
  return 0
}

upsert_secret CLERK_SECRET_KEY clerk-secret-key
upsert_secret DATABASE_URL database-url
upsert_secret DIRECT_URL direct-url
upsert_secret OPENAI_API_KEY openai-api-key

# Email is optional at boot; inject when present in .env.
upsert_secret RESEND_API_KEY resend-api-key || true

DEPLOY_ARGS=(
  run deploy "${SERVICE}"
  --project="${PROJECT_ID}"
  --region="${REGION}"
  --image="${IMAGE_TAGGED}"
  --port=8080
  --cpu=1
  --memory=512Mi
  --concurrency=80
  --min-instances=0
  --max-instances=10
  --timeout=300
  --cpu-boost
  --allow-unauthenticated
  --set-env-vars="$(IFS=,; echo "${ENV_VAR_FLAGS[*]}")"
)

if [[ ${#SECRET_FLAGS[@]} -gt 0 ]]; then
  DEPLOY_ARGS+=(--set-secrets="$(IFS=,; echo "${SECRET_FLAGS[*]}")")
fi

# Runtime SA needs Secret Manager access when --set-secrets is used.
if [[ ${#SECRET_NAMES[@]} -gt 0 ]]; then
  echo "==> Ensuring Cloud Run runtime can read secrets..."
  RUNTIME_SA="$(gcloud run services describe "${SERVICE}" \
    --project="${PROJECT_ID}" \
    --region="${REGION}" \
    --format='value(spec.template.spec.serviceAccountName)' 2>/dev/null || true)"
  if [[ -z "${RUNTIME_SA}" ]]; then
    RUNTIME_SA="${COMPUTE_SA}"
  fi
  for SECRET_NAME in "${SECRET_NAMES[@]}"; do
    gcloud secrets add-iam-policy-binding "${SECRET_NAME}" \
      --project="${PROJECT_ID}" \
      --member="serviceAccount:${RUNTIME_SA}" \
      --role="roles/secretmanager.secretAccessor" \
      --quiet >/dev/null || true
  done
fi

echo "==> Deploying to Cloud Run..."
gcloud "${DEPLOY_ARGS[@]}"

URL="$(gcloud run services describe "${SERVICE}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --format='value(status.url)')"

echo
echo "Deployed: ${URL}"
echo "Health:   ${URL}/health"
echo "Mounted secrets: ${SECRET_FLAGS[*]}"
echo "Plain env:       ${ENV_VAR_FLAGS[*]}"
