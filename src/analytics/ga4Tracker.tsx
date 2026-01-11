import { useEffect } from "react";
import { navigationRef } from "@utils/NavigationUtils";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    __GA_READY__?: boolean;
  }
}

const GA_TRACKING_ID = "G-7WB75XS340";

const GA4Tracker = () => {
  useEffect(() => {
    // navigationRef ready nahi
    if (!navigationRef) return;

    const unlisten = navigationRef.listen(({ location }) => {
      // 🔒 SAFETY GUARDS (MOST IMPORTANT)
      if (!window.__GA_READY__) return;
      if (typeof window.gtag !== "function") return;

      // ✅ SPA page_view
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search,
      });
    });

    return () => {
      if (typeof unlisten === "function") {
        unlisten();
      }
    };
  }, []);

  return null;
};

export default GA4Tracker;
