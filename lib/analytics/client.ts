"use client";

import posthog from "posthog-js";

import { runtimeEnv } from "@/lib/env";

let initialized = false;

export function initPosthog(): void {
  if (initialized || !runtimeEnv.posthogKey) {
    return;
  }

  posthog.init(runtimeEnv.posthogKey, {
    api_host: runtimeEnv.posthogHost || "https://us.i.posthog.com",
    capture_pageview: true,
    autocapture: false,
    person_profiles: "identified_only",
  });

  initialized = true;
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | undefined>,
): void {
  if (!initialized) {
    return;
  }

  posthog.capture(eventName, properties);
}
