"use client";

import { useEffect, useState, type PropsWithChildren } from "react";

import { ConsentBanner } from "@/components/analytics/consent-banner";
import { initPosthog } from "@/lib/analytics/client";
import { readConsent, writeConsent, type ConsentState } from "@/lib/analytics/consent";

export function AnalyticsProvider({ children }: PropsWithChildren) {
  const [consent, setConsent] = useState<ConsentState | "unknown">(() => {
    const stored = readConsent();
    return stored ?? "unknown";
  });

  useEffect(() => {
    if (consent === "accepted") {
      initPosthog();
    }
  }, [consent]);

  const onDecision = (value: ConsentState) => {
    writeConsent(value);
    setConsent(value);

    if (value === "accepted") {
      initPosthog();
    }
  };

  return (
    <>
      {children}
      {consent === "unknown" ? <ConsentBanner onDecision={onDecision} /> : null}
    </>
  );
}
