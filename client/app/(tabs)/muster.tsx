import { TabScreenLayout } from '@/components/layout/TabScreenLayout';
import { useTranslate } from '@/hooks/useTranslate';

const MusterTabScreen = () => {
  const { t } = useTranslate();

  return (
    <TabScreenLayout
      title={t('tab_muster_title')}
      body={t('tab_muster_placeholder')}
    />
  );
};

export default MusterTabScreen;
