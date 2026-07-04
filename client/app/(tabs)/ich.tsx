import { TabScreenLayout } from '@/components/layout/TabScreenLayout';
import { useTranslate } from '@/hooks/useTranslate';

const IchTabScreen = () => {
  const { t } = useTranslate();

  return (
    <TabScreenLayout
      title={t('tab_ich_title')}
      body={t('tab_ich_placeholder')}
    />
  );
};

export default IchTabScreen;
