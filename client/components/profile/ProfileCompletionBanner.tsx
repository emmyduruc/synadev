import { ProfileCompletionCard } from '@/components/profile/ProfileCompletionCard';
import { Banner } from '@/components/ui/Banner';

export type ProfileCompletionBannerProps = {
  percent: number;
  onPress?: () => void;
  onDismiss: () => void;
};

export const ProfileCompletionBanner = ({
  percent,
  onPress,
  onDismiss,
}: ProfileCompletionBannerProps) => (
  <Banner onDismiss={onDismiss}>
    <ProfileCompletionCard percent={percent} onPress={onPress} />
  </Banner>
);
