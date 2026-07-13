import { useEffect } from 'react';
import { Dimensions } from 'react-native';

import { ConfettiParticle } from './ConfettiParticle';

import { Box } from '@/components/ui/Box';

const PARTICLE_COUNT = 36;
const BURST_DURATION_MS = 2200;

export type ConfettiCelebrationProps = {
  palette: readonly string[];
  onComplete: () => void;
};

export const ConfettiCelebration = ({ palette, onComplete }: ConfettiCelebrationProps) => {
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    const timeout = setTimeout(onComplete, BURST_DURATION_MS + 200);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <Box
      pointerEvents="none"
      className="absolute inset-0 z-50"
      style={{ width, height }}>
      {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
        <ConfettiParticle
          key={`confetti-${index}`}
          index={index}
          palette={palette}
          screenWidth={width}
          screenHeight={height}
        />
      ))}
    </Box>
  );
};
