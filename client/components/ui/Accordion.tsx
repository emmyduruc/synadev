import type { ReactNode } from 'react';
import { useState } from 'react';
import { View } from 'react-native';

import { Box } from '@/components/ui/Box';
import { Text } from '@/components/ui/Text';
import { TouchableOpacity } from '@/components/ui/TouchableOpacity';
import { semanticColors } from '@/lib/ui';

export type AccordionItemModel = {
  id: string;
  title: string;
  content: ReactNode;
};

export type AccordionProps = {
  items: readonly AccordionItemModel[];
  /** Opens this item on mount. Pass null for all collapsed. Defaults to first item. */
  defaultExpandedId?: string | null;
};

const renderAccordionContent = (content: ReactNode) => {
  if (typeof content === 'string') {
    return (
      <Text size="sm" color="foreground-muted" className="leading-relaxed">
        {content}
      </Text>
    );
  }

  return content;
};

export const Accordion = ({ items, defaultExpandedId }: AccordionProps) => {
  const initialExpandedId =
    defaultExpandedId === undefined ? (items[0]?.id ?? null) : defaultExpandedId;
  const [expandedId, setExpandedId] = useState<string | null>(initialExpandedId);

  const handleToggle = (itemId: string) => {
    setExpandedId((previous) => (previous === itemId ? null : itemId));
  };

  return (
    <Box>
      {items.map((item, index) => {
        const isExpanded = expandedId === item.id;
        const showDivider = index < items.length - 1;

        return (
          <Box key={item.id}>
            <Box className="py-3" gap="xs">
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={{ expanded: isExpanded }}
                accessibilityLabel={item.title}
                onPress={() => handleToggle(item.id)}>
                <Text size="sm" weight="bold" color="foreground" className="leading-tight">
                  {item.title}
                </Text>
              </TouchableOpacity>

              {isExpanded ? renderAccordionContent(item.content) : null}
            </Box>

            {showDivider ? (
              <View
                style={{
                  height: 1,
                  backgroundColor: semanticColors.report.hairline,
                }}
              />
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
};
