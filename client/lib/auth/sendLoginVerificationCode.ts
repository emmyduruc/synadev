import type { SignInFutureResource } from '@clerk/shared/types';

const hasEmailCodeSecondFactor = (signIn: SignInFutureResource): boolean =>
  signIn.supportedSecondFactors.some((factor) => factor.strategy === 'email_code');

export const sendLoginVerificationCode = async (
  signIn: SignInFutureResource,
): Promise<void> => {
  if (!hasEmailCodeSecondFactor(signIn)) {
    throw new Error('Unsupported second factor strategy.');
  }

  const { error } = await signIn.mfa.sendEmailCode();

  if (error) {
    throw error;
  }
};
