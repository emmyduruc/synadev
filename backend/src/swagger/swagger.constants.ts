export const SWAGGER_TAGS = {
  app: 'App',
  health: 'Health',
  users: 'Users',
  uploads: 'Uploads',
} as const;

export const SWAGGER_PATHS = {
  docs: 'docs',
  openApiJson: 'openapi.json',
} as const;

export const SWAGGER_API = {
  title: 'SYNA API',
  description:
    'SYNA Health Platform API — wearable data, health metrics, user management, and file uploads. ' +
    'All request/response schemas are auto-generated from Zod DTOs and stay in sync with controllers.',
  version: '1.0.0',
  contactName: 'SYNA Engineering',
  contactUrl: 'https://syna.app',
} as const;

export const SWAGGER_SERVERS = {
  local: 'http://localhost:3000',
} as const;
