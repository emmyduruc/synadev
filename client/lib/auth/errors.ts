import { AUTH_COPY } from './constants';

type ClerkErrorShape = {
  errors?: Array<{ longMessage?: string; message?: string }>;
  message?: string;
};

export const getAuthErrorMessage = (caught: unknown): string => {
  const clerkError = caught as ClerkErrorShape;
  const firstError = clerkError.errors?.[0];

  return firstError?.longMessage ?? firstError?.message ?? clerkError.message ?? AUTH_COPY.genericError;
};
