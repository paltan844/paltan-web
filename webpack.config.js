const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // 🔥 HARD OVERRIDE: force public/index.html as template
  config.plugins = config.plugins.map((plugin) => {
    if (
      plugin &&
      plugin.constructor &&
      plugin.constructor.name === 'HtmlWebpackPlugin'
    ) {
      return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        inject: true,
      });
    }
    return plugin;
  });

  // ✅ Resolve config (unchanged, correct)
  config.resolve = {
    ...config.resolve,
    alias: {
      ...(config.resolve.alias || {}),
      axios: path.resolve(__dirname, 'node_modules/axios'),
    },
    extensions: [
      '.web.js',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.ts',
      '.tsx',
      '.json',
    ],
    fallback: {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
    },
  };

  return config;
};
