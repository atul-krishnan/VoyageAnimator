import type { Metadata } from "next";

import { WaitlistForm } from "@/components/forms/waitlist-form";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Waitlist",
  description:
    "Join the Voyagraph waitlist for early creator access, onboarding invites, and launch updates.",
};

export default function WaitlistPage() {
  return (
    <section className="px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <PageHeader
        description="Tell us how you create travel content and we will prioritize onboarding based on workflow fit."
        eyebrow="Waitlist"
        title="Secure your early creator slot"
      />

      <div className="mx-auto mt-10 max-w-3xl">
        <WaitlistForm sourcePage="home" />
      </div>
    </section>
  );
}
