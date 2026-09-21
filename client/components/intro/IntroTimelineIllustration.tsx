import { Circle, Line, Svg } from 'react-native-svg';

import { IntroIllustrationPanel } from '@/components/intro/IntroIllustrationPanel';
import { Box, Text } from '@/components/ui';
import { useTranslate } from '@/hooks/useTranslate';
import { semanticColors } from '@/lib/ui';

const NODE_COUNT = 6;
const TRACK_WIDTH = 200;
const TRACK_HEIGHT = 20;
const NODE_RADIUS = 5;
const LINE_Y = TRACK_HEIGHT / 2;

type TimelineRow = {
  labelKey: string;
  filledIndexes: readonly number[];
};

const TIMELINE_ROWS: readonly TimelineRow[] = [
  { labelKey: 'intro_timeline_symptoms_label', filledIndexes: [0, 3] },
  { labelKey: 'intro_timeline_mood_label', filledIndexes: [2, 5] },
  { labelKey: 'intro_timeline_period_label', filledIndexes: [1, 4] },
] as const;

const accent = semanticColors.report.bleeding;
const emptyStroke = semanticColors.ovum.slateLight;
const trackLine = semanticColors.ovum.slateLight;

/**
 * Marketing illustration for intro step 2: symptom / mood / period day tracks.
 */
export const IntroTimelineIllustration = () => {
  const { t } = useTranslate();

  return (
    <IntroIllustrationPanel>
      <Box className="w-full max-w-sm rounded-2xl bg-card px-4 py-5 shadow-sm">
        <Box className="gap-4">
          {TIMELINE_ROWS.map((row) => (
            <Box key={row.labelKey} direction="row" align="center" className="gap-3">
              <Text size="2xs" weight="medium" color="foreground" className="w-16" numberOfLines={1}>
                {t(row.labelKey)}
              </Text>
              <Box className="flex-1 items-center">
                <Svg width={TRACK_WIDTH} height={TRACK_HEIGHT} viewBox={`0 0 ${TRACK_WIDTH} ${TRACK_HEIGHT}`}>
                  <Line
                    x1={NODE_RADIUS}
                    y1={LINE_Y}
                    x2={TRACK_WIDTH - NODE_RADIUS}
                    y2={LINE_Y}
                    stroke={trackLine}
                    strokeWidth={1.5}
                  />
                  {Array.from({ length: NODE_COUNT }, (_, index) => {
                    const isFilled = row.filledIndexes.includes(index);
                    const cx =
                      NODE_RADIUS
                      + (index * (TRACK_WIDTH - NODE_RADIUS * 2)) / (NODE_COUNT - 1);

                    return (
                      <Circle
                        key={index}
                        cx={cx}
                        cy={LINE_Y}
                        r={NODE_RADIUS}
                        fill={isFilled ? accent : semanticColors.card}
                        stroke={isFilled ? accent : emptyStroke}
                        strokeWidth={1.5}
                      />
                    );
                  })}
                </Svg>
              </Box>
            </Box>
          ))}
        </Box>

        <Text size="xs" color="foreground" align="center" className="mt-4">
          {t('intro_timeline_days_label')}
        </Text>
      </Box>
    </IntroIllustrationPanel>
  );
};
