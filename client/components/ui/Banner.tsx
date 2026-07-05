import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import {
  bannerSizeClasses,
  bannerTextClasses,
  bannerTitleSizeClasses,
  bannerVariantClasses,
  cn,
  radiusClasses,
  semanticColors,
} from '@/lib/ui';
import type { BannerSize, BannerVariant } from '@/lib/ui';

export type BannerProps = {
  title?: string;
  description?: string;
  variant?: BannerVariant;
  size?: BannerSize;
  icon?: ReactNode;
  dismissable?: boolean;
  onDismiss?: () => void;
  className?: string;
  children?: ReactNode;
};

const defaultIcons: Record<BannerVariant, ReactNode> = {
  info: (
    <SymbolView
      name={{ ios: 'info.circle.fill', android: 'info', web: 'info' }}
      size={18}
      tintColor={semanticColors.bannerIcon.info}
    />
  ),
  success: (
    <SymbolView
      name={{ ios: 'checkmark.circle.fill', android: 'check', web: 'check' }}
      size={18}
      tintColor={semanticColors.bannerIcon.success}
    />
  ),
  warning: (
    <SymbolView
      name={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}
      size={18}
      tintColor={semanticColors.bannerIcon.warning}
    />
  ),
  error: (
    <SymbolView
      name={{ ios: 'xmark.circle.fill', android: 'close', web: 'close' }}
      size={18}
      tintColor={semanticColors.bannerIcon.error}
    />
  ),
};

export const Banner = ({
  title,
  description,
  variant = 'info',
  size = 'md',
  icon,
  dismissable = true,
  onDismiss,
  className,
  children,
}: BannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const hasCustomContent = Boolean(children);

  if (!isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (hasCustomContent) {
    return (
      <Box className={cn('relative w-full', className)}>
        {children}
        {dismissable ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Dismiss banner"
            onPress={handleDismiss}
            className="absolute right-3 top-3 z-10 p-1">
            <SymbolView
              name={{ ios: 'xmark', android: 'close', web: 'close' }}
              size={14}
              tintColor={semanticColors.iconDismiss}
            />
          </TouchableOpacity>
        ) : null}
      </Box>
    );
  }

  return (
    <Box
      direction="row"
      align="start"
      className={cn(
        'w-full border',
        radiusClasses.lg,
        bannerVariantClasses[variant],
        bannerSizeClasses[size],
        className,
      )}>
      <Box className="mr-3 pt-0.5">{icon ?? defaultIcons[variant]}</Box>

      <Box flex={1}>
        <Text
          weight="semibold"
          className={cn(bannerTextClasses[variant], bannerTitleSizeClasses[size])}>
          {title}
        </Text>
        {description ? (
          <Text
            size="sm"
            className={cn(bannerTextClasses[variant], 'mt-1 opacity-90')}>
            {description}
          </Text>
        ) : null}
      </Box>

      {dismissable ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Dismiss banner"
          onPress={handleDismiss}
          className="ml-2 p-1">
          <SymbolView
            name={{ ios: 'xmark', android: 'close', web: 'close' }}
            size={14}
            tintColor={semanticColors.iconDismiss}
          />
        </TouchableOpacity>
      ) : null}
    </Box>
  );
};
