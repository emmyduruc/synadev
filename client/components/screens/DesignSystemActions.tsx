import { SymbolView } from 'expo-symbols';

import { Box, Button } from '@/components/ui';
import { semanticColors } from '@/lib/ui';

type DesignSystemActionsProps = {
  isLoading: boolean;
  onSubmit: () => void;
  onToast: () => void;
};

export const DesignSystemActions = ({
  isLoading,
  onSubmit,
  onToast,
}: DesignSystemActionsProps) => (
  <>
    <Box direction="row" gap="sm">
      <Button
        variant="primary"
        loading={isLoading}
        fullWidth
        leftIcon={
          <SymbolView
            name={{ ios: 'paperplane.fill', android: 'send', web: 'send' }}
            size={16}
            tintColor={semanticColors.iconOnPrimary}
          />
        }
        onPress={onSubmit}>
        Submit
      </Button>
      <Button variant="outline" onPress={onToast}>
        Toast
      </Button>
    </Box>

    <Box direction="row" gap="sm" className="flex-wrap">
      <Button size="sm" variant="secondary">
        Secondary
      </Button>
      <Button size="sm" variant="ghost">
        Ghost
      </Button>
      <Button size="sm" variant="danger">
        Danger
      </Button>
    </Box>
  </>
);
