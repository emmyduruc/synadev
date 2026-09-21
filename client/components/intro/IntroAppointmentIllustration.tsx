import { Circle, Path, Svg } from 'react-native-svg';

import { IntroIllustrationPanel } from '@/components/intro/IntroIllustrationPanel';
import { Box } from '@/components/ui/Box';
import { semanticColors } from '@/lib/ui';

const accent = semanticColors.report.bleeding;

/**
 * Marketing illustration for intro step 3: person card + document/heart card.
 */
export const IntroAppointmentIllustration = () => (
  <IntroIllustrationPanel>
    <Box direction="row" align="stretch" justify="center" className="w-full max-w-sm gap-3">
      <Box className="w-[36%] justify-center rounded-2xl bg-card px-3 py-8 shadow-sm">
        <Box align="center" className="mb-5">
          <Svg width={44} height={44} viewBox="0 0 40 40">
            <Circle cx="20" cy="20" r="20" fill={semanticColors.report.dataBackground} />
            <Circle cx="20" cy="15" r="5" fill={accent} />
            <Path d="M10 31c0-5.5 4.5-10 10-10s10 4.5 10 10" fill={accent} />
          </Svg>
        </Box>
        <Box className="h-1.5 w-full rounded-full" style={{ backgroundColor: accent }} />
      </Box>

      <Box className="w-[54%] justify-center rounded-2xl bg-card px-4 py-8 shadow-sm">
        <Box direction="row" align="center" justify="between" className="mb-6">
          <Svg width={24} height={28} viewBox="0 0 22 26">
            <Path
              d="M4 2h10l6 6v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
              stroke={accent}
              strokeWidth={2}
              fill="none"
            />
            <Path d="M14 2v6h6" stroke={accent} strokeWidth={2} fill="none" />
          </Svg>
          <Svg width={28} height={28} viewBox="0 0 28 28">
            <Circle cx="14" cy="14" r="13" stroke={accent} strokeWidth={1.5} fill="none" />
            <Path
              d="M14 20s-5.5-3.5-5.5-7a3.2 3.2 0 0 1 5.5-2.1A3.2 3.2 0 0 1 19.5 13c0 3.5-5.5 7-5.5 7z"
              fill={accent}
            />
          </Svg>
        </Box>

        <Box className="gap-3">
          <Box className="h-1.5 w-full rounded-full" style={{ backgroundColor: accent }} />
          <Box className="h-1.5 w-4/5 rounded-full" style={{ backgroundColor: accent }} />
          <Box className="h-1.5 w-3/5 rounded-full" style={{ backgroundColor: accent }} />
        </Box>
      </Box>
    </Box>
  </IntroIllustrationPanel>
);
