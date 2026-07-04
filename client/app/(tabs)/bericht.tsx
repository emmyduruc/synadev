import { TabScreenLayout } from '@/components/layout/TabScreenLayout';
import { useTranslate } from '@/hooks/useTranslate';

const BerichtTabScreen = () => {
  const { t } = useTranslate();

  return (
    <TabScreenLayout
      title={t('tab_bericht_title')}
      body={t('tab_bericht_placeholder')}
    />
  );
};

export default BerichtTabScreen;
