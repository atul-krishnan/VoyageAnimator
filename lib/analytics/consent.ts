export type ConsentState = "accepted" | "declined";

export const CONSENT_STORAGE_KEY = "voyagraph.analytics.consent.v1";

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (value === "accepted" || value === "declined") {
    return value;
  }

  return null;
}

export function writeConsent(value: ConsentState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
}
