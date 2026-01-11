const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // ✅ Ensure proper resolution
  config.resolve = {
    ...config.resolve,
    alias: {
      ...(config.resolve.alias || {}),
      // Force real axios import (not treated as asset)
      axios: path.resolve(__dirname, 'node_modules/axios'),
    },
    extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.ts', '.tsx', '.json'],
    fallback: {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
    },
  };

  return config;
};
