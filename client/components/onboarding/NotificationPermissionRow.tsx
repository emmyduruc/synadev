import { Box, Text } from '@/components/ui';

export type NotificationPermissionRowProps = {
  title: string;
  description: string;
  showDivider?: boolean;
};

export const NotificationPermissionRow = ({
  title,
  description,
  showDivider = true,
}: NotificationPermissionRowProps) => (
  <Box className={showDivider ? 'border-b border-border py-3.5' : 'py-3.5'}>
    <Text size="base" weight="semibold" color="foreground">
      {title}
    </Text>
    <Text size="sm" color="foreground-muted" className="mt-1 leading-relaxed">
      {description}
    </Text>
  </Box>
);
