/**
 * Helper function to retrieve the dynamic base URL of the application.
 * Priority:
 * 1. Environment variable: VITE_SITE_URL or VITE_APP_URL
 * 2. Window location origin (in browser)
 * 3. Default fallback: https://cally.com
 */
export function getBaseUrl(): string {
  const envUrl =
    (import.meta as any).env?.VITE_SITE_URL ||
    (import.meta as any).env?.VITE_APP_URL;

  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "https://cally.com";
}

/**
 * Returns the current full page URL dynamically.
 */
export function getCurrentUrl(fallbackPath = ""): string {
  if (typeof window !== "undefined" && window.location?.href) {
    return window.location.href;
  }
  const base = getBaseUrl();
  const path = fallbackPath.startsWith("/") ? fallbackPath : `/${fallbackPath}`;
  return `${base}${path}`;
}
