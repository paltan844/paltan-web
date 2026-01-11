const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // 🔥 FORCE Expo to use public/index.html
  config.plugins = config.plugins.map(plugin => {
    if (plugin instanceof HtmlWebpackPlugin) {
      plugin.userOptions.template = path.resolve(__dirname, 'public/index.html');
    }
    return plugin;
  });

  config.resolve = {
    ...config.resolve,
    alias: {
      ...(config.resolve.alias || {}),
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
