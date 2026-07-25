import { useRegisterClerkAccessToken } from '@/hooks/useRegisterClerkAccessToken';

/**
 * Must render inside ClerkProvider so the Axios interceptor can attach Bearer tokens.
 */
export const ClerkAuthTokenBridge = () => {
  useRegisterClerkAccessToken();
  return null;
};
