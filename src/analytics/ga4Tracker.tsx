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
    if (!navigationRef) return;

    const unlisten = navigationRef.listen(({ location }) => {
      if (!window.__GA_READY__) return;
      if (typeof window.gtag !== "function") return;

      // ✅ GA4 recommended for SPA
      window.gtag("config", GA_TRACKING_ID, {
        page_title: document.title,
        page_path: location.pathname + location.search,
      });
    });

    return () => {
      if (typeof unlisten === "function") unlisten();
    };
  }, []);

  return null;
};

export default GA4Tracker;
