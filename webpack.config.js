const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // ✅ 1. Safe aliases & fallbacks
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

  // ✅ 2. Inject safe global polyfill BEFORE HtmlWebpackPlugin runs
  config.plugins.unshift({
    apply: (compiler) => {
      compiler.hooks.beforeCompile.tap("InjectSafeLocalStorage", () => {
        try {
          if (typeof globalThis.localStorage === "undefined") {
            globalThis.localStorage = {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
              clear: () => {},
            };
          }
        } catch (e) {
          console.warn("⚠️ Safe localStorage polyfill injected (Render build)");
        }
      });
    },
  });

  // ✅ 3. Prevent HtmlWebpackPlugin from evaluating inline JS that touches localStorage
  config.plugins.forEach((plugin) => {
    if (plugin.constructor && plugin.constructor.name === "HtmlWebpackPlugin") {
      plugin.userOptions.scriptLoading = "blocking";
    }
  });

  return config;
};
