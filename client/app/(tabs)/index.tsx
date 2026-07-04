import { TabScreenLayout } from '@/components/layout/TabScreenLayout';
import { useTranslate } from '@/hooks/useTranslate';

const StartTabScreen = () => {
  const { t } = useTranslate();

  return (
    <TabScreenLayout
      title={t('tab_start_title')}
      body={t('tab_start_placeholder')}
    />
  );
};

export default StartTabScreen;
