import { TabScreenLayout } from '@/components/layout/TabScreenLayout';
import { useTranslate } from '@/hooks/useTranslate';

const PatternsTabScreen = () => {
  const { t } = useTranslate();

  return (
    <TabScreenLayout
      title={t('tab_patterns_title')}
      body={t('tab_patterns_placeholder')}
    />
  );
};

export default PatternsTabScreen;
