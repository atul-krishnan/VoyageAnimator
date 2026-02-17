import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { TrackedLink } from "@/components/ui/tracked-link";
import { MAP_STYLES } from "@/lib/map/styles";

export const metadata: Metadata = {
  title: "Map Styles",
  description:
    "Explore cinematic map styles in Voyagraph and test route storytelling looks before publishing.",
};

export default function MapsPage() {
  return (
    <section className="px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <PageHeader
        description="Choose from creator-tuned map directions ranging from dark atlas looks to aerial travel contexts."
        eyebrow="Map Styles"
        title="Design your journey mood"
      />

      <div className="mx-auto mt-12 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MAP_STYLES.map((style) => (
          <article
            className="rounded-2xl border border-white/10 bg-[#061523]/70 p-5"
            key={style.id}
          >
            <div
              className="mb-4 h-24 rounded-xl"
              style={{
                background: `linear-gradient(140deg, ${style.accent}22 0%, #11273a 55%, #0a1522 100%)`,
              }}
            />
            <h2 className="font-display text-2xl text-white">{style.name}</h2>
            <p className="mt-2 text-sm text-[#b9cde1]">{style.description}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#82a2c0]">
              style id: {style.id}
            </p>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl justify-center">
        <TrackedLink
          className="bg-[#72f7cf] text-[#04221f] hover:bg-[#8bfad9]"
          eventProps={{ location: "maps_page", target: "studio" }}
          href="/studio"
        >
          Try Styles In Studio
        </TrackedLink>
      </div>
    </section>
  );
}
