import { TabScreenLayout } from '@/components/layout/TabScreenLayout';
import { useTranslate } from '@/hooks/useTranslate';

const SynaTabScreen = () => {
  const { t } = useTranslate();

  return (
    <TabScreenLayout
      title={t('tab_syna_title')}
      body={t('tab_syna_placeholder')}
    />
  );
};

export default SynaTabScreen;
