import type { SymptomCategoryId, SymptomId } from '@syna/shared-types';
import type { ReactElement } from 'react';

import { BatteryLowIcon } from '@/components/ui/icons/BatteryLowIcon';
import { BrainIcon } from '@/components/ui/icons/BrainIcon';
import { ChillsIcon } from '@/components/ui/icons/ChillsIcon';
import { CloudIcon } from '@/components/ui/icons/CloudIcon';
import { DropletIcon } from '@/components/ui/icons/DropletIcon';
import { FlameIcon } from '@/components/ui/icons/FlameIcon';
import { HeartIcon } from '@/components/ui/icons/HeartIcon';
import { HorizontalWavesIcon } from '@/components/ui/icons/HorizontalWavesIcon';
import { JointStiffnessIcon } from '@/components/ui/icons/JointStiffnessIcon';
import { MoodWavesIcon } from '@/components/ui/icons/MoodWavesIcon';
import { MoonIcon } from '@/components/ui/icons/MoonIcon';
import { SparkleIcon } from '@/components/ui/icons/SparkleIcon';
import { SparkOutlineIcon } from '@/components/ui/icons/SparkOutlineIcon';
import { SYMPTOM_CATEGORIES } from '@/lib/symptoms/symptomCatalog';
import { semanticColors } from '@/lib/ui';

const ICON_SIZE = 22;
const ICON_COLOR = semanticColors.splashBackground;

const categoryIcon = (categoryId: SymptomCategoryId): ReactElement => {
  switch (categoryId) {
    case 'vasomotor':
      return <FlameIcon size={ICON_SIZE} color={ICON_COLOR} />;
    case 'mood':
      return <MoodWavesIcon size={ICON_SIZE} color={ICON_COLOR} />;
    case 'sleep_energy':
      return <MoonIcon size={ICON_SIZE} color={ICON_COLOR} />;
    case 'body_pain':
      return <HeartIcon size={ICON_SIZE} color={ICON_COLOR} />;
    case 'cycle':
    case 'urogenital':
      return <DropletIcon size={ICON_SIZE} color={ICON_COLOR} />;
    case 'skin':
      return <SparkleIcon size={ICON_SIZE} color={ICON_COLOR} />;
    case 'cognition':
      return <BrainIcon size={ICON_SIZE} color={ICON_COLOR} />;
    default:
      return <DropletIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }
};

export const getSymptomEntryIcon = (symptomId: SymptomId): ReactElement => {
  if (symptomId === 'hot_flashes') {
    return <FlameIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (symptomId === 'chills') {
    return <ChillsIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (symptomId === 'night_sweats' || symptomId === 'sweating') {
    return <DropletIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (
    symptomId === 'joint_stiffness'
    || symptomId === 'joint_muscle_pain'
    || symptomId === 'muscle_pain'
  ) {
    return <JointStiffnessIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (symptomId === 'headache' || symptomId === 'tingling') {
    return <SparkOutlineIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (
    symptomId === 'dizziness'
    || symptomId === 'bloating'
    || symptomId === 'digestive_patterns'
  ) {
    return <HorizontalWavesIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (symptomId === 'insomnia' || symptomId === 'sleep_maintenance') {
    return <MoonIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (symptomId === 'fatigue' || symptomId === 'sleepy') {
    return <BatteryLowIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (symptomId === 'irritable') {
    return <SparkOutlineIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (symptomId === 'low_mood') {
    return <CloudIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (
    symptomId === 'brain_fog'
    || symptomId === 'concentration_problems'
    || symptomId === 'word_finding'
    || symptomId === 'forgetfulness'
  ) {
    return <BrainIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (
    symptomId === 'mood_swings'
    || symptomId === 'anxious'
    || symptomId === 'inner_restlessness'
    || symptomId === 'calm'
  ) {
    return <MoodWavesIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (symptomId === 'breast_tenderness' || symptomId === 'palpitations') {
    return <HeartIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (symptomId === 'dryness') {
    return <SparkOutlineIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (symptomId === 'low_libido') {
    return <HeartIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (
    symptomId === 'nocturia'
    || symptomId === 'bladder_urgency'
    || symptomId === 'pain_on_urination'
  ) {
    return <DropletIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (symptomId === 'bleeding' || symptomId === 'spotting') {
    return <DropletIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (symptomId === 'cramps') {
    return <JointStiffnessIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (symptomId === 'skin_and_hair') {
    return <SparkleIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  if (
    symptomId === 'dry_skin'
    || symptomId === 'itchy_skin'
    || symptomId === 'hair_loss'
  ) {
    return <SparkOutlineIcon size={ICON_SIZE} color={ICON_COLOR} />;
  }

  const category = SYMPTOM_CATEGORIES.find((item) =>
    item.options.some((option) => option.id === symptomId),
  );

  if (category) {
    return categoryIcon(category.id);
  }

  return <DropletIcon size={ICON_SIZE} color={ICON_COLOR} />;
};
