import { Image } from 'react-native';

import { Box } from '@/components/ui/Box';
import { VerifiedBadgeIcon } from '@/components/ui/icons/VerifiedBadgeIcon';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/ui';

export const AVATAR_SIZE = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

export type AvatarSize = (typeof AVATAR_SIZE)[keyof typeof AVATAR_SIZE];

export const AVATAR_VARIANT = {
  neutral: 'neutral',
  lavender: 'lavender',
  rose: 'rose',
  sage: 'sage',
  apricot: 'apricot',
} as const;

export type AvatarVariant = (typeof AVATAR_VARIANT)[keyof typeof AVATAR_VARIANT];

export const AVATAR_BADGE = {
  none: 'none',
  verified: 'verified',
} as const;

export type AvatarBadge = (typeof AVATAR_BADGE)[keyof typeof AVATAR_BADGE];

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

const textSizeClasses: Record<AvatarSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const variantClasses: Record<AvatarVariant, string> = {
  neutral: 'bg-card border-border',
  lavender: 'bg-lavender-light border-lavender',
  rose: 'bg-dusty-rose-light border-dusty-rose',
  sage: 'bg-sage-mist-light border-sage-mist',
  apricot: 'bg-apricot-light border-apricot',
};

const badgeSizeByAvatar: Record<AvatarSize, number> = {
  sm: 14,
  md: 16,
  lg: 20,
};

export type AvatarProps = {
  initials: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  badge?: AvatarBadge;
  imageUri?: string;
  accessibilityLabel?: string;
  className?: string;
};

export const Avatar = ({
  initials,
  size = AVATAR_SIZE.md,
  variant = AVATAR_VARIANT.neutral,
  badge = AVATAR_BADGE.none,
  imageUri,
  accessibilityLabel,
  className,
}: AvatarProps) => {
  const trimmedInitials = initials.trim().slice(0, 2).toUpperCase();

  return (
    <Box className={cn('relative', className)}>
      <Box
        align="center"
        justify="center"
        accessibilityLabel={accessibilityLabel}
        className={cn(
          'overflow-hidden rounded-full border',
          sizeClasses[size],
          variantClasses[variant],
        )}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
        ) : (
          <Text
            weight="semibold"
            responsive={false}
            className={cn('uppercase text-foreground', textSizeClasses[size])}>
            {trimmedInitials}
          </Text>
        )}
      </Box>
      {badge === AVATAR_BADGE.verified ? (
        <Box className="absolute -bottom-0.5 -right-0.5">
          <VerifiedBadgeIcon size={badgeSizeByAvatar[size]} />
        </Box>
      ) : null}
    </Box>
  );
};
