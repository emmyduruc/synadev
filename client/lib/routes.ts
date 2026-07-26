export const ROUTES = {
  welcome: '/welcome',
  register: '/register',
  login: '/login',
  forgotPassword: '/forgot-password',
  home: '/(tabs)',
  onboarding: {
    bioData: '/onboarding/bio-data',
  },
  assessment: {
    mrsIi: '/assessment/mrs-ii',
  },
  calendar: '/calendar',
  calendarEditPeriod: '/calendar?mode=edit_period',
  recordPeriod: '/record-period',
  symptoms: '/symptoms',
  mood: '/mood',
  tabs: {
    start: '/(tabs)',
    patterns: '/(tabs)/patterns',
    syna: '/(tabs)/syna',
    report: '/(tabs)/report',
    profile: '/(tabs)/profile',
  },
} as const;
