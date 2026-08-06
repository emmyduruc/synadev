import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';

export type ProfileTabPlaceholderProps = {
  message: string;
};

export const ProfileTabPlaceholder = ({ message }: ProfileTabPlaceholderProps) => (
  <Box flex={1} align="center" justify="center" padding="lg" className="w-full">
    <Text size="lg" weight="semibold" align="center" color="foreground">
      {message}
    </Text>
  </Box>
);
