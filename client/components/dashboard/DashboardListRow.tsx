import { View } from 'react-native';

import { Box } from '@/components/ui/Box';
import { ChevronRightIcon } from '@/components/ui/icons/ChevronRightIcon';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { semanticColors } from '@/lib/ui';

export type DashboardListRowProps = {
  title: string;
  subtitle?: string;
  onPress: () => void;
  showDivider?: boolean;
};

export const DashboardListRow = ({
  title,
  subtitle,
  onPress,
  showDivider = true,
}: DashboardListRowProps) => (
  <Box>
    <TouchableOpacity accessibilityRole="button" onPress={onPress}>
      <Box direction="row" align="center" gap="md" className="py-3.5">
        <Box flex={1} gap="xs">
          <Text size="sm" weight="normal" family="sans" className="leading-snug">
            {title}
          </Text>
          {subtitle ? (
            <Text
              size="xs"
              color="foreground-muted"
              family="sans"
              tabularNums
              className="leading-relaxed">
              {subtitle}
            </Text>
          ) : null}
        </Box>
        <ChevronRightIcon size={16} color={semanticColors.foregroundMuted} />
      </Box>
    </TouchableOpacity>
    {showDivider ? (
      <View
        style={{
          height: 1,
          backgroundColor: semanticColors.report.hairline,
        }}
      />
    ) : null}
  </Box>
);
