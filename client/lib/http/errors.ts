import { ApiErrorSchema, type ApiError } from '@syna/shared-types';
import { isAxiosError, type AxiosError } from 'axios';
import { ZodError } from 'zod';

export type ApiClientError = Error & {
  name: 'ApiClientError';
  statusCode: number;
  apiError?: ApiError;
  zodError?: ZodError;
  validationMessages: string[];
};

const buildValidationMessages = (options: {
  message: string;
  apiError?: ApiError;
  zodError?: ZodError;
}): string[] => {
  if (options.zodError) {
    return options.zodError.errors.map((issue) => issue.message);
  }

  if (options.apiError?.errors?.length) {
    return options.apiError.errors.map((issue) => issue.message);
  }

  if (options.apiError) {
    return Array.isArray(options.apiError.message)
      ? options.apiError.message
      : [options.apiError.message];
  }

  return [options.message];
};

export const createApiClientError = (
  message: string,
  statusCode: number,
  options?: {
    apiError?: ApiError;
    zodError?: ZodError;
    cause?: unknown;
  },
): ApiClientError => {
  const error = new Error(message, { cause: options?.cause }) as ApiClientError;

  error.name = 'ApiClientError';
  error.statusCode = statusCode;
  error.apiError = options?.apiError;
  error.zodError = options?.zodError;
  error.validationMessages = buildValidationMessages({
    message,
    apiError: options?.apiError,
    zodError: options?.zodError,
  });

  return error;
};

export const isApiClientError = (error: unknown): error is ApiClientError => {
  return (
    error instanceof Error &&
    'name' in error &&
    error.name === 'ApiClientError' &&
    'statusCode' in error
  );
};

const formatApiErrorMessage = (apiError: ApiError): string => {
  if (apiError.errors?.length) {
    return apiError.errors.map((issue) => issue.message).join(', ');
  }

  if (Array.isArray(apiError.message)) {
    return apiError.message.join(', ');
  }

  return apiError.message;
};

const parseAxiosError = (error: AxiosError): ApiClientError => {
  const statusCode = error.response?.status ?? 0;
  const parsed = ApiErrorSchema.safeParse(error.response?.data);

  if (parsed.success) {
    return createApiClientError(formatApiErrorMessage(parsed.data), statusCode, {
      apiError: parsed.data,
      cause: error,
    });
  }

  return createApiClientError(error.message || 'Network request failed', statusCode, {
    cause: error,
  });
};

export const toApiClientError = (error: unknown): ApiClientError => {
  if (isApiClientError(error)) {
    return error;
  }

  if (error instanceof ZodError) {
    return createApiClientError('Response did not match expected schema', 0, {
      zodError: error,
      cause: error,
    });
  }

  if (isAxiosError(error)) {
    return parseAxiosError(error);
  }

  if (error instanceof Error) {
    return createApiClientError(error.message, 0, { cause: error });
  }

  return createApiClientError('Unknown error', 0, { cause: error });
};
