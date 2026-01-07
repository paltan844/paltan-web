import { useEffect } from "react";
import { navigationRef } from "@utils/NavigationUtils";

const GA_TRACKING_ID = "G-7WB75XS340";

const GA4Tracker = () => {
  useEffect(() => {
    if (!navigationRef?.listen) return;

    const unlisten = navigationRef.listen(({ location }) => {
      if (window.gtag) {
        window.gtag("event", "page_view", {
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
