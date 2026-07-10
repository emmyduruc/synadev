import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { resolveEnvFilePaths } from '../config/env-path';

import { buildDatabaseOptions, parseDatabaseEnv } from './database.config';

resolveEnvFilePaths().forEach((envPath) => {
  config({ path: envPath, override: false });
});

// TypeORM CLI requires a default export in the data source file.
// eslint-disable-next-line import/no-default-export
export default new DataSource(
  buildDatabaseOptions(parseDatabaseEnv(), { forMigrations: true }),
);
