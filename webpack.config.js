const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");

module.exports = async function (env, argv) {
  // 🧩 Create default Expo Webpack config
  const config = await createExpoWebpackConfigAsync(env, argv);

  // ✅ Add safer resolution + prevent Node-only modules
  config.resolve = {
    ...config.resolve,
    alias: {
      ...(config.resolve.alias || {}),
      axios: path.resolve(__dirname, "node_modules/axios"),
    },
    extensions: [
      ".web.js",
      ".web.ts",
      ".web.tsx",
      ".js",
      ".ts",
      ".tsx",
      ".json",
    ],
    fallback: {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
    },
  };

  // ✅ Patch: Define a fake window.localStorage during build
  // This prevents "SecurityError: Cannot initialize local storage"
  config.plugins.push({
    apply: (compiler) => {
      compiler.hooks.beforeRun.tap("SafeLocalStoragePatch", () => {
        if (typeof global.window === "undefined") global.window = {};
        if (typeof global.window.localStorage === "undefined") {
          global.window.localStorage = {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
            clear: () => {},
          };
        }
      });
    },
  });

  return config;
};
