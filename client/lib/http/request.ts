import type { z } from 'zod';

import { httpClient } from './client';
import { createApiClientError } from './errors';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiRequestConfig<TResponse> = {
  url: string;
  method?: HttpMethod;
  body?: unknown;
  bodySchema?: z.ZodType;
  responseSchema: z.ZodType<TResponse>;
  params?: Record<string, string | number | boolean | undefined>;
};

const parseRequestBody = (body: unknown, bodySchema?: z.ZodType): unknown => {
  if (body === undefined) {
    return undefined;
  }

  if (!bodySchema) {
    return body;
  }

  const result = bodySchema.safeParse(body);

  if (!result.success) {
    throw createApiClientError('Request body failed validation', 0, {
      zodError: result.error,
      cause: result.error,
    });
  }

  return result.data;
};

const parseResponseBody = <TResponse>(
  data: unknown,
  responseSchema: z.ZodType<TResponse>,
): TResponse => {
  const result = responseSchema.safeParse(data);

  if (!result.success) {
    throw createApiClientError('Response did not match expected schema', 0, {
      zodError: result.error,
      cause: result.error,
    });
  }

  return result.data;
};

export const apiRequest = async <TResponse>(
  config: ApiRequestConfig<TResponse>,
): Promise<TResponse> => {
  const body = parseRequestBody(config.body, config.bodySchema);

  const response = await httpClient.request({
    url: config.url,
    method: config.method ?? 'GET',
    data: body,
    params: config.params,
  });

  return parseResponseBody(response.data, config.responseSchema);
};
