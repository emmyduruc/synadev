import { INSIGHT_ICON_KEY, INSIGHT_ID, INSIGHT_SURFACE_KEY } from '@/lib/insights/constants';
import type { InsightContent } from '@/lib/insights/insightTypes';

const JULIA_PETERS_REVIEWER = {
  nameKey: 'insight_reviewer_julia_peters_name',
  roleKey: 'insight_reviewer_julia_peters_role',
  initials: 'JP',
} as const;

export const INSIGHT_CONTENT_MOCK: readonly InsightContent[] = [
  {
    id: INSIGHT_ID.mrs,
    eyebrowKey: 'dashboard_insight_mrs_eyebrow',
    cardTitleKey: 'dashboard_insight_mrs_title',
    cardDescriptionKey: 'dashboard_insight_mrs_description',
    surfaceKey: INSIGHT_SURFACE_KEY.mrs,
    reviewer: JULIA_PETERS_REVIEWER,
    storySlides: [
      {
        id: 'mrs-slide-1',
        iconKey: INSIGHT_ICON_KEY.flower,
        subtitleKey: 'insight_story_mrs_slide_1_subtitle',
        headlineKey: 'insight_story_mrs_slide_1_headline',
        bodyKey: 'insight_story_mrs_slide_1_body',
        badgeLabelKey: 'insight_story_validated_questionnaire_badge',
      },
      {
        id: 'mrs-slide-2',
        iconKey: INSIGHT_ICON_KEY.pattern,
        headlineKey: 'insight_story_mrs_slide_2_headline',
        bodyKey: 'insight_story_mrs_slide_2_body',
      },
      {
        id: 'mrs-slide-3',
        iconKey: INSIGHT_ICON_KEY.pattern,
        headlineKey: 'insight_story_mrs_slide_3_headline',
        bodyKey: 'insight_story_mrs_slide_3_body',
        badgeLabelKey: 'insight_story_study_based_badge',
      },
    ],
    article: {
      eyebrowKey: 'insight_article_mrs_eyebrow',
      titleKey: 'insight_article_mrs_title',
      image: {
        backgroundClassName: 'bg-dusty-rose-light',
        iconKey: INSIGHT_ICON_KEY.flower,
      },
      sections: [
        {
          id: 'mrs-article-1',
          headingKey: 'insight_article_mrs_section_1_heading',
          bodyKey: 'insight_article_mrs_section_1_body',
        },
        {
          id: 'mrs-article-2',
          headingKey: 'insight_article_mrs_section_2_heading',
          bodyKey: 'insight_article_mrs_section_2_body',
          bulletKeys: [
            'insight_article_mrs_section_2_bullet_1',
            'insight_article_mrs_section_2_bullet_2',
            'insight_article_mrs_section_2_bullet_3',
          ],
        },
        {
          id: 'mrs-article-3',
          bodyKey: 'insight_article_mrs_section_3_body',
        },
      ],
      sourceHeadingKey: 'insight_article_source_heading',
      sourceBadgeKey: 'insight_story_study_based_badge',
      reviewer: JULIA_PETERS_REVIEWER,
    },
  },
  {
    id: INSIGHT_ID.sleep,
    eyebrowKey: 'dashboard_insight_sleep_eyebrow',
    cardTitleKey: 'dashboard_insight_sleep_title',
    cardDescriptionKey: 'dashboard_insight_sleep_description',
    surfaceKey: INSIGHT_SURFACE_KEY.sleep,
    reviewer: JULIA_PETERS_REVIEWER,
    storySlides: [
      {
        id: 'sleep-slide-1',
        iconKey: INSIGHT_ICON_KEY.sleep,
        subtitleKey: 'insight_story_sleep_slide_1_subtitle',
        headlineKey: 'insight_story_sleep_slide_1_headline',
        bodyKey: 'insight_story_sleep_slide_1_body',
        badgeLabelKey: 'insight_story_study_based_badge',
      },
      {
        id: 'sleep-slide-2',
        iconKey: INSIGHT_ICON_KEY.sleep,
        headlineKey: 'insight_story_sleep_slide_2_headline',
        bodyKey: 'insight_story_sleep_slide_2_body',
      },
      {
        id: 'sleep-slide-3',
        iconKey: INSIGHT_ICON_KEY.sleep,
        headlineKey: 'insight_story_sleep_slide_3_headline',
        bodyKey: 'insight_story_sleep_slide_3_body',
      },
    ],
    article: {
      eyebrowKey: 'insight_article_sleep_eyebrow',
      titleKey: 'insight_article_sleep_title',
      image: {
        backgroundClassName: 'bg-lavender-light',
        iconKey: INSIGHT_ICON_KEY.sleep,
      },
      sections: [
        {
          id: 'sleep-article-1',
          headingKey: 'insight_article_sleep_section_1_heading',
          bodyKey: 'insight_article_sleep_section_1_body',
        },
        {
          id: 'sleep-article-2',
          headingKey: 'insight_article_sleep_section_2_heading',
          bodyKey: 'insight_article_sleep_section_2_body',
          bulletKeys: [
            'insight_article_sleep_section_2_bullet_1',
            'insight_article_sleep_section_2_bullet_2',
            'insight_article_sleep_section_2_bullet_3',
          ],
        },
        {
          id: 'sleep-article-3',
          bodyKey: 'insight_article_sleep_section_3_body',
        },
      ],
      sourceHeadingKey: 'insight_article_source_heading',
      sourceBadgeKey: 'insight_story_study_based_badge',
      reviewer: JULIA_PETERS_REVIEWER,
    },
  },
  {
    id: INSIGHT_ID.heat,
    eyebrowKey: 'dashboard_insight_heat_eyebrow',
    cardTitleKey: 'dashboard_insight_heat_title',
    cardDescriptionKey: 'dashboard_insight_heat_description',
    surfaceKey: INSIGHT_SURFACE_KEY.heat,
    reviewer: JULIA_PETERS_REVIEWER,
    storySlides: [
      {
        id: 'heat-slide-1',
        iconKey: INSIGHT_ICON_KEY.flame,
        subtitleKey: 'insight_story_heat_slide_1_subtitle',
        headlineKey: 'insight_story_heat_slide_1_headline',
        bodyKey: 'insight_story_heat_slide_1_body',
        badgeLabelKey: 'insight_story_study_based_badge',
      },
      {
        id: 'heat-slide-2',
        iconKey: INSIGHT_ICON_KEY.flame,
        headlineKey: 'insight_story_heat_slide_2_headline',
        bodyKey: 'insight_story_heat_slide_2_body',
      },
      {
        id: 'heat-slide-3',
        iconKey: INSIGHT_ICON_KEY.flame,
        headlineKey: 'insight_story_heat_slide_3_headline',
        bodyKey: 'insight_story_heat_slide_3_body',
      },
    ],
    article: {
      eyebrowKey: 'insight_article_heat_eyebrow',
      titleKey: 'insight_article_heat_title',
      image: {
        backgroundClassName: 'bg-apricot-light',
        iconKey: INSIGHT_ICON_KEY.flame,
      },
      sections: [
        {
          id: 'heat-article-1',
          headingKey: 'insight_article_heat_section_1_heading',
          bodyKey: 'insight_article_heat_section_1_body',
        },
        {
          id: 'heat-article-2',
          headingKey: 'insight_article_heat_section_2_heading',
          bodyKey: 'insight_article_heat_section_2_body',
          bulletKeys: [
            'insight_article_heat_section_2_bullet_1',
            'insight_article_heat_section_2_bullet_2',
            'insight_article_heat_section_2_bullet_3',
          ],
        },
        {
          id: 'heat-article-3',
          bodyKey: 'insight_article_heat_section_3_body',
        },
      ],
      sourceHeadingKey: 'insight_article_source_heading',
      sourceBadgeKey: 'insight_story_study_based_badge',
      reviewer: JULIA_PETERS_REVIEWER,
    },
  },
];

export const getInsightContentById = (insightId: string): InsightContent | undefined =>
  INSIGHT_CONTENT_MOCK.find((insight) => insight.id === insightId);
