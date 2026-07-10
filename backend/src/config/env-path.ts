import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export const resolveEnvFilePaths = (): string[] => {
  const candidates = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '../.env'),
    resolve(__dirname, '../../.env'),
    resolve(__dirname, '../../../.env'),
  ];

  return [...new Set(candidates.filter(existsSync))];
};
