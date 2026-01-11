import { AppRegistry, Platform } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

if (Platform.OS === "web") {
  window.__GA_READY__ = false;

  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src =
    "https://www.googletagmanager.com/gtag/js?id=G-7WB75XS340";

  gtagScript.onload = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", "G-7WB75XS340", {
      send_page_view: false, // SPA safe
    });

    // ✅ flag
    window.__GA_READY__ = true;
  };

  document.head.appendChild(gtagScript);
}

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
