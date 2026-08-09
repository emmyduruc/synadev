const path = require('node:path');
const fs = require('node:fs');

const { loadEnvFiles } = require('@expo/env');

const clientDir = __dirname;
const workspaceRoot = path.resolve(clientDir, '..');

/**
 * Resolve which client env file to load.
 * - development / dev → `.env.dev` (localhost API)
 * - preview / production → `.env` (Cloud Run API)
 *
 * Override with APP_ENV=development|preview|production
 */
const resolveAppEnv = () => {
  const explicit = process.env.APP_ENV?.trim().toLowerCase();
  if (explicit === 'dev') {
    return 'development';
  }
  if (explicit) {
    return explicit;
  }

  // EAS sets EAS_BUILD_PROFILE to development | preview | production
  const easProfile = process.env.EAS_BUILD_PROFILE?.trim().toLowerCase();
  if (easProfile === 'development') {
    return 'development';
  }
  if (easProfile === 'preview') {
    return 'preview';
  }
  if (easProfile === 'production') {
    return 'production';
  }

  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }

  return 'development';
};

const appEnv = resolveAppEnv();
const isDevEnv = appEnv === 'development';

const clientEnvFile = isDevEnv
  ? path.join(clientDir, '.env.dev')
  : path.join(clientDir, '.env');

const envFilesToLoad = [];

// Root first (shared local secrets), then client file so it wins for API URL / Clerk.
const rootEnvPath = path.join(workspaceRoot, '.env');
if (fs.existsSync(rootEnvPath)) {
  envFilesToLoad.push(rootEnvPath);
}
envFilesToLoad.push(clientEnvFile);

const existingEnvFiles = envFilesToLoad.filter((filePath) => fs.existsSync(filePath));
if (existingEnvFiles.length > 0) {
  loadEnvFiles(existingEnvFiles, { silent: true });
}

/** @type {import('expo/config').ExpoConfig} */
const appConfig = require('./app.json').expo;

module.exports = {
  ...appConfig,
  extra: {
    ...appConfig.extra,
    appEnv,
    clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
  },
};
