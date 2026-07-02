import { useState } from 'react';

import { toast } from '@/lib/sonner';
import { VALIDATION_CHARS } from '@/lib/ui';

type UseDesignSystemDemoState = {
  email: string;
  setEmail: (value: string) => void;
  isLoading: boolean;
  inputError: string | undefined;
  handleSubmit: () => void;
  handleToast: () => void;
};

export const useDesignSystemDemo = (): UseDesignSystemDemoState => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState<string | undefined>();

  const handleSubmit = () => {
    if (!email.includes(VALIDATION_CHARS.atSign)) {
      setInputError('Please enter a valid email address');
      toast.error('Validation failed', {
        description: 'Please enter a valid email address',
      });
      return;
    }

    setInputError(undefined);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success('Welcome to SYNA', {
        description: 'Your design system is ready to use.',
      });
    }, 1200);
  };

  const handleToast = () => {
    toast('Toast from the top', { description: 'Swipe up to dismiss' });
  };

  return { email, setEmail, isLoading, inputError, handleSubmit, handleToast };
};
