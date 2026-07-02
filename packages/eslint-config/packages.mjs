import { createBaseConfig } from './base.mjs';

/** @type {import('eslint').Linter.Config[]} */
export const packagesConfig = (tsconfigRootDir) =>
  createBaseConfig({
    tsconfigRootDir,
    extends: [],
  });
