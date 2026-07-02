import { useAuth } from '@clerk/expo';
import { Redirect } from 'expo-router';

import { ROUTES } from '@/lib/routes';

const IndexScreen = () => {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href={ROUTES.home} />;
  }

  return <Redirect href={ROUTES.register} />;
};

export default IndexScreen;
