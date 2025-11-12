const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");

/* ------------------------------------------------------------------
✅ Render-safe polyfill for Node 25 (avoids touching the native getter)
------------------------------------------------------------------ */
try {
  if (!("localStorage" in globalThis)) {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
      },
    });
    console.log("🧩 Render-safe localStorage polyfill installed");
  }
} catch (err) {
  console.warn("⚠️ Could not define localStorage safely:", err.message);
}

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // ✅ Normal path & alias setup
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

  // ✅ Optional: ensure HtmlWebpackPlugin doesn’t evaluate inline JS
  config.plugins.forEach((plugin) => {
    if (plugin.constructor?.name === "HtmlWebpackPlugin") {
      plugin.userOptions.scriptLoading = "blocking";
      plugin.userOptions.minify = false;
    }
  });

  return config;
};
