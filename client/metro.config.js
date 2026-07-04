const path = require('node:path');
const fs = require('node:fs');

const { getDefaultConfig } = require('expo/metro-config');
const { loadEnvFiles } = require('@expo/env');
const { withNativeWind } = require('nativewind/metro');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const loadEnvIfExists = (envPath) => {
  if (fs.existsSync(envPath)) {
    loadEnvFiles([envPath], { silent: true });
  }
};

// Monorepo: load shared env from repo root, then client-specific overrides
loadEnvIfExists(path.join(workspaceRoot, '.env'));
loadEnvIfExists(path.join(workspaceRoot, '.env.local'));
loadEnvIfExists(path.join(projectRoot, '.env'));
loadEnvIfExists(path.join(projectRoot, '.env.local'));

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = withNativeWind(config, { input: './global.css' });
