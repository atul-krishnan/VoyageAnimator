import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { TrackedLink } from "@/components/ui/tracked-link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the team behind Voyagraph, a cinematic atlas workspace for travel creators and story-led route animation.",
};

export default function AboutPage() {
  return (
    <section className="px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <PageHeader
        description="We are building creator-first travel animation tools focused on speed, quality, and visual storytelling control."
        eyebrow="About Voyagraph"
        title="A cinematic atlas for modern travel creators"
      />

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-[#061523]/70 p-6">
          <h2 className="font-display text-3xl text-white">Our mission</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#c3d7ea]">
            Travel stories deserve map visuals that match the emotion of the
            journey. Voyagraph helps creators build those visuals without needing
            a complex motion-design pipeline.
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#061523]/70 p-6">
          <h2 className="font-display text-3xl text-white">Our approach</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#c3d7ea]">
            We combine route editing, map styling, and 3D scene playback in one
            workspace. The result is faster iteration and stronger narrative pacing
            for travel-first content.
          </p>
        </article>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl justify-center">
        <TrackedLink
          className="bg-[#72f7cf] text-[#04221f] hover:bg-[#8bfad9]"
          eventProps={{ location: "about_page", target: "waitlist" }}
          href="/waitlist"
        >
          Join Creator Waitlist
        </TrackedLink>
      </div>
    </section>
  );
}
