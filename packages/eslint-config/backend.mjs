import globals from 'globals';
import { createBaseConfig } from './base.mjs';

const nestFilePatterns = [
  '**/*.module.ts',
  '**/*.controller.ts',
  '**/*.service.ts',
  '**/*.dto.ts',
  '**/*.guard.ts',
  '**/*.pipe.ts',
  '**/*.interceptor.ts',
  '**/*.filter.ts',
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
    ],
  });
