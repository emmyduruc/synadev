import { toast as sonnerToast, Toaster } from 'sonner-native';

type ToastOptions = Parameters<typeof sonnerToast.error>[1];

const hasToastTitle = (title: unknown): title is string =>
  typeof title === 'string' && title.trim().length > 0;

const safeToastError = (title: unknown, options?: ToastOptions) => {
  if (!hasToastTitle(title)) {
    return sonnerToast.error('Something went wrong. Please try again.', options);
  }

  return sonnerToast.error(title, options);
};

const safeToastSuccess = (title: unknown, options?: ToastOptions) => {
  if (!hasToastTitle(title)) {
    return;
  }

  return sonnerToast.success(title, options);
};

export const toast = Object.assign(
  (title: string, options?: ToastOptions) => sonnerToast(title, options),
  {
    ...sonnerToast,
    error: safeToastError,
    success: safeToastSuccess,
  },
);

export { Toaster };
