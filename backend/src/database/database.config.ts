import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';
import { z } from 'zod';

export const DatabaseEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required'),
  DATABASE_SYNCHRONIZE: z
    .enum(['true', 'false'])
    .optional()
    .default('false'),
});

export type DatabaseEnv = z.infer<typeof DatabaseEnvSchema>;

type PostgresSsl = PostgresConnectionOptions['ssl'];

const inferSsl = (url: string): PostgresSsl => {
  if (url.includes('sslmode=disable')) {
    return false;
  }

  if (
    url.includes('sslmode=require')
    || url.includes('supabase.co')
    || url.includes('neon.tech')
  ) {
    return { rejectUnauthorized: false };
  }

  return undefined;
};

export const parseDatabaseEnv = (): DatabaseEnv => {
  const result = DatabaseEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    DATABASE_SYNCHRONIZE: process.env.DATABASE_SYNCHRONIZE ?? 'false',
  });

  if (!result.success) {
    const messages = result.error.issues.map((issue) => issue.message).join('; ');
    throw new Error(`Database configuration invalid: ${messages}`);
  }

  return result.data;
};

type BuildDatabaseOptionsParams = {
  forMigrations?: boolean;
};

export const buildDatabaseOptions = (
  env: DatabaseEnv,
  params: BuildDatabaseOptionsParams = {},
): PostgresConnectionOptions => {
  const connectionUrl = params.forMigrations ? env.DIRECT_URL : env.DATABASE_URL;

  return {
    type: 'postgres',
    url: connectionUrl,
    ssl: inferSsl(connectionUrl),
    synchronize: env.DATABASE_SYNCHRONIZE === 'true',
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  };
};

export const buildTypeOrmModuleOptions = (env: DatabaseEnv): TypeOrmModuleOptions => {
  const options = buildDatabaseOptions(env);

  return {
    type: options.type,
    url: options.url,
    ssl: options.ssl,
    synchronize: options.synchronize,
    autoLoadEntities: true,
  };
};
