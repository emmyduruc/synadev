import { SYMPTOM_INTENSITY_VALUES, type SymptomIntensity } from '@syna/shared-types';
import { useCallback, useState } from 'react';
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  Pressable,
  View,
} from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { useTranslate } from '@/hooks/useTranslate';
import { SYMPTOM_INTENSITY_LABEL_KEYS } from '@/lib/symptoms/symptomEntryConstants';
import { semanticColors } from '@/lib/ui';

export type SymptomIntensityRangeProps = {
  value: SymptomIntensity;
  onChange: (value: SymptomIntensity) => void;
};

const TRACK_HEIGHT = 6;
const THUMB_SIZE = 22;
const MIN = 0;
const MAX = 4;

export const SymptomIntensityRange = ({ value, onChange }: SymptomIntensityRangeProps) => {
  const { t } = useTranslate();
  const [trackWidth, setTrackWidth] = useState(0);

  const updateFromLocationX = useCallback(
    (locationX: number) => {
      if (trackWidth <= 0) {
        return;
      }

      const ratio = Math.min(1, Math.max(0, locationX / trackWidth));
      const next = Math.round(MIN + ratio * (MAX - MIN)) as SymptomIntensity;
      onChange(next);
    },
    [onChange, trackWidth],
  );

  const handleResponder = useCallback(
    (event: GestureResponderEvent) => {
      updateFromLocationX(event.nativeEvent.locationX);
    },
    [updateFromLocationX],
  );

  const ratio = (value - MIN) / (MAX - MIN);
  const thumbLeft = Math.max(
    0,
    Math.min(trackWidth - THUMB_SIZE, ratio * Math.max(trackWidth, 1) - THUMB_SIZE / 2),
  );

  const legend = SYMPTOM_INTENSITY_VALUES.map(
    (intensityValue) => `${intensityValue} ${t(SYMPTOM_INTENSITY_LABEL_KEYS[intensityValue])}`,
  ).join(' · ');

  return (
    <Box gap="sm">
      <Box direction="row" align="center" justify="between">
        <Text size="sm" weight="semibold">
          {t('symptom_intensity_label')}
        </Text>
        <Text size="sm" color="foreground-muted">
          {t(SYMPTOM_INTENSITY_LABEL_KEYS[value])}
        </Text>
      </Box>

      <Pressable
        accessibilityRole="adjustable"
        accessibilityValue={{
          min: MIN,
          max: MAX,
          now: value,
          text: t(SYMPTOM_INTENSITY_LABEL_KEYS[value]),
        }}
        onLayout={(event: LayoutChangeEvent) => {
          setTrackWidth(event.nativeEvent.layout.width);
        }}
        onPress={handleResponder}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleResponder}
        onResponderMove={handleResponder}
        className="w-full py-2">
        <View style={{ height: 32, justifyContent: 'center' }}>
          <View
            style={{
              height: TRACK_HEIGHT,
              borderRadius: TRACK_HEIGHT / 2,
              backgroundColor: semanticColors.muted,
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
      </Pressable>

      <Box direction="row" justify="between" className="px-0.5">
        {SYMPTOM_INTENSITY_VALUES.map((intensityValue) => (
          <Text key={intensityValue} size="xs" color="foreground-muted" responsive={false}>
            {intensityValue}
          </Text>
        ))}
      </Box>

      <Text size="2xs" color="foreground-muted" className="leading-relaxed">
        {legend}
      </Text>
    </Box>
  );
};
