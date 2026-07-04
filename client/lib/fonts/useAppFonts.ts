import {
  Montserrat_400Regular as montserrat400Regular,
  Montserrat_500Medium as montserrat500Medium,
  Montserrat_600SemiBold as montserrat600SemiBold,
  Montserrat_700Bold as montserrat700Bold,
} from '@expo-google-fonts/montserrat';
import { useFonts } from 'expo-font';

import { FONT_FAMILY } from '@/lib/fonts/constants';

export const useAppFonts = () =>
  useFonts({
    [FONT_FAMILY.regular]: montserrat400Regular,
    [FONT_FAMILY.medium]: montserrat500Medium,
    [FONT_FAMILY.semibold]: montserrat600SemiBold,
    [FONT_FAMILY.bold]: montserrat700Bold,
  });
