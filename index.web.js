import { AppRegistry, Platform } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

// 🔥 GA INIT (Expo Web SAFE)
if (Platform.OS === "web") {
  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src =
    "https://www.googletagmanager.com/gtag/js?id=G-7WB75XS340";
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());

  // ❗ IMPORTANT: send_page_view false (SPA)
  window.gtag("config", "G-7WB75XS340", {
    send_page_view: false,
  });
}

// ✅ AppRegistry (tumhara existing setup)
AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
