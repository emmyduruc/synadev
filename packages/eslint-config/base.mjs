import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsonc from 'eslint-plugin-jsonc';
import jsoncParser from 'jsonc-eslint-parser';
import tseslint from 'typescript-eslint';

const sharedRules = {
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  'no-var': 'error',
  'prefer-const': 'error',
  'prefer-arrow-callback': 'error',
  'object-shorthand': 'error',
  eqeqeq: ['error', 'always'],
  curly: ['error', 'all'],
  'no-nested-ternary': 'error',
  'func-style': ['error', 'expression', { allowArrowFunctions: true }],
  camelcase: [
    'error',
    {
      properties: 'always',
      ignoreDestructuring: true,
      allow: ['^[a-z]+(_[a-z]+)+$'],
    },
  ],
  'import/no-default-export': 'error',
  'import/order': [
    'error',
    {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
      ],
      alphabetize: { order: 'asc', caseInsensitive: true },
      'newlines-between': 'always',
    },
  ],
  'no-restricted-syntax': [
    'error',
    {
      selector: 'FunctionDeclaration',
      message:
        'Use arrow functions (const fn = () => {}) instead of function declarations.',
    },
    {
      selector: 'ClassDeclaration',
      message:
        'Classes are not allowed. Use functions, hooks, and modules instead.',
    },
  ],
};

const typescriptRules = {
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
  ],
  '@typescript-eslint/no-explicit-any': 'error',
};

/** Locale / translation JSON files — keys must be snake_case */
const localeJsonConfig = {
  files: [
    '**/*.en.json',
    '**/*.de.json',
    '**/*.fr.json',
    '**/*.es.json',
    '**/locales/**/*.json',
    '**/i18n/**/*.json',
  ],
  languageOptions: {
    parser: jsoncParser,
  },
  plugins: {
    jsonc,
  },
  rules: {
    'jsonc/key-name-casing': [
      'error',
      {
        camelCase: false,
        PascalCase: false,
        SCREAMING_SNAKE_CASE: false,
        snake_case: true,
      },
    ],
  },
};

/**
 * @param {object} options
 * @param {string} options.tsconfigRootDir
 * @param {import('globals').Globals} [options.globals]
 * @param {import('eslint').Linter.Config[]} [options.extends]
 */
export const createBaseConfig = ({
  tsconfigRootDir,
  globals: extraGlobals = {},
  extends: extraConfigs = [],
}) =>
  tseslint.config(
    {
      ignores: [
        '**/dist/**',
        '**/node_modules/**',
        '**/.expo/**',
        '**/coverage/**',
        '**/*.config.js',
        '**/*.config.mjs',
      ],
    },
    localeJsonConfig,
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
        importPlugin.flatConfigs.recommended,
        importPlugin.flatConfigs.typescript,
      ],
      languageOptions: {
        globals: extraGlobals,
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
      rules: {
        ...sharedRules,
        ...typescriptRules,
      },
    },
    ...extraConfigs,
  );
