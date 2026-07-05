import { TabScreenLayout } from '@/components/layout/TabScreenLayout';
import { useTranslate } from '@/hooks/useTranslate';

const ReportTabScreen = () => {
  const { t } = useTranslate();

  return (
    <TabScreenLayout
      title={t('tab_report_title')}
      body={t('tab_report_placeholder')}
    />
  );
};

export default ReportTabScreen;
