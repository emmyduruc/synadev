import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const migrationsDir = './src/database/migrations';

const migrationNamePattern = /^[a-zA-Z][a-zA-Z0-9-_]*$/;

const printUsage = () => {
  console.error('Usage: yarn db:migration:create <MigrationName>');
  console.error('Example: yarn db:migration:create AddUserProfileFields');
  console.error('');
  console.error('Creates an empty migration file with a timestamp prefix.');
};

const migrationName = process.argv[2];

if (!migrationName) {
  printUsage();
  process.exit(1);
}

if (!migrationNamePattern.test(migrationName)) {
  console.error(
    'Migration name must start with a letter and use only letters, numbers, hyphens, or underscores.',
  );
  process.exit(1);
}

const migrationPath = `${migrationsDir}/${migrationName}`;

const result = spawnSync(
  'yarn',
  [
    'typeorm',
    '-d',
    './src/database/data-source.ts',
    'migration:create',
    migrationPath,
  ],
  {
    cwd: backendRoot,
    stdio: 'inherit',
  },
);

process.exit(result.status ?? 1);
