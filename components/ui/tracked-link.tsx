"use client";

import Link, { type LinkProps } from "next/link";
import { type PropsWithChildren } from "react";

import { trackEvent } from "@/lib/analytics/client";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

type TrackedLinkProps = PropsWithChildren<
  LinkProps & {
    className?: string;
    eventName?: string;
    eventProps?: Record<string, string | number | boolean>;
    onClick?: () => void;
  }
>;

export function TrackedLink({
  children,
  className,
  eventName = ANALYTICS_EVENTS.ctaClick,
  eventProps,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72f7cf]/80",
        className,
      )}
      onClick={() => {
        trackEvent(eventName, eventProps);
        onClick?.();
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
