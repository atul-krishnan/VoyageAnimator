import type { PropsWithChildren } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";

export function MarketingShell({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030b14] text-[#eff6ff]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-[36rem] w-[36rem] rounded-full bg-[#0c5f72]/25 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#7b4b21]/22 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(114,247,207,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,173,112,0.12),transparent_28%),linear-gradient(180deg,#061523_0%,#030b14_65%)]" />
      </div>

      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
