import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const migrationsDir = './src/database/migrations';

const migrationNamePattern = /^[a-zA-Z][a-zA-Z0-9-_]*$/;

const printUsage = () => {
  console.error('Usage: yarn db:migration:generate <MigrationName>');
  console.error('Example: yarn db:migration:generate InitialSchema');
  console.error('');
  console.error('TypeORM adds a timestamp prefix automatically (e.g. 1710000000000-InitialSchema.ts).');
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
    'migration:generate',
    migrationPath,
  ],
  {
    cwd: backendRoot,
    stdio: 'inherit',
  },
);

process.exit(result.status ?? 1);
