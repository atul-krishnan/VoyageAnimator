"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import { TrackedLink } from "@/components/ui/tracked-link";

export function HeroSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-reveal",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" },
      );

      gsap.to(".hero-orb", {
        y: -18,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8" ref={wrapperRef}>
      <div className="hero-orb absolute -top-28 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#72f7cf]/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl text-center">
        <p className="hero-reveal text-xs font-semibold uppercase tracking-[0.28em] text-[#72f7cf]">
          Cinematic Atlas For Creators
        </p>
        <h1 className="hero-reveal mx-auto mt-6 max-w-4xl font-display text-4xl leading-tight text-white md:text-6xl lg:text-7xl">
          Turn Every Journey Into a Story
        </h1>
        <p className="hero-reveal mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#b6c8db] md:text-lg">
          Voyagraph helps travel creators animate routes, style maps, and preview
          3D storytelling motion in minutes, without editing timelines by hand.
        </p>

        <div className="hero-reveal mt-9 flex flex-wrap items-center justify-center gap-3">
          <TrackedLink
            className="bg-[#72f7cf] text-[#04221f] hover:bg-[#8bfad9]"
            eventProps={{ location: "hero", target: "waitlist" }}
            href="/waitlist"
          >
            Join Waitlist
          </TrackedLink>
          <TrackedLink
            className="border border-white/25 text-white hover:bg-white/10"
            eventProps={{ location: "hero", target: "studio" }}
            href="/studio"
          >
            Open Studio Demo
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
