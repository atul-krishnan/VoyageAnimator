import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { TrackedLink } from "@/components/ui/tracked-link";

export const metadata: Metadata = {
  title: "Download",
  description:
    "Voyagraph mobile experience is coming soon. Join the waitlist for release updates and platform rollout details.",
};

export default function DownloadPage() {
  return (
    <section className="px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <PageHeader
        description="Our mobile release is in private rollout. Join the waitlist to get notified as iOS and Android access opens."
        eyebrow="Download"
        title="Mobile apps are coming soon"
      />

      <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#061523]/70 p-6">
          <p className="font-display text-2xl text-white">iOS</p>
          <p className="mt-2 text-sm text-[#b8cde2]">
            Early test slots are opening in waves.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#061523]/70 p-6">
          <p className="font-display text-2xl text-white">Android</p>
          <p className="mt-2 text-sm text-[#b8cde2]">
            Closed beta build available for selected creators.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-4xl justify-center">
        <TrackedLink
          className="bg-[#72f7cf] text-[#04221f] hover:bg-[#8bfad9]"
          eventProps={{ location: "download_page", target: "waitlist" }}
          href="/waitlist"
        >
          Get Access Updates
        </TrackedLink>
      </div>
    </section>
  );
}
