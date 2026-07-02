import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { patchNestJsSwagger } from 'nestjs-zod';

import {
  SWAGGER_API,
  SWAGGER_PATHS,
  SWAGGER_SERVERS,
  SWAGGER_TAGS,
} from './swagger.constants';

const isSwaggerEnabled = (): boolean =>
  process.env.SWAGGER_ENABLED !== 'false' && process.env.NODE_ENV !== 'production';

export const setupSwagger = (app: INestApplication): void => {
  if (!isSwaggerEnabled()) {
    return;
  }

  patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setTitle(SWAGGER_API.title)
    .setDescription(SWAGGER_API.description)
    .setVersion(SWAGGER_API.version)
    .setContact(SWAGGER_API.contactName, SWAGGER_API.contactUrl, 'engineering@syna.app')
    .addServer(SWAGGER_SERVERS.local, 'Local development')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Clerk session token or JWT bearer token',
      },
      'bearer',
    )
    .addTag(SWAGGER_TAGS.app, 'Root application endpoints')
    .addTag(SWAGGER_TAGS.health, 'Service health and readiness checks')
    .addTag(SWAGGER_TAGS.users, 'User registration and profile management')
    .addTag(SWAGGER_TAGS.uploads, 'Image and file upload endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey.replace(/Controller$/, '')}_${methodKey}`,
  });

  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: SWAGGER_PATHS.openApiJson,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      syntaxHighlight: {
        theme: 'monokai',
      },
    },
    customSiteTitle: `${SWAGGER_API.title} — Swagger UI`,
    customCss: `
      .swagger-ui .topbar { background-color: #6d2e46; }
      .swagger-ui .topbar .download-url-wrapper .select-label { color: #fff; }
      .swagger-ui .info .title { color: #6d2e46; }
      .swagger-ui .opblock-tag { font-size: 18px; }
    `,
  });

  app.use(
    `/${SWAGGER_PATHS.docs}`,
    apiReference({
      theme: 'purple',
      layout: 'modern',
      darkMode: true,
      metaData: {
        title: `${SWAGGER_API.title} — API Reference`,
        description: SWAGGER_API.description,
      },
      spec: {
        url: `/${SWAGGER_PATHS.openApiJson}`,
      },
      authentication: {
        preferredSecurityScheme: 'bearer',
      },
    }),
  );
};
