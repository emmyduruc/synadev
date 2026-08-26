import { ActivityIndicator, Platform, TextInput as RNTextInput } from 'react-native';

import { Box } from '@/components/ui/Box';
import { SendIcon } from '@/components/ui/icons/SendIcon';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';
import { useTranslate } from '@/hooks/useTranslate';
import { FONT_FAMILY } from '@/lib/fonts/constants';
import { cn, semanticColors } from '@/lib/ui';

export type SynaChatComposerProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
};

export const SynaChatComposer = ({
  value,
  onChangeText,
  onSend,
  isSending,
}: SynaChatComposerProps) => {
  const { t } = useTranslate();
  const keyboardInset = useKeyboardInset();
  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !isSending;
  const bottomPadding = keyboardInset > 0 ? keyboardInset + 10 : 10;

  return (
    <Box
      className="border-t border-white/50 bg-card/40 px-3 pt-2"
      style={{ paddingBottom: bottomPadding }}>
      <Box
        direction="row"
        align="end"
        className="rounded-[28px] border border-white/80 bg-card px-2 py-1.5 shadow-sm">
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={t('syna_chat_input_placeholder')}
          placeholderTextColor={semanticColors.placeholder}
          editable={!isSending}
          multiline
          maxLength={2000}
          blurOnSubmit={false}
          returnKeyType="default"
          className={cn(
            'max-h-28 min-h-11 flex-1 px-3 py-2.5 font-sans text-base text-foreground',
          )}
          style={{
            fontFamily: FONT_FAMILY.regular,
            ...(Platform.OS === 'android'
              ? { includeFontPadding: false, textAlignVertical: 'center' }
              : null),
          }}
        />

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            isSending
              ? t('syna_chat_sending_accessibility')
              : t('syna_chat_send_accessibility')
          }
          disabled={!canSend && !isSending}
          onPress={onSend}
          className={cn(
            'mb-0.5 h-11 w-11 items-center justify-center rounded-full',
            canSend || isSending ? 'bg-primary-500' : 'bg-muted',
          )}>
          {isSending ? (
            <ActivityIndicator color={semanticColors.iconOnPrimary} size="small" />
          ) : (
            <SendIcon
              size={18}
              color={
                canSend ? semanticColors.iconOnPrimary : semanticColors.foregroundMuted
              }
            />
          )}
        </TouchableOpacity>
      </Box>
    </Box>
  );
};
