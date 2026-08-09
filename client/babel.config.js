module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // Must be last. Reanimated 4 delegates to worklets plugin.
    plugins: ['react-native-worklets/plugin'],
  };
};
