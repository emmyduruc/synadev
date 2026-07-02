import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { createBaseConfig } from './base.mjs';
import { componentStandardsRules } from './rules/component-standards.mjs';

/** @type {import('eslint').Linter.Config[]} */
export const clientConfig = (tsconfigRootDir) =>
  createBaseConfig({
    tsconfigRootDir,
    globals: {
      ...globals.browser,
    },
    extends: [
      {
        files: ['**/*.{ts,tsx}'],
        plugins: {
          react: reactPlugin,
          'react-hooks': reactHooksPlugin,
        },
        settings: {
          react: { version: 'detect' },
        },
        rules: {
          ...reactHooksPlugin.configs.recommended.rules,
          'react/react-in-jsx-scope': 'off',
          'react/prop-types': 'off',
          'react/no-multi-comp': 'error',
          'react/jsx-no-useless-fragment': 'error',
          'import/no-unresolved': 'off',
          'import/namespace': 'off',
          'import/named': 'off',
          'import/default': 'off',
        },
      },
      {
        files: ['**/*.{config,config.*}.{js,mjs,ts}', 'eslint.config.mjs'],
        rules: {
          'import/no-default-export': 'off',
        },
      },
      {
        files: ['app/**/*.{ts,tsx}'],
        rules: {
          'import/no-default-export': 'off',
        },
      },
      {
        files: ['components/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
        rules: {
          ...componentStandardsRules,
          'no-restricted-imports': [
            'error',
            {
              patterns: [
                {
                  group: [
                    '@/lib/api',
                    '@/lib/http',
                    '**/lib/api',
                    '**/lib/http',
                    'axios',
                  ],
                  message:
                    'Keep HTTP/API logic out of UI. Use hooks from @/hooks that call @/lib/api.',
                },
              ],
            },
          ],
        },
      },
      {
        files: ['app/_layout.tsx'],
        rules: {
          '@typescript-eslint/no-require-imports': 'off',
        },
      },
      {
        files: ['tailwind.config.ts'],
        rules: {
          '@typescript-eslint/no-require-imports': 'off',
        },
      },
      {
        files: ['lib/http/**/*.{ts,tsx}'],
        rules: {
          'import/no-named-as-default-member': 'off',
        },
      },
    ],
  });
