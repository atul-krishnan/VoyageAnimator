import { Camera, Compass, Film, Globe2, Sparkles, Wand2 } from "lucide-react";

import { WaitlistForm } from "@/components/forms/waitlist-form";
import { TrackedLink } from "@/components/ui/tracked-link";

const FEATURES = [
  {
    title: "Route Builder",
    body: "Click points on the map, reshape your path, and build smooth travel sequences without editing complexity.",
    icon: Compass,
  },
  {
    title: "Cinematic Map Styles",
    body: "Switch between stylized map looks tuned for creator reels, travel documentaries, and fast social recaps.",
    icon: Globe2,
  },
  {
    title: "3D Story Markers",
    body: "Preview licensed 3D scene models that move with bearing and speed, ready for polished animation shots.",
    icon: Sparkles,
  },
  {
    title: "Creator-First Workflow",
    body: "The UI is built for travel storytellers: route controls, pace tuning, and quick iteration from one workspace.",
    icon: Wand2,
  },
  {
    title: "Project Saves",
    body: "Store route drafts locally or in your account and continue editing the same itinerary across sessions.",
    icon: Film,
  },
  {
    title: "Social-Ready Framing",
    body: "Plan scenes with pacing controls and camera-friendly trajectories before recording or exporting externally.",
    icon: Camera,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Voyagraph made our weekly road-trip recap format finally sustainable. We storyboard routes in under ten minutes.",
    author: "Lena Ortiz",
    role: "YouTube Creator",
  },
  {
    quote:
      "The style presets and 3D markers instantly elevated the quality of our destination teaser reels.",
    author: "Noah Patel",
    role: "Travel Brand Producer",
  },
  {
    quote:
      "Best part is the pace controls. We can sync map movement with voiceover beats naturally.",
    author: "Amelia Reed",
    role: "Instagram Storyteller",
  },
];

export function HomeSections() {
  return (
    <div className="space-y-24 pb-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                className="rounded-2xl border border-white/10 bg-[#061523]/75 p-6 backdrop-blur-xl"
                key={feature.title}
              >
                <Icon className="mb-4 h-5 w-5 text-[#72f7cf]" />
                <h2 className="font-display text-2xl text-white">{feature.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#b8c7d9]">
                  {feature.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-[#071726]/75 p-7 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#72f7cf]">
              How It Works
            </p>
            <ol className="mt-5 space-y-4 text-sm leading-relaxed text-[#d3e2f2]">
              <li>1. Pick a map style and a 3D route marker model.</li>
              <li>2. Drop route points and reorder legs to match your itinerary.</li>
              <li>3. Tune speed, loop, and smoothness to match your voiceover pace.</li>
              <li>4. Save drafts locally or to your account and keep iterating.</li>
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <TrackedLink
                className="bg-[#72f7cf] text-[#04221f] hover:bg-[#8bfad9]"
                eventProps={{ location: "home_how_it_works", target: "studio" }}
                href="/studio"
              >
                Launch Studio
              </TrackedLink>
              <TrackedLink
                className="border border-white/20 text-white hover:bg-white/10"
                eventProps={{ location: "home_how_it_works", target: "plans" }}
                href="/plans"
              >
                See Plans
              </TrackedLink>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#061523]/75 p-6 backdrop-blur-xl">
            <h2 className="font-display text-2xl text-white">Get early access</h2>
            <p className="mt-2 text-sm text-[#bdd0e6]">
              Join the waitlist to receive launch updates and creator onboarding slots.
            </p>
            <div className="mt-5">
              <WaitlistForm compact sourcePage="home" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl text-white md:text-4xl">Creator feedback</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article
              className="rounded-2xl border border-white/10 bg-[#061523]/70 p-5"
              key={item.author}
            >
              <p className="text-sm leading-relaxed text-[#d2e3f4]">“{item.quote}”</p>
              <p className="mt-4 text-sm font-semibold text-white">{item.author}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8fa7be]">{item.role}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
