import { ProfileCompletionCard } from '@/components/profile/ProfileCompletionCard';
import { ProfileHealthSourcesCard } from '@/components/profile/ProfileHealthSourcesCard';
import { ProfileMissingPatternsCard } from '@/components/profile/ProfileMissingPatternsCard';
import { ProfilePersonalSectionCard } from '@/components/profile/ProfilePersonalSectionCard';
import { Box } from '@/components/ui/Box';
import { useProfileHealthConnection } from '@/hooks/useProfileHealthConnection';

export const ProfileMyProfileContent = () => {
  const {
    summary,
    isConnecting,
    errorMessage,
    isConnected,
    connectHealth,
    modifyPermissions,
  } = useProfileHealthConnection();

  return (
    <Box gap="md">
      <ProfileMissingPatternsCard />
      <ProfileHealthSourcesCard
        isConnected={isConnected}
        connectedMetricKeys={summary?.connectedMetricKeys ?? []}
        isConnecting={isConnecting}
        errorMessage={errorMessage}
        onConnect={connectHealth}
        onModifyPermissions={modifyPermissions}
      />
      <ProfileCompletionCard />
      <ProfilePersonalSectionCard />
    </Box>
  );
};
