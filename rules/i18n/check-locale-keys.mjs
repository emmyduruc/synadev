#!/usr/bin/env node
/**
 * Validates translation JSON files use snake_case keys.
 * Run: node rules/i18n/check-locale-keys.mjs
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

const LOCALE_PATTERNS = [
  /\.en\.json$/,
  /\.de\.json$/,
  /\.fr\.json$/,
  /\.es\.json$/,
];

const SNAKE_CASE = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;

const isLocaleFile = (filePath) =>
  LOCALE_PATTERNS.some((pattern) => pattern.test(filePath)) ||
  filePath.includes(`${path.sep}locales${path.sep}`) ||
  filePath.includes(`${path.sep}i18n${path.sep}`);

const collectJsonFiles = async (dir, files = []) => {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (
      entry.name === 'node_modules' ||
      entry.name === 'dist' ||
      entry.name === '.expo' ||
      entry.name === '.git'
    ) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await collectJsonFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.json') && isLocaleFile(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
};

const validateKeys = (value, keyPath, errors) => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return;
  }

  for (const [key, nested] of Object.entries(value)) {
    const fullKey = keyPath ? `${keyPath}.${key}` : key;

    if (!SNAKE_CASE.test(key)) {
      errors.push(`  ${fullKey}: key "${key}" must be snake_case`);
    }

    validateKeys(nested, fullKey, errors);
  }
};

const run = async () => {
  const files = await collectJsonFiles(rootDir);

  if (files.length === 0) {
    console.log('i18n: no locale JSON files found (skipping)');
    return;
  }

  let hasErrors = false;

  for (const file of files) {
    const relative = path.relative(rootDir, file);
    const content = await readFile(file, 'utf8');
    const errors = [];

    try {
      validateKeys(JSON.parse(content), '', errors);
    } catch {
      errors.push('  invalid JSON');
    }

    if (errors.length > 0) {
      hasErrors = true;
      console.error(`\n✖ ${relative}`);
      errors.forEach((error) => console.error(error));
    }
  }

  if (hasErrors) {
    console.error('\nLocale keys must use snake_case (e.g. welcome_message, sign_in_button).');
    process.exit(1);
  }

  console.log(`i18n: ${files.length} locale file(s) passed snake_case validation`);
};

run();
