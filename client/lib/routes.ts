export const ROUTES = {
  welcome: '/welcome',
  register: '/register',
  login: '/login',
  forgotPassword: '/forgot-password',
  home: '/(tabs)',
  tabs: {
    start: '/(tabs)',
    patterns: '/(tabs)/patterns',
    syna: '/(tabs)/syna',
    report: '/(tabs)/report',
    profile: '/(tabs)/profile',
  },
} as const;
