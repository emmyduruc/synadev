import { getAuthErrorMessage } from '@/lib/auth/errors';
import { toast } from '@/lib/sonner';

export const runAuthAction = async (action: () => Promise<void>) => {
  try {
    await action();
  } catch (caught) {
    toast.error(getAuthErrorMessage(caught));
  }
};
