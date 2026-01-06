declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const trackPageView = (path: string) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
    });
  }
};
