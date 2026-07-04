import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { TAB_BAR, TAB_ROUTE, type TabRouteName } from '@/lib/navigation/constants';
import type { SynaTabBarProps } from '@/lib/navigation/types';
import { semanticColors } from '@/lib/ui';

type TabIconName = SymbolViewProps['name'];

const TAB_ICON: Record<TabRouteName, TabIconName> = {
  [TAB_ROUTE.start]: {
    ios: 'house.fill',
    android: 'home',
    web: 'home',
  },
  [TAB_ROUTE.muster]: {
    ios: 'square.stack.3d.up.fill',
    android: 'layers',
    web: 'layers',
  },
  [TAB_ROUTE.syna]: {
    ios: 'sparkles',
    android: 'auto_awesome',
    web: 'auto_awesome',
  },
  [TAB_ROUTE.bericht]: {
    ios: 'doc.text.fill',
    android: 'description',
    web: 'description',
  },
  [TAB_ROUTE.ich]: {
    ios: 'person.fill',
    android: 'person',
    web: 'person',
  },
};

const TAB_LABEL_KEY: Record<TabRouteName, string> = {
  [TAB_ROUTE.start]: 'tab_start_label',
  [TAB_ROUTE.muster]: 'tab_muster_label',
  [TAB_ROUTE.syna]: 'tab_syna_label',
  [TAB_ROUTE.bericht]: 'tab_bericht_label',
  [TAB_ROUTE.ich]: 'tab_ich_label',
};

const isTabRouteName = (routeName: string): routeName is TabRouteName =>
  Object.values(TAB_ROUTE).includes(routeName as TabRouteName);

const resolveTabColors = (isFocused: boolean, isCenter: boolean) => {
  if (isCenter) {
    return {
      icon: semanticColors.iconOnPrimary,
      label: semanticColors.splashBackground,
    };
  }

  if (isFocused) {
    return {
      icon: semanticColors.foreground,
      label: semanticColors.foreground,
    };
  }

  return {
    icon: semanticColors.ovum.slateLight,
    label: semanticColors.ovum.slateLight,
  };
};

export const SynaTabBar = ({ state, navigation }: SynaTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslate();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        if (!isTabRouteName(route.name)) {
          return null;
        }

        const tabRoute = route.name;
        const isFocused = state.index === index;
        const isCenter = tabRoute === TAB_BAR.centerRoute;
        const showBadge = tabRoute === TAB_BAR.badgeRoute;
        const label = t(TAB_LABEL_KEY[tabRoute]);
        const { icon: iconColor, label: labelColor } = resolveTabColors(isFocused, isCenter);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isCenter) {
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={label}
              onPress={onPress}
              style={styles.centerTab}>
              <View style={styles.centerButton}>
                <SymbolView
                  name={TAB_ICON[tabRoute]}
                  size={24}
                  tintColor={iconColor}
                />
              </View>
              <Text size="2xs" weight="semibold" style={{ color: labelColor }}>
                {label}
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={label}
            onPress={onPress}
            style={styles.tab}>
            <View style={styles.iconWrap}>
              <SymbolView
                name={TAB_ICON[tabRoute]}
                size={22}
                tintColor={iconColor}
              />
              {showBadge ? <View style={styles.badge} /> : null}
            </View>
            <Text size="2xs" weight="medium" style={{ color: labelColor }}>
              {label}
            </Text>
          </Pressable>
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
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: semanticColors.splashBackground,
  },
  centerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: -TAB_BAR.centerButtonLift,
    gap: 6,
  },
  centerButton: {
    width: TAB_BAR.centerButtonSize,
    height: TAB_BAR.centerButtonSize,
    borderRadius: TAB_BAR.centerButtonSize / 2,
    backgroundColor: semanticColors.splashBackground,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: semanticColors.splashBackground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
