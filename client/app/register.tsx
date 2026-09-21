import { useCallback, useState } from 'react';

import { RegisterForm } from '@/components/auth/RegisterForm';
import { RegisterVerificationStep } from '@/components/auth/RegisterVerificationStep';

const RegisterScreen = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const handleVerificationRequired = useCallback((email: string) => {
    setVerificationEmail(email);
    setIsVerifying(true);
  }, []);

  if (isVerifying) {
    return <RegisterVerificationStep identifier={verificationEmail} />;
  }

  return <RegisterForm onVerificationRequired={handleVerificationRequired} />;
};

export default RegisterScreen;
