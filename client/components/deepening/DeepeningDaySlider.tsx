import { useCallback, useState } from 'react';
import { type LayoutChangeEvent, type GestureResponderEvent, Pressable, View } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { semanticColors } from '@/lib/ui';

export type DeepeningDaySliderProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  valueLabel: string;
};

export const DeepeningDaySlider = ({
  value,
  min = 0,
  max = 31,
  onChange,
  valueLabel,
}: DeepeningDaySliderProps) => {
  const [trackWidth, setTrackWidth] = useState(0);

  const updateFromLocationX = useCallback(
    (locationX: number) => {
      if (trackWidth <= 0) {
        return;
      }

      const ratio = Math.min(1, Math.max(0, locationX / trackWidth));
      const next = Math.round(min + ratio * (max - min));
      onChange(Math.min(max, Math.max(min, next)));
    },
    [max, min, onChange, trackWidth],
  );

  const handleResponder = useCallback(
    (event: GestureResponderEvent) => {
      updateFromLocationX(event.nativeEvent.locationX);
    },
    [updateFromLocationX],
  );

  const ratio = max === min ? 0 : (value - min) / (max - min);

  return (
    <Box direction="row" align="center" gap="md">
      <Pressable
        className="flex-1"
        onLayout={(event: LayoutChangeEvent) => {
          setTrackWidth(event.nativeEvent.layout.width);
        }}
        onPress={handleResponder}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleResponder}
        onResponderMove={handleResponder}>
        <View style={{ height: 28, justifyContent: 'center' }}>
          <View
            style={{
              height: 4,
              borderRadius: 2,
              backgroundColor: semanticColors.muted,
            }}>
            <View
              style={{
                width: `${ratio * 100}%`,
                height: 4,
                borderRadius: 2,
                backgroundColor: semanticColors.splashBackground,
              }}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              left: Math.max(0, ratio * Math.max(trackWidth, 1) - 10),
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: semanticColors.splashBackground,
            }}
          />
        </View>
      </Pressable>
      <Text size="sm" weight="medium" className="min-w-16 text-right">
        {valueLabel}
      </Text>
    </Box>
  );
};
