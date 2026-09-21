import { SCREEN_HEADLINE_FONT_SIZE_PX } from '@/lib/ui/typography';

/** @deprecated Prefer `SCREEN_HEADLINE_FONT_SIZE_PX` from `@/lib/ui/typography`. */
export const AUTH_HEADLINE_FONT_SIZE_PX = SCREEN_HEADLINE_FONT_SIZE_PX;

export const AUTH_PROVIDER = {
  google: 'google',
  apple: 'apple',
} as const;

export const AUTH_STRATEGY = {
  google: 'oauth_google',
  apple: 'oauth_apple',
  emailCode: 'email_code',
  resetPasswordEmailCode: 'reset_password_email_code',
} as const;

export const AUTH_COPY = {
  genericError: 'Something went wrong. Please try again.',
  registrationVerifyPrompt: 'Enter the verification code sent to your email.',
  resetEmailPrompt: 'Enter your email to receive a reset code.',
  resetVerifyPrompt: 'Enter the code from your email and choose a new password.',
  resetSuccess: 'Password reset complete. You can now log in.',
} as const;

export type AuthProvider = keyof typeof AUTH_PROVIDER;
