import { useCallback, useState } from 'react';

import { LoginForm } from '@/components/auth/LoginForm';
import { LoginVerificationStep } from '@/components/auth/LoginVerificationStep';

const LoginScreen = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const handleVerificationRequired = useCallback((email: string) => {
    setVerificationEmail(email);
    setIsVerifying(true);
  }, []);

  if (isVerifying) {
    return (
      <LoginVerificationStep
        identifier={verificationEmail}
        onStartOver={() => {
          setIsVerifying(false);
          setVerificationEmail('');
        }}
      />
    );
  }

  return <LoginForm onVerificationRequired={handleVerificationRequired} />;
};

export default LoginScreen;
