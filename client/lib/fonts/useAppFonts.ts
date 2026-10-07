import {
  Figtree_400Regular as figtree400Regular,
  Figtree_500Medium as figtree500Medium,
  Figtree_600SemiBold as figtree600SemiBold,
} from '@expo-google-fonts/figtree';
import {
  Outfit_400Regular as outfit400Regular,
  Outfit_500Medium as outfit500Medium,
  Outfit_600SemiBold as outfit600SemiBold,
} from '@expo-google-fonts/outfit';
import { useFonts } from 'expo-font';

import { FONT_FAMILY } from '@/lib/fonts/constants';

export const useAppFonts = () =>
  useFonts({
    [FONT_FAMILY.sans.regular]: figtree400Regular,
    [FONT_FAMILY.sans.medium]: figtree500Medium,
    [FONT_FAMILY.sans.semibold]: figtree600SemiBold,
    [FONT_FAMILY.serif.regular]: outfit400Regular,
    [FONT_FAMILY.serif.medium]: outfit500Medium,
    [FONT_FAMILY.serif.semibold]: outfit600SemiBold,
  });
