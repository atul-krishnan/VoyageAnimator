import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { TrackedLink } from "@/components/ui/tracked-link";
import { VEHICLE_MODELS } from "@/lib/map/models";

export const metadata: Metadata = {
  title: "3D Models",
  description:
    "Browse Voyagraph's starter 3D model catalog for route animation previews and creator storytelling flows.",
};

export default function ModelsPage() {
  return (
    <section className="px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <PageHeader
        description="Use licensed and CC-friendly starter 3D scene models while we expand the full creator library."
        eyebrow="3D Model Catalog"
        title="Pick your journey marker"
      />

      <div className="mx-auto mt-12 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VEHICLE_MODELS.map((model) => (
          <article
            className="rounded-2xl border border-white/10 bg-[#061523]/70 p-5"
            key={model.id}
          >
            <div className="mb-4 flex h-24 items-center justify-center rounded-xl bg-[linear-gradient(130deg,#0f2f45,#3a2a1d)] text-4xl">
              ✦
            </div>
            <h2 className="font-display text-2xl text-white">{model.name}</h2>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#79ecc9]">
              {model.category}
            </p>
            <p className="mt-3 text-sm text-[#b9cde1]">{model.description}</p>
            <p className="mt-4 text-xs text-[#8ca8c2]">License: {model.license}</p>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl justify-center">
        <TrackedLink
          className="bg-[#72f7cf] text-[#04221f] hover:bg-[#8bfad9]"
          eventProps={{ location: "models_page", target: "studio" }}
          href="/studio"
        >
          Preview Models In Studio
        </TrackedLink>
      </div>
    </section>
  );
}
