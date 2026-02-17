import type { Metadata } from "next";

import { PricingViewTracker } from "@/components/marketing/pricing-view-tracker";
import { PageHeader } from "@/components/ui/page-header";
import { TrackedLink } from "@/components/ui/tracked-link";

export const metadata: Metadata = {
  title: "Plans",
  description:
    "Voyagraph plan options for creators who need faster route-story workflows and premium map/model libraries.",
};

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    features: [
      "Map route builder",
      "Starter style selection",
      "Local project saves",
      "Playback controls",
    ],
  },
  {
    name: "Creator",
    price: "$12",
    cadence: "per month",
    features: [
      "Full cinematic style pack",
      "Expanded 3D model catalog",
      "Cloud synced projects",
      "Priority creator support",
    ],
    highlighted: true,
  },
  {
    name: "Studio",
    price: "$39",
    cadence: "per month",
    features: [
      "Team seats and shared workspaces",
      "Brand presets",
      "Advanced storyboard templates",
      "Launch support channel",
    ],
  },
];

const COMPARISON_ROWS = [
  ["Map styles", "Starter", "All cinematic presets", "All + team presets"],
  ["3D markers", "Starter", "Expanded", "Expanded + shared library"],
  ["Saved routes", "Local only", "Local + cloud", "Team-shared cloud"],
  ["Support", "Community", "Priority", "Dedicated"],
];

export default function PlansPage() {
  return (
    <section className="px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <PricingViewTracker />
      <PageHeader
        description="Pricing is global in USD. Join the waitlist to secure launch pricing and creator onboarding slots."
        eyebrow="Pricing"
        title="Plans built for travel storytellers"
      />

      <div className="mx-auto mt-12 grid max-w-7xl gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <article
            className={`rounded-2xl border p-6 ${
              plan.highlighted
                ? "border-[#72f7cf]/40 bg-[#07231f]/80"
                : "border-white/10 bg-[#061523]/70"
            }`}
            key={plan.name}
          >
            <p className="font-display text-3xl text-white">{plan.name}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{plan.price}</p>
            <p className="text-sm text-[#9eb8d0]">{plan.cadence}</p>
            <ul className="mt-5 space-y-2 text-sm text-[#c5d8ed]">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <TrackedLink
              className="mt-6 w-full bg-[#72f7cf] text-[#04221f] hover:bg-[#8bfad9]"
              eventProps={{ location: "plans_card", plan: plan.name }}
              href="/waitlist"
            >
              Join Waitlist
            </TrackedLink>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-[#051322]/70">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-[#b8cde3]">
            <tr>
              <th className="px-4 py-3">Feature</th>
              <th className="px-4 py-3">Free</th>
              <th className="px-4 py-3">Creator</th>
              <th className="px-4 py-3">Studio</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr className="border-t border-white/10 text-[#e0ecf8]" key={row[0]}>
                {row.map((cell) => (
                  <td className="px-4 py-3" key={cell}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
