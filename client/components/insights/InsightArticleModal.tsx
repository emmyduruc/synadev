import { Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InsightArticleImagePlaceholderView } from './InsightArticleImagePlaceholder';
import { InsightMedicalReviewerRow } from './InsightMedicalReviewer';

import { Box } from '@/components/ui/Box';
import { BookIcon } from '@/components/ui/icons/BookIcon';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { Tag } from '@/components/ui/Tag';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { useTranslate } from '@/hooks/useTranslate';
import type { InsightContent } from '@/lib/insights/insightTypes';
import { semanticColors } from '@/lib/ui';

export type InsightArticleModalProps = {
  insight: InsightContent;
  visible: boolean;
  onClose: () => void;
};

export const InsightArticleModal = ({ insight, visible, onClose }: InsightArticleModalProps) => {
  const { t } = useTranslate();
  const insets = useSafeAreaInsets();
  const { article } = insight;

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <Box flex={1} background="background">
        <Box
          direction="row"
          align="center"
          justify="between"
          paddingX="lg"
          className="border-b border-border bg-background"
          style={{ paddingTop: insets.top + 8, paddingBottom: 12 }}>
          <Text size="2xs" weight="semibold" className="uppercase tracking-wide text-foreground-muted">
            {t(article.eyebrowKey)}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('insight_article_close_accessibility_label')}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            onPress={onClose}>
            <CloseIcon size={22} color={semanticColors.foregroundMuted} />
          </TouchableOpacity>
        </Box>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: insets.bottom + 32,
          }}>
          <Box gap="lg">
            <Text size="3xl" weight="bold" className="leading-tight">
              {t(article.titleKey)}
            </Text>

            <InsightArticleImagePlaceholderView image={article.image} />

            {article.sections.map((section) => (
              <Box key={section.id} gap="sm">
                {section.headingKey ? (
                  <Text size="xl" weight="bold" className="leading-snug">
                    {t(section.headingKey)}
                  </Text>
                ) : null}
                <Text size="sm" className="leading-relaxed text-black">
                  {t(section.bodyKey)}
                </Text>
                {section.bulletKeys?.map((bulletKey) => (
                  <Box key={bulletKey} direction="row" gap="sm" className="pl-1">
                    <Text size="sm" className="text-black">
                      •
                    </Text>
                    <Box flex={1}>
                      <Text size="sm" className="leading-relaxed text-black">
                        {t(bulletKey)}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}

            <Box className="mt-2 border-t border-border pt-6" gap="md">
              <Text size="2xs" weight="semibold" className="uppercase tracking-wide text-foreground-muted">
                {t(article.sourceHeadingKey)}
              </Text>
              <Tag
                label={t(article.sourceBadgeKey)}
                icon={<BookIcon size={14} color={semanticColors.foregroundMuted} />}
                iconPosition="left"
                className="self-start border-border bg-card"
              />
              <InsightMedicalReviewerRow
                reviewer={article.reviewer}
                headingKey="insight_article_medical_review_heading"
              />
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </Modal>
  );
};
