import { useEffect } from "react";
import { navigationRef } from "@utils/NavigationUtils";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const GA_TRACKING_ID = "G-7WB75XS340"; // 🔴 apni GA4 ID daalo

const GA4Tracker = () => {
  useEffect(() => {
    if (!navigationRef) return;

    const unlisten = navigationRef.listen(({ location }) => {
      if (window.gtag) {
        window.gtag("config", GA_TRACKING_ID, {
          page_path: location.pathname + location.search,
        });
      }
    });

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  return null;
};

export default GA4Tracker;
