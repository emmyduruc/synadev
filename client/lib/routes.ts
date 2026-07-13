export const ROUTES = {
  welcome: '/welcome',
  register: '/register',
  login: '/login',
  forgotPassword: '/forgot-password',
  home: '/(tabs)',
  onboarding: {
    bioData: '/onboarding/bio-data',
  },
  calendar: '/calendar',
  calendarEditPeriod: '/calendar?mode=edit_period',
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
