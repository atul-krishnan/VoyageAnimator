import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of service for Voyagraph.",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl text-white">Terms of Service</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#c4d7ea]">
        <p>
          Voyagraph is provided as-is during early access. Features and availability
          may change as we iterate with creators.
        </p>
        <p>
          You are responsible for ensuring you have usage rights for uploaded media,
          map overlays, and shared project materials.
        </p>
        <p>
          Abuse, scraping, or disruptive usage of the platform can result in account
          suspension.
        </p>
      </div>
    </section>
  );
}
