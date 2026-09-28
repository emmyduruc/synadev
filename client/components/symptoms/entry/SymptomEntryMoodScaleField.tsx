import { useCallback, useState } from 'react';
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  View,
} from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { MOOD_SCALE_MAX } from '@/lib/mood/moodLogStorage';
import { semanticColors } from '@/lib/ui';

export type SymptomEntryMoodScaleFieldProps = {
  label: string;
  valueLabel: string;
  lowLabel: string;
  highLabel: string;
  value: number;
  onChange: (value: number) => void;
};

const TRACK_HEIGHT = 6;
const THUMB_SIZE = 22;
const HIT_AREA_HEIGHT = 32;
const MIN = 1;
const MAX = MOOD_SCALE_MAX;

export const SymptomEntryMoodScaleField = ({
  label,
  valueLabel,
  lowLabel,
  highLabel,
  value,
  onChange,
}: SymptomEntryMoodScaleFieldProps) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const clamped = Math.min(MAX, Math.max(MIN, value || MIN));

  const updateFromLocationX = useCallback(
    (locationX: number) => {
      if (trackWidth <= 0) {
        return;
      }

      const ratio = Math.min(1, Math.max(0, locationX / trackWidth));
      onChange(Math.round(MIN + ratio * (MAX - MIN)));
    },
    [onChange, trackWidth],
  );

  const handleResponder = useCallback(
    (event: GestureResponderEvent) => {
      updateFromLocationX(event.nativeEvent.locationX);
    },
    [updateFromLocationX],
  );

  const ratio = (clamped - MIN) / (MAX - MIN);
  const thumbLeft = Math.max(
    0,
    Math.min(trackWidth - THUMB_SIZE, ratio * Math.max(trackWidth, 1) - THUMB_SIZE / 2),
  );

  return (
    <Box gap="sm">
      <Box direction="row" align="center" justify="between">
        <Text size="sm" weight="bold">
          {label}
        </Text>
        <Text size="sm" color="foreground-muted">
          {valueLabel}
        </Text>
      </Box>

      <View
        accessibilityRole="adjustable"
        accessibilityValue={{ min: MIN, max: MAX, now: clamped, text: valueLabel }}
        onLayout={(event: LayoutChangeEvent) => {
          setTrackWidth(event.nativeEvent.layout.width);
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onStartShouldSetResponderCapture={() => true}
        onMoveShouldSetResponderCapture={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={handleResponder}
        onResponderMove={handleResponder}
        className="w-full py-2">
        <View pointerEvents="none" style={{ height: HIT_AREA_HEIGHT, justifyContent: 'center' }}>
          <View
            style={{
              height: TRACK_HEIGHT,
              borderRadius: TRACK_HEIGHT / 2,
              backgroundColor: semanticColors.border,
            }}>
            <View
              style={{
                width: `${ratio * 100}%`,
                height: TRACK_HEIGHT,
                borderRadius: TRACK_HEIGHT / 2,
                backgroundColor: semanticColors.splashBackground,
              }}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              left: thumbLeft,
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              backgroundColor: semanticColors.splashBackground,
            }}
          />
        </View>
      </View>

      <Box direction="row" justify="between">
        <Text size="xs" color="foreground-muted" responsive={false}>
          {lowLabel}
        </Text>
        <Text size="xs" color="foreground-muted" responsive={false}>
          {highLabel}
        </Text>
      </Box>
    </Box>
  );
};
