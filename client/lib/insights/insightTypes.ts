import type { InsightIconKey, InsightId, InsightSurfaceKey } from '@/lib/insights/constants';

export type InsightStorySlide = {
  id: string;
  iconKey: InsightIconKey;
  headlineKey: string;
  bodyKey: string;
  subtitleKey?: string;
  badgeLabelKey?: string;
};

export type InsightArticleImagePlaceholder = {
  backgroundClassName: string;
  iconKey: InsightIconKey;
};

export type InsightArticleSection = {
  id: string;
  headingKey?: string;
  bodyKey: string;
  bulletKeys?: readonly string[];
};

export type InsightMedicalReviewer = {
  nameKey: string;
  roleKey: string;
  initials: string;
};

export type InsightArticle = {
  eyebrowKey: string;
  titleKey: string;
  image: InsightArticleImagePlaceholder;
  sections: readonly InsightArticleSection[];
  sourceHeadingKey: string;
  sourceBadgeKey: string;
  reviewer: InsightMedicalReviewer;
};

export type InsightContent = {
  id: InsightId;
  eyebrowKey: string;
  cardTitleKey: string;
  cardDescriptionKey: string;
  surfaceKey: InsightSurfaceKey;
  storySlides: readonly InsightStorySlide[];
  article: InsightArticle;
  reviewer: InsightMedicalReviewer;
};
