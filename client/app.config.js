const path = require('node:path');
const fs = require('node:fs');

const { loadEnvFiles } = require('@expo/env');

const workspaceRoot = path.resolve(__dirname, '..');
const rootEnvPath = path.join(workspaceRoot, '.env');

if (fs.existsSync(rootEnvPath)) {
  loadEnvFiles([rootEnvPath], { silent: true });
}

/** @type {import('expo/config').ExpoConfig} */
module.exports = require('./app.json').expo;
