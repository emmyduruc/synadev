import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';

export type ProfileTabPlaceholderProps = {
  message: string;
};

export const ProfileTabPlaceholder = ({ message }: ProfileTabPlaceholderProps) => (
  <Box align="center" justify="center" padding="lg" className="min-h-48">
    <Text size="lg" weight="semibold" align="center" color="foreground-muted">
      {message}
    </Text>
  </Box>
);
