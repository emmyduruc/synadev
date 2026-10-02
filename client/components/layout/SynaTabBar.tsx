import { useRouter } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import {
  TAB_BAR,
  TAB_BAR_VISIBLE_ROUTES,
  TAB_ROUTE,
  type TabBarVisibleRoute,
  type TabRouteName,
} from '@/lib/navigation/constants';
import type { SynaTabBarProps } from '@/lib/navigation/types';
import { ROUTES } from '@/lib/routes';
import { semanticColors } from '@/lib/ui';

const TAB_BAR_DISPLAY = {
  none: 'none',
} as const;

type TabIconName = SymbolViewProps['name'];

const TAB_ICON: Record<TabBarVisibleRoute, TabIconName> = {
  [TAB_ROUTE.start]: {
    ios: 'house',
    android: 'home',
    web: 'home',
  },
  [TAB_ROUTE.capture]: {
    ios: 'plus',
    android: 'add',
    web: 'add',
  },
  [TAB_ROUTE.course]: {
    ios: 'chart.bar',
    android: 'bar_chart',
    web: 'bar_chart',
  },
  [TAB_ROUTE.report]: {
    ios: 'doc.text',
    android: 'description',
    web: 'description',
  },
};

const TAB_LABEL_KEY: Record<TabBarVisibleRoute, string> = {
  [TAB_ROUTE.start]: 'tab_today_label',
  [TAB_ROUTE.capture]: 'tab_capture_label',
  [TAB_ROUTE.course]: 'tab_course_label',
  [TAB_ROUTE.report]: 'tab_report_label',
};

export const SynaTabBar = ({ state, descriptors, navigation }: SynaTabBarProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslate();
  const focusedOptions = descriptors[state.routes[state.index]?.key]?.options;
  const tabBarStyle = focusedOptions?.tabBarStyle as
    | { display?: string }
    | undefined;

  if (tabBarStyle?.display === TAB_BAR_DISPLAY.none) {
    return null;
  }

  const focusedRouteName = state.routes[state.index]?.name;
  const mutedColor = semanticColors.ovum.slateLight;
  const activeColor = semanticColors.foreground;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, TAB_BAR.minBottomPadding) },
      ]}>
      {TAB_BAR_VISIBLE_ROUTES.map((tabRoute) => {
        const label = t(TAB_LABEL_KEY[tabRoute]);
        const isCapture = tabRoute === TAB_ROUTE.capture;
        const isFocused = !isCapture && focusedRouteName === tabRoute;
        const color = isFocused ? activeColor : mutedColor;

        const onPress = () => {
          if (isCapture) {
            router.push(ROUTES.symptoms);
            return;
          }

          const route = state.routes.find((item) => item.name === tabRoute);

          if (!route) {
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name as TabRouteName);
          }
        };

        return (
          <TouchableOpacity
            key={tabRoute}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={label}
            onPress={onPress}
            style={styles.tab}>
            <View style={styles.iconWrap}>
              <SymbolView name={TAB_ICON[tabRoute]} size={22} tintColor={color} />
            </View>
            <Text size="2xs" weight="medium" style={{ color }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: semanticColors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 8,
    shadowColor: semanticColors.foreground,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    minHeight: 52,
  },
  iconWrap: {
    position: 'relative',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
