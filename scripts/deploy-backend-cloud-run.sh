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
# Secrets (CLERK_SECRET_KEY, DATABASE_URL, DIRECT_URL):
#   - Loaded automatically from repo-root `.env` (then `backend/.env` for any still unset)

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

if [[ -n "${CLERK_SECRET_KEY:-}" && -n "${DATABASE_URL:-}" && -n "${DIRECT_URL:-}" ]]; then
  echo "==> Secrets:  CLERK_SECRET_KEY, DATABASE_URL, DIRECT_URL (found)"
else
  echo "==> Secrets:  missing one or more of CLERK_SECRET_KEY / DATABASE_URL / DIRECT_URL"
  echo "    Put them in .env at the repo root, then re-run."
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
  --set-env-vars="NODE_ENV=production,DATABASE_SYNCHRONIZE=false"
)

SECRET_FLAGS=()
if [[ -n "${CLERK_SECRET_KEY:-}" ]]; then
  echo "==> Upserting Secret Manager: clerk-secret-key"
  if gcloud secrets describe clerk-secret-key --project="${PROJECT_ID}" >/dev/null 2>&1; then
    printf '%s' "${CLERK_SECRET_KEY}" | gcloud secrets versions add clerk-secret-key \
      --project="${PROJECT_ID}" --data-file=-
  else
    printf '%s' "${CLERK_SECRET_KEY}" | gcloud secrets create clerk-secret-key \
      --project="${PROJECT_ID}" --data-file=-
  fi
  SECRET_FLAGS+=("CLERK_SECRET_KEY=clerk-secret-key:latest")
fi

if [[ -n "${DATABASE_URL:-}" ]]; then
  echo "==> Upserting Secret Manager: database-url"
  if gcloud secrets describe database-url --project="${PROJECT_ID}" >/dev/null 2>&1; then
    printf '%s' "${DATABASE_URL}" | gcloud secrets versions add database-url \
      --project="${PROJECT_ID}" --data-file=-
  else
    printf '%s' "${DATABASE_URL}" | gcloud secrets create database-url \
      --project="${PROJECT_ID}" --data-file=-
  fi
  SECRET_FLAGS+=("DATABASE_URL=database-url:latest")
fi

if [[ -n "${DIRECT_URL:-}" ]]; then
  echo "==> Upserting Secret Manager: direct-url"
  if gcloud secrets describe direct-url --project="${PROJECT_ID}" >/dev/null 2>&1; then
    printf '%s' "${DIRECT_URL}" | gcloud secrets versions add direct-url \
      --project="${PROJECT_ID}" --data-file=-
  else
    printf '%s' "${DIRECT_URL}" | gcloud secrets create direct-url \
      --project="${PROJECT_ID}" --data-file=-
  fi
  SECRET_FLAGS+=("DIRECT_URL=direct-url:latest")
fi

if [[ ${#SECRET_FLAGS[@]} -gt 0 ]]; then
  JOINED="$(IFS=,; echo "${SECRET_FLAGS[*]}")"
  DEPLOY_ARGS+=(--set-secrets="${JOINED}")
fi

# Runtime SA needs Secret Manager access when --set-secrets is used.
if [[ ${#SECRET_FLAGS[@]} -gt 0 ]]; then
  echo "==> Ensuring Cloud Run runtime can read secrets..."
  RUNTIME_SA="$(gcloud run services describe "${SERVICE}" \
    --project="${PROJECT_ID}" \
    --region="${REGION}" \
    --format='value(spec.template.spec.serviceAccountName)' 2>/dev/null || true)"
  if [[ -z "${RUNTIME_SA}" ]]; then
    RUNTIME_SA="${COMPUTE_SA}"
  fi
  for SECRET_NAME in clerk-secret-key database-url direct-url; do
    if gcloud secrets describe "${SECRET_NAME}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
      gcloud secrets add-iam-policy-binding "${SECRET_NAME}" \
        --project="${PROJECT_ID}" \
        --member="serviceAccount:${RUNTIME_SA}" \
        --role="roles/secretmanager.secretAccessor" \
        --quiet >/dev/null || true
    fi
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
