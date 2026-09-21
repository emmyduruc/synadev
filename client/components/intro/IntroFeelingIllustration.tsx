import { Circle, Path, Svg } from 'react-native-svg';

import { IntroIllustrationPanel } from '@/components/intro/IntroIllustrationPanel';
import { Box } from '@/components/ui/Box';
import { semanticColors } from '@/lib/ui';

const ink = semanticColors.ovum.slate;
const accent = semanticColors.report.bleeding;

/**
 * Marketing illustration for intro step 1: profile card + checklist card.
 * Document icon on the left, heart on the right.
 */
export const IntroFeelingIllustration = () => (
  <IntroIllustrationPanel>
    <Box direction="row" align="stretch" justify="center" className="w-full max-w-sm gap-3">
      <Box className="w-[36%] justify-center rounded-2xl bg-card px-3 py-8 shadow-sm">
        <Box align="center" className="mb-5">
          <Svg width={44} height={44} viewBox="0 0 40 40">
            <Circle cx="20" cy="20" r="20" fill={semanticColors.report.dataBackground} />
            <Circle cx="20" cy="15" r="5" fill={ink} />
            <Path d="M10 31c0-5.5 4.5-10 10-10s10 4.5 10 10" fill={ink} />
          </Svg>
        </Box>
        <Box className="mb-3 h-1.5 w-full rounded-full" style={{ backgroundColor: accent }} />
        <Box className="h-1.5 w-3/4 rounded-full" style={{ backgroundColor: accent }} />
      </Box>

      <Box className="w-[54%] justify-center rounded-2xl bg-card px-4 py-8 shadow-sm">
        <Box direction="row" align="center" justify="between" className="mb-6">
          <Svg width={24} height={28} viewBox="0 0 22 26">
            <Path
              d="M4 2h10l6 6v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
              stroke={ink}
              strokeWidth={2}
              fill="none"
            />
            <Path d="M14 2v6h6" stroke={ink} strokeWidth={2} fill="none" />
          </Svg>
          <Svg width={24} height={22} viewBox="0 0 22 20">
            <Path
              d="M11 18s-8-5.2-8-10a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 19 8c0 4.8-8 10-8 10z"
              fill={accent}
            />
          </Svg>
        </Box>

        <Box className="gap-5">
          {[0, 1, 2].map((index) => (
            <Box key={index} direction="row" align="center" className="h-5 gap-3">
              <Svg width={16} height={16} viewBox="0 0 16 16">
                <Circle cx="8" cy="8" r="8" fill={accent} />
                <Path
                  d="M4.5 8.2l2.2 2.2 4.8-4.8"
                  stroke={semanticColors.card}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Svg>
              <Box className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: accent }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  </IntroIllustrationPanel>
);
