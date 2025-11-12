const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");

// ✅ Safe global patch injected EARLIEST possible (before anything else)
if (typeof globalThis.localStorage === "undefined") {
  console.log("🧩 Injecting top-level localStorage polyfill (Render safe)");
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };
}

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // ✅ 1. Aliases & Fallbacks
  config.resolve = {
    ...config.resolve,
    alias: {
      ...(config.resolve.alias || {}),
      axios: path.resolve(__dirname, "node_modules/axios"),
    },
    extensions: [".web.js", ".web.ts", ".web.tsx", ".js", ".ts", ".tsx", ".json"],
    fallback: {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
    },
  };

  // ✅ 2. Silent plugin to double-protect during compilation
  config.plugins.unshift({
    apply: (compiler) => {
      compiler.hooks.beforeCompile.tap("RenderSafeLocalStorage", () => {
        try {
          if (typeof globalThis.localStorage === "undefined") {
            globalThis.localStorage = {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
              clear: () => {},
            };
            console.log("⚙️ Reinjected safe localStorage");
          }
        } catch {}
      });
    },
  });

  // ✅ 3. Force HTMLWebpackPlugin to stop JS evaluation that touches localStorage
  config.plugins.forEach((plugin) => {
    if (plugin.constructor && plugin.constructor.name === "HtmlWebpackPlugin") {
      plugin.userOptions.scriptLoading = "blocking";
      plugin.userOptions.minify = false;
    }
  });

  return config;
};
