import { createBrowserHistory } from "history";

export const navigationRef = createBrowserHistory();

export function navigate(route: string, params?: Record<string, any>) {
  const normalized = route.startsWith("/") ? route : `/${route}`;
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : "";
  const fullPath = `${normalized}${query}`;

  try {
    navigationRef.push(fullPath);
  } catch {
    // ✅ Fallback for web (no HistoryRouter)
    window.history.pushState({}, "", fullPath);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
}


export function replace(route: string, params?: Record<string, any>) {
  const normalized = route.startsWith("/") ? route : `/${route}`;
  if (params) {
    const query = new URLSearchParams(params as any).toString();
    navigationRef.replace(`${normalized}?${query}`);
  } else {
    navigationRef.replace(normalized);
  }
}

export function resetAndNavigate(route: string) {
  const normalized = route.startsWith("/") ? route : `/${route}`;
  navigationRef.push(normalized);
  navigationRef.go(0);
}

export function goBack() {
  navigationRef.back();
}
