export const ROUTES = {
  welcome: '/welcome',
  register: '/register',
  login: '/login',
  forgotPassword: '/forgot-password',
  home: '/(tabs)',
  tabs: {
    start: '/(tabs)',
    muster: '/(tabs)/muster',
    syna: '/(tabs)/syna',
    bericht: '/(tabs)/bericht',
    ich: '/(tabs)/ich',
  },
} as const;
