import type { MetadataRoute } from "next";

import { runtimeEnv } from "@/lib/env";

const baseUrl = runtimeEnv.siteUrl || "https://voyagraph.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/maps",
    "/models",
    "/plans",
    "/about",
    "/download",
    "/studio",
    "/waitlist",
    "/hub",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
