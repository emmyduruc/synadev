import globals from 'globals';
import { createBaseConfig } from './base.mjs';

const nestFilePatterns = [
  '**/*.module.ts',
  '**/*.controller.ts',
  '**/*.service.ts',
  '**/*.dto.ts',
  '**/*.entity.ts',
  '**/*.guard.ts',
  '**/*.decorator.ts',
  '**/*.pipe.ts',
  '**/*.interceptor.ts',
  '**/*.filter.ts',
  '**/migrations/**/*.ts',
  '**/database/migrations/**/*.ts',
  'src/database/migrations/**/*.ts',
  '**/*.migration.ts',
  '**/*.spec.ts',
  'test/**/*.ts',
];

/** @type {import('eslint').Linter.Config[]} */
export const backendConfig = (tsconfigRootDir) =>
  createBaseConfig({
    tsconfigRootDir,
    globals: {
      ...globals.node,
      ...globals.jest,
    },
    extends: [
      {
        files: nestFilePatterns,
        rules: {
          'no-restricted-syntax': 'off',
          'func-style': 'off',
          'import/no-default-export': 'off',
        },
      },
      {
        // TypeORM entities/migrations must use classes — allow local eslint-disable without unused-directive noise.
        files: [
          '**/*.entity.ts',
          '**/migrations/**/*.ts',
          '**/database/migrations/**/*.ts',
          'src/database/migrations/**/*.ts',
        ],
        linterOptions: {
          reportUnusedDisableDirectives: 'off',
        },
        rules: {
          'no-restricted-syntax': 'off',
        },
      },
    ],
  });
