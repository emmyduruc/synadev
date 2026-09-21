export const ROUTES = {
  intro: '/intro',
  welcome: '/welcome',
  register: '/register',
  login: '/login',
  forgotPassword: '/forgot-password',
  home: '/(tabs)',
  onboarding: {
    bioData: '/onboarding/bio-data',
    connectHealth: '/onboarding/connect-health',
    healthPermissions: '/onboarding/health-permissions',
  },
  assessment: {
    mrsIi: '/assessment/mrs-ii',
    patientActivationMeasure: '/assessment/patient-activation-measure',
    phq2: '/assessment/phq-2',
  },
  calendar: '/calendar',
  calendarEditPeriod: '/calendar?mode=edit_period',
  cycleInsights: '/cycle-insights',
  recordPeriod: '/record-period',
  periodEnded: '/period-ended',
  symptoms: '/symptoms',
  mood: '/mood',
  tabs: {
    start: '/(tabs)',
    patterns: '/(tabs)/patterns',
    syna: '/(tabs)/syna',
    report: '/(tabs)/report',
    profile: '/(tabs)/profile',
  },
  profile: {
    /** Top-level paths — `/profile/...` clashes with the `(tabs)/profile` tab route. */
    settings: '/profile-settings',
    dataSources: '/profile-data-sources',
  },
} as const;
