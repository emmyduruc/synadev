import { useAuth } from '@clerk/expo';
import { Redirect, Tabs } from 'expo-router';

import { SynaTabBar } from '@/components/layout/SynaTabBar';
import { useTranslate } from '@/hooks/useTranslate';
import { TAB_ROUTE } from '@/lib/navigation/constants';
import { ROUTES } from '@/lib/routes';

const TabsLayout = () => {
  const { t } = useTranslate();
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={ROUTES.welcome} />;
  }

  return (
    <Tabs
      tabBar={(props) => <SynaTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}>
      <Tabs.Screen
        name={TAB_ROUTE.start}
        options={{ title: t('tab_start_label') }}
      />
      <Tabs.Screen
        name={TAB_ROUTE.muster}
        options={{ title: t('tab_muster_label') }}
      />
      <Tabs.Screen
        name={TAB_ROUTE.syna}
        options={{ title: t('tab_syna_label') }}
      />
      <Tabs.Screen
        name={TAB_ROUTE.bericht}
        options={{ title: t('tab_bericht_label') }}
      />
      <Tabs.Screen
        name={TAB_ROUTE.ich}
        options={{ title: t('tab_ich_label') }}
      />
    </Tabs>
  );
};

export default TabsLayout;
