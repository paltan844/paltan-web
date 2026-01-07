const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // ✅ Inject GA4 into <head>
  config.plugins = config.plugins.map((plugin) => {
    if (plugin instanceof HtmlWebpackPlugin) {
      plugin.options.inject = true;
      plugin.options.templateParameters = {
        ...plugin.options.templateParameters,
        GA_TRACKING_ID: "G-7WB75XS340",
      };
    }
    return plugin;
  });

  // Add GA script manually
  config.plugins.push(
    new HtmlWebpackPlugin({
      inject: "head",
      templateContent: ({ htmlWebpackPlugin }) => `
<!doctype html>
<html>
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-7WB75XS340"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-7WB75XS340', { send_page_view: false });
</script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
      `,
    })
  );

  return config;
};
