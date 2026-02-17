"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { TrackedLink } from "@/components/ui/tracked-link";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/maps", label: "Maps" },
  { href: "/models", label: "Models" },
  { href: "/plans", label: "Plans" },
  { href: "/hub", label: "Hub" },
  { href: "/about", label: "About" },
  { href: "/studio", label: "Studio" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071726]/80 backdrop-blur-lg">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="font-display text-2xl tracking-tight text-white" href="/">
          Voyagraph
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              className="text-sm font-medium text-[#bdd0e6] transition hover:text-white"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          <TrackedLink
            className="bg-[#72f7cf] text-[#04221f] hover:bg-[#8bfad9]"
            eventProps={{ location: "navbar", target: "waitlist" }}
            href="/waitlist"
          >
            Join Waitlist
          </TrackedLink>
        </nav>

        <button
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-white/10 bg-[#071726] px-4 py-4 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="space-y-2" aria-label="Mobile primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-[#bdd0e6] hover:bg-white/10 hover:text-white"
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <TrackedLink
            className="mt-2 w-full bg-[#72f7cf] text-center text-[#04221f]"
            eventProps={{ location: "mobile_nav", target: "waitlist" }}
            href="/waitlist"
            onClick={() => setOpen(false)}
          >
            Join Waitlist
          </TrackedLink>
        </nav>
      </div>
    </header>
  );
}
