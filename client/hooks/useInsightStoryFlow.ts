import { useCallback, useState } from 'react';

import { getInsightContentById } from '@/lib/insights/insightContentMock';
import type { InsightContent } from '@/lib/insights/insightTypes';

export const INSIGHT_FLOW_PHASE = {
  closed: 'closed',
  story: 'story',
  article: 'article',
} as const;

export type InsightFlowPhase = (typeof INSIGHT_FLOW_PHASE)[keyof typeof INSIGHT_FLOW_PHASE];

export const useInsightStoryFlow = () => {
  const [phase, setPhase] = useState<InsightFlowPhase>(INSIGHT_FLOW_PHASE.closed);
  const [activeInsight, setActiveInsight] = useState<InsightContent | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const openInsight = useCallback((insightId: string) => {
    const insight = getInsightContentById(insightId);

    if (!insight) {
      return;
    }

    setActiveInsight(insight);
    setActiveSlideIndex(0);
    setPhase(INSIGHT_FLOW_PHASE.story);
  }, []);

  const closeInsight = useCallback(() => {
    setPhase(INSIGHT_FLOW_PHASE.closed);
    setActiveInsight(null);
    setActiveSlideIndex(0);
  }, []);

  const goToNextSlide = useCallback(() => {
    if (!activeInsight) {
      return;
    }

    setActiveSlideIndex((currentIndex) => {
      const lastIndex = activeInsight.storySlides.length - 1;

      if (currentIndex >= lastIndex) {
        return currentIndex;
      }

      return currentIndex + 1;
    });
  }, [activeInsight]);

  const goToPreviousSlide = useCallback(() => {
    setActiveSlideIndex((currentIndex) => Math.max(0, currentIndex - 1));
  }, []);

  const openArticle = useCallback(() => {
    setPhase(INSIGHT_FLOW_PHASE.article);
  }, []);

  const closeArticle = useCallback(() => {
    closeInsight();
  }, [closeInsight]);

  return {
    phase,
    activeInsight,
    activeSlideIndex,
    openInsight,
    closeInsight,
    goToNextSlide,
    goToPreviousSlide,
    openArticle,
    closeArticle,
    isStoryVisible: phase === INSIGHT_FLOW_PHASE.story && activeInsight !== null,
    isArticleVisible: phase === INSIGHT_FLOW_PHASE.article && activeInsight !== null,
  };
};
