#
# Multi-stage image for @syna/backend (NestJS) on Google Cloud Run.
# Build from the monorepo root:
#   docker build -t syna-backend .
#
# Cloud Run injects PORT (default 8080). Required runtime env:
#   CLERK_SECRET_KEY, DATABASE_URL, DIRECT_URL
# Optional: RESEND_*, NODE_ENV=production, DATABASE_SYNCHRONIZE=false

ARG NODE_VERSION=22.14.0
# Prefer Google's Docker Hub mirror — avoids registry-1.docker.io TLS timeouts.
ARG NODE_IMAGE=mirror.gcr.io/library/node:${NODE_VERSION}-bookworm-slim

FROM ${NODE_IMAGE} AS base
WORKDIR /app
# Use the repo-vendored Yarn binary (.yarn/releases) — no Corepack download at build time.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# -----------------------------------------------------------------------------
# Install all workspace deps (Yarn needs every workspace package.json present)
# -----------------------------------------------------------------------------
FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
COPY backend/package.json ./backend/
COPY client/package.json ./client/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-utils/package.json ./packages/shared-utils/
COPY packages/design-tokens/package.json ./packages/design-tokens/
COPY packages/eslint-config/package.json ./packages/eslint-config/
# Lower concurrency helps flaky TLS; Cloud Build is preferred for installs.
ENV YARN_NETWORK_CONCURRENCY=4 \
    YARN_HTTP_TIMEOUT=300000
RUN node .yarn/releases/yarn-4.9.2.cjs install --immutable

# -----------------------------------------------------------------------------
# Build shared packages + Nest backend
# -----------------------------------------------------------------------------
FROM deps AS build
COPY turbo.json tsconfig.base.json tsconfig.json ./
COPY packages/eslint-config ./packages/eslint-config
COPY packages/shared-types ./packages/shared-types
COPY packages/shared-utils ./packages/shared-utils
COPY backend ./backend
RUN node .yarn/releases/yarn-4.9.2.cjs workspace @syna/shared-types build \
  && node .yarn/releases/yarn-4.9.2.cjs workspace @syna/shared-utils build \
  && node .yarn/releases/yarn-4.9.2.cjs workspace @syna/backend build

# -----------------------------------------------------------------------------
# Production-only node_modules for the backend workspace
# -----------------------------------------------------------------------------
FROM base AS prod-deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
COPY backend/package.json ./backend/
COPY client/package.json ./client/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-utils/package.json ./packages/shared-utils/
COPY packages/design-tokens/package.json ./packages/design-tokens/
COPY packages/eslint-config/package.json ./packages/eslint-config/
ENV YARN_NETWORK_CONCURRENCY=4 \
    YARN_HTTP_TIMEOUT=300000
RUN node .yarn/releases/yarn-4.9.2.cjs workspaces focus @syna/backend --production

# -----------------------------------------------------------------------------
# Runtime image (reuse base so we don't pull Node twice)
# -----------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8080

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=prod-deps --chown=node:node /app/package.json ./package.json
COPY --from=prod-deps --chown=node:node /app/backend/package.json ./backend/package.json
COPY --from=prod-deps --chown=node:node /app/packages/shared-types/package.json ./packages/shared-types/package.json
COPY --from=prod-deps --chown=node:node /app/packages/shared-utils/package.json ./packages/shared-utils/package.json

COPY --from=build --chown=node:node /app/backend/dist ./backend/dist
COPY --from=build --chown=node:node /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=build --chown=node:node /app/packages/shared-utils/dist ./packages/shared-utils/dist

USER node
EXPOSE 8080

CMD ["node", "backend/dist/main.js"]
