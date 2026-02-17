"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics/client";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

export function PricingViewTracker() {
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.pricingPlanViewed, {
      source: "plans_page",
    });
  }, []);

  return null;
}
