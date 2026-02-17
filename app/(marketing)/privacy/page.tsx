import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for Voyagraph.",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl text-white">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#c4d7ea]">
        <p>
          Voyagraph collects only the minimum data required to operate waitlist and
          account features. We do not sell personal information.
        </p>
        <p>
          Analytics is consent-based. If you decline analytics cookies, event
          tracking is disabled.
        </p>
        <p>
          Waitlist data includes your email, creator role, and stated use case. You
          can request deletion by contacting support@voyagraph.app.
        </p>
      </div>
    </section>
  );
}
