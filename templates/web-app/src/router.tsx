import { useSyncExternalStore } from "react";

// A small history router. Orbit serves index.html for every path (the SPA fallback), so deep links work.

const subscribe = (notify: () => void) => {
  window.addEventListener("popstate", notify);
  return () => window.removeEventListener("popstate", notify);
};

export function usePath() {
  return useSyncExternalStore(subscribe, () => window.location.pathname);
}

export function navigate(to: string) {
  if (to === window.location.pathname) return;
  window.history.pushState(null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

/** Matches "/notes/:id" against a path; returns the params or null. */
export function match(pattern: string, path: string): Record<string, string> | null {
  const names: string[] = [];
  const re = new RegExp("^" + pattern.replace(/:(\w+)/g, (_, n: string) => (names.push(n), "([^/]+)")) + "/?$");
  const found = re.exec(path);
  return found ? Object.fromEntries(names.map((n, i) => [n, decodeURIComponent(found[i + 1])])) : null;
}
