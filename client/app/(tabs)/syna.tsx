import { SAFE_AREA_EDGES, SafeAreaScreen } from '@/components/layout/SafeAreaScreen';
import { SynaGradientBackground } from '@/components/layout/SynaGradientBackground';
import { SynaChatContent } from '@/components/synaChat/SynaChatContent';
import { AppHeader, Box } from '@/components/ui';
import { useSynaChat } from '@/hooks/useSynaChat';
import { useTranslate } from '@/hooks/useTranslate';

const SynaTabScreen = () => {
  const { t } = useTranslate();
  const {
    messages,
    draft,
    isSending,
    setDraft,
    sendDraft,
    sendSuggestion,
  } = useSynaChat();

  return (
    <SynaGradientBackground>
      <SafeAreaScreen edges={SAFE_AREA_EDGES.top} style={{ backgroundColor: 'transparent' }}>
        <Box flex={1}>
          <AppHeader title={t('tab_syna_title')} showBack={false} />
          <SynaChatContent
            messages={messages}
            draft={draft}
            isSending={isSending}
            onChangeDraft={setDraft}
            onSend={() => {
              void sendDraft();
            }}
            onSuggestionPress={(suggestion) => {
              void sendSuggestion(suggestion);
            }}
          />
        </Box>
      </SafeAreaScreen>
    </SynaGradientBackground>
  );
};

export default SynaTabScreen;
