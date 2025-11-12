const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve = {
    ...config.resolve,
    alias: {
      ...(config.resolve.alias || {}),
      axios: path.resolve(__dirname, "node_modules/axios"),
    },
    extensions: [".web.js", ".web.ts", ".web.tsx", ".js", ".ts", ".tsx", ".json"],
    fallback: { ...(config.resolve.fallback || {}), fs: false, path: false },
  };

  // Optional: prevent HtmlWebpackPlugin from evaluating inline scripts
  config.plugins.forEach((plugin) => {
    if (plugin.constructor?.name === "HtmlWebpackPlugin") {
      plugin.userOptions.scriptLoading = "blocking";
      plugin.userOptions.minify = false;
    }
  });

  return config;
};
