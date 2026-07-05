import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import type { ProfileTabId } from '@/lib/profile/constants';
import { semanticColors } from '@/lib/ui';

export type ProfileTabOption = {
  id: ProfileTabId;
  label: string;
};

export type ProfileTabBarProps = {
  tabs: readonly ProfileTabOption[];
  activeTabId: ProfileTabId;
  onTabChange: (tabId: ProfileTabId) => void;
};


export const ProfileTabBar = ({ tabs, activeTabId, onTabChange }: ProfileTabBarProps) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <Box direction="row" gap="sm" style={styles.track}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <Pressable
            key={tab.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onTabChange(tab.id)}
            style={isActive ? [styles.pill, styles.pillActive] : styles.pill}>
            <Text
              size="sm"
              weight={isActive ? 'semibold' : 'medium'}
              color={isActive ? 'foreground' : 'foreground-muted'}
              responsive={false}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </Box>
  </ScrollView>
);

const styles = StyleSheet.create({
  track: {
    borderRadius: 9999,
    backgroundColor: semanticColors.ovum.lavenderLight,
    padding: 6,
  },
  pill: {
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pillActive: {
    backgroundColor: semanticColors.card,
    shadowColor: semanticColors.foreground,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
