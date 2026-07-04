const path = require('node:path');
const fs = require('node:fs');

const { loadEnvFiles } = require('@expo/env');

const workspaceRoot = path.resolve(__dirname, '..');
const rootEnvPath = path.join(workspaceRoot, '.env');

if (fs.existsSync(rootEnvPath)) {
  loadEnvFiles([rootEnvPath], { silent: true });
}

/** @type {import('expo/config').ExpoConfig} */
const appConfig = require('./app.json').expo;

module.exports = {
  ...appConfig,
  extra: {
    ...appConfig.extra,
    clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
};
