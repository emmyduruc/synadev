import { useAuth } from '@clerk/expo';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useDeleteAccount } from '@/hooks/useDeleteAccount';
import { useTranslate } from '@/hooks/useTranslate';
import { ROUTES } from '@/lib/routes';
import { toast } from '@/lib/sonner';
import { BUTTON_VARIANT } from '@/lib/ui';

const CONFIRM_KIND = {
  signOut: 'sign_out',
  deleteAccount: 'delete_account',
} as const;

type ConfirmKind = (typeof CONFIRM_KIND)[keyof typeof CONFIRM_KIND] | null;

export const ProfileAccountActions = () => {
  const { t } = useTranslate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { signOut } = useAuth({ treatPendingAsSignedOut: false });
  const { deleteAccount, isDeleting } = useDeleteAccount();
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isWorking = isDeleting || isSigningOut;

  const closeConfirm = () => {
    if (isWorking) {
      return;
    }

    setConfirmKind(null);
  };

  const leaveSignedOut = async (href: typeof ROUTES.welcome | typeof ROUTES.intro) => {
    await signOut();
    router.replace(href);
  };

  const handleConfirm = async () => {
    if (!confirmKind || isWorking) {
      return;
    }

    try {
      if (confirmKind === CONFIRM_KIND.deleteAccount) {
        await deleteAccount();
        toast.success(t('profile_account_delete_success'));
        // Pre-auth intro (1/3) again — same as a fresh install — before signup.
        await leaveSignedOut(ROUTES.intro);
        return;
      }

      // Sign-out keeps bio caches and intro completion so the same account
      // returns to welcome, not the marketing stepper.
      setIsSigningOut(true);
      queryClient.clear();
      await leaveSignedOut(ROUTES.welcome);
    } catch {
      const errorKey =
        confirmKind === CONFIRM_KIND.deleteAccount
          ? 'profile_account_delete_error'
          : 'profile_account_sign_out_error';
      toast.error(t(errorKey));
      setIsSigningOut(false);
    }
  };

  const isDelete = confirmKind === CONFIRM_KIND.deleteAccount;

  return (
    <>
      <Box gap="sm" className="pt-2">
        <Button
          fullWidth
          size="lg"
          variant={BUTTON_VARIANT.warning}
          onPress={() => setConfirmKind(CONFIRM_KIND.signOut)}>
          {t('profile_account_sign_out_button')}
        </Button>
        <Button
          fullWidth
          size="lg"
          variant={BUTTON_VARIANT.danger}
          onPress={() => setConfirmKind(CONFIRM_KIND.deleteAccount)}>
          {t('profile_account_delete_button')}
        </Button>
      </Box>

      <ConfirmationModal
        visible={confirmKind !== null}
        title={
          isDelete
            ? t('profile_account_delete_confirm_title')
            : t('profile_account_sign_out_confirm_title')
        }
        message={
          isDelete
            ? t('profile_account_delete_confirm_message')
            : t('profile_account_sign_out_confirm_message')
        }
        confirmLabel={
          isDelete
            ? t('profile_account_delete_confirm_button')
            : t('profile_account_sign_out_confirm_button')
        }
        cancelLabel={t('profile_account_confirm_cancel')}
        confirmVariant={isDelete ? BUTTON_VARIANT.danger : BUTTON_VARIANT.warning}
        isConfirming={isWorking}
        onCancel={closeConfirm}
        onConfirm={() => {
          void handleConfirm();
        }}
      />
    </>
  );
};
